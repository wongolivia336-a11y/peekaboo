import { createPeekabooScene } from "../scene/createPeekabooScene";
import { HEIGHT, FPS, SHOTS, TOTAL_FRAMES, TRANSITION_FRAMES, WIDTH, locateFrame, smoothstep, type ShotId } from "./timeline";
import layerManifest from "../../assets/layers/film/manifest.json";

const PIXI = (globalThis as any).PIXI;
const { Container, Sprite, Texture, Graphics } = PIXI;
type AnyContainer = any;
type AnySprite = any;
type TextureLike = any;

const frameUrls: Record<ShotId, string> = {
  SH01: new URL("../../assets/frames/SH01-v01.png", import.meta.url).href,
  SH02: new URL("../../assets/frames/SH02-v01.png", import.meta.url).href,
  SH03: new URL("../../assets/images/IMG-001-tree-hide-v01.png", import.meta.url).href,
  SH04: new URL("../../assets/frames/SH04-v01.png", import.meta.url).href,
  SH05: new URL("../../assets/frames/SH05-v01.png", import.meta.url).href,
  SH06: new URL("../../assets/frames/SH06-v01.png", import.meta.url).href,
  SH07: new URL("../../assets/frames/SH07-v01.png", import.meta.url).href,
};

const plateUrls: Partial<Record<ShotId, string>> = {
  SH01: new URL("../../assets/layers/film-v2/SH01/plate-clean-v2.png", import.meta.url).href,
  SH02: new URL("../../assets/layers/film-v2/SH02/plate-clean-v2.png", import.meta.url).href,
  SH04: new URL("../../assets/layers/film-v2/SH04/plate-clean-v2.png", import.meta.url).href,
  SH05: new URL("../../assets/layers/film-v2/SH05/plate-clean-v2.png", import.meta.url).href,
  SH06: new URL("../../assets/layers/film-v2/SH06/plate-clean-v2.png", import.meta.url).href,
};

const actorUrls: Record<string, string> = {
  "SH01/runner-01": new URL("../../assets/layers/film-v2/SH01/actors/runner-01.png", import.meta.url).href,
  "SH01/runner-02": new URL("../../assets/layers/film-v2/SH01/actors/runner-02.png", import.meta.url).href,
  "SH01/runner-03": new URL("../../assets/layers/film-v2/SH01/actors/runner-03.png", import.meta.url).href,
  "SH01/runner-04": new URL("../../assets/layers/film-v2/SH01/actors/runner-04.png", import.meta.url).href,
  "SH02/runner": new URL("../../assets/layers/film-v2/SH02/actors/runner.png", import.meta.url).href,
  "SH04/kong": new URL("../../assets/layers/film-v2/SH04/actors/kong.png", import.meta.url).href,
  "SH05/observer": new URL("../../assets/layers/film-v2/SH05/actors/observer.png", import.meta.url).href,
  "SH05/small-boy": new URL("../../assets/layers/film-v2/SH05/actors/small-boy.png", import.meta.url).href,
  "SH06/tree-boy": new URL("../../assets/layers/film-v2/SH06/actors/tree-boy.png", import.meta.url).href,
};

const climbFrameUrls = [
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-001.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-002.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-003.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-004.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-005.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-006.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-007.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-008.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-009.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-010.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-011.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-012.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-013.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-014.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-015.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-016.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-017.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-018.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-019.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-020.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-021.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-022.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-023.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-024.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-025.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-026.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-027.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-028.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-029.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-030.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-031.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-032.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-033.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-034.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-035.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-036.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-037.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-038.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-039.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/climb-frames-v3/frames/frame-040.png", import.meta.url).href,
] as const;

const searcherFrameUrls = [
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-001.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-002.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-003.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-004.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-005.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-006.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-007.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-008.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-009.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-010.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-011.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-012.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-013.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-014.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-015.png", import.meta.url).href,
  new URL("../../assets/concepts/characters/searcher-frames-v1/frames/frame-016.png", import.meta.url).href,
] as const;

const originalBoyUrl = new URL("../../assets/layers/boy.png", import.meta.url).href;

function textureFrom(url: string): Promise<TextureLike> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(Texture.from(image));
    image.onerror = () => reject(new Error(`Could not load image layer: ${url}`));
    image.src = url;
  });
}

function partBbox(shot: string, name: string): [number, number, number, number] {
  const info = (layerManifest as any).shots[shot].layers[name];
  return info.bbox as [number, number, number, number];
}

