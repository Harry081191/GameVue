import { createStore } from "vuex";

export default createStore({
  state: {
    sharedUid: "" // 定义您要共享的变量
  },
  getters: {
    getSharedUid: (state) => state.sharedUid
  },
  mutations: {
    setSharedUid(state, value) {
      state.sharedUid = value;
    }
  },
  actions: {
    updateSharedUid({ commit }, value) {
      commit("setSharedUid", value);
    }
  },
  modules: {}
})
