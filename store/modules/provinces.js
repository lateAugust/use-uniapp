export default {
  namespaced: true,
  state: {
    cityData: [],
    loading: false
  },
  actions: {
    getCityData({ state }) {
      return new Promise((resolve, rej) => {
        if (!state.cityData.length && !state.loading) {
          uni.getStorage({
            key: "cityData",
            success(data) {
              state.cityData = data.data;
              resolve(data);
            },
            fail(err) {
              state.loading = true;
              uni.request({
                url: "https://dev.km999.com:10088/api/city/all",
                success(res) {
                  let data = res.data;
                  if (data.data && data.data instanceof Array) {
                    state.cityData = data.data;
                    uni.setStorage({
                      key: "cityData",
                      data: data.data
                    });
                  } else {
                    data = {};
                    data.data = [];
                  }
                  resolve(data);
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
          resolve({ data: state.cityData });
        }
      });
    }
  },
  mutations: {}
};
