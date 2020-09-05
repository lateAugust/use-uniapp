export default {
  namespaced: true,
  state: {
    cityData: [],
    loading: false
  },
  actions: {
    getCityData({ state }) {
      return new Promise((res, rej) => {
        if (!state.cityData.length && !state.loading) {
          uni.getStorage({
            key: "cityData",
            success(data) {
              state.cityData = data.data;
              res(data);
            },
            fail(err) {
              state.loading = true;
              uni.request({
                url: "http://192.168.3.92:9902",
                success(res) {
                  state.cityData = res.data;
                  uni.setStorage({
                    key: "cityData",
                    data: res.data
                  });
                  res(res);
                },
                fail(err) {
                  rej(err);
                },
                complete() {
                  state.loading = false;
                }
              });
            }
          });
        } else {
          res({ data: state.cityData });
        }
      });
    }
  },
  mutations: {}
};
