<template>
    <view class="container">
        <!-- 背景 -->
        <image class="bg-image" src="@/static/images/loc_nav_stand.png" mode="aspectFill" />
        <view class="overlay"></view>
        <view class="scan-line"></view>

        <!-- 标题 -->
        <view class="header">
            <text class="top-tag">CLASSIFIED // EYES ONLY</text>
            <text class="title">档案选择</text>
            <text class="subtitle">SELECT PERSONNEL FOR DEPLOYMENT</text>
        </view>

        <!-- 角色卡片轮播 -->
        <swiper class="role-swiper" :current="currentIndex" @change="onSwiperChange" previous-margin="40rpx"
            next-margin="40rpx">
            <swiper-item v-for="(role, index) in roles" :key="role.id" class="swiper-item">
                <view class="role-card" :class="{ 'active': index === currentIndex }">
                    <!-- 装饰性角标 -->
                    <view class="card-corner top-left"></view>
                    <view class="card-corner top-right"></view>
                    <view class="card-corner bottom-left"></view>
                    <view class="card-corner bottom-right"></view>

                    <view class="role-header">
                        <view class="avatar-box">
                            <text class="avatar">{{ role.avatar }}</text>
                        </view>
                        <view class="role-info">
                            <text class="code-name">CODE: {{ role.id.toUpperCase() }}</text>
                            <text class="role-name">{{ role.name }}</text>
                            <text class="role-title">// {{ role.title }}</text>
                        </view>
                    </view>

                    <image v-if="index === currentIndex" class="stamp" src="/static/images/stamp_confidential.png"
                        mode="widthFix"></image>
                    <!-- Fallback if stamp image missing: CSS Stamp -->
                    <view v-else class="css-stamp">CONFIDENTIAL</view>

                    <view class="divider-line"></view>

                    <scroll-view scroll-y class="desc-box">
                        <text class="role-desc">{{ role.description }}</text>
                    </scroll-view>

                    <view class="stats-panel">
                        <view class="stat-row">
                            <text class="label">体能 (HP)</text>
                            <view class="segment-bar">
                                <view v-for="n in 10" :key="n" class="segment"
                                    :class="{ 'filled': n <= (role.stats.maxHp / 10), 'hp': true }"></view>
                            </view>
                            <text class="value">{{ role.stats.maxHp }}</text>
                        </view>
                        <view class="stat-row">
                            <text class="label">意志 (SAN)</text>
                            <view class="segment-bar">
                                <view v-for="n in 10" :key="n" class="segment"
                                    :class="{ 'filled': n <= (role.stats.maxSanity / 10), 'sanity': true }"></view>
                            </view>
                            <text class="value">{{ role.stats.maxSanity }}</text>
                        </view>
                    </view>

                    <view class="equipment-box">
                        <text class="section-title"> > INITIAL_LOADOUT</text>
                        <view class="items-grid">
                            <view v-for="item in getRoleItemNames(role)" :key="item" class="item-chip">
                                <text class="chip-icon">📦</text>
                                <text class="chip-text">{{ item }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </swiper-item>
        </swiper>

        <!-- 确认按钮 -->
        <view class="footer">
            <view class="btn-deploy" @click="confirmSelection">
                <view class="btn-content">
                    <text class="btn-text">签署生死状 // DEPLOY</text>
                </view>
                <view class="btn-glitch"></view>
            </view>
        </view>
        <!-- 全屏转场遮罩 -->
        <view class="transition-overlay" v-if="isTransitioning">
            <text class="transition-text">正在前往登山口...</text>
            <view class="loading-bar">
                <view class="loading-progress"></view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { roles } from '@/utils/game/data/roles_data';
import { items } from '@/utils/game/data/items_data';
import { useGameStore } from '@/stores/modules/game';

const gameStore = useGameStore();

const currentIndex = ref(0);
const isTransitioning = ref(false); // [NEW] Transition state
const currentRole = computed(() => roles[currentIndex.value]);

onMounted(() => {
    // Randomize initial character on mount
    if (roles.length > 0) {
        currentIndex.value = Math.floor(Math.random() * roles.length);
    }
});

const onSwiperChange = (e) => {
    currentIndex.value = e.detail.current;
};

const getRoleItemNames = (role) => {
    return role.items.map(id => items[id] ? items[id].name : '未知物品');
}

const confirmSelection = () => {
    try {
        if (isTransitioning.value) return; // Prevent double click

        const roleId = currentRole.value.id;
        gameStore.initGame(roleId);

        // Start Transition
        isTransitioning.value = true;

        // Navigate after animation
        setTimeout(() => {
            uni.navigateTo({
                url: '/pages/game/index',
                fail: (err) => {
                    console.error('Navigation failed:', err);
                    isTransitioning.value = false;
                }
            });
        }, 2000); // 2 seconds for the cinematic feel
    } catch (e) {
        console.error('Error in confirmSelection:', e);
        uni.showToast({ title: 'Error: ' + e.message, icon: 'none' });
    }
};
</script>

<style lang="scss" scoped>
/* 引入等宽字体 (如果系统支持) */
@font-face {
    font-family: 'TechMono';
    src: local('Courier New'), local('Menlo'); // Fallback
}

.container {
    width: 100%;
    height: 100vh;
    background: #050505;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    font-family: 'TechMono', monospace;
}

.bg-image {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    filter: grayscale(100%) contrast(1.2) blur(2px);
}

.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 0%, #000 90%);
    pointer-events: none;
}

