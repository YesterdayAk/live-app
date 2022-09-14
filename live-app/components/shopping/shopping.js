// components/shopping/shopping.js
import get from "../../utils/request/get"
import post from "../../utils/request/post"
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showShopping: {
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
    },
    liveId: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    phoneHeight: app.globalData.phoneHeight,
    bottomDistance: app.globalData.bottomDistance,
    shoppingList: [], //购物车列表数据
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取购物车列表
    async getGoodsList() {
      await get({
        url: app.globalData.shoppingUrl + "/jeecg-boot/api/live/getGoodsListByLiveId",
        data: {
          otherLiveId: "1560451728069533697"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.setData({
            shoppingList: res.data.result
          })
        }
      })
    },
    onSelect(event) {
      console.log(event)
    },
    onClose() {
      this.triggerEvent('close')
    },
    onChange(event) {
      console.log(event.detail);
    },
  },
})