# CODEX · PEEKABOO 七镜头代码动画制作交接

> 版本 1.0 · 2026-11-11 · 原创短片前期实验 · 可将整篇复制到 Codex
>
> **仓库**: https://github.com/wongolivia336-a11y/peekaboo
>
> **七镜头独立文生图提示词**: [prompts/seven-shots-image-prompts-v1.md](../prompts/seven-shots-image-prompts-v1.md)
>
> **现有原创画面 IMG-001**: 1448×1086，原文件归档状态见 [production/ASSETS.md](../production/ASSETS.md)

你是一名具备独立二维动画导演审美、色彩和手绘材料判断、PixiJS / WebGL 渲染、Remotion 时间轴、画面合成与高级前端工程能力的 Creative Technologist。你的目标不是把七张画做成 Keynote，也不是写一段 Skill 调研建议。请直接在仓库 **实现、渲染、检查、改进、提交** 一部 90 秒的可编辑实验短片。

## A. 先理解影片，禁止误读美学

项目：《还没有找到我》/ PEEKABOO / NOT FOUND YET；受袁哲生《寂寞的游戏》同名篇启发的自由改编实验。没有对白、旁白、解释性字幕或环境音；配乐意向为 Swallow 的《Peekaboo》，但**没有确定的公开使用授权，禁止下载/提交或默认内置该录音**。制作时音轨保持空白，之后提供用户本地可选音频入口。

**情绪弧线**：想隐藏的快乐 → 期待被找到 → 被看着却没有被看见 → 看见树上的自己 → 游戏没有结束。核心是 **Tender Uncanny**：温暖、晒褪的夏日、水粉纸张、细微笨拙的人物表演、不被注意的恐惧。避免常见 dreamcore 现成符号、恐怖怪物、霓虹、VHS 噪点、漂浮粒子、橡皮泥全局形变、无意义镜头推进、看起来像图片库 slideshow 的转场。

正式执行之前请阅读：
1. `AGENTS.md`
2. `docs/01-literary-research.md`
3. `docs/02-art-direction.md`
4. `docs/03-storyboard-v01.md`
5. `docs/05-animation-engineering-decision.md`
6. `docs/06-code-as-video-github-research.md`
7. **`prompts/seven-shots-image-prompts-v1.md`**（七段完整提示词及各自运动指令）
8. `production/ASSETS.md`

一切以实际源图 IMG-001 为视觉母版；如果模型生成的其他关键帧在人物、鞋子、墙窗拓扑、叶片形状上不一致，必须通过重绘或合成修复，不是用另外一套“类似画风”蒙混过关。

## B. 检索、审查、安装及使用 Skills

优先研究这些官方 GitHub 仓库 **当前** 的 README、SKILL.md、LICENSE、依赖及脚本，不要照搬旧聊天中的未经验证安装命令：

1. **lemo-wake** — https://github.com/lemomo-ai/lemo-wake
   - 静帧分层 / 人物抠图 / 背景补全 / 深度图 / 5 秒短动画。官方主要针对 Claude Code，Codex 适配不是保证。
   - 原 Skill: `skills/wake/SKILL.md`。首选让 Codex 内置 `$skill-installer` 按 GitHub 文件夹定位安装；若安装失败，可克隆源码、检查后把完整 `skills/wake/` 复制到当前仓库 `.agents/skills/lemo-wake/` 或个人 `$HOME/.agents/skills/`。避免只复制 SKILL.md 却丢掉 references/scripts。相对路径必须自检。参考 `node scripts/doctor.mjs` 诊断依赖，仅在确认脚本来源后执行。
   - **许可证**：代码及文档 CC BY-NC 4.0；如用于商业项目或分发相关代码，需另外核实权利。避免直接把整个第三方 Skill 复制提交到公开仓库；可以做本地安装并在日志记录版本与来源。
   - **导演指令优先**：lemo-wake 某些默认范式偏大动作、无缝循环；本片是克制叙事电影，不强行让每个镜头循环或“动得够多”。

2. **lemo-opuscar** — https://github.com/lemomo-ai/lemo-opuscar
   - 纯代码制作影片的风格/导演方法库。Skill 文件夹 `plugin/skills/lemo-opuscar/`；研究 `TECHNIQUE.md`、`styles/watercolor/STYLE.md`、`styles/crayon-book/STYLE.md` 和其他手绘技法，以及其完整渲染检查方法。
   - 如果要在 Codex 使用，在确认安装路径后通过 `$skill-installer` 或人工放入 `.agents/skills/`；其 shell setup 需要按当前 OS 检查。不要宣称 Claude plugin 命令可以直接给 Codex 安装。
   - 不复用 demo 的叙事、人物或样片；只借用技术方法和验收标准。

3. **Remotion** — https://github.com/remotion-dev/remotion
   - 建议作为 **七镜头统一时间轴 + 24fps 逐帧导出**；必须在真实运行中验证与 PixiJS canvas 捕获兼容性及渲染帧确定性。必要时将每个镜头先导出 PNG 序列再由 FFmpeg 合成，避免无头浏览器不稳定。
   - 检查最新文档、依赖和商业许可情况。Remotion 是框架，不是一定要安装的 Skill。

