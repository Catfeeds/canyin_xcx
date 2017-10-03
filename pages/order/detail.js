// 获取全局应用程序实例对象
const app = getApp();
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    orderData: {},
    proData: [],
  },
  
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
    });
  },

  address:function(){
      wx.navigateTo({
        url: '../address/user-address/user-address',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // TODO: onReady
    wx.hideToast();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    });
    // TODO: onShow
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_details',
      method: 'post',
      data: {
        order_id: that.data.orderId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var pro = res.data.pro;
          var ord = res.data.ord;
          that.setData({
            orderData: ord,
            proData: pro
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // TODO: onHide
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});
//# sourceMappingURL=payorder.js.map
