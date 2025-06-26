"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SpaceBackground } from "@/components/space-background"
import { Users, Mail, Github, Linkedin, Award, Star } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  year?: string
  domain: string
  bio: string
  avatar: string
  achievements: string[]
  projects: string[]
  skills: string[]
  stats: {
    projects: number
    contributions: number
    points: number
    rank: number
  }
  social: {
    email: string
    github?: string
    linkedin?: string
    twitter?: string
  }
  isActive: boolean
}

const teamMembers: TeamMember[] = [
  {
    id: "admin-1",
    name: "Dr. Sarah Johnson",
    role: "Platform Administrator",
    department: "Computer Science",
    domain: "Research Direction & Platform Management",
    bio: "Leading the Infinity Tech Society with a vision to foster innovation and collaboration among students. Passionate about AI research and educational technology.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=300&auto=format&fit=crop",
    achievements: ["Research Excellence", "Innovation Leader", "Platform Creator", "Mentor of the Year"],
    projects: ["Platform Development", "Research Coordination", "Student Mentorship"],
    skills: ["Leadership", "Research", "AI/ML", "Education Technology", "Project Management"],
    stats: {
      projects: 15,
      contributions: 200,
      points: 1000,
      rank: 1,
    },
    social: {
      email: "admin@infinity.edu",
      linkedin: "sarah-johnson",
      twitter: "drsarahjohnson",
    },
    isActive: true,
  },
  {
    id: "student-1",
    name: "Aishwarya Maan Srivastava",
    role: "Research Lead",
    department: "Data Science",
    year: "2nd Year",
    domain: "Cultural Drift NLP",
    bio: "Passionate about Natural Language Processing and Cultural Studies. Leading research on how language evolves in digital spaces and its cultural implications.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=300&auto=format&fit=crop",
    achievements: ["NLP Pioneer", "Team Leader", "Research Excellence", "Cultural Impact Award"],
    projects: ["Cultural Drift NLP", "Language Evolution Analysis", "Social Media Linguistics"],
    skills: ["NLP", "Python", "TensorFlow", "Cultural Studies", "Research", "Team Leadership"],
    stats: {
      projects: 3,
      contributions: 45,
      points: 750,
      rank: 5,
    },
    social: {
      email: "24f1001450@ds.study.iitm.ac.in",
      github: "aishwarya-nlp",
      linkedin: "aishwarya-srivastava",
    },
    isActive: true,
  },
  {
    id: "student-2",
    name: "Rudra Narayan Meher",
    role: "AI Researcher",
    department: "Data Science",
    year: "3rd Year",
    domain: "Language Loss Rebuilder",
    bio: "Working on preserving endangered languages through AI. Passionate about using technology to preserve cultural heritage and linguistic diversity.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    achievements: ["Language Preservationist", "AI Innovator", "Cultural Impact", "Research Pioneer"],
    projects: ["Language Loss Rebuilder", "Endangered Language Database", "Cultural Preservation AI"],
    skills: ["AI/ML", "Linguistics", "Python", "Deep Learning", "Cultural Studies", "Research"],
    stats: {
      projects: 4,
      contributions: 38,
      points: 680,
      rank: 8,
    },
    social: {
      email: "24f3001430@ds.study.iitm.ac.in",
      github: "rudra-language-ai",
      linkedin: "rudra-meher",
    },
    isActive: true,
  },
  {
    id: "student-3",
    name: "Krishna Vallabha Goswami",
    role: "Legal Tech Developer",
    department: "Data Science",
    year: "3rd Year",
    domain: "Contract Summarizer",
    bio: "Specializing in Legal Tech and AI applications. Building intelligent systems to make legal documents more accessible and understandable.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    achievements: ["Legal Tech Pioneer", "AI Developer", "Innovation Award", "Problem Solver"],
    projects: ["Contract Summarizer", "Legal Document AI", "Compliance Checker"],
    skills: ["Legal Tech", "NLP", "Python", "Machine Learning", "Document Analysis", "AI Ethics"],
    stats: {
      projects: 3,
      contributions: 42,
      points: 720,
      rank: 6,
    },
    social: {
      email: "23f3002697@ds.study.iitm.ac.in",
      github: "krishna-legal-ai",
      linkedin: "krishna-goswami",
    },
    isActive: true,
  },
  {
    id: "student-4",
    name: "Satyam Singh",
    role: "AI Optimization Specialist",
    department: "Data Science",
    year: "3rd Year",
    domain: "Prompt Feedback Tuner",
    bio: "Focused on AI optimization and prompt engineering. Working to make AI systems more efficient and user-friendly through better prompt design.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    achievements: ["Prompt Engineer", "AI Optimizer", "Team Collaborator", "Innovation Award"],
    projects: ["Prompt Feedback Tuner", "AI Efficiency Optimizer", "Smart Prompt Generator"],
    skills: ["Prompt Engineering", "AI Optimization", "Python", "Machine Learning", "Performance Tuning"],
    stats: {
      projects: 3,
      contributions: 35,
      points: 650,
      rank: 9,
    },
    social: {
      email: "24f3003062@ds.study.iitm.ac.in",
      github: "satyam-ai-optimizer",
      linkedin: "satyam-singh-ai",
    },
    isActive: true,
  },
  {
    id: "student-5",
    name: "Swastik Joshi",
    role: "Fluid Dynamics Researcher",
    department: "Data Science",
    year: "3rd Year",
    domain: "Turbulence Generator GAN",
    bio: "Researching fluid dynamics and generative AI models. Combining physics and AI to create realistic simulations for engineering applications.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    achievements: ["GAN Expert", "Fluid Dynamics Researcher", "Team Leader", "Physics AI Pioneer"],
    projects: ["Turbulence Generator GAN", "Fluid Simulation AI", "Physics-ML Integration"],
    skills: ["GANs", "Fluid Dynamics", "Physics", "Deep Learning", "Simulation", "Team Leadership"],
    stats: {
      projects: 4,
      contributions: 48,
      points: 780,
      rank: 4,
    },
    social: {
      email: "24f3000782@ds.study.iitm.ac.in",
      github: "swastik-fluid-ai",
      linkedin: "swastik-joshi",
    },
    isActive: true,
  },
  {
    id: "student-6",
    name: "Ghantasala Dhruvann",
    role: "Healthcare AI Developer",
    department: "Data Science",
    year: "2nd Year",
    domain: "Digital Body Twin",
    bio: "Creating digital twins for medical applications. Passionate about using AI to revolutionize healthcare and personalized medicine.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    achievements: ["Healthcare Innovator", "Digital Twin Pioneer", "Medical AI", "Rising Star"],
    projects: ["Digital Body Twin", "Medical Simulation AI", "Personalized Healthcare"],
    skills: ["Healthcare AI", "Digital Twins", "Medical Imaging", "Python", "Deep Learning", "Biomedical Engineering"],
    stats: {
      projects: 3,
      contributions: 52,
      points: 820,
      rank: 3,
    },
    social: {
      email: "24f2001880@ds.study.iitm.ac.in",
      github: "dhruvann-medical-ai",
      linkedin: "ghantasala-dhruvann",
    },
    isActive: true,
  },
  {
    id: "student-7",
    name: "Meet Parmar",
    role: "Healthcare Chatbot Developer",
    department: "Data Science",
    year: "3rd Year",
    domain: "Medical Symptom Chatbot",
    bio: "Developing AI solutions for healthcare diagnostics. Building intelligent chatbots to make healthcare more accessible and efficient.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    achievements: ["Healthcare AI", "Chatbot Developer", "Medical Innovation", "User Experience Award"],
    projects: ["Medical Symptom Chatbot", "Healthcare Assistant AI", "Diagnostic Support System"],
    skills: ["Healthcare AI", "Chatbots", "NLP", "Medical Knowledge", "User Experience", "Python"],
    stats: {
      projects: 3,
      contributions: 40,
      points: 690,
      rank: 7,
    },
    social: {
      email: "23f2003869@ds.study.iitm.ac.in",
      github: "meet-healthcare-ai",
      linkedin: "meet-parmar-ai",
    },
    isActive: true,
  },
  {
    id: "student-8",
    name: "Yukti Sharma",
    role: "Biology AI Researcher",
    department: "Data Science",
    year: "1st Year",
    domain: "Evolution Path Modeler",
    bio: "Modeling evolutionary pathways using AI and genetics. Combining biology and technology to understand life's complexity.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
    achievements: ["Biology Researcher", "Genetics Expert", "Evolution Modeler", "Young Innovator"],
    projects: ["Evolution Path Modeler", "Genetic Analysis AI", "Biological Pattern Recognition"],
    skills: ["Biology", "Genetics", "Evolution", "AI Modeling", "Bioinformatics", "Research"],
    stats: {
      projects: 2,
      contributions: 28,
      points: 760,
      rank: 2,
    },
    social: {
      email: "25f1000368@ds.study.iitm.ac.in",
      github: "yukti-bio-ai",
      linkedin: "yukti-sharma-bio",
    },
    isActive: true,
  },
]

