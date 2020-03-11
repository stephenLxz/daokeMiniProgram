//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /* 轮播图部分数据 */
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    circular: true, //是否采用衔接滑动
    vertical: false, //滑动方向是否为纵向
    interval: 3500, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    imgurl: [
      '../../res/images/express.png',
      '../../res/images/javascript.png',
      '../../res/images/gulp.png',
      '../../res/images/html.png',
      '../../res/images/jquery.png',
    ],
    imgflag: ['express', 'javascript', 'gulp', 'html', 'jquery'], // 存储图片的标识

    /* dialog相关设置 */
    btn: [{
      text: '前往登录'
    }], // 弹出窗口按钮选项
    loginshow: false,

  
  },

  /**
   * searchbar组件的相关处理
   */
  

  /**
   * 跳转到视频播放
   */
  tovideo: function(e) {
    // flag为前台传递来的标识（html\css...)
    var flag = e.currentTarget.dataset.flag;
    if (getApp().globalData.flag) {
      wx.navigateTo({
        url: '../video/video?id=' + flag,
      })
    } else {
      this.setData({
        loginshow: true,
      })
    }
  },

  /**
   * 弹出函数处理
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
    this.setData({
      loginshow: false,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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