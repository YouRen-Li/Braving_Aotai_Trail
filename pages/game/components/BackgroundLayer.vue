<template>
    <view class="bg-container">
        <!-- Old Background (fading out) -->
        <image v-if="lastBg" class="bg-image fading" :src="lastBg" mode="aspectFill" />

        <!-- New Background (fading in) -->
        <image class="bg-image" :src="currentBg" mode="aspectFill" :class="{ 'fade-in': isTransitioning }" />

        <!-- Overlay for darkening -->
        <view class="overlay"></view>
    </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useGameStore } from '@/stores/modules/game';

const gameStore = useGameStore();

const weatherMap = {
    'sunny': '/static/images/bg_sunny.png',
    'cloudy': '/static/images/bg_sunny.png', // Reuse sunny for now or make a cloudy var
    'fog': '/static/images/bg_fog.png',
    'snow': '/static/images/bg_snow.png',
    'storm': '/static/images/bg_storm.png'
};

const currentBg = ref(weatherMap['sunny']);
const lastBg = ref('');
const isTransitioning = ref(false);

const currentScene = computed(() => gameStore.currentScene);
const weather = computed(() => gameStore.weather);

// Priority: Scene BG > Weather BG
const targetBg = computed(() => {
    if (currentScene.value && currentScene.value.bg) {
        return `/static/images/${currentScene.value.bg}.png`;
    }
    const w = weather.value || 'sunny';
    return weatherMap[w] || weatherMap['sunny'];
});

watch(targetBg, (newSrc) => {
    if (newSrc !== currentBg.value) {
        lastBg.value = currentBg.value;
        currentBg.value = newSrc;
        isTransitioning.value = true;

        setTimeout(() => {
            lastBg.value = '';
            isTransitioning.value = false;
        }, 1000);
    }
}, { immediate: true });

</script>

<style lang="scss" scoped>
.bg-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; // Behind everything
    pointer-events: none;
    overflow: hidden;
}

.bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 1s ease-in-out;
}

.fading {
    z-index: 1;
    opacity: 0; // Will fade out as new one is on top? 
    // Actually standard crossfade: 
    // Old one is z-index 1, New one z-index 2.
    // If we just put them on top of each other.
    // Let's keep it simple: New one fades in over old one.
}

// Actually better approach:
// Just transition the src? No, src transition cuts.
// Two layers is correct.
// Bottom layer: lastBg (visible)
// Top layer: currentBg (fades in from 0 to 1)

// Revised CSS logic in template:
// Image 1: always visible (the base)
// Image 2: when changing, set Image 1 to Old, Image 2 to New, fade Image 2 from 0 to 1.
// Then swapped.

// Simpler approach for Vue:
// Just rely on the browser to handle transition? No.

// Let's stick to the Vue Transition Group or simple logical layers.
// But to be robust in uniapp, avoid complex transition groups.
// 
// Logic implemented in script:
// 1. `lastBg` exists ? Render it at z-index 1.
// 2. `currentBg` renders at z-index 2. 
//    If `isTransitioning` is true, start opacity 0 -> 1.
//    Wait 1s, remove `lastBg`.</style>

<style lang="scss" scoped>
.bg-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.fading {
    z-index: 1;
}

.fade-in {
    animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.35); // Reduced darkness for better visibility
    z-index: 3;
}
</style>