.scan-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    animation: scan 3s linear infinite;
    pointer-events: none;
    z-index: 5;
}

@keyframes scan {
    0% {
        top: -10%;
    }

    100% {
        top: 110%;
    }
}

.header {
    position: relative;
    z-index: 10;
    padding-top: 120rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;
}

.top-tag {
    font-size: 20rpx;
    color: #ff3333;
    letter-spacing: 4rpx;
    margin-bottom: 10rpx;
    border: 1px solid #ff3333;
    padding: 2rpx 8rpx;
}

.title {
    color: #e0e0e0;
    font-size: 56rpx;
    font-weight: 900;
    letter-spacing: 8rpx;
    text-shadow: 0 0 10rpx rgba(255, 255, 255, 0.3);
}

.subtitle {
    font-size: 20rpx;
    color: #666;
    letter-spacing: 2rpx;
    margin-top: 10rpx;
}

.role-swiper {
    position: relative;
    z-index: 10;
    flex: 1;
    width: 100%;
    padding-top: 40rpx;
}

.swiper-item {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}

.role-card {
    width: 90%;
    height: 85%;
    background: #111;
    border: 1px solid #333;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40rpx;
    box-sizing: border-box;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    transform: scale(0.92);
    opacity: 0.5;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.8);

    &.active {
        transform: scale(1);
        opacity: 1;
        border-color: #f0f0f0;
        background: #1a1a1a;
        box-shadow: 0 0 40rpx rgba(0, 0, 0, 0.9);

        .css-stamp {
            opacity: 0.2;
        }
    }
}

/* 装饰角标 */
.card-corner {
    position: absolute;
    width: 20rpx;
    height: 20rpx;
    border-color: #fff;
    border-style: solid;
    border-width: 0;
    transition: all 0.3s;
}

.top-left {
    top: -2px;
    left: -2px;
    border-top-width: 2px;
    border-left-width: 2px;
}

.top-right {
    top: -2px;
    right: -2px;
    border-top-width: 2px;
    border-right-width: 2px;
}

.bottom-left {
    bottom: -2px;
    left: -2px;
    border-bottom-width: 2px;
    border-left-width: 2px;
}

.bottom-right {
    bottom: -2px;
    right: -2px;
    border-bottom-width: 2px;
    border-right-width: 2px;
}

.role-header {
    display: flex;
    gap: 30rpx;
    margin-bottom: 30rpx;
}

.avatar-box {
    width: 140rpx;
    height: 140rpx;
    background: #222;
    border: 1px solid #444;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar {
    font-size: 80rpx;
}

.role-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.code-name {
    font-size: 20rpx;
    color: #666;
    margin-bottom: 4rpx;
}

