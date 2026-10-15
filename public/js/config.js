/* ============================================================
   WEFIEHOME SETTINGS — contact details & booking links.
   Source: WefieHome Master Business & Brand Profile v1.1 (canonical NAP).
   ============================================================ */
window.WEFIE_CONFIG = {
  // WhatsApp number: country code + number, digits only
  whatsapp: "60194824292",

  // Phone for tap-to-call
  phone: "+60194824292",

  email: "contact@wefiehome.com",

  airbnbProfile: "https://www.airbnb.com/p/ivanng",
  facebook: "https://www.facebook.com/wefiehome",
  instagram: "https://www.instagram.com/wefiehome",

  // Airbnb link per building (e.g. your best listing there).
  // Leave "" to fall back to the Airbnb host profile above.
  listings: {
    "j-dupion-residence": "",
    "m-vertica": "",
    "trion-kl": "",
    "arte-cheras": "",
    "nexus-taman-pertama": "https://www.airbnb.com/rooms/1763564414245871262",
    "shah-alam-section-8": ""
  },

  // Pre-filled WhatsApp messages
  messages: {
    owner: "Hi WefieHome, I'd like to request a property assessment for my property.",
    guest: "Hi WefieHome, I have a question about a stay.",
    guidereport: "Hi WefieHome, I found something outdated in the KL Travel Guide (wefiehome.com/guide/): ",
    ownerguide: "Hi WefieHome, I own a unit at a new condo project in Kuala Lumpur and would like to know more about your Airbnb management.",
    ownerguide_zh: "你好 WefieHome，我在吉隆坡一个新公寓项目拥有单位，想了解你们的 Airbnb 托管服务。",
    // Maxim Risen owner guide (/owners/maxim-risen/) — Build Brief v1.0 §5. Key + "_zh" is used on the 中文 page.
    ix_A1: "Hi Ivan, I'd like to know more about WefieHome. I have a unit at ______ (building)",
    ix_A1_zh: "你好 Ivan，我想了解更多 WefieHome 的服务。我有一个单位在______（楼盘）",
    ix_G1: "Hi Ivan, I'd like to know more about WefieHome. I have a unit at ______ (building)",
    ix_G1_zh: "你好 Ivan，我想了解更多 WefieHome 的服务。我有一个单位在______（楼盘）",
    se_A1: "Hi Ivan, I own a unit at Skyline Embassy and I'd like to talk about Airbnb management. Unit type (A–F): __ · Handover stage: __",
    se_A1_zh: "你好 Ivan，我在 Skyline Embassy 有一个单位，想聊聊 Airbnb 托管。户型（A–F）：__ · 收楼进度：__",
    se_G1: "Hi Ivan, I own a unit at Skyline Embassy. Could you share your full management terms and what's included?",
    se_G1_zh: "你好 Ivan，我在 Skyline Embassy 有一个单位，可以发给我完整的托管条款和服务内容吗？",
    se_UA: "Hi Ivan, I own a Type A unit at Skyline Embassy. How would you set it up and run it as an Airbnb?",
    se_UA_zh: "你好 Ivan，我在 Skyline Embassy 有一个 A 型单位，你会如何布置并经营成 Airbnb？",
    se_UB: "Hi Ivan, I own a Type B unit at Skyline Embassy. How would you set it up and run it as an Airbnb?",
    se_UB_zh: "你好 Ivan，我在 Skyline Embassy 有一个 B 型单位，你会如何布置并经营成 Airbnb？",
    se_UC: "Hi Ivan, I own a Type C unit at Skyline Embassy. How would you set it up and run it as an Airbnb?",
    se_UC_zh: "你好 Ivan，我在 Skyline Embassy 有一个 C 型单位，你会如何布置并经营成 Airbnb？",
    se_UD: "Hi Ivan, I own a Type D unit at Skyline Embassy. How would you set it up and run it as an Airbnb?",
    se_UD_zh: "你好 Ivan，我在 Skyline Embassy 有一个 D 型单位，你会如何布置并经营成 Airbnb？",
    se_UE: "Hi Ivan, I own a Type E unit at Skyline Embassy. How would you set it up and run it as an Airbnb?",
    se_UE_zh: "你好 Ivan，我在 Skyline Embassy 有一个 E 型单位，你会如何布置并经营成 Airbnb？",
    se_UF: "Hi Ivan, I own a Type F unit at Skyline Embassy. How would you set it up and run it as an Airbnb?",
    se_UF_zh: "你好 Ivan，我在 Skyline Embassy 有一个 F 型单位，你会如何布置并经营成 Airbnb？",
    mv_A1: "Hi WefieHome, I own a unit at M Vertica (MV) and I'd like to hand it over for Airbnb management. Layout: __ · Furnished (yes/no): __",
    mv_A1_zh: "你好 WefieHome，我在 M Vertica（MV）有一个单位，想交给你们做 Airbnb 托管。户型：__ · 是否已布置（是／否）：__",
    mv_G1: "Hi WefieHome, I own a unit at M Vertica. Could you share your full management terms and what's included?",
    mv_G1_zh: "你好 WefieHome，我在 M Vertica 有一个单位，可以发给我完整的托管条款和服务内容吗？",
    jd_A1: "Hi WefieHome, I own a unit at J Dupion Residence (JD) and would like to know more about your Airbnb management. Unit type: __ · Furnished (yes/no): __",
    jd_A1_zh: "你好 WefieHome，我在 J Dupion Residence（JD）有一个单位，想了解你们的 Airbnb 托管服务。户型：__ · 是否已布置（是／否）：__",
    jd_S1: "Hi WefieHome, I own a unit at J Dupion Residence and I'm busy with work/family/business. I'm looking for someone reliable to manage it as an Airbnb.",
    jd_S1_zh: "你好 WefieHome，我在 J Dupion Residence 有一个单位，平时工作／家庭／生意忙碌，想找可靠的人把它当 Airbnb 托管。",
    jd_S2: "Hi WefieHome, my J Dupion Residence unit is with another operator and I'm not fully happy. I'd like to compare how WefieHome would run it.",
    jd_S2_zh: "你好 WefieHome，我的 J Dupion Residence 单位目前由其他运营商管理，我不太满意，想比较一下 WefieHome 会如何经营。",
    jd_S3: "Hi WefieHome, the tenant in my J Dupion Residence unit is leaving (or it's empty). I'd like to know how it could do as a managed Airbnb.",
    jd_S3_zh: "你好 WefieHome，我的 J Dupion Residence 单位租客要搬走（或已空置），想了解交给你们托管做 Airbnb 的表现。",
    jd_S4: "Hi WefieHome, my J Dupion Residence unit is furnished but not earning. Could you review it and get it listed?",
    jd_S4_zh: "你好 WefieHome，我的 J Dupion Residence 单位已布置好但没有收入，可以帮忙评估并上架吗？",
    jd_G1: "Hi WefieHome, I own a unit at J Dupion Residence. Could you share your full management terms and what's included?",
    jd_G1_zh: "你好 WefieHome，我在 J Dupion Residence 有一个单位，可以发给我完整的托管条款和服务内容吗？",
    mr_A1: "Hi Ivan, I'd like to apply as one of the 12 Maxim Risen owner partners. Layout (A/B/C): __ · Handover stage: __ · Number of units: __",
    mr_A1_zh: "你好 Ivan，我想申请成为 Maxim Risen 12 位业主伙伴之一。户型（A/B/C）：__ · 收楼进度：__ · 单位数量：__",
    mr_I1: "Hi Ivan, I'm a Maxim Risen owner and would like to chat about your 12 owner partners.",
    mr_I1_zh: "你好 Ivan，我是 Maxim Risen 业主，想聊聊 12 位业主伙伴计划。",
    mr_G1: "Hi WefieHome, I own a unit at Maxim Risen and would like to know more about your Airbnb management.",
    mr_G1_zh: "你好 WefieHome，我是 Maxim Risen 业主，想了解你们的 Airbnb 托管服务。",
    mr_G2: "Hi WefieHome, I own a unit at Maxim Risen. I'd like a free Rental Readiness Assessment.",
    mr_G2_zh: "你好 WefieHome，我是 Maxim Risen 业主，想申请免费出租准备评估。",
    mr_K1: "Hi WefieHome, please send me the Maxim Risen Owner Checklist (PDF).",
    mr_K1_zh: "你好 WefieHome，请发给我《Maxim Risen 业主清单》PDF。",
    mr_S1: "Hi WefieHome, I own a unit at Maxim Risen and I'm waiting for VP/key collection. I'd like to plan for Airbnb.",
    mr_S1_zh: "你好 WefieHome，我是 Maxim Risen 业主，正在等 VP／拿钥匙，想提前规划做 Airbnb。",
    mr_S2: "Hi WefieHome, I've collected my Maxim Risen keys and the unit is bare. I'd like advice on setting it up for Airbnb.",
    mr_S2_zh: "你好 WefieHome，我已拿到 Maxim Risen 的钥匙，单位是空房，想咨询如何布置成 Airbnb。",
    mr_S3: "Hi WefieHome, I'm renovating/furnishing my Maxim Risen unit and would like your input before I finish.",
    mr_S3_zh: "你好 WefieHome，我的 Maxim Risen 单位正在装修／添置家具，想在完工前听听你们的建议。",
    mr_S4: "Hi WefieHome, my Maxim Risen unit is furnished and ready to rent. I'd like to discuss Airbnb management.",
    mr_S4_zh: "你好 WefieHome，我的 Maxim Risen 单位已布置好，可以出租，想谈谈 Airbnb 托管。",
    mr_LA: "Hi WefieHome, I own a Type A (523 sq ft) unit at Maxim Risen. I'd like a free Rental Readiness Assessment.",
    mr_LA_zh: "你好 WefieHome，我拥有 Maxim Risen A 型（523 平方尺）单位，想申请免费出租准备评估。",
    mr_LB: "Hi WefieHome, I own a Type B (660 sq ft) unit at Maxim Risen. I'd like a free Rental Readiness Assessment.",
    mr_LB_zh: "你好 WefieHome，我拥有 Maxim Risen B 型（660 平方尺）单位，想申请免费出租准备评估。",
    mr_LC: "Hi WefieHome, I own a Type C (819 sq ft) unit at Maxim Risen. I'd like a free Rental Readiness Assessment.",
    mr_LC_zh: "你好 WefieHome，我拥有 Maxim Risen C 型（819 平方尺）单位，想申请免费出租准备评估。",
    maximrisen: "Hi WefieHome, I'm a property owner at Maxim Risen and I'm interested in your Airbnb management services. I would like to know more about your management model and arrange a property assessment."
  }
};
