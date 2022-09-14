// components/brief/brief.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showBrief: {
      type: Boolean,
      value: false
    },
    movieHeight: {
      type: Number,
      value: 0
    },
    introduceHeight: {
      type: Number,
      value: 0
    },
    windowHeight: {
      type: Number,
      value: 0
    },
    liveInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    message: "",
    bottomDistance: app.globalData.bottomDistance,
    phoneHeight: app.globalData.phoneHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 防止滑动穿透
    touchMove() {
      return false;
    },
  }
})