
// 获取全局应用程序实例对象
var app = getApp();
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'ordering',
    restaurant: {
      name: '快速点餐',
      menuList: [{
        title: '热销1',
        id: 'list1',
        list: [{
          img: 'http://img02.sogoucdn.com/app/a/100520024/3632f10de3c518742c429d859e345d5d',
          name: '红烧牛肉1',
          count: '1805',
          good: '173',
          price: '23.5',
          id: 'list1_1'
        }, {
            img:'http://img03.sogoucdn.com/app/a/100520024/2ec2bc7a188c2bf1f90328615de7859f',
          name: '红烧牛肉2',
          count: '1805',
          good: '173',
          price: '23.5',
          id: 'list1_2'
        }]
      }, {
        title: '热销2',
        id: 'list2',
        list: [{
          img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          name: '红烧牛肉1',
          count: '1805',
          good: '173',
          price: '23.5',
          id: 'list2_1'
        }, {
          name: '红烧牛肉4',
          count: '1805',
          good: '173',
          price: '23.5',
          id: 'list2_4'
        }]
      }, {
        title: '热销3',
        id: 'list3',
        list: [{
          img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          name: '红烧牛肉1',
          count: '1805',
          good: '173',
          price: '23.5'
        }]
      }],
    },

    // 当前的left栏
    currentleftmenu: 0,
    // 侧边栏联动当前值
    currentmenuid: 0,
    // 设置scroll-view的高度
    scrollHeight: 1100,
    needDistance: 0,
    scrollHeight2: 1200,
    showShopCarContent: false,
    showMask: false,
    list: [],
    cartlist: [],
    cartnum: 0,
    cartmoney: 0,
    ctype:'',
  },

  /**
   * 确认订单
   */
  goCheckOrder: function goCheckOrder() {
    // todo 提交订单信息，然后去到确认页面
    var num = this.data.cartnum;
    if (num<=0) {
      wx.showToast({
        title: '您还没有添加菜单到购物车！',
        duration: 2000
      });
      return false;
    }
    wx.navigateTo({
      url: '../payorder/payorder?operation=checkOrder'
    });
  },

  /**
   * 计算消费金额
   */
  calculateMoney: function calculateMoney() {
    var goods = this.data.chooseGoods.goods;
    var menuList = this.data.restaurant.menuList;
    var money = 0;
    var singleMoney = 0;
    for (var goodsId in goods) {
      // console.log(goodsId)
      // console.log(goods[goodsId])
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = menuList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var lists = _step.value;

          // console.log(lists)
          // 具体列表内的菜单
          var list = lists.list;
          // console.log(list)
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var goodsID = _step2.value;

              if (goodsID.id === goodsId) {
                // console.log(goodsID.price)
                // console.log(goods[goodsId])
                singleMoney = goodsID.price * goods[goodsId];
                // console.log('success')
              }
              // return console.log(goodsID)
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      money += singleMoney;
    }
    return money;
  },

  /**
   * 显示购物车内容
   */
  showContent: function showContent() {
    if (this.data.cartmoney <= 0) return;
    this.setData({
      showShopCarContent: !this.data.showShopCarContent,
      showMask: !this.data.showMask
    });
  },

  /**
   * 改变left menu选择
   * @param e
   */
  leftChoose: function leftChoose(e) {
    this.setData({
      currentleftmenu: e.currentTarget.dataset.menu,
      currentmenuid: e.currentTarget.dataset.menulistid
    });
  },

  /**
   * 添加商品
   * @param e
   */
  addorder: function addorder(e) {
    var cartid = e.currentTarget.dataset.id;
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/up_cart',
      method: 'post',
      data: {
        user_id: app.d.userId,
        cart_id: cartid,
        ctype: 'jia',
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          that.onShow();
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
   * 删除商品
   * @param e
   */
  delorder: function delorder(e) {
    var cartid = e.currentTarget.dataset.id;
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/up_cart',
      method: 'post',
      data: {
        user_id: app.d.userId,
        cart_id: cartid,
        ctype:'jian',
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          that.onShow();
        } else {
          wx.showToast({
            title: '操作失败！',
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

  //加入购物车
  addShopCart: function (e) { //添加到购物车
    var that = this;
    var pid = e.currentTarget.dataset.pid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/add',
      method: 'post',
      data: {
        uid: app.d.userId,
        pid: pid,
        num: 1,
        ptype: 'buycart'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data        
        var data = res.data;
        if (data.status == 1) {
          that.onShow();
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 改变标题栏文字
    var title = options.title;
    wx.setNavigationBarTitle({
      title: title,
    });
    var ctype = options.ctype;
    this.setData({
      ctype: ctype,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideToast();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Category/index',
      method: 'post',
      data: {
        uid:app.d.userId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        var cartlist = res.data.cartlist;
        var cartnum = res.data.cartnum;
        var cartmoney = res.data.cartmoney;
        var fee = res.data.fee;
        that.setData({
          list: list,
          cartlist: cartlist,
          cartnum: cartnum,
          cartmoney: cartmoney,
          fee: fee,
          currentleftmenu: list[0].id,
          currentmenuid: list[0].id,
        });
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
//# sourceMappingURL=ordering.js.map
