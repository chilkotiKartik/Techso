"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SpaceBackground } from "@/components/space-background"
import {
  BookOpen,
  Search,
  Download,
  ExternalLink,
  Calendar,
  Users,
  Award,
  Brain,
  Microscope,
  Cpu,
  Dna,
  Stethoscope,
  Globe,
  Eye,
  Quote,
} from "lucide-react"

interface ResearchPaper {
  id: string
  title: string
  abstract: string
  authors: string[]
  authorAvatars: string[]
  domain: string
  publishedDate: string
  journal: string
  citations: number
  downloads: number
  views: number
  tags: string[]
  pdfUrl: string
  status: "published" | "under-review" | "draft"
  impact: "high" | "medium" | "low"
  image: string
}

interface ResearchArea {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  papers: number
  researchers: number
  color: string
}

const researchAreas: ResearchArea[] = [
  {
    id: "ai-ml",
    name: "Artificial Intelligence & Machine Learning",
    description: "Advanced AI algorithms, deep learning, and intelligent systems",
    icon: <Brain className="h-6 w-6" />,
    papers: 15,
    researchers: 8,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "nlp",
    name: "Natural Language Processing",
    description: "Language understanding, text analysis, and conversational AI",
    icon: <Globe className="h-6 w-6" />,
    papers: 8,
    researchers: 5,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "healthcare",
    name: "Healthcare Technology",
    description: "Medical AI, digital health, and biomedical engineering",
    icon: <Stethoscope className="h-6 w-6" />,
    papers: 6,
    researchers: 4,
    color: "from-red-500 to-pink-500",
  },
  {
    id: "robotics",
    name: "Robotics & Automation",
    description: "Autonomous systems, robotics, and intelligent automation",
    icon: <Cpu className="h-6 w-6" />,
    papers: 7,
    researchers: 6,
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "biology",
    name: "Computational Biology",
    description: "Bioinformatics, genetics, and evolutionary modeling",
    icon: <Dna className="h-6 w-6" />,
    papers: 4,
    researchers: 3,
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "physics",
    name: "Computational Physics",
    description: "Fluid dynamics, simulations, and physics modeling",
    icon: <Microscope className="h-6 w-6" />,
    papers: 5,
    researchers: 4,
    color: "from-indigo-500 to-blue-500",
  },
]

const researchPapers: ResearchPaper[] = [
  {
    id: "cultural-drift-nlp-paper",
    title: "Cultural Drift Analysis in Digital Communications: A Natural Language Processing Approach",
    abstract:
      "This paper presents a novel approach to analyzing cultural evolution patterns in digital communications using advanced NLP techniques. We introduce a framework for detecting and quantifying cultural drift in social media platforms, providing insights into how language and cultural expressions evolve in digital spaces.",
    authors: ["Aishwarya Maan Srivastava", "Namish Kumar Sahu", "Sayan Ray"],
    authorAvatars: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    ],
    domain: "Natural Language Processing",
    publishedDate: "2024-01-15",
    journal: "Journal of Computational Linguistics",
    citations: 23,
    downloads: 156,
    views: 1250,
    tags: ["NLP", "Cultural Studies", "Social Media", "Machine Learning"],
    pdfUrl: "#",
    status: "published",
    impact: "high",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "language-preservation-ai",
    title: "AI-Driven Language Preservation: Reconstructing Endangered Languages Through Machine Learning",
    abstract:
      "We present an innovative AI system designed to preserve and reconstruct endangered languages. Our approach combines linguistic analysis with deep learning to create comprehensive language models that can help revitalize dying languages and preserve cultural heritage.",
    authors: ["Rudra Narayan Meher", "Linguistic Research Team"],
    authorAvatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
    ],
    domain: "Computational Linguistics",
    publishedDate: "2024-01-28",
    journal: "International Journal of Language Technology",
    citations: 18,
    downloads: 134,
    views: 980,
    tags: ["AI", "Language Preservation", "Deep Learning", "Cultural Heritage"],
    pdfUrl: "#",
    status: "published",
    impact: "high",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "legal-ai-contracts",
    title: "Automated Legal Document Analysis: AI-Powered Contract Summarization and Risk Assessment",
    abstract:
      "This research introduces an advanced AI system for automated legal document analysis, focusing on contract summarization and risk assessment. Our approach achieves 98% accuracy in identifying key contract clauses and potential legal risks.",
    authors: ["Krishna Vallabha Goswami", "Sayan Ray"],
    authorAvatars: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    ],
    domain: "Legal Technology",
    publishedDate: "2024-02-05",
    journal: "AI & Law Review",
    citations: 15,
    downloads: 98,
    views: 750,
    tags: ["Legal Tech", "AI", "Document Analysis", "Risk Assessment"],
    pdfUrl: "#",
    status: "published",
    impact: "medium",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "prompt-optimization",
    title: "Optimizing AI Interactions: A Feedback-Driven Approach to Prompt Engineering",
    abstract:
      "We present a novel framework for optimizing AI prompts through automated feedback loops and performance analysis. Our system demonstrates a 40% improvement in AI response quality and efficiency across various applications.",
    authors: ["Satyam Singh", "Sai Jasmitha Naidu", "Gourav Mandal"],
    authorAvatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    ],
    domain: "AI Optimization",
    publishedDate: "2024-02-10",
    journal: "Machine Learning Research",
    citations: 12,
    downloads: 87,
    views: 1100,
    tags: ["AI Optimization", "Prompt Engineering", "Machine Learning"],
    pdfUrl: "#",
    status: "published",
    impact: "medium",
    image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "turbulence-gan",
    title: "Generative Adversarial Networks for Realistic Turbulence Simulation in Fluid Dynamics",
    abstract:
      "This paper introduces a novel GAN-based approach for generating realistic turbulence patterns in fluid dynamics simulations. Our method achieves unprecedented accuracy in turbulence modeling for engineering applications.",
    authors: ["Swastik Joshi", "Rishi Mehrotra", "Siddharth Malkania", "Meet Parmar"],
    authorAvatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
    ],
    domain: "Computational Physics",
    publishedDate: "2024-01-20",
    journal: "Physics of Fluids",
    citations: 28,
    downloads: 167,
    views: 1450,
    tags: ["GAN", "Fluid Dynamics", "Physics Simulation", "Deep Learning"],
    pdfUrl: "#",
    status: "published",
    impact: "high",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "digital-twin-healthcare",
    title: "Digital Human Body Twins: Personalized Medicine Through Advanced 3D Modeling",
    abstract:
      "We present a groundbreaking approach to personalized medicine using digital human body twins. Our system creates accurate 3D models of individual patients for personalized treatment planning and medical simulation.",
    authors: ["Ghantasala Dhruvann", "Siddharth Malkania", "Rishi Mehrotra", "Sumit Srimani"],
    authorAvatars: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop",
    ],
    domain: "Healthcare Technology",
    publishedDate: "2024-02-15",
    journal: "Nature Digital Medicine",
    citations: 35,
    downloads: 234,
    views: 1680,
    tags: ["Digital Twins", "Healthcare", "3D Modeling", "Personalized Medicine"],
    pdfUrl: "#",
    status: "published",
    impact: "high",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop",
  },
]

