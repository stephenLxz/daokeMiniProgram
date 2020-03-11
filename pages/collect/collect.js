// pages/collect/collect.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    /* dialog相关设置 */
    btn: [{
      text: '前往登录'
    }], // 弹出窗口按钮选项
    loginshow: false,

    /* 被收藏课程的相关数据 */
    collects: [], // 接收所有被收藏的课程的标识
    collectTitles: [], // 接收所有被收藏的课程的标题
    progress: {}, // 用于存储所有课程的进度条
    noticeshow: 'flex', // 显示页面的提醒
    noticecontent: '您好，您未登录，请前往用户界面进行登录！', // 页面提醒的内容
  },

  /**
   * 点击时触发跳转到video页面
   */
  tovideo: function(e) {
    var flag = e.currentTarget.dataset.flag;
    wx.navigateTo({
      url: '../video/video?id=' + flag,
    })
  },

  /**
   * 弹窗函数处理 
   */
  tapdialog: function(e) {
    if (e.detail.index == 0) {
      wx.switchTab({
        url: '/pages/user/user',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    this.timer = setTimeout(() => {
      that.setData({
        show: false,
      })
      wx.showTabBar({})
    }, 1000)
    let collectname = getApp().globalData.openid + 'collect'; // 利用不同的openid将不同用户的数据存入不同的记录中
    let progressname = getApp().globalData.openid + 'progress'; // 利用不同的openid将不同用户的数据存入不同的记录中
    // 判断是否出现弹窗当没有登录的时候显示弹窗
    if (!getApp().globalData.flag) {
      this.setData({
        loginshow: true
      })
    } else {
      // 当登录了以后显示收藏的课程
      this.setData({
        loginshow: false
      })
      db.collection('user').doc(collectname).get({
        success: function(res) {
          // 当有收藏的课程时
          if (res.data.collects.length !== 0) {
            that.setData({
              noticeshow: 'none', // 关闭页面提醒
              collects: res.data.collects,
              collectTitles: res.data.collectTitles,
            })
          } else {
            that.setData({
              noticecontent: '您未收藏任何课程哦！'
            })
          }
        },
        fail: function(res) {
          that.setData({
            noticecontent: '您未收藏任何课程哦！'
          })
        }
      })

      db.collection('user').doc(progressname).get({
        success: function(res) {
          that.setData({
            progress: res.data.progress,
          })
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearTimeout(this.timer);
    this.setData({
      show: true,
    })
    wx.hideTabBar({

    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})