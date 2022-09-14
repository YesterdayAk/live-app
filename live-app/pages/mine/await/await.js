// pages/mine/await/await.js
import get from "../../../utils/request/get"
import post from "../../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    awaitLiveList: [], //往期直播列表
    pageNo: 1,
    pageSize: 10,
  },

  //获取待直播列表数据
  async getAwaitLive() {
    await get({
      url: app.globalData.webUrl + "/jeecg-boot/live/api/listLive",
      data: {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
        status: 2, //待直播
      }
    }).then(res => {
      if (res.data.code == 200) {
        this.setData({
          awaitLiveList: res.data.result.records
        })
      }
    })
  },
  getLiveDetail(e) {
    wx.navigateTo({
      url: '../../detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAwaitLive()
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