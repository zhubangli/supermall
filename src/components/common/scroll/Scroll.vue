<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad:{
        type: Boolean,
        //返回值为对象或数组时，default必须是函数
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad:this.pullUpLoad
      })
      //监听滚动位置
      this.scroll.on('scroll', position => {
        this.$emit('scroll', position)
      })
      //监听滚动到底部
      if (this.pullUpLoad){
        this.scroll.on('pullingUp',()=>{
          // console.log('到底啦')
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      scrollTo(x, y, time = 300) {
        this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll.finishPullUp()
      },
      refresh(){
        // console.log('---')
        this.scroll && this.scroll.refresh()
      }
    }
  }
</script>

<style scoped>

</style>
