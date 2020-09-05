import Vuex from "vuex";
import Vue from "vue";
import pcd from "./modules/pcd";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    pcd,
  },
});
