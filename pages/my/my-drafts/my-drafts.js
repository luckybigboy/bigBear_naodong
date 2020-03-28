// pages/test/test.js
var app = getApp()
var md5 = require('../../../utils/md5.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    article_id: '',
    isBool: '',
    startX: 0, //开始坐标
    startY: 0,
    user_id: '',
    pageNum: 1,
    page_size: 15,
    total0: 0,
    code: ''
  },


  //  获取数据
  getData(page) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/user/User/userDrafts',
      data: {
        user_id: that.data.user_id,
        page: page,
        page_size: that.data.page_size,
        openid: app.globalData.openid,
        sign: md5.hexMD5(app.globalData.openid + that.data.user_id)
      },
      success: res => {
        console.log(res);
        console.log(res.data.code);
        if (res.data.code == 201) {
          this.setData({
            code: res.data.code
          })
        }
        if (res.data.data.res) {
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
    console.log(that.data.list);
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
  },

  //  开脑洞
  toPages(e) {
    let image = e.currentTarget.dataset.image;
    let content = e.currentTarget.dataset.content;
    let classId = e.currentTarget.dataset.classid;
    let className = e.currentTarget.dataset.classname;
    let article_title = e.currentTarget.dataset.articletitle;
       
    console.log(e.currentTarget.dataset.image);
    wx.navigateTo({
      url: '../../edit/editor-text/editor-text?imgUrl=' + image + '&content=' + content + '&titles=' + article_title + '&class_id=' + classId + '&class_name=' + className,
    })
    app.globalData.id = e.currentTarget.dataset.index;
  },
  

  //  跳轉到開腦洞頁面
  toPage() {
       wx.switchTab({
         url: '../../edit/editor-title/editor-title',
       })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if(options.id) {
      //获取用户id
      that.setData({
        user_id: options.id
      })
    }else{
      var value = wx.getStorageSync('userInfo');
      this.setData({
        user_id: value.user_id
      })
    }   
    that.getData(1);  
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.list.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: this.data.list
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.list.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      list: that.data.list
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function(e) {
    let that = this;
    //对应文章id
    let id = e.target.dataset.id;
    
    wx.request({
      url: app.globalData.url + '/user/User/delDrafts',
      data: {
        article_id: id
      },
      success(res) {
        that.setData({
          list: [],
          pageNum: 1
        })
        
        wx.showToast({
          title: res.data.data
        }, 500)

        that.getData(1)
      }
    })

  }
})