4. **PixiJS v8** — 本镜头的 2.5D 演出引擎候选。用于具名分层、局部树叶扭动、遮挡、精确时间函数。Three.js 仅适用于 SH06 等真正需要空间变换的片段，不得重建整张水粉画为低模三维。

5. **Motion Canvas** — https://github.com/motion-canvas/motion-canvas
   - 如果 Remotion + Pixi 组合实测不稳，再进行小范围替代验证。不要无根据地一次性同时使用四个渲染器。

**官方 Codex Skill 位置**：Codex 文档说明可在仓库 `$REPO_ROOT/.agents/skills/` 或用户 `$HOME/.agents/skills/` 放置带 `SKILL.md` 的目录；可调用内置 `$skill-installer`；若未出现，重启 Codex。请先检查是否已经有对应技能。不得未经审查直接运行不可信第三方脚本、未经同意上传私人资源或提交第三方代码副本。

安装成功的证明：登记 Git commit/tag、skills 目录、所用脚本和实际成功的 smoke test；安装失败也记载原因。**“找到一个 GitHub 项目”不算安装，“安装了”不等于适用于本片。**

## C. 七个镜头是一个 2160 帧项目

统一 **4:3**；24fps；片长 90 秒；基准画幅 1448×1086（若编码需要偶数尺寸这本身为偶数）。

| Shot | 时码 | 时长 | 帧数 | 导演目标 |
|---|---|---:|---:|---|
| SH01 午后 | 00:00–00:10 | 10s | 240 | 安静的旧校园，远处孩子跑过 |
| SH02 躲藏 | 00:10–00:20 | 10s | 240 | 捉迷藏数数与爬树，手脚有真实触点 |
| SH03 树上 | 00:20–00:32 | 12s | 288 | **已有 IMG-001 原图**；小动作，幸福的躲藏 |
| SH04 抬头 | 00:32–00:46 | 14s | 336 | 孔兆年来树下，缓慢抬头，目光穿过 |
| SH05 视而不见 | 00:46–01:02 | 16s | 384 | 男孩试探性移动，朋友无反应，影子细微错位 |
| SH06 离身 | 01:02–01:17 | 15s | 360 | 视点从身体旁离开，看见树上缩小的自己 |
| SH07 没有人回来 | 01:17–01:30 | 13s | 312 | 回到远景，几乎静止，无人寻找 |
| 合计 | 00:00–01:30 | 90s | 2160 | 无对白 / 无环境音 |

- 每一镜都要有明确的 **镜头运动语言**：静止可能是最重要的导演决定，绝不能自动添加预设 Ken Burns zoom/pan。
- 每一镜区分：背景板、独立人物、遮挡叶簇、前景枝杈、影子；能否独立运动需要真实可用的 mask/retouch。
- 首尾关键帧需要的构图见七段提示词；不要求全部由代码重新“绘画”，本项目允许 **手绘 PNG + code animation**，但禁止使用生成式视频模型。
- 对于只有 SH03 一张 PNG 的情况：先建立完整 7-shot 时间轴与带明确状态的 animatic；立即精细实现 SH03，并继续补完能从已有素材可靠重建的镜头；其他镜头需新的关键帧时，提供 `shot-id_asset-needed.md` 和透明占位标记，**不伪造为正式完成镜头**。
- 若用户后来提供七张关键帧，将其映射 `assets/frames/SH01-v01.png`... `SH07-v01.png`，制作真实分层、改动演出，而不是将图做为一张整屏 png 直接平移。

## D. 技术架构（可提出更好方案，但必须给证据）

建议：
```text
src/
  film/
    shots.ts                 # shot ID, frames, scene metadata, asset references
    timeline.ts              # deterministic pure renderAt(frame/time)
    composition.tsx          # Remotion master composition / or validated alternative
  scenes/
    SH01.ts ... SH07.ts      # each shot's choreography and layers
  renderer/
    pixiScene.ts             # shared 2.5D renderer lifecycle
    material.ts              # textured paper/mattes/compositing
  debug/
    Inspector.tsx            # ONLY development UI: scrub, mask, A/B, layer toggles
assets/
  images/                    # IMG-001 original
  frames/                    # generated/retouched keyframes
  layers/                    # per-shot masks and transparent actors
edits/
  previews/                  # contact sheets / verified rendered frames
  renders/                   # reproducible exports; LFS/external store if huge
production/
  experiments/               # per-shot logs and known defects
```

核心要求：
- 动画是 **纯函数**：`renderAtTime(t)` 或 `renderAtFrame(n)` 对任意访问顺序返回相同画面；不要使用依赖上一帧状态的随机模拟。
- 统一本地时间与全片时间，24fps 可在任意帧截屏；动效参数有名字且易调。
- 可重复/可重启，销毁时释放 GPU、ticker、resize listeners；Reduced Motion 降低非叙事性装饰动效。
- 运行时允许隔离图层、遮罩与原画对比，正式导出的电影画面不出现调参 UI。
- 纸张纹理应当来源于真实画面或画笔算法，不使用满屏统一噪点掩盖图层断口。
- 被移走物体背后是未知像素；局部修复时保留源图、补全图、mask。禁止在无遮挡区域显示透明大洞。
- 相邻镜头需从动作和视线连续性过渡，不使用全片通用淡入淡出。对 SH04 抬头和 SH06 离身格外打磨。
- 禁止人物面部漂移、重复肢体、窗户融化、树枝与手脚穿模、遮挡光晕、整个画面的无节制运动。

