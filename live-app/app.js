// app.js
App({
  onLaunch() {
    //获取当前设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.bottomDistance = res.screenHeight - res.safeArea.bottom;
        //通过宽度/750,保留两位小数，计算出当前机型1rpx代表多少px,例如iphone5,1rpx=0.42px;
        this.globalData.phoneHeight = Math.floor(res.screenWidth / 750 * 100) / 100;
      },
      fail(err) {
        console.log(err)
      }
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })


    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  //设置监听器
  watch: function (ctx, obj) {
    Object.keys(obj).forEach(key => {
      this.observer(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  },
  // 监听属性，并执行监听函数
  observer: function (data, key, val, fn) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return val
      },
      set: function (newVal) {
        if (newVal === val) return
        fn && fn(newVal)
        val = newVal
      },
    })
  },
  globalData: {
    userInfo: null,
    // webUrl: "https://livephone.qdszgh.cn",
    webUrl: "https://testLivephone.qdszgh.cn",
    // webUrl: "http://192.168.0.112:3222",
    shoppingUrl: "https://chgyx.qdszgh.cn", //惠工优选商城接口
    windowHeight: "", //窗口高度
    bottomDistance: "", //底部距离
    phoneHeight: "", //当前机型1rpx代表多少px
    throttle(fn, gapTime) {
      if (gapTime == null || gapTime == undefined) {
        gapTime = 1000
      }
      let _lastTime = null
      return function (e) {
        let _nowTime = +new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
          fn.apply(this, arguments)
          _lastTime = _nowTime
        }
      }
    },
  }
})