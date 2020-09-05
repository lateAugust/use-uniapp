<template>
  <div class="padding">
    <pcd v-model="value" :level="level" :limit="limit"></pcd>
  </div>
</template>

<script>
import pcd from "../../components/provinces";
export default {
  components: {
    pcd
  },
  data() {
    return {
      value: [4, 37, 38, 2725], //[12, 8601, 8883, 31744] 9, 2394, 8886, 31405
      limit: ["areas", "district", "cities"], // 'areas', 'district', 'cities'
      level: 4
    };
  }
};
</script>
