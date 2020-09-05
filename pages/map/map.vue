<template>
	<view class="padding-sm"><map :longitude="marker.longitude" :latitude="marker.latitude" :makers="[marker]" show-scale show-location :scale="12"></map></view>
</template>

<script>
export default {
	data() {
		return {
			marker: {
				id: new Date().getTime(),
				longitude: '102.70944',
				latitude: '25.02361' // 纬度
			}
		};
	},
	methods: {}
};
</script>

<style></style>
