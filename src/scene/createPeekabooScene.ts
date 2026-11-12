import { DURATION_SECONDS, windSignal } from "./timeline";

const { Container, Graphics, MeshSimple, Sprite, Texture } = (globalThis as any).PIXI as any;
type Container = any;
type Graphics = any;
type MeshSimple = any;
type Sprite = any;
type Texture = any;

export const ARTBOARD = { width: 1448, height: 1086 } as const;

type LayerKey = "school" | "trunk" | "foliageRear" | "boy" | "foliageFront" | "shadow";

export interface SceneSettings {
  intensity: number;
  sourceMode: "separated" | "original";
  showMasks: boolean;
}

export interface SceneRefs {
  root: Container;
  source: Sprite;
  layers: Record<LayerKey, Container>;
  renderAtTime: (time: number) => void;
  setLayerVisible: (layer: LayerKey, visible: boolean) => void;
  setSettings: (settings: Partial<SceneSettings>) => void;
  getSettings: () => SceneSettings;
  destroy: () => void;
}

type LeafOwner = {
  mesh: MeshSimple;
  outline: Graphics;
  bbox: readonly [number, number, number, number];
  phase: number;
  frequency: number;
  yaw: number;
  lift: number;
};

function makeCropMesh(texture: Texture, bbox: readonly [number, number, number, number]): MeshSimple {
  const [, , width, height] = bbox;
  return new MeshSimple({
    texture,
    vertices: new Float32Array([
      -width / 2, -height / 2,
      width / 2, -height / 2,
      width / 2, height / 2,
      -width / 2, height / 2,
    ]),
    uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
    indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
  });
}

function outlineFor(bbox: readonly [number, number, number, number]): Graphics {
  const [x, y, width, height] = bbox;
  return new Graphics()
    .rect(x, y, width, height)
    .stroke({ color: 0xe7c98e, width: 2, alpha: 0.7 });
}

