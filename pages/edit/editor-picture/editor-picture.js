// pages/edit/editor-picture/editor-picture.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    imgUrl: '',
    width: 300, //宽度
    height: 400, //高度
    max_width: 400,
    max_height: 400,
    disable_rotate: true, //是否禁用旋转
    disable_ratio: false, //锁定比例
    limit_move: true, //是否限制移动
    type: 0,
    user_id:0
  },

  cropperload(e) {
    console.log('cropper加载完成');
  },
  loadimage(e) {
    wx.hideLoading();
    console.log('图片');
    this.cropper.imgReset();
  },
  rotate() {
    //在用户旋转的基础上旋转90°
    this.cropper.setAngle(this.cropper.data.angle += 90);
  },
  end(e) {
    clearInterval(this.data[e.currentTarget.dataset.type]);
  },
  //还原
  back() {
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },
  //取消
  goBack: app.throttle(function() {
    wx.navigateBack({
      delta: -1
    })
  },1000),
  //手机相册更换封面处理及请求数据
  phoneServe(dir, file_name) {
    let that = this;
    this.cropper.getImg((obj) => {
      //app.globalData.imgSrc = obj.url;
      console.log(obj.url)
          wx.uploadFile({
            url: app.globalData.url + "/article/article/upload",
            filePath: obj.url,
            name: 'file',
            header: {
              'content-type': 'multipart/form-data'
            },
            formData: {
            },
            success(res) {
              console.log(res)
              var data = JSON.parse(res.data);
              console.log(data)
              if (data.code == 200) {
                console.log("上传图==========", data.data)
                if(that.data.type == 1){
                  let imgs = data.data;
                  that.goUser(imgs);
                }else{
                  wx.navigateTo({
                    url: '../editor-text/editor-text?imgUrl=' + data.data
                  })
                }
              }else {
                wx.showToast({
                  title: '图片格式问题，请重新选择',
                  duration: 1500,
                  icon: 'none'
                })
              }
            }
          })
      
    });

  },
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

  //确定
  submit: app.throttle(function() {
    if (this.data.type == 1) {
      let dir = "Uploads/User";
      let file_name = "更换封面"
      this.phoneServe(dir, file_name);
    } else {
      let dir = "Uploads/Article";
      let file_name = "选择封面"
      this.phoneServe(dir, file_name);
    }
  },1500),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res.data)
        that.setData({
          user_id:res.data.user_id
        })
      }
    })
    console.log(options)
    this.setData({
      src: options.imgUrl,
      type: options.type
    });
    this.cropper = this.selectComponent("#image-cropper");
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})