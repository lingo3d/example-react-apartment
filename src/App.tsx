import { Setup, Cube, FirstPersonCamera, Joystick, Model, Skybox, useKeyboard, useLoop, usePreload, useWindowSize, World } from "lingo3d-react"
import { useRef, useState } from "react"

const Game = () => {
  const key = useKeyboard()
  const characterRef = useRef<any>()
  const [joystick, setJoystick] = useState({ x: 0, y: 0, angle: 0 })
  const windowSize = useWindowSize()

  const fov = windowSize.width > windowSize.height ? 75 : 100

  useLoop(() => {
    characterRef.current?.moveForward(-5)
  }, key === "w" || joystick.y < 0)

  return (<>
    <World>
      <Model
        roughnessFactor={0.5}
        physics="map"
        width={160.37}
        depth={138.31}
        scaleX={8}
        scaleY={8}
        scaleZ={8}
        src="gallery.glb"
      />
      <Skybox texture="skybox.jpg" />
      <Setup
        defaultLight="studio"
        exposure={0.6}
        bloom
        bloomStrength={0.2}
        bloomThreshold={0.7}
      />
      <FirstPersonCamera active mouseControl fov={fov}>
        <Cube ref={characterRef} height={185} y={-200} innerY={500} rotationY={180} physics="character" visible={false} />
      </FirstPersonCamera>
    </World>
    <Joystick onMove={setJoystick} onMoveEnd={() => setJoystick({ x:0, y: 0, angle: 0 })} />
  </>)
}

const App = () => {
  const progress = usePreload(["gallery.glb", "skybox.jpg"], "3.5mb")

  if (progress < 100)
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 0,
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}>
        loading {Math.round(progress)}%
      </div>
    )

  return (
    <Game />
  )
}

export default App
