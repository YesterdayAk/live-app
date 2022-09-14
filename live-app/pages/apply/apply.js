// pages/apply/apply.js
import get from "../../utils/request/get"
import post from "../../utils/request/post"
import Toast from '@vant/weapp/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveId: "", //直播id
    equipmentType: 2, //默认直播设备为电脑
    shapeType: 1, //默认直播形式为竖屏
    currentStartDate: "", //直播开始时间
    currentEndDate: "", //直播结束时间
    minDate: new Date().getTime(),
    maxDate: new Date(2022, 11, 31).getTime(),
    subjectValue: "", //直播主题
    describeValue: "", //直播描述
    pictureList: [], //图片数组
    liveMode: ["playBackFlag"], //附加直播方式
    imageTextLiveFlag: 0, //默认开启图文直播
    playBackFlag: 1, //默认开启直播回看
    interactMode: [], //直播互动方式
    luckDrawFlag: 0, //默认不开启抽奖
    luckBagFlag: 0, //默认不开启福袋
    videoList: [], //视频数组
    mode: 'dateTime'
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
        let newPictureList = [];
        newPictureList.push({
          pictureUrl: {
            result: res.data.result.cover
          },
          url: res.data.result.cover,
        })
        let newVideoList = [];
        newVideoList.push({
          videoUrl: {
            result: res.data.result.warmVideo
          },
          url: res.data.result.warmVideo,
        })
        this.setData({
          shapeType: res.data.result.liveForm,
          currentStartDate: res.data.result.startTime,
          currentEndDate: res.data.result.endTime,
          subjectValue: res.data.result.name,
          describeValue: res.data.result.introduce,
          pictureList: newPictureList,
          videoList: newVideoList
        })

        if (res.data.result.imageTextLiveFlag == 1 && res.data.result.playBackFlag == 1) {

          this.setData({
            liveMode: ['imageTextLiveFlag', 'playBackFlag']
          })
        } else if (res.data.result.imageTextLiveFlag == 1 && res.data.result.playBackFlag == 0) {
          this.setData({
            liveMode: ['imageTextLiveFlag']
          })
        } else if (res.data.result.imageTextLiveFlag == 0 && res.data.result.playBackFlag == 1) {
          this.setData({
            liveMode: ['playBackFlag']
          })
        } else {
          this.setData({
            liveMode: []
          })
        }

        if (res.data.result.luckDrawFlag == 1 && res.data.result.luckBagFlag == 1) {

          this.setData({
            interactMode: ['luckDrawFlag', 'luckBagFlag']
          })
        } else if (res.data.result.luckDrawFlag == 1 && res.data.result.luckBagFlag == 0) {
          this.setData({
            interactMode: ['luckDrawFlag']
          })
        } else if (res.data.result.luckDrawFlag == 0 && res.data.result.luckBagFlag == 1) {
          this.setData({
            interactMode: ['luckBagFlag']
          })
        } else {
          this.setData({
            interactMode: []
          })
        }

      }
    })
  },
  //切换电脑直播设备
  changeComputerEquipment() {
    // this.setData({
    //   equipmentType: 1
    // })
  },
  //切换手机直播设备
  changeMobileEquipment() {
    this.setData({
      equipmentType: 2
    })
  },

  //切换横屏直播形式
  changeLevelType() {
    this.setData({
      shapeType: 0
    })
  },
  //切换竖屏直播形式
  changeVerticalType() {
    this.setData({
      shapeType: 1
    })
  },
  onStartConfirm(event) {
    let time = new Date(event.detail);
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let currentStartDate = year + '年' + month + '月' + day + '日' + hour + '时' + minute + '分'
    this.setData({
      currentStartDate
    })
  },
  onEndConfirm(event) {
    let time = new Date(event.detail);
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    let currentEndDate = year + '年' + month + '月' + day + '日' + hour + '时' + minute + '分'
    this.setData({
      currentEndDate
    })
  },
  //选择直播开始时间
  onStartPicker(e) {
    this.setData({
      currentStartDate: e.detail.value
    })

  },
  //选择直播结束时间
  onEndPicker(e) {
    this.setData({
      currentEndDate: e.detail.value
    })
  },
  onSubjectValue(event) {
    this.setData({
      subjectValue: event.detail.value
    })
  },
  onDescribeValue(event) {
    this.setData({
      describeValue: event.detail.value
    })
  },
  //上传图片
  pictureRead(event) {
    let that = this;
    wx.showLoading({
      title: '上传中...'
    })
    const {
      file
    } = event.detail;
    wx.uploadFile({
      url: app.globalData.webUrl + "/jeecg-boot/sys/common/upload", //上传的服务器接口地址
      filePath: file.url,
      name: 'file',
      success(res) {
        //上传完成需要更新pictureList
        const data = JSON.parse(res.data);
        const {
          pictureList,
        } = that.data;
        pictureList.push({
          ...file,
          pictureUrl: data
        })
        that.setData({
          pictureList
        })
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
          icon: 'success',
        })
      },
      fail(err) {
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          icon: 'error',
        })
      }
    })
  },
  //删除图片
  pictureDelete() {
    this.setData({
      pictureList: []
    })
  },
  //上传视频
  videoRead(event) {
    let that = this;
    wx.showLoading({
      title: '上传中...'
    })
    const {
      file
    } = event.detail;
    wx.uploadFile({
      url: app.globalData.webUrl + "/jeecg-boot/sys/common/upload", //上传的服务器接口地址
      filePath: file.url,
      name: 'file',
      success(res) {
        //上传完成需要更新videoList
        const data = JSON.parse(res.data);
        const {
          videoList,
        } = that.data;
        videoList.push({
          ...file,
          videoUrl: data
        })
        that.setData({
          videoList
        })
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
          icon: 'success',
        })
      },
      fail(err) {
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          icon: 'error',
        })
      }
    })
  },
  //删除视频
  videoDelete() {
    this.setData({
      videoList: []
    })
  },
  //附加直播方式
  onChange(event) {
    console.log(event)
    this.setData({
      liveMode: event.detail
    })

    if (this.data.liveMode.length == 2) {
      this.setData({
        imageTextLiveFlag: 1,
        playBackFlag: 1,
      })
    } else if (this.data.liveMode.length == 1 && this.data.liveMode[0] == 'imageTextLiveFlag') {
      this.setData({
        imageTextLiveFlag: 1,
        playBackFlag: 0,
      })
    } else if (this.data.liveMode.length == 1 && this.data.liveMode[0] == 'playBackFlag') {
      this.setData({
        imageTextLiveFlag: 0,
        playBackFlag: 1,
      })
    } else {
      this.setData({
        imageTextLiveFlag: 0,
        playBackFlag: 0,
      })
    }
  },
  //直播互动方式
  onInteractChange(event) {
    this.setData({
      interactMode: event.detail
    })

    if (this.data.interactMode.length == 2) {
      this.setData({
        luckDrawFlag: 1,
        luckBagFlag: 1,
      })
    } else if (this.data.liveMode.length == 1 && this.data.liveMode[0] == 'luckDrawFlag') {
      this.setData({
        luckDrawFlag: 1,
        luckBagFlag: 0,
      })
    } else if (this.data.liveMode.length == 1 && this.data.liveMode[0] == 'luckBagFlag') {
      this.setData({
        luckDrawFlag: 0,
        luckBagFlag: 1,
      })
    } else {
      this.setData({
        luckDrawFlag: 0,
        luckBagFlag: 0,
      })
    }
  },
  //提交审核
  onSubmit(e) {
    let obj = e.detail.value;
    if (Object.values(obj).indexOf("") == -1) {
      this.setData({
        subjectValue: e.detail.value.subjectValue,
        describeValue: e.detail.value.describeValue,
      })


      if (this.data.pictureList.length && this.data.currentStartDate && this.data.currentEndDate) {
        if (new Date(this.data.currentEndDate.replace(/-/g, "/")) > new Date(this.data.currentStartDate.replace(/-/g, "/"))) {
          this.applySubmit()
        } else {
          Toast({
            message: "直播结束时间不能小于直播开始时间",
            className: "fail",
          });
        }
      } else {
        wx.showToast({
          title: '请填写完整',
          icon: 'error',
        })
      }

    } else {
      wx.showToast({
        title: '请填写完整',
        icon: 'error',
      })
    }
  },
  applySubmit() {
    post({
      url: this.data.liveId ? app.globalData.webUrl + "/jeecg-boot/live/api/edit" : app.globalData.webUrl + "/jeecg-boot/live/api/add",
      data: {
        id: this.data.liveId,
        liveForm: this.data.shapeType,
        startTime: this.data.currentStartDate,
        endTime: this.data.currentEndDate,
        name: this.data.subjectValue,
        introduce: this.data.describeValue,
        cover: this.data.pictureList[0].pictureUrl.result,
        imageTextLiveFlag: this.data.imageTextLiveFlag,
        playBackFlag: this.data.playBackFlag,
        luckDrawFlag: this.data.luckDrawFlag,
        luckBagFlag: this.data.luckBagFlag,
        warmVideo: this.data.videoList[0].videoUrl.result,
        chatFlag: "1", //开启聊天
        giveGiftFlag: "1", //开启礼物
        status: "2", //代表提交审核
      },
    }).then(res => {
      if (res.data.code == 200) {
        wx.redirectTo({
          url: '../audit/audit',
        })
      }
    })

  },
  cancel() {
    if (this.data.liveId) {
      wx.redirectTo({
        url: '../audit/auditDetail/auditDetail?id=' + this.data.liveId,
      })
    } else {
      wx.switchTab({
        url: '../mine/mine',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        liveId: options.id
      })
      this.getLiveInfo()
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})