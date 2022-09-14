// pages/audit/auditDetail/auditDetail.js
import get from "../../../utils/request/get"
import post from "../../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveId: "",
    liveInfo: {},
  },
  //获取直播信息

  getLiveInfo() {
    get({
      url: app.globalData.webUrl + "/jeecg-boot/live/api/getLive",
      data: {
        liveId: this.data.liveId
      }
    }).then(res => {
      if (res.data.code == 200) {
        this.setData({
          liveInfo: res.data.result
        })
      }
    })
  },

  //审核修改
  getReviseInfo() {
    wx.navigateTo({
      url: '../../apply/apply?id=' + this.data.liveId,
    })
  },
  //撤销审核
  revocationApply() {
    get({
      url: app.globalData.webUrl + "/jeecg-boot/live/api/revokeExamine",
      data: {
        liveId: this.data.liveId
      }
    }).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.message,
        })
        wx.redirectTo({
          url: '../../audit/audit',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      liveId: options.id
    })
    this.getLiveInfo()
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