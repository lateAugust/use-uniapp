<template>
  <div class="padding">
    <provinces v-model="value" :level="level" :limit="limit"></provinces>
  </div>
</template>

<script>
import provinces from "../../components/provinces";
export default {
  components: {
    provinces
  },
  data() {
    return {
      value: [], //[12, 8601, 8883, 31744] 9, 2394, 8886, 31405
      limit: ["district"], // 'areas', 'district', 'cities'
      level: 4
    };
  },
  mounted() {
    setTimeout(() => {
      this.value = [9, 2389];
    }, 1500);
  }
};
</script>
