// pages/live/live.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pushFlowAddress: "", //推流地址
    isFront: true, //默认显示前置摄像头
    liveForm: '0', //默认横屏直播形式
  },
  statechange(e) {
    console.log('e', e)
  },
  //切换前后摄像头
  switch () {
    let pusher = wx.createLivePusherContext('pusher')
    pusher.switchCamera({
      success() {
        this.setData({
          isFront: !this.data.isFront
        })
        console.log('enter full screen mode success!')
      },
      fail() {
        console.log('enter full screen mode failed!')
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pushFlowAddress = wx.getStorageSync('pushFlowAddress');
    this.setData({
      pushFlowAddress,
      liveForm: options.liveForm
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

    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    
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