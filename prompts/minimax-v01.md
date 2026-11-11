# VIDEO-v01 · MiniMax 图生视频镜头测试

**状态**：用户已表示视频正在生成，尚未收到任何视频文件、生成设置、输出结果。下列 prompt 是早前提出的测试文本，不自动等于用户实际提交的 prompt。

## SH04 / 孔兆年抬头（8 秒试验）

```text
Use the provided illustration as the exact first-frame visual reference.

One continuous static shot in a handmade 2D animation style.

A teenage schoolboy stands beneath a tree in an old school courtyard. He slowly raises his head and looks directly toward the hidden protagonist above.

His face remains expressionless. His gaze is vacant but not exaggerated. He seems to be looking through someone rather than at them.

The movement is subtle and slightly awkward, with the restrained timing of hand-drawn character animation.

Only a few leaves move gently in the background. The environment remains almost completely still.

Preserve the original illustration's line quality, limited color palette, character design, clothing and background composition.

No camera movement. No cuts. No sudden transformation. No exaggerated acting. No new characters or objects.

No dialogue, no singing, no music, no sound effects. Silent scene.

Duration: 8 seconds.
```

## 原则

- 使用明确静帧作为首帧；尽可能将 1 个镜头约束为 1 个小动作。
- 如果模型不遵守“安静”，后期只截取自然的 1–2 秒，或用静态分层/手工动画替代。
- H3 等模型能力、价格、时长/分辨率随平台更新，实际运行前以使用的平台说明为准。
- 生视频前保存真实的：模型名和版本、首尾帧、实际 Prompt、生成时长、seed（如果提供）、输出文件、失败类型、是否采用。
- IMG-001 **没有**树下人物；如果用它作为 SH04 首帧，需要先做树下人物的构图帧，不能指望模型无故生成第二主角同时保持设定一致。

## 待执行的其他运动试验

- SH03：糖纸漂落，男孩基本不动。
- SH06：通过分层与剪辑做视点脱离，优先不使用复杂模型变形。
- SH07：树冠微动，人物与校园尽量静止。
