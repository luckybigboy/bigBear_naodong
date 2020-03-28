// pages/index/comment-list/comment-list.js
var app = getApp();
var md5 = require('../../../utils/md5.js');
var date = require('../../../utils/formatdate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundImg: 'http://img1.imgtn.bdimg.com/it/u=1393987749,3422146058&fm=26&gp=0.jpg',
    starType: false, //关注的星星
    article: {},//楼层文章信息
    textarea: '',
    page: 1,
    page_size: 10,
    commentList: [
    ],
    replyList: [],
    comment_index: 0,
    reply_index: 0,
    replyType: true,
    commentType: '',
    commentTip: '添加你的评论...',
    hidden: false,
    focus: false,
    barHeight: 0,
    scrollHeight: 0,
    footNav1: [
      { name: "删除", color: '#D0021B' },
      { name: "回复" }
    ],
    footNav2: [
      { name: "嘲讽 / 不友善内容" },
      { name: "侮辱谩骂骚扰" },
      { name: "淫秽色情信息" },
      { name: "违法有害信息" },
      { name: "政治敏感" }
    ],
    sign: null,
    author: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let param = JSON.parse(options.param);
    this.setData({
      backgroundImg: param.article_image,
      article: param,
      sign: param.sign
    })
    let params = {
      article_id: param.article_id, 
      page: this.data.page, 
      page_size: this.data.page_size,
      sign: param.sign,
      openid: app.globalData.openid
    }
    this.getData(params)
    wx.getSystemInfo({
      success: function (res) {
        let titleBarHeight = 0
        if (res.model.indexOf('iPhone') !== -1) {
          titleBarHeight = 44
        } else {
          titleBarHeight = 48
        }
        that.setData({
          barHeight: (res.statusBarHeight + titleBarHeight),
          scrollHeight: res.windowHeight - 20
        });
      }
    })
  },
  //获取评论列表数据
  getData: function (param) {
    let that = this
    wx.request({
      url: app.globalData.url + '/article/Comment/getCommentList',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200 && res.data.data.length > 0) {
          for (let i=0; i<res.data.data.length; i++) {
            res.data.data[i].comment_add_time = date.formatTimeTwo(res.data.data[i].comment_add_time, 'M-D h:m:s')
            if (param.user_id == res.data.data[i].user_id) {
              that.setData({
                commentTip: '嘿！盆友~欢迎来到归一，在这里可以和世界各'
              })
            }
          }
          if (that.data.page == 1) {
            that.setData({
              commentList: res.data.data
            })
          } else {
            let array = that.data.commentList
            that.setData({
              commentList: array.concat(res.data.data)
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //查看评论详情
  comment_detail(e) {
    let index = parseInt(e.currentTarget.id)
    let qianming = app.globalData.openid + this.data.commentList[index].article_id
    qianming = md5.hexMD5(qianming)
    let param = {
      comment_id: this.data.commentList[index].comment_id,
      article_id: this.data.article.article_id,
      article_title: this.data.article.article_title,
      article_image: this.data.backgroundImg,
      sign: qianming
    }
    wx.navigateTo({
      url: '../comment-detail/comment-detail?param='+JSON.stringify(param),
    })
  },
  //删除和回复评论
  reply_delete1: function(e) {
    this.setData({
      footNav1: [
        { name: "删除", color: '#D0021B' },
        { name: "回复" }
      ],
      comment_index: e.currentTarget.id,
      reply_index: 0,
      replyType: false
    })
    this.foot()
  },
  //删除和回复评论
  reply_delete2: function (e) {
    this.setData({
      footNav1: [
        { name: "删除", color: '#D0021B' },
        { name: "回复" }
      ],
      comment_index: e.currentTarget.id,
      reply_index: 1, 
      replyType: false
    })
    this.foot()
  },
  //发布评论
  comment: function(e) {
    app.loging();
    this.setData({
      hidden: !this.data.hidden,
      focus: true,
      author: this.data.article.user_name
    })
  },
  //监听textarea输入
  textareaInput: function(e) {
    this.setData({
      comment_content: e.detail.value
    })
  },
  //发布评论
  release_comment: function (e) {
    let self = this
    if (this.data.comment_content == null || this.data.comment_content == '') {
      wx.showModal({
        title: '评论提示',
        content: '评论内容不能为空',
      })
    } else {
      let sign2 = md5.hexMD5(self.data.userInfo.openid + self.data.userInfo.user_id + self.data.article.article_id)
      if (this.data.commentType == '回复') {
        let commentid = self.data.commentList[self.data.comment_index].comment_id
        if (self.data.reply == false) {
          commentid = self.data.commentList[self.data.comment_index].reply[self.data.reply_index].comment_id
        }
        let param = {
          user_id: self.data.userInfo.user_id,
          article_id: self.data.article.article_id,
          comment_id: commentid,
          comment_content: self.data.comment_content,
          sign: sign2
        }
        self.addComment(param, '/article/Comment/addReplyComment')
      } else {
        let param = {
          user_id: self.data.userInfo.user_id,
          article_id: self.data.article.article_id,
          comment_content: self.data.comment_content,
          sign: sign2
        }
        self.addComment(param, '/article/Comment/addComment')
      }
    }
  },
  //添加评论/回复评论
  addComment: function(param, url) {
    wx.request({
      url: app.globalData.url + url,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: res.data.info.toString(),
          icon: 'none'
        }) 
      }
    })
    this.setData({
      commentTip: '嘿！盆友~欢迎来到归一，在这里可以和世界各'
    })
    let params = {
      article_id: this.data.article.article_id,
      user_id: app.globalData.userInfo.user_id,
      page: this.data.page,
      page_size: this.data.page_size,
      sign: this.data.sign,
      openid: app.globalData.userInfo.openid
    }
    this.getData(params)
  },
  //回复和举报
  reply: function (e) {
    this.setData({
      footNav1: [
        { name: "回复" },
        { name: "举报", bind: true }
      ],
      replyType: true,
    })
    this.foot()
  },

  //隐藏评论
  hiddenComment: function(e) {
    this.setData({
      hidden: !this.data.hidden,
      focus: false
    })
  },

  //触发事件，可自定义
  foot: function () {
    //根据ID获取组件对象
    var showTwo = this.selectComponent('#footnav');
    //执行操作——显示菜单
    showTwo.show();
  },
  // 菜单点击事件
  navClick(e) {
    let self = this
    this.setData({
      commentType: e.detail.name
    })
    if (e.detail.name == '回复') {
      this.comment();
      if (this.data.replyType) {
        self.setData({
          author: self.data.commentList[self.data.comment_index].user_name
        })
      } else {
        self.setData({
          author: self.data.commentList[self.data.comment_index].reply[self.data.reply_index].user_name
        })
      }
    } else if (e.detail.name == '删除') {
      this.delComment();
    } else {
      let sign2 = md5.hexMD5(app.globalData.userInfo.openid + app.globalData.userInfo.user_id + this.data.article.article_id)
      let param = {
        user_id: self.data.userInfo.user_id,
        article_id: self.data.article.article_id,
        comment_id: self.data.commentList[self.data.comment_index].comment_id,
        operation_type: 1,
        operation_content: e.detail.name,
        sign: sign2
      }
      this.addCommentFabulous(param)
    }
  },
  //删除评论
  delComment: function() {
    if (!(app.globalData.userInfo.user_id == this.data.commentList[this.data.comment_index].user_id)) {
      wx.showModal({
        title: '温馨提示',
        content: '对不起，该评论不是你发布的，无法删除！',
      })
      return false;
    }
    let sign2 = md5.hexMD5(app.globalData.userInfo.openid + app.globalData.userInfo.user_id + this.data.article.article_id)
    let param = {
      user_id: app.globalData.userInfo.user_id,
      article_id: this.data.article.article_id,
      comment_id: this.data.commentList[this.data.comment_index].comment_id,
      sign: sign2
    }
    wx.request({
      url: app.globalData.url + '/article/Comment/delComment',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: res.data.info.toString(),
          icon: 'none'
        })
      }
    })
  },
  //评论举报
  addCommentFabulous: function(param) {
    wx.request({
      url: app.globalData.url + '/article/Comment/addCommentFabulous',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: res.data.info.toString(),
          icon: 'none'
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  loadMore: function () {
    var that = this;// 显示加载图标
    if (this.data.commentList.length >= 10) {
      wx.showLoading({
        title: '玩命加载中',
      })
      let param = {
        user_id: this.data.article.user_id,
        article_id: this.data.article.article_id,
        page: this.data.page,
        page_size: this.data.page_size++,
        sign: this.data.sign,
        openid: this.data.article.openid
      }
      setTimeout(function () {
        that.getData(param)
        wx.hideLoading()
      }, 2000)
    }
  },
  //返回
  goback() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let self = this
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.hideLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      self.getData();
    }, 3000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('ssssss')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})