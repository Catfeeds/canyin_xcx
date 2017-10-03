var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = options.title;
    if (!title) {
      title = '商家活动';
    }
    wx.setNavigationBarTitle({
      title: title,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    });
    //获取所有
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Activity/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if(list==''){
          wx.showToast({
            title: '',
            duration: 2000
          });
          return false;
        }
        that.setData({
          list: list
        });
      },

      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  /**
   * 活动详情跳转事件
   */
  details: function(e) {
    var actId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../particulars/particulars?actId=' + actId,
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Activity/getlist',
      method: 'post',
      data: { page: page},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list == '') {
          return false;
        }
        that.setData({
          list: that.data.list.concat(list),
          page: parseInt(page)+1,
        });
      },

      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '商家活动',
      path: '/pages/activity/activity',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})