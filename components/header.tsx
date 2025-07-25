"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Menu,
  Home,
  Users,
  FolderOpen,
  Phone,
  User,
  LogIn,
  UserPlus,
  Settings,
  Bell,
  Search,
  Palette,
  Globe,
  Award,
  Shield,
  LogOut,
  MessageSquare,
  Zap,
  BookOpen,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, logout } = useAuth()
  const { toast } = useToast()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications] = useState(3)
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (user && profile) {
      setUnreadAnnouncements(Math.floor(Math.random() * 5))
    }
  }, [user, profile])

  const handleLogout = async () => {
    try {
      await logout()
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navigationItems = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-4 w-4" />,
      description: "Welcome to Infinity Tech Society",
    },
    {
      title: "Projects",
      href: "/projects",
      icon: <FolderOpen className="h-4 w-4" />,
      description: "Explore innovative research projects",
    },
    {
      title: "Team",
      href: "/team",
      icon: <Users className="h-4 w-4" />,
      description: "Meet our research team",
    },
    {
      title: "Research",
      href: "/research",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Discover cutting-edge research",
    },
    {
      title: "Gallery",
      href: "/gallery",
      icon: <Palette className="h-4 w-4" />,
      description: "3D interactive project gallery",
    },
    {
      title: "About",
      href: "/about",
      icon: <Globe className="h-4 w-4" />,
      description: "Learn about our mission",
    },
    {
      title: "Contact",
      href: "/contact",
      icon: <Phone className="h-4 w-4" />,
      description: "Get in touch with us",
    },
  ]

  const userMenuItems = user
    ? [
        {
          title: profile?.role === "admin" ? "Admin Dashboard" : "Student Dashboard",
          href: profile?.role === "admin" ? "/admin/dashboard" : "/student/dashboard",
          icon: profile?.role === "admin" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />,
        },
        ...(profile?.role === "student"
          ? [
              { title: "Team Chat", href: "/student/chat", icon: <MessageSquare className="h-4 w-4" /> },
              { title: "Announcements", href: "/student/announcements", icon: <Bell className="h-4 w-4" /> },
              { title: "Resources", href: "/student/resources", icon: <FolderOpen className="h-4 w-4" /> },
              { title: "Assignments", href: "/student/assignments", icon: <BookOpen className="h-4 w-4" /> },
              { title: "Settings", href: "/student/settings", icon: <Settings className="h-4 w-4" /> },
              { title: "Achievements", href: "/student/achievements", icon: <Award className="h-4 w-4" /> },
            ]
          : [
              { title: "Manage Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
              { title: "Analytics", href: "/admin/analytics", icon: <Zap className="h-4 w-4" /> },
              { title: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
            ]),
      ]
    : []

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-background/80 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div className="relative" whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.6 }}>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
            </motion.div>
            <div className="hidden sm:block">
              <motion.h1
                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Infinity Tech
              </motion.h1>
              <p className="text-xs text-muted-foreground -mt-1">Society</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname === item.href ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            {user && (
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href={profile?.role === "admin" ? "/admin/dashboard" : "/student/announcements"}>
                  <Bell className="h-5 w-5" />
                  {unreadAnnouncements > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {unreadAnnouncements > 99 ? "99+" : unreadAnnouncements}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.name || "User"} />
                      <AvatarFallback>
                        {profile?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                      <Badge className="w-fit mt-1" variant={profile?.role === "admin" ? "default" : "secondary"}>
                        {profile?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        <span className="ml-2">{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {/* User Info */}
                  {user && (
                    <div className="flex items-center space-x-2 pb-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.name || "User"} />
                        <AvatarFallback>
                          {profile?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{profile?.name}</span>
                        <span className="text-xs text-muted-foreground">{profile?.email}</span>
                        <Badge className="w-fit mt-1" variant={profile?.role === "admin" ? "default" : "secondary"}>
                          {profile?.role}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
                          pathname === item.href ? "bg-accent text-accent-foreground" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </nav>

                  {/* User Menu Items */}
                  {user && (
                    <div className="border-t pt-4">
                      <div className="flex flex-col space-y-2">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        ))}
                        <Button variant="ghost" className="justify-start px-3" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Auth Buttons for Non-logged Users */}
                  {!user && (
                    <div className="border-t pt-4">
                      <div className="flex flex-col space-y-2">
                        <Button variant="ghost" className="justify-start" asChild>
                          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </Link>
                        </Button>
                        <Button className="justify-start" asChild>
                          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
