<template>
    <view class="bag-btn" hover-class="btn-hover" @click="$emit('click')">
        <text class="icon">🎒</text>
        <text class="label">背包</text>
    </view>
</template>

<script setup>
defineEmits(['click']);
</script>

<style lang="scss" scoped>
.bag-btn {
    position: fixed;
    top: 40rpx; // Align with status bar top padding roughly, or adjust later
    right: 30rpx;
    z-index: 101; // Above status bar if needed, or same level
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border: 1rpx solid rgba(255, 255, 255, 0.1);
    border-radius: 40rpx;
    padding: 12rpx 24rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    transition: all 0.2s;

    &.btn-hover {
        transform: scale(0.95);
        background: rgba(0, 0, 0, 0.8);
    }

    .icon {
        font-size: 32rpx;
    }

    .label {
        font-size: 24rpx;
        color: #fff;
        font-weight: 600;
    }
}
</style>
