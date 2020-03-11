// pages/note/note.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 记录的相关数据
    titlevalue: "", // 用于初始化记录标题
    textvalue: "", // 用于初始化记录内容
    titlecontent: "", // 用于存储任意时刻记录标题的内容
    textcontent: "", // 用于存储任意时刻记录内容的内容
    num: [], // 笔记总数量数组
    titles: [], // 存储所有的标题数量
    texts: [], // 存储所有记录内容
    flagindex: "", // 存储被点击的内容的索引

    // dialog的相关数据
    nums: "", // 用于传递被点击的索引
    btn: [{
      text: '确定'
    }], // 弹出窗口按钮选项
    choose: [{
      text: '取消'
    }, {
      text: '删除'
    }], // 弹出窗口按钮选项
    contentshow: false,
    numshow: false,
    noteshow: false,
    warmshow: false,
    deleteflag: false, // 是否删除笔记

    flag: false, // // 设定一个标识判断用户是否记录过笔记
  },

  /**
   * 记录按钮触发事件
   */
  record: function(e) {
    // 获取输入框中的内容
    var titlecontent = this.data.titlecontent;
    var textcontent = this.data.textcontent;
    if (titlecontent.trim().length == 0 || textcontent.trim().length == 0) {
      // 当标题为空或者内容为空时,触发dialog
      this.setData({
        contentshow: true
      })
    } else {
      var num = this.data.num;
      var titles = this.data.titles;
      var texts = this.data.texts;
      var flag = this.data.flag;
      let name = getApp().globalData.openid + 'noteInfo'; // 利用不同的openid将不同用户的数据存入不同的记录中
      // 将获取到的内容存入数组
      titles.unshift(titlecontent);
      texts.unshift(textcontent);
      // 笔记总数量数组，每多一条笔记，数组长度加一
      num.push(Math.random());
      this.setData({
        titlecontent: "", // 清空标题的值
        textcontent: "", // 清空内容的值
        titlevalue: "", // 清空标题
        textvalue: "", // 清空内容
        num: num,
        titles: titles,
        texts: texts,
      });
      // 将数据存入数据库中,当没有记录过笔记时在数据库中添加一个新的记录，若记录过笔记；则在数据库中更新此记录
      if (flag) {
        db.collection('user').doc(name).update({
          data: {
            num: num,
            titles: titles,
            texts: texts,
          },
          // success: function(res) {
          //   console.log('note数据更新成功')
          // }
        })
      } else {
        db.collection('user').add({
          data: {
            _id: name,
            num: num,
            titles: titles,
            texts: texts,
            flag: true, // 需将该标识存在数据库中，以便后续的判断
          },
          // success: function(res) {
          //   console.log('note数据添加成功');
          // }
        })
      }
    }
  },

  /**
   * input输入框处理
   */
  titleinput: function(e) {
    var titlecontent = e.detail.value;
    this.setData({
      titlecontent: titlecontent,
    })
  },

  /**
   * textarea输入框处理
   */
  textinput: function(e) {
    var textscontent = e.detail.value;
    this.setData({
      textcontent: textscontent
    })
  },

  /**
   * 弹出窗口的函数
   */
  tapdialog: function(e) {
    this.setData({ //关闭弹出窗口
      contentshow: false,
      numshow: false,
      noteshow: false,
    })
  },
  deletedialog: function(e) {
    // 当点击的dialog是 "删除"时触发
    if (e.detail.index == 1) {
      this.setData({
        deleteflag: true,
      })
      // 触发确定删除事件
      this.sDelete();
    }
    this.setData({
      warnshow: false,
    })
  },

  /**
   * 显示笔记详情功能
   */
  shownote: function(e) {
    var nums = e.currentTarget.dataset.index;
    this.setData({
      noteshow: true,
      nums: nums,
    })
  },

  /**
   * 删除笔记功能
   */
  deletenote: function(e) {
    var flagindex = e.currentTarget.dataset.index;
    this.setData({
      warnshow: true,
      flagindex: flagindex,
    });
  },

  /**
   * 确定删除事件
   */
  sDelete: function(e) {
    var deleteflag = this.data.deleteflag;
    if (deleteflag) {
      // 获取要处理的数据
      var num = this.data.num;
      var titles = this.data.titles;
      var texts = this.data.texts;
      var index = this.data.flagindex;
      let name = getApp().globalData.openid + 'noteInfo'; // 利用不同的openid将不同用户的数据存入不同的记录中
      // 对相应数据进行删除操作
      num.splice(index, 1);
      titles.splice(index, 1);
      texts.splice(index, 1);
      this.setData({
        num: num,
        titles: titles,
        texts: texts,
        deleteflag: false, // 对flag进行还原
      })

      // 将数据存入数据库中
      db.collection('user').doc(name).update({
        data: {
          num: num,
          titles: titles,
          texts: texts,
        },
        // success: function(res) {
        //   console.log('note数据更新成功')
        // }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //用于清除storage中的数据
    // wx.clearStorage()
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
    let name = getApp().globalData.openid + 'noteInfo'; // 利用不同的openid将不同用户的数据存入不同的记录中
    db.collection('user').doc(name).get({
      success: function(res) {
        that.setData({
          num: res.data.num,
          titles: res.data.titles,
          texts: res.data.texts,
          flag: res.data.flag,
        })
      }
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