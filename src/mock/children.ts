import type { ChildDetail } from "@/types/children";

export const childrenMock: ChildDetail[] = [
  {
    id: "child_001",
    name: "千千",
    avatarLabel: "千",
    ageLabel: "4 岁 2 个月",
    summary: "近期在生活自理和同伴关照上有积极表现",
    focus: "生活自理",
    classroom: "中一班",
    guardianNote: "家长关注孩子在园表达和午睡情况",
    latestRecords: [
      {
        id: "record_001",
        title: "主动整理鞋子",
        description: "今天能独立完成穿鞋，并提醒同伴注意鞋带。",
        dateLabel: "今天",
      },
      {
        id: "record_002",
        title: "愿意表达需求",
        description: "午餐时主动告诉老师想再添一点汤。",
        dateLabel: "昨天",
      },
    ],
  },
  {
    id: "child_002",
    name: "安安",
    avatarLabel: "安",
    ageLabel: "3 岁 10 个月",
    summary: "过渡环节需要温和提示，午睡后状态稳定",
    focus: "情绪适应",
    classroom: "中一班",
    guardianNote: "家长希望同步分离焦虑和同伴互动",
    latestRecords: [
      {
        id: "record_003",
        title: "午睡后状态稳定",
        description: "醒来后能跟随老师提示整理床铺。",
        dateLabel: "今天",
      },
    ],
  },
  {
    id: "child_003",
    name: "小禾",
    avatarLabel: "禾",
    ageLabel: "4 岁 4 个月",
    summary: "喜欢参与建构活动，能清楚描述自己的作品",
    focus: "语言表达",
    classroom: "中一班",
    guardianNote: "家长希望看到更多作品表达记录",
    latestRecords: [
      {
        id: "record_004",
        title: "描述积木作品",
        description: "建构区活动后向老师介绍了桥和停车场。",
        dateLabel: "今天",
      },
    ],
  },
];
