// pages/replacement/replacement.js
import get from "../../utils/request/get"
import post from "../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caption: "验证旧手机", //默认标题名称
    phoneNumber: "", //手机号
    captcha: "", //验证码
    showCode: true, //默认显示获取旧手机验证码
    showNewCode: true, //默认显示获取新手机验证码
    timer: 59, //旧手机验证码倒计时
    newTimer: 59, //新手机验证码倒计时
    showNext: true, //默认显示下一步
    newPhoneNumber: "", //新手机号
    newCaptcha: "", //新验证码
  },

  onInput(e) {
    this.setData({
      phoneNumber: e.detail
    })
  },
  onNewInput(e) {
    this.setData({
      newPhoneNumber: e.detail
    })
  },

  //发送旧手机验证码
  sendSms() {
    console.log(this.data.phoneNumber)
    if (this.data.phoneNumber && (/(^[1][3,4,5,7,8,9][0-9]{9}$)/.test(this.data.phoneNumber))) {
      post({
        url: app.globalData.webUrl + '/jeecg-boot/sys/sms',
        data: {
          mobile: this.data.phoneNumber,
          smsmode: 0
        }
      }).then(res => {
        if (res.data.code == 200) {
          Toast({
            type: 'success',
            message: res.data.message,
          });
          this.setData({
            showCode: false,
          })
          let auth_timer = setInterval(() => {
            this.setData({
              timer: this.data.timer - 1
            })
            if (this.data.timer <= 0) {
              this.setData({
                timer: 59,
                showCode: true
              })
              clearInterval(auth_timer);
            }
          }, 1000);
        } else {
          Toast({
            type: 'fail',
            message: res.data.message,
          });
          return false;
        }
      })
    } else {
      Toast({
        type: 'fail',
        message: '手机号为空或格式错误',
      });
    }
  },
  //下一步
  replacementNext(e) {
    let obj = e.detail.value;
    console.log(obj)
    if (Object.values(obj).indexOf("") == -1) {
      this.setData({
        phoneNumber: e.detail.value.phoneNumber,
        captcha: e.detail.value.captcha
      })
      if (!(/(^[1][3,4,5,7,8,9][0-9]{9}$)/.test(this.data.phoneNumber))) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'error',
        })
      } else {
        this.checkCodeInfo()
      }

    } else {
      wx.showToast({
        title: '字段不能为空',
        icon: 'error',
      })
    }
  },

  //发送新手机验证码
  sendNewSms() {
    if (this.data.newPhoneNumber && (/(^[1][3,4,5,7,8,9][0-9]{9}$)/.test(this.data.newPhoneNumber))) {
      post({
        url: app.globalData.webUrl + '/jeecg-boot/sys/sms',
        data: {
          mobile: this.data.newPhoneNumber,
          smsmode: 0
        }
      }).then(res => {
        if (res.data.code == 200) {
          Toast({
            type: 'success',
            message: res.data.message,
          });
          this.setData({
            showNewCode: false,
          })
          let auth_timer = setInterval(() => {
            this.setData({
              newTimer: this.data.newTimer - 1
            })
            if (this.data.newTimer <= 0) {
              this.setData({
                newTimer: 59,
                showNewCode: true
              })
              clearInterval(auth_timer);
            }
          }, 1000);
        } else {
          Toast({
            type: 'fail',
            message: res.data.message,
          });
          return false;
        }
      })
    } else {
      Toast({
        type: 'fail',
        message: '手机号为空或格式错误',
      });
    }
  },

  //校验短信验证码是否失效
  checkCodeInfo() {
    get({
      url: app.globalData.webUrl + "/jeecg-boot/sys/checkCode",
      data: {
        phone: this.data.showNext ? this.data.phoneNumber : this.data.newPhoneNumber,
        smscode: this.data.showNext ? this.data.captcha : this.data.newCaptcha
      }
    }).then(res => {
      if (res.data.code == 200) {
        Toast({
          type: 'success',
          message: res.data.message,
        });
        if (this.data.showNext) {
          this.setData({
            showNext: false,
            caption: '设置新手机'
          })
        } else {
          this.confirm();
        }
      } else {
        Toast({
          type: 'fail',
          message: res.data.message,
        });
      }
    })
  },

  //确认更改
  replacementSubmit(e) {
    let obj = e.detail.value;
    if (Object.values(obj).indexOf("") == -1) {
      this.setData({
        newPhoneNumber: e.detail.value.newPhoneNumber,
        newCaptcha: e.detail.value.newCaptcha
      })

      if (!(/(^[1][3,4,5,7,8,9][0-9]{9}$)/.test(this.data.newPhoneNumber))) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'error',
        })
      } else {
        this.checkCodeInfo()
      }

    } else {
      wx.showToast({
        title: '字段不能为空',
        icon: 'error',
      })
    }
  },

  confirm() {
    get({
      url: app.globalData.webUrl + "/jeecg-boot/sys/replacePhone",
      data: {
        phone: this.data.newPhoneNumber,
        smscode: this.data.newCaptcha
      }

    }).then(res => {
      if (res.data.code == 200) {
        wx.navigateTo({
          url: '../login/login',
        })
      } else {
        Toast({
          type: 'fail',
          message: res.data.message,
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})