// pages/cart/index.js

/*

1 获取用户的收货地址
 1 绑定点击事件
 2 调用小程序内置api 获取用户收货地址

 2 获取 用户 对小程序 所授权 获取地址的权限 状态 scope
   1 假设 用户 点击获取收货地址的提示框  确定 authSetting scope.address;
   scope 值 true 直接调用获取收货地址
   2 假设 用户 点击获取收货地址的提示框  取消
     scope 值 false
     1 引导用户 自己打开授权设置页面 当用户重新给与 获取地址权限的时候
     2 获取收货地址

   3 假设 用户 从来没有调用过 收货地址的api
     scope undefined 直接调用获取收货地址
   4 把获取的收货地址 存入到 本地存储中
2 页面加载完毕(收货地址)
  0 onLoad  onShow(购物车页面会频繁切换)
  1 获取本地存储中的地址数据
  2 把数据 设置给data中的一个变量

3 onShow
  0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性（选中框选中）
    1 num=1
    2 checked=true
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中

4 全选的实现 数据的展示
  1 onShow 获取缓存中的商品数据
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格  += 商品的单价 * 商品的数量
    总数量  += 商品数量
  6 把计算后的价格和数量 设置会data中即可
6 商品选中
  1 绑定chang事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算算全选 、总价格、总数量
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取data中的全选变量 allCheckde
  3 直接取反 allCheckded=!allChecked
  4 遍历购物车数组 让里面商品选中状态跟随 allChecked改变而改变
  5 把购车车数组 和allChecked 重新设置回data 把购物车重新设置回缓存中
8 商品数量的编辑
  1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性
    1 "+" "+1"
    2 "-" "-1"
  2 传递 被点击的商品id goods_id 
  3 获取data中购物车数组 来获取需要被修改的商品对象
  4 直接修改商品对象的数量num
  5 把cart数组 重新设置回缓存中
9 当购物车的数量=1 同时用户点击"- ""
   弹窗提示 询问用户 是否要删除
   1 确定 直接执行删除
   2 取消 什么都不做
10 点击结算
   1 判断有没有收货地址信息
   2 判断用户有没有选购商品
   3 经过以上验证 跳转到支付页面

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
    const cart = wx.getStorageSync("cart") || []; //也有可能是空数组
    // 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every方法的返回值未true
    // 只要有一个回调函数返回了false 那么不在循环执行，直接返回false
    const allChecked = cart.length ? cart.every(v => v.checked) : false; //当cart数组为空 长度为0 时不全选中
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      }
    })
    // 2 给data赋值
    this.setData({
      address,
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
  },

  //点击 收货地址
  handleChooseAddress() {
    // 1 获取权限状态
    wx.getSetting({
      success: (result) => {
        //2 获取权限状态 主要发现一些属性名很怪异的时候 都要使用[]形式来获取属性值
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          wx.chooseAddress({
            success: (result1) => {
              console.log(result1);
              const address = result1
              wx.setStorageSync("address", address)
            },
          })
        } else {
          // 3 用户以前拒绝过授权 先诱导用户打开授权页面
          wx.openSetting({
            success: (result2) => {
              console.log(result2)
              //4 可以调用 收货地址代码
              wx.chooseAddress({
                success: (result3) => {
                  console.log(result3)
                  const address = result3
                  wx.setStorageSync("address", address)
                },
              })
            },
          })
        }
      }
    })

  },

  // 商品选中
  handleItemChange(e) {
    // 1 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let {
      cart
    } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5 6 把购车车数据重新设置回data中和缓存中
    this.setData({
      cart
    });
    wx.setStorageSync('cart', cart);
    // 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every方法的返回值未true
    // 只要有一个回调函数返回了false 那么不在循环执行，直接返回false
    const allChecked = cart.length ? cart.every(v => v.checked) : false; //当cart数组为空 长度为0 时不全选中
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      }
    })
    // 2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
  },
  // 商品全选
  handleItemAllCheck() {
    //1 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    //2 修改值
    allChecked = !allChecked;
    //3 循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4把修改后的值 填充回data或缓存中

    this.setData({
      cart
    });
    wx.setStorageSync('cart', cart);
    // 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every方法的返回值未true
    // 只要有一个回调函数返回了false 那么不在循环执行，直接返回false
    cart.length ? cart.every(v => v.checked) : false; //当cart数组为空 长度为0 时不全选中
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      }
    })
    // 2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
  },
  // 商品数量的编辑功能
  handleItemNumEdit(e) {
    // 获取传递过来的参数
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    // console.log(operation,id)
    // 获取购物车数组
    let {
      cart
    } = this.data;
    //  找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 9 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      wx.showModal({
        title: '提示',
        content: "你是否要删除?",
        success: res => {
          if (res.confirm) {
            cart.splice(index,1);
            this.setData({
              cart
            });
            wx.setStorageSync('cart', cart);
            // 计算全选
            // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every方法的返回值未true
            // 只要有一个回调函数返回了false 那么不在循环执行，直接返回false
            const allChecked = cart.length ? cart.every(v => v.checked) : false; //当cart数组为空 长度为0 时不全选中
            // 1 总价格 总数量
            let totalPrice = 0;
            let totalNum = 0;
            cart.forEach(v => {
              if (v.checked) {
                totalPrice += v.num * v.goods_price;
                totalNum += v.num
              }
            })
            // 2 给data赋值
            this.setData({
              cart,
              allChecked,
              totalPrice,
              totalNum
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })
    }
    //  进行修改数量
    cart[index].num += operation;
    // 设置回缓存和data中
    this.setData({
      cart
    });
    wx.setStorageSync('cart', cart);
    // 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every方法的返回值未true
    // 只要有一个回调函数返回了false 那么不在循环执行，直接返回false
    const allChecked = cart.length ? cart.every(v => v.checked) : false; //当cart数组为空 长度为0 时不全选中
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      }
    })
    // 2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
  },
  // 点击结算
  handlePay(){
    // 1 判断收货地址
    const {address,totalNum} =this.data;
    if(!address.userName){
      wx.showToast({
        title: '你还没有选收货地址',
      })
      return;
    }
    // 判断用户有没有选购商品
    if(totalNum===0){
      wx.showToast({
        title: '你还没有选购商品',
      })
      return;
    }
    //  跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})