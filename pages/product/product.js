// pages/product/product.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    buynum:1,
    proId:0,
    info:{},
  },

  // 加减
  changeNum: function (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
      if (this.data.buynum <= 1) {
        buynum: 1
      } else {
        this.setData({
          buynum: this.data.buynum - 1
        })
      };
    } else {
      this.setData({
        buynum: this.data.buynum + 1
      })
    };
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var proId = options.proId;
    var title = options.title;
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({
      proId: proId,
    });
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
    var that = this;
    var proId = that.data.proId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/index',
      method: 'post',
      data: {
        pro_id: proId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var pro = res.data.pro;
          console.log(pro);
          that.setData({
            info: pro,
            imgUrls: pro.img_arr,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },

  //预订座位
  ydzw: function() {
    wx.navigateTo({
      url: '../dinner/dinner',
    })
  },

  addShopCart: function (e) { //添加到购物车
    var that = this;
    var ptype = e.currentTarget.dataset.type;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/add',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: that.data.proId,
        num: that.data.buynum,
        ptype: ptype
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data        
        var data = res.data;
        if (data.status == 1) {
          if (ptype == 'buynow') {
            wx.redirectTo({
              url: '../order/pay?cartId=' + data.cart_id
            });
            return;
          } else {
            wx.showModal({
              title: '提示',
              content: '加入成功，点击确定进入购物车结算！',
              cancelText: '再看看',
              cancelColor: "#D0D0D0",
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../ordering/ordering?cartId=' + data.cart_id,
                  })
                }
              }
            })
          }
        } else {
          wx.showToast({
            title: data.err,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var title = this.data.info.name;
    var proId = this.data.info.id;
    return {
      title: title,
      path: '/pages/product/product?proId=' + proId,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})