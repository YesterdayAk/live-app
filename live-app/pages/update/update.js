// pages/update/update.js
import get from "../../utils/request/get"
import post from "../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: "", //手机号
    captcha: "", //验证码
    showCode: true, //默认显示获取验证码
    timer: 59, //验证码倒计时
    showNext: true, //默认显示下一步
    updateForm: {
      password: "",
      passwordConfirm: "",
    }
  },
  onInput(e) {
    this.setData({
      phoneNumber: e.detail
    })
  },
  //发送验证码
  sendSms() {
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
  updateNext(e) {
    let obj = e.detail.value;
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
  //校验短信验证码是否失效
  checkCodeInfo() {
    get({
      url: app.globalData.webUrl + "/jeecg-boot/sys/checkCode",
      data: {
        phone: this.data.phoneNumber,
        smscode: this.data.captcha
      }
    }).then(res => {
      if (res.data.code == 200) {
        Toast({
          type: 'success',
          message: res.data.message,
        });
        this.setData({
          showNext: false,
        })
      } else {
        Toast({
          type: 'fail',
          message: res.data.message,
        });
      }
    })
  },
  //确认修改
  updateSubmit(e) {
    let obj = e.detail.value;
    if (Object.values(obj).indexOf("") == -1) {
      this.setData({
        updateForm: {
          password: e.detail.value.password,
          passwordConfirm: e.detail.value.passwordConfirm,
        }
      })
      if (this.data.updateForm.password != this.data.updateForm.passwordConfirm) {
        Toast({
          type: 'fail',
          message: '两次输入密码不一致',
        });
      } else {
        this.confirm()
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
      url: app.globalData.webUrl + "/jeecg-boot/sys/passwordChange",
      data: {
        password: this.data.updateForm.password,
        phone: this.data.phoneNumber,
        smscode: this.data.captcha
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