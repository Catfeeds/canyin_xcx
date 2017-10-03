// pages/time_quantum/time_quantum.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //先设置隐藏
    showModalStatus: false,
    bookId: 0,
    list:[],
    info:{},
    mini:{},
  },
  powerDrawer: function (e) {
    // var currentStatu = e.currentTarget.dataset.statu;
    // this.util(currentStatu)
    var that = this;
    var id = e.currentTarget.dataset.id;
    var tablenum = e.currentTarget.dataset.tablenum;
    var tabletype = e.currentTarget.dataset.tabletype;
    var price = e.currentTarget.dataset.price;
    if(price>0){
      var content = '您选择的是 ' + tablenum + tabletype + ' ,预订金：' + price+' , 是否确认？';
    }else{
      var content = '您选择的是 ' + tablenum + tabletype + ' ,是否确认？';
    }
    var bookId = that.data.bookId;
    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/User/setseat',
          method: 'post',
          data: {
            bookId: bookId,
            tablenum: id,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if (status == 1) {
              wx.showToast({
                title: '预订成功！',
                duration: 2000
              });
              if (price>0) {
                setTimeout(function () {
                  that.wxpay(order);
                }, 2300);
              }else {
                setTimeout(function () {
                  that.onShow();
                }, 2300);
              }
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
      }
    });
  },

  //调起微信支付
  wxpay: function (order) {
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order.order_id,
        order_sn: order.order_sn,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../dingdan/dingdan?currentTab=1&otype=deliver',
                });
              }, 2300);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 2000
              })
            }
          })
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
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },

  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  // tab切换
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    console.log("----" + _datasetId + "----");
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },


  tiqian:function(){
     wx.navigateTo({
       url: '../ordering/ordering',
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bookId = options.bookId;
    this.setData({
      bookId: bookId,
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
    var bookId = that.data.bookId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getseat',
      method: 'post',
      data: {
        bookId: bookId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          var info = res.data.info;
          var list = res.data.list;
          var mini = res.data.mini;
          that.setData({
            info: info,
            list: list,
            mini: mini
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