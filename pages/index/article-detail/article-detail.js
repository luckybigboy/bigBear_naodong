// pages/index/article-detail/article-detail.js
var app = getApp()
var md5 = require('../../../utils/md5.js');
Page({
  data: {
    param: {},
    backgroundImg: '',
    article: {},//作者信息
    floorList: [
      { imgsrc: '../../../images/index/user-gray.png' },
      { imgsrc: '../../../images/index/user-gray.png' },
      { imgsrc: '../../../images/index/user-gray.png' },
      { imgsrc: '../../../images/index/user-gray.png' },
      { imgsrc: '../../../images/index/user-gray.png' },
      { imgsrc: '../../../images/index/user-gray.png' },
      { imgsrc: '../../../images/index/user-gray.png' },
      { imgsrc: '../../../images/index/user-gray.png' },
      { imgsrc: '../../../images/index/user-gray.png' }
    ],//楼层更新层数
    articleList: [
    ],
    progress: 11,
    swiperType: false, //楼层上下切换图片显示
    hidden: false,//填脑洞写分支隐藏
    footNav1: [
      { name: "举报", bind: true },
      { name: "加入黑名单" }
    ],
    footNav2: [
      { name: "嘲讽 / 不友善内容" },
      { name: "侮辱谩骂骚扰" },
      { name: "淫秽色情信息" },
      { name: "违法有害信息" },
      { name: "政治敏感" }
    ],
    comment_content: '',
    focus: false,//editor自动获取焦点
    barHeight: 0,//头部bar高度
    floor_height: 0,//作者卡片高度
    brain_content: '',//脑洞文章内容
    brain_html: '',//脑洞文章内容
    brainType: '',//脑洞状态写分支，填脑洞，举报
    timeout: null,
    brain: 'brain0',
    current: 0,//当前楼层
    author: {},
    current2: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    branchList: [[], [], [], [], [], [], [], [], []],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //获取转发后的群消息
    wx.showShareMenu({
      withShareTicket: true,
      success: function () { },
      fail: function () { }
    })
    this.setData({
      param: options
    })
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
    let height = 0
    //获取头部bar的高度
    wx.getSystemInfo({
      success: function (res) {
        //获取屏幕高度
        height = res.windowHeight
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
    var query = wx.createSelectorQuery();
    //获取作者卡片高度
    query.select('.user').boundingClientRect(function (rect) {
      that.setData({
        floor_height: height - rect.height - that.data.barHeight - 10
      })
    }).exec();
    //获取楼层数据
    this.getData();
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
  //获取文章详情
  getData: function () {
    let that = this
    wx.request({
      url: app.globalData.url + '/article/article/getArticleDetails',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        article_id: this.data.param.article_id,
        sign: md5.hexMD5(app.globalData.openid + this.data.param.article_id)
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          // res.data.data.article_image = "https://" + res.data.data.article_image
          res.data.data.user_image = "https://" + res.data.data.user_image
          let index = parseInt(res.data.data.high_layer) - 1
          let floor = 'floorList[' + index + '].imgsrc'
          that.setData({
            author: res.data.data,
            [floor]: '../../../images/index/user-light.png',
            progress: res.data.data.high_layer * 11.1111,
            backgroundImg: res.data.data.article_image
          })
          wx.request({
            url: app.globalData.url + '/article/article/getNextFloor',
            method: 'POST',
            data: {
              article_top_id: res.data.data.article_id,
              openid: app.globalData.openid,
              sign: md5.hexMD5(app.globalData.openid + res.data.data.article_id)
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data.code == 200) {
                that.setData({
                  article: res.data.data[0],
                  articleList: res.data.data
                })
                for (let i = 1; i < res.data.data.length; i++) {
                  let branch = "branchList[" + i + "][" + 0 + "]"
                  that.setData({
                    [branch]: res.data.data[i]
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  //图片滑动切换监听
  swiperChange(e) {
    let swiperType = false
    if (e.detail.current > 0) {
      swiperType = true
    }
    this.setData({
      swiperType: swiperType,
      article: this.data.articleList[e.detail.current],
      current: e.detail.current
    })
    if (e.detail.current >= 1) {
      this.getNextArticle(e.detail.current)
    }
  },
  //填脑洞
  fill_brain_hole: function (e) {
    this.setData({
      footNav1: [{ name: "填脑洞" }, { name: "写分支" }]
    })
    this.foot();
  },
  //跳转该楼层的评论列表页面
  comment: function (e) {
    let qianming = app.globalData.openid + this.data.article.article_id
    qianming = md5.hexMD5(qianming)
    let param = {
      article_id: this.data.article.article_id,
      article_title: this.data.article.article_title,
      article_image: this.data.backgroundImg,
      sign: qianming,
    }
    console.log(param)
    wx.navigateTo({
      url: '../comment-list/comment-list?param=' + JSON.stringify(param),
    })
  },
  //脑洞关注
  follow_author: function (e) {
    app.loging(); //判断是否登陆
    let param = {
      other_type: 1,
      active_user_id: app.globalData.userInfo.user_id,
      passive_user_id: this.data.article.user_id
    }
    this.addUserOther(param)
  },
  //关注作者/取消关注/拉入黑名单/取消黑名单
  addUserOther: function (param) {
    wx.request({
      url: app.globalData.url + '/user/User/addUserOther',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
      }
    })
    this.getData();
    this.getNextArticle(this.data.current);
  },
  //收藏脑洞
  collect_brain: function () {
    app.loging(); //判断是否登陆
    let url = '/article/article/setOperation'
    if (this.data.article.isCollection == 1) {
      url = '/article/article/cancelOperation'
    }
    let param = {
      user_id: app.globalData.userInfo.user_id,
      operation_type: 1,
      article_id: this.data.article.article_id,
      sign: md5.hexMD5(app.globalData.userInfo.user_id + app.globalData.userInfo.openid + this.data.article.article_id)
    }
    this.setOperation(param, url)
  },
  //脑洞点赞
  liked_brain: function (e) {
    app.loging(); //判断是否登陆
    let url = '/article/article/setOperation'
    if (this.data.article.isFabulous == 1) {
      url = '/article/article/cancelOperation'
    }
    let param = {
      user_id: app.globalData.userInfo.user_id,
      operation_type: 0,
      article_id: this.data.article.article_id,
      sign: md5.hexMD5(app.globalData.userInfo.user_id + app.globalData.userInfo.openid + this.data.article.article_id)
    }
    this.setOperation(param, url)
  },
  //脑洞收藏，点赞，举报
  setOperation: function (param, url) {
    wx.request({
      url: app.globalData.url + url,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
      }
    })
    this.getData();
    this.getNextArticle(this.data.current);
  },
  //进入下一个脑洞
  goNextActicle: function () {

  },
  //填脑洞页面隐藏
  hiddenComment: function (e) {
    this.setData({
      hidden: !this.data.hidden,
      brain_content: '',
      brain_html: ''
    })
  },
  //触发事件，可自定义
  foot: function () {
    //根据ID获取组件对象
    var showTwo = this.selectComponent('#footnav');
    //访问属性,使用data访问内部属性和组件属性
    // console.info(showTwo.data);
    //执行操作——显示菜单
    showTwo.show();
  },
  // 菜单点击事件
  navClick(e) {
    app.loging(); //判断是否登陆
    let that = this
    that.editorCtx.clear()
    if (e.detail.name == '填脑洞') {
      if (that.data.current == 8) {
        wx.showToast({
          title: '九楼不能填脑洞，只能写分支',
          duration: 2000,
          icon: 'none'
        })
      } else {
        that.setData({
          hidden: !that.data.hidden,
          focus: that,
          brainType: e.detail.name
        })
        that.editorInsertText("brain")
      }
    } else if (e.detail.name == '写分支') {
      if (that.data.current == 0) {
        wx.showToast({
          title: '一楼不能写分支,只能填脑洞',
          duration: 2000,
          icon: 'none'
        })
      } else {
        that.setData({
          hidden: !that.data.hidden,
          focus: true,
          brainType: e.detail.name
        })
        that.editorInsertText("branch")
      }
    } else {
      that.setData({
        brainType: e.detail.name
      })
      let url = '/article/article/setOperation'
      let param = {
        user_id: app.globalData.userInfo.user_id,
        operation_type: 2,
        article_id: that.data.article.article_id,
        operation_content: e.detail.name,
        sign: md5.hexMD5(app.globalData.userInfo.user_id + app.globalData.userInfo.openid + that.data.article.article_id)
      }
      if (e.detail.name != '加入黑名单') {
        that.setOperation(param, url)
      } else {
        console.log(e.detail.name)
        let params = {
          other_type: 2,
          active_user_id: app.globalData.userInfo.user_id,
          passive_user_id: that.data.article.user_id
        }
        that.addUserOther(params)
      }
    }
    //你需要执行的方法
  },
  //输入监控
  editorInput: function (e) {
    if (e.detail.text.length < 150) {
      this.setData({
        brain_content: e.detail.text,
        brain_html: e.detail.html
      })
      this.editorSetStorage(e.detail.text)
    } else {
      wx.showToast({
        title: '脑洞和分支长度不能超过150字',
        icon: 'none',
        icon: 'none'
      })
    }
  },
  //editor数据存入本地 
  editorSetStorage: function (text) {
    let index = ''
    if (this.data.brainType == '填脑洞') {
      index = 'brain' + this.data.article.article_id + this.data.current.toString();
    } else {
      index = 'branch' + this.data.article.article_id + this.data.current.toString();
    }
    wx.setStorage({
      key: index,
      data: text,
    })
  },
  //editor插入缓存数据
  editorInsertText: function (type) {
    let that = this
    let index = type + that.data.article.article_id + that.data.current.toString();
    if (wx.getStorageSync(index)) {
      let brain_content = wx.getStorageSync(index)
      that.editorCtx.insertText({
        text: brain_content,
        success: function () {
        }
      })
    }
  },
  //点击完成
  finish: function (e) {
    this.release_comment()
  },
  //发布脑洞/分支
  release_comment: function () {
    if (this.data.brain_content.length > 0) {
      this.release(0)
    } else {
      wx.showToast({
        title: '发布内容不能为空！',
        icon: 'none'
      })
    }
  },
  release: function (article_is_draft) {
    let that = this
    let article_father_id = this.data.articleList[this.data.current].article_id
    if (this.data.brainType == '填脑洞' || this.data.brainType == '写分支') {
      if (this.data.brainType == '写分支') {
        article_father_id = this.data.articleList[this.data.current - 1].article_id
      }
    }
    let param = {
      user_id: app.globalData.userInfo.user_id,
      user_name: app.globalData.userInfo.user_name,
      article_content: this.data.brain_html,
      article_is_draft: article_is_draft,
      article_father_id: article_father_id,
      user_image: "https://" + app.globalData.userInfo.user_image,
      sign: md5.hexMD5(app.globalData.userInfo.user_id + app.globalData.userInfo.openid + article_father_id)
    }
    wx.request({
      url: app.globalData.url + '/article/article/setArticlInfoFill',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          if (article_is_draft == 0) {
            wx.showToast({
              title: res.data.info,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: res.data.info,
            icon: 'none'
          })
        }
      }
    })
    this.getData();
    this.getNextArticle(this.data.current);
  },
  swiperChange2: function (e) {
    let current = "current2[" + this.data.current + "]"
    this.setData({
      [current]: e.detail.current
    })
    if (e.detail.current > 0) {
      this.setData({
        article: this.data.branchList[this.data.current][e.detail.current]
      })
    }
  },
  toUp: function () {
    let current = "current2[" + this.data.current + "]"
    if (this.data.current2[this.data.current] > 0) {
      this.setData({
        [current]: this.data.current2[this.data.current] - 1,
        article: this.data.branchList[this.data.current][this.data.current2[this.data.current] - 1]
      })
    } else {
      this.setData({
        [current]: 0,
        article: this.data.branchList[this.data.current][0]
      })
    }
  },
  down: function () {
    let current = "current2[" + this.data.current + "]"
    if (this.data.branchList[this.data.current].length > 1) {
      if (this.data.current2[this.data.current] < (this.data.branchList[this.data.current].length-1)) {
        this.setData({
          [current]: this.data.current2[this.data.current] + 1,
          article: this.data.branchList[this.data.current][this.data.current2[this.data.current] + 1]
        })
      } else {
        this.setData({
          [current]: this.data.current2[this.data.current].length - 1,
          article: this.data.branchList[this.data.current][this.data.current2[this.data.current] - 1]
        })
      }
    } else {
      this.setData({
        [current]: 0,
        article: this.data.branchList[this.data.current][0]
      })
    }
  },
  //获取分支数据
  getNextArticle: function (index) {
    let notinarticle = null;
    for (let i = 0; i < this.data.branchList[index].length; i++) {
      if (i == (this.data.branchList[index].length - 1)) {
        notinarticle = notinarticle + this.data.branchList[index][i].article_id
      } else {
        notinarticle = notinarticle + this.data.branchList[index][i].article_id+","
      }
    }
    let param = {
      not_in_article: notinarticle,
      article_father_id: this.data.articleList[index - 1].article_id,
      openid: app.globalData.openid,
      sign: md5.hexMD5(app.globalData.openid + this.data.articleList[index - 1].article_id)
    }
    let self = this
    wx.request({
      url: app.globalData.url + '/article/article/getNextArticle',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200 && res.data.data.length > 0) {
          let branch = "branchList[" + index + "]"
          let branchList2 = []
          branchList2 = self.data.branchList[self.data.current]
          for (let j = 0; j < res.data.data.length; j++) {
            for (let i = 0; i < self.data.branchList[self.data.current].length; i++) {
              if (self.data.branchList[self.data.current][i].article_id != res.data.data[j].article_id) {
                if (i == (self.data.branchList[self.data.current].length - 1)) {
                  branchList2 = branchList2.concat(res.data.data[j])
                  self.setData({
                    [branch]: branchList2
                  })
                }
              } else {
                break;
              }
            }
          }
        }
      }
    })
  },
  //返回上一页
  goback: function () {
    if (this.data.brain_content > 1) {
      wx.showModal({
        title: '温馨提示',
        content: '是否在离开页面后保存脑洞草稿',
        success(res) {
          if (res.confirm) {
            this.release(0)
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
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
    // let self = this
    // wx.showLoading({
    //   title: '正在加载',
    // })
    // setTimeout(function () {
    //   self.getData(); 
    //   wx.hideLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // }, 3000);
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
    var that = this;
    return {
      title: "活动名称",
      path: "/pages/index/article-detail/article-detail?user_id=" + app.globalData.userInfo.user_id + "&article_id=" + that.data.article.article_id,
      success: function (res) {
        var shareTickets = res.shareTickets;
        if (shareTickets == null) {
          wx.showToast({
            title: "未分享到群",
            duration: 1500,
            icon: "none",
          })
        };
        if (shareTickets.length == 0) {
          return false;
        } else {
          //分享群成功后的操作
        };
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
      },
      fail: function (res2) { },
      complete: function (res3) { },
    }
  }
})