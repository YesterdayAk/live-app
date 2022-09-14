// 获取应用实例
import get from "../../utils/request/get"
import post from "../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();

Page({
  data: {
    auditLiveList: [], //审核列表
    pageNo: 1,
    pageSize: 10,
  },
  //获取审核中列表数据
  async getAuditLive() {
    await get({
      url: app.globalData.webUrl + "/jeecg-boot/live/api/listLive",
      data: {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
        status: 1, //审核中
      }
    }).then(res => {
      if (res.data.code == 200) {
        this.setData({
          auditLiveList: res.data.result.records
        })
      }
    })
  },
  getAuditDetail(e) {
    if (e.currentTarget.dataset.status == 2) {
      wx.navigateTo({
        url: './auditDetail/auditDetail?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAuditLive()
  },
})