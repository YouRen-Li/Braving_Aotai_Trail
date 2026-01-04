# Braving Aotai Trail (勇闯鳌太线) - Text-Based Survival Roguelike

## 简介 Introduction

《勇闯鳌太线》是一款基于 **UniApp + Vue 3** 开发的文字冒险生存 Roguelike 游戏。
玩家将扮演不同身份的徒步者，挑战“中国最危险的徒步路线”——鳌太线。在充满随机性的旅涂中，你需要管理多项生存指标，应对极端天气与突发事件，努力抵达终点。

## 核心玩法 Core Gameplay

### 1. 生存指标 (Status)

- **❤️ 生命 (HP)**：归零即死亡。受饥饿、低温、受伤影响。
- **🍗 饱食度 (Hunger)**：随行动消耗，低饱食度会导致生命流失。
- **🧠 理智 (Sanity)**：**[NEW]** 核心机制。恶劣天气、黑暗、恐怖事件会降低理智。理智过低会出现：
  - **视觉扭曲**：屏幕故障、文字乱码。
  - **幻听**：听到心跳声和尖叫声。
  - **结局**：理智归零将触发“精神崩溃”死亡。
- **🎒 负重 (Load)**：影响移动速度和体力消耗（计划中）。

### 2. 环境系统 (Environment)

- **天气 (Weather)**：晴、阴、雾、雪、暴风雪。恶劣天气会加速体温和理智流失。
- **昼夜循环 (Day/Night)**：**[NEW]** 移动消耗时间，触发昼夜交替。
  - **夜晚 (Night)**：视野受限，屏幕变黑。如果没有照明设备，强行赶路极易受伤且理智狂掉。
  - **视野 (Vision)**：装备 **手电筒/头灯** 可在夜晚获得视野。

### 3. 职业系统 (Characters) **[NEW]**

开局选择不同的社会身份，体验不同的人生：

- **🎓 大学生**：精神充沛，自带送外卖买的强光手电，无惧黑夜。
- **🏃 运动员**：体能怪兽，生命上限高，但新陈代谢快（饿得快）。
- **🩺 医生**：随身携带急救药品，理智坚定。
- **🪖 退伍军人**：野外生存专家，装备专业登山靴。

### 4. 探险手记 (Journal) **[NEW]**

- **Meta-Progression**：死亡不是终点。系统会自动记录你的探险履历。
- **结局收集**：收集所有结局（成功穿越、失温、滑坠、疯癫...）点亮图鉴图标。
- **尝试次数**：记录你向大自然发起的每一次挑战。

### 5. 音效系统 (Audio) **[NEW]**

- **动态 BGM**：根据天气自动切换（晴天轻松，暴风雪压抑）。
- **沉浸 SFX**：心跳声、尖叫声、暴风雪声增强代入感。

## 技术栈 Tech Stack

- **Framework**: [UniApp](https://uniapp.dcloud.io/) (Vue 3 + Vite)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **CSS Engine**: SCSS / CSS3 (Animation, Backdrop Filter)
- **Storage**: Uni Storage API (Local Persistence)
- **Audio**: Uni InnerAudioContext

## 目录结构 Project Structure

```
/pages
  /index        # 游戏首页 (Main Menu)
  /character    # 角色选择 (Character Select)
  /game         # 核心游戏页 (Game Loop)
  /journal      # 探险手记 (Meta Progression)
/stores
  /modules
    game.ts     # 游戏状态管理 (Game Logic)
    meta.ts     # 全局成就管理 (Persistence)
/utils
  /game
    roles_data.ts   # 职业配置
    scenes_data.ts  # 剧情节点与事件
    items_data.ts   # 物品与装备
    audio_manager.ts # 音频管理器
/static
  /images       # 图片资源
  /audio        # 音频资源
```

## 开发计划 Roadmap

- [x] 基础生存循环 (HP/Hunger)
- [x] 物品与背包系统
- [x] 动态天气系统
- [x] 理智与幻觉特效 (Sanity)
- [x] 昼夜与视野机制 (Day/Night)
- [x] 探险手记与成就 (Meta)
- [x] 职业与角色特质 (Roles)
- [ ] 更多随机事件与剧情分支...
