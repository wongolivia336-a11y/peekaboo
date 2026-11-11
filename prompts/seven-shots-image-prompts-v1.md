# PEEKABOO · Seven image keyframe prompts / 七镜头文生图提示词

**Version:** v1.0, 2026-11-11  
**Film:** 《还没有找到我》 / NOT FOUND YET  
**Storyboard:** [docs/03-storyboard-v01.md](../docs/03-storyboard-v01.md)  
**Original art:** IMG-001, 1448×1086 PNG (4:3), referenced in [production/ASSETS.md](../production/ASSETS.md)

## 使用说明

- 下方 **七段英文 prompt 均可单独复制**，每段都已包含完整的同一套场景/角色/画材描述和负面约束，不依赖前一段在同一对话中。
- **真正想要统一角色和学校**，应把 IMG-001 作为每次的视觉参考图（image reference / reference editing），不要只依赖文生图文字。七段提示词定义关键帧，**不代表七张平面 PNG 就能自然生成 90 秒细腻动画**。
- SH01 必须移除树上主角；SH02 必须是爬树；SH03 首选直接用已存在的 IMG-001；SH04 新增孔兆年；SH05 用表演和目光建立关系；SH06 是视点变化而不是双重鬼魂；SH07 回到空镜。
- **小说事实 vs 电影新增：** 糖纸、具体校舍建筑细节、孔兆年的服装、影子错位均为导演提案。不要声称它们全出自原作。此为前期自由改编概念，公开发行需处理改编权与配乐许可。
- 不要生成含有“运动轨迹分身”“连续动作贴图”或“分镜四宫格”的单张图。给动画使用的首尾关键帧应分别生成，并记录编号。

## 固定设计设定（每段提示词已包含）

- 场景：右边大树、左边旧洗手槽、黄墙校舍、青绿窗框、褪红瓦顶、中间走廊通道、紫灰树影、水泥地。
- 主角：13 岁左右，黑色蓬松短发，脸部朴拙、白色短袖翻领衬衣、深褐短裤、短袜、旧白运动鞋、细长略笨拙的四肢。**以 IMG-001 为准。**
- 孔兆年：同龄另一男孩，齐整黑短发、蓝灰短袖、棕色短裤、凉鞋（仅本片新拟定美术造型）。
- 材料：纸张纹理中的水粉、手绘边缘、有限低饱和色，温柔但慢慢不对劲。**不是 AI dreamcore 图标拼贴。**
- 统一输出：4:3；源画板 1448 × 1086；构图可改变但学校与树的位置拓扑不改变。


---

## SH01 · 午后 / The Afternoon · 00:00–00:10

**叙事作用：** 从普通夏日与大面积空旷开始，不预告鬼故事。

### 文生图 / Keyframe prompt (copy whole block)

```text
Create ONE still image as a keyframe for an original hand-painted 2D animated short. Frame 4:3, design artboard 1448x1086. When IMG-001 reference is provided, treat it as the canonical visual master: preserve its established school geography, painterly material, protagonist design, muted colors, and era-neutral nostalgic atmosphere. The same courtyard has a monumental broad-canopy tree on the RIGHT, heavy forked brown trunk, dense irregular olive-green leaves, pale weathered ochre school buildings behind it, muted green wooden window frames, worn pinkish roof tiles, an open central passage, old outdoor washbasin on the LEFT, large empty concrete ground, faded lavender tree shadows. Soft flat summer afternoon daylight. Painterly dry gouache on fibrous paper, uneven hand-placed brush marks, imperfect hand-drawn outlines, restrained 2D independent animation sensibility. Colors: dusty cream, ochre, olive, muted sage, warm tree-bark brown, smoky lavender shadows, charcoal accents. The PROTAGONIST is always one same 13-year-old slender boy: short tousled black hair, small simple eyes, narrow shoulders, slightly long limbs, off-white short-sleeve collared shirt, faded dark brown shorts, short socks, well-worn off-white sneakers. Tender, peculiar, gently awkward facial proportions, with no glamour or digital polish. No typography, captions, lettering or watermark. One decisive composition, not a contact sheet or multiple frames.

SHOT-SPECIFIC COMPOSITION: Wide, quietly observational establishing shot from a low position across the school courtyard. The large tree fills the upper-right edge; the original background geography is fully visible and legible. The branches are EMPTY at this moment; no boy sitting in the tree yet. Only two or three tiny children are caught mid-run along the far LEFT side of the courtyard, small enough not to compete with the architecture. One distant child near the corridor faces away, not centrally staged. The foreground concrete is mostly vacant. Ordinary midsummer comfort, sunlight slightly too still; no ominous sky. Leave extensive negative space in the lower central foreground. Do not introduce a horror cue.

Keep handmade watercolor/gouache paper texture embedded in shapes, not as an artificial overlay. Avoid 3D, glossy rendering, hyperrealism, slick cinematic lighting, fantasy neon, oversaturated greens, VHS glitch, monstrous imagery, floating eyeballs, generic liminal corridors, decorative particles, plastic faces, anatomical distortions, duplicated people, invented architecture, and inconsistent school layout. Subtle strangeness should come from perspective and human attention, not overt horror props.
```

