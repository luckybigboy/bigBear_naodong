// pages/index/index-search/index-search.js
var md5 = require('../../../utils/md5.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "openid": app.globalData.openid,
    "status": false,
    "state": false,
    "tip": true,
    "user": false,
    "searchs": "",
    "searchHot": [],
    "searchRecord": [],
    "num": 0,
    "searchList": [],
    "userList": [],
    "url": app.globalData.url,
    "article_id": 0,
    "user_id": 0,
    "searchText":"",
    "page":1,
    "page_size": 10,
    "article_num": 0,
    "user_num": 0,
    "show":true,
    "imgs":[]
  },

  //光标进入搜索框
  inFo: function() {
    this.setData({
      "status": true
    })
  },
  //光标离开
  outFo: function(e) {
    let search = e.detail.value;
    this.setData({
      "status": false,
      "searchs": search
    })
  },
  //监听输入框
  watchInput: function(e) {
    
    let searchText = e.detail.value;
    this.goRequest(searchText); //调用搜索接口
    this.goUser(searchText);
    if (e.detail.value.length > 0) {
      this.setData({
        "tip": false,
        "user": true,
        "searchText": searchText
      })
    } else {
      this.setData({
        "tip": true,
        "user": false,
        "state": false,
        "userList": [],
        "searchList": [],
        "imgs":[],
        "num": 0,
        "show": true,
        "page":1
      })
      
    }
    
  },
  //取消
  cancels: function() {
    //搜索历史记录
    let that = this;
    wx.getStorage({
      key: 'searchRecord',
      success(res) {
        console.log(res.data)
        that.setData({
          "searchRecord": res.data
        })
      }
    })
    this.setData({
      "tip": true,
      "user": false,
      "state": false,
      "searchs": "",
      "userList": [],
      "searchList": [],
      "imgs":[],
      "num": 0,
      "show": true,
      "page":1
    })
    
  },
  //提示搜索
  clickHot: function(e) {
    let searchText = e.target.dataset.h
    this.setData({
      "searchs": searchText,
      "tip": false,
      "user": true
    })
    this.goRequest(searchText); //调用搜索接口
    this.goUser(searchText);
  },
  //删除搜索历史
  deletes: function() {
    let that = this;
    that.cancels();
    wx.removeStorage({
      key: 'searchRecord',
      success(res) {
        console.log(res)
        that.setData({
          "searchRecord": []
        })
      }
    })
  },
  //搜索记录数据处理
  recordChange: function () {

    if (this.data.userList.length > 0 || this.data.searchList.length > 0) {
      this.data.searchRecord.unshift(this.data.searchs)
      let arr = this.data.searchRecord;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '') {
          arr.splice(i, 1);
          i = i - 1;
        }
      };
      let array = new Set(arr)
      wx.setStorage({
        key: "searchRecord",
        data: [...array]
      })
    }
  },
  //进入相关用户列表
  clickState: function() {
    this.setData({
      "state": true,
      "user": false
    })
  },
  //请求搜索数据
  goRequest(searchText) {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/article/getArticlSearch",
      method: "POST",
      data: {
        "search": searchText,
        "page": that.data.page,
        "page_size": that.data.page_size,
        "user_id": that.data.user_id,
        "sign": md5.hexMD5(that.data.openid),
        "openid": that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        
        if (res.data.code === 200) {
          const oldData = that.data.searchList;
            that.setData({
              "searchList": oldData.concat(res.data.data.article),
              "article_num": res.data.data.article_num
            })
          // 隐藏加载框
          wx.hideLoading();
          console.log(that.data.searchList)
          //搜索记录
          wx.getStorage({
            key: 'searchRecord',
            success(res) {
              // console.log(res.data)
              that.setData({
                "searchRecord": res.data
              })
            }
          })

        }
      }
    })
  },
  //请求搜索数据
  goUser(searchText) {
    let that = this;
    wx.request({
      url: app.globalData.url + "/article/article/getUserSearch",
      method: "POST",
      data: {
        "search": searchText,
        "page": that.data.page,
        "page_size": that.data.page_size,
        "user_id": that.data.user_id,
        "sign": md5.hexMD5(that.data.openid),
        "openid": that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)

        if (res.data.code === 200) {
          let arr = [];
          const oldUser = that.data.userList;
          for (let i = 0; i < 5; i++) {
            arr.push(res.data.data.user[i].user_image)
          }
          that.setData({
            "userList": oldUser.concat(res.data.data.user),
            "user_num": res.data.data.user_num,
            "imgs":arr
          })
         
          console.log(that.data.imgs)
          // 隐藏加载框
          wx.hideLoading();
          console.log(that.data.userList)


          //搜索记录
          wx.getStorage({
            key: 'searchRecord',
            success(res) {
              // console.log(res.data)
              that.setData({
                "searchRecord": res.data
              })
            }
          })

        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值

    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    //搜索历史记录
    wx.getStorage({
      key: 'searchRecord',
      success(res) {
        console.log(res.data)
        that.setData({
          "searchRecord": res.data
        })
      }
    })
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log("用户基本信息", res.data)
        that.setData({
          "openid": res.data.openid,
          "user_id": res.data.user_id
        })
      }
    })

    //热门搜索
    //热门标题数据
    wx.request({
      url: app.globalData.url + "/article/article/getArticlLabelInfo",
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          "searchHot": res.data.data
        })
      }
    })


  },
  // 跳转他人主页
  goOthers: function(e) {
    this.recordChange();//保存历史记录
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../my/my-others/my-others?id=' + id,
    })
  },
  //跳转文章详情
  goDetail: function(e) {
    this.recordChange();//保存历史记录
    this.setData({
      "article_id": e.currentTarget.dataset.id
    })
    wx.navigateTo({
      url: '../article-detail/article-detail?article_id=' + this.data.article_id,
    })
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
    this.cancels();
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
    if (this.data.searchList.length < this.data.article_num || this.data.user_num > this.data.userList.length){
      wx.showLoading({
        title: '加载中',
      })
      let searchText = this.data.searchText;
      let pages = this.data.page;
      pages = pages + 1;
      this.setData({
        page: pages
      })
      console.log(this.data.page)
      this.goRequest(searchText);
      this.goUser(searchText);
    }else{
      this.setData({
        "show":false
      })
    }
    
   
      
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})