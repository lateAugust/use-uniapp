<template>
	<view>
		<view class="box" :style="{height: height}">
            <button @tap="open">展开</button>
            <view>
                <view></view>
                <view style="height: 800rpx">22344</view>
            </view>
        </view>
        <swiper style="height: 500px">
            <swiper-item v-for="(item,index) of '0000000'" :key="index">
                {{item }}{{index}}
            </swiper-item>
        </swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				height: '400rpx'
			}
		},
		methods: {
			open() {
			    this.height = '900rpx';
            }
		}
	}
</script>

<style>
.box {
    width: 100%;
    height: 100px;
    border-bottom: 1px solid red;
    transition: all 0.5s ease;
}
</style>