### Code animation / 给 Codex 的运动说明

镜头基本锁定。两三名孩子跨过远景边缘（少量关键帧或二维位移）；近处树冠只一两簇叶子动；建筑和树干静止。

**连续性与制作备注：** 需要从 IMG-001 修复树上的人物（背景补绘），不能把人物直接涂成树叶造成重影。

---

## SH02 · 躲藏 / Hide and Seek · 00:10–00:20

**叙事作用：** 游戏是快乐而笨拙的；不抢先恐怖化。

### 文生图 / Keyframe prompt (copy whole block)

```text
Create ONE still image as a keyframe for an original hand-painted 2D animated short. Frame 4:3, design artboard 1448x1086. When IMG-001 reference is provided, treat it as the canonical visual master: preserve its established school geography, painterly material, protagonist design, muted colors, and era-neutral nostalgic atmosphere. The same courtyard has a monumental broad-canopy tree on the RIGHT, heavy forked brown trunk, dense irregular olive-green leaves, pale weathered ochre school buildings behind it, muted green wooden window frames, worn pinkish roof tiles, an open central passage, old outdoor washbasin on the LEFT, large empty concrete ground, faded lavender tree shadows. Soft flat summer afternoon daylight. Painterly dry gouache on fibrous paper, uneven hand-placed brush marks, imperfect hand-drawn outlines, restrained 2D independent animation sensibility. Colors: dusty cream, ochre, olive, muted sage, warm tree-bark brown, smoky lavender shadows, charcoal accents. The PROTAGONIST is always one same 13-year-old slender boy: short tousled black hair, small simple eyes, narrow shoulders, slightly long limbs, off-white short-sleeve collared shirt, faded dark brown shorts, short socks, well-worn off-white sneakers. Tender, peculiar, gently awkward facial proportions, with no glamour or digital polish. No typography, captions, lettering or watermark. One decisive composition, not a contact sheet or multiple frames.

SHOT-SPECIFIC COMPOSITION: Medium-wide courtyard view at the base of exactly the same tree on the RIGHT; green school windows and central passage behind, lavender pavement shadow below. The protagonist is beginning to climb the textured bark: one sneaker braced against the broad fork, one hand clinging to a low branch, bony knees awkwardly bent. Capture ONE legible action pose, with realistic contact between feet/hands and tree. Far to the left, three school children in simple faded everyday clothes scatter playfully; one small child faces the old school wall and covers their eyes to count. Children have varying silhouettes but subdued costume colors, not matching clones. The protagonist's expression is sly, inward-looking and barely amused. Broad honest composition, no exaggerated speed streaks or action hero poses.

Keep handmade watercolor/gouache paper texture embedded in shapes, not as an artificial overlay. Avoid 3D, glossy rendering, hyperrealism, slick cinematic lighting, fantasy neon, oversaturated greens, VHS glitch, monstrous imagery, floating eyeballs, generic liminal corridors, decorative particles, plastic faces, anatomical distortions, duplicated people, invented architecture, and inconsistent school layout. Subtle strangeness should come from perspective and human attention, not overt horror props.
```

### Code animation / 给 Codex 的运动说明

先数数的人把手覆在眼前；其他孩子各自离场。主角脚踩树皮向上，拆为至少两段关键姿势，禁止用全身骨骼拉伸糊弄爬树。

**连续性与制作备注：** 和 IMG-001 人物白衬衫/短裤/鞋保持一致；别让孩子长出重复肢体。

---

## SH03 · 树上 / Hidden Happiness · 00:20–00:32

