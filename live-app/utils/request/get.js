//微信小程序：wx.request get请求封装工具类
export default ({
  url,
  data
}) => {
  return new Promise((resolve, reject) => {
    let token = wx.getStorageSync('token');
    wx.request({
      url,
      data,
      header: {
        'content-type': 'application/json',
        'X-Access-Token': token
      },
      success(res) {
        if (res.data.code == 401) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请重新登录',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../login/login',
                })
              }
            }
          })
        }
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}