<template>
    <view class="container">
        <!-- 背景 -->
        <image class="bg-image" src="@/static/images/back_ground.png" mode="aspectFill" />
        <view class="overlay"></view>

        <!-- 标题 -->
        <view class="header">
            <text class="title">选择你的身份</text>
            <text class="subtitle">不同的过往，不同的命运</text>
        </view>

        <!-- 角色卡片轮播 -->
        <swiper class="role-swiper" :current="currentIndex" @change="onSwiperChange" previous-margin="60rpx"
            next-margin="60rpx">
            <swiper-item v-for="(role, index) in roles" :key="role.id" class="swiper-item">
                <view class="role-card" :class="{ 'active': index === currentIndex }">
                    <view class="avatar">{{ role.avatar }}</view>
                    <text class="role-title">{{ role.title }}</text>
                    <text class="role-name">{{ role.name }}</text>

                    <view class="divider"></view>

                    <text class="role-desc">{{ role.description }}</text>

                    <view class="stats-box">
                        <view class="stat-row">
                            <text class="label">生命</text>
                            <view class="bar-bg">
                                <view class="bar-fill hp" :style="{ width: (role.stats.maxHp / 150 * 100) + '%' }">
                                </view>
                            </view>
                            <text class="value">{{ role.stats.maxHp }}</text>
                        </view>
                        <view class="stat-row">
                            <text class="label">理智</text>
                            <view class="bar-bg">
                                <view class="bar-fill sanity"
                                    :style="{ width: (role.stats.maxSanity / 150 * 100) + '%' }"></view>
                            </view>
                            <text class="value">{{ role.stats.maxSanity }}</text>
                        </view>
                    </view>

                    <view class="items-preview">
                        <text class="items-label">初始携带:</text>
                        <view class="items-list">
                            <text v-for="item in getRoleItemNames(role)" :key="item" class="item-tag">{{ item }}</text>
                        </view>
                    </view>
                </view>
            </swiper-item>
        </swiper>

        <!-- 确认按钮 -->
        <view class="footer">
            <view class="btn-start" @click="confirmSelection">
                <text class="btn-text">确认出发</text>
                <text class="btn-icon">▶</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { roles } from '@/utils/game/roles_data';
import { items } from '@/utils/game/items_data';
import { useGameStore } from '@/stores/modules/game';

const gameStore = useGameStore();

const currentIndex = ref(0);
const currentRole = computed(() => roles[currentIndex.value]);

const onSwiperChange = (e) => {
    currentIndex.value = e.detail.current;
};

// Helper to get item names
const getRoleItemNames = (role) => {
    return role.items.map(id => items[id] ? items[id].name : '未知物品');
}

const confirmSelection = () => {
    const roleId = currentRole.value.id;
    gameStore.initGame(roleId);
    uni.navigateTo({ url: '/pages/game/index' });
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100vh;
    background: #0a0a0a;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

.bg-image {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    filter: grayscale(0.5);
}

.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.9) 100%);
}

.header {
    position: relative;
    z-index: 10;
    padding-top: 100rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40rpx;
}

.title {
    color: #fff;
    font-size: 48rpx;
    font-weight: 700;
    letter-spacing: 4rpx;
    margin-bottom: 16rpx;
}

.subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 28rpx;
    letter-spacing: 2rpx;
}

.role-swiper {
    position: relative;
    z-index: 10;
    flex: 1;
    width: 100%;
}

.swiper-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx;
    box-sizing: border-box;
}

.role-card {
    width: 100%;
    height: 100%;
    background: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx;
    transition: all 0.3s ease;
    transform: scale(0.9);
    opacity: 0.6;

    &.active {
        transform: scale(1);
        opacity: 1;
        background: rgba(40, 40, 40, 0.9);
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.5);
    }
}

.avatar {
    font-size: 120rpx;
    margin-bottom: 30rpx;
}

.role-title {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 4rpx;
    margin-bottom: 10rpx;
}

.role-name {
    font-size: 56rpx;
    font-weight: 700;
    color: #fff;
    margin-bottom: 30rpx;
}

.divider {
    width: 60rpx;
    height: 4rpx;
    background: rgba(255, 255, 255, 0.2);
    margin-bottom: 40rpx;
}

.role-desc {
    font-size: 30rpx;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    line-height: 1.6;
    margin-bottom: 60rpx;
    padding: 0 20rpx;
    flex-grow: 1;
}

.stats-box {
    width: 100%;
    margin-bottom: 40rpx;
}

.stat-row {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.label {
    width: 80rpx;
    color: rgba(255, 255, 255, 0.6);
    font-size: 26rpx;
}

.bar-bg {
    flex: 1;
    height: 12rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6rpx;
    margin: 0 20rpx;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    border-radius: 6rpx;

    &.hp {
        background: linear-gradient(90deg, #ff6b6b, #ff8787);
    }

    &.sanity {
        background: linear-gradient(90deg, #b197fc, #d0bfff);
    }
}

.value {
    width: 60rpx;
    text-align: right;
    color: #fff;
    font-size: 26rpx;
    font-family: monospace;
}

.items-preview {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.items-label {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.4);
}

.items-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.item-tag {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.1);
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
}

.footer {
    position: relative;
    z-index: 10;
    padding: 40rpx 0 80rpx;
    width: 100%;
    display: flex;
    justify-content: center;
}

.btn-start {
    display: flex;
    align-items: center;
    gap: 20rpx;
    background: #fff;
    padding: 30rpx 80rpx;
    border-radius: 60rpx;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;

    &:active {
        transform: scale(0.95);
        opacity: 0.9;
    }
}

.btn-text {
    color: #000;
    font-size: 32rpx;
    font-weight: 600;
    letter-spacing: 4rpx;
}

.btn-icon {
    color: #000;
    font-size: 32rpx;
}
</style>
