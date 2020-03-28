// pages/editor-cover/editor-cover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "btn": true,
    "images": [
      { "imgUrl": "/images/initiate/Bitmap.png" },
      { "imgUrl": "/images/initiate/Bitmap(1).png" },
      { "imgUrl": "/images/initiate/Bitmap(2).png" },
      { "imgUrl": "/images/initiate/Bitmap(3).png" },
      { "imgUrl": "/images/initiate/Bitmap(4).png" },
      { "imgUrl": "/images/initiate/Bitmap(5).png" },
      { "imgUrl": "/images/initiate/Bitmap(6).png" }
    ],
    "status": -1,
    "boolean": false
  },
  // 加图片边框
  changeBorder: function (e) {
    let d = e.currentTarget.dataset.t
    this.setData({
      "status": d,
      "btn": false,
      "boolean": false
    })
  },
  randoms: function () {
    this.setData({
      "status": -1,
      "btn": false,
      "boolean": true
    })
  },
  //选择图片
  selectImg: function () {
    let index = this.data.status;
    wx.setStorage({
      key: "imgs",
      data: this.data.images[index].imgUrl
    })
    wx.navigateTo({
      url: '../my-edit-text/my-edit-text'
    })

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