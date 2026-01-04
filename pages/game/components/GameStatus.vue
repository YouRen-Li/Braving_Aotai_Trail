<template>
  <view class="status-bar">
    <!-- 天数显示 -->
    <view class="day-indicator">
      <text class="day-text">DAY {{ days }}</text>
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
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/modules/game';

const gameStore = useGameStore();

const hp = computed(() => gameStore.status.hp);
const hunger = computed(() => gameStore.status.hunger);
const days = computed(() => gameStore.player.days);
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
  top: 0; // 这里的top需要适配不同机型的刘海屏，后续优化
  left: 0;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
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

.bars-container {
  flex: 1;
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
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
    color: rgba(255,255,255,0.7);
    width: 40rpx;
    text-align: right;
  }
}

.progress-bg {
  flex: 1;
  height: 12rpx;
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
</style>
