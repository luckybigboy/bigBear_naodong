// pages/editor-text/editor-text.js
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "statusBar": app.globalData.statusBar,
    "customBar": app.globalData.customBar,
    "custom": app.globalData.custom,
    "num": 0,
    "text": "",
    "btn": true,
    "titles": "",
    "class_name": "",
    "imgUrl": "",
    "status": false,
    "iosBoolean":false,
    "user_id":"",
    "class_id":0,
    "openid":"",
    "booleans":false,
    "heights":true
  },
  //返回
  goback:function () {
    if (this.data.text == "") {
      wx.switchTab({
        url: '../editor-title/editor-title'
      })
    } else {
      this.toast()
    }
  },
  //返回提示弹窗
  toast: function () {
    //根据ID获取组件对象
    var showTwo = this.selectComponent('#toast');

    //访问属性,使用data访问内部属性和组件属性
    console.info(showTwo.data);

    //执行操作——显示弹窗
    showTwo.show({
      cancel: true  //取消按钮显示与隐藏
    });
  },

  // 弹窗取消按钮
  modalCancel(e) {
    console.log(e)
    wx.switchTab({
      url: '../editor-title/editor-title'
    })
  },

  // 弹窗确定按钮
  modalConfirm(e) {
    console.log(e)
    this.goServe(1)//存草稿
  },

  //获取编辑器内容
  onEditorReady(e) {
    let lens = e.detail.text.length-1
    this.setData({
      "num": lens,
      "text": e.detail.text
    })
    if (lens > 150) {
      this.setData({
        "btn": true
      })
      wx.showToast({
        title: '最多输入150字',
      })
    } else if (lens <= 150 && lens >= 1) {
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
  focusEd: function() {
    this.getSystem();
  },
  //光标离开
  blurEd: function() {
    this.setData({
      "iosBoolean": false
    })
  },
  //更换图片
  changeImg: function() {
    wx.navigateTo({
      url: '../editor-choose-faces/editor-choose-faces',
    })
  },
  //发布存草稿数据请求
  goServe(articleDraft) {
    var desc = this.data.text;
    if (desc.indexOf("<br/>")) {
      desc = desc.replace(/<br\/>/g, "\n");
    }
    
    let img = this.data.imgUrl.replace("https://gy.erroy.cn", '')
    console.log(img)
    this.setData({
      "imgUrl":img
    })
    console.log(this.data)
    wx.request({
      url: app.globalData.url + "/article/article/addArticle",
      method:"POST",
      data: {
        article_image: this.data.imgUrl,
        article_title: this.data.titles,
        article_content: desc,
        class_id: this.data.class_id,
        user_id: this.data.user_id,
        article_is_draft: articleDraft,
        sign: md5.hexMD5(this.data.user_id + this.data.openid + this.data.class_id)
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.code === 200 ) {
          if (articleDraft === 1) {
            wx.navigateTo({
              url: '../../my/my-drafts/my-drafts',
            })
          }else{
            wx.switchTab({
              url: '../../index/home/home'
            })
          }
        } else {
            wx.showToast({
              title: '发布失败',
              duration: 1500,
              icon: 'none'
            })
        }
      }
    })
  },
  //存草稿
  draft: app.throttle(function() {
    this.goServe(1)
  },1000),
  //跳转首页精选
  goNext: app.throttle(function() {
    this.goServe(0)
  },1000),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("==============================",options)
    let that = this;
    that.setData({
      "imgUrl": options.imgUrl
    })
    wx.createSelectorQuery().select('#editor').context(function (res) {
      console.log(res.context)
      that.editorCtx = res.context
    }).exec()
    if (options.class_name){
      that.setData({
        "titles": options.titles,
        "class_name": options.class_name,
        "class_id": options.class_id,
        "text": options.content,
        "btn": false,
        "num": options.content.length
      })
      
    }else{
      //取标题页缓存
      wx.getStorage({
        key: 'title',
        success(res) {
          console.log("标题", res.data)
          that.setData({
            "titles": res.data
          })
        }
      })
      wx.getStorage({
        key: 'label1',
        success(res) {
          console.log("文章分类", res.data)
          that.setData({
            "class_name": res.data
          })
        }
      })
      wx.getStorage({
        key: 'class_id',
        success(res) {
          console.log("文章分类ID", res.data)
          that.setData({
            "class_id": res.data
          })
        }
      })
    }
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log("用户基本信息",res.data)
        that.setData({
          "user_id": res.data.user_id,
          "openid": res.data.openid
        })
        console.log("openid============",that.data.openid)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.editorCtx.insertText({
      text: this.data.text,
      success: function () {
      }
    })
  },
  //判断操作系统
  getSystem: function() {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        let ios = res.system.indexOf("iOS");
        if (ios == 0){
          that.setData({
            iosBoolean: false
          })
        }else{
          that.setData({
            iosBoolean: true
          });
        }
      }
    })
  },
  //判断键盘高度
  getOnkey: function() {
    let that = this;
    wx.onKeyboardHeightChange(res => {
      console.log(res.height)
      if (res.height == 0) {
        that.setData({
          "status": false
        })
      } else {
        that.setData({
          "status": true
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
    this.getOnkey();
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