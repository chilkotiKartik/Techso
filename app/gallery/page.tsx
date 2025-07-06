"use client"

import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Sparkles } from "@react-three/drei"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SpaceBackground } from "@/components/space-background"
import {
  Rocket,
  Satellite,
  Cpu,
  Brain,
  Zap,
  Eye,
  Heart,
  Share2,
  Download,
  Play,
  Pause,
  RotateCcw,
  Maximize,
} from "lucide-react"

// 3D Model Components
function DroneModel({ position, rotation, scale = 1, isActive = false }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial color={isActive ? "#3b82f6" : "#6b7280"} />
        {/* Propellers */}
        <mesh position={[0.8, 0.3, 0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-0.8, 0.3, 0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0.8, 0.3, -0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-0.8, 0.3, -0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </mesh>
    </Float>
  )
}

function SatelliteModel({ position, rotation, scale = 1, isActive = false }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <group position={position} rotation={rotation} scale={scale}>
        {/* Main body */}
        <mesh>
          <boxGeometry args={[1.5, 2, 1]} />
          <meshStandardMaterial color={isActive ? "#10b981" : "#6b7280"} />
        </mesh>
        {/* Solar panels */}
        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#1e40af" />
        </mesh>
        <mesh position={[-2, 0, 0]}>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#1e40af" />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
    </Float>
  )
}

