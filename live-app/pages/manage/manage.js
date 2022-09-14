// pages/manage/manage.js
import get from "../../utils/request/get"
import post from "../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "", //搜索内容
    managerList: [], //管理员列表数据
    pageNo: 1,
    pageSize: 10,
    phone: "", //手机号
    total: "", //总数
  },

  //获取管理员列表数据
  async getManagerList() {
    await get({
      url: app.globalData.webUrl + "/jeecg-boot/api/livePermanentAdmin/list",
      data: {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
        phone: this.data.phone,
      }
    }).then(res => {
      if (res.data.code == 200) {
        this.setData({
          managerList: this.data.managerList.concat(res.data.result.records),
          total: res.data.result.total
        })
      }
    })
  },
  onSearch(event) {
    this.setData({
      pageNo: 1,
      managerList: [],
      phone: event.detail,
    })
    this.getManagerList()
  },


  //设置管理员
  setManager(e) {
    post({
      url: app.globalData.webUrl + "/jeecg-boot/api/livePermanentAdmin/edit",
      data: {
        permanentAdminUserId: e.currentTarget.dataset.userid,
        type: 1
      }
    }).then(res => {
      if (res.data.code == 200) {
        //尽量避免直接修改状态,可能会引发无法预计的后果
        let newList = [...this.data.managerList]
        newList[e.currentTarget.dataset.index].isAdmin = 1;
        this.setData({
          managerList: newList
        })
        wx.showToast({
          title: '设置管理员成功',
        })
      }
    })
  },
  //解除管理员
  removeManager(e) {
    post({
      url: app.globalData.webUrl + "/jeecg-boot/api/livePermanentAdmin/edit",
      data: {
        permanentAdminUserId: e.currentTarget.dataset.userid,
        type: 2
      }
    }).then(res => {
      if (res.data.code == 200) {
        //尽量避免直接修改状态,可能会引发无法预计的后果
        let newList = [...this.data.managerList]
        newList[e.currentTarget.dataset.index].isAdmin = 0;
        this.setData({
          managerList: newList
        })
        wx.showToast({
          title: '解除管理员成功',
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getManagerList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
    if (this.data.managerList.length < this.data.total) {
      this.setData({
        pageNo: this.data.pageNo + 1
      })
      this.getManagerList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})