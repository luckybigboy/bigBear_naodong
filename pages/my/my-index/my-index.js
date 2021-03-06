// pages/my/my-index/my-index.js
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    url: app.globalData.url,
    isLogin: false,
    isShow: false,
    navList: [{
        name: '我的消息',
        url: '../my-message-inform/my-message-inform',
        imgUrl: '/images/my/icon2.png'
      },
      {
        name: '草稿箱',
        url: '../my-drafts/my-drafts',
        imgUrl: '/images/my/icon3.png'
      },
      {
        name: '黑名单',
        url: '/pages/my/my-blacklist/my-blacklist',
        imgUrl: '/images/my/icon4.png'
      },
      {
        name: '设置',
        url: '../my-setting/my-setting',
        imgUrl: '/images/my/icon5.png'
      },
    ],

  },

  //  页面跳转
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  // 获取数据
  getData(id) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/User/getUserHomepage',
      data: {
        user_id: id,
        type:0
      },
      success(res) {
        console.log(res);
        that.setData({
          userInfo: res.data.data.user,
          isLogin: true,
          isShow: false
        })
        wx.setStorage({
          key: "userInfo",
          data: res.data.data.user
        })
      }
    })
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
  // 跳转登录页
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this;
    // 判断登陆状态是否过期
    wx.checkSession({
      success() {
        console.log('session_key 未过期')
        var value = wx.getStorageSync('userInfo')
        if (value == "" || value == undefined) {
          that.toLogin();
        } else {
          that.setData({
            isLogin: true,
            isShow: false
          })
          that.getData(value.user_id);
        }
      },
      fail() {
        console.log('session_key 已经失效')

        // session_key 已经失效，需要重新执行登录流程
        that.setData({
          isLogin: false,
          isShow: true
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