<template>
  <div class="nav-bar">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NavBar"
  }
</script>

<style scoped>
  .nav-bar {
    display: flex;
    /*需要有内容才显示高度*/
    line-height: 44px;
    height: 44px;
    text-align: center;
    /*background-color: #ff8198;*/
    box-shadow: 0 1px 5px #ff8198;
  }

  .left, .right {
    width: 60px;
    /*background-color: red;*/
  }

  .center {
    flex: 1;
    /*background-color: blue;*/
  }

</style>
