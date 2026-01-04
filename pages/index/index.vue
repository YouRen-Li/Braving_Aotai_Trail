<template>
  <view class="container">
    <!-- 背景图片 -->
    <image class="bg-image" src="@/static/images/back_ground.png" mode="aspectFill" />

    <!-- 暗色叠加层 -->
    <view class="overlay"></view>

    <!-- 雪花特效 -->
    <view class="snow-container" pointer-events="none">
      <view v-for="flake in snowflakes" :key="flake.id" class="snowflake" :style="{
        left: flake.left + '%',
        animationDuration: flake.animationDuration + 's',
        animationDelay: '-' + flake.animationDelay + 's',
        width: flake.size + 'rpx',
        height: flake.size + 'rpx',
        opacity: flake.opacity
      }"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 音乐控制按钮 [NEW] -->
      <view class="music-btn" @click="toggleMusic" hover-class="btn-hover">
        <text class="icon">{{ isMusicOn ? '🔊' : '🔇' }}</text>
      </view>

      <!-- 标题区域 -->
      <view class="title-section">
        <!-- 主标题 -->
        <text class="main-title">徒步鳌太线</text>
        <!-- 副标题分割线 -->
        <view class="subtitle-wrap">
          <view class="divider-line"></view>
          <text class="subtitle">勇闯鳌太</text>
          <view class="divider-line"></view>
        </view>
        <!-- 引言 -->
        <view class="quote-wrap">
          <text class="quote">"我们征服不了任何一座山，</text>
          <text class="quote">只是山放过了我们而已。"</text>
        </view>
      </view>

      <!-- 按钮组 -->
      <view class="btn-group">
        <!-- 开始徒步按钮 - 主按钮 -->
        <view class="btn btn-primary" @click="handleStartHike">
          <text class="btn-icon">▶</text>
          <text class="btn-text-primary">开始徒步</text>
        </view>

        <!-- 继续徒步按钮 - 次按钮 -->
        <view class="btn btn-secondary" @click="handleContinueHike">
          <text class="btn-icon-secondary">↻</text>
          <text class="btn-text-secondary">继续徒步</text>
        </view>

        <!-- 关于游戏按钮 - 文字按钮 -->
        <view class="btn btn-text-link" @click="handleAbout">
          <text class="btn-icon-link">ℹ</text>
          <text class="btn-text-link-text">关于游戏</text>
        </view>
      </view>

      <!-- 底部警示语 -->
      <view class="footer-warning">
        <text class="warning-text">⚠ 鳌太线是中国十大死亡路线之一，请敬畏自然</text>
      </view>

      <!-- Custom Modal -->
      <view v-if="showResetModal" class="modal-overlay">
        <view class="modal-content">
          <text class="modal-title">重新开始</text>
          <text class="modal-text">开始新游戏将覆盖现有存档，确定要重新开始吗？</text>
          <view class="modal-actions">
            <view class="modal-btn cancel" @click="cancelReset">
              <text class="modal-btn-text">取消</text>
            </view>
            <view class="modal-btn confirm" @click="confirmReset">
              <text class="modal-btn-text highlight">确定</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useGameStore } from '@/stores/modules/game';
import { audioManager } from '@/utils/game/utils/audio_manager'; // [NEW]

const gameStore = useGameStore();
const hasSave = ref(false);
const snowflakes = ref([]);

// --- Music Control ---
const isMusicOn = ref(audioManager.isMusicOn);
const toggleMusic = () => {
  isMusicOn.value = audioManager.toggleMusic();
};

onMounted(() => {
  // 生成少量的雪花，营造淡淡的氛围
  const count = 25
  for (let i = 0; i < count; i++) {
    snowflakes.value.push({
      id: i,
      left: Math.random() * 100, // 0-100vw
      animationDuration: 10 + Math.random() * 15, // 10-25s 慢一点
      animationDelay: Math.random() * 10, // 0-10s
      size: 4 + Math.random() * 6, // 4-10rpx
      opacity: 0.2 + Math.random() * 0.4 // 0.2-0.6 淡淡的
    })
  }
});

onShow(() => {
  // Check if save exists in storage
  const saved = uni.getStorageSync('braving_aotai_save_v1');
  hasSave.value = !!(saved && saved.currentSceneId);
});

const handleStartHike = () => {
  if (hasSave.value) {
    showResetModal.value = true;
  } else {
    // New Game -> Character Select
    uni.navigateTo({ url: '/pages/character/index' });
  }
};

const handleContinueHike = () => {
  if (gameStore.loadGame()) {
    uni.navigateTo({ url: '/pages/game/index' });
  } else {
    uni.showToast({ title: '存档丢失或损坏', icon: 'none' });
    hasSave.value = false;
  }
};

const handleAbout = () => {
  uni.showToast({ title: '致敬所有勇敢的攀登者', icon: 'none' });
};

// Modal Logic
const showResetModal = ref(false);

const cancelReset = () => {
  showResetModal.value = false;
};

const confirmReset = () => {
  showResetModal.value = false;
  gameStore.initGame();
  uni.navigateTo({ url: '/pages/character/index' });
};
</script>

