// pages/my-message-inform/my-message-inform.js
var app = getApp()
var md5 = require('../../../utils/md5.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    name: '',
    userInfo: {},
    code: '',  //  是否有消息通知
    user_id: '',
    pageNum: 1,
    page_size: 10,
    total0: 0,
    srcHeight: '',
    url: app.globalData.url
    },

  //   去往官方通知界面
  toMySystemNews() {
    wx.navigateTo({
      url: '../my-system-news/my-system-news?user_id=' + this.data.user_id,
    })
  },
  
  //  获取数据
  getData(page) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/User/getUserMessage',
      data: {
        user_id: 1,
        page: page,
        page_size: that.data.page_size,
        openid: app.globalData.openid,
        sign: md5.hexMD5(app.globalData.openid + that.data.user_id)
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data);
        if(res.data.data.res) {
          that.processData(res.data.data.res, res.data.data.total);
        }
      }
    })
  },

  //  数据处理
  processData(data, total) {
    let that = this;
    that.setData({
      list: that.data.list.concat(data),
      total0: total
    })
  },

  //  页面滚动加载
  lower(e) {
    let that = this;
    console.log('gd:',e)
    if (that.data.total0 > that.data.list.length) {
      var page = that.data.pageNum + 1;
      that.setData({
        pageNum: page
      })
      that.getData(page);
    }
  },

  getCode() {
    let that = this;
    wx.request({
      url: app.globalData.url +  '/user/User/getUserOfficial',
      data: {
        user_id: that.data.user_id,
        openid: app.globalData.openid,
        sign: md5.hexMD5(app.globalData.openid + that.data.user_id)
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        that.setData({
          code: +res.data.data
        })
      }
    })
  },  
  
  //   跳轉到他人主頁
  toOtherPage(e) {
    wx.navigateTo({
      url: '../my-others/my-others?id=' + e.currentTarget.dataset.otherid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //  获取用户id
    that.setData({
      user_id: options.id
    })
    that.getCode();
    that.getData(1);
    that.setData({
       userInfo: wx.getStorageSync('userInfo')
    });
    wx.showLoading({
      title: '加载中...',
    })

    setTimeout(() => {
      wx.hideLoading();
      //  获取设备高度
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            srcHeight: res.windowHeight
          });
          console.log("设备高度srcHeight==" + res.windowHeight);
        }
      })
    }, 500)
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