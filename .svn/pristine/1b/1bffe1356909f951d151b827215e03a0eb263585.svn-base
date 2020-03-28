// pages/editor-title/editor-title.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "booleans":true,
    "labels": [],
    "hotTitle": [],
    "status":-1,
    "inputTitle":"",
    "num":0,
    "names":"",
    "class_id":0
  },
  //监听文本框
  watchInput: function (e) {
    this.setData({
      "num": e.detail.value.length,
      "inputTitle": e.detail.value
    })
    if (e.detail.value.length <= 30 && e.detail.value.length > 0 && this.data.status >= 0) {
      this.setData({
        "booleans":false
      })
    }else{
      this.setData({
        "booleans": true
      })
    }
  },
  // 改变标签透明度选择文章分类
  changeOpacity: function(e) {
    console.log(e)
    let idx = e.target.dataset.idx;
    let n = e.target.dataset.n;
    let class_id = e.target.dataset.class_id;
    this.setData({
      "status" : idx,
      "names": n,
      "class_id": class_id
    })
    if (this.data.num <= 30 && this.data.num > 0 && this.data.status >= 0) {
      this.setData({
        "booleans": false
      })
    } else {
      this.setData({
        "booleans": true
      })
    }

  },
  //选择热门标题
  changeTitle: function(e) {
   let d = e.target.dataset.t
    this.setData({
     "inputTitle" : d,
      "num": e.target.dataset.t.length
    })
    if (this.data.num <= 30 && this.data.num > 0 && this.data.status >= 0) {
      this.setData({
        "booleans": false
      })
    } else {
      this.setData({
        "booleans": true
      })
    }

   
  },
  //跳转选择封面
  goNext: app.throttle(function() {
      app.loging(); // 判断是否登录
      wx.setStorage({
        key: "title",
        data: this.data.inputTitle
      })
      wx.setStorage({
        key: "label1",
        data: this.data.names
      })
    wx.setStorage({
      key: "class_id",
      data: this.data.class_id
    })
      setTimeout(()=>{
        wx.navigateTo({
          url: '../editor-choose-faces/editor-choose-faces'
        })
      },500)
  },1000),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    let that = this
    //文章分类数据
    wx.request({
      url: app.globalData.url + "/article/article/getArticlClassInfo",
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
       that.setData({
         "labels":res.data.data
       })
      }
    })
    //热门标题数据
    wx.request({
      url: app.globalData.url + "/article/article/getArticlLabelInfo",
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          "hotTitle": res.data.data
        })
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
    this.setData({
      "inputTitle":"",
      "status":-1
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