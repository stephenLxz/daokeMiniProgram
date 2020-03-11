// pages/edit/edit.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    username: "", // 昵称
    userimg: "", // 头像
    usersex: "", // 性别 (0,1,2) 可作为选择器的索引
    sex: ['未知', '男', '女'], // 存储选择器内容
    schoolmsg: "", // 存储学校信息内容
    introduce: "", // 存储简介内容
    flag: false, // 设定一个标识判断用户是否修改过数据
  },

  /**
   * 昵称input处理
   */
  nameinput: function(e) {
    var username = e.detail.value;
    if (username.length > 10) {
      return;
    } else {
      this.setData({
        username: e.detail.value,
      })
    }
  },

  /**
   * 性别选择器函数
   */
  sexpicker: function(e) {
    this.setData({
      usersex: e.detail.value,
    })
  },

  /**
   * 学校信息input处理
   */
  schoolinput: function(e) {
    var schoolmsg = e.detail.value;
    if (schoolmsg > 20) {
      return;
    } else {
      this.setData({
        schoolmsg: e.detail.value,
      })
    }
  },

  /**
   * 个人简介textarea处理
   */
  introinput: function(e) {
    var introduce = e.detail.value;
    if (introduce > 80) {
      return;
    } else {
      this.setData({
        introduce: e.detail.value,
      })
    }
  },

  /**
   * 保存按钮触发的事件
   */
  save: function(e) {
    var that = this;
    var flag = this.data.flag;
    let name = getApp().globalData.openid + 'userInfo'; // 利用不同的openid将不同用户的数据存储在对应记录中
    // flag作为判断用户是否修改过资料的依据，如果修改过了则用update，如果没有修改过则用add，并且指定对应的_id
    if (flag) {
      db.collection('user').doc(name).update({
        data: {
          username: that.data.username,
          usersex: that.data.usersex,
          schoolmsg: that.data.schoolmsg,
          introduce: that.data.introduce,
        },
        // success: function(res) {
        //   console.log('edit数据更新成功')
        // }
      })
    } else {
      db.collection('user').add({
        // 如没有指定_id则自动生成一个_id
        data: {
          _id: name,
          username: that.data.username,
          usersex: that.data.usersex,
          schoolmsg: that.data.schoolmsg,
          introduce: that.data.introduce,
          flag: true, // 需将该标识存在数据库中，以便后续的判断
        },
        // success:function(res){
        //   console.log('数据添加成功')
        // }
      })
    }
    wx.switchTab({
      url: '/pages/user/user',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      username: options.username,
      userimg: options.userimg,
      usersex: options.usersex,
    })
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
    let name = getApp().globalData.openid + 'userInfo';
    db.collection('user').doc(name).get({
      success: function(res) {
        that.setData({
          username: res.data.username,
          usersex: res.data.usersex,
          schoolmsg: res.data.schoolmsg,
          introduce: res.data.introduce,
          flag: res.data.flag, // 从数据库中获取到标识
        })
        // console.log('edit数据获取成功')
      },
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