// pages/category/index.js

// 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from '../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 接口的返回数据
    Cates: [],

    //左侧的菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],

    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离底部的距离
    scrollTop: 0,

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 因为后台数据返回太多 加载时间长 需要做优化

    /* 
      0. web中的本地存储和小程序中的本地存储的区别
         1. 写代码的方式不一样了
         web： localStorage.setItem('key','value')  localStorage.getItem('key')
     小程序中： wx.setStorageSync('key', 'value')     wx.getStorageSync('key') 
         2. 存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据 ，最终都会先调用以下 toString(),把数据变成了字符串 在存入进去
    小程序中：不存在类型转换的这个操作 存什么类型的数据进去 ，获取的时候就是什么类型
       1.先判断一下本地存储中有没有旧的数据
        {time:Data.now(),data:[...]}
       2.没有旧数据 直接发送新请求
       3. 有旧的数据 同时 旧的数据没有过期 就使用 本地存储中的旧数据即可
    */
    //  1. 获取本地存储中的数据（小程序中也是存在本地存储 技术）
    const Cates = wx.getStorageSync('cates')
    //2 判断
    if (!Cates) {
      //不存在 就发送请求获取数据
      this.getCates();
    } else {
      //有旧的数据 定义过期的时间 10s 之后再改为5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getCates();
      } else {
        //可以使用旧的数据
        // console.log('可以使用旧的数据')
        this.Cates = Cates.data;

        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })

      }
    }

  },

  //获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then(res => {
    //   console.log(res);
    //   this.Cates = res.data.message;

    //   // 把请求接口回来的数据存入到本地存储中
    //   wx.setStorageSync("cates", {
    //     time: Date.now(),
    //     data: this.Cates
    //   });

    //   //构造左侧的大菜单数据 map 遍历数组方法
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   //构造右侧的商品数据 首先显示的是大家电的数据（第一个）
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    //1.使用es7 的async await来发送请求
    const res = await request({url:"/categories"})
      this.Cates = res.data.message;

      // 把请求接口回来的数据存入到本地存储中
      wx.setStorageSync("cates", {
        time: Date.now(),
        data: this.Cates
      });

      //构造左侧的大菜单数据 map 遍历数组方法
      let leftMenuList = this.Cates.map(v => v.cat_name);
      //构造右侧的商品数据 首先显示的是大家电的数据（第一个）
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
  },
  //左侧菜单点击事件
  handleItemTap(e) {
    // 1 获取被点击的标题身上的索引
    // 2 给data中的currentIndex赋值就可以了
    // 3 根据不的索引来渲染右侧的商品内容
    const {
      index
    } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rightContent,
      // 点击时重新设置右侧scroll-view标签的距离顶部的距离
      scrollTop: 0
    })

  }
})