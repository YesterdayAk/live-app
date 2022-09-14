// pages/mine/mine.js
import get from "../../utils/request/get"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    liveCountInfo: {}, //直播数量信息
  },
  //获取直播数量信息
  getMyLiveCount() {
    get({
      url: app.globalData.webUrl + "/jeecg-boot/live/api/getMyLiveCount"
    }).then(res => {
      if (res.data.code == 200) {
        this.setData({
          liveCountInfo: res.data.result
        })
      }
    })
  },
  //审核中
  getAudit() {
    wx.navigateTo({
      url: '../audit/audit',
    })
  },
  //待直播
  getAwait() {
    wx.navigateTo({
      url: './await/await',
    })
  },
  //往期直播
  getFinish() {
    wx.navigateTo({
      url: './finish/finish',
    })
  },
  //发起直播
  start() {
    wx.navigateTo({
      url: '../apply/apply',
    })
  },

    //管理员管理
    getManageInfo() {
      wx.navigateTo({
        url: '../manage/manage',
      })
    },

  //更换手机号
  getReplacement() {
    wx.navigateTo({
      url: '../replacement/replacement',
    })
  },
    //修改密码
    revisePassword() {
      wx.navigateTo({
        url: './revisePassword/revisePassword',
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
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
    this.getMyLiveCount()
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