export default function ResearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const filteredPapers = researchPapers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.some((author) => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      paper.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDomain = selectedDomain === "All" || paper.domain === selectedDomain
    const matchesStatus = selectedStatus === "All" || paper.status === selectedStatus

    return matchesSearch && matchesDomain && matchesStatus
  })

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500"
      case "under-review":
        return "bg-yellow-500"
      case "draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
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
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Research Hub</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-6">
            Research{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Publications
            </span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Discover cutting-edge research from IIT Madras students. Our publications span multiple domains including
            AI, healthcare, robotics, and computational sciences.
          </p>
        </motion.div>

        {/* Research Areas */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Research Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        {area.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {area.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{area.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {area.papers} Papers
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {area.researchers} Researchers
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search papers, authors, or topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background"
                  >
                    <option value="All">All Domains</option>
                    {Array.from(new Set(researchPapers.map((p) => p.domain))).map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background"
                  >
                    <option value="All">All Status</option>
                    <option value="published">Published</option>
                    <option value="under-review">Under Review</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Research Papers */}
        <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {filteredPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-500 overflow-hidden group">
                <div className="md:flex">
                  {/* Paper Image */}
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <Image
                      src={paper.image || "/placeholder.svg"}
                      alt={paper.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getStatusColor(paper.status)} text-white`}>{paper.status}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className={`${getImpactColor(paper.impact)} border-current`}>
                        {paper.impact} impact
                      </Badge>
                    </div>
                  </div>

                  {/* Paper Content */}
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {paper.title}
                          </CardTitle>
                          <Badge variant="secondary" className="mb-3">
                            {paper.domain}
                          </Badge>
                        </div>
                      </div>

                      {/* Authors */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                          {paper.authorAvatars.slice(0, 3).map((avatar, i) => (
                            <Avatar key={i} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={avatar || "/placeholder.svg"} alt={paper.authors[i]} />
                              <AvatarFallback>
                                {paper.authors[i]
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {paper.authors.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                              +{paper.authors.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{paper.authors.slice(0, 2).join(", ")}</p>
                          {paper.authors.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{paper.authors.length - 2} more authors</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      {/* Abstract */}
                      <div className="mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Quote className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{paper.abstract}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Publication Info */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(paper.publishedDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {paper.journal}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {paper.citations} citations
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {paper.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {paper.views}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Research Stats */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Research Impact</h2>
                <p className="text-muted-foreground">Our collective research contributions and achievements</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{researchPapers.length}</div>
                  <div className="text-sm text-muted-foreground">Published Papers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {researchPapers.reduce((acc, p) => acc + p.citations, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Citations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {researchPapers.reduce((acc, p) => acc + p.downloads, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {researchAreas.reduce((acc, area) => acc + area.researchers, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Researchers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 inline-block">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-3">Join Our Research Community</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Interested in collaborating or contributing to our research? Get in touch with our team.
              </p>
              <div className="flex gap-3 justify-center">
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Join Research Team
                </Button>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Submit Paper
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
