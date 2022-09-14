// pages/landscape/landscape.js
import get from "../../utils/request/get"
import post from "../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
import socket from "../../utils/socket";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveId: "", //直播id
    liveInfo: {}, //直播信息
    message: "", //评论信息
    commentList: [], //评论列表
    emojiShow: false, //默认不显示表情
    keyboardHeight: "", //键盘高度
    toolViewHeight: '',
    cursor: 0,
    scrollTop: '50',
    emojiSource: 'https://res1.qdszgh.cn/%E9%B8%BF%E9%9B%81%E8%9E%8D%E7%9B%B4%E6%92%AD/emoji.png',
    lineHeight: 24,
    parsedMessage: [], //表情数组
    showBrief: false, //默认不显示直播简介
    showShopping: false, //默认不显示购物车
    showPresent: false, //默认不显示礼物列表
    showMore: false, //默认不显示更多操作
    bottomDistance: app.globalData.bottomDistance,
    windowHeight: app.globalData.windowHeight,
    likeCount: 0, //点赞数量
    transitionLikeCount: "", //点赞数量转换单位
    connectCount: 20, //连麦数量
    givePresentList: [], //赠送礼物列表
    showAccess: false, //默认不显示滑入
    goodsHeight: "", //商品链接高度
    showGoods: false, //默认不显示商品链接
    timer: 59, //默认商品链接显示时开启倒计时
    goodsInfo: {}, //商品信息
    movieHeight: "", //直播高度
    introduceHeight: "", //介绍高度
    sendHeight: "", //发送栏高度
    phoneHeight: app.globalData.phoneHeight,
    commentHeight: "", //评论列表未显示键盘、表情、商品链接高度
    cartInfo: {
      isCart: false, //默认不显示小黄车
    },
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
          liveInfo: res.data.result,
          likeCount: res.data.result.fabulous,
          transitionLikeCount: this.handleLikeNum(this.data.likeCount)
        })
      }
    })
  },
  //切换直播简介
  switchLiveBrief() {
    this.setData({
      showBrief: !this.data.showBrief
    })
  },
  statechange(e) {},
  error(e) {},
  //失去焦点
  onBlur(e) {
    this.setData({
      keyboardHeight: 0,
      cursor: e.detail.cursor || 0,
    })
  },
  //评论信息
  onInput(e) {
    this.setData({
      message: e.detail.value
    })
  },
  // 监听键盘高度变化
  onkeyboardHeightChange(e) {
    const that = this

    that.setData({
      keyboardHeight: e.detail.height * (1 / that.data.phoneHeight),
    })
    if (e.detail.height) {
      that.setData({
        emojiShow: false,
        toolViewHeight: 0
      })
    }
  },
  //显示表情
  showEmoji() {
    this.setData({
      emojiShow: !this.data.emojiShow,
      toolViewHeight: !this.data.emojiShow ? 150 * (1 / this.data.phoneHeight) : 0
    })
    this.pageUp()
  },
  //页面上推
  pageUp() {
    const that = this;
    let query = wx.createSelectorQuery();
    query.selectAll('.comment_list').boundingClientRect((rect) => {
      that.setData({
        scrollTop: (rect[0].height * (1 / that.data.phoneHeight) / 2) + that.data.toolViewHeight / 2 + that.data.goodsHeight / 2
        // scrollTop: (rect[0].height * (1 / that.data.phoneHeight) / 2)
      })

    }).exec()
  },
  //插入表情
  insertEmoji(evt) {
    const emotionName = evt.detail.emotionName
    const {
      cursor,
      message
    } = this.data
    const newMessage =
      message.slice(0, cursor) + emotionName + message.slice(cursor)
    this.setData({
      message: newMessage,
      cursor: cursor + emotionName.length
    })
  },
  //发送信息
  sendMessage() {
    this.setData({
      parsedMessage: this.parseEmoji(this.data.message),
    })

    if (this.data.message) {
      this.quene(this.data.parsedMessage)
    } else {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //队列添加消息
  async quene(parsedMessage) {
    const opt = {
      message: parsedMessage,
      pushType: '0',
      messageType: "0"
    }
    Toast.loading({
      duration: 0, // 持续展示 toast
      message: "发送中...",
      forbidClick: true,
    });
    socket.send(opt);
  },
  addTimeOut(opt) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.addComment(opt);
        resolve('success')
      }, 500)
    })
  },
  //添加评论，如果超过150条就将前50条删除
  addComment(data) {
    if (this.data.commentList.length >= 150) {
      this.setData({
        commentList: this.data.commentList.splice(0, 50)
      })

    }
    // this.data.commentList.push(data)
    // this.setData({
    //   commentList: this.data.commentList
    // })
    //尽量避免直接修改状态,可能会引发无法预计的后果
    let newList = [...this.data.commentList]
    newList.push(data)
    this.setData({
      commentList: newList,
      message: "",
    })
    wx.setStorageSync('commentList', this.data.commentList)
    Toast.clear();
    wx.nextTick(() => {
      this.scrollBottom()
    })
  },
  //获取评论信息
  getCommentInfo() {
    let commentList = wx.getStorageSync('commentList');
    if (commentList.length) {
      this.setData({
        commentList
      })
    } else {
      this.getHistoryInfo()
    }

    this.scrollBottom()
  },

  //获取历史评论信息
  async getHistoryInfo() {
    await get({
        url: app.globalData.webUrl + "/jeecg-boot/live/api/getListNewMessage",
        data: {
          liveId: this.data.liveId
        }
      })
      .then((res) => {
        if (res.data.code == 200) {
          let newList = [];
          newList = res.data.result.records.map((item) => {
            item.message = JSON.parse(item.message)
            return item
          })
          this.setData({
            commentList: newList
          })
        }
      });
  },
  //滚动到底部
  scrollBottom() {
    this.setData({
      toView: 'toView'
    })

  },

  //消息接收
  async receiveMessage(message) {
    // const param = JSON.parse(Base64.decode(message.data));
    const param = JSON.parse(message.data);
    // 处理 赋值问题
    const params = JSON.parse(JSON.stringify(param));

    if (params.pushType == '0') {
      const opt = {
        id: Date.now(),
        avatar: params.avatar,
        avatar: params.avatar,
        handlerName: params.handlerName,
        liveId: params.liveId,
        message: params.messageType == '0' ? JSON.parse(params.message) : params.message,
        messageType: params.messageType,
        pushType: params.pushType,
        realname: params.realname,
      }
      await this.addTimeOut(opt)
    } else if (params.pushType == '3') {
      const pre = {
        id: Date.now(),
        avatar: params.avatar,
        handlerName: params.handlerName,
        icon: params.icon,
        liveId: params.liveId,
        name: params.name,
        pushType: params.pushType,
        realname: params.realname,
        sendMessageType: params.sendMessageType,
        swf: params.swf,
      };
      await this.closeGift(pre);
      await this.getPresentList(pre);
    } else if (params.pushType == "6") {
      this.setData({
        showGoods: true,
        goodsInfo: params
      })
    } else if (params.pushType == "7") {
      this.setData({
        cartInfo: {
          isCart: true
        }
      })
    }
  },
  //直播点赞
  clickHandler() {
    this.setData({
      likeCount: this.data.likeCount + 1
    });
    const opt = {
      pushType: "9",
    };
    socket.send(opt);
    this.setData({
      transitionLikeCount: this.handleLikeNum(this.data.likeCount)
    })

  },

  //直播点赞数量转换
  handleLikeNum(num) {
    if (num <= 999) {
      num = ''
    } else if (num > 999 && num <= 9999) {
      num = parseInt(num / 1000)
      num = parseInt(num) + '千'
    } else if (num > 9999 && num <= 9999999) {
      num = parseInt(num / 10000)
      num = parseInt(num) + '万'
    } else if (num > 9999999) {
      num = parseInt(num / 10000000)
      num = parseInt(num) + '千万'
    }
    return num
  },

  //连麦
  connectMike() {
    wx.showToast({
      title: '已申请连麦',
      icon: 'none',
      duration: 2000
    })
  },
  //获取购物车信息
  getShoppingInfo() {
    this.setData({
      showShopping: true,
    })
    const shoppingList = this.selectComponent('.shopping_list');
    shoppingList.getGoodsList()
  },
  //关闭购物车
  async closeShopping() {
    await this.setData({
      showShopping: false
    })
  },
  //获取礼物列表
  getGiftInfo() {
    this.setData({
      showPresent: true
    })
    const presentList = this.selectComponent('.present_list');
    presentList.getPresentInfo()
  },
  //获取赠送礼物列表数据
  getPresentList(pre) {
    this.setData({
      givePresentList: []
    })
    //尽量避免直接修改状态,可能会引发无法预计的后果
    let newList = [...this.data.givePresentList]
    newList.push(pre)
    this.setData({
      givePresentList: newList,
      showAccess: true
    })
    Toast({
      message: "赠送成功！",
      className: "success",
    });
  },
  //关闭礼物列表
  async closeGift(pre) {
    await this.setData({
      showPresent: false
    })
    if (pre.id) {
      await this.addTimeOut(pre)
    }
  },
  //更多操作
  getMoreInfo() {
    this.setData({
      showMore: true
    })
  },

  onClose() {
    this.setData({
      showMore: false
    })
  },

  //获取商品链接高度
  getGoodsHeight() {
    return new Promise((resolve, reject) => {
      const that = this;
      let query = wx.createSelectorQuery();
      query.selectAll('.goods').boundingClientRect((rect) => {
        that.setData({
          goodsHeight: rect[0].height * (1 / that.data.phoneHeight)
        })

      }).exec()
      that.pageUp()
      resolve("success");

    })
  },
  //获取元素节点高度
  getElementHeight() {
    return new Promise((resolve, reject) => {
      const that = this;
      let query = wx.createSelectorQuery();
      //获取直播高度
      query.selectAll('.movie').boundingClientRect((rect) => {
        that.setData({
          movieHeight: rect[0].height * (1 / that.data.phoneHeight)
        })
      }).exec()

      //获取直播介绍高度
      query.selectAll('.introduceBox').boundingClientRect((rect) => {
        that.setData({
          introduceHeight: rect[0].height * (1 / that.data.phoneHeight)
        })
      }).exec()

      //获取直播发送栏高度
      query.selectAll('.reply_wrp').boundingClientRect((rect) => {
        that.setData({
          sendHeight: rect[0].height * (1 / that.data.phoneHeight)
        })
      }).exec()

      setTimeout(() => {
        let {
          windowHeight,
          phoneHeight,
          movieHeight,
          introduceHeight,
          sendHeight
        } = that.data;
        that.setData({
          commentHeight: windowHeight * (1 / phoneHeight) - movieHeight - introduceHeight - sendHeight
        })
        that.getCommentInfo()
      }, 500)
      resolve("success");

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        windowHeight: app.globalData.windowHeight,
        // windowHeight: app.globalData.windowHeight + 48 + this.data.bottomDistance,
        liveId: options.id
      })
      this.getLiveInfo();
    }
    const emojiInstance = this.selectComponent('.mp-emoji');
    this.parseEmoji = emojiInstance.parseEmoji
    this.getElementHeight()
    let userInfo = wx.getStorageSync('userInfo');
    socket.connectURL = "wss://websocket.qdszgh.cn:8443/jeecg-boot/testLiveWebsocket/" + this.data.liveId + "/" + userInfo.id
    socket.init(this.receiveMessage);
    //调用监听器，监听数据变化
    app.watch(this, {
      givePresentList: (val) => {
        if (val.length) {
          setTimeout(() => {
            this.setData({
              showAccess: false
            })
          }, 2000);
        }
      }
    })

    app.watch(this, {
      showGoods: (val) => {
        if (val) {
          let auth_timer = setInterval(() => {
            this.setData({
              timer: this.data.timer - 1
            })
            if (this.data.timer == 0) {
              this.setData({
                showGoods: false,
                goodsHeight: 0
              })
              clearInterval(auth_timer);
            }
          }, 1000);

          setTimeout(() => {
            this.getGoodsHeight()
          }, 0)

        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})