function RobotModel({ position, rotation, scale = 1, isActive = false }) {
  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.4}>
      <group position={position} rotation={rotation} scale={scale}>
        {/* Head */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color={isActive ? "#8b5cf6" : "#6b7280"} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1.5, 0.8]} />
          <meshStandardMaterial color={isActive ? "#8b5cf6" : "#6b7280"} />
        </mesh>
        {/* Arms */}
        <mesh position={[0.8, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <mesh position={[-0.8, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.2, 1.6, 0.4]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.2, 1.6, 0.4]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

function SpaceStationModel({ position, rotation, scale = 1, isActive = false }) {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={position} rotation={rotation} scale={scale}>
        {/* Central hub */}
        <mesh>
          <cylinderGeometry args={[1, 1, 3]} />
          <meshStandardMaterial color={isActive ? "#f59e0b" : "#6b7280"} />
        </mesh>
        {/* Rotating sections */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[2, 0.3, 8, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.2, 8, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {/* Docking ports */}
        <mesh position={[0, 0, 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0, 0, -2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
    </Float>
  )
}

// Project data with 3D models
const projects3D = [
  {
    id: "ai-drone",
    title: "AI-Powered Surveillance Drone",
    description: "Autonomous drone with computer vision for smart monitoring and security applications.",
    author: "Swastik Joshi",
    category: "Robotics",
    model: DroneModel,
    position: [-4, 0, 0],
    stats: { likes: 234, views: 1250, downloads: 89 },
    tags: ["AI", "Robotics", "Computer Vision", "Autonomous Systems"],
  },
  {
    id: "satellite-comm",
    title: "Satellite Communication System",
    description: "Advanced satellite communication network for remote area connectivity and data transmission.",
    author: "Aishwarya Maan Srivastava",
    category: "Space Tech",
    model: SatelliteModel,
    position: [0, 2, -4],
    stats: { likes: 189, views: 980, downloads: 67 },
    tags: ["Satellite", "Communication", "Space Tech", "IoT"],
  },
  {
    id: "medical-robot",
    title: "Medical Assistant Robot",
    description: "Intelligent robot for healthcare assistance and patient monitoring in hospitals.",
    author: "Ghantasala Dhruvann",
    category: "Healthcare",
    model: RobotModel,
    position: [4, 0, 0],
    stats: { likes: 312, views: 1680, downloads: 134 },
    tags: ["Healthcare", "Robotics", "AI", "Medical Technology"],
  },
  {
    id: "space-station",
    title: "Modular Space Station",
    description: "Next-generation modular space station design for extended space missions and research.",
    author: "Meet Parmar",
    category: "Space Engineering",
    model: SpaceStationModel,
    position: [0, -2, 4],
    stats: { likes: 267, views: 1450, downloads: 92 },
    tags: ["Space", "Engineering", "Modular Design", "Research"],
  },
]

export default function GalleryPage() {
  const [selectedProject, setSelectedProject] = useState(projects3D[0])
  const [isPlaying, setIsPlaying] = useState(true)
  const [cameraPosition, setCameraPosition] = useState([8, 5, 8])
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())

  const handleLike = (projectId: string) => {
    setLikedProjects((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const resetCamera = () => {
    setCameraPosition([8, 5, 8])
  }

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">3D Interactive Gallery</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-6">
            Project{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Gallery</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Explore our innovative projects in an immersive 3D environment. Interact with models, discover features, and
            experience the future of technology.
          </p>
        </motion.div>

        {/* Main Gallery */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-[600px] bg-gradient-to-br from-slate-900 to-slate-800">
                    <Canvas camera={{ position: cameraPosition, fov: 60 }}>
                      <ambientLight intensity={0.4} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <pointLight position={[-10, -10, -10]} intensity={0.5} />
                      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={1} />

                      <Suspense fallback={null}>
                        {projects3D.map((project) => {
                          const ModelComponent = project.model
                          return (
                            <ModelComponent
                              key={project.id}
                              position={project.position}
                              rotation={[0, 0, 0]}
                              scale={project.id === selectedProject.id ? 1.2 : 0.8}
                              isActive={project.id === selectedProject.id}
                            />
                          )
                        })}

                        {/* Floating particles */}
                        <Sparkles count={50} scale={10} size={2} speed={0.5} />

                        {/* Environment */}
                        <Environment preset="night" />
                      </Suspense>

                      <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        autoRotate={isPlaying}
                        autoRotateSpeed={0.5}
                      />
                    </Canvas>

                    {/* Controls Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-black/50 hover:bg-black/70 text-white"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={resetCamera}
                        className="bg-black/50 hover:bg-black/70 text-white"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" className="bg-black/50 hover:bg-black/70 text-white">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Project Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <Card className="bg-black/50 backdrop-blur-sm border-white/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <h3 className="text-lg font-bold mb-1">{selectedProject.title}</h3>
                              <p className="text-sm text-gray-300 mb-2">{selectedProject.description}</p>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1">
                                  <Heart
                                    className={`h-3 w-3 ${
                                      likedProjects.has(selectedProject.id) ? "fill-red-500 text-red-500" : ""
                                    }`}
                                  />
                                  {selectedProject.stats.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {selectedProject.stats.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {selectedProject.stats.downloads}
                                </span>
                              </div>
                            </div>
                            <Badge className="bg-primary/90 text-white">{selectedProject.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Featured Projects</h2>
            {projects3D.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedProject.id === project.id
                      ? "bg-primary/10 border-primary/50 shadow-lg"
                      : "bg-card/50 backdrop-blur-sm border-border/50"
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white">
                        {project.category === "Robotics" && <Rocket className="h-6 w-6" />}
                        {project.category === "Space Tech" && <Satellite className="h-6 w-6" />}
                        {project.category === "Healthcare" && <Brain className="h-6 w-6" />}
                        {project.category === "Space Engineering" && <Cpu className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{project.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLike(project.id)
                              }}
                            >
                              <Heart
                                className={`h-3 w-3 ${
                                  likedProjects.has(project.id) ? "fill-red-500 text-red-500" : ""
                                }`}
                              />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Gallery Stats */}
            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 mt-8">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Gallery Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{projects3D.length}</div>
                    <div className="text-xs text-muted-foreground">3D Models</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">
                      {projects3D.reduce((acc, p) => acc + p.stats.views, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-500">
                      {projects3D.reduce((acc, p) => acc + p.stats.likes, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Likes</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-500">
                      {projects3D.reduce((acc, p) => acc + p.stats.downloads, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Downloads</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 inline-block">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">How to Navigate</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    🖱️
                  </div>
                  <p>Click and drag to rotate the view</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    🔍
                  </div>
                  <p>Scroll to zoom in and out</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    👆
                  </div>
                  <p>Click projects to focus and explore</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