function actorBounds(shot: string, parts: string[]): [number, number, number, number] {
  const boxes = parts.map((part) => partBbox(shot, part));
  const left = Math.min(...boxes.map(([x]) => x));
  const top = Math.min(...boxes.map(([, y]) => y));
  const right = Math.max(...boxes.map(([x, y, width]) => x + width));
  const bottom = Math.max(...boxes.map(([, y, , height]) => y + height));
  return [left, top, right - left, bottom - top];
}

function addActor(
  parent: AnyContainer,
  textures: Map<string, TextureLike>,
  shot: string,
  name: string,
  sourceParts: string[],
): { sprite: AnySprite; x: number; y: number } {
  const key = `${shot}/${name}`;
  const texture = textures.get(key);
  if (!texture) throw new Error(`Missing source-pixel actor layer ${key}`);
  const sprite = new Sprite(texture);
  sprite.label = `${shot}_${name}_source_pixels`;
  sprite.position.set(0, 0);
  parent.addChild(sprite);
  const [x, y, width, height] = actorBounds(shot, sourceParts);
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  parent.pivot.set(centerX, centerY);
  parent.position.set(centerX, centerY);
  return { sprite, x: centerX, y: centerY };
}

function addFullFrame(parent: AnyContainer, texture: TextureLike, label: string): AnySprite {
  const sprite = new Sprite(texture);
  sprite.label = label;
  sprite.position.set(0, 0);
  parent.addChild(sprite);
  return sprite;
}

function showPoseFrame(frames: AnySprite[], rawIndex: number): void {
  const index = Math.max(0, Math.min(frames.length - 1, Math.floor(rawIndex)));
  frames.forEach((sprite, frameIndex) => { sprite.visible = frameIndex === index; });
}

export interface FilmScene {
  root: AnyContainer;
  renderAtFrame: (frame: number) => void;
  renderAtTime: (seconds: number) => void;
  setSourceMode: (mode: "separated" | "original") => void;
  setMotionIntensity: (value: number) => void;
  setMasksVisible: (visible: boolean) => void;
  setLayerVisible: (layer: "background" | "characters", visible: boolean) => void;
  activeShot: () => { id: ShotId; localTime: number; frame: number };
  destroy: () => void;
}

