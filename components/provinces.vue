<template>
  <picker
    mode="multiSelector"
    :range="range"
    @columnchange="handleColumnChange"
    range-key="name"
    @change="handleChange"
    :value="vAsync"
  >
    <view class="picker" v-if="last" :class="[useStyle ? 'sel text-cut' : '']">
      {{ showTitle() }}
    </view>
    <view class="picker" v-else>
      {{ showTitle() }}
    </view>
  </picker>
</template>

<script>
import { mapActions } from "vuex";
let unlimited = {
  name: "不限",
  id: -10
};
export default {
  props: {
    last: {
      type: Boolean,
      default: false
    },
    useStyle: {
      type: Boolean,
      default: true
    },
    level: {
      type: Number,
      default: 2
    },
    /*
     * provinces, cities, district, area
     * */
    valueKey: {
      type: String,
      validator: val => {
        let array = ["provinces", "cities", "district", "area"];
        return !(val && !array.includes(val));
      },
      default: ""
    },
    /**
     * ['areas', 'district', 'cities']
     */
    limit: {
      type: Array,
      validator: val => {
        if (val.length > 3) return false;
        let array = ["areas", "district", "cities"];
        for (let item of val) {
          if (!array.includes(item)) return false;
        }
        return true;
      },
      default: () => []
    },
    placeholder: {
      type: String,
      default: "还未选择"
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      range: [],
      vAsync: [],
      clearContent: "",
      provinces: [],
      cityData: [],
      dUnlimited: false,
      cUnlimited: false,
      aUnlimited: false,
      valueType: {
        provinces: "",
        cities: "",
        district: "",
        area: ""
      }
    };
  },
  created() {
    this.getValue();
  },
  watch: {},
  computed: {},
  methods: {
    ...mapActions("pcd", ["getCityData"]),
    handleChange(e) {
      let [pIndex = -1, cIndex = -1, dIndex = -1, aIndex = -1] = e.detail.value;
      let range = this.range;
      let provinces = (range[0] || [])[pIndex] || {};
      let cities = (range[1] || [])[cIndex] || {};
      let district = (range[2] || [])[dIndex] || {};
      let area = (range[3] || [])[aIndex] || {};
      this.valueType = {
        provinces: provinces.name || "",
        cities: cities.name || "",
        district: district.name || "",
        area: area.name || ""
      };
      this.$emit("input", [provinces.id || null, cities.id || null, district.id || null, area.id || null]);
    },
    handleColumnChange(e) {
      let { column, value } = e.detail;
      let level = this.level;
      if (value === undefined) return;
      let vAsync = this.vAsync;
      let getIndex = this.getIndex;
      let cities = [];
      let district = [];
      let areas = [];
      switch (column) {
        case 0:
          cities = this.cityData[value].children;
          this.addUnlimited(cities, "cities");
          district = cities[getIndex(cities)].children;
          this.addUnlimited(district, "district");
          areas = district[getIndex(district)].children;
          this.addUnlimited(areas, "areas");
          if (level >= 2) this.range.splice(1, 1, cities);
          if (level >= 3) this.range.splice(2, 1, this.dUnlimited ? [unlimited] : district);
          if (level >= 4) this.range.splice(3, 1, this.aUnlimited ? [unlimited] : areas);
          this.vAsync = [value, 0, 0, 0];
          break;
        case 1:
          district = this.range[1][getIndex(this.range[1], value)].children;
          this.addUnlimited(district, "district");
          areas = district[getIndex(district)].children;
          this.addUnlimited(areas, "areas");
          if (level >= 3) {
            this.range.splice(2, 1, this.dUnlimited && (district[value] || {}).id === -10 ? [unlimited] : district);
          }
          if (level >= 4) this.range.splice(3, 1, this.aUnlimited ? [unlimited] : areas);
          this.vAsync = [vAsync[0], value, 0, 0];
          break;
        case 2:
          areas = this.range[2][getIndex(this.range[2], value)].children;
          this.addUnlimited(areas, "areas");
          if (level >= 4) {
            this.range.splice(3, 1, this.aUnlimited && (areas[value] || {}).id === -10 ? [unlimited] : areas);
          }
          this.vAsync = [vAsync[0], vAsync[1], value, 0];
          break;
      }
    },
    showTitle() {
      let title = "";
      if (this.valueKey) {
        title = this.valueType[this.valueKey] || "";
      } else {
        let array = [];
        for (let val of Object.values(this.valueType)) {
          val !== "不限" && val && array.push(val);
        }
        title = array.join(",");
      }
      return title || this.placeholder;
    },
    addUnlimited(data, key) {
      if (data[0] && data[0].id !== -10 && this.limit.includes(key)) {
        data.unshift(unlimited);
      }
    },
    getIndex(data, value) {
      let index = data[0].id === -10 ? 1 : 0;
      if (value !== undefined) {
        index = data && data[value].children ? value : index;
      }
      return index;
    },
    getValue() {
      this.getCityData().then(res => {
        let cityData = JSON.parse(JSON.stringify(res.data));
        this.cityData = cityData;
        let provinces = cityData.map(item => ({ name: item.name, id: item.id }));
        let cities = cityData[0].children;
        let district = cities[0].children;
        let areas = district[0].children;
        this.provinces = provinces;
        this.cUnlimited = this.limit.includes("cities");
        this.dUnlimited = this.limit.includes("district");
        this.aUnlimited = this.limit.includes("areas");
        /*this.addUnlimited(cities, "cities");
        this.addUnlimited(district, "district");
        this.addUnlimited(areas, "areas");*/
        let range = [];
        range.splice(0, 1, provinces);
        let level = this.level;
        if (level >= 2) {
          range.splice(1, 1, this.cUnlimited ? [unlimited] : cities);
        }
        if (level >= 3) {
          range.splice(2, 1, this.dUnlimited ? [unlimited] : district);
        }
        if (level >= 4) {
          range.splice(3, 1, this.aUnlimited ? [unlimited] : areas);
        }
        this.range = range;
        this.setValue();
      });
    },
    setValue() {
      let v = this.value;
      let len = v.length;
      if (len) {
        let level = this.level;
        let cityData = this.cityData;
        let [pIndex, cIndex, dIndex, aIndex] = [-1, -1, -1, -1];
        pIndex = this.provinces.findIndex(item => item.id === v[0]);
        let range = [this.provinces];
        this.valueType.provinces = this.provinces[pIndex].name;
        let [district, cities, areas] = [[], [], []];
        if (len >= 2 && level >= 2) {
          cities = cityData[pIndex].children;
          this.addUnlimited(cities, "cities");
          cIndex = cities.findIndex(item => item.id === v[1]);
          this.valueType.cities = (cities[cIndex] || {}).name || "";
          range.push(cities);
        }
        if (len >= 3 && level >= 3) {
          district = (cities[cIndex] || {}).children || [];
          this.addUnlimited(district, "district");
          dIndex = district.findIndex(item => item.id === v[2]);
          this.valueType.district = (district[dIndex] || {}).name || "";
          range.push(district);
        }
        if (len >= 4 && level >= 4) {
          areas = (district[dIndex] || {}).children || [];
          this.addUnlimited(areas, "areas");
          aIndex = areas.findIndex(item => item.id === v[3]);
          this.valueType.area = (areas[aIndex] || {}).name || "";
          range.push(areas);
        }
        this.range = range;
        this.vAsync = [
          pIndex,
          this.cUnlimited && cIndex === -1 ? 0 : cIndex,
          this.dUnlimited && dIndex === -1 ? 0 : dIndex,
          this.aUnlimited && aIndex === -1 ? 0 : aIndex
        ];
      }
    }
  }
};
</script>

<style scoped>
.last-style {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1000 !important;
  line-height: 2 !important;
  text-indent: 6rpx !important;
}
.sel {
  position: relative;
  min-width: 90rpx;
  max-width: 135rpx;
  height: 58rpx;
  padding-right: 26rpx;
  /*border: 1px solid #ccc;*/
  margin-right: 10rpx;
  line-height: 2.3;
  overflow: hidden;
}
.sel:after {
  content: "";
  position: absolute;
  right: 0rpx;
  top: 48%;
  width: 0;
  height: 0;
  border: 12rpx solid;
  border-color: #000 transparent transparent;
}
</style>
