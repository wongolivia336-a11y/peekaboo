# PEEKABOO / 还没有找到我

> 一部关于“渴望隐藏，却在真正不被看见时感到恐惧”的无对白实验动画。
> An experimental animated short about wanting to disappear — and fearing that you already have.

**Status:** pre-production / 前期创作 · 2026-11-11  
**Literary inspiration:** 袁哲生《寂寞的游戏》同名短篇（自由改编概念，非小说逐场复刻）  
**Music reference:** Swallow — *Peekaboo*（仅作为创作参考，公开使用需核实授权）  
**Technique:** 先做静帧美术与 animatic，再选镜头用 MiniMax 图生视频，手工剪辑修整  
**Format:** 初版 90 秒 / 4:3 原画探索 / 无对白、无旁白、无环境音；计划只保留配乐

## 项目原则

- **研究、选择、失败尝试都留档。** 不覆盖原始生成结果；每次迭代保留时间、模型、prompt、输入图、输出视频和评语。
- **以小说情绪而非剧情复述为中心。** 核心悖论：“我想躲起来”→“我希望被找到”→“你看着我，却看不见我”。
- **Tender Uncanny / 温柔的诡异。** 不用 VHS 噪点、空学校、眼球、霓虹等梦核现成符号堆叠。
- **非 AI slop。** 克制镜头运动、有限色板、统一角色、手绘瑕疵有目的；不因模型能生成运动就让所有事物移动。
- **区分事实与创作。** 小说意象、导演想象、模型生成能力、版权状态分别注明。

## 档案入口

| 文档 | 用途 |
| --- | --- |
| [文学研究与改编边界](docs/01-literary-research.md) | 原作线索、主旨解读、事实 / 想象区分 |
| [视觉方向与风格判断](docs/02-art-direction.md) | A/B/C 风格探索、色板、反 AI slop 清单 |
| [90 秒分镜 v0.1](docs/03-storyboard-v01.md) | 时间轴、镜头动作、视觉转折 |
| [代码驱动动画技术决策](docs/05-animation-engineering-decision.md) | PixiJS / 2.5D vs Three.js，8–12 秒镜头架构 |
| [Codex 直接执行交接](handoff/CODEX_PHASE1_2_5D.md) | 可运行原型、skill 检测、分层、导出与验证 |
| [Codex 代理仓库规则](AGENTS.md) | 后续执行时优先阅读的艺术/工程约束 |
| [EXP-002 代码驱动实验](production/experiments/EXP-002-code-driven-2-5d.md) | 实验假设、质量门槛与状态 |
| [视觉参考](docs/04-references.md) | erainshu、手工动画、音乐与其他研究起点 |
| [生图提示词 v0.1](prompts/image-v01.md) | 第一张风格帧探索 prompt |
| [MiniMax 提示词 v0.1](prompts/minimax-v01.md) | 孔兆年抬头等镜头的生成约束 |
| [制作与版本管理](production/WORKFLOW.md) | 目录、命名、转存、剪辑流程 |
| [实验日志](production/generation-log.csv) | 已产出、生成中、计划中三个状态 |
| [资产清单](production/ASSETS.md) | 首张画面说明与原始素材上传状态 |

## 当前素材状态

- **IMG-001**：2026-11-11，首张树上躲藏的画面已生成并在对话中提供。1448 × 1086 PNG，原始文件尚待纳入 GitHub 二进制资产目录；不要把本 README 当作原图已入库的证明。
- **VID-001**：MiniMax 图生视频 **生成中**；尚未收到输出文件，不能标记为已完成或可用。
- 其余镜头目前是文字分镜与创作提案，不是已完成影像。

## 目录约定

```text
peekaboo/
├── README.md
├── docs/                 # 文学、艺术方向、分镜、参考
├── prompts/              # 可复用/逐版提示词；不覆盖历史
├── production/           # 日志、流程、资产清单
├── assets/
│   ├── images/           # 原始静帧与人物/背景设定（待上传）
│   ├── video/            # 模型原始视频（待上传）
│   └── audio/            # 只保存有权存储/使用的音频
└── edits/                # 后续 animatic、工程文件、导出
```

> GitHub 的普通仓库不是无限大的视频素材库。较大的 MP4/工程文件建议使用 Git LFS 或外部对象存储，同时在 `production/ASSETS.md` 登记哈希与路径。不要将未经授权的正式录音直接公开提交。

## 2026-11-11 新路线：Code-driven 2.5D

用户反馈 MiniMax 视频效果不理想；当下尚未提供实际生成文件，因此**未核验具体失真问题**。决定先用原始水粉 PNG 的分层与代码运动实现 8–12 秒 SH03 镜头。默认 PixiJS v8 / TypeScript，必要时才用 Three.js，不把现有画面无依据地重建成低多边形场景。详见 [技术决策](docs/05-animation-engineering-decision.md) 和 [Codex 交接](handoff/CODEX_PHASE1_2_5D.md)。

**该阶段目前是文档及交接包，尚未出现可运行前端或动画导出。** 原图已在本次聊天中制作独立 ZIP 交接包，由 Codex 本地解压，仍需提交至 GitHub。

## 下一次回到本项目

1. 上传 IMG-001 原始 PNG 到 `assets/images/IMG-001-tree-hide-v01.png`。
2. 等 VID-001 输出后，登记模型版本、设置、视频大小/时长、原始 prompt，**保留失败版本**。
3. 对照静帧检查：线条闪烁、树叶运动、人物手脚与脸、镜头漂移、动画角色一致性。
4. 基于音乐制作静态 animatic，再决定是否生成其他 6 个镜头。

*这是不断扩充的创作档案。新的尝试请新增版本，不要悄悄覆盖旧作品。*