const departments = ["All", "Computer Science", "Data Science", "Administration"]
const roles = ["All", "Administrator", "Research Lead", "AI Researcher", "Developer", "Specialist"]

export default function TeamPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedRole, setSelectedRole] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = teamMembers.filter((member) => {
    const matchesDepartment = selectedDepartment === "All" || member.department === selectedDepartment
    const matchesRole = selectedRole === "All" || member.role.includes(selectedRole)
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesDepartment && matchesRole && matchesSearch
  })

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
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Mission Minds</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-6">
            Our <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Team</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Meet the brilliant minds behind Infinity Tech Society. Our diverse team of researchers, developers, and
            innovators are pushing the boundaries of technology and creating solutions for tomorrow.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search team members, skills, or domains..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full">
                {/* Header with Avatar */}
                <div className="relative p-6 pb-0">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20 border-4 border-primary/20">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-lg font-bold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {member.isActive && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-primary font-medium text-sm mb-1">{member.role}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{member.department}</span>
                        {member.year && (
                          <>
                            <span>•</span>
                            <span>{member.year}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Domain */}
                  <div className="mb-4">
                    <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">{member.domain}</Badge>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">{member.stats.projects}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-green-500">{member.stats.points}</div>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Achievements
                    </h4>
                    <div className="space-y-1">
                      {member.achievements.slice(0, 2).map((achievement) => (
                        <div key={achievement} className="flex items-center gap-2 text-xs">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-muted-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                        <a href={`mailto:${member.social.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                      {member.social.github && (
                        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                          <a
                            href={`https://github.com/${member.social.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.social.linkedin && (
                        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                          <a
                            href={`https://linkedin.com/in/${member.social.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Rank #{member.stats.rank}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Stats */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Team Impact</h2>
                <p className="text-muted-foreground">Collective achievements and contributions</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {teamMembers.reduce((acc, member) => acc + member.stats.projects, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {teamMembers.reduce((acc, member) => acc + member.stats.contributions, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Contributions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">{teamMembers.length}</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {new Set(teamMembers.flatMap((member) => member.skills)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Unique Skills</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