export async function createPeekabooScene(replacementBoyTexture?: Texture): Promise<SceneRefs> {
  const assetSources = {
    source: "/assets/images/IMG-001-tree-hide-v01.png",
    underlay: "/assets/layers/film-v2/SH03/plate-clean-v2.png",
    leafLeft: "/assets/layers/foliage-left.png",
    leafMiddle: "/assets/layers/foliage-middle.png",
    leafFront: "/assets/layers/foliage-front.png",
    boy: "/assets/layers/boy.png",
    shadow: "/assets/layers/shadow.png",
    maskLeft: "/assets/masks/foliage-left.png",
    maskMiddle: "/assets/masks/foliage-middle.png",
    maskFront: "/assets/masks/foliage-front.png",
    maskBoy: "/assets/masks/boy.png",
  } as const;
  const loadTexture = (src: string): Promise<Texture> => new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(Texture.from(image));
    image.onerror = () => reject(new Error(`Unable to load scene asset: ${src}`));
    image.src = src;
  });
  const assetEntries = Object.entries(assetSources);
  const assetTextures = await Promise.all(assetEntries.map(([, src]) => loadTexture(src)));
  const loaded = Object.fromEntries(assetEntries.map(([alias], index) => [alias, assetTextures[index]])) as Record<keyof typeof assetSources, Texture>;

  const root = new Container({ label: "SH03_root" });
  const source = new Sprite(loaded.source);
  source.label = "BG_00_canvas_original";
  root.addChild(source);

  const underlay = new Sprite(loaded.underlay);
  underlay.label = "BG_10_school_ground";
  const school = new Container({ label: "BG_10_school_ground" });
  school.addChild(underlay);
  root.addChild(school);

  const trunk = new Container({ label: "ENV_20_trunk_branches" });
  const trunkTint = new Graphics()
    .rect(790, 0, 658, 1020)
    .fill({ color: 0x544c3c, alpha: 0.018 });
  trunk.addChild(trunkTint);
  root.addChild(trunk);

  const foliageRear = new Container({ label: "ENV_30_foliage_rear" });
  const foliageFront = new Container({ label: "ENV_50_foliage_front" });
  const boy = new Container({ label: "CHAR_40_boy" });
  const shadow = new Container({ label: "FX_60_painted_shadow" });
  root.addChild(foliageRear, boy, foliageFront, shadow);

  // Full-resolution texture masks are kept as actual Pixi mask nodes. The
  // cropped RGBA layers are delivered separately for offline inspection.
  const maskSprite = (texture: Texture, label: string): Sprite => {
    const mask = new Sprite(texture);
    mask.label = label;
    mask.visible = false;
    return mask;
  };

  const boySprite = new Sprite(replacementBoyTexture ?? loaded.source);
  boySprite.label = replacementBoyTexture ? "CHAR_40_boy_shared_climb_pose" : "CHAR_40_boy_sprite";
  if (replacementBoyTexture) {
    // Reuse the final, fully drawn SH02 pose in SH03 so the child does not
    // change design at the cut. The source scene remains the original fallback.
    boySprite.anchor.set(0.5, 1);
    boySprite.scale.set(0.78);
    boySprite.position.set(1015, 440);
  } else {
    boySprite.mask = maskSprite(loaded.maskBoy, "mask_boy_observed");
  }
  boy.addChild(boySprite);

  const shadowSprite = new Sprite(loaded.shadow);
  shadowSprite.position.set(300, 770);
  shadowSprite.alpha = 0;
  shadowSprite.label = "FX_60_shadow_texture";
  shadow.addChild(shadowSprite);

  const leafOwners: LeafOwner[] = [];
  const addLeaf = (
    parent: Container,
    texture: Texture,
    bbox: readonly [number, number, number, number],
    phase: number,
    frequency: number,
    yaw: number,
    lift: number,
  ): void => {
    const mesh = makeCropMesh(texture, bbox);
    mesh.position.set(bbox[0] + bbox[2] / 2, bbox[1] + bbox[3] / 2);
    mesh.label = `leaf_mesh_${phase.toFixed(2)}`;
    const outline = outlineFor(bbox);
    outline.visible = false;
    parent.addChild(mesh, outline);
    leafOwners.push({ mesh, outline, bbox, phase, frequency, yaw, lift });
  };

  addLeaf(foliageRear, loaded.leafLeft, [218, 34, 365, 392], 0.4, 0.82, 0.014, 1.1);
  addLeaf(foliageRear, loaded.leafMiddle, [468, 272, 380, 382], 2.2, 0.67, 0.011, 0.86);
  addLeaf(foliageFront, loaded.leafFront, [794, 0, 654, 390], 4.8, 0.53, 0.008, 0.62);

  let settings: SceneSettings = { intensity: 1, sourceMode: "separated", showMasks: false };
  let currentTime = 0;

  const applyMaskDebug = (): void => {
    for (const leaf of leafOwners) leaf.outline.visible = settings.showMasks;
  };

  const renderAtTime = (rawTime: number): void => {
    const time = Math.max(0, Math.min(DURATION_SECONDS, rawTime));
    currentTime = time;
    const gain = settings.intensity;
    source.visible = settings.sourceMode === "original";
    school.visible = settings.sourceMode === "separated";
    trunk.visible = settings.sourceMode === "separated";
    boy.visible = settings.sourceMode === "separated";
    foliageRear.visible = settings.sourceMode === "separated";
    foliageFront.visible = settings.sourceMode === "separated";
    shadow.visible = settings.sourceMode === "separated";

    for (const leaf of leafOwners) {
      const signal = windSignal(time, leaf.phase, leaf.frequency) * gain;
      const [x, y, width, height] = leaf.bbox;
      leaf.mesh.position.set(
        x + width / 2 + signal * 9,
        y + height / 2 + signal * leaf.lift * 5.5,
      );
      leaf.mesh.rotation = signal * leaf.yaw;
      leaf.mesh.scale.set(1 + signal * 0.012, 1 - signal * 0.008);
      leaf.outline.position.set(signal * 9, signal * leaf.lift * 5.5);
      leaf.outline.rotation = signal * leaf.yaw;
    }

    // The hand is deliberately still; the only acting is the wind and a
    // restrained painted shadow drift. The source has no clean eye layer.
    shadowSprite.x = Math.sin(time * 0.31 - 0.7) * 4.2 * gain;
    shadowSprite.y = Math.sin(time * 0.21 + 0.4) * 2.4 * gain;
    shadowSprite.alpha = 0.09 * Math.max(0, gain) * Math.abs(windSignal(time, 1.3, 0.44));
    applyMaskDebug();
  };

  renderAtTime(0);

  const layers: Record<LayerKey, Container> = { school, trunk, foliageRear, boy, foliageFront, shadow };

  return {
    root,
    source,
    layers,
    renderAtTime,
    setLayerVisible: (layer, visible) => { layers[layer].visible = visible; },
    setSettings: (partial) => { settings = { ...settings, ...partial }; renderAtTime(currentTime); },
    getSettings: () => ({ ...settings }),
    destroy: () => {
      root.destroy({ children: true });
    },
  };
}


