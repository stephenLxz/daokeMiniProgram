// pages/user/user.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    displaybtn: '', // 是否展示授权按钮
    displayview: '', // 显示个人信息
    username: "", // 存储用户名
    userimg: "", // 存储用户头像
    usersex: "", // 存储用户性别

    /* dialog相关设置 */
    btn: [{
      text: '确定'
    }], // 弹出窗口按钮选项
    loginshow: false,
  },

  /**
   * 跳转历史记录处理
   */
  tohistory: function(e) {
    if (getApp().globalData.flag) {
      wx.navigateTo({
        url: '../history/history',
      })
    } else {
      this.setData({
        loginshow: true,
      })
    }
  },

  /**
   * 跳转笔记处理
   */
  tonote: function(e) {
    if (getApp().globalData.flag) {
      wx.navigateTo({
        url: '../note/note',
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
    this.setData({
      loginshow: false,
    })
  },

  /**
   * 获取用户信息
   */
  bindGetUserInfo(e) {
    this.onLoad(); // 当授权了以后再重新加载页面
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getOpenid();
    var that = this;
    //获取用户信息
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo;
        var nickName = userInfo.nickName;
        var avatarUrl = userInfo.avatarUrl;
        var gender = userInfo.gender;
        that.setData({
          userimg: avatarUrl,
          username: nickName,
          usersex: gender,
          displaybtn: 'none',
          displayview: 'inherit',
        });
        getApp().globalData.flag = true;
        that.onShow();
      },
      fail: function(res) {
        that.setData({
          displaybtn: 'inline',
          displayview: 'none',
        })
      }
    });

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
    let name = getApp().globalData.openid + 'userInfo';
    db.collection('user').doc(name).get({
      success: function(res) {
        that.setData({
          username: res.data.username,
          usersex: res.data.usersex,
        })
        // console.log('user数据获取成功')
      },
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