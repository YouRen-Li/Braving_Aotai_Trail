<template>
    <view class="notification-container" :class="{ active: visible, 'negative': type === 'negative' }">
        <view class="notification-content">
            <view class="icon-box">
                <text class="icon">{{ icon }}</text>
            </view>
            <text class="message">{{ message }}</text>
        </view>
        <view class="scan-line"></view>
    </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    visible: Boolean,
    message: String,
    type: {
        type: String,
        default: 'normal' // normal, negative, success
    }
});

const icon = computed(() => {
    switch (props.type) {
        case 'negative': return '⚠️';
        case 'success': return '✅';
        default: return 'ℹ️';
    }
});
</script>

<style lang="scss" scoped>
.notification-container {
    position: fixed;
    top: 140rpx;
    /* Below status bar */
    left: 50%;
    transform: translateX(-50%) translateY(-20rpx);
    width: 90%;
    max-width: 600rpx;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #444;
    padding: 20rpx 30rpx;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    pointer-events: none;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    z-index: 1000;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.5);

    &.active {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    &.negative {
        border-color: #ff3333;
        background: rgba(30, 0, 0, 0.9);

        .message {
            color: #ffcccc;
        }
    }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.icon {
    font-size: 32rpx;
}

.message {
    font-size: 28rpx;
    color: #e0e0e0;
    font-family: monospace;
    line-height: 1.4;
}

.scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.05), transparent);
    animation: scan 2s linear infinite;
    pointer-events: none;
}

@keyframes scan {
    0% {
        transform: translateY(-100%);
    }

    100% {
        transform: translateY(100%);
    }
}
</style>