.role-name {
    font-size: 48rpx;
    color: #fff;
    font-weight: 700;
    letter-spacing: 2rpx;
}

.role-title {
    font-size: 24rpx;
    color: #ffcc00;
    /* Tactical Yellow */
}

.css-stamp {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    font-size: 60rpx;
    font-weight: 900;
    color: #ff3333;
    border: 6rpx solid #ff3333;
    padding: 10rpx 20rpx;
    opacity: 0;
    pointer-events: none;
    letter-spacing: 10rpx;
    transition: opacity 0.5s;
    z-index: 0;
}

.divider-line {
    width: 100%;
    height: 1px;
    background: repeating-linear-gradient(90deg, #444 0, #444 10px, transparent 10px, transparent 20px);
    margin-bottom: 30rpx;
}

.desc-box {
    flex: 1;
    margin-bottom: 30rpx;
}

.role-desc {
    font-size: 26rpx;
    color: #aaa;
    line-height: 1.5;
}

.stats-panel {
    background: #0f0f0f;
    padding: 20rpx;
    border: 1px solid #333;
    margin-bottom: 30rpx;
}

.stat-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    &:last-child {
        margin-bottom: 0;
    }
}

.label {
    width: 140rpx;
    font-size: 24rpx;
    color: #888;
}

.segment-bar {
    flex: 1;
    display: flex;
    gap: 4rpx;
}

.segment {
    flex: 1;
    height: 16rpx;
    background: #222;
    transform: skewX(-20deg);

    &.filled {
        &.hp {
            background: #ff4757;
        }

        &.sanity {
            background: #5352ed;
        }

        box-shadow: 0 0 10rpx rgba(255, 255, 255, 0.2);
    }
}

.value {
    width: 60rpx;
    text-align: right;
    color: #fff;
    font-size: 24rpx;
}

.equipment-box {
    border-top: 1px solid #333;
    padding-top: 20rpx;
}

.section-title {
    font-size: 20rpx;
    color: #666;
    margin-bottom: 16rpx;
    display: block;
}

.items-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.item-chip {
    background: #222;
    border: 1px solid #444;
    padding: 8rpx 16rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.chip-icon {
    font-size: 24rpx;
}

.chip-text {
    font-size: 22rpx;
    color: #ccc;
}

.footer {
    padding: 0 0 80rpx;
    display: flex;
    justify-content: center;
}

.btn-deploy {
    background: #ff3333;
    color: #000;
    padding: 2rpx;
    /* Thin border */
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.1s;

    &:active {
        transform: scale(0.98);
        filter: brightness(1.2);
    }
}

.btn-content {
    background: #000;
    color: #ff3333;
    padding: 24rpx 60rpx;
    border: 2px solid #ff3333;
    /* Inner border */
    font-weight: 900;
    font-size: 32rpx;
    letter-spacing: 4rpx;
    text-transform: uppercase;
    position: relative;
    z-index: 2;

    &:hover {
        background: #ff3333;
        color: #000;
    }
}

.btn-glitch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 51, 51, 0.5);
    transform: translateX(-100%);
    z-index: 1;
    pointer-events: none;
}

.btn-deploy:active .btn-glitch {
    animation: glitch-slide 0.2s linear;
}

@keyframes glitch-slide {
    0% {
        transform: translateX(-100%);
    }

    50% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(100%);
    }
}

/* Transition Overlay Styles */
.transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.5s ease-out;
}

.transition-text {
    color: #fff;
    font-size: 40rpx;
    /* Larger text */
    letter-spacing: 8rpx;
    margin-bottom: 60rpx;
    font-weight: 700;
    animation: pulseText 2s infinite;
}

.loading-bar {
    width: 400rpx;
    height: 4rpx;
    background: #333;
    position: relative;
    overflow: hidden;
}

.loading-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #fff;
    transform: translateX(-100%);
    animation: loadingSlide 2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes pulseText {

    0%,
    100% {
        opacity: 0.8;
    }

    50% {
        opacity: 1;
        text-shadow: 0 0 20rpx rgba(255, 255, 255, 0.5);
    }
}

@keyframes loadingSlide {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(0);
    }
}
</style>
