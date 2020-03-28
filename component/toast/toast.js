// component/toast/toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '提示框'
    },
    cont: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: false,
    duration: 200,
    cancel: true,
  },

  attached: function() {
    // 在组件实例进入页面节点树时执行
    // 动画初始化
    this.animation = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: 'linear',
    });
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 动画效果
    animationJs(i) {
      this.animation.opacity(i).step();
      this.setData({
        animation: this.animation.export()
      })
    },
    // 打开弹窗  
    show(res) {
      this.setData({
        status: true,
        cancel: res.cancel  //隐藏取消按钮
      })
      // 等组件创建完毕，开始加载动画渲染节点。
      setTimeout(() => {
        this.animationJs(1);
      }, 50)
    },

    // 关闭弹窗
    hide() {
      // 还原动画状态
      this.animationJs(0);
      setTimeout(() => {
        this.setData({
          status: false,
        })
      }, this.data.duration + 10)
    },

    // 取消按钮
    cancel() {
      this.hide();
      this.triggerEvent('cancel')
    },

    // 确定按钮
    confirm() {
      this.hide();
      this.triggerEvent('confirm')
    }
  }
})