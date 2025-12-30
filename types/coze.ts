// Coze API 相关类型定义

export interface CozeWorkflowRequest {
  workflow_id: string;
  parameters: CozeWorkflowParameters;
}

export interface CozeWorkflowParameters {
  Bailian_API: string;
  cumob_api: string;
  cumob_model: string;
  DeepL_API: string;
  HD: boolean;
  MiniMax_API: string;
  MiniMax_GroupID: string;
  README: string;
  auto_expansion: boolean;
  bmg_url: string;
  emotion: 'neutral' | 'happy' | 'sad' | 'angry';
  font: string;
  input: string;
  max_len: number;
  style: string;
  target_lang: string;
  test_mode: boolean;
  voice_id: string;
}

export interface CozeStreamResponse {
  batch_index?: number;
  code?: number;
  content?: string;
  debug_url?: string;
  detail?: any;
  logid?: string;
  error_code?: number;
  error_message?: string;
  event?: 'Message' | 'Error' | 'Done' | 'Interrupt';
  ext?: any;
  id?: number;
  interrupt_data?: any;
  loop_index?: number;
  msg?: string;
  node_execute_uuid?: string;
  node_id?: string;
  node_is_finish?: boolean;
  node_seq_id?: number;
  node_title?: string;
  sub_execute_id?: string;
  usage?: {
    input_count?: number;
    output_count?: number;
    token_count?: number;
  };
}

export interface CozeAPIError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

// 非流式API响应类型
export interface CozeAsyncResponse {
  code: number;
  data?: string;
  debug_url?: string;
  detail?: any;
  logid?: string;
  execute_id?: string;
  msg?: string;
  usage?: {
    input_count?: number;
    output_count?: number;
    token_count?: number;
  };
}

// 轮询状态类型
export interface PollingState {
  isPolling: boolean;
  executeId: string | null;
  result: string;
  error: string | null;
  isComplete: boolean;
  debugUrl?: string;
  logid?: string;
}

// 异步执行结果详情类型
export interface AsyncExecutionResult {
  run_mode?: string;
  node_execute_status?: any;
  token?: string;
  update_time?: string;
  is_output_trimmed?: boolean;
  connector_uid?: string;
  usage?: {
    input_count?: number;
    output_count?: number;
    token_count?: number;
  };
  connector_id?: string;
  execute_status?: string;
  logid?: string;
  bot_id?: string;
  create_time?: string;
  debug_url?: string;
  output?: string;
  error_code?: number;
  execute_id?: string;
}

// 表单数据类型
export interface WorkflowFormData {
  authToken: string;
  workflowId: string;
  inputText: string;
  style: string;
  emotion: CozeWorkflowParameters['emotion'];
  font: string;
  targetLang: string[];
  voiceId: string;
  deeplApi: string;
  minimaxApi: string;
  minimaxGroupId: string;
  cumobApi: string;
  cumobModel: string;
  bailianApi: string;
  autoExpansion: boolean;
  test_mode: boolean;
  hd: boolean;
  maxLen: number;
}

// 流式响应状态
export interface StreamingState {
  isStreaming: boolean;
  content: string;
  error: string | null;
  isComplete: boolean;
}

// 语言选项
export const LANGUAGE_OPTIONS = [
  { value: '中文', label: '中文' },
  { value: '英语', label: '英语' },
  { value: '德语', label: '德语' },
  { value: '西班牙语', label: '西班牙语' },
  { value: '葡萄牙语', label: '葡萄牙语' },
  { value: '俄语', label: '俄语' },
  { value: '阿拉伯语', label: '阿拉伯语' },
] as const;

// 风格选项
export const STYLE_OPTIONS = [
  { value: '日本动漫', label: '日本动漫' },
  { value: '吉卜力', label: '吉卜力' },
  { value: '复古漫画', label: '复古漫画' },
  { value: '古代惊悚', label: '古代惊悚' },
  { value: '新海诚写实水彩', label: '新海诚写实水彩' },
  { value: '新海诚电影', label: '新海诚电影' },
  { value: '日系轻小说', label: '日系轻小说' },
  { value: '欧美动画', label: '欧美动画' },
  { value: '赛璐璐', label: '赛璐璐' },
  { value: '日系漫画', label: '日系漫画' },
] as const;

// 字体选项
export const FONT_OPTIONS = [
  { value: '竹风体', label: '竹风体' },
  { value: '谷秋体', label: '谷秋体' },
  { value: '默认字体', label: '默认字体' },
  { value: '楷体', label: '楷体' },
  { value: '宋体', label: '宋体' },
  { value: '黑体', label: '黑体' },
] as const;

// 情感选项
export const EMOTION_OPTIONS = [
  { value: 'neutral', label: '中性' },
  { value: 'happy', label: '快乐' },
  { value: 'sad', label: '悲伤' },
  { value: 'angry', label: '愤怒' },
  { value: 'fearful', label: '害怕' },
  { value: 'disgusted', label: '厌恶' },
  { value: 'surprised', label: '惊讶' },
] as const;

