// pages/my-choose-face/my-choose-face.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // "myTimer": null,
    "type": 0,
    "cWidth": 0,
    "cHeight": 0
  },
  //跳转选择封面页
  goNext: app.throttle(function () {
    wx.navigateTo({
      url: '../editor-cover/editor-cover?type=' + this.data.type
    })
  },1000),
  //跳转图片裁剪页并压缩图片
  goPhoneImg: app.throttle(function () {
      let that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success(res) {
          // const tempFilePaths = res.tempFilePaths[0];
          // console.log(tempFilePaths)
         
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function (res) {
              //---------利用canvas压缩图片--------------
              var ratio = 2;
              var canvasWidth = res.width //图片原始长宽
              var canvasHeight = res.height
              while (canvasWidth > 400 || canvasHeight > 400) {// 保证宽高在400以内
                canvasWidth = Math.trunc(res.width / ratio)
                canvasHeight = Math.trunc(res.height / ratio)
                ratio++;
              }
              that.setData({
                cWidth: canvasWidth,
                cHeight: canvasHeight
              })
              //----------绘制图形并取出图片路径--------------
              var ctx = wx.createCanvasContext('canvas')
              ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
              ctx.draw(false, setTimeout(function () {
                wx.canvasToTempFilePath({
                  canvasId: 'canvas',
                  destWidth: canvasWidth,
                  destHeight: canvasHeight,
                  success: function (res) {
                    console.log(res)
                    console.log(res.tempFilePath)//最终图片路径
                    wx.navigateTo({
                      url: '../editor-picture/editor-picture?type=' + that.data.type + '&imgUrl=' + res.tempFilePath,
                     })
                  },
                  fail: function (res) {
                    console.log(res.errMsg)
                  }
                })
              }, 200))    //留一定的时间绘制canvas
              
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          })

        } 
      })
     
  },1000),


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type){
      this.setData({
        "type": options.type
      })
    }
    
    // var count = 0;
    // this.data.myTimer = setInterval(function () {
    //   count++;
    //   console.log(count)
    //   wx.setStorage({
    //     key: "times",
    //     data: count
    //   })
    // }, 1000)
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
    clearInterval(this.data.myTimer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.myTimer)
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