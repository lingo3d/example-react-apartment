import {
  Cube,
  FirstPersonCamera,
  Joystick,
  Model,
  usePreload,
  useWindowSize,
  World,
  types,
  keyboard,
  TweakPane,
  PaneInput,
} from "lingo3d-react";
import { useEffect, useRef, useState } from "react";

const Game = () => {
  // when window width is smaller than window height, set camera FOV to 100
  // 当窗口宽度小于窗口高度时，设置相机 FOV 为 100
  const windowSize = useWindowSize();
  const fov = windowSize.width > windowSize.height ? 75 : 100;

  // ambient occlusion and bloom toggles
  // 环境光遮蔽和辉光开关
  const [ambientOcclusion, setAmbientOcclusion] = useState(true);
  const [bloom, setBloom] = useState(true);

  const characterRef = useRef<types.Cube>(null);

  // keyboard controls
  // 键盘控制
  useEffect(() => {
    const character = characterRef.current;
    if (!character) return;

    keyboard.onKeyPress = (key) => {
      if (key === "w") character.moveForward(-5);
      else if (key === "s") character.moveForward(5);
      else if (key === "d") character.moveRight(-5);
      else if (key === "a") character.moveRight(5);
    };
  }, []);

  return (
    <World
      defaultLight="studio"
      exposure={bloom ? 0.7 : 1}
      bloom={bloom}
      bloomStrength={0.3}
      bloomThreshold={0.8}
      ambientOcclusion={ambientOcclusion}
      skybox="skybox.jpg"
    >
      {/* room model */}
      {/* 房间模型 */}
      <Model
        pbr
        metalnessFactor={0.3}
        roughnessFactor={0.5}
        physics="map"
        scale={8}
        src="gallery.glb"
      />

      {/* character cube, and the camera that tracks it */}
      {/* 角色立方体，以及追踪角色的第一人称相机 */}
      <FirstPersonCamera active mouseControl fov={fov}>
        <Cube
          ref={characterRef}
          // character height is 185cm
          // 角色身高是 185cm
          height={185}
          y={-200}
          physics="character"
          visible={false}
        />
      </FirstPersonCamera>

      {/* options panel */}
      {/* 选项面板 */}
      <TweakPane>
        <PaneInput
          name="ambientOcclusion"
          value={ambientOcclusion}
          onChange={setAmbientOcclusion}
        />
        <PaneInput name="bloom" value={bloom} onChange={setBloom} />
      </TweakPane>

      {/* virtual joystick */}
      {/* 虚拟摇杆 */}
      <Joystick
        onPress={(e) => {
          const character = characterRef.current;
          if (!character) return;

          character.moveForward(-e.y * 5);
          character.moveRight(-e.x * 5);
        }}
      />
    </World>
  );
};

// Loading screen
// 加载画面
const App = () => {
  const progress = usePreload(["gallery.glb", "skybox.jpg"], "3.5mb");

  if (progress < 100)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          left: 0,
          top: 0,
          background: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        loading {Math.round(progress)}%
      </div>
    );

  return <Game />;
};

export default App;