**叙事作用：** 他以为自己藏得足够好；画面应有淡淡的甜。

### 文生图 / Keyframe prompt (copy whole block)

```text
Create ONE still image as a keyframe for an original hand-painted 2D animated short. Frame 4:3, design artboard 1448x1086. When IMG-001 reference is provided, treat it as the canonical visual master: preserve its established school geography, painterly material, protagonist design, muted colors, and era-neutral nostalgic atmosphere. The same courtyard has a monumental broad-canopy tree on the RIGHT, heavy forked brown trunk, dense irregular olive-green leaves, pale weathered ochre school buildings behind it, muted green wooden window frames, worn pinkish roof tiles, an open central passage, old outdoor washbasin on the LEFT, large empty concrete ground, faded lavender tree shadows. Soft flat summer afternoon daylight. Painterly dry gouache on fibrous paper, uneven hand-placed brush marks, imperfect hand-drawn outlines, restrained 2D independent animation sensibility. Colors: dusty cream, ochre, olive, muted sage, warm tree-bark brown, smoky lavender shadows, charcoal accents. The PROTAGONIST is always one same 13-year-old slender boy: short tousled black hair, small simple eyes, narrow shoulders, slightly long limbs, off-white short-sleeve collared shirt, faded dark brown shorts, short socks, well-worn off-white sneakers. Tender, peculiar, gently awkward facial proportions, with no glamour or digital polish. No typography, captions, lettering or watermark. One decisive composition, not a contact sheet or multiple frames.

SHOT-SPECIFIC COMPOSITION: Medium-wide to wide view matched closely to the already-existing IMG-001 master painting. The protagonist sits high in the thick fork of the tree in the upper-right quadrant, knees folded, one arm dangling relaxed over the branch, pale sneakers perched on bark, a private half-smile. The empty school courtyard and old corridor remain visible below; the tree canopy surrounds him like a protective secret room. Give his free hand a very small folded candy wrapper, only if it can be placed without changing his original anatomy. A single tiny fleck of pale wrapper may be caught in mid-air below; do not fill the screen with flying things. The overall mood is ordinary and intensely private, almost warm enough to forget the boy is alone. Preserve original IMG-001 framing, leaves, trunk texture and painted shadows as accurately as possible.

Keep handmade watercolor/gouache paper texture embedded in shapes, not as an artificial overlay. Avoid 3D, glossy rendering, hyperrealism, slick cinematic lighting, fantasy neon, oversaturated greens, VHS glitch, monstrous imagery, floating eyeballs, generic liminal corridors, decorative particles, plastic faces, anatomical distortions, duplicated people, invented architecture, and inconsistent school layout. Subtle strangeness should come from perspective and human attention, not overt horror props.
```

### Code animation / 给 Codex 的运动说明

保留用户原图为首选静帧，不为了糖纸强行重绘。树叶错相低幅移动，光斑变化很轻；可加一片小糖纸下落，角色无须强行动起来。

**连续性与制作备注：** IMG-001 已生成，已有图优先，不要重新生成“差不多的男孩”；本提示仅供变体/补充关键帧。糖纸是导演新增，不声称来自小说原文。

---

## SH04 · 抬头 / The Look · 00:32–00:46

**叙事作用：** 一个没有表情的目光让全片第一次不安。

### 文生图 / Keyframe prompt (copy whole block)

