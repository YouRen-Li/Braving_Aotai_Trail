<template>
  <view class="status-bar">
    <!-- 左侧：天数与天气 -->
    <view class="info-group">
      <view class="day-indicator">
        <text class="day-text">DAY {{ days }}</text>
      </view>
      <view class="weather-indicator" v-if="weatherInfo">
        <text class="weather-icon">{{ weatherInfo.icon }}</text>
        <text class="weather-name">{{ weatherInfo.name }}</text>
      </view>
    </view>

    <!-- 状态条区域 -->
    <view class="bars-container">
      <!-- 生命值 -->
      <view class="bar-row">
        <text class="icon">♥</text>
        <view class="progress-bg">
          <view class="progress-fill hp-fill" :style="{ width: hp + '%' }"></view>
        </view>
        <text class="value">{{ Math.floor(hp) }}</text>
      </view>

      <!-- 饥饿度 -->
      <view class="bar-row">
        <text class="icon">♨</text>
        <view class="progress-bg">
          <view class="progress-fill hunger-fill" :style="{ width: hunger + '%' }"></view>
        </view>
        <text class="value">{{ Math.floor(hunger) }}</text>
      </view>

      <!-- 理智值 [NEW] -->
      <view class="bar-row">
        <text class="icon">🧠</text>
        <view class="progress-bg">
          <view class="progress-fill sanity-fill" :style="{ width: sanity + '%' }"></view>
        </view>
        <text class="value">{{ Math.floor(sanity) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/modules/game';

const gameStore = useGameStore();

const hp = computed(() => gameStore.status.hp);
const hunger = computed(() => gameStore.status.hunger);
const sanity = computed(() => gameStore.status.sanity || 0); // Safety check
const days = computed(() => gameStore.player.days);
const weatherInfo = computed(() => gameStore.currentWeatherInfo);
</script>

<style lang="scss" scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.day-indicator {
  .day-text {
    font-size: 32rpx;
    font-weight: 800;
    color: #fff;
    font-family: monospace;
    letter-spacing: 2rpx;
  }
}

.weather-indicator {
  display: flex;
  align-items: center;
  gap: 8rpx;

  .weather-icon {
    font-size: 24rpx;
  }

  .weather-name {
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.bars-container {
  flex: 1;
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx; // Reduced gap to fit 3 bars
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 12rpx;

  .icon {
    font-size: 24rpx;
    color: #ccc;
    width: 24rpx; // fixed width for alignment
    text-align: center;
  }

  .value {
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.7);
    width: 40rpx;
    text-align: right;
  }
}

.progress-bg {
  flex: 1;
  height: 10rpx; // Slightly thinner
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s ease-out;
}

.hp-fill {
  background: linear-gradient(90deg, #ff4d4d, #ff1a1a);
  box-shadow: 0 0 10rpx rgba(255, 26, 26, 0.5);
}

.hunger-fill {
  background: linear-gradient(90deg, #ffbf00, #ff9900);
}

.sanity-fill {
  background: linear-gradient(90deg, #b100ff, #7f00ff);
  box-shadow: 0 0 10rpx rgba(127, 0, 255, 0.5);
}
</style>
