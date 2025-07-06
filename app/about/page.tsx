"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SpaceBackground } from "@/components/space-background"
import {
  Rocket,
  Users,
  Target,
  Globe,
  Brain,
  Lightbulb,
  Heart,
  Star,
  BookOpen,
  Code,
  Microscope,
  Cpu,
  Shield,
  MapPin,
  Mail,
  Phone,
} from "lucide-react"

const milestones = [
  {
    year: "2023",
    title: "Foundation",
    description: "Infinity Tech Society was founded by passionate IIT Madras students",
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    year: "2024",
    title: "First Research Papers",
    description: "Published our first set of research papers in top-tier journals",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    year: "2024",
    title: "Platform Launch",
    description: "Launched our collaborative platform for student researchers",
    icon: <Code className="h-5 w-5" />,
  },
  {
    year: "2024",
    title: "50+ Projects",
    description: "Reached milestone of 50+ active research projects",
    icon: <Target className="h-5 w-5" />,
  },
]

const values = [
  {
    title: "Innovation",
    description: "We push the boundaries of technology and create solutions for tomorrow's challenges.",
    icon: <Lightbulb className="h-8 w-8" />,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Collaboration",
    description: "We believe in the power of teamwork and collective intelligence to solve complex problems.",
    icon: <Users className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Excellence",
    description: "We strive for excellence in everything we do, from research to implementation.",
    icon: <Star className="h-8 w-8" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Impact",
    description: "We focus on creating meaningful impact that benefits society and advances human knowledge.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-red-500 to-pink-500",
  },
  {
    title: "Learning",
    description: "We foster a culture of continuous learning and knowledge sharing among our members.",
    icon: <Brain className="h-8 w-8" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Ethics",
    description: "We maintain the highest ethical standards in our research and technological development.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-indigo-500 to-blue-500",
  },
]

const achievements = [
  {
    number: "50+",
    label: "Research Projects",
    description: "Active projects across multiple domains",
  },
  {
    number: "25+",
    label: "Publications",
    description: "Papers published in top-tier journals",
  },
  {
    number: "500+",
    label: "Students",
    description: "Active members in our community",
  },
  {
    number: "15+",
    label: "Awards",
    description: "Recognition for innovation and excellence",
  },
]

const researchAreas = [
  {
    name: "Artificial Intelligence",
    icon: <Brain className="h-6 w-6" />,
    projects: 15,
    color: "bg-blue-500",
  },
  {
    name: "Healthcare Technology",
    icon: <Heart className="h-6 w-6" />,
    projects: 8,
    color: "bg-red-500",
  },
  {
    name: "Robotics",
    icon: <Cpu className="h-6 w-6" />,
    projects: 12,
    color: "bg-purple-500",
  },
  {
    name: "Space Technology",
    icon: <Rocket className="h-6 w-6" />,
    projects: 6,
    color: "bg-orange-500",
  },
  {
    name: "Computational Sciences",
    icon: <Microscope className="h-6 w-6" />,
    projects: 10,
    color: "bg-green-500",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
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
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">About Our Mission</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Infinity Tech Society
            </span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-4xl mx-auto leading-relaxed">
            We are a vibrant community of IIT Madras students passionate about technology, innovation, and research. Our
            mission is to foster collaboration, drive innovation, and create solutions that make a meaningful impact on
            society.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <div className="relative h-96 md:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                alt="IIT Madras Campus"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h2 className="text-3xl font-bold mb-4">IIT Madras - Where Innovation Begins</h2>
                <p className="text-lg text-gray-200 max-w-2xl">
                  Located in Chennai, Tamil Nadu, IIT Madras is one of India's premier institutes of technology,
                  fostering innovation and excellence in education and research.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To create a collaborative ecosystem where IIT Madras students can explore cutting-edge technologies,
                conduct meaningful research, and develop innovative solutions that address real-world challenges. We aim
                to bridge the gap between academic learning and practical application.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To become the leading student-driven technology society that produces world-class researchers,
                innovators, and entrepreneurs. We envision a future where our members contribute significantly to
                technological advancement and societal progress on a global scale.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These values guide everything we do and shape our community culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        {value.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
                <p className="text-muted-foreground text-lg">
                  Milestones that showcase our community's impact and growth.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.label}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="text-4xl font-bold text-primary mb-2">{achievement.number}</div>
                    <div className="text-lg font-semibold mb-1">{achievement.label}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Research Areas */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Research Focus Areas</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our diverse research portfolio spans multiple cutting-edge technology domains.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 ${area.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}
                    >
                      {area.icon}
                    </div>
                    <h3 className="font-bold mb-2">{area.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {area.projects} Projects
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Key milestones in our growth and development as a leading tech society.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.2 }}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 inline-block max-w-md">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            {milestone.icon}
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                            <div className="text-lg font-semibold">{milestone.title}</div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg z-10"></div>
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground">
                    IIT Madras Campus
                    <br />
                    Chennai, Tamil Nadu 600036
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-sm text-muted-foreground">
                    contact@infinitytech.edu
                    <br />
                    research@infinitytech.edu
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Phone</h4>
                  <p className="text-sm text-muted-foreground">
                    +91 44 2257 4000
                    <br />
                    +91 44 2257 4001
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Button size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Join Our Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
