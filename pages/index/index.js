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

    /** 课程检索数据 */
    initvalue: '',
    contentshow: 'none', // 用于前台数据的显示
    arr: [], // 用于存储满足条件的数据
    courses: ['html', 'css', 'javascript', 'jquery', 'node', 'gulp', 'mongo', 'express'], // 存储课程的集合

    /** 数据加载的数据 */
    show: true
  },

  /**
   * input的相关处理
   */
  searchInput: function(e) {
    let that = this;
    var inputvalue = e.detail.value;
    var courses = this.data.courses;
    var arr = [];
    // 判断数据中的字符串是否含有该字符
    if (inputvalue.trim().length != 0) {
      // 当输入值不为空
      courses.forEach(str => {
        // 使用定时器能够提高用户体验以及性能
        return setTimeout(() => {
          if (str.search(inputvalue) != -1) {
            arr.push(str);
          }
          that.setData({
            arr: arr,
            contentshow: 'block'
          })
        }, 200)
      })
    }
    if (inputvalue.trim().length == 0) {
      // 当输入值为空时
      that.setData({
        arr: [],
        contentshow: 'none',
      })
    }
  },

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
    var that = this;
    this.timer = setTimeout(() => {
      that.setData({
        show: false,
      })
      wx.showTabBar({})
    }, 1000)

    // 将相关的数据初始化（dialog、搜索框的值）
    var initvalue = this.data.initvalue;
    this.setData({
      loginshow: false,
      initvalue: '',
      contentshow: 'none',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.hideTabBar({

    })
    this.setData({
      show: true,
    })
    clearTimeout(this.timer);
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