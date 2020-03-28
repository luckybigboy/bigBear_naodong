// pages/editor-text/editor-text.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "num": 0,
    "text": "",
    "btn": true,
    "titles": "",
    "label1s": "",
    "imgUrl": ""
  },
  //获取编辑器内容
  onEditorReady(e) {
    let lens = e.detail.text.length
    this.setData({
      "num": lens - 1,
      "text": e.detail.text
    })
    if (lens - 1 > 150) {
      this.setData({
        "btn": true
      })
      wx.showToast({
        title: '最多输入150字！',
        icon: 'none',
        duration: 2000//持续的时间
      })
    } else if (lens - 1 <= 150 && lens - 1 >= 1) {
      this.setData({
        "btn": false
      })
    } else {
      this.setData({
        "btn": true
      })
    }
  },
  //光标进入
  focusEd: function () {

  },
  //跳转下个页面
  goNext: function () {
    console.log(this.data)
    //请求数据
    wx.request({
      url: app.globalData.url + "/article/article/addArticle",
      data: {
        article_image: this.data.imgUrl,
        article_title: this.data.titles,
        article_content: this.data.text,
        class_id: 1,
        class_name: this.data.label1s,
        user_id: 1,
        user_name: '用户',
        article_is_draft: 0,
        user_image: "11"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.code === 200) {
          wx.switchTab({
            url: '../../index/home/home'
          })
        }

      }
    })

  },
 //  更改图片
  changeImg() {
        wx.navigateTo({
          url: '../my-choose-face/my-choose-face',
        })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.imgUrl) {
      this.setData({
        "imgUrl": options.imgUrl
      })
      console.log(this.data.imgUrl)
    } else {
      wx.getStorage({
        key: 'imgs',
        success(res) {
          console.log(res.data)
          that.setData({
            "imgUrl": res.data
          })
        }
      })
    }
    let that = this;
    //取缓存
    wx.getStorage({
      key: 'title',
      success(res) {
        console.log(res.data)
        that.setData({
          "titles": res.data
        })
      }
    })
    wx.getStorage({
      key: 'label1',
      success(res) {
        console.log(res.data)
        that.setData({
          "label1s": res.data
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