```text
Create ONE still image as a keyframe for an original hand-painted 2D animated short. Frame 4:3, design artboard 1448x1086. When IMG-001 reference is provided, treat it as the canonical visual master: preserve its established school geography, painterly material, protagonist design, muted colors, and era-neutral nostalgic atmosphere. The same courtyard has a monumental broad-canopy tree on the RIGHT, heavy forked brown trunk, dense irregular olive-green leaves, pale weathered ochre school buildings behind it, muted green wooden window frames, worn pinkish roof tiles, an open central passage, old outdoor washbasin on the LEFT, large empty concrete ground, faded lavender tree shadows. Soft flat summer afternoon daylight. Painterly dry gouache on fibrous paper, uneven hand-placed brush marks, imperfect hand-drawn outlines, restrained 2D independent animation sensibility. Colors: dusty cream, ochre, olive, muted sage, warm tree-bark brown, smoky lavender shadows, charcoal accents. The PROTAGONIST is always one same 13-year-old slender boy: short tousled black hair, small simple eyes, narrow shoulders, slightly long limbs, off-white short-sleeve collared shirt, faded dark brown shorts, short socks, well-worn off-white sneakers. Tender, peculiar, gently awkward facial proportions, with no glamour or digital polish. No typography, captions, lettering or watermark. One decisive composition, not a contact sheet or multiple frames.

SHOT-SPECIFIC COMPOSITION: Perspective from close to the protagonist's hiding place in the tree, looking slightly DOWN through a few soft leaves and one large branch. Below on the lavender-shadowed concrete stands a DIFFERENT 13-year-old boy, Kong Zhaonian, slim with slightly neater straight black hair, a washed muted blue-grey short-sleeved shirt, tan shorts, and plain sandals. He has paused and is raising his face upward to look approximately toward the camera, but his expression is empty, unexcited, not frightened and not smiling. He appears to gaze PAST the hidden protagonist rather than recognize him. The weathered yellow classroom walls, muted green windows and the central corridor are coherently placed behind him. The protagonist may be suggested ONLY by an out-of-focus off-white sleeve at the upper frame edge, not duplicated as a full body. This is an ordinary daylight scene; no darkness or supernatural manifestations.

Keep handmade watercolor/gouache paper texture embedded in shapes, not as an artificial overlay. Avoid 3D, glossy rendering, hyperrealism, slick cinematic lighting, fantasy neon, oversaturated greens, VHS glitch, monstrous imagery, floating eyeballs, generic liminal corridors, decorative particles, plastic faces, anatomical distortions, duplicated people, invented architecture, and inconsistent school layout. Subtle strangeness should come from perspective and human attention, not overt horror props.
```

### Code animation / 给 Codex 的运动说明

固定镜头，朋友从远处走入树下、停顿、慢慢抬头、目光停住；不要上移镜头去替代他抬头。表情几乎不变。

**连续性与制作备注：** 树下孔兆年是新人物，必须做统一角色设定：蓝灰衬衫、棕色短裤、凉鞋，不等于小说指定穿着。

---

## SH05 · 视而不见 / Looking Through · 00:46–01:02

**叙事作用：** 他主动想被发现，却没有收到任何确认。

### 文生图 / Keyframe prompt (copy whole block)

```text
Create ONE still image as a keyframe for an original hand-painted 2D animated short. Frame 4:3, design artboard 1448x1086. When IMG-001 reference is provided, treat it as the canonical visual master: preserve its established school geography, painterly material, protagonist design, muted colors, and era-neutral nostalgic atmosphere. The same courtyard has a monumental broad-canopy tree on the RIGHT, heavy forked brown trunk, dense irregular olive-green leaves, pale weathered ochre school buildings behind it, muted green wooden window frames, worn pinkish roof tiles, an open central passage, old outdoor washbasin on the LEFT, large empty concrete ground, faded lavender tree shadows. Soft flat summer afternoon daylight. Painterly dry gouache on fibrous paper, uneven hand-placed brush marks, imperfect hand-drawn outlines, restrained 2D independent animation sensibility. Colors: dusty cream, ochre, olive, muted sage, warm tree-bark brown, smoky lavender shadows, charcoal accents. The PROTAGONIST is always one same 13-year-old slender boy: short tousled black hair, small simple eyes, narrow shoulders, slightly long limbs, off-white short-sleeve collared shirt, faded dark brown shorts, short socks, well-worn off-white sneakers. Tender, peculiar, gently awkward facial proportions, with no glamour or digital polish. No typography, captions, lettering or watermark. One decisive composition, not a contact sheet or multiple frames.

SHOT-SPECIFIC COMPOSITION: A close medium shot from beside the giant branch, protagonist in the foreground at upper-right, seated exactly where he was in IMG-001. He leans forward barely an inch with a newly unsettled expression, fingers resting tensely on bark, slightly parted mouth and small uncertain eyes. His outfit, proportions, shoes and hair remain consistent with IMG-001. Far below, visible through the opening in leaves, Kong Zhaonian in the muted blue-grey shirt stands on the same courtyard ground and looks upward THROUGH the protagonist's position without meeting his gaze. Use believable foreground–background scale and careful occlusion by leaves. The strangeness is almost invisible: the boy's painted shadow could be displaced a tiny amount on the branch, but his body is entirely opaque and physically present. No transparent ghost, no magical aura, no melodramatic fear. Warm afternoon light is unchanged.

Keep handmade watercolor/gouache paper texture embedded in shapes, not as an artificial overlay. Avoid 3D, glossy rendering, hyperrealism, slick cinematic lighting, fantasy neon, oversaturated greens, VHS glitch, monstrous imagery, floating eyeballs, generic liminal corridors, decorative particles, plastic faces, anatomical distortions, duplicated people, invented architecture, and inconsistent school layout. Subtle strangeness should come from perspective and human attention, not overt horror props.
```

