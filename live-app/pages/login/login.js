// pages/login/login.js
import get from "../../utils/request/get"
import post from "../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1, //默认账号登录
    loginWayList: [{
        id: 1,
        title: "账号登录"
      },
      {
        id: 2,
        title: "验证码登录"
      },
    ], //登录方式
    phoneNumber: "", //手机号
    password: "", //密码
    captcha: "", //验证码
    showCode: true, //默认显示获取验证码
    timer: 59, //验证码倒计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //登录方式
  getLoginWay(e) {
    this.setData({
      active: e.currentTarget.dataset.id
    })
  },
  //账号登录
  loginSubmit(e) {
    let obj = e.detail.value;
    if (Object.values(obj).indexOf("") == -1) {
      this.setData({
        phoneNumber: e.detail.value.phoneNumber,
        password: e.detail.value.password
      })
      if (!(/(^[1][3,4,5,7,8,9][0-9]{9}$)/.test(this.data.phoneNumber))) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'error',
        })
      } else {
        this.login()
      }

    } else {
      wx.showToast({
        title: '字段不能为空',
        icon: 'error',
      })
    }
  },
  login() {
    post({
      url: app.globalData.webUrl + "/jeecg-boot/sys/pLogin",
      data: {
        username: this.data.phoneNumber,
        password: this.data.password
      },
    }).then(res => {
      if (res.data.code == 200) {
        wx.setStorageSync('token', res.data.result.token)
        wx.setStorageSync('userInfo', res.data.result.userInfo)
        wx.switchTab({
          url: '/pages/home/home'
        })
      } else {
        Toast({
          type: 'fail',
          message: res.data.message,
        });
      }
    })
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
  //验证码登录
  loginCodeSubmit(e) {
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
        this.loginCode()
      }

    } else {
      wx.showToast({
        title: '字段不能为空',
        icon: 'error',
      })
    }
  },
  //获取验证码
  loginCode() {
    post({
      url: app.globalData.webUrl + "/jeecg-boot/sys/phoneLogin",
      data: {
        mobile: this.data.phoneNumber,
        captcha: this.data.captcha
      },
    }).then(res => {
      if (res.data.code == 200) {
        wx.setStorageSync('token', res.data.result.token)
        wx.setStorageSync('userInfo', res.data.result.userInfo)
        wx.switchTab({
          url: '/pages/home/home'
        })

      } else {
        Toast({
          type: 'fail',
          message: res.data.message,
        });
      }
    })
  },

  //忘记密码
  forgetPassword() {
    wx.navigateTo({
      url: '../update/update',
    })
  },

  //工会直播协议
  getAgreementInfo() {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
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