





// --- 真实地图节点扩充版 ---
const mapScenes = {
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
        target: "node_river_crossing",
        cost: { hunger: 2 },
      },
      {
        text: "检查背包",
        target: "node_river_crossing",
        cost: { hunger: 1 },
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
        target: "node_forest_entry",
        cost: { hunger: 3, sanity: 2 },
      },
      {
        text: "脱鞋涉水",
        target: "node_forest_entry",
        cost: { hp: 2, hunger: 2 },
      },
      {
        text: "[退伍军人] 搭建简易绳桥通过",
        requiredRole: "veteran",
        target: "node_forest_entry",
        cost: { hunger: 1 },
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
        target: "node_forest_climb",
        cost: { hunger: 5, hp: 2 },
      },
      {
        text: "回头看一眼山下的村庄",
        action: "look_back",
        target: "node_forest_climb",
        cost: { hunger: 3, sanity: -5 },
      },
    ],
  },

  node_forest_climb: {
    id: "node_forest_climb",
    text: "海拔上升到2600米。树木变得稀疏，空气也变得稀薄。每迈出一步都需要大口喘气。",
    bg: "loc_forest",
    choices: [
      { text: "咬牙坚持", target: "node_2900", cost: { hunger: 15, hp: 5 } },
      {
        text: "喝口水继续赶路",
        cost: { hp: -5, hunger: -2 },
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
        target: "node_penjing",
        cost: { hunger: 20, hp: 5 },
      },
      { text: "使用登山杖支撑", target: "node_penjing", cost: { hunger: 15 } },
    ],
  },

  node_penjing: {
    id: "node_penjing",
    text: "鳌太山脊在这里拐了个大弯。这里有信号，可以给家人报个平安。下方深沟里似乎隐约有水源的反光。",
    bg: "loc_penjing",
    choices: [
      {
        text: "给家人打电话",
        target: "node_baiqi_start",
        cost: { sanity: -20 },
      },
      {
        text: "下沟取水",
        target: "node_penjing_gully",
        cost: { hunger: 5 },
      },
      {
        text: "继续赶路",
        target: "node_baiqi_start",
        cost: { hunger: 15, hp: 5 },
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
        target: "node_baiqi_start",
        cost: { hunger: 10, hp: 5 },
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
        target: "node_nav_stand",
        cost: { hunger: 5, hp: 2 },
      },
      {
        text: "加速奔向导航架",
        target: "node_nav_stand",
        cost: { hunger: 10, hp: 1 },
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
        target: "node_maijie_descent",
        cost: { hunger: 5 },
      },
      {
        text: "迷信直觉，直走",
        target: "end_lost_23km",
        cost: { hunger: 20, sanity: 20 },
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
        target: "node_knife_ridge",
        cost: { hunger: 5 },
      },
      {
        text: "强行翻越石海",
        target: "node_knife_ridge",
        cost: { hunger: 20, hp: 15, sanity: -5 },
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
        target: "node_shuiwozi_source",
        cost: { hunger: 5, sanity: 5 },
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
        target: "node_shuiwozi_camp",
        cost: { hunger: 5 },
        condition: "shuiwozi_water", // Show if water exists
      },
      {
        text: "左下切去营地",
        target: "node_shuiwozi_dry",
        cost: { hunger: 10, sanity: 5 },
        condition: "!shuiwozi_water", // Show if dry
      },
      {
        text: "垭口无水扎营",
        target: "node_plane_wreck",
        cost: { hunger: 10, sanity: 10 },
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
        target: "node_pyramid",
        cost: { hunger: 15 },
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
        target: "node_xiyuan",
        cost: { hunger: 15, hp: 5 },
      },
      {
        text: "赌西源有水，直接走",
        target: "node_xiyuan",
        cost: { hunger: 5 },
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
        target: "node_baxiantai",
        cost: { hunger: 10, hp: 5 },
      },
      {
        text: "直奔大爷海",
        target: "node_daye_lake",
        cost: { hunger: 5 },
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
        target: "node_wengong",
        cost: { hunger: -50, sanity: -50 },
      },
      {
        text: "继续赶路",
        target: "node_wengong",
        cost: { hunger: 5 },
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
        target: "node_fangyang",
        cost: { hunger: 10 },
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
        target: "node_mingxing",
        cost: { hunger: 10, hp: 5 },
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
const eventScenes = {
  evt_hiker: {
    id: "evt_hiker",
    text: "浓雾中，你隐约听到前方有呼救声。走近一看，是一个眼神涣散的落单驴友。他说同伴走丢了，自己也没水了。",
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "分他半瓶水",
        cost: { hunger: 10, sanity: -10 },
        target: "resume",
      },
      { text: "自身难保，离开", cost: { sanity: 10 }, target: "resume" },
      {
        text: "尝试帮他求救",
        cost: { hp: 20, hunger: 20, sanity: -5 },
        target: "resume",
      },
      {
        text: "[医生] 实施专业急救",
        requiredRole: "doctor",
        cost: { hunger: 5, sanity: -20 },
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
      { text: "多一事不如少一事，离开", target: "resume" },
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
        target: "resume",
      },
      {
        text: "紧急扎营躲避",
        cost: { hunger: 40, sanity: 5 },
        target: "resume",
      },
      { text: "尝试用卫星电话求救", action: "sos" },
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
        target: "resume",
      },
    ],
  },
  evt_body: {
    id: "evt_body",
    text: "在一块巨石的缝隙中，你发现了一具蜷缩的遗体。他衣着单薄，似乎生前有“反常脱衣”现象。这残酷的一幕让你不寒而栗。",
    bg: "evt_frozen_body",
    choices: [
      { text: "搜寻遗物", action: "loot_supplies", target: "resume" },
      { text: "默哀并离开", cost: { hunger: 5, sanity: 10 }, target: "resume" },
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
        target: "resume",
      },
      { text: "大声驱赶", cost: { hp: 50, sanity: 10 }, target: "resume" },
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
        target: "resume",
      },
      {
        text: "掐自己一下，清醒过来",
        cost: { sanity: -5, hp: 2 },
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
        cost: { hunger: 10 }, // Cost hunger/time instead of rest
        target: "resume",
      },
      {
        text: "拖着鞋走 (极易崴脚)",
        cost: { hp: 10, hunger: 10 },
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
        target: "resume",
      },
      {
        text: "留给更需要的人",
        cost: { sanity: -15 }, // Karma boost
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
        target: "resume",
      },
      {
        text: "惊慌失措地狂奔",
        cost: { hp: 50, sanity: 10 },
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
        target: "resume",
      },
      {
        text: "屏住呼吸，悄悄通过",
        cost: { sanity: 5 },
        target: "resume",
      },
    ],
  },
};