<style lang="scss" scoped>
/* Music Button */
.music-btn {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  width: 70rpx;
  height: 70rpx;
  background: rgba(255, 255, 255, 0.15); // Lighter for splash screen
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;

  .icon {
    font-size: 28rpx;
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.25);
  }
}

.container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  /* 呼吸背景动画：近->远->近 */
  animation: bgBreathing 24s ease-in-out infinite;
  transform-origin: center center;
}

@keyframes bgBreathing {
  0% {
    transform: scale(1.15);
  }

  50% {
    transform: scale(1.0);
  }

  100% {
    transform: scale(1.15);
  }
}

/* 雪花容器 */
.snow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
  pointer-events: none;
}

.snowflake {
  position: absolute;
  top: -20rpx;
  background: #ffffff;
  border-radius: 50%;
  filter: blur(2rpx);
  animation: snowfall linear infinite;
}

@keyframes snowfall {
  0% {
    transform: translateY(0) translateX(0);
  }

  25% {
    transform: translateY(25vh) translateX(15rpx);
  }

  50% {
    transform: translateY(50vh) translateX(-15rpx);
  }

  75% {
    transform: translateY(75vh) translateX(15rpx);
  }

  100% {
    transform: translateY(105vh) translateX(0);
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg,
      rgba(15, 23, 33, 0.2) 0%,
      rgba(10, 18, 28, 0.5) 40%,
      rgba(5, 10, 18, 0.85) 100%);
  z-index: 5;
}

.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 50rpx;
}

/* 标题区域 */
.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.main-title {
  font-size: 96rpx;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 16rpx;
  text-shadow:
    0 4rpx 10rpx rgba(0, 0, 0, 0.3),
    0 10rpx 40rpx rgba(0, 0, 0, 0.5),
    0 0 80rpx rgba(100, 200, 255, 0.3);
  margin-bottom: 40rpx;
  background: linear-gradient(180deg, #ffffff 30%, #e0e6ed 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}

.subtitle-wrap {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 60rpx;
  opacity: 0.9;
}

.divider-line {
  width: 80rpx;
  height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
}

.subtitle {
  font-size: 28rpx;
  color: rgba(220, 230, 240, 0.9);
  letter-spacing: 16rpx;
  font-weight: 300;
  text-transform: uppercase;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.quote-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.quote {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  letter-spacing: 4rpx;
  line-height: 1.6;
}

/* 按钮组 */
.btn-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40rpx;
  width: 100%;
  max-width: 520rpx;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  width: 100%;
  height: 116rpx;
  /* Fixed height for consistency */
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.97);
  }
}

/* 主按钮 - 毛玻璃质感 */
.btn-primary {
  padding: 0 60rpx;
  /* 半透明白色背景 */
  background: rgba(255, 255, 255, 0.12);
  /* 模糊滤镜实现毛玻璃 */
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 60rpx;
  /* 增加一点内发光 */
  box-shadow:
    0 8rpx 32rpx rgba(0, 0, 0, 0.3),
    inset 0 0 30rpx rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: scale(1.02);
    box-shadow:
      0 12rpx 40rpx rgba(0, 0, 0, 0.4),
      inset 0 0 40rpx rgba(255, 255, 255, 0.1);
  }

  &:active {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
  }
}


.btn-icon {
  font-size: 32rpx;
  color: #ffffff;
  text-shadow: 0 0 10rpx rgba(255, 255, 255, 0.5);
}

.btn-text-primary {
  font-size: 34rpx;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 10rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

/* 次按钮 - 深色毛玻璃 */
.btn-secondary {
  padding: 0 60rpx;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10rpx);
  -webkit-backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 60rpx;

  &:hover {
    background: rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }

  &:active {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.btn-icon-secondary {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.7);
}

.btn-text-secondary {
  font-size: 34rpx;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 8rpx;
}

/* 文字链接按钮 */
.btn-text-link {
  padding: 20rpx 40rpx;
  background: transparent;
  margin-top: 10rpx;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  &:active {
    opacity: 0.6;
  }
}

.btn-icon-link {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
}

.btn-text-link-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4rpx;
  text-decoration: underline;
  text-underline-offset: 6rpx;
}

/* 底部警示语 */
.footer-warning {
  bottom: 60rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.warning-text {
  font-size: 22rpx;
  color: rgba(255, 180, 180, 0.6);
  letter-spacing: 2rpx;
}

/* Custom Modal Styles */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8rpx);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 560rpx;
  padding: 48rpx;
  background: rgba(30, 40, 50, 0.85);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24rpx;
  letter-spacing: 2rpx;
}

.modal-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 48rpx;
}

.modal-actions {
  display: flex;
  gap: 24rpx;
  width: 100%;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  transition: all 0.2s;

  &.cancel {
    background: rgba(255, 255, 255, 0.1);

    &:active {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  &.confirm {
    background: linear-gradient(135deg, #4a90e2, #0056b3);
    box-shadow: 0 4rpx 16rpx rgba(74, 144, 226, 0.3);

    &:active {
      transform: scale(0.96);
    }
  }
}

.modal-btn-text {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.8);

  &.highlight {
    color: #ffffff;
    font-weight: 600;
  }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>