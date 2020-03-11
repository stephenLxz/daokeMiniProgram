//app.js
App({
  onLaunch: function() {
    // 隐藏tabbar
    wx.hideTabBar({})
    // 调用云数据库
    wx.cloud.init({
      env: 'daoke-9xl4v',
      traceUser: true,
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    /**
     * 利用云函数获取openid
     */
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        // console.log(res.result.openid)
        this.globalData.openid = res.result.openid;
      }
    })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.flag = true;
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    flag: false, // 登录状态
    openid: '', // 存储用户的openid
  }
})