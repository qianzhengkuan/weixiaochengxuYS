/*
一 点击轮播图 预览大图
 1.给轮播图绑定点击事件
 2.调用小程序的api previewImae
二 点击加入购物车
 1 先绑定点击事件
 2 获取缓存中的购物车数据 数组格式
 3 先判断 当前的商品是否已经存在于 购物车
 4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓冲中
 5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 带上 购买数量属性 num 重新把购物车数组 填充回缓冲中
 6 弹出提示信息

 三.商品收藏
   1页面onShow的时候 加载缓存中的商品收藏的数据
   2判断当前商品是不是被收藏
    1 是 改变页面的图标
    2 不是。。。
   3点击商品收藏按钮
    1判断该商品是否存在于缓存数组中
    2已经存在 把该商品删除
    3没有存在 把商品添加到收藏数组中 存入到缓存中即可
*/

// 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";

// pages/goos_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}, //商品详情数据
    isCollect: false, //商品是否被收藏过
  },

  //商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品详情的id
    const {
      goods_id
    } = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);

  },
  // onShow: function () {
  //   let pages = getCurrentPages();
  //   let currentPage = pages[pages.lenght - 1];
  //   let options = currentPage.options;
  //   const {
  //     goods_id
  //   } = options;
  //   this.getGoodsDetail(goods_id);
  // },


  //  获取商品详情数据 根据goods_id 发送请求
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    });
    this.GoodsInfo = goodsObj;

    // 1获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否被收藏 some方法只要有一个返回为ture就为ture
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.data.message.goods_id);

    // console.log(res)
    this.setData({
      //返回的数据太多 优化用到的
      goodsObj: {
        goods_name: goodsObj.data.message.goods_name,
        goods_price: goodsObj.data.message.goods_price,
        pics: goodsObj.data.message.pics,
        // goods_introduce:res.data.message.goods_introduce，
        //iphohe部分手机 不知别 webp图片格式
        // 找后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp => 1.jpg 用正则改
        goods_introduce: goodsObj.data.message.goods_introduce.replace(/\.webp/g, '.jpg')
      },
      isCollect
    })
  },
  // 点击轮播图 方大图片预览
  handlePrevewImage(e) {
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.data.message.pics.map(v => v.pics_mid);
    // 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //点击加入购物车
  handleCarAdd() {
    // 1 获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || []; //第一次进来转换为新数组
    // 2 判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.data.message.goods_id)
    if (index === -1) {
      //3 不存在 第一次添加
      this.GoodsInfo.data.message.num = 1;
      this.GoodsInfo.data.message.checked = true; //回到了商品详情页面 第一次添加商品的时候 手动添加了属性（选中框选中）
      cart.push(this.GoodsInfo.data.message);
    } else {
      //4 已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    //5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart)
    //6 弹框提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      // true 防止用户 手抖  疯狂点击
      mask: true
    })

  },

// 点击收藏
handleCollect(){
 let isCollect = false;
//  1 获取缓存中的商品收藏数组
let collect = wx.getStorageSync('collect')||[];
// 2 判断该商品是否被收藏过
let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.data.message.goods_id);
// 3 当index!=-1 表示 已经收藏过
if(index!=-1){
  // 能找到 已经收藏过  在数组中删除该商品
  collect.splice(index,1);
  isCollect=false;
  wx.showToast({
    title: '取消收藏',
    icon:'success',
    mask:true
  })
}else{
  // 没有收藏过
  collect.push(this.GoodsInfo.data.message);
  isCollect=true;
  wx.showToast({
    title: '收藏成功',
    icon:'success',
    mask:true
  })
}
// 4 把数组存入到缓存中
wx.setStorageSync('collect', collect);
// 5 修改data中的属性 isCollect
this.setData({
  isCollect
})
}


})