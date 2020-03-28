// pages/index/home/home.js
var app = getApp();
var md5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brain_hole_List: [
    ],
    current: 1,
    selType: true,
    article: {
    },
    focusList: [
    ],
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
    ],
    progress: 11,
    positiontop: false,
    circular: true,
    segmentType: [true, false, false],
    article_end: 2,
    page: 1,
    page_size: 10,
    height: 0,
    followArticleList: [],
    followUserList: [],
    user_num: 0
  },
  goSearch: function () {
    wx.navigateTo({
      url: '../index-search/index-search',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loging();
    let that = this
    wx.setNavigationBarTitle({
      title: '脑洞大大开',
    })
    this.getData()
    var query = wx.createSelectorQuery();
    query.select('.middle').boundingClientRect(function (rect) {
      that.setData({
        height: rect.height * 4
      })
    }).exec();
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
  //获取数据
  getData: function() {
    let that = this
    let index = 0
    let param = {
      page: 1,
      pagse_size: 10,
      article_end: this.data.article_end,
      sign: md5.hexMD5(app.globalData.openid + this.data.article_end),
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.url + '/article/article/getArticleInfo',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          for(let i=0; i<res.data.data.length; i++) {
            if (res.data.data[i].article_image.indexOf('https') == -1) {
              res.data.data[i].article_image = "https://" + res.data.data[i].article_image
            }
            if (res.data.data[i].user_image.indexOf('https') == -1) {
              res.data.data[i].user_image = "https://" + res.data.data[i].user_image
            }
          }
          if (res.data.data.length > 1) {
            index = parseInt(res.data.data[1].article_floor)-1
            let floor = 'floorList[' + index + '].imgsrc'
            that.setData({
              brain_hole_List: res.data.data,
              article: res.data.data[1],
              progress: (parseInt(res.data.data[1].article_floor) * 11.1111),
              current: 1,
              [floor]: '../../../images/index/user-light.png'
            })
          } else {
            index = parseInt(res.data.data[0].article_floor) - 1
            let floor = 'floorList[' + index + '].imgsrc'
            that.setData({
              brain_hole_List: res.data.data,
              article: res.data.data[0],
              progress: (res.data.data[0].article_floor * 11.1111),
              current: 0,
              [floor]: '../../../images/index/user-light.png'
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
  },
  //获取关注数据
  getFollowList: function() {
    let param = {
      sign: md5.hexMD5(app.globalData.userInfo.user_id + app.globalData.userInfo.openid),
      openid: app.globalData.userInfo.openid,
      user_id: app.globalData.userInfo.user_id
    }
    let self = this
    wx.request({
      url: app.globalData.url+'/article/article/getFollowList',
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          self.setData({
            followArticleList: res.data.data.follow,
            followUserList: res.data.data.user,
            user_num: res.data.data.user_num
          })
        }
      }
    })
  },
  //漏斗
  funnel: function(e) {
    this.setData({
      positiontop: !this.data.positiontop
    })
    setTimeout(() => {
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
      });
      if (this.data.positiontop == false) {
        animation.opacity(0).step();
        this.setData({
          menu: animation.export()
        })
      } else {
        animation.opacity(1).step();
        this.setData({
          menu: animation.export()
        })
      }
    }, 500)
  },
  //搜索
  search: function() {
    wx.navigateTo({
      url: '../index-search/index-search',
    })
  },
  //图片滑动切换监听
  swiperChange(e) {
    this.setData({
      current: e.detail.current,
      article: this.data.brain_hole_List[e.detail.current],
      progress: (this.data.brain_hole_List[e.detail.current].article_floor * 11.1111)
    })
    let that = this
    let index = parseInt(this.data.brain_hole_List[e.detail.current].article_floor)-1
    let floor = 'floorList[' + index + '].imgsrc'
    for (let i=0; i<9; i++) {
      if (i == index) {
        that.setData({
          [floor]: '../../../images/index/user-light.png'
        })
      } else {
        let floor2 = 'floorList[' + i + '].imgsrc'
        that.setData({
          [floor2]: '../../../images/index/user-gray.png'
        })
      }
    }

    var query = wx.createSelectorQuery();
    query.select('.middle').boundingClientRect(function (rect) {
      that.setData({
        height: rect.height * 2 - 30
      })
    }).exec();
  },
  //精选/关注切换
  typeSel() {
    if (this.data.selType == true) {
      app.loging();
      this.getFollowList();
    }
    this.setData({
      selType: !this.data.selType
    })
  },
  //跳转脑洞文章详情页面
  goArticleDetail() {
    wx.navigateTo({
      url: '../article-detail/article-detail?article_id=' + this.data.article.article_id,
    })
  },
  //跳转关注的人页面
  follow: function() {
    wx.navigateTo({
      url: '../follow-people/follow-people?followUserList='+JSON.stringify(this.data.followUserList),
    })
  },
  //脑洞状态切换
  segment: function(e) {
    for (let i=0; i<this.data.segmentType.length; i++) {
      if (e.currentTarget.id == i) {
        let type = 'segmentType[' + e.currentTarget.id + ']'
        this.setData({
          [type]: true
        })
      } else {
        let type = 'segmentType[' + i + ']'
        this.setData({
          [type]: false
        })
      }
    }
    let article_end = e.currentTarget.id
    if(e.currentTarget.id == 0) {
      article_end = 2
    } else if (e.currentTarget.id == 1) {
      article_end = 0
    } else {
      article_end = 1
    }
    this.setData({
      article_end: article_end
    })
    this.getData()
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      self.getData();
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 3000);
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