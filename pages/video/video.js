// pages/video/video.js
const db = wx.cloud.database();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,

    picshow: 'inherit', // 是否显示封面图片
    videoshow: 'none', // 是否显示视频界面
    content: 'none', // 是否显示简介内容
    catalog: 'inherit', // 是否显示目录内容 inherit
    comment: 'none', // 是否显示评论内容
    state: 1, // 用于区别简介与目录的选中状态
    selectIndex: '', // 判断哪个目录处于选中状态
    indexSrc: '../../res/images/css.png', // 前台图片的src
    src: "", // 前台视频的src
    btn: '收藏', // 收藏按钮
    id: "", // 接收index传递来的id
    disabled: '', // 用来禁用收藏按钮

    /** 接收数据库中传递过来的数据 */
    courseTitle: '', // 课程题目
    courseContent: '', // 课程内容介绍
    coursePeople: '', // 适用人群
    catalogTitle: [], // 目录名
    videoSrc: [], // 视频的src
    watchedNum: [], // 数组的长度代表已经观看的数量
    watchedObj: {}, // 存储所有的观看数据
    username: '', // 用户的用户名
    userimg: '', // 用户的头像

    /** 收藏页面用到的数据 */
    collects: [], // 用来存储被收藏的视频的标识
    collectTitles: [], // 用来存储被收藏的课程的题目
    progress: {}, // 用来存储视频观看的进度

    /** 历史记录用到的数据 */
    history: [], // 用来存储播放视频对应课程的id
    historyTitle: [], // 存储课程标题

    /** 标识 用于是否存在相应的数据库 */
    collectflag: false,
    progressflag: false,
    historyflag: false,
    commentflag: '', // 用于标识某用户是否在该课程评论过

    /** 评论区域用到的参数 */
    notice: 'flex',
    commentInputValue: '',
    initValue: '',
    date: '',

    /** 存储从数据库中查询出来的 */
    allname: [],
    allimg: [],
    allcomment: [],
    alldate: [],
  },

  /**
   * 点击评论按钮触发
   */
  submit: function(e) {
    clearTimeout(this.timeout);
    var that = this;
    var id = this.data.id;
    var commentInputValue = this.data.commentInputValue;
    var username = this.data.username;
    var userimg = this.data.userimg;
    var date = this.data.date;
    var commentflag = this.data.commentflag;
    var allname = [];
    var allimg = [];
    var allcomment = [];
    var alldate = [];
    // 当评论内容不为空时
    if (commentInputValue.trim().length != 0) {
      // 将数据存进数据库
      db.collection('comment').add({
        data: {
          username: username,
          userimg: userimg,
          commentInputValue: commentInputValue,
          date: util.formatDate(new Date()),
          commentflag: id
        }
      })
      // 通过不同的标识在数据库中查询出不同课程的所有评论
      this.timeout = setTimeout(function() {
        db.collection('comment').where({
          commentflag: id
        }).get({
          success: function(res) {
            res.data.forEach(function(item) {
              for (var i in item) {
                if (i == 'commentInputValue') {
                  allcomment.unshift(item[i])
                } else if (i == 'date') {
                  alldate.unshift(item[i])
                } else if (i == 'username') {
                  allname.unshift(item[i])
                } else if (i == 'userimg') {
                  allimg.unshift(item[i])
                }
                that.setData({
                  allcomment: allcomment,
                  alldate: alldate,
                  allname: allname,
                  allimg: allimg,
                  commentInputValue: '',
                  initValue: '', // 初始化输入框
                  notice: 'none', // 隐藏提醒内容
                })
              }
            })
          }
        })
      }, 100)
    }
  },

  /**
   * 评论框中输入内容时触发
   */
  commentInput: function(e) {
    this.setData({
      commentInputValue: e.detail.value
    })
  },

  /**
   * 播放视频时触发
   */
  videoPlay: function(e) {
    var id = this.data.id;
    var courseTitle = this.data.courseTitle;
    var history = this.data.history;
    var historyflag = this.data.historyflag;
    var historyTitle = this.data.historyTitle;
    let historyname = getApp().globalData.openid + 'history'; // 利用不同的openid将不同用户的数据存入不同的记录中
    // 判断数组中是否含有该id，如果存在将其删除后将其存为第一个；如果不存在将其存为第一个
    if (history.includes(id)) {
      // 获取对应的索引
      var index = history.findIndex((value) => value == id);
      // 利用索引将其删除
      history.splice(index, 1);
      historyTitle.splice(index, 1);
    }
    history.unshift(id);
    historyTitle.unshift(courseTitle);
    this.setData({
      history: history,
      historyTitle: historyTitle,
    });
    // 将数据存入数据库中
    if (historyflag) {
      db.collection('user').doc(historyname).update({
        data: {
          history: history,
          historyTitle: historyTitle,
        }
      })
    } else {
      db.collection('user').add({
        data: {
          _id: historyname,
          history: history,
          historyTitle: historyTitle,
          historyflag: true,
        }
      })
    }
  },

  /**
   * 视频播放到末尾时触发
   */
  videoEnd: function(e) {
    // 利用id区分不同课程的进度
    var id = this.data.id;
    // 获取selectIndex是为了判断该视频是否已经被观看过
    var selectIndex = this.data.selectIndex;
    var catalogTitle = this.data.catalogTitle;
    var watchedNum = this.data.watchedNum;
    var watchedObj = this.data.watchedObj;
    var progress = this.data.progress;
    var progressflag = this.data.progressflag;
    let progressname = getApp().globalData.openid + 'progress'; // 利用不同的openid将不同用户的数据存入不同的记录中
    // 当对象中含有该数组属性时
    if (watchedObj.hasOwnProperty(id)) {
      watchedNum = watchedObj[id];
    }
    // 判断数组中是否含有selectIndex，只有数组中不存在该值时才会存入数组
    if (!watchedNum.includes(selectIndex)) {
      // 每次播放到末尾向数组中添加相应的selectIndex
      watchedNum.push(selectIndex);
      // 计算观看进度，结果取整(需要乘100后取整，小数直接取整结果为零)
      var result = parseInt((watchedNum.length / catalogTitle.length) * 100);
      // 将结果存进对象中
      watchedObj[id] = watchedNum;
      progress[id] = result;
      this.setData({
        watchedNum: watchedNum,
        progress: progress,
      })
      // 将数据存入数据库中
      if (progressflag) {
        db.collection('user').doc(progressname).update({
          data: {
            watchedObj: watchedObj,
            progress: progress,
          }
        })
      } else {
        db.collection('user').add({
          data: {
            _id: progressname,
            watchedObj: watchedObj,
            progress: progress,
            progressflag: true,
          }
        })
      }

    }
  },

  /**
   * 视频收藏点击事件
   */
  btnCollect: function(e) {
    var id = this.data.id;
    var courseTitle = this.data.courseTitle;
    var collects = this.data.collects;
    var collectflag = this.data.collectflag;
    var collectTitles = this.data.collectTitles;
    let collectname = getApp().globalData.openid + 'collect'; // 利用不同的openid将不同用户的数据存入不同的记录中
    collects.push(id);
    collectTitles.push(courseTitle);
    // console.log(collects);
    this.setData({
      btn: '已收藏',
      disabled: 'disabled',
      collects: collects,
      collectTitles: collectTitles,
    })
    // 将数据存入数据库
    if (collectflag) {
      db.collection('user').doc(collectname).update({
        data: {
          collects: collects,
          collectTitles: collectTitles,
        }
      })
    } else {
      db.collection('user').add({
        data: {
          _id: collectname,
          collects: collects,
          collectTitles: collectTitles,
          collectflag: true,
        }
      })
    }
  },

  /**
   * 点击设置视频的src
   */
  selectSrc: function(e) {
    // 获取前台携带的index
    var index = e.currentTarget.dataset.index;
    var videoSrc = this.data.videoSrc;
    this.setData({
      src: videoSrc[index],
      picshow: 'none',
      videoshow: 'inherit',
      selectIndex: index,
    })
  },

  /**
   * 处理跳转简介
   */
  contentshow: function(e) {
    this.setData({
      content: 'inherit',
      catalog: 'none',
      comment: 'none',
      state: 0,
    })
  },

  /**
   * 处理跳转目录
   */
  catalogshow: function(e) {
    this.setData({
      content: 'none',
      catalog: 'inherit',
      comment: 'none',
      state: 1,
    })
  },

  /**
   * 处理跳转评论
   */
  commentshow: function(e) {
    this.setData({
      content: 'none',
      catalog: 'none',
      comment: 'block',
      state: 2,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
    })
    var that = this;
    var id = this.data.id;
    var indexSrc = this.data.indexSrc;
    // 使用字符串拼接将图片src更换
    indexSrc = '../../res/images/' + id + '.png';
    this.setData({
      indexSrc: indexSrc,
    })
    // 获取用户头像
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          userimg: res.userInfo.avatarUrl,
        })
      }
    })
    db.collection('videoInfo').doc(id).get({
      success: function(res) {
        var courseContent = res.data.courseContent;
        var coursePeople = res.data.coursePeople;
        // 数据库中转json时会将\n转为\\n，所以用正则表达式将其转回来
        courseContent = courseContent.replace(/\\n/g, "\n");
        coursePeople = coursePeople.replace(/\\n/g, "\n");
        that.setData({
          courseContent: courseContent,
          coursePeople: coursePeople,
          courseTitle: res.data.courseTitle,
          catalogTitle: res.data.catalogTitle,
          videoSrc: res.data.videoSrc,
        })
      }
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
    }, 2000)
    var id = this.data.id;
    let collectname = getApp().globalData.openid + 'collect'; // 利用不同的openid将不同用户的数据存入不同的记录中
    let progressname = getApp().globalData.openid + 'progress'; // 利用不同的openid将不同用户的数据存入不同的记录中
    let historyname = getApp().globalData.openid + 'history'; // 利用不同的openid将不同用户的数据存入不同的记录中
    let username = getApp().globalData.openid + 'userInfo'; // 利用不同的openid将不同用户的数据存入不同的记录中
    db.collection('user').doc(collectname).get({
      success: function(res) {
        that.setData({
          collects: res.data.collects,
          collectTitles: res.data.collectTitles,
          collectflag: res.data.collectflag,
        })
        var collects = res.data.collects;
        // 判断该教程是否被收藏
        if (collects.includes(id)) {
          // 将收藏按钮禁用
          that.setData({
            btn: '已收藏',
            disabled: 'disabled',
          })
        }
      }
    })

    db.collection('user').doc(progressname).get({
      success: function(res) {
        that.setData({
          // 将原有的进度数据传递过来
          watchedObj: res.data.watchedObj,
          progress: res.data.progress,
          progressflag: res.data.progressflag,
        })
      }
    })

    db.collection('user').doc(historyname).get({
      success: function(res) {
        that.setData({
          // 将原有的历史记录导入
          history: res.data.history,
          historyTitle: res.data.historyTitle,
          historyflag: res.data.historyflag,
        })
      }
    })

    db.collection('user').doc(username).get({
      success: function(res) {
        that.setData({
          username: res.data.username,
        })
      },
      fail: function(res) {
        wx.getUserInfo({
          success: function(res) {
            that.setData({
              username: res.userInfo.nickName
            })
          }
        })
      }
    })

    var allname = [];
    var allimg = [];
    var allcomment = [];
    var alldate = [];
    // 通过不同的标识在数据库中查询出不同课程的所有评论
    db.collection('comment').where({
      commentflag: id
    }).get({
      success: function(res) {
        res.data.forEach(function(item) {
          for (var i in item) {
            if (i == 'commentInputValue') {
              allcomment.unshift(item[i])
            } else if (i == 'date') {
              alldate.unshift(item[i])
            } else if (i == 'username') {
              allname.unshift(item[i])
            } else if (i == 'userimg') {
              allimg.unshift(item[i])
            }
            if (allcomment.length != 0) {
              that.setData({
                notice: 'none',
              })
            }
            that.setData({
              allcomment: allcomment,
              alldate: alldate,
              allname: allname,
              allimg: allimg,
            })
          }
        })
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