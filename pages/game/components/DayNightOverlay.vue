<template>
    <view class="day-night-overlay" :class="{ 'is-night': isNight, 'has-vision': hasVision }">
        <!-- Darkness Layer -->
        <view class="darkness"></view>
    </view>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    isNight: {
        type: Boolean,
        default: false
    },
    hasVision: {
        type: Boolean,
        default: true
    }
});
</script>

<style lang="scss" scoped>
.day-night-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; // Allow clicks through
    z-index: 20; // Above scene, below UI status bar? No, maybe below status bar (100)
    transition: opacity 1s ease;
    opacity: 0;

    &.is-night {
        opacity: 1;

        .darkness {
            background: rgba(0, 0, 0, 0.95); // Deep darkness
        }

        &.has-vision .darkness {
            // Spotlight effect
            // Transparent circle in center, fading to black
            background: radial-gradient(circle at 50% 40%, transparent 150rpx, rgba(0, 0, 0, 0.95) 400rpx);
        }
    }
}

.darkness {
    width: 100%;
    height: 100%;
    background: transparent;
    transition: background 0.5s ease;
}
</style>
