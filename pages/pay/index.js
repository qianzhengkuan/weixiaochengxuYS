// pages/cart/index.js
/**
 1 页面加载的时候
   1 从缓存中获取购物车数据 渲染到页面中
     这些数据 checked=true
2 微信支付
  1 哪些人 哪些账号 可以实现微信支付
    1 企业账号
    2 企业账号的小程序后台中必须给开发者 添加上白名单
      1 一个APPID 可以同时绑定多个开发者
      2 这些开发者就可以公用者个APPID 和 它的开发权限
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token
  3 有token。。。
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}, //收货地址
    cart: [], //购物车数组
    allChecked: false, //全选默认未选中
    totalPrice: 0, //总价格
    totalNum: 0, //总数量

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow() {
    //  1 获取 缓存中的收货地址信息
    const address = wx.getStorageSync("address");

    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || []; //也有可能是空数组
    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked)
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
    })
    // 2 给data赋值
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },

  // 点击支付
  handlePrderPay(){
    //1 判断缓存中有没有token
    const token =wx.getStorageSync("token");
    //2 判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    console.log("已经存在token");
    
  }
  
})