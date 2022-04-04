<template>
  <div class="wrapper">
    <h2>分类</h2>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Category",
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      // console.log(document.querySelector('.wrapper'))
      this.scroll = new BScroll(document.querySelector('.wrapper'), {
        //实时监听
        probeType:3,
        //上拉在家更多
        pullUpLoad:true
      });
      this.scroll.on('scroll',position=>{
        // console.log(position)
      })
      this.scroll.on('pullingUp',()=>{
        console.log('上拉加载更多')
      })

    }
  }
</script>

<style scoped>

</style>
