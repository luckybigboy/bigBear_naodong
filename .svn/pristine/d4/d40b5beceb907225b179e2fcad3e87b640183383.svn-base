// pages/my-system-news/my-system-news.js
var WxParse = require('../../../wxParse/wxParse.js');
var WxParse1 = require('../../../wxParse/html2json.js');
var app = getApp()
// import WxParse from '../../../wxParse/wxParse';
var md5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconImg: '../../../images/my/tuoyuan.png',
    logo: '../../../images/my/my-logo.png',
    list: [], //  放置返回的数据
    user_id: '',
    pageNum: 1, //   加载的次数
    page_size: 10, //  返回数据的个数
    total0: 0,
    scrollHeight: ''
  },

  //  获取数据
  getData(page) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/User/getUserOfficialList',
      data: {
        user_id: that.data.user_id,
        page: page,
        page_size: that.data.page_size,
        openid: app.globalData.openid,
        sign: md5.hexMD5(app.globalData.openid + that.data.user_id)
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {

        if (res.data.data.res) {
          //富文本wxparse在数组中引用
          for (let i = 0; i < res.data.data.res.length; i++) {
            res.data.data.res[i]["official_content"] = WxParse1.html2json(res.data.data.res[i]["official_content"], 'returnData');
          }
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
    if (that.data.total0 > that.data.list.length) {
      var page = that.data.pageNum + 1;
      that.setData({
        pageNum: page
      })
      that.getData(page);
    }
    console.log(that.data.list.length);
  },

  //  跳转到草稿箱
  toPage(e) {
   wx.navigateTo({
     url: '../my-drafts/my-drafts?id=' + this.data.user_id
   })
    app.globalData.id = e.currentTarget.dataset.id;
  },

  //  跳转用户须知页面
  wxParseTagATap(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.src,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    //获取用户id
    that.setData({
      user_id: options.user_id
    })
    that.getData(1);
    wx.showLoading({
      title: '加载中...',
    })

    //  获取设备高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
        console.log("设备高度scrollHeight==" + res.windowHeight);
      }
    })

    setTimeout(() => {
      wx.hideLoading();
    }, 500)
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})