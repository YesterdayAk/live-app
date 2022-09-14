// components/present/present.js
import get from "../../utils/request/get"
import Toast from '@vant/weapp/toast/toast';
import socket from "../../utils/socket";
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPresent: {
      type: Boolean,
      value: false
    },
    movieHeight: {
      type: Number,
      value: 0
    },
    windowHeight: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    presentList: [], //礼物列表
    active: "", //默认没有选择礼物
    goldCoin: "", //金币
    phoneHeight: app.globalData.phoneHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取礼物列表数据
    getPresentInfo() {
      get({
        url: app.globalData.webUrl + "/jeecg-boot/gift/api/list"
      }).then(res => {
        if (res.data.code == 200) {
          this.setData({
            presentList: res.data.result
          })
        }
      }).then(() => {
        this.getMyCoin()
      })
    },
    //获取最新的金币
    getMyCoin() {
      get({
        url: app.globalData.webUrl + "/jeecg-boot/user/api/getMyGoldCoin"
      }).then(res => {
        if (res.data.code == 200) {
          this.setData({
            goldCoin: res.data.result
          })
        }
      })
    },
    // 防止滑动穿透
    touchMove() {
      return false;
    },
    //礼物切换
    getActiveInfo(e) {
      this.setData({
        active: e.currentTarget.dataset.id
      })
    },
    givePresent: app.globalData.throttle(function (e) {
      if (e.currentTarget.dataset.coin > this.data.goldCoin) {
        Toast({
          message: "金币不足！",
          className: "fail",
        });
        return false;
      }

      const opt = {
        giftId: e.currentTarget.dataset.id,
        pushType: "3",
      };
      socket.send(opt);
      // Toast({
      //   message: "赠送成功！",
      //   className: "success",
      // });
    }),

    //关闭礼物窗口
    onClose() {
      this.triggerEvent('close')
    },
  },
  ready() {
    const query = wx.createSelectorQuery().in(this)
    query.select('.present').boundingClientRect(rect => {}).exec()
  }
})