// 语音选项
export const VOICE_OPTIONS = [
  { value: 'male-qn-qingse', label: '青涩青年音色', description: [] },
  { value: 'male-qn-jingying', label: '精英青年音色', description: [] },
  { value: 'male-qn-badao', label: '霸道青年音色', description: [] },
  { value: 'male-qn-daxuesheng', label: '青年大学生音色', description: [] },
  { value: 'female-shaonv', label: '少女音色', description: [] },
  { value: 'female-yujie', label: '御姐音色', description: [] },
  { value: 'female-chengshu', label: '成熟女性音色', description: [] },
  { value: 'female-tianmei', label: '甜美女性音色', description: [] },
  { value: 'male-qn-qingse-jingpin', label: '青涩青年音色-beta', description: [] },
  { value: 'male-qn-jingying-jingpin', label: '精英青年音色-beta', description: [] },
  { value: 'male-qn-badao-jingpin', label: '霸道青年音色-beta', description: [] },
  { value: 'male-qn-daxuesheng-jingpin', label: '青年大学生音色-beta', description: [] },
  { value: 'female-shaonv-jingpin', label: '少女音色-beta', description: [] },
  { value: 'female-yujie-jingpin', label: '御姐音色-beta', description: [] },
  { value: 'female-chengshu-jingpin', label: '成熟女性音色-beta', description: [] },
  { value: 'female-tianmei-jingpin', label: '甜美女性音色-beta', description: [] },
  { value: 'clever_boy', label: '聪明男童', description: [] },
  { value: 'cute_boy', label: '可爱男童', description: [] },
  { value: 'lovely_girl', label: '萌萌女童', description: [] },
  { value: 'cartoon_pig', label: '卡通猪小琪', description: [] },
  { value: 'bingjiao_didi', label: '病娇弟弟', description: [] },
  { value: 'junlang_nanyou', label: '俊朗男友', description: [] },
  { value: 'chunzhen_xuedi', label: '纯真学弟', description: [] },
  { value: 'lengdan_xiongzhang', label: '冷淡学长', description: [] },
  { value: 'badao_shaoye', label: '霸道少爷', description: [] },
  { value: 'tianxin_xiaoling', label: '甜心小玲', description: [] },
  { value: 'qiaopi_mengmei', label: '俏皮萌妹', description: [] },
  { value: 'wumei_yujie', label: '妩媚御姐', description: [] },
  { value: 'diadia_xuemei', label: '嗲嗲学妹', description: [] },
  { value: 'danya_xuejie', label: '淡雅学姐', description: [] },
  { value: 'Santa_Claus ', label: 'Santa Claus', description: [] },
  { value: 'Grinch', label: 'Grinch', description: [] },
  { value: 'Rudolph', label: 'Rudolph', description: [] },
  { value: 'Arnold', label: 'Arnold', description: [] },
  { value: 'Charming_Santa', label: 'Charming Santa', description: [] },
  { value: 'Charming_Lady', label: 'Charming Lady', description: [] },
  { value: 'Sweet_Girl', label: 'Sweet Girl', description: [] },
  { value: 'Cute_Elf', label: 'Cute Elf', description: [] },
  { value: 'Attractive_Girl', label: 'Attractive Girl', description: [] },
  { value: 'Serene_Woman', label: 'Serene Woman', description: [] },
  { value: 'Chinese (Mandarin)_Reliable_Executive', label: '沉稳高管', description: ['一位沉稳可靠的中年男性高管声音，标准普通话，传递出值得信赖的感觉。'] },
  { value: 'Chinese (Mandarin)_News_Anchor', label: '新闻女声', description: ['一位专业、播音腔的中年女性新闻主播，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Mature_Woman', label: '傲娇御姐', description: ['一位妩媚成熟的青年御姐声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Unrestrained_Young_Man', label: '不羁青年', description: ['一位潇洒不羁的青年男性声音，标准普通话。'] },
  { value: 'Arrogant_Miss', label: '嚣张小姐', description: ['一位嚣张自信的青年女性声音，标准普通话，展现出优越感。'] },
  { value: 'Robot_Armor', label: '机械战甲', description: ['一位电子化、机器人般的青年男性声音，适合科幻或未来主义内容的标准普通话。'] },
  { value: 'Chinese (Mandarin)_Kind-hearted_Antie', label: '热心大婶', description: ['一位温和善良的中年大婶声音，标准普通话，温暖而体贴。'] },
  { value: 'Chinese (Mandarin)_HK_Flight_Attendant', label: '港普空姐', description: ['一位礼貌的中年女性空乘员声音，带有港式普通话口音，清晰而有礼。'] },
  { value: 'Chinese (Mandarin)_Humorous_Elder', label: '搞笑大爷', description: ['一位爽朗幽默的老年男性大爷声音，带有北方口音的中文，充满个性。'] },
  { value: 'Chinese (Mandarin)_Gentleman', label: '温润男声', description: ['一位温润磁性的青年男性声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Warm_Bestie', label: '温暖闺蜜', description: ['一位温暖清脆的青年女性闺蜜声音，标准普通话，友好而清晰。'] },
  { value: 'Chinese (Mandarin)_Male_Announcer', label: '播报男声', description: ['一位富有磁性的中年男性播报员声音，标准普通话，清晰而权威。'] },
  { value: 'Chinese (Mandarin)_Sweet_Lady', label: '甜美女声', description: ['一位温柔甜美的青年女性声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Southern_Young_Man', label: '南方小哥', description: ['一位质朴的青年男性声音，带有南方口音的中文。'] },
  { value: 'Chinese (Mandarin)_Wise_Women', label: '阅历姐姐', description: ['一位富有阅历、声音抒情的中年姐姐声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Gentle_Youth', label: '温润青年', description: ['一位温柔的青年男性声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Warm_Girl', label: '温暖少女', description: ['一位温柔温暖的少年女声，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Kind-hearted_Elder', label: '花甲奶奶', description: ['一位慈祥和蔼的老年女性奶奶声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Cute_Spirit', label: '憨憨萌兽', description: ['一位呆萌可爱的少年男声，适合憨厚的萌兽角色。'] },
  { value: 'Chinese (Mandarin)_Radio_Host', label: '电台男主播', description: ['一位富有诗意的青年男性电台主播声音，标准普通话，声音流畅引人入胜。'] },
  { value: 'Chinese (Mandarin)_Lyrical_Voice', label: '抒情男声', description: ['一位磁性抒情的青年男性声音，标准普通话，流畅而富有表现力。'] },
  { value: 'Chinese (Mandarin)_Straightforward_Boy', label: '率真弟弟', description: ['一位认真率真的少年弟弟声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Sincere_Adult', label: '真诚青年', description: ['一位真诚、富有鼓励性的青年男性声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Gentle_Senior', label: '温柔学姐', description: ['一位温暖温柔的青年学姐声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Stubborn_Friend', label: '嘴硬竹马', description: ['一位嘴硬心软、不羁的青年竹马声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Crisp_Girl', label: '清脆少女', description: ['一位温暖清脆的少女声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Pure-hearted_Boy', label: '清澈邻家弟弟', description: ['一位认真清澈的邻家少年弟弟声音，标准普通话。'] },
  { value: 'Chinese (Mandarin)_Soft_Girl', label: '软软女孩', description: ['一位温暖柔软的青年女性声音，带有南方口音的中文。'] },
  { value: 'Cantonese_ProfessionalHost（F)', label: '专业女主持', description: ['一位中性、专业的青年女性粤语主持人声音。'] },
  { value: 'Cantonese_GentleLady', label: '温柔女声', description: ['一位平静温柔的青年女性粤语声音。'] },
  { value: 'Cantonese_ProfessionalHost（M)', label: '专业男主持', description: ['一位中性、专业的青年男性粤语主持人声音。'] },
  { value: 'Cantonese_PlayfulMan', label: '活泼男声', description: ['一位活泼深情的青年男性粤语声音。'] },
  { value: 'Cantonese_CuteGirl', label: '可爱女孩', description: ['一位柔和可爱的青年女性粤语声音。'] },
  { value: 'Cantonese_KindWoman', label: '善良女声', description: ['一位亲切善良的青年女性粤语声音。'] },
  { value: 'English_Trustworthy_Man', label: 'Trustworthy Man', description: ['一位值得信赖、富有磁性的青年男性声音，带通用美式口音。'] },
  { value: 'English_Graceful_Lady', label: 'Graceful Lady', description: ['一位优雅的中年女士，带有经典的英式口音，散发着成熟的魅力。'] },
  { value: 'English_Aussie_Bloke', label: 'Aussie Bloke', description: ['一位阳光开朗的青年男性，带有独特的澳大利亚口音。'] },
  { value: 'English_Whispering_girl', label: 'Whispering girl', description: ['一位青年女性的轻柔耳语声，带通用美式口音，非常适合ASMR内容。'] },
  { value: 'English_Diligent_Man', label: 'Diligent Man', description: ['一位真诚勤奋的青年男性，带有印度口音。'] },
  { value: 'English_Gentle-voiced_man', label: 'Gentle-voiced man', description: ['一位声音温柔、富有磁性的青年男性，带通用美式口音。'] },
  { value: 'Japanese_IntellectualSenior', label: 'Intellectual Senior', description: ['一位成熟知性的青年男性日语声音，听起来少年老成。'] },
  { value: 'Japanese_DecisivePrincess', label: 'Decisive Princess', description: ['一位坚定果断的青年公主声音，日语。'] },
  { value: 'Japanese_LoyalKnight', label: 'Loyal Knight', description: ['一位年轻忠诚的青年男性骑士声音，日语。'] },
  { value: 'Japanese_DominantMan', label: 'Dominant Man', description: ['一位成熟强势的中年男性声音，日语。'] },
  { value: 'Japanese_SeriousCommander', label: 'Serious Commander', description: ['一位严肃可靠的青年男性指挥官声音，日语。'] },
  { value: 'Japanese_ColdQueen', label: 'Cold Queen', description: ['一位冷漠的青年女王声音，日语。'] },
  { value: 'Japanese_DependableWoman', label: 'Dependable Woman', description: ['一位稳重可靠的青年女性声音，日语。'] },
  { value: 'Japanese_GentleButler', label: 'Gentle Butler', description: ['一位迷人温柔的青年男性管家声音，日语。'] },
  { value: 'Japanese_KindLady', label: 'Kind Lady', description: ['一位迷人善良的青年女性声音，日语。'] },
  { value: 'Japanese_CalmLady', label: 'Calm Lady', description: ['一位沉静迷人的青年女性声音，日语。'] },
  { value: 'Japanese_OptimisticYouth', label: 'Optimistic Youth', description: ['一位开朗乐观的青年男性声音，日语。'] },
  { value: 'Japanese_GenerousIzakayaOwner', label: 'Generous Izakaya Owner', description: ['一位俏皮大方的中年男性居酒屋老板声音，日语。'] },
  { value: 'Japanese_SportyStudent', label: 'Sporty Student', description: ['一位亲切运动的青年男性学生声音，日语。'] },
  { value: 'Japanese_InnocentBoy', label: 'Innocent Boy', description: ['一位亲切天真的青年男性声音，日语。'] },
  { value: 'Japanese_GracefulMaiden', label: 'Graceful Maiden', description: ['一位甜美优雅的青年少女声音，日语。'] },
  { value: 'Dutch_kindhearted_girl', label: 'Kind-hearted girl', description: ['一位温暖善良的少女荷兰语声音。'] },
  { value: 'Dutch_bossy_leader', label: 'Bossy leader', description: ['一位严肃专横的青年男性领导者声音，荷兰语。'] },
  { value: 'Vietnamese_kindhearted_girl', label: 'Kind-hearted girl', description: ['一位温暖善良的少女越南语声音。'] },
  { value: 'Korean_SweetGirl', label: 'Sweet Girl', description: ['一位温柔甜美的中年女性声音，韩语。'] },
  { value: 'Korean_CheerfulBoyfriend', label: 'Cheerful Boyfriend', description: ['一位犀利开朗的中年男性男友声音，韩语。'] },
  { value: 'Korean_EnchantingSister', label: 'Enchanting Sister', description: ['一位迷人的青年姐姐声音，韩语。'] },
  { value: 'Korean_ShyGirl', label: 'Shy Girl', description: ['一位腼腆害羞的青年女性声音，韩语。'] },
  { value: 'Korean_ReliableSister', label: 'Reliable Sister', description: ['一位权威可靠的中年姐姐声音，韩语。'] },
  { value: 'Korean_StrictBoss', label: 'Strict Boss', description: ['一位严厉的中年男性老板声音，韩语。'] },
  { value: 'Korean_SassyGirl', label: 'Sassy Girl', description: ['一位温柔的青年女性声音，韩语。'] },
  { value: 'Korean_ChildhoodFriendGirl', label: 'Childhood Friend Girl', description: ['一位温柔的青梅竹马女孩声音，韩语。'] },
  { value: 'Korean_PlayboyCharmer', label: 'Playboy Charmer', description: ['一位富有诱惑力的青年花花公子声音，韩语。'] },
  { value: 'Korean_ElegantPrincess', label: 'Elegant Princess', description: ['一位优雅的青年公主声音，韩语。'] },
  { value: 'Korean_BraveFemaleWarrior', label: 'Brave Female Warrior', description: ['一位坚定的青年女战士声音，韩语。'] },
  { value: 'Korean_BraveYouth', label: 'Brave Youth', description: ['一位强有力的青年男性声音，韩语。'] },
  { value: 'Korean_CalmLady', label: 'Calm Lady', description: ['一位沉静坚定的青年女性声音，韩语。'] },
  { value: 'Korean_EnthusiasticTeen', label: 'Enthusiastic Teen', description: ['一位热情活泼的青年男性声音，韩语。'] },
  { value: 'Korean_SoothingLady', label: 'Soothing Lady', description: ['一位迷人舒缓的中年女性声音，韩语。'] },
  { value: 'Korean_IntellectualSenior', label: 'Intellectual Senior', description: ['一位具有磁性、知性的青年学长声音，韩语。'] },
  { value: 'Korean_LonelyWarrior', label: 'Lonely Warrior', description: ['一位青春无畏的孤独战士声音，韩语。'] },
  { value: 'Korean_MatureLady', label: 'Mature Lady', description: ['一位优雅成熟的中年女士声音，韩语。'] },
  { value: 'Korean_InnocentBoy', label: 'Innocent Boy', description: ['一位纯真无邪的青年男孩声音，韩语。'] },
  { value: 'Korean_CharmingSister', label: 'Charming Sister', description: ['一位富有魅惑力的中年姐姐声音，韩语。'] },
  { value: 'Korean_AthleticStudent', label: 'Athletic Student', description: ['一位充满活力的青年运动学生声音，韩语。'] },
  { value: 'Korean_BraveAdventurer', label: 'Brave Adventurer', description: ['一位活泼勇敢的青年女冒险家声音，韩语。'] },
  { value: 'Korean_CalmGentleman', label: 'Calm Gentleman', description: ['一位沉稳冷静的中年绅士声音，韩语。'] },
  { value: 'Korean_WiseElf', label: 'Wise Elf', description: ['一位甜美空灵的智慧精灵声音，韩语。'] },
  { value: 'Korean_CheerfulCoolJunior', label: 'Cheerful Cool Junior', description: ['一位充满活力的开朗酷学弟声音，韩语。'] },
  { value: 'Korean_DecisiveQueen', label: 'Decisive Queen', description: ['一位甜美果断的青年女王声音，韩语。'] },
  { value: 'Korean_ColdYoungMan', label: 'Cold Young Man', description: ['一位冷静的青年男性声音，韩语。'] },
  { value: 'Korean_MysteriousGirl', label: 'Mysterious Girl', description: ['一位灵动神秘的青年女孩声音，韩语。'] },
  { value: 'Korean_QuirkyGirl', label: 'Quirky Girl', description: ['一位可爱古怪的青年女孩声音，韩语。'] },
  { value: 'Korean_ConsiderateSenior', label: 'Considerate Senior', description: ['一位温柔成熟的体贴学长声音，韩语。'] },
  { value: 'Korean_CheerfulLittleSister', label: 'Cheerful Little Sister', description: ['一位活泼开朗的小妹妹声音，韩语。'] },
  { value: 'Korean_DominantMan', label: 'Dominant Man', description: ['一位成熟权威的强势青年男性声音，韩语。'] },
  { value: 'Korean_AirheadedGirl', label: 'Airheaded Girl', description: ['一位呆萌可爱的天然呆女孩声音，韩语。'] },
  { value: 'Korean_ReliableYouth', label: 'Reliable Youth', description: ['一位温柔可靠的青年男性声音，韩语。'] },
  { value: 'Korean_FriendlyBigSister', label: 'Friendly Big Sister', description: ['一位迷人友好的中年大姐姐声音，韩语。'] },
  { value: 'Korean_GentleBoss', label: 'Gentle Boss', description: ['一位高贵温柔的中年老板声音，韩语。'] },
  { value: 'Korean_ColdGirl', label: 'Cold Girl', description: ['一位冷漠的青年女孩声音，韩语。'] },
  { value: 'Korean_HaughtyLady', label: 'Haughty Lady', description: ['一位高傲冷漠的青年女士声音，韩语。'] },
  { value: 'Korean_CharmingElderSister', label: 'Charming Elder Sister', description: ['一位调皮迷人的中年姐姐声音，韩语。'] },
  { value: 'Korean_IntellectualMan', label: 'Intellectual Man', description: ['一位好斗的知性中年男性声音，韩语。'] },
  { value: 'Korean_CaringWoman', label: 'Caring Woman', description: ['一位灵动体贴的青年女性声音，韩语。'] },
  { value: 'Korean_WiseTeacher', label: 'Wise Teacher', description: ['一位睿智的的中年男教师声音，韩语。'] },
  { value: 'Korean_ConfidentBoss', label: 'Confident Boss', description: ['一位深沉有力的自信中年老板声音，韩语。'] },
  { value: 'Korean_AthleticGirl', label: 'Athletic Girl', description: ['一位健美的运动少女声音，韩语。'] },
  { value: 'Korean_PossessiveMan', label: 'Possessive Man', description: ['一位权威、占有欲强的中年男性声音，韩语。'] },
  { value: 'Korean_GentleWoman', label: 'Gentle Woman', description: ['一位坚毅温柔的青年女性声音，韩语。'] },
  { value: 'Korean_CockyGuy', label: 'Cocky Guy', description: ['一位调皮自大的青年男性声音，韩语。'] },
  { value: 'Korean_ThoughtfulWoman', label: 'Thoughtful Woman', description: ['一位成熟体贴的青年女性声音，韩语。'] },
  { value: 'Korean_OptimisticYouth', label: 'Optimistic Youth', description: ['一位开朗乐观的青年男性声音，韩语。'] },
  { value: 'Spanish_SereneWoman', label: 'Serene Woman', description: ['一位舒缓宁静的青年女性声音，西班牙语。'] },
  { value: 'Spanish_MaturePartner', label: 'Mature Partner', description: ['一位温暖成熟的中年男性伴侣声音，西班牙语。'] },
  { value: 'Spanish_CaptivatingStoryteller', label: 'Captivating Storyteller', description: ['一位迷人的中年男性叙事者声音，非常适合讲故事，西班牙语。'] },
  { value: 'Spanish_Narrator', label: 'Narrator', description: ['一位适合叙述的中年女性叙述者声音，西班牙语。'] },
  { value: 'Spanish_WiseScholar', label: 'Wise Scholar', description: ['一位亲切健谈的青年男性智慧学者声音，西班牙语。'] },
  { value: 'Spanish_Kind-heartedGirl', label: 'Kind-hearted Girl', description: ['一位明亮善良的青年女性声音，西班牙语。'] },
  { value: 'Spanish_DeterminedManager', label: 'Determined Manager', description: ['一位职业、果断的中年女性经理声音，西班牙语。'] },
  { value: 'Spanish_BossyLeader', label: 'Bossy Leader', description: ['一位干练、专横的青年男性领导者声音，西班牙语。'] },
  { value: 'Spanish_ReservedYoungMan', label: 'Reserved Young Man', description: ['一位宁静、内敛的青年男性声音，西班牙语。'] },
  { value: 'Spanish_ConfidentWoman', label: 'Confident Woman', description: ['一位清晰坚定、自信的青年女性声音，西班牙语。'] },
  { value: 'Spanish_ThoughtfulMan', label: 'Thoughtful Man', description: ['一位冷静、体贴的青年男性声音，西班牙语。'] },
  { value: 'Spanish_Strong-WilledBoy', label: 'Strong-willed Boy', description: ['一位成熟、意志坚定的青年男性声音，西班牙语。'] },
  { value: 'Spanish_SophisticatedLady', label: 'Sophisticated Lady', description: ['一位优雅、精致的青年女士声音，西班牙语。'] },
  { value: 'Spanish_RationalMan', label: 'Rational Man', description: ['一位深思熟虑、理性的青年男性声音，西班牙语。'] },
  { value: 'Spanish_AnimeCharacter', label: 'Anime Character', description: ['一位灵动的中年女性声音，适合动漫角色，西班牙语。'] },
  { value: 'Spanish_Deep-tonedMan', label: 'Deep-toned Man', description: ['一位富有魅力、声调深沉的中年男性声音，西班牙语。'] },
  { value: 'Spanish_Fussyhostess', label: 'Fussy hostess', description: ['一位语气激烈、挑剔的中年女主人声音，西班牙语。'] },
  { value: 'Spanish_SincereTeen', label: 'Sincere Teen', description: ['一位真诚的青年男性声音，西班牙语。'] },
  { value: 'Spanish_FrankLady', label: 'Frank Lady', description: ['一位激动、坦率的青年女士声音，西班牙语。'] },
  { value: 'Spanish_Comedian', label: 'Comedian', description: ['一位幽默的青年男性喜剧演员声音，西班牙语。'] },
  { value: 'Spanish_Debator', label: 'Debator', description: ['一位坚定、强硬的中年男性辩手声音，西班牙语。'] },
  { value: 'Spanish_ToughBoss', label: 'Tough Boss', description: ['一位成熟、强硬的中年女性老板声音，西班牙语。'] },
  { value: 'Spanish_Wiselady', label: 'Wise Lady', description: ['一位中性、智慧的中年女士声音，西班牙语。'] },
  { value: 'Spanish_Steadymentor', label: 'Steady Mentor', description: ['一位傲慢但稳重的青年男性导师声音，西班牙语。'] },
  { value: 'Spanish_Jovialman', label: 'Jovial Man', description: ['一位沙哑、快活的老年男性声音，西班牙语。'] },
  { value: 'Spanish_SantaClaus', label: 'Santa Claus', description: ['一位欢乐的老年男性圣诞老人声音，西班牙语。'] },
  { value: 'Spanish_Rudolph', label: 'Rudolph', description: ['一位天真的青年男性声音，鲁道夫风格，西班牙语。'] },
  { value: 'Spanish_Arnold', label: 'Arnold', description: ['一位稳重的青年男性声音，阿诺德风格，西班牙语。'] },
  { value: 'Spanish_Intonategirl', label: 'Intonate Girl', description: ['一位声线多变的青年女性声音，西班牙语。'] },
  { value: 'Spanish_Ghost', label: 'Ghost', description: ['一位沙哑的青年男性鬼魂声音，西班牙语。'] },
  { value: 'Spanish_HumorousElder', label: 'Humorous Elder', description: ['一位古怪幽默的老年男性长者声音，西班牙语。'] },
  { value: 'Spanish_EnergeticBoy', label: 'Energetic Boy', description: ['一位活泼充满活力的青年男性声音，西班牙语。'] },
  { value: 'Spanish_WhimsicalGirl', label: 'Whimsical Girl', description: ['一位机智、奇特的青年女性声音，西班牙语。'] },
  { value: 'Spanish_StrictBoss', label: 'Strict Boss', description: ['一位权威、严格的青年女性老板声音，西班牙语。'] },
  { value: 'Spanish_ReliableMan', label: 'Reliable Man', description: ['一位稳重可靠的青年男性声音，西班牙语。'] },
  { value: 'Spanish_SereneElder', label: 'Serene Elder', description: ['一位沉思、宁静的老年男性长者声音，西班牙语。'] },
  { value: 'Spanish_AngryMan', label: 'Angry Man', description: ['一位语气激烈的青年男性声音，传达愤怒，西班牙语。'] },
  { value: 'Spanish_AssertiveQueen', label: 'Assertive Queen', description: ['一位坚定、果断的青年女王声音，西班牙语。'] },
  { value: 'Spanish_CaringGirlfriend', label: 'Caring Girlfriend', description: ['一位梦幻般的青年女性关怀女友声音，西班牙语。'] },
  { value: 'Spanish_PowerfulSoldier', label: 'Powerful Soldier', description: ['一位年轻有力的青年男性强大士兵声音，西班牙语。'] },
  { value: 'Spanish_PassionateWarrior', label: 'Passionate Warrior', description: ['一位热情、充满激情的青年男性战士声音，西班牙语。'] },
  { value: 'Spanish_ChattyGirl', label: 'Chatty Girl', description: ['一位健谈的青年女性声音，西班牙语。'] },
  { value: 'Spanish_RomanticHusband', label: 'Romantic Husband', description: ['一位深情的中年男性浪漫丈夫声音，西班牙语。'] },
  { value: 'Spanish_CompellingGirl', label: 'Compelling Girl', description: ['一位富有说服力、引人注目的青年女性声音，西班牙语。'] },
  { value: 'Spanish_PowerfulVeteran', label: 'Powerful Veteran', description: ['一位强劲有力的中年男性退伍军人声音，西班牙语。'] },
  { value: 'Spanish_SensibleManager', label: 'Sensible Manager', description: ['一位富有魅力、理智的青年男性经理声音，西班牙语。'] },
  { value: 'Spanish_ThoughtfulLady', label: 'Thoughtful Lady', description: ['一位忧虑、体贴的青年女士声音，西班牙语。'] },
  { value: 'Portuguese_SentimentalLady', label: 'Sentimental Lady', description: ['一位优雅感性的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_BossyLeader', label: 'Bossy Leader', description: ['一位冷静正式的青年男性专横领导者声音，葡萄牙语。'] },
  { value: 'Portuguese_Wiselady', label: 'Wise lady', description: ['一位柔和智慧的中年女士声音，葡萄牙语。'] },
  { value: 'Portuguese_Strong-WilledBoy', label: 'Strong-willed Boy', description: ['一位成熟坚定的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_Deep-VoicedGentleman', label: 'Deep-voiced Gentleman', description: ['一位声音低沉的青年绅士声音，葡萄牙语。'] },
  { value: 'Portuguese_UpsetGirl', label: 'Upset Girl', description: ['一位悲伤的青年女性声音，传达不安情绪，葡萄牙语。'] },
  { value: 'Portuguese_PassionateWarrior', label: 'Passionate Warrior', description: ['一位热情充满激情的青年男性战士声音，葡萄牙语。'] },
  { value: 'Portuguese_AnimeCharacter', label: 'Anime Character', description: ['一位灵动的中年女性声音，适合动漫角色，葡萄牙语。'] },
  { value: 'Portuguese_ConfidentWoman', label: 'Confident Woman', description: ['一位清晰坚定的自信青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_AngryMan', label: 'Angry Man', description: ['一位严肃愤怒的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_CaptivatingStoryteller', label: 'Captivating Storyteller', description: ['一位迷人的中年男性叙述者声音，非常适合讲故事，葡萄牙语。'] },
  { value: 'Portuguese_Godfather', label: 'Godfather', description: ['一位严肃的中年男性教父声音，充满权威感，葡萄牙语。'] },
  { value: 'Portuguese_ReservedYoungMan', label: 'Reserved Young Man', description: ['一位冷静内敛的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_SmartYoungGirl', label: 'Smart Young Girl', description: ['一位聪慧的青年女孩声音，敏锐而清晰，葡萄牙语。'] },
  { value: 'Portuguese_Kind-heartedGirl', label: 'Kind-hearted Girl', description: ['一位平和善良的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_Pompouslady', label: 'Pompous lady', description: ['一位夸张自负的青年女性声音，充满个性，葡萄牙语。'] },
  { value: 'Portuguese_Grinch', label: 'Grinch', description: ['一位狡黠的青年男性格林奇式声音，淘气而狡猾，葡萄牙语。'] },
  { value: 'Portuguese_Debator', label: 'Debator', description: ['一位强硬的中年男性辩手声音，强壮而果断，葡萄牙语。'] },
  { value: 'Portuguese_SweetGirl', label: 'Sweet Girl', description: ['一位甜美可爱的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_AttractiveGirl', label: 'Attractive Girl', description: ['一位迷人有魅力的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_ThoughtfulMan', label: 'Thoughtful Man', description: ['一位温柔体贴的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_PlayfulGirl', label: 'Playful Girl', description: ['一位俏皮可爱的青年女孩声音，葡萄牙语。'] },
  { value: 'Portuguese_GorgeousLady', label: 'Gorgeous Lady', description: ['一位俏皮华丽的青年女性声音，散发自信，葡萄牙语。'] },
  { value: 'Portuguese_LovelyLady', label: 'Lovely Lady', description: ['一位迷人可爱的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_SereneWoman', label: 'Serene Woman', description: ['一位宁静平和的青年女性声音，平静而沉着，葡萄牙语。'] },
  { value: 'Portuguese_SadTeen', label: 'Sad Teen', description: ['一位沮丧悲伤的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_MaturePartner', label: 'Mature Partner', description: ['一位成熟的中年男性伴侣声音，可靠而温暖，葡萄牙语。'] },
  { value: 'Portuguese_Comedian', label: 'Comedian', description: ['一位幽默的青年男性喜剧演员声音，葡萄牙语。'] },
  { value: 'Portuguese_NaughtySchoolgirl', label: 'Naughty Schoolgirl', description: ['一位诱人顽皮的青年女学生声音，葡萄牙语。'] },
  { value: 'Portuguese_Narrator', label: 'Narrator', description: ['一位适合叙事的中年女性叙述者声音，葡萄牙语。'] },
  { value: 'Portuguese_ToughBoss', label: 'Tough Boss', description: ['一位成熟强硬的中年女性老板声音，葡萄牙语。'] },
  { value: 'Portuguese_Fussyhostess', label: 'Fussy hostess', description: ['一位语气强烈、挑剔的中年女主人声音，葡萄牙语。'] },
  { value: 'Portuguese_Dramatist', label: 'Dramatist', description: ['一位古怪的中年男性戏剧家声音，葡萄牙语。'] },
  { value: 'Portuguese_Steadymentor', label: 'Steady Mentor', description: ['一位傲慢但稳重的青年男性导师声音，葡萄牙语。'] },
  { value: 'Portuguese_Jovialman', label: 'Jovial Man', description: ['一位开朗快活的中年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_CharmingQueen', label: 'Charming Queen', description: ['一位迷人有魅力的青年女王声音，葡萄牙语。'] },
  { value: 'Portuguese_SantaClaus', label: 'Santa Claus', description: ['一位欢乐的中年男性圣诞老人声音，充满节日气氛，葡萄牙语。'] },
  { value: 'Portuguese_Rudolph', label: 'Rudolph', description: ['一位天真的青年男性声音，鲁道夫风格，葡萄牙语。'] },
  { value: 'Portuguese_Arnold', label: 'Arnold', description: ['一位稳重的青年男性声音，阿诺德风格，强壮而坚定，葡萄牙语。'] },
  { value: 'Portuguese_CharmingSanta', label: 'Charming Santa', description: ['一位迷人有魅力的中年男性圣诞老人声音，葡萄牙语。'] },
  { value: 'Portuguese_CharmingLady', label: 'Charming Lady', description: ['一位迷人的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_Ghost', label: 'Ghost', description: ['一位性感的青年男性鬼魂声音，神秘而诱人，葡萄牙语。'] },
  { value: 'Portuguese_HumorousElder', label: 'Humorous Elder', description: ['一位滑稽幽默的中年男性长者声音，葡萄牙语。'] },
  { value: 'Portuguese_CalmLeader', label: 'Calm Leader', description: ['一位沉稳冷静的中年男性领导者声音，葡萄牙语。'] },
  { value: 'Portuguese_GentleTeacher', label: 'Gentle Teacher', description: ['一位温和温柔的青年男性教师声音，葡萄牙语。'] },
  { value: 'Portuguese_EnergeticBoy', label: 'Energetic Boy', description: ['一位活泼充满活力的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_ReliableMan', label: 'Reliable Man', description: ['一位稳重可靠的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_SereneElder', label: 'Serene Elder', description: ['一位沉静深思的中年男性长者声音，葡萄牙语。'] },
  { value: 'Portuguese_GrimReaper', label: 'Grim Reaper', description: ['一位阴森的青年男性死神声音，黑暗而不祥，葡萄牙语。'] },
  { value: 'Portuguese_AssertiveQueen', label: 'Assertive Queen', description: ['一位坚定果断的青年女王声音，葡萄牙语。'] },
  { value: 'Portuguese_WhimsicalGirl', label: 'Whimsical Girl', description: ['一位可爱奇特的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_StressedLady', label: 'Stressed Lady', description: ['一位不安、紧张的中年女士声音，葡萄牙语。'] },
  { value: 'Portuguese_FriendlyNeighbor', label: 'Friendly Neighbor', description: ['一位充满活力的友好青年女性邻居声音，葡萄牙语。'] },
  { value: 'Portuguese_CaringGirlfriend', label: 'Caring Girlfriend', description: ['一位梦幻般的中年女性关怀女友声音，葡萄牙语。'] },
  { value: 'Portuguese_PowerfulSoldier', label: 'Powerful Soldier', description: ['一位年轻有力的青年男性强大士兵声音，葡萄牙语。'] },
  { value: 'Portuguese_FascinatingBoy', label: 'Fascinating Boy', description: ['一位亲切迷人的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_RomanticHusband', label: 'Romantic Husband', description: ['一位深情的中年男性浪漫丈夫声音，葡萄牙语。'] },
  { value: 'Portuguese_StrictBoss', label: 'Strict Boss', description: ['一位机械般严格的青年女性老板声音，葡萄牙语。'] },
  { value: 'Portuguese_InspiringLady', label: 'Inspiring Lady', description: ['一位威严、鼓舞人心的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_PlayfulSpirit', label: 'Playful Spirit', description: ['一位灵动俏皮的青年女性精灵声音，葡萄牙语。'] },
  { value: 'Portuguese_ElegantGirl', label: 'Elegant Girl', description: ['一位富有戏剧性、优雅的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_CompellingGirl', label: 'Compelling Girl', description: ['一位富有说服力、引人注目的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_PowerfulVeteran', label: 'Powerful Veteran', description: ['一位强劲有力的中年男性退伍军人声音，葡萄牙语。'] },
  { value: 'Portuguese_SensibleManager', label: 'Sensible Manager', description: ['一位富有魅力、理智的中年男性经理声音，葡萄牙语。'] },
  { value: 'Portuguese_ThoughtfulLady', label: 'Thoughtful Lady', description: ['一位忧虑体贴的中年女士声音，葡萄牙语。'] },
  { value: 'Portuguese_TheatricalActor', label: 'Theatrical Actor', description: ['一位生动的中年男性戏剧演员声音，葡萄牙语。'] },
  { value: 'Portuguese_FragileBoy', label: 'Fragile Boy', description: ['一位温柔脆弱的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_ChattyGirl', label: 'Chatty Girl', description: ['一位健谈的青年女性声音，葡萄牙语。'] },
  { value: 'Portuguese_Conscientiousinstructor', label: 'Conscientious Instructor', description: ['一位年轻尽责的青年女性导师声音，葡萄牙语。'] },
  { value: 'Portuguese_RationalMan', label: 'Rational Man', description: ['一位深思熟虑、理性的青年男性声音，葡萄牙语。'] },
  { value: 'Portuguese_WiseScholar', label: 'Wise Scholar', description: ['一位亲切健谈的青年男性智慧学者声音，葡萄牙语。'] },
  { value: 'Portuguese_FrankLady', label: 'Frank Lady', description: ['一位激动坦率的中年女士声音，葡萄牙语。'] },
  { value: 'Portuguese_DeterminedManager', label: 'Determined Manager', description: ['一位自信果决的中年女性经理声音，葡萄牙语。'] },
  { value: 'French_Male_Speech_New', label: 'Level-Headed Man', description: ['一位理智的青年男性法语声音。'] },
  { value: 'French_Female_News Anchor', label: 'Patient Female Presenter', description: ['一位耐心的青年女性法语主持人，沉静而清晰。'] },
  { value: 'French_CasualMan', label: 'Casual Man', description: ['一位悠闲放松的中年男性法语声音。'] },
  { value: 'French_MovieLeadFemale', label: 'Movie Lead Female', description: ['一位坚定、适合电影角色的少女法语声音。'] },
  { value: 'French_FemaleAnchor', label: 'Female Anchor', description: ['一位成熟的女性法语主播声音。'] },
  { value: 'French_MaleNarrator', label: 'Male Narrator', description: ['一位适合叙述的青年男性法语声音。'] },
  { value: 'Indonesian_SweetGirl', label: 'Sweet Girl', description: ['一位甜美可爱的青年女性印尼语声音。'] },
  { value: 'Indonesian_ReservedYoungMan', label: 'Reserved Young Man', description: ['一位冷峻的青年男性印尼语声音。'] },
  { value: 'Indonesian_CharmingGirl', label: 'Charming Girl', description: ['一位迷人的青年女性印尼语声音。'] },
  { value: 'Indonesian_CalmWoman', label: 'Calm Woman', description: ['一位宁静的青年女性印尼语声音。'] },
  { value: 'Indonesian_ConfidentWoman', label: 'Confident Woman', description: ['一位自信的青年女性印尼语声音。'] },
  { value: 'Indonesian_CaringMan', label: 'Caring Man', description: ['一位充满关怀的青年男性印尼语声音。'] },
  { value: 'Indonesian_BossyLeader', label: 'Bossy Leader', description: ['一位权威的青年男性领导者声音，印尼语。'] },
  { value: 'Indonesian_DeterminedBoy', label: 'Determined Boy', description: ['一位坚定的青年男性印尼语声音。'] },
  { value: 'Indonesian_GentleGirl', label: 'Gentle Girl', description: ['一位柔和的青年女性印尼语声音。'] },
  { value: 'German_FriendlyMan', label: 'Friendly Man', description: ['一位真诚友好的中年男性德语声音。'] },
  { value: 'German_SweetLady', label: 'Sweet Lady', description: ['一位灵动甜美的青年女性德语声音。'] },
  { value: 'German_PlayfulMan', label: 'Playful Man', description: ['一位活泼的青年男性德语声音。'] },
  { value: 'Russian_HandsomeChildhoodFriend', label: 'Handsome Childhood Friend', description: ['一位为英俊青梅竹马角色设计的迷人少女声音，俄语。'] },
  { value: 'Russian_BrightHeroine', label: 'Bright Queen', description: ['一位傲慢明艳的青年女王声音，俄语。'] },
  { value: 'Russian_AmbitiousWoman', label: 'Ambitious Woman', description: ['一位强势、雄心勃勃的青年女性声音，俄语。'] },
  { value: 'Russian_ReliableMan', label: 'Reliable Man', description: ['一位稳重可靠的中年男性声音，俄语。'] },
  { value: 'Russian_CrazyQueen', label: 'Crazy Girl', description: ['一位充满活力的青年"疯狂女孩"声音，狂野而不可预测，俄语。'] },
  { value: 'Russian_PessimisticGirl', label: 'Pessimistic Girl', description: ['一位富有同情心的青年"悲观女孩"声音，俄语。'] },
  { value: 'Russian_AttractiveGuy', label: 'Attractive Guy', description: ['一位富有磁性、迷人的青年男性声音，俄语。'] },
  { value: 'Russian_Bad-temperedBoy', label: 'Bad-tempered Boy', description: ['一位脾气暴躁的青年男性声音，俄语。'] },
  { value: 'Italian_BraveHeroine', label: 'Brave Heroine', description: ['一位沉稳勇敢的中年女英雄声音，意大利语。'] },
  { value: 'Italian_Narrator', label: 'Narrator', description: ['一位适合叙述的中年男性意大利语声音。'] },
  { value: 'Italian_WanderingSorcerer', label: 'Wandering Sorcerer', description: ['一位冷酷无情的青年女性流浪巫师声音，意大利语。'] },
  { value: 'Italian_DiligentLeader', label: 'Diligent Leader', description: ['一位冷静勤奋的青年女性领导者声音，意大利语。'] },
  { value: 'Arabic_CalmWoman', label: 'Calm Woman', description: ['一位宁静的青年女性阿拉伯语声音。'] },
  { value: 'Arabic_FriendlyGuy', label: 'Friendly Guy', description: ['一位沉稳友好的青年男性阿拉伯语声音。'] },
  { value: 'Turkish_CalmWoman', label: 'Calm Woman', description: ['一位宁静的青年女性土耳其语声音，非常适合有声读物。'] },
  { value: 'Turkish_Trustworthyman', label: 'Trustworthy man', description: ['一位富有磁性、值得信赖的青年男性土耳其语声音。'] },
  { value: 'Ukrainian_CalmWoman', label: 'Calm Woman', description: ['一位宁静的青年女性乌克兰语声音，非常适合有声读物。'] },
  { value: 'Ukrainian_WiseScholar', label: 'Wise Scholar', description: ['一位亲切健谈的青年男性智慧学者声音，乌克兰语。'] },
] as const;
