<template>
    <view class="inventory-overlay" v-if="visible" @click.self="close">
        <view class="panel">
            <!-- 标题栏 -->
            <view class="header">
                <text class="title">物资 & 装备</text>
                <view class="close-btn" @click="close">×</view>
            </view>

            <!-- 装备栏 -->
            <view class="equip-section">
                <view class="equip-slot" :class="{ active: selectedType === 'equip' && selectedIndex === 'head' }"
                    @click="selectEquip('head')">
                    <text class="slot-icon">{{ equipment.head?.icon || '🧢' }}</text>
                    <text class="slot-name">{{ equipment.head?.name || '头' }}</text>
                </view>
                <view class="equip-slot" :class="{ active: selectedType === 'equip' && selectedIndex === 'body' }"
                    @click="selectEquip('body')">
                    <text class="slot-icon">{{ equipment.body?.icon || '👕' }}</text>
                    <text class="slot-name">{{ equipment.body?.name || '身' }}</text>
                </view>
                <view class="equip-slot" :class="{ active: selectedType === 'equip' && selectedIndex === 'hand' }"
                    @click="selectEquip('hand')">
                    <text class="slot-icon">{{ equipment.hand?.icon || '🦯' }}</text>
                    <text class="slot-name">{{ equipment.hand?.name || '手' }}</text>
                </view>
                <view class="equip-slot" :class="{ active: selectedType === 'equip' && selectedIndex === 'feet' }"
                    @click="selectEquip('feet')">
                    <text class="slot-icon">{{ equipment.feet?.icon || '🥾' }}</text>
                    <text class="slot-name">{{ equipment.feet?.name || '足' }}</text>
                </view>
            </view>

            <!-- 物品网格 -->
            <scroll-view scroll-y class="grid-area">
                <view class="grid" v-if="inventory.length > 0">
                    <view v-for="(item, index) in inventory" :key="index" class="grid-item"
                        :class="{ active: selectedType === 'inv' && selectedIndex === index }"
                        @click="selectInventory(index)">
                        <text class="item-icon">{{ item.icon || '📦' }}</text>
                        <text class="item-name">{{ item.name }}</text>
                    </view>
                </view>
                <view v-else class="empty-tip">
                    <text>背包空空如也...</text>
                </view>
            </scroll-view>

            <!-- 物品详情与操作 -->
            <view class="detail-area">
                <template v-if="selectedItem">
                    <view class="item-info">
                        <text class="info-name">{{ selectedItem.name }}</text>
                        <text class="info-desc">{{ selectedItem.description }}</text>
                        <text v-if="selectedItem.stats" class="info-stats">
                            <text v-if="selectedItem.stats.warmth">保暖 +{{ selectedItem.stats.warmth }} </text>
                            <text v-if="selectedItem.stats.speed">速度 +{{ selectedItem.stats.speed }}</text>
                        </text>
                    </view>
                    <button class="use-btn" @click="handleAction">
                        {{ actionText }}
                    </button>
                </template>
                <view v-else class="placeholder-text">
                    点击物品查看详情
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useGameStore } from '@/stores/modules/game';

const props = defineProps(['visible']);
const emit = defineEmits(['update:visible']);
const gameStore = useGameStore();

const inventory = computed(() => gameStore.inventory);
const equipment = computed(() => gameStore.equipment);

const selectedType = ref('inv'); // 'inv' or 'equip'
const selectedIndex = ref(-1); // index number for inv, slot string for equip

const selectedItem = computed(() => {
    if (selectedType.value === 'inv') {
        if (selectedIndex.value === -1) return null;
        return inventory.value[selectedIndex.value];
    } else {
        if (selectedIndex.value === -1) return null;
        return equipment.value[selectedIndex.value]; // selectedIndex is slot name here
    }
});

const actionText = computed(() => {
    if (!selectedItem.value) return '';
    if (selectedType.value === 'equip') return '卸下';
    if (selectedItem.value.type === 'gear') return '装备';
    if (selectedItem.value.type === 'consumable') return '使用';
    return '不可用';
});

// 当背包打开或关闭时，重置选择
watch(() => props.visible, (val) => {
    if (!val) {
        selectedIndex.value = -1;
        selectedType.value = 'inv';
    }
});

const close = () => {
    emit('update:visible', false);
};

const selectInventory = (index) => {
    selectedType.value = 'inv';
    selectedIndex.value = index;
};

const selectEquip = (slot) => {
    if (equipment.value[slot]) {
        selectedType.value = 'equip';
        selectedIndex.value = slot;
    }
};

const handleAction = () => {
    if (selectedType.value === 'inv' && selectedIndex.value !== -1) {
        // Use / Equip
        gameStore.useItem(selectedIndex.value);
        // Reset selection if item moves/consumed
        // Simple logic: just reset to avoid index errors
        selectedIndex.value = -1;
    } else if (selectedType.value === 'equip' && selectedIndex.value !== -1) {
        // Unequip
        gameStore.unequipItem(selectedIndex.value);
        selectedIndex.value = -1;
    }
};
</script>

<style lang="scss" scoped>
.inventory-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
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
    width: 640rpx;
    height: 900rpx; // Taller for equipment
    background: #2a2a2a;
    border: 2rpx solid #3a3a3a;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.5);
}

.header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    background: #1f1f1f;
    border-bottom: 2rpx solid #333;
}

.title {
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
}

.close-btn {
    color: #999;
    font-size: 48rpx;
    padding: 10rpx;
    line-height: 1;
}

// Equip Section
.equip-section {
    display: flex;
    justify-content: space-around;
    padding: 20rpx;
    background: #222;
    border-bottom: 1rpx solid #333;
}

.equip-slot {
    width: 100rpx;
    height: 100rpx;
    background: #333;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2rpx solid #444;
    transition: all 0.2s;

    &.active {
        border-color: #007aff;
        box-shadow: 0 0 10rpx rgba(0, 122, 255, 0.3);
    }
}

.slot-icon {
    font-size: 40rpx;
    margin-bottom: 4rpx;
}

.slot-name {
    font-size: 20rpx;
    color: #888;
}

.grid-area {
    flex: 1;
    background: #252525;
    padding: 20rpx;
    box-sizing: border-box;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.grid-item {
    width: 120rpx;
    height: 120rpx;
    background: #333;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2rpx solid transparent;
    transition: all 0.2s;

    &.active {
        background: #3a3a3a;
        border-color: #ffd700;
        box-shadow: 0 0 10rpx rgba(255, 215, 0, 0.2);
    }
}

.item-icon {
    font-size: 48rpx;
    margin-bottom: 8rpx;
}

.item-name {
    font-size: 20rpx;
    color: #ccc;
    text-align: center;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 4rpx;
}

.empty-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300rpx;
    color: #555;
    font-size: 28rpx;
}

.detail-area {
    height: 220rpx;
    background: #1a1a1a;
    padding: 30rpx;
    border-top: 2rpx solid #333;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.item-info {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.info-name {
    color: #ffd700;
    font-size: 32rpx;
    font-weight: 600;
}

.info-desc {
    color: #999;
    font-size: 24rpx;
    line-height: 1.4;
}

.info-stats {
    font-size: 24rpx;
    color: #4cd964;
}

.placeholder-text {
    color: #555;
    font-size: 28rpx;
    text-align: center;
    margin-top: 60rpx;
}

.use-btn {
    background: #007aff;
    color: #fff;
    font-size: 28rpx;
    border-radius: 8rpx;
    margin: 0;

    &:active {
        opacity: 0.8;
    }
}
</style>
