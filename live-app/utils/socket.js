import {
  Base64
} from "js-base64"
const socket = {
  websocket: null,
  socket_open: false, //开启标识
  connectURL: "",
  hearbeat_timer: null, //心跳timer
  hearbeat_interval: 60000, //心跳发送频率
  is_reconnect: true, //是否自动重连
  reconnect_count: 5, //重连次数
  reconnect_current: 1, //已发起重连次数
  reconnect_number: 0, //网络错误提示
  reconnect_timer: null, //重连timer
  reconnect_interval: 5000, //重连频率

  init: (receiveMessage) => {
    socket.websocket = wx.connectSocket({
        url: socket.connectURL,
        success() {}
      }),
      socket.websocket.onMessage((res) => {
        //接收到消息
        if (receiveMessage) {
          receiveMessage(res)
        }
      })

    socket.websocket.onClose((res) => {
      console.log('Websocket连接关闭！')
      clearInterval(socket.hearbeat_interval);
      socket.socket_open = false;

      //需要重新连接
      if (socket.is_reconnect) {
        socket.reconnect_timer = setTimeout(() => {
          //超过重连次数
          if (socket.reconnect_current > socket.reconnect_count) {
            clearTimeout(socket.reconnect_timer)
            socket.is_reconnect = false;
            return
          }

          //记录重连次数
          socket.reconnect_current++
          socket.reconnect()
        }, socket.reconnect_interval)
      }
    })

    socket.websocket.onOpen(() => {
      console.log('Websocket连接成功')
      socket.socket_open = true
      socket.is_reconnect = true
      //开启心跳
      socket.heartbeat()
    })

    socket.websocket.onError(() => {})
  },

  send: (data, callback) => {
    //开启状态直接发送
    if (socket.websocket.readyState == socket.websocket.OPEN) {
      socket.websocket.send({
        data: JSON.stringify(data)
      })
      if (callback) {
        callback()
      }

      //正在开启状态，则等待1s后调用
    } else {
      clearInterval(socket.hearbeat_interval);
      if (socket.reconnect_number < 1) {
        socket.reconnect_number++
      }
    }
  },

  receive: (message) => {
    let params = Base64.decode(JSON.parse(message.data));
    params = JSON.parse(params);
    return params
  },

  heartbeat: () => {
    if (socket.hearbeat_timer) {
      clearInterval(socket.hearbeat_timer)
    }

    socket.hearbeat_timer = setInterval(() => {
      let data = {
        content: 'ping'
      }
      let sendData = {
        encryption_type: 'base64',
        data: Base64.encode(JSON.stringify(data))
      }
      socket.send(sendData)

    }, socket.hearbeat_interval)
  },

  close: () => {
    clearInterval(socket.hearbeat_interval);
    socket.is_reconnect = false;
    socket.websocket.close()
  },

  /**
   * 重新连接
   */

  reconnect: () => {
    if (socket.websocket && !socket.is_reconnect) {
      socket.close()
    }

    socket.init(null)
  }
}

export default socket