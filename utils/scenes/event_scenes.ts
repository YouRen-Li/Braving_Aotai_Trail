// 随机事件场景
import type { Scene } from "../types";

export const eventScenes: Record<string, Scene> = {
  evt_hiker: {
    id: "evt_hiker",
    text: "浓雾中，你隐约听到前方有呼救声。走近一看，是一个眼神涣散的落单驴友。他说同伴走丢了，自己也没水了。",
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "分他半瓶水",
        cost: { hunger: 10, sanity: -10 },
        target: "node_evt_hiker_share_feedback",
      },
      {
        text: "自身难保，离开",
        cost: { sanity: 10 },
        target: "node_evt_hiker_leave_feedback",
      },
      {
        text: "尝试帮他求救",
        cost: { hp: 20, hunger: 20, sanity: -5 },
        target: "node_evt_hiker_help_feedback",
      },
      {
        text: "[医生] 实施专业急救",
        requiredRole: "doctor",
        cost: { hunger: 5, sanity: -20 },
        target: "node_evt_hiker_doctor_feedback",
      },
    ],
  },

  node_evt_hiker_share_feedback: {
    id: "node_evt_hiker_share_feedback",
    text: "你递给他半瓶水。他颤抖着手接过，咕咚咕咚喝下去，眼神终于恢复了一丝光彩。虽然你自己的物资少了，但心里暖暖的。\n(状态反馈：饱食度 -10，理智 +10)", // Fixed sanity cost logic: giving help usually improves mental state or costs it? Original was cost sanity -10 (gain 10).
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "告别继续赶路",
        target: "resume",
      },
    ],
  },

  node_evt_hiker_leave_feedback: {
    id: "node_evt_hiker_leave_feedback",
    text: "你狠下心转过头，假装没听见他的哀求。在这样的绝境里，每个人都只能顾好自己。身后的呼救声渐渐被风声淹没。\n(状态反馈：理智 -10)", // Original cost sanity 10 (lose 10)
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "加快脚步离开",
        target: "resume",
      },
    ],
  },

  node_evt_hiker_help_feedback: {
    id: "node_evt_hiker_help_feedback",
    text: "你陪他等了许久，终于联系上了他的同伴。在寒风中站立等待让你身体失温，但看到他们团聚的那一刻，一切都值了。\n(状态反馈：生命值 -20，饱食度 -20，理智 +5)",
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "默默离开",
        target: "resume",
      },
    ],
  },

  node_evt_hiker_doctor_feedback: {
    id: "node_evt_hiker_doctor_feedback",
    text: "你迅速判断出他处于早期失温状态，熟练地进行了复温处理并喂食了葡萄糖。看着他呼吸恢复平稳，职业成就感油然而生。\n(状态反馈：饱食度 -5，理智 +20)",
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "深藏功与名",
        target: "resume",
      },
    ],
  },
  evt_tent: {
    id: "evt_tent",
    text: "你发现一顶完好的帐篷搭在路边，但没有任何动静。走近时，心里涌起一股不祥的预感。",
    bg: "evt_abandoned_tent",
    choices: [
      { text: "拉开帐篷查看", target: "evt_tent_result", cost: { sanity: 5 } },
      {
        text: "多一事不如少一事，离开",
        target: "node_evt_tent_leave_feedback",
      },
    ],
  },

  node_evt_tent_leave_feedback: {
    id: "node_evt_tent_leave_feedback",
    text: "好奇心害死猫。你强压下心中的好奇，绕开了那顶帐篷。有时候，不知道真相反而是一种幸福。\n(状态反馈：无变化)",
    bg: "evt_abandoned_tent",
    choices: [
      {
        text: "匆匆走过",
        target: "resume",
      },
    ],
  },
  evt_tent_result: {
    id: "evt_tent_result",
    text: "帐篷里空无一人，只有一些散落的气罐和睡袋。看来主人已经离开许久了。你捡起了一些可用的物资。",
    bg: "loc_camp",
    choices: [{ text: "获得物资", target: "resume", action: "loot_supplies" }],
  },
  evt_storm: {
    id: "evt_storm",
    text: "狂风骤起，暴雪瞬间吞没了视线！这是最危险的时刻。强行赶路极易失温死亡。",
    bg: "bg_storm",
    choices: [
      {
        text: "强行突围",
        cost: { hp: 40, hunger: 20, sanity: 15 },
        target: "node_evt_storm_force_feedback",
      },
      {
        text: "紧急扎营躲避",
        cost: { hunger: 40, sanity: 5 },
        target: "node_evt_storm_camp_feedback",
      },
      { text: "尝试用卫星电话求救", action: "sos" },
    ],
  },

  node_evt_storm_force_feedback: {
    id: "node_evt_storm_force_feedback",
    text: "你顶着10级大风在雪地里艰难跋涉，雪粒打在脸上像刀割一样。几次被风吹倒又爬起来，体温在迅速流失。这是一场与死神的赛跑。\n(状态反馈：生命值 -40，饱食度 -20，理智 -15)",
    bg: "bg_storm",
    choices: [
      {
        text: "死里逃生",
        target: "resume",
      },
    ],
  },

  node_evt_storm_camp_feedback: {
    id: "node_evt_storm_camp_feedback",
    text: "你迅速在巨石后扎营。听着外面鬼哭狼嚎的风声，你在睡袋里瑟瑟发抖。虽然又饿又冷，但至少保住了一条命。\n(状态反馈：饱食度 -40，理智 -5)",
    bg: "bg_storm",
    choices: [
      {
        text: "风小了，收帐出发",
        target: "resume",
      },
    ],
  },

  node_sos_fail: {
    id: "node_sos_fail",
    text: "求救失败。电话那头只有嘈杂的电流声。在这种恶劣天气和地形下，信号很难接通。即使接通，直升机也无法在风雪中起飞。",
    bg: "bg_storm",
    choices: [{ text: "收起电话，另寻出路", target: "resume" }],
  },
  evt_ranger: {
    id: "evt_ranger",
    text: "前方路口出现了几个穿迷彩服的身影——是自然保护区的巡山队！鳌太线全线封禁，你这是在非法穿越。",
    bg: "evt_ranger_patrol",
    choices: [
      { text: "配合执法，接受处罚", target: "end_caught" },
      {
        text: "趁雾大，冒险绕路躲避",
        cost: { hp: 30, hunger: 30, sanity: 15 },
        target: "node_evt_ranger_evade_feedback",
      },
    ],
  },

  node_evt_ranger_evade_feedback: {
    id: "node_evt_ranger_evade_feedback",
    text: "你像受惊的野兽一样钻进密林，在没有路的地方强行穿梭。荆棘划破了皮肤，跌跌撞撞跑了几个小时，才敢停下来喘气。虽然逃过了处罚，但身体已经快散架了。\n(状态反馈：生命值 -30，饱食度 -30，理智 -15)",
    bg: "evt_ranger_patrol",
    choices: [
      {
        text: "惊魂未定",
        target: "resume",
      },
    ],
  },
  evt_body: {
    id: "evt_body",
    text: "在一块巨石的缝隙中，你发现了一具蜷缩的遗体。他衣着单薄，似乎生前有“反常脱衣”现象。这残酷的一幕让你不寒而栗。",
    bg: "evt_frozen_body",
    choices: [
      {
        text: "搜寻遗物",
        action: "loot_supplies",
        target: "node_evt_body_loot_feedback",
      },
      {
        text: "默哀并离开",
        cost: { hunger: 5, sanity: -10 },
        target: "node_evt_body_mourn_feedback",
      },
    ],
  },

  node_evt_body_loot_feedback: {
    id: "node_evt_body_loot_feedback",
    text: "你颤抖着手翻找他的背包，找到了一些压缩饼干和燃料。触碰到冰冷僵硬的身体时，你感到一阵恶心和罪恶感。为了活下去，你只能这么做。\n(状态反馈：获得物资)",
    bg: "evt_frozen_body",
    choices: [
      {
        text: "背负罪恶感离开",
        target: "resume",
      },
    ],
  },

  node_evt_body_mourn_feedback: {
    id: "node_evt_body_mourn_feedback",
    text: "你拿出一点干粮放在他身边，深深鞠了一躬。愿逝者安息。虽然什么都没得到，但你守住了作为人的底线，内心感到一丝平静。\n(状态反馈：理智 +10)",
    bg: "evt_frozen_body",
    choices: [
      {
        text: "怀着敬畏之心离开",
        target: "resume",
      },
    ],
  },
  evt_takin: {
    id: "evt_takin",
    text: "一头体型硕大的秦岭羚牛挡在了由独木桥上。它盯着你，鼻孔喷着白气。这种独行公牛极具攻击性。",
    bg: "evt_takin_beast",
    choices: [
      {
        text: "原地不动等待",
        cost: { hunger: 20, sanity: -5 },
        target: "node_evt_takin_wait_feedback",
      },
      {
        text: "大声驱赶",
        cost: { hp: 50, sanity: 10 },
        target: "node_evt_takin_scare_feedback",
      },
    ],
  },

  node_evt_takin_wait_feedback: {
    id: "node_evt_takin_wait_feedback",
    text: "你像一尊雕塑一样站了半个小时，大气都不敢出。直到羚牛慢悠悠地啃完草离开，你才敢通过。腿都站麻了。\n(状态反馈：饱食度 -20，理智 +5)",
    bg: "evt_takin_beast",
    choices: [
      {
        text: "松了一口气",
        target: "resume",
      },
    ],
  },

  node_evt_takin_scare_feedback: {
    id: "node_evt_takin_scare_feedback",
    text: "你挥舞登山杖大喊试图吓跑它。羚牛被激怒了，向你发起了冲锋！你被顶飞出去，重重摔在石头上。好在它没有补刀，扬长而去。\n(状态反馈：生命值 -50，理智 -10)",
    bg: "evt_takin_beast",
    choices: [
      {
        text: "痛苦地爬起来",
        target: "resume",
      },
    ],
  },
  evt_hallucination_music: {
    id: "evt_hallucination_music",
    text: "恍惚中，你听到风中传来了秦腔的吼声，高亢激昂。但这里是海拔3000米的无人区，哪来的戏班子？",
    bg: "evt_phantom_opera",
    choices: [
      {
        text: "停下来仔细听",
        cost: { sanity: -10, hunger: 5 },
        target: "node_evt_music_listen_feedback",
      },
      {
        text: "掐自己一下，清醒过来",
        cost: { sanity: 5, hp: 2 },
        target: "node_evt_music_wake_feedback",
      },
    ],
  },

  node_evt_music_listen_feedback: {
    id: "node_evt_music_listen_feedback",
    text: "你坐在石头上，闭上眼睛，那秦腔似乎在诉说着古老的传说。不知过了多久，声音消失了，你感到精神异常放松，仿佛灵魂受到了洗礼。\n(状态反馈：理智 +10，饱食度 -5)",
    bg: "evt_phantom_opera",
    choices: [
      {
        text: "回过神来",
        target: "resume",
      },
    ],
  },

  node_evt_music_wake_feedback: {
    id: "node_evt_music_wake_feedback",
    text: "剧痛让你瞬间清醒。哪有什么秦腔，只有风吹过石缝的呜咽声。刚才那是典型的高原缺氧幻觉，太危险了。\n(状态反馈：理智 -5，生命值 -2)",
    bg: "evt_phantom_opera",
    choices: [
      {
        text: "惊出一身冷汗",
        target: "resume",
      },
    ],
  },
  evt_gear_failure: {
    id: "evt_gear_failure",
    text: "突然脚下一软，你发现登山鞋的鞋底脱胶了，“张开了大嘴”。这是鳌太路上最令人崩溃的装备故障之一。",
    bg: "evt_broken_shoe",
    choices: [
      {
        text: "用求生绳绑住",
        cost: { hunger: 10 },
        target: "node_evt_gear_bind_feedback",
      },
      {
        text: "拖着鞋走 (极易崴脚)",
        cost: { hp: 10, hunger: 10 },
        target: "node_evt_gear_drag_feedback",
      },
    ],
  },

  node_evt_gear_bind_feedback: {
    id: "node_evt_gear_bind_feedback",
    text: "你蹲下来，用求生绳一圈圈把鞋底缠紧。虽然样子丑了点，走路也硌脚，但至少不会掉底了。这需要极大的耐心。\n(状态反馈：饱食度 -10)",
    bg: "evt_broken_shoe",
    choices: [
      {
        text: "凑合着走",
        target: "resume",
      },
    ],
  },

  node_evt_gear_drag_feedback: {
    id: "node_evt_gear_drag_feedback",
    text: "你懒得处理，拖着张嘴的鞋继续走。结果没走两步就绊了一下，脚踝一阵剧痛。每一步都是折磨。\n(状态反馈：生命值 -10，饱食度 -10)",
    bg: "evt_broken_shoe",
    choices: [
      {
        text: "一瘸一拐地走",
        target: "resume",
      },
    ],
  },
  evt_trail_angel: {
    id: "evt_trail_angel",
    text: "在路边的大石头下，你发现了一瓶矿泉水，上面写着“水神赐予后来人”。在这缺水的山脊上，这是无价之宝。",
    bg: "evt_water_bottle",
    choices: [
      {
        text: "感激地喝掉",
        cost: { hunger: -10, sanity: -5 },
        target: "node_evt_angel_drink_feedback",
      },
      {
        text: "留给更需要的人",
        cost: { sanity: -15 }, // Karma boost
        target: "node_evt_angel_leave_feedback",
      },
    ],
  },

  node_evt_angel_drink_feedback: {
    id: "node_evt_angel_drink_feedback",
    text: "你拧开瓶盖，甘甜的水滋润了干裂的嘴唇。你心中默念着感谢那位不知名的好心人。这瓶水不仅解了渴，更给了你继续前行的动力。\n(状态反馈：饱食度 +10，理智 +5)",
    bg: "evt_water_bottle",
    choices: [
      {
        text: "满血复活",
        target: "resume",
      },
    ],
  },

  node_evt_angel_leave_feedback: {
    id: "node_evt_angel_leave_feedback",
    text: "你把水瓶放回原处，用石头压好。也许后面还有更绝望的人需要它。虽然口渴难耐，但你觉得自己做了一件伟大的事，灵魂仿佛升华了。\n(状态反馈：理智 +15)", // sanity cost was negative (gain)
    bg: "evt_water_bottle",
    choices: [
      {
        text: "带着高尚的情操离开",
        target: "resume",
      },
    ],
  },
  evt_lightning: {
    id: "evt_lightning",
    text: "头皮突然发麻，头发竖了起来，空气中充满了滋滋的电流声！是这雷击的前兆！",
    bg: "evt_lightning_hair",
    choices: [
      {
        text: "扔掉登山杖，抱头蹲下",
        target: "node_evt_lightning_squat_feedback",
      },
      {
        text: "惊慌失措地狂奔",
        cost: { hp: 50, sanity: 10 },
        target: "node_evt_lightning_run_feedback",
      },
    ],
  },

  node_evt_lightning_squat_feedback: {
    id: "node_evt_lightning_squat_feedback",
    text: "你迅速扔掉所有金属物品，抱头蹲在低洼处，尽量减少与地面的接触面积。一道闪电劈在不远处，震耳欲聋。你躲过了一劫。\n(状态反馈：无生命危险)",
    bg: "evt_lightning_hair",
    choices: [
      {
        text: "等待雷雨云飘过",
        target: "resume",
      },
    ],
  },

  node_evt_lightning_run_feedback: {
    id: "node_evt_lightning_run_feedback",
    text: "恐惧让你失去了理智，你在雷区狂奔。一道闪电在你身边炸响，巨大的冲击波把你掀翻在地。你虽然没死，但被震得七荤八素，耳朵嗡嗡作响。\n(状态反馈：生命值 -50，理智 -10)",
    bg: "evt_lightning_hair",
    choices: [
      {
        text: "踉跄着爬起来",
        target: "resume",
      },
    ],
  },
  evt_wild_boar: {
    id: "evt_wild_boar",
    text: "前方的箭竹林里传来巨大的“哗啦”声，似乎有庞然大物在穿行。可能是野猪，也可能是黑熊。",
    bg: "evt_wild_boar_shadow",
    choices: [
      {
        text: "敲击登山杖制造噪音",
        target: "node_evt_boar_noise_feedback",
      },
      {
        text: "屏住呼吸，悄悄通过",
        cost: { sanity: 5 },
        target: "node_evt_boar_quiet_feedback",
      },
    ],
  },

  node_evt_boar_noise_feedback: {
    id: "node_evt_boar_noise_feedback",
    text: "你用力敲击登山杖，并大声呵斥。那声音停顿了一下，随后向远处跑去。野兽通常怕人，虚张声势果然管用。\n(状态反馈：危机解除)",
    bg: "evt_wild_boar_shadow",
    choices: [
      {
        text: "继续赶路",
        target: "resume",
      },
    ],
  },

  node_evt_boar_quiet_feedback: {
    id: "node_evt_boar_quiet_feedback",
    text: "你大气都不敢出，蹑手蹑脚地从旁边绕过。每一次心跳声在寂静的林子里都显得震耳欲聋。好在并没有惊动它。\n(状态反馈：理智 -5)",
    bg: "evt_wild_boar_shadow",
    choices: [
      {
        text: "如释重负",
        target: "resume",
      },
    ],
  },
};

export const randomEventIds = [
  "evt_hiker",
  "evt_storm",
  "evt_ranger",
  "evt_body",
  "evt_takin",
  "evt_hallucination_music",
  "evt_gear_failure",
  "evt_trail_angel",
  "evt_lightning",
  "evt_wild_boar",
];
