"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SpaceBackground } from "@/components/space-background"
import { useToast } from "@/hooks/use-toast"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ExternalLink,
  Heart,
  Star,
} from "lucide-react"

const contactMethods = [
  {
    title: "General Inquiries",
    description: "For general questions about our society and activities",
    icon: <MessageSquare className="h-6 w-6" />,
    contact: "contact@infinitytech.edu",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Research Collaboration",
    description: "For research partnerships and academic collaborations",
    icon: <Users className="h-6 w-6" />,
    contact: "research@infinitytech.edu",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Project Submissions",
    description: "For submitting your projects and research work",
    icon: <Send className="h-6 w-6" />,
    contact: "projects@infinitytech.edu",
    color: "from-purple-500 to-violet-500",
  },
  {
    title: "Media & Press",
    description: "For media inquiries and press releases",
    icon: <Globe className="h-6 w-6" />,
    contact: "media@infinitytech.edu",
    color: "from-orange-500 to-amber-500",
  },
]

const officeHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
]

const socialLinks = [
  {
    name: "GitHub",
    icon: <Github className="h-5 w-5" />,
    url: "https://github.com/infinity-tech-society",
    color: "hover:text-gray-900 dark:hover:text-gray-100",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    url: "https://linkedin.com/company/infinity-tech-society",
    color: "hover:text-blue-600",
  },
  {
    name: "Twitter",
    icon: <Twitter className="h-5 w-5" />,
    url: "https://twitter.com/infinitytech",
    color: "hover:text-blue-400",
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    url: "https://instagram.com/infinitytech.iitm",
    color: "hover:text-pink-500",
  },
]

const faqs = [
  {
    question: "How can I join Infinity Tech Society?",
    answer:
      "You can join by registering on our platform and participating in our projects and activities. We welcome all IIT Madras students who are passionate about technology and innovation.",
  },
  {
    question: "What kind of projects do you work on?",
    answer:
      "We work on diverse projects spanning AI/ML, healthcare technology, robotics, space technology, and computational sciences. Our projects range from research papers to practical applications.",
  },
  {
    question: "Do you offer mentorship programs?",
    answer:
      "Yes! We have experienced members and faculty advisors who provide mentorship to new members. We also organize workshops and training sessions regularly.",
  },
  {
    question: "Can I collaborate with other institutions?",
    answer:
      "We encourage collaborations with other institutions, industry partners, and research organizations. Contact our research team for collaboration opportunities.",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message Sent Successfully! 🚀",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      type: "general",
    })
    setIsSubmitting(false)
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
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Get in Touch</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space mb-6">
            Contact{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Have questions, ideas, or want to collaborate? We'd love to hear from you. Reach out to our team and let's
            build the future together.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}
                  >
                    {method.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{method.description}</p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={`mailto:${method.contact}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {method.contact}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Inquiry Type</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="research">Research Collaboration</option>
                        <option value="project">Project Submission</option>
                        <option value="media">Media & Press</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Brief subject of your message"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                      ) : (
                        <Send className="h-5 w-5 mr-2" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Office Information */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Office Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Address</h4>
                    <p className="text-muted-foreground text-sm">
                      Infinity Tech Society
                      <br />
                      IIT Madras Campus
                      <br />
                      Chennai, Tamil Nadu 600036
                      <br />
                      India
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Phone</h4>
                    <p className="text-muted-foreground text-sm">
                      +91 44 2257 4000
                      <br />
                      +91 44 2257 4001
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Email</h4>
                    <p className="text-muted-foreground text-sm">
                      contact@infinitytech.edu
                      <br />
                      research@infinitytech.edu
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Office Hours */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{schedule.day}</span>
                        <span className="text-sm text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Media */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social) => (
                      <Button
                        key={social.name}
                        variant="outline"
                        size="sm"
                        className={`justify-start gap-2 ${social.color}`}
                        asChild
                      >
                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                          {social.icon}
                          {social.name}
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
              <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Response Time</span>
                      <Badge variant="secondary">{"< 24 hours"}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Members</span>
                      <Badge variant="secondary">500+</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Projects</span>
                      <Badge variant="secondary">50+</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Satisfaction</span>
                      <Badge variant="secondary">98%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our society and activities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 inline-block">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-red-500" />
                <h3 className="text-2xl font-bold">Ready to Join Us?</h3>
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Become part of our innovative community and help shape the future of technology.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Join Our Community
                </Button>
                <Button variant="outline" size="lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule a Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
