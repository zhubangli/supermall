import Vue from 'vue'
import Vuex from 'vuex'
import getters from "@/store/getters";

//安装插件
Vue.use(Vuex)

//创建Store对象
const store = new Vuex.Store({
  getters,
  state: {
    cartList: []
  },
  mutations: {
    //mutation 唯一的目的就是修改state中状态
    //mutation 中的每个方法尽可能完成的事件比较单一
    addCart(state, payload) {
      let oldProduct = null
      for (let item of state.cartList) {
        if (item.iid === payload.iid) {
          oldProduct = item
        }
      }

      if (oldProduct) {
        //商品数量加一
        oldProduct.count += 1;
      } else {
        //加入新商品
        payload.count = 1
        payload.checked = true
        state.cartList.push(payload);
      }

    }
  }
})

//挂载Vue实例上
export default store
