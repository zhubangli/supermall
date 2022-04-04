<template>
  <div id="detail">
    <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick"/>
<!--    <h1>{{$store.state.cartList}}</h1>-->
    <scroll @scroll="contentScroll" class="content" ref="scroll" :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addCart"/>
  </div>
</template>

<script>
  import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
  import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
  import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
  import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
  import Scroll from "@/components/common/scroll/Scroll";
  import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
  import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
  import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
  import GoodsList from "@/components/content/goods/GoodsList";
  import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

  import {debounce} from "@/common/utils";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";

  export default {
    name: "Detail",
    components: {
      DetailShopInfo,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created() {
      this.iid = this.$route.params.iid
      getDetail(this.iid).then(res => {
        // console.log(res)
        //获取顶部的图片轮播数据
        const data = res.result
        this.topImages = data.itemInfo.topImages
        //获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
        //创建店铺信息
        this.shop = new Shop(data.shopInfo)
        //保存详情数据
        this.detailInfo = data.detailInfo
        //获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);
        //获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        // this.$nextTick(() => {
        //   //根据最新的数据，DOM已经渲染完成，但图片没被加载
        //   //一般offsetTop值不对都是因为图片没被加载
        //   this.themeTopYs = []
        //   //获取页面的offset
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //   console.log(this.themeTopYs)
        // })
      })
      //请求推荐数据
      getRecommend().then(res => {
        // console.log(res)
        this.recommends = res.data.list
      });
      //给getThemeTopY赋值,进行防抖
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        //获取页面的offset
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs)
      }, 500)
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        console.log(index)
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      //监听滚动
      contentScroll(position) {
        const positionY = -position.y
        // console.log(positionY)
        //与主题的y值对比
        let length = this.themeTopYs.length
        for (let i = 0; i < length; i++) {
          if (this.currentIndex !== i && ((i < length - 1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY > this.themeTopYs[i]))) {
            this.currentIndex = i
            // console.log(this.currentIndex)
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      },
      //监听加入购物车
      addCart: function () {
        //获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        //将商品添加到购物车
        this.$store.commit('addCart', product)

        this.$toast.show('商品已添加至购物车')
      }
    },
    mounted() {
    },
    updated() {
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
