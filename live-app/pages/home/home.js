// 获取应用实例
import get from "../../utils/request/get"
import post from "../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();

Page({
  data: {
    startLiveList: [], //开播列表
    pageNo: 1,
    pageSize: 10,
  },
  //获取开播数据
  getStartLive() {
    get({
      url: app.globalData.webUrl + "/jeecg-boot/live/api/beginShowLiveList",
      data: {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
      }
    }).then(res => {
      if (res.data.code == 200) {
        this.setData({
          startLiveList: res.data.result
        })
      }
    })
  },
  getLiveDetail(e) {
    let liveInfo = e.currentTarget.dataset.liveinfo;
    wx.navigateTo({
      url: '../detail/detail?id=' + liveInfo.id
    })
    // if (liveInfo.liveState == 1) {
    //   wx.navigateTo({
    //     url: '../detail/detail?id=' + liveInfo.id
    //   })
    // } else {
    //   switch (liveInfo.liveForm) {
    //     case "0":
    //       wx.navigateTo({
    //         url: '../landscape/landscape?id=' + liveInfo.id
    //       })
    //       break;

    //     case "1":
    //       wx.navigateTo({
    //         url: '../audience/audience?id=' + liveInfo.id
    //       })
    //       break;

    //     default:
    //       break;
    //   }
    // }
  },
  onShow() {
    this.getStartLive()
  }

})