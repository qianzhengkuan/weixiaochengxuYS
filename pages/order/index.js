// pages/order/index.js

// 引入 用来发送请求的 方法 一定要把路径补全
import { request } from "../../request/index.js";
/** 
 1 页面被打开的时候 onShow
   0 onShow 不同于onLoad 无法在形参上接收options参数
   0.5  判断缓存中有没有token
      1 没有 直接跳转到授权页面
      2 有 直接往下进行
   1 获取URL上的参数type
   2 根据type 来决定页面标题的数组元素 哪个被激活选中
   2 根据type 去发送请求获取订单数据
   3 渲染页面
 2 点击不同的标题 重新发送请求来获取和渲染数据
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // tab栏数据
     tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true,
      },
      {
        id: 1,
        value: "待付款",
        isActive: false,
      },
      {
        id: 2,
        value: "待发货",
        isActive: false,
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false,
      },
    ],
  },

onShow(options){
  // const token = wx.getStorageSync('token');
  // if(!token){
  //   wx.navigateTo({
  //     url:"/pages/auth/index"
  //   });
  //   return;
  // }

  // console.log(options); 拿不到type
  // 1 获取当前的小程序的页面栈-数组 长度最大是10个页面
  let pages =  getCurrentPages();
  // 2 数组中 索引最大的页面就是当前页面
  let currentPage= pages[pages.length-1];
  // console.log(currentPage.options);
 
  // 3 获取url上的type的参数
  const {type} = currentPage.options;

   // 4 根据type值 激活选中页面标题 当type=1 index=0
   this.changeTitleByIndex(type-1)

  this.getOrders(type)
},
//获取订单列表的方法 要传个type参数
async getOrders(type){
  const res = await request({url:"/my/orders/all",data:{type}});
  console.log(res);
  
},

// 根据标题索引来激活选中 标题数组
changeTitleByIndex(index){
   //2 修改源数组
   let { tabs } = this.data;
   tabs.forEach((v, i) =>
     i === index ? (v.isActive = true) : (v.isActive = false)
   );
   //3 赋值到data中
   this.setData({
     tabs,
   });
},
   // 标题的点击事件  从子组件传递过来的
   handleTabsItemChange(e) {
    // console.log(e)
    //1 获取被点击的标题索引
    const { index } = e.detail;
    // 调用方法
    this.changeTitleByIndex(index);

    // 2 切换tab栏 时 重新发送请求 type=1 index=0
    this.getOrders(index+1)
  },

 
  
})