// pages/index/comment-detail/comment-detail.js
var app = getApp();
var date = require('../../../utils/formatdate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    backgroundImg: '',
    starType: false, //关注的星星
    param: { },
    textarea: '',
    comment: {},
    commentTip: '添加你的评论...',
    hidden: false,
    focus: false,
    barHeight: 0,
    replyList: [
    ],
    page: 1,
    page_size: 10,
    comment_content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loging()
    let that = this;
    let param = JSON.parse(options.param);
    this.setData({
      backgroundImg: param.article_image,
      param: param
    })
    let params = {
      article_id: param.article_id,
      comment_id: param.comment_id,
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
          barHeight: (res.statusBarHeight + titleBarHeight)
        });
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
  //获取评论列表数据
  getData: function (param) {
    let that = this
    wx.request({
      url: app.globalData.url + '/article/Comment/readCommentRreply',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          for (let i = 0; i < res.data.data.reply.length; i++) {
            res.data.data.reply[i].comment_add_time = date.formatTimeTwo(res.data.data.reply[i].comment_add_time, 'M-D h:m:s')
          }
          res.data.data.comment.comment_add_time = date.formatTimeTwo(res.data.data.comment.comment_add_time, 'M-D h:m:s')
          if (that.data.page == 1) {
            that.setData({
              replyList: res.data.data.reply,
              comment: res.data.data.comment
            })
          } else {
            let array = that.data.replyList
            that.setData({
              replyList: array.concat(res.data.data.reply),
              comment: res.data.data.comment
            })
          }
        }
      }
    })
  },

  //发布评论
  comment: function (e) {
    app.loging();
    this.setData({
      hidden: !this.data.hidden,
      focus: true
    })
  },

  //回复和举报
  reply: function (e) {
    this.setData({
      hidden: !this.data.hidden,
      focus: true
    })
  },
  //监听textarea输入
  textareaInput: function (e) {
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
      let sign2 = md5.hexMD5(app.globalData.userInfo.openid + app.globalData.userInfo.user_id + self.data.comment.article_id)
      let param = {
        user_id: app.globalData.userInfo.user_id,
        article_id: self.data.article.article_id,
        comment_id: self.data.replyList[self.data.reply_index].comment_id,
        comment_content: self.data.comment_content,
        sign: sign2
      }
      self.addComment(param)
    }
  },
  //添加评论/回复评论
  addComment: function (param) {
    wx.request({
      url: app.globalData.url + '/article/Comment/addReplyComment',
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
    let params = {
      comment_id: this.data.comment.comment_id,
      article_id: this.data.comment.article_id,
      user_id: app.globalData.userInfo.user_id,
      page: this.data.page,
      page_size: this.data.page_size,
      sign: this.data.sign,
      openid: app.globalData.userInfo.openid
    }
    this.getData(params)
  },

  //隐藏评论
  hiddenComment: function (e) {
    this.setData({
      hidden: !this.data.hidden,
      focus: false
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;

    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  loadMore: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
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

  },

  /** 
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})