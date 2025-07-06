"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowRight,
  Rocket,
  Users,
  ChevronDown,
  Sparkles,
  Award,
  Lightbulb,
  Brain,
  Activity,
  Code,
  Star,
  MessageSquare,
  Microscope,
  Cpu,
  Database,
  Shield,
  Bell,
  Layers,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  Eye,
  Play,
  Heart,
  Share2,
  Download,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { SpaceBackground } from "@/components/space-background"
import { SpaceParticles } from "@/components/space-particles"
import { FloatingAstronaut } from "@/components/floating-astronaut"

export default function Home() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [hoveredDomain, setHoveredDomain] = useState<number | null>(null)
  const [liveStats, setLiveStats] = useState({
    students: 0,
    projects: 0,
    papers: 0,
    innovations: 0,
  })
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())

  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true })

  // Featured student projects with photos
  const featuredProjects = [
    {
      id: "cultural-drift-nlp",
      title: "Cultural Drift NLP",
      description: "AI system analyzing cultural evolution patterns in digital communications",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
      author: "Aishwarya Maan Srivastava",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
      domain: "NLP",
      progress: 85,
      likes: 234,
      views: 1250,
      downloads: 89,
      tags: ["NLP", "Cultural Analysis", "AI"],
    },
    {
      id: "ai-healthcare",
      title: "Medical AI Assistant",
      description: "Advanced AI system for medical diagnosis and patient care assistance",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
      author: "Meet Parmar",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      domain: "Healthcare AI",
      progress: 92,
      likes: 189,
      views: 980,
      downloads: 67,
      tags: ["Healthcare", "AI", "Medical"],
    },
    {
      id: "quantum-computing",
      title: "Quantum Algorithm Simulator",
      description: "Quantum computing simulator for educational and research purposes",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
      author: "Swastik Joshi",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      domain: "Quantum Computing",
      progress: 78,
      likes: 156,
      views: 750,
      downloads: 45,
      tags: ["Quantum", "Simulation", "Research"],
    },
  ]

  // Interactive features showcase
  const interactiveFeatures = [
    {
      id: "live-workspace",
      title: "Live Collaboration Workspace",
      description: "Real-time chat, project sharing, and team collaboration tools with instant notifications",
      icon: <MessageSquare className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500",
      stats: "500+ Active Users",
      demo: "Try Live Chat",
      link: "/student/workspace",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "ai-projects",
      title: "AI-Powered Project Hub",
      description: "Smart project management with AI assistance, automated workflows, and intelligent recommendations",
      icon: <Brain className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
      stats: "150+ AI Projects",
      demo: "Explore Projects",
      link: "/projects",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "research-lab",
      title: "Virtual Research Lab",
      description: "Advanced research tools, paper collaboration, publication support, and peer review system",
      icon: <Microscope className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500",
      stats: "25+ Research Papers",
      demo: "Visit Lab",
      link: "/research",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "achievement-system",
      title: "Gamified Achievement System",
      description: "Earn points, unlock badges, compete with peers, and track your innovation journey",
      icon: <Award className="h-8 w-8" />,
      color: "from-orange-500 to-red-500",
      stats: "100+ Achievements",
      demo: "View Achievements",
      link: "/student/achievements",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    },
  ]

  // Technology domains with interactive elements
  const techDomains = [
    {
      name: "Artificial Intelligence",
      icon: <Brain className="h-8 w-8" />,
      projects: 45,
      color: "from-blue-500 to-cyan-500",
      description: "Machine Learning, Deep Learning, Neural Networks",
      trending: "+15% this month",
      students: 120,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Natural Language Processing",
      icon: <MessageSquare className="h-8 w-8" />,
      projects: 28,
      color: "from-green-500 to-emerald-500",
      description: "Text Analysis, Language Models, Chatbots",
      trending: "+8% this month",
      students: 85,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Healthcare Technology",
      icon: <Activity className="h-8 w-8" />,
      projects: 32,
      color: "from-red-500 to-pink-500",
      description: "Medical AI, Digital Health, Biotech",
      trending: "+12% this month",
      students: 95,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Data Science",
      icon: <Database className="h-8 w-8" />,
      projects: 38,
      color: "from-purple-500 to-violet-500",
      description: "Analytics, Visualization, Big Data",
      trending: "+10% this month",
      students: 110,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Cybersecurity",
      icon: <Shield className="h-8 w-8" />,
      projects: 22,
      color: "from-gray-500 to-slate-500",
      description: "Security Analysis, Threat Detection, Encryption",
      trending: "+18% this month",
      students: 75,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "IoT & Embedded Systems",
      icon: <Cpu className="h-8 w-8" />,
      projects: 35,
      color: "from-orange-500 to-amber-500",
      description: "Smart Devices, Sensors, Edge Computing",
      trending: "+6% this month",
      students: 90,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop",
    },
  ]

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % interactiveFeatures.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Animate live stats
  useEffect(() => {
    const animateStats = () => {
      setLiveStats({
        students: Math.floor(Math.random() * 50) + 450,
        projects: Math.floor(Math.random() * 20) + 130,
        papers: Math.floor(Math.random() * 10) + 20,
        innovations: Math.floor(Math.random() * 15) + 35,
      })
    }

    animateStats()
    const interval = setInterval(animateStats, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsNewsletterSubmitting(true)
    setTimeout(() => {
      toast({
        title: "Welcome to Infinity! 🚀",
        description: "You're now part of our revolutionary tech community!",
      })
      setEmail("")
      setIsNewsletterSubmitting(false)
    }, 1500)
  }

  const handleLikeProject = (projectId: string) => {
    setLikedProjects((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })

    toast({
      title: likedProjects.has(projectId) ? "Like removed" : "Project Liked! ⭐",
      description: likedProjects.has(projectId) ? "Removed from favorites" : "Added to your favorites",
    })
  }

  return (
    <div className="relative overflow-hidden">
      {/* Enhanced Hero Section */}
      <div ref={targetRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <SpaceBackground />
        <SpaceParticles />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={heroRef}
            className="text-center max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Hero Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-8 py-3 mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium">IIT Madras Innovation Hub</span>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-space mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="block bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Infinity
              </span>
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Tech Society
              </span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
              className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Where <span className="text-primary font-semibold">IIT Madras students</span> build the{" "}
              <span className="text-purple-400 font-semibold">future</span>. Join our vibrant community of tech
              innovators creating groundbreaking research projects and solutions.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              {!user ? (
                <>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-2xl shadow-primary/25 transform hover:scale-105 transition-all duration-300"
                    >
                      <Rocket className="mr-3 h-6 w-6" />
                      Join the Innovation
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-10 py-6 text-lg border-2 border-primary/50 hover:bg-primary/10 backdrop-blur-sm"
                    >
                      <Lightbulb className="mr-3 h-6 w-6" />
                      Learn More
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-2xl shadow-primary/25 transform hover:scale-105 transition-all duration-300"
                    >
                      <Rocket className="mr-3 h-6 w-6" />
                      Continue Journey
                    </Button>
                  </Link>
                  <Link href="/student/workspace">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-10 py-6 text-lg border-2 border-primary/50 hover:bg-primary/10 backdrop-blur-sm"
                    >
                      <MessageSquare className="mr-3 h-6 w-6" />
                      Live Workspace
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/research">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Microscope className="mr-3 h-6 w-6" />
                  Research Hub
                </Button>
              </Link>
            </motion.div>

            {/* Live Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              {[
                {
                  icon: <Users className="h-6 w-6" />,
                  value: liveStats.students.toString(),
                  label: "Active Students",
                  suffix: "+",
                  color: "text-blue-400",
                },
                {
                  icon: <Code className="h-6 w-6" />,
                  value: liveStats.projects.toString(),
                  label: "Live Projects",
                  suffix: "+",
                  color: "text-green-400",
                },
                {
                  icon: <BookOpen className="h-6 w-6" />,
                  value: liveStats.papers.toString(),
                  label: "Research Papers",
                  suffix: "+",
                  color: "text-purple-400",
                },
                {
                  icon: <Award className="h-6 w-6" />,
                  value: liveStats.innovations.toString(),
                  label: "Innovations",
                  suffix: "+",
                  color: "text-orange-400",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`${stat.color} mb-3 flex justify-center group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <motion.div
                    className="text-3xl sm:text-4xl font-bold text-white mb-2"
                    key={stat.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.value}
                    {stat.suffix}
                  </motion.div>
                  <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Astronaut */}
        <div className="absolute right-[5%] top-[20%] hidden lg:block">
          <FloatingAstronaut />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
        </motion.div>
      </div>

      {/* Featured Student Projects */}
      <div className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2">
              <Star className="h-5 w-5 mr-2" />
              Featured Projects
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-8">
              Student{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Innovations
              </span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-4xl mx-auto leading-relaxed">
              Discover groundbreaking projects created by IIT Madras students. From AI-powered solutions to innovative
              applications, these projects are shaping the future of technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group bg-card/50 backdrop-blur-sm rounded-2xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-white">{project.domain}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={project.authorAvatar || "/placeholder.svg"}
                        alt={project.author}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{project.author}</h4>
                      <p className="text-muted-foreground text-xs">Project Lead</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.progress}%</p>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart
                          className={`h-3 w-3 ${likedProjects.has(project.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {project.likes + (likedProjects.has(project.id) ? 1 : 0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {project.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {project.downloads}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleLikeProject(project.id)}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${likedProjects.has(project.id) ? "fill-current text-red-500" : ""}`}
                      />
                      {likedProjects.has(project.id) ? "Liked" : "Like"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Link href={`/projects/${project.id}`}>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/projects">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-4">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Features Showcase */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-secondary/10 text-secondary-foreground border-secondary/20 text-lg px-6 py-2">
              <Zap className="h-5 w-5 mr-2" />
              Interactive Platform
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-8">
              Experience{" "}
              <span className="bg-gradient-to-r from-secondary to-orange-500 bg-clip-text text-transparent">
                Next-Gen Learning
              </span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-4xl mx-auto leading-relaxed">
              Immerse yourself in our cutting-edge platform designed for modern innovators. Real-time collaboration,
              AI-powered tools, and gamified learning experiences.
            </p>
          </motion.div>

          {/* Interactive Feature Display */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Feature Showcase */}
            <motion.div
              className="relative"
              key={activeFeature}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-primary/20 overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={interactiveFeatures[activeFeature].image || "/placeholder.svg"}
                    alt={interactiveFeatures[activeFeature].title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-primary/90 text-white mb-2">{interactiveFeatures[activeFeature].stats}</Badge>
                    <h3 className="text-2xl font-bold text-white">{interactiveFeatures[activeFeature].title}</h3>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {interactiveFeatures[activeFeature].description}
                  </p>
                  <div className="flex gap-4">
                    <Link href={interactiveFeatures[activeFeature].link}>
                      <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        {interactiveFeatures[activeFeature].demo}
                      </Button>
                    </Link>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature Navigation */}
            <div className="space-y-4">
              {interactiveFeatures.map((feature, index) => (
                <motion.button
                  key={feature.id}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                    index === activeFeature
                      ? "bg-primary/10 border-primary/50 shadow-xl shadow-primary/20"
                      : "bg-card/50 border-border hover:bg-card/80 hover:border-primary/30"
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg flex-shrink-0`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">{feature.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {feature.stats}
                        </Badge>
                        <span className="text-xs text-primary font-medium">{feature.demo}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technology Domains Section */}
      <div className="py-24 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-purple-600/10 text-purple-600 border-purple-600/20 text-lg px-6 py-2">
              <Layers className="h-5 w-5 mr-2" />
              Research Domains
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-8">
              Cutting-Edge{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Technologies
              </span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-4xl mx-auto leading-relaxed">
              Explore the diverse technology domains where our students are making breakthrough innovations and
              contributing to the future of technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {techDomains.map((domain, index) => (
              <motion.div
                key={domain.name}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredDomain(index)}
                onHoverEnd={() => setHoveredDomain(null)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={domain.image || "/placeholder.svg"}
                    alt={domain.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${domain.color} text-white mb-3 shadow-lg`}
                    >
                      {domain.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{domain.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4 leading-relaxed">{domain.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        {domain.projects} Active Projects
                      </Badge>
                      <span className="text-sm text-green-600 font-medium">{domain.trending}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {domain.students} Students
                      </span>
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Growing
                      </span>
                    </div>

                    <motion.div
                      className="w-full bg-muted rounded-full h-2 overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    >
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${domain.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(domain.projects / 50) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                      />
                    </motion.div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`mt-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      hoveredDomain === index ? "translate-x-2" : ""
                    } transition-transform duration-300`}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Explore Domain
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2">
              <Star className="h-5 w-5 mr-2" />
              Join Our Community
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold font-space mb-8">Stay Connected with Innovation</h2>
            <p className="text-muted-foreground text-xl mb-12 leading-relaxed">
              Subscribe to our newsletter and get the latest updates on student projects, research breakthroughs, and
              innovation opportunities at IIT Madras. Be part of the future of technology.
            </p>

            <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border p-8 mb-8">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your IIT Madras email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full px-6 py-4 text-lg flex-1"
                />
                <Button
                  type="submit"
                  className="rounded-full px-10 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isNewsletterSubmitting}
                >
                  {isNewsletterSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </div>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" />
                      Join Innovation Hub
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                {
                  icon: <Bell className="h-8 w-8" />,
                  title: "Research Updates",
                  description: "Get notified about new research breakthroughs and publications",
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Community Events",
                  description: "Join workshops, hackathons, and networking events",
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Opportunities",
                  description: "Discover internships, collaborations, and research positions",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