## E. 应执行的制作步骤

**0. 资产状态**：读取 `production/ASSETS.md`，核实 IMG-001 是否已经存在本地；若不存在，明确 `assets/images/IMG-001-tree-hide-v01.png` 的欠缺并使用用户交接 ZIP 提取。只要没有源图，不能伪装完成了原画还原。不要自行在线找一张无关图冒充。

**1. Skill QA**：以“是否直接提高这张水粉插画的分层或代码演出效果”为标准评估候选，实际用一个小范围试验验证。记录依赖、许可证、效果、选用理由，不必全部装成一套大而复杂的系统。

**2. Storyboard QA**：依照 prompts 文件建立固定角色与场景 registry、七个镜头、时长。生成一份 contact sheet 与 asset audit。把原画作为美术母版，制订每镜所需关键帧和图层。若没有图像生成权限，使用现有素材构建明确标识的 animatic，并保留独立 image prompts；不能称所有镜头美术完稿。

**3. 第一次完整可播放时间轴**：实现 90s 4:3 24fps 结构、七个片段时长、可逐帧 seek、无声 MP4 导出流程。即使某镜头图像缺失，必须真实显示 `MISSING ASSET` 仅在开发预览/animatic，并导出有明确标记的 draft，不把占位画面标为成片。

**4. 演出开发**：首先把 SH03 做为精细 proof-of-concept：2–3 簇不同时差叶片、原画纸张质感保存、男孩少量生动动作、遮挡与留白。再逐镜完成 SH01、SH02、SH04、SH05、SH06、SH07。允许按叙事价值而非顺序实施，但每个镜头都要有真实的运动编排逻辑。

**5. Review / Repair**：浏览器现场审片；每镜截取开头、中间、结尾帧，另抽取 SH04 目光与 SH06 视角断裂关键时刻的截图；生成 contact sheet；对比原画 fidelity、角色一致性、动作起落、背景稳定性和遮挡断口。至少实际完成一次审查修复循环；标注真实未解决问题。

**6. Render**：导出确定性 MP4，无声音轨，24fps H.264 合理码率；目标 1448×1086（或源像素等比规范尺寸）。若 ffmpeg 或内存限制导致不能导出，留下能实际重放的 PNG 序列 + 可执行导出命令，别声称已导出视频。

**7. Archive + push**：保留先前的研究文档、所有实验版本、失败输出与决策，不 force-push。生成 `production/experiments/EXP-003-seven-shot-code-animation.md`、资产 manifest 更新和 `RUNNING.md`（安装/预览/渲染/验收命令）。真实运行 build/test/export 才能勾选对应验收。大视频可用 Git LFS 或清晰记录外部持久路径，不能只留临时聊天下载链接。

## F. 成功标准（分层达成，不夸大）

**Stage 1 / 已完成可编辑 Animatic**：
- 七镜头时间轴 90s、4:3、24fps，可 seek，能导出 draft。
- 所有镜头状态明示已完成 / 概念关键帧 / 缺少资产。

**Stage 2 / 真正的代码动画**：
- SH03 原图保真、高质量分层、至少两个独立元素有可控运动。
- SH04 人物抬头是表演，不是相机替人动。
- SH06 视角变化在画面里可信，没有 ghost effect 特效包。

**Stage 3 / 成片可交付**：
- 七镜头都具备可审查的代码运动与素材，渲染成 90s 完整无声 MP4。
- 每镜有截图和缺陷检查，不只是七张静图的 Ken Burns。
- 授权的正式音源可由后期人工加入，仓库不默认分发歌曲。

最终答复只报告已实际做到的阶段，附启动命令、真实浏览器截图、文件路径、Git commit SHA 与仍存问题。不要把“项目能编译”误认为“电影完成”。不需要再向用户问项目已说明过的事情；资产确实缺失时要采取可继续推进的最低阻碍方案，优先交付完整结构 + 精细示范镜头。

---

## 给 Codex 的超短启动语

```text
在当前仓库直接执行 handoff/CODEX_SEVEN_SHOT_FILM_V1.md 的完整任务；七段画面 prompt 在 prompts/seven-shots-image-prompts-v1.md。先研究并验证 lemo-wake 和 lemo-opuscar 适用于 Codex 的 Skill 安装/使用，再制作基于 IMG-001 原画的 90 秒七镜头代码动画。请真实运行浏览器、逐帧检查、导出可复现的 MP4 / draft，保留所有素材与版本并 push。不要只给方案；遇到缺失关键帧要如实标明并推进可实现部分，绝不伪造完成状态。
```