### Code animation / 给 Codex 的运动说明

前景男孩轻微前倾，试探性抬手后停住；树下孩子目光越过他，不做回应；影子微小错位通过遮罩实现，不能让身体闪烁。

**连续性与制作备注：** 人物表演需关键帧或独立手臂绘制；不能对原 PNG 做全局形变。

---

## SH06 · 离身 / Outside Myself · 01:02–01:17

**叙事作用：** 用观看位置的断裂表达“看见自己”，不要用双重曝光做鬼魂。

### 文生图 / Keyframe prompt (copy whole block)

```text
Create ONE still image as a keyframe for an original hand-painted 2D animated short. Frame 4:3, design artboard 1448x1086. When IMG-001 reference is provided, treat it as the canonical visual master: preserve its established school geography, painterly material, protagonist design, muted colors, and era-neutral nostalgic atmosphere. The same courtyard has a monumental broad-canopy tree on the RIGHT, heavy forked brown trunk, dense irregular olive-green leaves, pale weathered ochre school buildings behind it, muted green wooden window frames, worn pinkish roof tiles, an open central passage, old outdoor washbasin on the LEFT, large empty concrete ground, faded lavender tree shadows. Soft flat summer afternoon daylight. Painterly dry gouache on fibrous paper, uneven hand-placed brush marks, imperfect hand-drawn outlines, restrained 2D independent animation sensibility. Colors: dusty cream, ochre, olive, muted sage, warm tree-bark brown, smoky lavender shadows, charcoal accents. The PROTAGONIST is always one same 13-year-old slender boy: short tousled black hair, small simple eyes, narrow shoulders, slightly long limbs, off-white short-sleeve collared shirt, faded dark brown shorts, short socks, well-worn off-white sneakers. Tender, peculiar, gently awkward facial proportions, with no glamour or digital polish. No typography, captions, lettering or watermark. One decisive composition, not a contact sheet or multiple frames.

SHOT-SPECIFIC COMPOSITION: An impossible but quiet elevated perspective looking back across the giant right-side tree and the nostalgic courtyard. The camera appears to float outside the protagonist's previous point of view, as if his awareness is now elsewhere in the tree canopy. Farther across the fork, there is precisely ONE version of the protagonist: the same boy in the off-white shirt, dark shorts and worn pale sneakers, now tiny and curled inward on the same high branch. An empty leaf-framed foreground plane implies an unseen observer has stepped away from his body. Architecture, tree shape, roof, windows and lavender ground shadows remain geographically faithful to IMG-001, but the spatial layers have a slight impossible overlap, just enough that the viewer cannot locate the observer. Keep subdued painted colors and daylight. There must be NO transparent second body, ghost silhouette, floating eyeball, beam of light, supernatural effects, overt dream portals or horror imagery.

Keep handmade watercolor/gouache paper texture embedded in shapes, not as an artificial overlay. Avoid 3D, glossy rendering, hyperrealism, slick cinematic lighting, fantasy neon, oversaturated greens, VHS glitch, monstrous imagery, floating eyeballs, generic liminal corridors, decorative particles, plastic faces, anatomical distortions, duplicated people, invented architecture, and inconsistent school layout. Subtle strangeness should come from perspective and human attention, not overt horror props.
```

### Code animation / 给 Codex 的运动说明

关键不是男孩离体特效，而是连续镜头通过前景叶片、视差和缓慢改变的观察位置让观看者后退，留树上那个男孩；重点检查遮挡补全。

**连续性与制作备注：** 2D 多平面/轻视差及分镜切换可以实现；真正环绕树的自由镜头需要重建隐藏像素，不能凭一张 PNG 无损实现。

---

## SH07 · 没有人回来 / No One Returns · 01:17–01:30

**叙事作用：** 悲伤不是世界毁灭，而是世界继续存在。

### 文生图 / Keyframe prompt (copy whole block)

