export interface ChoiceCost {
  hp?: number;
  hunger?: number;
  sanity?: number;
}

export interface SceneChoice {
  text: string;
  target?: string; // Target scene ID. 'resume' for random events.
  cost?: ChoiceCost;
  action?: string; // Special actions: 'restart', 'rest', 'loot_supplies', 'refill_water', 'look_back'
  requiredRole?: string; // Only visible if player has this role
  condition?: string; // [NEW] e.g., 'shuiwozi_water' (must be true in worldFlags) or '!liang2_blocked'
}

export interface Scene {
  id: string;
  text: string;
  choices: SceneChoice[];
  bg?: string;
  type?: "normal" | "loot" | "event";
  weatherText?: Record<string, string>; // [NEW] Key: WeatherType (sunny, storm, etc.)
}

// --- 真实地图节点扩充版 ---
const mapScenes: Record<string, Scene> = {
  // === 第一章：进山 ===

  start_001: {
    id: "start_001",
    text: "这里是塘口村，鳌太线的起点。清晨的空气冷冽刺骨。眼前是连绵的秦岭山脉，墨绿色的冷杉林在风中低语。这一去，便是数日的无人区。",
    bg: "loc_village",
    choices: [
      {
        text: "坐秀才家的拖拉机上山",
        target: "node_tractor_ride", // Target the new intermediate node for narrative flow
        cost: { hp: 0, hunger: 0 },
      },
      {
        text: "徒步前往登山口",
        target: "node_hike_feedback", // Target feedback node
        cost: { hunger: 2, hp: 0 },
      },
    ],
  },

  node_tractor_ride: {
    id: "node_tractor_ride",
    text: "拖拉机突突突地冒着黑烟，颠簸得像在骑马。虽然屁股受罪，但好歹省下了几公里爬坡的力气。秀才回头喊道：“这几天有雨，此时回头还来得及！”",
    bg: "loc_tractor_road",
    choices: [
      {
        text: "谢过秀才，下车",
        target: "node_village_road",
      },
    ],
  },

  node_hike_feedback: {
    id: "node_hike_feedback",
    text: "还没进山，水泥路的上坡就让你气喘吁吁。背包带勒进肩膀，由于还没热身，每一步都显得格外沉重。\n(状态反馈：饱食度 -2)",
    bg: "loc_village",
    choices: [
      {
        text: "调整呼吸，继续",
        target: "node_village_road",
      },
    ],
  },

  node_village_road: {
    id: "node_village_road",
    text: "机耕路尽头是登山口。告示牌醒目写着：此为国家级自然保护区，禁止入内。违者罚款100-5000元。为了安全，请立即原路返回。",
    bg: "loc_tractor_road",
    choices: [
      {
        text: "加快脚步热身",
        target: "node_village_road_hike_feedback",
        cost: { hunger: 2 },
      },
      {
        text: "检查背包",
        target: "node_village_road_check_feedback",
        cost: { hunger: 1 },
      },
    ],
  },

  node_village_road_hike_feedback: {
    id: "node_village_road_hike_feedback",
    text: "你加快了步频，身体逐渐热了起来。虽然只是机耕路，但坡度已经让你微微出汗。你感觉身体慢慢进入了状态。\n(状态反馈：饱食度 -2)",
    bg: "loc_tractor_road",
    choices: [
      {
        text: "身体活动开了",
        target: "node_river_crossing",
      },
    ],
  },

  node_village_road_check_feedback: {
    id: "node_village_road_check_feedback",
    text: "你停下来仔细检查了背包扣件和鞋带，重新调整了负重系统。虽然耽误了一点时间，但磨刀不误砍柴工，接下来的路会舒服很多。\n(状态反馈：饱食度 -1)",
    bg: "loc_tractor_road",
    choices: [
      {
        text: "确认无误",
        target: "node_river_crossing",
      },
    ],
  },

  node_river_crossing: {
    id: "node_river_crossing",
    text: "唯一的补水点。泉水冰冷刺骨，但能救命。你需要在这里补充水源。",
    bg: "loc_river",
    choices: [
      {
        text: "踩着石头跳过去",
        target: "node_river_jump_feedback",
        cost: { hunger: 3, sanity: 2 },
      },
      {
        text: "脱鞋涉水",
        target: "node_river_wade_feedback",
        cost: { hp: 2, hunger: 2 },
      },
      {
        text: "[退伍军人] 搭建简易绳桥通过",
        requiredRole: "veteran",
        target: "node_river_bridge_feedback",
        cost: { hunger: 1 },
      },
    ],
  },

  node_river_jump_feedback: {
    id: "node_river_jump_feedback",
    text: "你深吸一口气，在湿滑的乱石间腾挪。脚底打滑的瞬间，心脏猛地一缩，好在核心力量稳住了平衡。虽然没湿鞋，但精神高度紧张。\n(状态反馈：饱食度 -3，理智 -2)",
    bg: "loc_river",
    choices: [
      {
        text: "心有余悸，继续前行",
        target: "node_forest_entry",
      },
    ],
  },

  node_river_wade_feedback: {
    id: "node_river_wade_feedback",
    text: "冰冷的河水瞬间刺透皮肤，骨头都被冻得生疼。河底的尖石硌得脚板发麻。上岸擦干脚时，你的双脚已经冻得通红。\n(状态反馈：生命值 -2，饱食度 -2)",
    bg: "loc_river",
    choices: [
      {
        text: "穿好鞋袜，暖和一下",
        target: "node_forest_entry",
      },
    ],
  },

  node_river_bridge_feedback: {
    id: "node_river_bridge_feedback",
    text: "凭借过硬的野外生存技能，你利用枯木和伞绳快速搭建了简易支点。如履平地般通过了河流，仅仅消耗了一点体力。\n(状态反馈：饱食度 -1)",
    bg: "loc_river",
    choices: [
      {
        text: "收拾装备，轻松上路",
        target: "node_forest_entry",
      },
    ],
  },

  node_forest_entry: {
    id: "node_forest_entry",
    text: "过了登山口便是火烧坡，坡上长满小杂木，开满小花，走起来还算轻松。但随着海拔爬升，呼吸开始变得急促。",
    bg: "loc_red_birch",
    choices: [
      {
        text: "保持节奏爬升",
        target: "node_forest_entry_climb_feedback",
        cost: { hunger: 5, hp: 2 },
      },
      {
        text: "回头看一眼山下的村庄",
        action: "look_back",
        target: "node_forest_entry_look_feedback",
        cost: { hunger: 3, sanity: -5 },
      },
    ],
  },

  node_forest_entry_climb_feedback: {
    id: "node_forest_entry_climb_feedback",
    text: "不管路况如何，你始终保持着均匀的呼吸和步幅。机械的重复动作让人感到枯燥，但这是应对长距离爬升最有效的方法。\n(状态反馈：饱食度 -5，生命值 -2)",
    bg: "loc_red_birch",
    choices: [
      {
        text: "继续爬升",
        target: "node_forest_climb",
      },
    ],
  },

  node_forest_entry_look_feedback: {
    id: "node_forest_entry_look_feedback",
    text: "你停下脚步回头望去，山下的村庄已经变成了火柴盒大小。不知为何，看着那个熟悉的文明世界，心中突然涌起一阵对前路的恐惧。\n(状态反馈：饱食度 -3，理智 -5)",
    bg: "loc_red_birch",
    choices: [
      {
        text: "转过头，不再留恋",
        target: "node_forest_climb",
      },
    ],
  },

  node_forest_climb: {
    id: "node_forest_climb",
    text: "海拔上升到2600米。树木变得稀疏，空气也变得稀薄。每迈出一步都需要大口喘气。",
    bg: "loc_forest",
    choices: [
      {
        text: "咬牙坚持",
        target: "node_forest_climb_push_feedback",
        cost: { hunger: 15, hp: 5 },
      },
      {
        text: "喝口水继续赶路",
        cost: { hp: -5, hunger: -2 },
        target: "node_2900",
      },
    ],
  },

  node_forest_climb_push_feedback: {
    id: "node_forest_climb_push_feedback",
    text: "缺氧让你的脑袋发涨，腿像灌了铅一样沉重。你全凭意志力在抬腿。汗水流进眼睛里，刺痛难忍。\n(状态反馈：饱食度 -15，生命值 -5)",
    bg: "loc_forest",
    choices: [
      {
        text: "看到营地了",
        target: "node_2900",
      },
    ],
  },

  node_2900: {
    id: "node_2900",
    text: "2900营地。通常早上出发的人中午就到这了，只有下午上山的才在此扎营。再往上走一点看到歪脖子树，就快到山脊线了。",
    bg: "loc_sunset_meadow",
    choices: [
      {
        text: "搭帐篷过夜",
        action: "rest",
        target: "node_2900_morning",
      },
      { text: "感觉状态不对，决定下撤", target: "end_retreat" },
    ],
  },

  node_2900_morning: {
    id: "node_2900_morning",
    text: "清晨的阳光洒在帐篷上。昨晚虽然寒冷，但你终于恢复了一些体力。是时候出发了。",
    bg: "loc_sunset_meadow",
    choices: [{ text: "拔营前往盆景园", target: "node_penjing_ascent" }],
  },

  // === 第二章：脊线之上  ===

  node_penjing_ascent: {
    id: "node_penjing_ascent",
    text: "离开2900营地，路面变成了破碎的石块。这就是“石海”的雏形。脚下容易打滑，极其消耗体力。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "手脚并用攀爬",
        target: "node_penjing_ascent_climb_feedback",
        cost: { hunger: 20, hp: 5 },
      },
      {
        text: "使用登山杖支撑",
        target: "node_penjing_ascent_stick_feedback",
        cost: { hunger: 15 },
      },
    ],
  },

  node_penjing_ascent_climb_feedback: {
    id: "node_penjing_ascent_climb_feedback",
    text: "你像一只壁虎一样趴在乱石上移动。虽然姿势不雅，但四点着地确实稳当。只是手指被粗糙的岩石磨得生疼。\n(状态反馈：饱食度 -20，生命值 -5)",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "翻过乱石坡",
        target: "node_penjing",
      },
    ],
  },

  node_penjing_ascent_stick_feedback: {
    id: "node_penjing_ascent_stick_feedback",
    text: "登山杖由于受力过猛而微微弯曲。你把全身重量都压在杖上，减轻了膝盖的负担。这种省力的技巧让你在乱石中游刃有余。\n(状态反馈：饱食度 -15)",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "拄着杖继续走",
        target: "node_penjing",
      },
    ],
  },

  node_penjing: {
    id: "node_penjing",
    text: "鳌太山脊在这里拐了个大弯。这里有信号，可以给家人报个平安。下方深沟里似乎隐约有水源的反光。",
    bg: "loc_penjing",
    choices: [
      {
        text: "给家人打电话",
        target: "node_penjing_call_feedback",
        cost: { sanity: -20 },
      },
      {
        text: "下沟取水",
        target: "node_penjing_gully",
        cost: { hunger: 5 },
      },
      {
        text: "继续赶路",
        target: "node_penjing_hike_feedback",
        cost: { hunger: 15, hp: 5 },
      },
    ],
  },

  node_penjing_call_feedback: {
    id: "node_penjing_call_feedback",
    text: "电话接通的那一刻，听到家人的声音，眼泪差点掉下来。你强忍着哽咽报了平安，挂断电话后，心里的石头落地了，但孤独感也随之涌上心头。\n(状态反馈：理智 +20)",
    bg: "loc_penjing",
    choices: [
      {
        text: "收拾心情，重新出发",
        target: "node_baiqi_start",
      },
    ],
  },

  node_penjing_hike_feedback: {
    id: "node_penjing_hike_feedback",
    text: "你没有停留，咬紧牙关继续赶路。盆景园的路看似平缓，实则暗藏杀机。脚下的乱石不断消耗着你的体能，每一步都需要格外小心。\n(状态反馈：饱食度 -15，生命值 -5)",
    bg: "loc_penjing",
    choices: [
      {
        text: "调整步伐，继续",
        target: "node_baiqi_start",
      },
    ],
  },

  node_penjing_gully: {
    id: "node_penjing_gully",
    text: "你艰难地下到深沟，果然发现了一处水源，旁边还有一些驴友遗弃的气罐和食物。",
    bg: "loc_spring_water",
    choices: [
      {
        text: "搜刮物资并返回值路",
        action: "loot_supplies",
        target: "node_penjing_return_feedback",
        cost: { hunger: 10, hp: 5 },
      },
    ],
  },

  node_penjing_return_feedback: {
    id: "node_penjing_return_feedback",
    text: "背包里多了物资，心里踏实了，但身体更累了。从深沟爬回主路的过程简直是噩梦，肺部像拉风箱一样剧烈起伏。\n(状态反馈：饱食度 -10，生命值 -5)",
    bg: "loc_penjing",
    choices: [
      {
        text: "大口喘气，平复心跳",
        target: "node_baiqi_start",
      },
    ],
  },

  node_baiqi_start: {
    id: "node_baiqi_start",
    text: "经过白起庙。线路从北往南折而向东。草甸上路径明显，一条道通往导航架。虽然要翻越石海，但这片石海经过亿万年沉淀，非常稳固。",
    bg: "loc_ridge",
    choices: [
      {
        text: "轻松翻越石海",
        target: "node_baiqi_middle", // Added intermediate node logic back from 2f007a7 but simplified to target nav_stand if middle missing? No, 2f007a7 had node_baiqi_middle. I'll include it.
        cost: { hunger: 5 },
      },
    ],
  },

  node_baiqi_middle: {
    id: "node_baiqi_middle",
    text: "翻过这片石海，远方的导航架在向你招手了。这种单调的行走最容易消磨意志。",
    bg: "loc_ridge",
    choices: [
      {
        text: "保持节奏前进",
        target: "node_baiqi_pace_feedback",
        cost: { hunger: 5, hp: 2 },
      },
      {
        text: "加速奔向导航架",
        target: "node_baiqi_rush_feedback",
        cost: { hunger: 10, hp: 1 },
      },
    ],
  },

  node_baiqi_pace_feedback: {
    id: "node_baiqi_pace_feedback",
    text: "你强压下急躁的心情，调整呼吸配合步伐。虽然慢了一点，但每一步都走得很稳，体能流失在可控范围内。\n(状态反馈：饱食度 -5，生命值 -2)",
    bg: "loc_ridge",
    choices: [
      {
        text: "稳扎稳打",
        target: "node_nav_stand",
      },
    ],
  },

  node_baiqi_rush_feedback: {
    id: "node_baiqi_rush_feedback",
    text: "看着目标就在眼前，你不知不觉加快了脚步。心跳剧烈加速，汗水很快浸湿了速干衣。虽然快，但这种急行军极其透支体力。\n(状态反馈：饱食度 -10，生命值 -1)",
    bg: "loc_ridge",
    choices: [
      {
        text: "喘着粗气到达",
        target: "node_nav_stand",
      },
    ],
  },

  node_nav_stand: {
    id: "node_nav_stand",
    text: "鳌山导航架位居路径右侧。切记：直走是往23公里下山的错误死路！对着左前方那面蓝色旗子走，途径药王庙（供奉着孙思邈），才是正路。",
    bg: "loc_nav_stand",
    choices: [
      {
        text: "向左切，对准蓝旗方向",
        target: "node_nav_left_feedback",
        cost: { hunger: 5 },
      },
      {
        text: "迷信直觉，直走",
        target: "end_lost_23km",
        cost: { hunger: 20, sanity: 20 },
      },
    ],
  },

  node_nav_left_feedback: {
    id: "node_nav_left_feedback",
    text: "你信任了前人的指引，向左切去。虽然路迹模糊，但在草甸中穿行比乱石滩轻松多了。远处的蓝旗在风中猎猎作响，仿佛在为你点赞。\n(状态反馈：饱食度 -5)",
    bg: "loc_nav_stand",
    choices: [
      {
        text: "向着蓝旗前进",
        target: "node_maijie_descent",
      },
    ],
  },

  // === 第三章：凶险之间  ===

  node_maijie_descent: {
    id: "node_maijie_descent",
    text: "经过两座巨石阵，前方就是麦秸岭。远看险恶石海陈列，近看右侧有兽道。这是第一道“拦路虎”。",
    bg: "loc_ridge",
    choices: [
      {
        text: "沿着羚牛兽道右切",
        target: "node_maijie_path_feedback",
        cost: { hunger: 5 },
      },
      {
        text: "强行翻越石海",
        target: "node_maijie_climb_feedback",
        cost: { hunger: 20, hp: 15, sanity: -5 },
      },
    ],
  },

  node_maijie_path_feedback: {
    id: "node_maijie_path_feedback",
    text: "你跟随羚牛的足迹，在乱石缝隙中找到了一条相对平缓的兽道。虽然绕了一些路，但避开了最危险的锋利岩石，保存了宝贵的体力。\n(状态反馈：饱食度 -5)",
    bg: "loc_ridge",
    choices: [
      {
        text: "庆幸选对了路",
        target: "node_knife_ridge",
      },
    ],
  },

  node_maijie_climb_feedback: {
    id: "node_maijie_climb_feedback",
    text: "你选择了直面困难。巨石摇晃，每一步都要手脚并用。锋利的岩石划破了裤腿，恐高感让你在某个瞬间大脑一片空白。\n(状态反馈：饱食度 -20，生命值 -15，理智 -5)",
    bg: "loc_ridge",
    choices: [
      {
        text: "心惊肉跳地通过",
        target: "node_knife_ridge",
      },
    ],
  },

  node_knife_ridge: {
    id: "node_knife_ridge",
    text: "小心通过了刀刃梁。当你看到挂在石头上的“胸罩”标记时，意味着麦秸岭最危险的路段已经结束了。前方是一路下坡。",
    weatherText: {
      storm:
        "狂风夹杂着冰粒像鞭子一样抽打在脸上。你只能匍匐前进，生怕一阵风把你吹下万丈深渊。路标已经被雪掩埋了一半。",
      fog: "除了脚下的那一小块石头，你什么都看不见。世界是一片白色的虚无，左边是悬崖，右边也是悬崖。恐惧来自于未知。",
    },
    bg: "loc_knife_ridge",
    choices: [
      {
        text: "长舒一口气，滑下碎石坡",
        target: "node_knife_descent_feedback",
        cost: { hunger: 5, sanity: -5 },
      },
    ],
  },

  node_knife_descent_feedback: {
    id: "node_knife_descent_feedback",
    text: "你像滑雪一样顺着碎石坡滑下，扬起一片尘土。虽然大腿前侧肌肉酸胀，但这可比上坡痛快多了。终于不用在刀尖上跳舞了。\n(状态反馈：饱食度 -5，理智 +5)",
    bg: "loc_knife_ridge",
    choices: [
      {
        text: "抵达垭口",
        target: "node_shuiwozi_source",
      },
    ],
  },

  node_shuiwozi_source: {
    id: "node_shuiwozi_source",
    text: "下到底就是水窝子垭口。这片大草地适合扎营但没水。直走上飞机梁，左侧下沟则是水窝子营地。",
    bg: "loc_spring_water",
    choices: [
      {
        text: "左下切去营地取水",
        target: "node_shuiwozi_descent_success_feedback",
        cost: { hunger: 5 },
        condition: "shuiwozi_water", // Show if water exists
      },
      {
        text: "左下切去营地",
        target: "node_shuiwozi_descent_fail_feedback",
        cost: { hunger: 10, sanity: 5 },
        condition: "!shuiwozi_water", // Show if dry
      },
      {
        text: "垭口无水扎营",
        target: "node_shuiwozi_pass_camp_feedback",
        cost: { hunger: 10, sanity: 10 },
      },
    ],
  },

  node_shuiwozi_descent_success_feedback: {
    id: "node_shuiwozi_descent_success_feedback",
    text: "一路下切到沟底，植被逐渐茂密。远远听到潺潺水声，那是生命的声音。你连跑带滑冲向水源。\n(状态反馈：饱食度 -5)",
    bg: "loc_spring_water",
    choices: [
      {
        text: "扑向水源",
        target: "node_shuiwozi_camp",
      },
    ],
  },

  node_shuiwozi_descent_fail_feedback: {
    id: "node_shuiwozi_descent_fail_feedback",
    text: "沟深路陡，越往下走心里越没底。并没有听到预期的水声，四周死寂沉沉。你的喉咙在那一刻似乎更干了。\n(状态反馈：饱食度 -10，理智 -5)",
    bg: "loc_spring_water",
    choices: [
      {
        text: "绝望地走到沟底",
        target: "node_shuiwozi_dry",
      },
    ],
  },

  node_shuiwozi_pass_camp_feedback: {
    id: "node_shuiwozi_pass_camp_feedback",
    text: "既然没水，就不折腾下沟了。你在垭口找了块平地，伴着呼啸的风声和极度的口渴，度过了漫长的一夜。梦里全是冰镇可乐。\n(状态反馈：饱食度 -10，理智 -10)",
    bg: "loc_spring_water",
    choices: [
      {
        text: "拔营起身上路",
        target: "node_plane_wreck",
      },
    ],
  },

  node_shuiwozi_camp: {
    id: "node_shuiwozi_camp",
    text: "下午14:20，到达水窝子营地。左下方有巨大的水源。如果在营地扎营，明天有小路可直上飞机梁，不必折返爬坡。",
    bg: "loc_camp",
    choices: [
      {
        text: "扎营休整 (左下取水)",
        action: "rest",
        target: "node_shuiwozi_morning",
      },
      {
        text: "感到极限，决定下撤",
        target: "end_retreat",
      },
    ],
  },

  node_shuiwozi_dry: {
    id: "node_shuiwozi_dry",
    text: "你艰难地下到沟底，却发现水源早已干涸。希望破灭了。你只能在乱石堆中勉强找个平地扎营，干粮像沙砾一样难以下咽。",
    bg: "loc_camp",
    choices: [
      {
        text: "苦熬一夜",
        action: "rest",
        target: "node_shuiwozi_morning",
        cost: { hp: 5, sanity: 15 },
      },
    ],
  },

  node_shuiwozi_morning: {
    id: "node_shuiwozi_morning",
    text: "清晨的云海翻腾。收拾好装备，沿着营地旁的小路直接切上飞机梁。今天是过梁的一天。",
    bg: "loc_camp",
    choices: [{ text: "出发，穿越飞机梁", target: "node_plane_wreck" }],
  },

  // === 第四章：迷途 ===

  node_plane_wreck: {
    id: "node_plane_wreck",
    text: "爬上飞机梁，你看到了一些战机残骸和遇难山友的纪念碑。接下来要连续过三个梁。这是挑战心理的一段路。",
    bg: "loc_plane_wreck",
    choices: [
      {
        text: "查看残骸与纪念碑",
        target: "node_liang1",
        cost: { sanity: 5 },
        action: "loot_supplies",
      },
      { text: "不看，直接前往梁1", target: "node_liang1" },
    ],
  },

  node_liang1: {
    id: "node_liang1",
    text: "左切。遇到一个一人高的台阶，踏脚处仅有四五十厘米，左边就是悬崖。这对于重装驴友是极大的心理考验。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "克服恐惧，小心攀登",
        target: "node_liang2",
        cost: { hunger: 10, sanity: -5 },
      },
      {
        text: "腿软，在同伴/意念帮助下通过",
        target: "node_liang2",
        cost: { hunger: 10, sanity: 10 },
      },
    ],
  },

  node_liang2: {
    id: "node_liang2",
    text: "岔路口。左切是先下一个2米深的陡坡滑下去，再拔高；右切则是横穿一片稳固的石海。两条路殊途同归。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "右切走石海",
        target: "node_liang3",
        cost: { hunger: 10 },
        condition: "!liang2_blocked",
      },
      {
        text: "右切石海 (塌方不可行)",
        target: "node_stone_sea_climb",
        cost: { hunger: 5, sanity: 5 },
        condition: "liang2_blocked",
      },
      {
        text: "左切滑下陡坡",
        target: "node_liang3",
        cost: { hunger: 15, hp: 5 },
      },
    ],
  },

  node_stone_sea_climb: {
    id: "node_stone_sea_climb",
    text: "常规的横切路线被完全阻断。你不得不向下绕行乱石堆。每踩一步，石头都在晃动，发出令人胆寒的撞击声。这一绕，多耗费了一个小时。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "终于绕回主路，继续前进",
        target: "node_liang3",
        cost: { hunger: 10, hp: 5 },
      },
    ],
  },

  node_liang3: {
    id: "node_liang3",
    text: "继续右切。连过三梁，体能消耗巨大。前方就是今天的营地了。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "坚持走到营地",
        target: "node_2800",
        cost: { hunger: 10 },
      },
    ],
  },

  node_2800: {
    id: "node_2800",
    text: "下午15:00，到达2800营地。这里被誉为“五星级营地”，地势平坦，水源在右侧松树林边。这里是鳌山和太白山的分界线。",
    bg: "loc_forest",
    choices: [
      {
        text: "扎营",
        action: "rest",
        target: "node_pyramid_ascent",
      },
      {
        text: "连夜赶路",
        target: "node_fog_entry",
        cost: { sanity: -50 },
      },
    ],
  },

  // === 第五章：朝圣 ===

  node_pyramid_ascent: {
    id: "node_pyramid_ascent",
    text: "早上6:40出发。今天要“塔石连走”，强度极大。从2800营地一路拔高1.5小时，首先要翻越金字塔。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "开始漫长的攀爬",
        target: "node_pyramid_climb_feedback",
        cost: { hunger: 15 },
      },
    ],
  },

  node_pyramid_climb_feedback: {
    id: "node_pyramid_climb_feedback",
    text: "从2800营地拔高，每一步都在挑战心肺极限。随着海拔上升，植被消失，只剩下冰冷的石头。当你站在金字塔顶端时，回望来路，不由得心生敬畏。\n(状态反馈：饱食度 -15)",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "抵达塔顶",
        target: "node_pyramid",
      },
    ],
  },

  node_pyramid: {
    id: "node_pyramid",
    text: "金字塔顶。远眺前方，塔1、塔2、塔3如恐龙脊背般排列。",
    bg: "loc_ridge",
    choices: [
      {
        text: "向塔1进发",
        target: "node_ta1",
        cost: { hunger: 5 },
      },
    ],
  },

  node_ta1: {
    id: "node_ta1",
    text: "塔1。巨石林立，路窄且滑。",
    bg: "loc_ridge",
    choices: [
      {
        text: "小心通过",
        target: "node_ta2",
        cost: { hunger: 8, hp: 2 },
      },
    ],
  },

  node_ta2: {
    id: "node_ta2",
    text: "塔2。需要在乱石中寻找路标。",
    bg: "loc_ridge",
    choices: [
      {
        text: "顶风翻越",
        target: "node_ta3",
        cost: { hunger: 10, hp: 5 },
      },
    ],
  },

  node_ta3: {
    id: "node_ta3",
    text: "塔3。如果西源营地没水，后果不堪设想。是否下路取水？",
    bg: "loc_spring_water",
    choices: [
      {
        text: "下撤取水背负",
        action: "loot_supplies",
        target: "node_ta3_loot_feedback",
        cost: { hunger: 15, hp: 5 },
      },
      {
        text: "赌西源有水，直接走",
        target: "node_ta3_gamble_feedback",
        cost: { hunger: 5 },
      },
    ],
  },

  node_ta3_loot_feedback: {
    id: "node_ta3_loot_feedback",
    text: "为了保险起见，你决定多花力气背水。下西源的路异常陡峭，回来时背着沉重的水袋，每一步都像在举重。但看着满满的水袋，心里踏实了。\n(状态反馈：饱食度 -15，生命值 -5)",
    bg: "loc_spring_water",
    choices: [
      {
        text: "背着水袋前往营地",
        target: "node_xiyuan",
      },
    ],
  },

  node_ta3_gamble_feedback: {
    id: "node_ta3_gamble_feedback",
    text: "你决定相信运气，或者说相信老天爷。省去了下撤的体力，你轻装快步走向营地，夕阳把你的影子拉得很长。\n(状态反馈：饱食度 -5)",
    bg: "loc_spring_water",
    choices: [
      {
        text: "忐忑地前往营地",
        target: "node_xiyuan",
      },
    ],
  },

  node_xiyuan: {
    id: "node_xiyuan",
    text: "西源营地。干涸的河床在夕阳下通红。",
    bg: "loc_camp",
    choices: [
      {
        text: "因为背了水，安心扎营",
        action: "rest",
        target: "node_stone_sea_9",
      },
      {
        text: "没水，强行翻九重石海",
        target: "node_stone_sea_9",
        cost: { hunger: 30, sanity: 20, hp: 10 },
      },
    ],
  },

  node_stone_sea_9: {
    id: "node_stone_sea_9",
    text: "第五天全是石头。九重石海，那种地狱般的折磨。",
    bg: "loc_stone_sea_giant_ship",
    choices: [
      {
        text: "机械地向上攀爬",
        target: "node_stone_sea_climb_feedback",
        cost: { hunger: 10 },
      },
      {
        text: "[运动员] 爆发式匀速攀登",
        requiredRole: "athlete",
        target: "node_stone_sea_climb_feedback",
        cost: { hunger: 5 }, // Efficient
      },
    ],
  },

  node_stone_sea_climb_feedback: {
    id: "node_stone_sea_climb_feedback",
    text: "还剩八层。大腿肌肉在燃烧。\n(状态反馈：饱食度大幅下降)",
    bg: "loc_stone_sea_giant_ship",
    choices: [
      {
        text: "喝口水，继续爬",
        target: "node_dashihe",
        cost: { hunger: 15, hp: 5 },
      },
    ],
  },

  node_dashihe: {
    id: "node_dashihe",
    text: "大石河。流水声简直是世界上最美妙的音乐。",
    bg: "loc_camp",
    choices: [
      {
        text: "狂饮河水，扎营",
        action: "rest",
        target: "node_dashihe_drink_feedback",
      },
    ],
  },

  node_dashihe_drink_feedback: {
    id: "node_dashihe_drink_feedback",
    text: "冰冷透骨的河水顺着喉咙流下，五脏六腑都跟着颤抖。这一路的干渴终于得到了缓解。你在河边洗了把脸，感觉活过来了。",
    bg: "loc_camp",
    choices: [
      {
        text: "钻进帐篷休息",
        target: "node_wanxian",
      },
    ],
  },

  node_wanxian: {
    id: "node_wanxian",
    text: "早晨出发，走过万仙阵，前方就是太白最高峰——拔仙台。",
    bg: "loc_wanxian",
    choices: [
      {
        text: "前行",
        target: "node_summit_fork",
        cost: { hunger: 5 },
      },
    ],
  },

  node_summit_fork: {
    id: "node_summit_fork",
    text: "岔路口。左边去大爷海，右边去拔仙台顶峰。",
    bg: "loc_ridge",
    choices: [
      {
        text: "右转登顶",
        target: "node_summit_fork_climb_feedback",
        cost: { hunger: 10, hp: 5 },
      },
      {
        text: "直奔大爷海",
        target: "node_summit_fork_skip_feedback",
        cost: { hunger: 5 },
      },
    ],
  },

  node_summit_fork_climb_feedback: {
    id: "node_summit_fork_climb_feedback",
    text: "你选择了登顶。虽然已经筋疲力尽，但“来都来了”的念头支撑着你。最后这段路是手脚并用爬上去的。\n(状态反馈：饱食度 -10，生命值 -5)",
    bg: "loc_ridge",
    choices: [
      {
        text: "终于站上顶峰",
        target: "node_baxiantai",
      },
    ],
  },

  node_summit_fork_skip_feedback: {
    id: "node_summit_fork_skip_feedback",
    text: "你放弃了登顶。看着右侧通往顶峰的路，你摇了摇头。留得青山在，不怕没柴烧。保存体力下山更重要。\n(状态反馈：饱食度 -5)",
    bg: "loc_ridge",
    choices: [
      {
        text: "前往大爷海",
        target: "node_daye_lake",
      },
    ],
  },

  node_baxiantai: {
    id: "node_baxiantai",
    text: "拔仙台。海拔3767.2米。秦岭之巅。",
    weatherText: {
      storm:
        "海拔3767.2米。没有云海，只有呼啸的死神。这里是生命的禁区。你必须立刻下撤，否则会被冻成冰雕。",
      sunny:
        "海拔3767.2米。秦岭之巅。脚下的云海波澜壮阔，金色的阳光洒满全身。这一刻，你觉得自己是世界的主宰。",
    },
    bg: "loc_baxiantai_ruins",
    choices: [
      {
        text: "下撤",
        target: "node_daye_lake",
      },
    ],
  },

  node_daye_lake: {
    id: "node_daye_lake",
    text: "大爷海。深蓝色的湖水像一颗宝石。湖边的接待站散发着泡面的香气。",
    bg: "loc_daye_lake",
    choices: [
      {
        text: "奢侈一把，买吃买喝",
        target: "node_daye_lake_buy_feedback",
        cost: { hunger: -50, sanity: -50 },
      },
      {
        text: "继续赶路",
        target: "node_daye_lake_skip_feedback",
        cost: { hunger: 5 },
      },
    ],
  },

  node_daye_lake_buy_feedback: {
    id: "node_daye_lake_buy_feedback",
    text: "泡面的香气在冰冷的空气中是如此诱人。你大口喝着热汤，感觉每一个细胞都在欢呼。什么都不想了，先吃饱再说。\n(状态反馈：饱食度 +50，理智 +50)",
    bg: "loc_daye_lake",
    choices: [
      {
        text: "心满意足地上路",
        target: "node_wengong",
      },
    ],
  },

  node_daye_lake_skip_feedback: {
    id: "node_daye_lake_skip_feedback",
    text: "你咽了口唾沫，强行把视线从接待站移开。虽然肚子在抗议，但你知道不能在这里懈怠。一鼓作气，继续下山。\n(状态反馈：饱食度 -5)",
    bg: "loc_daye_lake",
    choices: [
      {
        text: "毅然离开",
        target: "node_wengong",
      },
    ],
  },

  node_wengong: {
    id: "node_wengong",
    text: "文公庙。基本算走出了无人区。这里是分界线。",
    bg: "loc_wengong_temple",
    choices: [
      {
        text: "直接坐索道下山",
        target: "end_success",
      },
      {
        text: "走完大鳌太全程",
        target: "node_wengong_walk_feedback",
        cost: { hunger: 10 },
      },
    ],
  },

  node_wengong_walk_feedback: {
    id: "node_wengong_walk_feedback",
    text: "大多数人在这里就结束了。但你选择了继续。接下来的路是无尽的跑马梁，枯燥、漫长，却是大鳌太的精华所在。\n(状态反馈：饱食度 -10)",
    bg: "loc_wengong_temple",
    choices: [
      {
        text: "踏上跑马梁",
        target: "node_fangyang",
      },
    ],
  },

  node_fangyang: {
    id: "node_fangyang",
    text: "下到放羊寺，膝盖开始剧烈疼痛。",
    bg: "loc_fangyang_temple",
    choices: [
      {
        text: "坚持走下去",
        target: "node_fangyang_hike_feedback",
        cost: { hunger: 10, hp: 5 },
      },
    ],
  },

  node_fangyang_hike_feedback: {
    id: "node_fangyang_hike_feedback",
    text: "膝盖已经到了极限，每一步都是钻心的疼。你只能用登山杖死死撑住地面，像机器人一样机械地挪动。\n(状态反馈：饱食度 -10，生命值 -5)",
    bg: "loc_fangyang_temple",
    choices: [
      {
        text: "咬牙前行",
        target: "node_mingxing",
      },
    ],
  },

  node_mingxing: {
    id: "node_mingxing",
    text: "明星寺。最后一晚的营地。",
    bg: "loc_mingxing_temple",
    choices: [
      {
        text: "安然入睡",
        action: "rest",
        target: "node_mingxing_morning",
      },
    ],
  },

  node_mingxing_morning: {
    id: "node_mingxing_morning",
    text: "一路狂奔下山。平安寺之后，就是无尽的土路下坡。",
    bg: "loc_forest",
    choices: [
      {
        text: "冲向终点",
        target: "node_exit_village",
        cost: { hunger: 10 },
      },
    ],
  },

  node_fog_entry: {
    id: "node_fog_entry",
    text: "【突发迷雾】\n一阵妖风刮过，四周瞬间白茫茫一片。能见度不足5米。你听到了类似人说话的声音，但周围明明没有人。",
    bg: "bg_fog",
    choices: [
      {
        text: "查看指北针",
        target: "node_plane_wreck",
        cost: { sanity: -5 },
      },
      {
        text: "吓得乱跑",
        target: "end_lost_23km",
        cost: { sanity: 20 },
      },
      {
        text: "[大学生] 掏出手机查看离线地图",
        requiredRole: "student",
        target: "node_plane_wreck",
        cost: { sanity: -5 },
      },
    ],
  },

  node_exit_village: {
    id: "node_exit_village",
    text: "水泥路出现了！农家乐的招牌，汽车的喇叭声，饭菜的香味。你活着走出来了。",
    bg: "loc_village",
    choices: [
      {
        text: "包车回家",
        target: "end_game_cleared",
      },
    ],
  },

  end_game_cleared: {
    id: "end_game_cleared",
    text: "在车上沉沉睡去。鳌太，不再是一个地名，而成了你生命中的一部分勋章。",
    bg: "bg_sunny",
    choices: [{ text: "旅途圆满结束", action: "restart" }],
  },

  // --- Endings ---

  end_success: {
    id: "end_success",
    text: "【小鳌太完成】\n虽然没有走完全程，但能安全出山已是胜利。缆车下山的那一刻，看着脚下的万丈深渊，你庆幸自己活着。",
    bg: "bg_sunny",
    choices: [{ text: "徒步结束", action: "restart" }],
  },
  end_retreat: {
    id: "end_retreat",
    text: "【明智下撤】\n山就在那里，不会跑。今天的下撤，是为了明天更好的攀登。活着回来，比登顶更重要。",
    bg: "loc_village",
    choices: [{ text: "徒步结束", action: "restart" }],
  },
  dead_001: {
    id: "dead_001",
    text: "【长眠大山】你的意识逐渐模糊... 身体不再寒冷，反而感到一丝温暖。在这片无人区，你成为了大山的一部分。",
    bg: "bg_snow",
    choices: [{ text: "徒步结束", action: "restart" }],
  },
  dead_starve: {
    id: "dead_starve",
    text: "天色渐晚，雾气开始上涌。你来到了红桦林。枯红的树皮如血般剥落，风吹过发出沙沙的声响。",
    bg: "bg_snow",
    choices: [{ text: "徒步结束", action: "restart" }],
  },
  dead_cold: {
    id: "dead_cold",
    text: "【失温】核心体温降低，你开始出现幻觉，感到异常燥热而脱去了衣服... 最后的微笑凝固在嘴角。",
    bg: "bg_storm",
    choices: [{ text: "徒步结束", action: "restart" }],
  },
  dead_sanity: {
    id: "dead_sanity",
    text: "【崩溃】无尽的黑暗和风声击垮了你的意志。你开始胡言乱语，冲向了悬崖...",
    bg: "bg_fog",
    choices: [{ text: "徒步结束", action: "restart" }],
  },
  end_lost_23km: {
    id: "end_lost_23km",
    text: "【失踪】你虽然走了直路，却越走越偏。这是著名的“23公里跑道”，一条通往死亡的单行道。没人知道你去了哪里。",
    bg: "bg_fog",
    choices: [{ text: "徒步结束", action: "restart" }],
  },
  end_caught: {
    id: "end_caught",
    text: "【被捕】你被巡山队带回了派出所。写下保证书，缴纳罚款3000元，并被列入黑名单。这一趟“非法穿越”终究以闹剧收场。",
    bg: "loc_village", // Updated
    choices: [{ text: "徒步结束", action: "restart" }],
  },
  end_rescue: {
    id: "end_rescue",
    text: "【获救】只有亲历者才知道等待救援的那十几个小时有多绝望。获救了，但“驴友”的名声又多了一笔负面教材。",
    bg: "loc_camp",
    choices: [{ text: "徒步结束", action: "restart" }],
  },
};

// --- 随机事件 ---
const eventScenes: Record<string, Scene> = {
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
        cost: { hunger: 5, sanity: 10 },
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
        cost: { hunger: 20, sanity: 5 },
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
        cost: { sanity: 10, hunger: 5 },
        target: "node_evt_music_listen_feedback",
      },
      {
        text: "掐自己一下，清醒过来",
        cost: { sanity: -5, hp: 2 },
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
    text: "突然脚下一软，你发现登山鞋的甚至脱胶了，“张开了大嘴”。这是鳌太路上最令人崩溃的装备故障之一。",
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

export const scenes: Record<string, Scene> = {
  ...mapScenes,
  ...eventScenes,
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
