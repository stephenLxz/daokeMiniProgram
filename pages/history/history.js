const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    history: [], // 存储播放课程的标识
    historyTitle: [], // 存储播放课程的标识
    noticeshow: 'flex', // 显示页面的提醒
    noticecontent: '您还没有播放任何视频哦！', // 页面提醒的内容
  },

  /**
   * 点击历史记录时触发
   */
  tovideo: function(e) {
    var flag = e.currentTarget.dataset.flag;
    wx.navigateTo({
      url: '../video/video?id=' + flag,
    })
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
    }, 800)
    let name = getApp().globalData.openid + 'history';
    db.collection('user').doc(name).get({
      success: function(res) {
        // 判断历史记录是否为空
        if (res.data.history.length != 0) {
          that.setData({
            noticeshow: 'none', // 关闭页面提醒
            history: res.data.history,
            historyTitle: res.data.historyTitle,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearTimeout(this.timer);
    this.setData({
      show: true,
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