<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed">
    </tab-control>

    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
                   @swiperImageLoad="swiperImageLoad">
      </home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2">
      </tab-control>
      <goods-list :goods=showGoods></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from "@/views/home/childComps/HomeSwiper";
  import RecommendView from "@/views/home/childComps/RecommendView";
  import FeatureView from "@/views/home/childComps/FeatureView";

  import TabControl from "@/components/content/tabControl/TabControl";
  import GoodsList from "@/components/content/goods/GoodsList";
  import NavBar from "@/components/common/navbar/NavBar";
  import Scroll from "@/components/common/scroll/Scroll";
  import BackTop from "@/components/content/backTop/BackTop";

  import {getHomeMultidata, getHomeGoods} from "@/network/home";

  import {debounce} from "@/common/utils";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: true,
        isTabFixed: false,
        tabOffsetTop: 0,
        saveY: 0
      }
    },
    created() {
      //请求数据
      this.getHomeMultidata()

      //请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      //监听item图片加载完成
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      loadMore() {
        // console.log('到底啦')
        this.getHomeGoods(this.currentType)
      },
      debounce(func, delay) {
        let timer = null
        return function (...args) {
          if (timer) clearTimeout(timer)
          timer = setTimeout(() => {
            func.apply(this, args)
          }, delay)
        }
      },
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        // console.log('backclick')
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      contentScroll(position) {
        // console.log(position)
        this.isShowBackTop = -position.y > 1000
        //决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      /**
       * 网络请求相关方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log('getHomeMultidata')
          // console.log(res)
          // console.log('getHomeMultidata')
          //保存数据
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // console.log(type)
          // console.log(res)
          // console.log(type)
          //保存数据
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //完成下拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    mounted() {
      const refresh = debounce(this.$refs.scroll.refresh, 100)
      this.$bus.$on('itemImageLoad', () => {
        // console.log('---')
        // this.$refs.scroll.refresh()
        refresh()
      })
      //获取tabControl的offsetTop
      //所有组件都有一个属性$el,用于获取组件中的元素
    },
    beforeDestroy() {
      this.$bus.$off()
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // console.log(this.saveY)
      this.saveY = this.$refs.scroll.scroll.y
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: #ff8198;
    color: white;

    /*使用原生滚动，为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
  }
</style>
