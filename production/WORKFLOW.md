# Production Workflow / 可追溯迭代

## 阶段与验收

1. **Research**：原文核实、意象表、导演阐述、参考具体镜头。
2. **Style tests**：三张同题异风格的画面 A/B/C；选择而非平均化。
3. **Art bible**：主角角色表、配角角色表、树/校舍、颜色与手工纹理规则。
4. **Animatic**：先用静帧剪 90 秒，验证节奏、视点转换和结尾。
5. **Image-to-video**：逐镜头生成，保留原图、prompt、设置与输出（包括失败版）。
6. **Compositing**：角色/背景错位修复、静止区域保护、轻量色彩统合。
7. **Music + rights**：确认所使用的录音及改编发布授权；交付无对白版。
8. **Release**：导出、致谢/署名及版本归档。

## 文件命名

- `IMG-001-tree-hide-v01.png`
- `IMG-001-tree-hide-v02.png`（同一概念，迭代不同画面）
- `VID-001-tree-hide-minimax-h3-run01.mp4`
- `SH04-look-up-keyframe-v01.png`
- `EDIT-animatic-v01.mp4`

## 每次生成后填写

```yaml
asset_id: VID-001
created_at: YYYY-MM-DD
status: planned | generating | delivered | reviewed | selected | rejected
shot_id: SH04
model: "actual model/version"
prompt_file: prompts/minimax-v01.md
actual_prompt: "paste exact submitted text or link to a new file"
input_assets: [assets/images/IMG-001-tree-hide-v01.png]
duration_seconds: null
resolution: null
seed: null
output: null
review: "what works / what fails"
decision: "keep / revise / discard + why"
```

## 大文件策略

文本、图片、缩略图、提示词可以放 Git。视频、音频与剪辑工程可能过大，优先 Git LFS（配置 `*.mp4 filter=lfs diff=lfs merge=lfs -text` 等）或另一个长期云存储，记下哈希 / 版本 / 可访问地址。不得仅把临时聊天文件链接当作长期素材存储。

## 完整性原则

- 未上传不标“已归档”；
- 正在生成不标“已完成”；
- 提议的 prompt 不标“实际使用”；
- AI 输出不抹掉其问题和失败记录；
- 所有引自原作的逐字内容在发表前进行版权核查。
