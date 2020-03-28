// pages/editor-title/editor-title.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "booleans": true,
    "labels": [
      { "label1": "其他" },
      { "label1": "言情" },
      { "label1": "推理" },
      { "label1": "耽美" },
      { "label1": "同人" },
      { "label1": "鸡汤" },
      { "label1": "悬疑" },
      { "label1": "幽默" },
      { "label1": "吐槽" },
      { "label1": "耽美" },
      { "label1": "科幻" },
      { "label1": "玄幻" }
    ],
    "hotTitle": [
      { "title": "穿山甲到底说了什么" },
      { "title": "长大了是要和世界和解的" },
      { "title": "时光漫长，希望青春有你" },
      { "title": "我的奇葩室友" },
      { "title": "我竟然是条狗" },
      { "title": "谁动了我的奶酪" },
      { "title": "隔壁王叔叔" },
      { "title": "失踪的校服" },
      { "title": "西虹市首富" },
      { "title": "寻找前世之旅" }
    ],
    "status": -1,
    "inputTitle": "",
    "num": 0
  },
  //监听文本框
  watchInput: function (e) {
    this.setData({
      "num": e.detail.value.length
    })
    if (e.detail.value.length <= 30 && e.detail.value.length > 0 && this.data.status >= 0) {
      this.setData({
        "booleans": false
      })
    } else {
      this.setData({
        "booleans": true
      })
    }
  },
  // 改变标签透明度
  changeOpacity: function (e) {
    let idx = e.target.dataset.idx;
    this.setData({
      "status": idx
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
  changeTitle: function (e) {
    let d = e.target.dataset.t
    this.setData({
      "inputTitle": d,
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
  goNext: function () {
    console.log(app.loging())
    let s = app.loging();
    if (s == 1) {
      app.loging(); //判断是否登陆
    } else {
      wx.setStorage({
        key: "title",
        data: this.data.inputTitle
      })
      let index = this.data.status
      wx.setStorage({
        key: "label1",
        data: this.data.labels[index].label1
      })
      this.setData({
        "inputTitle": "",
        "booleans": true
      })
      wx.navigateTo({
        url: '../my-edit-text/my-edit-text'
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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