const scenes = {
  ...mapScenes,
  ...eventScenes,
};

const randomEventIds = [
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

console.log("Starting Validation...");
let errorCount = 0;

const allSceneIds = new Set(Object.keys(scenes));

// Check randomEventIds
randomEventIds.forEach(id => {
    if (!scenes[id]) {
        console.error("Error: Random event ID not found: " + id);
        errorCount++;
    }
});

// Check choices
Object.values(scenes).forEach(scene => {
    if (!scene.choices) {
        // Some endings might not have choices? No, usually they have restart.
        // But end_game_cleared we suspected.
        console.warn("Warning: Scene has no choices: " + scene.id);
        if (!scene.id.startsWith('end_') && !scene.id.startsWith('dead_')) {
             console.error("Error: Non-ending scene has no choices: " + scene.id);
             errorCount++;
        }
        return;
    }

    scene.choices.forEach((choice, index) => {
        // Must have target OR action
        if (!choice.target && !choice.action) {
            console.error(`Error: Scene '${scene.id}' choice ${index} ('${choice.text}') has no target and no action.`);
            errorCount++;
        }

        if (choice.target) {
            if (choice.target === 'resume') {
                // Valid for events
            } else if (choice.target.startsWith('node_') || choice.target.startsWith('evt_') || choice.target.startsWith('end_') || choice.target.startsWith('dead_') || choice.target === 'start_001') {
                 if (!scenes[choice.target]) {
                     console.error(`Error: Scene '${scene.id}' choice ${index} targets missing scene: '${choice.target}'`);
                     errorCount++;
                 }
            } else {
                 // Unknown format
                 console.warn(`Warning: Scene '${scene.id}' choice ${index} has unusual target: '${choice.target}'`);
                 if (!scenes[choice.target]) {
                     console.error(`Error: Target not found: ${choice.target}`);
                     errorCount++;
                 }
            }
        }
    });
});

console.log(`Validation complete. Found ${errorCount} errors.`);
