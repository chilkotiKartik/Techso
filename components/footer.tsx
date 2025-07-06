"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, Rocket, Satellite, Zap, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function Footer() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false)
  const currentYear = new Date().getFullYear()

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

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscription Successful! 🚀",
        description: "Welcome to the Infinity Tech Society community!",
      })
      setEmail("")
      setIsNewsletterSubmitting(false)
    }, 1500)
  }

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // Recent news items
  const recentNews = [
    {
      title: "New AI Research Projects Launched by IIT Madras Students",
      date: "December 15, 2024",
      link: "/news/ai-research-projects",
    },
    {
      title: "Infinity Tech Society Wins National Innovation Award",
      date: "November 28, 2024",
      link: "/news/innovation-award",
    },
    {
      title: "Student Projects Featured in International Conference",
      date: "November 10, 2024",
      link: "/news/international-conference",
    },
  ]

  const quickLinks = [
    { title: "Home", href: "/" },
    { title: "Projects", href: "/projects" },
    { title: "Team", href: "/team" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Gallery", href: "/gallery" },
  ]

  const researchAreas = [
    { title: "Artificial Intelligence", href: "/research/ai" },
    { title: "Natural Language Processing", href: "/research/nlp" },
    { title: "Machine Learning", href: "/research/ml" },
    { title: "Data Science", href: "/research/data-science" },
    { title: "Computer Vision", href: "/research/cv" },
    { title: "Healthcare Tech", href: "/research/healthcare" },
  ]

  return (
    <footer className="bg-muted/30 border-t border-border relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 space-dots opacity-20 pointer-events-none"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-12 border-b border-border relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerVariants}
          >
            <motion.div className="text-center md:text-left" variants={itemVariants}>
              <h3 className="text-2xl font-bold font-space mb-3 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Stay Connected with Innovation
              </h3>
              <p className="text-muted-foreground text-lg">
                Get the latest updates on groundbreaking research and student projects from IIT Madras.
              </p>
            </motion.div>
            <motion.form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-md gap-3"
              variants={itemVariants}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 rounded-xl"
              />
              <Button
                type="submit"
                disabled={isNewsletterSubmitting}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                {isNewsletterSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subscribing...
                  </div>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={footerVariants}
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Infinity Tech
                </h2>
                <p className="text-sm text-muted-foreground">Society</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Empowering IIT Madras students to build the future through innovative research, collaborative projects,
              and cutting-edge technology solutions.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://twitter.com/infinitytech"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://github.com/infinity-tech-society"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://linkedin.com/company/infinity-tech-society"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="mailto:contact@infinitytech.edu"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
              >
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="font-bold text-lg mb-6 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Research Areas */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="font-bold text-lg mb-6 text-foreground">Research Areas</h3>
            <ul className="space-y-3">
              {researchAreas.map((area) => (
                <li key={area.href} className="flex items-center space-x-2">
                  <Satellite size={14} className="text-primary flex-shrink-0" />
                  <Link
                    href={area.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm hover:translate-x-1 transform duration-200"
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Recent News & Contact */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="font-bold text-lg mb-6 text-foreground">Recent News</h3>
            <ul className="space-y-4 mb-8">
              {recentNews.map((news, index) => (
                <li key={index}>
                  <Link href={news.link} className="group block">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {news.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{news.date}</p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Contact Us</h4>
              <address className="not-italic text-muted-foreground text-sm space-y-1">
                <p>IIT Madras Campus</p>
                <p>Chennai, Tamil Nadu 600036</p>
                <p className="mt-2">
                  <a href="mailto:contact@infinitytech.edu" className="hover:text-primary transition-colors">
                    contact@infinitytech.edu
                  </a>
                </p>
                <p>
                  <a href="tel:+914422574000" className="hover:text-primary transition-colors">
                    +91 44 2257 4000
                  </a>
                </p>
              </address>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <p>&copy; {currentYear} Infinity Tech Society. All rights reserved.</p>
            <span className="hidden md:inline">•</span>
            <p className="hidden md:inline">Made with</p>
            <Heart className="h-4 w-4 text-red-500 fill-current hidden md:inline" />
            <p className="hidden md:inline">by IIT Madras students</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