```text
Create ONE still image as a keyframe for an original hand-painted 2D animated short. Frame 4:3, design artboard 1448x1086. When IMG-001 reference is provided, treat it as the canonical visual master: preserve its established school geography, painterly material, protagonist design, muted colors, and era-neutral nostalgic atmosphere. The same courtyard has a monumental broad-canopy tree on the RIGHT, heavy forked brown trunk, dense irregular olive-green leaves, pale weathered ochre school buildings behind it, muted green wooden window frames, worn pinkish roof tiles, an open central passage, old outdoor washbasin on the LEFT, large empty concrete ground, faded lavender tree shadows. Soft flat summer afternoon daylight. Painterly dry gouache on fibrous paper, uneven hand-placed brush marks, imperfect hand-drawn outlines, restrained 2D independent animation sensibility. Colors: dusty cream, ochre, olive, muted sage, warm tree-bark brown, smoky lavender shadows, charcoal accents. The PROTAGONIST is always one same 13-year-old slender boy: short tousled black hair, small simple eyes, narrow shoulders, slightly long limbs, off-white short-sleeve collared shirt, faded dark brown shorts, short socks, well-worn off-white sneakers. Tender, peculiar, gently awkward facial proportions, with no glamour or digital polish. No typography, captions, lettering or watermark. One decisive composition, not a contact sheet or multiple frames.

SHOT-SPECIFIC COMPOSITION: A very wide static composition returning to the same courtyard geography and nearly the same framing as SH01 and the existing IMG-001 painting. The old yellow school wall, weathered green windows, long central corridor and quiet concrete ground are entirely empty. The monumental tree on the RIGHT shelters a very small figure high among its branches: the same protagonist, almost difficult to notice, curled inward, no longer smiling. Sunlight stays warm and ordinary, while muted lavender shadows on the pavement feel a little longer and slightly too still. Much more empty ground than visual action. The child is NOT disappearing, not glowing, not in danger, and not being found. Nothing dramatic in the sky, no sunset, no storm. Paint a conclusion that remains unresolved: the hide-and-seek game continues after everyone has gone. A melancholy, tender final still, not a horror poster.

Keep handmade watercolor/gouache paper texture embedded in shapes, not as an artificial overlay. Avoid 3D, glossy rendering, hyperrealism, slick cinematic lighting, fantasy neon, oversaturated greens, VHS glitch, monstrous imagery, floating eyeballs, generic liminal corridors, decorative particles, plastic faces, anatomical distortions, duplicated people, invented architecture, and inconsistent school layout. Subtle strangeness should come from perspective and human attention, not overt horror props.
```

### Code animation / 给 Codex 的运动说明

固定极远景。树叶也逐渐停下，最后几秒几乎无动作，停留后切黑；不要给角色一个戏剧性的消失或飘浮。

**连续性与制作备注：** 可以复用 IMG-001 构图与背景，轻微重构人物姿态和远景尺度；留白本身是结尾。

---

## 关键帧制作矩阵

| Shot | 首张关键帧 | 可能需要的第二帧或分层 | 图生图/文生图策略 |
|---|---|---|---|
| SH01 | 校园没有人在树上 | 孩子远景人物透明层 | 基于 IMG-001 背景去人 / 修复树上遮挡，不要误以为自动抠图能完美补全 |
| SH02 | 主角脚踩树皮的姿势 | 抬膝/抓枝另一姿势、跑开孩子分层 | 需要新角度重绘，参考 IMG-001 人物 |
| SH03 | **复用 IMG-001** | 小范围枝叶、糖纸或面部局部层 | 不必重生整图，先尝试抠图和局部运动 |
| SH04 | 树下朋友抬头前 / 过程中 | 抬头后脸部姿势 | 新视角，但保留学校拓扑、朋友一致性 |
| SH05 | 主角前倾，朋友在树下 | 试探性抬手 / 影子细节 | 前后景分层、深度严格连续 |
| SH06 | 超现实但可理解的旁观视角 | 前景树叶/距离层次 | 新视角关键帧和合成，不建议无依据 3D 重建 |
| SH07 | 与 SH01 近似的远景 | 可选远景男孩更蜷缩姿势 | 高度复用原画背景，动作逐渐衰减 |

**色板指导**：`#E8DDBC` `#AAB78A` `#66755F` `#D0A16D` `#9385A1` `#30332E`（指导色，不是声称从 PNG 取样）。
