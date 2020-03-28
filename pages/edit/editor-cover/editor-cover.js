// pages/editor-cover/editor-cover.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "btn":true,
    "images": [],
    "status":-1,
    "boolean":true,
    "imgUrl":"",
    "type":0,
    "user_id":0
  },
  // 加图片边框
  changeBorder: function (e) {
    let d = e.currentTarget.dataset.t
    let imgs = e.currentTarget.dataset.s
    console.log(e)
    this.setData({
      "status":d,
      "btn":false,
      "boolean": false,
      "imgUrl": e.currentTarget.dataset.s
    })
    console.log(this.data.imgUrl)
  },
  //随机选封面
  randoms: function () {
    let lens = this.data.images.length
    var randomNum = parseInt(Math.random() * lens);
    console.log(randomNum)
    this.setData({
      "status": randomNum,
      "btn": false,
      "boolean": false,
      "imgUrl": this.data.images[randomNum]
    })
    console.log(this.data.imgUrl)
  },
  //选择图片
  selectImg: app.throttle(function () {
    let that = this;
    //更换封面数据
      if(this.data.type == 1) {
        let img = this.data.imgUrl;
        that.goUser(img);
      }else{
        wx.navigateTo({
          url: '../editor-text/editor-text?imgUrl=' + this.data.imgUrl,
        })
      }
   
    
  },1000),
  //个人主页图片上传接口
  goUser(img) {
    let imgs = img.replace("https://gy.erroy.cn", '')
    wx.request({
      url: app.globalData.url + '/user/User/saveUserInfo', //仅为示例，并非真实的接口地址
      data: {
        user_id: this.data.user_id,
        user_cover: imgs
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          wx.navigateBack({
            delta: 2
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.type) {
      that.setData({
        "type": options.type
      })
      console.log("type:", that.data.type)
    }
   
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res.data)
        that.setData({
          user_id: res.data.user_id
        })
      }
    })
    //图片列表数据
    wx.request({
      url: app.globalData.url + "/article/article/getArticlSystemImage",
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          "images": res.data.data
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