import { AreaLight, Cube, FirstPersonCamera, Joystick, Model, Skybox, useKeyboard, useLoop, usePreload, useWindowSize, World } from "lingo3d-react"
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
    <World defaultOrbitControls defaultLight={false} ambientOcclusion bloom bloomStrength={0.2}>
      <Model src="gallery.glb" scale={8} physics="map" />
      <FirstPersonCamera active mouseControl fov={fov}>
        <Cube ref={characterRef} height={185} y={-200} innerY={500} rotationY={180} physics="character" visible={false} />
      </FirstPersonCamera>
      <AreaLight z={650} intensity={1.5} />
      <AreaLight z={-650} rotationY={180} intensity={0.75} />
      <AreaLight x={650} rotationY={90} intensity={0.75} />
      <AreaLight x={-650} rotationY={-90} intensity={0.75} />
      <Skybox texture="skybox.jpg" />
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