export async function createSevenShotScene(): Promise<FilmScene> {
  const required = new Map<string, string>();
  for (const [key, url] of Object.entries(actorUrls)) required.set(key, url);
  climbFrameUrls.forEach((url, index) => required.set(`SH02/frame-${index}`, url));
  searcherFrameUrls.forEach((url, index) => required.set(`searcher/frame-${index}`, url));
  const textureEntries = await Promise.all([...required.entries()].map(async ([key, url]) => [key, await textureFrom(url)] as const));
  const textures = new Map<string, TextureLike>(textureEntries);
  const [sourceTextures, plateTextures, boyTexture] = await Promise.all([
    Promise.all(SHOTS.map(async (shot) => [shot.id, await textureFrom(frameUrls[shot.id as ShotId]!)] as const)),
    Promise.all(Object.entries(plateUrls)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
      .map(async ([id, url]) => [id, await textureFrom(url)] as const)),
    textureFrom(originalBoyUrl),
  ]);
  const sources = new Map<string, TextureLike>(sourceTextures);
  const plates = new Map<string, TextureLike>(plateTextures);
  const root = new Container({ label: "PEEKABOO_90s_2160f" });
  const shotRoots = new Map<ShotId, AnyContainer>();
  const originalSprites = new Map<ShotId, AnySprite>();
  const plateSprites = new Map<ShotId, AnySprite>();
  const groups: Record<"background" | "characters", AnyContainer[]> = { background: [], characters: [] };
  const allCutouts: AnySprite[] = [];
  const debugLayers = new Map<string, AnyContainer>();
  let sourceMode: "separated" | "original" = "separated";
  let motionIntensity = 1;
  let masksVisible = false;
  let backgroundsVisible = true;
  let charactersVisible = true;
  let currentFrame = 0;
  let currentShot: ShotId = "SH01";
  let currentTime = 0;

  const actorGroup = (shot: ShotId, key: string, parent: AnyContainer): AnyContainer => {
    const group = new Container({ label: `${shot}_${key}` });
    parent.addChild(group);
    debugLayers.set(`${shot}/${key}`, group);
    groups.characters.push(group);
    return group;
  };
  const maskDebug = (): void => {
    for (const sprite of allCutouts) {
      sprite.tint = masksVisible ? 0xff7868 : 0xffffff;
      sprite.alpha = masksVisible ? 0.72 : 1;
    }
  };

  for (const shot of SHOTS) {
    const id = shot.id as ShotId;
    const shotRoot = new Container({ label: `${id}_shot` });
    shotRoots.set(id, shotRoot);
    root.addChild(shotRoot);
    const original = addFullFrame(shotRoot, sources.get(id), `${id}_original_source`);
    original.visible = false;
    originalSprites.set(id, original);
    let plate: AnySprite;
    if (id === "SH03") {
      plate = new Sprite(sources.get(id));
      plate.label = "SH03_original_rendered_by_legacy_pixi_layers";
      shotRoot.addChild(plate);
    } else {
      plate = addFullFrame(shotRoot, plates.get(id) ?? sources.get(id), `${id}_background_plate`);
    }
    plateSprites.set(id, plate);
    groups.background.push(plate);
    shotRoot.visible = false;
  }

  const sharedBoyPose = textures.get("SH02/frame-39");
  if (!sharedBoyPose) throw new Error("Missing final shared boy pose for the SH02→SH03 cut");
  const layer = await createPeekabooScene(sharedBoyPose);
  const legacyRoot = shotRoots.get("SH03") as AnyContainer;
  // Replace the placeholder frame with the established, original-pixel SH03 scene.
  legacyRoot.removeChildren().forEach((child: AnyContainer) => child.destroy({ children: true }));
  legacyRoot.addChild(layer.root);
  debugLayers.set("SH03/tree-and-paper", layer.root);
  groups.background.push(layer.root);

  const runnerGroups: Array<{ group: AnyContainer; x: number; y: number }> = [];
  const sh01 = shotRoots.get("SH01") as AnyContainer;
  for (let i = 1; i <= 4; i++) {
    const group = actorGroup("SH01", `distant-runner-${i}`, sh01);
    const actorName = `runner-${String(i).padStart(2, "0")}`;
    const actor = addActor(group, textures, "SH01", actorName, [actorName]);
    allCutouts.push(actor.sprite);
    runnerGroups.push({ group, x: actor.x, y: actor.y });
  }

  const sh02 = shotRoots.get("SH02") as AnyContainer;
  const climb = actorGroup("SH02", "protagonist-complete-pose-frames", sh02);
  const climbFrameSprites: AnySprite[] = [];
  climbFrameUrls.forEach((_, index) => {
    const texture = textures.get(`SH02/frame-${index}`);
    if (!texture) throw new Error(`Missing hand-drawn character frame ${index + 1}`);
    const sprite = new Sprite(texture);
    sprite.label = `SH02_boy_frame_${String(index + 1).padStart(3, "0")}`;
    sprite.anchor.set(0.5, 1);
    sprite.scale.set(540 / texture.height);
    sprite.position.set(1000, 970);
    sprite.visible = index === 0;
    climb.addChild(sprite);
    climbFrameSprites.push(sprite);
    allCutouts.push(sprite);
  });

  const run = actorGroup("SH02", "runner-whole-source-cutout", sh02);
  const runner = addActor(run, textures, "SH02", "runner", [
    "runner-arm-back", "runner-arm-front", "runner-body", "runner-head", "runner-leg-back", "runner-leg-front",
  ]);
  allCutouts.push(runner.sprite);

  const sh04 = shotRoots.get("SH04") as AnyContainer;
  const kongGroup = actorGroup("SH04", "Kong-whole-source-cutout", sh04);
  const [kongLeft, kongTop, kongWidth, kongHeight] = actorBounds("SH04", ["kong-body", "kong-head", "kong-legs"]);
  const kongCenterX = kongLeft + kongWidth / 2;
  const kongBaseline = kongTop + kongHeight;
  const kongFrames = searcherFrameUrls.map((_, index) => {
    const texture = textures.get(`searcher/frame-${index}`);
    if (!texture) throw new Error(`Missing ground-searcher frame ${index + 1}`);
    const sprite = new Sprite(texture);
    sprite.label = `SH04_searcher_pose_${String(index + 1).padStart(2, "0")}`;
    sprite.anchor.set(0.5, 1);
    sprite.scale.set(1.04);
    sprite.position.set(kongCenterX, kongBaseline);
    sprite.visible = index === 0;
    kongGroup.addChild(sprite);
    allCutouts.push(sprite);
    return sprite;
  });

  const sh05 = shotRoots.get("SH05") as AnyContainer;
  const observerGroup = actorGroup("SH05", "near-observer-plane", sh05);
  const observer = addActor(observerGroup, textures, "SH05", "observer", ["observer-body", "observer-head"]);
  allCutouts.push(observer.sprite);
  const farGroup = actorGroup("SH05", "unseen-boy-plane", sh05);
  const [farLeft, farTop, farWidth, farHeight] = actorBounds("SH05", ["small-body", "small-head"]);
  const farCenterX = farLeft + farWidth / 2;
  const farBaseline = farTop + farHeight;
  const farBoyFrames = searcherFrameUrls.map((_, index) => {
    const texture = textures.get(`searcher/frame-${index}`);
    if (!texture) throw new Error(`Missing distant-searcher frame ${index + 1}`);
    const sprite = new Sprite(texture);
    sprite.label = `SH05_searcher_pose_${String(index + 1).padStart(2, "0")}`;
    sprite.anchor.set(0.5, 1);
    sprite.scale.set(0.72);
    sprite.position.set(farCenterX, farBaseline);
    sprite.visible = index === 0;
    farGroup.addChild(sprite);
    allCutouts.push(sprite);
    return sprite;
  });

  const sh06 = shotRoots.get("SH06") as AnyContainer;
  const treeGroup = actorGroup("SH06", "boy-in-tree", sh06);
  const treeBoy = addActor(treeGroup, textures, "SH06", "tree-boy", ["tree-boy"]);
  allCutouts.push(treeBoy.sprite);

  const sh07 = shotRoots.get("SH07") as AnyContainer;
  const finalBoyGroup = actorGroup("SH07", "boy-remains-in-tree", sh07);
  const finalBoy = new Sprite(boyTexture);
  finalBoy.label = "CHAR_40_original_IMG001_boy_cutout";
  finalBoy.position.set(1100, 170);
  finalBoy.scale.set(0.23);
  finalBoyGroup.addChild(finalBoy);
  allCutouts.push(finalBoy);
  const black = new Graphics().rect(0, 0, WIDTH, HEIGHT).fill({ color: 0x11120f, alpha: 1 });
  black.label = "end_cut_to_black";
  black.alpha = 0;
  sh07.addChild(black);

  const originalModeUpdate = (): void => {
    for (const id of SHOTS.map((shot) => shot.id as ShotId)) {
      if (id === "SH03") {
        layer.setSettings({ sourceMode: sourceMode, showMasks: masksVisible });
        layer.setLayerVisible("school", backgroundsVisible);
        layer.setLayerVisible("trunk", backgroundsVisible);
        layer.setLayerVisible("foliageRear", backgroundsVisible);
        layer.setLayerVisible("foliageFront", backgroundsVisible);
        layer.setLayerVisible("shadow", backgroundsVisible);
        layer.setLayerVisible("boy", charactersVisible);
        continue;
      }
      originalSprites.get(id)!.visible = sourceMode === "original";
      plateSprites.get(id)!.visible = sourceMode === "separated" && backgroundsVisible;
      const shotRoot = shotRoots.get(id)!;
      for (const child of shotRoot.children) {
        if (child === originalSprites.get(id) || child === plateSprites.get(id)) continue;
        if (groups.characters.includes(child)) child.visible = sourceMode === "separated" && charactersVisible;
      }
    }
  };

  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;
  const setCamera = (shot: ShotId, focusX: number, focusY: number, zoom: number): void => {
    const root = shotRoots.get(shot)!;
    root.pivot.set(focusX, focusY);
    root.position.set(centerX, centerY);
    root.scale.set(zoom);
  };

  const animateShot = (shot: ShotId, t: number, gain: number): void => {
    const cameraProgress = (duration: number): number => smoothstep(0, duration, t) * gain;
    if (shot === "SH01") {
      const move = cameraProgress(9.5);
      setCamera(shot, centerX + 125 * move, centerY + 48 * move, 1 + 0.045 * move);
      const travel = 6 * smoothstep(0.7, 8.8, t) * gain;
      runnerGroups.forEach(({ group, x, y }, i) => {
        const stride = Math.sin(t * 3.2 + i * 0.8);
        group.position.set(x + travel + stride * 0.7 * gain, y + stride * 0.65 * gain);
      });
    }
    if (shot === "SH02") {
      const move = cameraProgress(9.5);
      setCamera(shot, centerX + 145 * move, centerY + 35 * move, 1 + 0.085 * move);
      const animationFrame = Math.min(climbFrameSprites.length - 1, Math.floor(t * 12 * gain));
      climbFrameSprites.forEach((sprite, index) => { sprite.visible = index === animationFrame; });
      const climbTravel = 340 * smoothstep(0, climbFrameSprites.length - 1, animationFrame);
      climb.position.set(0, -climbTravel);

      const runnerTravel = 8 * smoothstep(0.7, 8.3, t) * gain;
      run.position.set(runner.x + runnerTravel, runner.y + Math.max(0, Math.sin(t * 6.8)) * 0.8 * gain);
    }
    if (shot === "SH03") {
      const move = cameraProgress(11.5);
      setCamera(shot, centerX + 115 * move, centerY - 72 * move, 1 + 0.07 * move);
      layer.renderAtTime(t);
    }
    if (shot === "SH04") {
      const move = cameraProgress(12.5);
      setCamera(shot, centerX + 105 * move, centerY - 28 * move, 1 + 0.14 * move);
      const look = smoothstep(3.5, 6.3, t);
      showPoseFrame(kongFrames, t * 3 * gain);
      kongGroup.position.set(4.5 * smoothstep(5, 9, t) * gain, -1.5 * look * gain + Math.sin(t * 0.55) * 0.35 * gain);
      kongGroup.rotation = -0.003 * look * gain;
    }
    if (shot === "SH05") {
      const move = cameraProgress(14.5);
      setCamera(shot, centerX - 48 * move, centerY - 14 * move, 1 + 0.055 * move);
      const departure = smoothstep(3.5, 13, t);
      observerGroup.scale.set(1 + 0.004 * departure * gain);
      observerGroup.position.set(observer.x - 4 * departure * gain, observer.y + 1.5 * departure * gain);
      showPoseFrame(farBoyFrames, t * 2.5 * gain);
      farGroup.position.set(-3 * departure * gain, -2.5 * departure * gain);
    }
    if (shot === "SH06") {
      const move = cameraProgress(12);
      setCamera(shot, centerX + 300 * move, centerY - 185 * move, 1 + 0.12 * move);
      treeGroup.position.set(treeBoy.x, treeBoy.y - 2.2 * smoothstep(2.5, 10.5, t) * gain);
      treeGroup.rotation = Math.sin(t * 0.55) * 0.003 * gain;
    }
    if (shot === "SH07") {
      const move = cameraProgress(9.5);
      setCamera(shot, centerX + 270 * move, centerY - 205 * move, 1 + 0.12 * move);
      finalBoyGroup.y = -2.2 * Math.sin(t * 0.55) * gain;
      black.alpha = smoothstep(11.9, 13, t);
    }
  };

  const renderAtFrame = (frameValue: number): void => {
    const address = locateFrame(frameValue);
    currentFrame = address.frame;
    currentShot = address.shot.id as ShotId;
    currentTime = address.localTime;
    for (const [id, node] of shotRoots) {
      node.visible = false;
      node.alpha = 1;
    }

    const currentRoot = shotRoots.get(currentShot)!;
    currentRoot.visible = true;
    let outgoingAnimation: { shot: ShotId; time: number } | null = null;

    if (address.shotIndex > 0 && address.localFrame < TRANSITION_FRAMES) {
      const outgoingShot = SHOTS[address.shotIndex - 1]!.id as ShotId;
      const outgoingFrame = SHOTS[address.shotIndex - 1]!.end_frame_exclusive - TRANSITION_FRAMES + address.localFrame;
      const outgoingAddress = locateFrame(outgoingFrame);
      const mix = smoothstep(0, TRANSITION_FRAMES, address.localFrame);
      const outgoingRoot = shotRoots.get(outgoingShot)!;
      outgoingRoot.visible = true;
      outgoingRoot.alpha = 1 - mix;
      currentRoot.alpha = mix;
      outgoingAnimation = { shot: outgoingShot, time: outgoingAddress.localTime };
    }
    originalModeUpdate();
    animateShot(currentShot, currentTime, motionIntensity);
    if (outgoingAnimation) animateShot(outgoingAnimation.shot, outgoingAnimation.time, motionIntensity);
    maskDebug();
  };

  renderAtFrame(0);
  return {
    root,
    renderAtFrame,
    renderAtTime: (seconds) => renderAtFrame(Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(seconds * FPS)))),
    setSourceMode: (mode) => { sourceMode = mode; renderAtFrame(currentFrame); },
    setMotionIntensity: (value) => { motionIntensity = Math.max(0, Math.min(1.5, value)); renderAtFrame(currentFrame); },
    setMasksVisible: (visible) => { masksVisible = visible; renderAtFrame(currentFrame); },
    setLayerVisible: (name, visible) => {
      if (name === "background") backgroundsVisible = visible;
      else charactersVisible = visible;
      renderAtFrame(currentFrame);
    },
    activeShot: () => ({ id: currentShot, localTime: currentTime, frame: currentFrame }),
    destroy: () => {
      root.destroy({ children: true });
    },
  };
}
