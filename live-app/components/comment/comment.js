// components/comment/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentMessage: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: 0,
    commentList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取父组件输入框传递的值
    getCommentMessage() {
      this.quene(this.data.commentMessage)
    },
    //队列添加消息
    async quene(commentMessage) {
      const opt = {
        id: new Date(),
        name: "张三",
        message: this.data.commentMessage,
      }
      this.addTimeOut(opt)
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
      this.data.commentList.push(data)
      this.setData({
        commentList: this.data.commentList
      })
      wx.nextTick(() => {
        this.scrollBottom()
      })
    },
    //获取评论信息
    getCommentInfo() {
      this.scrollBottom()
    },
    //滚动到底部
    scrollBottom() {
      this.setData({
        toView: 'toView'
      })
    }
  }
})