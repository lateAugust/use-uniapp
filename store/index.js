import Vuex from "vuex";
import Vue from "vue";
import provinces from "./modules/provinces";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    provinces,
  },
});
