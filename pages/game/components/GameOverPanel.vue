<template>
    <view class="game-over-overlay" v-if="visible">
        <view class="panel">
            <view class="header">
                <text class="title">生命终结</text>
            </view>

            <view class="content">
                <text class="days-label">存活天数</text>
                <text class="days-value">{{ days }}</text>

                <view class="divider"></view>

                <text class="reason-label">最终结局</text>
                <text class="reason-value">{{ deathReason }}</text>

                <view class="rank-badge">
                    <text class="rank-text">评价: {{ rank }}</text>
                </view>
            </view>

            <button class="restart-btn" hover-class="btn-hover" @click="onRestart">
                返回主页
            </button>
        </view>
    </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useGameStore } from '@/stores/modules/game';

const gameStore = useGameStore();

const visible = ref(false);
const days = computed(() => gameStore.player.days);

// Watch game state to trigger modal with delay
watch(() => gameStore.gameState, (newVal) => {
    if (newVal === 'ended') {
        // Give user 2 seconds to read the death text before showing modal
        setTimeout(() => {
            visible.value = true;
        }, 4000);
    } else {
        visible.value = false;
    }
}, { immediate: true });

// Extract death reason from history or just show a generic message if missing
const deathReason = computed(() => {
    // Determine reason from history last entry or assume generic
    // In die() we pushed "死因: ..."
    const history = gameStore.history;
    if (history.length > 0) {
        const last = history[history.length - 1];
        if (last.startsWith('死因:')) return last.split(':')[1];
    }
    return '在这片荒野中永远沉睡...';
});

const rank = computed(() => {
    const d = days.value;
    if (d < 3) return 'D (菜鸟)';
    if (d < 7) return 'C (初学者)';
    if (d < 15) return 'B (生存者)';
    if (d < 30) return 'A (探险家)';
    return 'S (传奇)';
});

const onRestart = () => {
    uni.reLaunch({ url: '/pages/index/index' });
};
</script>

<style lang="scss" scoped>
.game-over-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.panel {
    width: 600rpx;
    background: linear-gradient(180deg, #2a0e0e 0%, #1a1a1a 100%);
    border: 2rpx solid #5a1e1e;
    border-radius: 20rpx;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 60rpx rgba(255, 0, 0, 0.1);
}

.header {
    margin-bottom: 40rpx;
}

.title {
    color: #ff4d4d;
    font-size: 48rpx;
    font-weight: 900;
    letter-spacing: 4rpx;
    text-shadow: 0 0 20rpx rgba(255, 77, 77, 0.5);
}

.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;
}

.days-label {
    color: #999;
    font-size: 24rpx;
    margin-bottom: 10rpx;
}

.days-value {
    color: #fff;
    font-size: 80rpx;
    font-weight: 700;
    font-family: monospace;
}

.divider {
    width: 100rpx;
    height: 2rpx;
    background: #444;
    margin: 30rpx 0;
}

.reason-label {
    color: #999;
    font-size: 24rpx;
    margin-bottom: 10rpx;
}

.reason-value {
    color: #ccc;
    font-size: 30rpx;
    text-align: center;
    line-height: 1.4;
    max-width: 90%;
}

.rank-badge {
    margin-top: 40rpx;
    background: #ffd700;
    color: #000;
    padding: 8rpx 20rpx;
    border-radius: 8rpx;

    .rank-text {
        font-weight: 800;
        font-size: 28rpx;
    }
}

.restart-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #ff4d4d;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    border-radius: 44rpx;

    &.btn-hover {
        background: #d93636;
        transform: scale(0.98);
    }
}
</style>
