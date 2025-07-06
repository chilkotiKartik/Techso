"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/database"
import {
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Camera,
  Save,
  AlertCircle,
  Github,
  Linkedin,
  ExternalLink,
  Award,
  BookOpen,
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  bio?: string
  avatar_url?: string
  department?: string
  year_of_study?: number
  skills?: string[]
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
  points: number
  level: number
}

interface NotificationSettings {
  email_notifications: boolean
  push_notifications: boolean
  assignment_reminders: boolean
  project_updates: boolean
  achievement_alerts: boolean
  weekly_digest: boolean
}

export default function StudentSettings() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    assignment_reminders: true,
    project_updates: true,
    achievement_alerts: true,
    weekly_digest: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login")
      return
    }

    loadUserProfile()
  }, [user, router])

  const loadUserProfile = async () => {
    try {
      const { data, error } = await db.getUser(user!.id)
      if (error) throw error

      setProfile(data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile. Please refresh the page.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      const { data, error } = await db.updateUser(profile.id, {
        name: profile.name,
        bio: profile.bio,
        department: profile.department,
        year_of_study: profile.year_of_study,
        skills: profile.skills,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        portfolio_url: profile.portfolio_url,
      })

      if (error) throw error

      // Update auth context
      await updateProfile(data)

      toast({
        title: "Profile Updated! ✅",
        description: "Your profile has been saved successfully.",
      })

      // Log activity
      await db.logActivity({
        user_id: user!.id,
        action: "profile_updated",
        entity_type: "user",
        entity_id: user!.id,
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSkill = () => {
    if (!newSkill.trim() || !profile) return

    const updatedSkills = [...(profile.skills || []), newSkill.trim()]
    setProfile({ ...profile, skills: updatedSkills })
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return

    const updatedSkills = profile.skills?.filter((skill) => skill !== skillToRemove) || []
    setProfile({ ...profile, skills: updatedSkills })
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "privacy", label: "Privacy", icon: <Shield className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
  ]

  if (!user || user.role !== "student") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need student access to view this page.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Settings...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6">
          <Settings className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Student Settings</span>
        </div>
        <h1 className="text-4xl font-bold font-space mb-4">
          Account{" "}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Manage your profile, preferences, and account settings to personalize your experience.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          {profile && (
            <Card className="bg-card/50 backdrop-blur-sm mt-6">
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-lg">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">{profile.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{profile.email}</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Level {profile.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span>{profile.points} pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {activeTab === "profile" && profile && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and academic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="text-xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="mb-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Avatar
                    </Button>
                    <p className="text-sm text-muted-foreground">Upload a new avatar. Recommended size: 400x400px</p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} disabled className="bg-muted" />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your interests, and goals..."
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Academic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Computer Science"
                      value={profile.department || ""}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Study</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1"
                      max="5"
                      placeholder="e.g., 2"
                      value={profile.year_of_study || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, year_of_study: Number.parseInt(e.target.value) || undefined })
                      }
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label>Skills & Technologies</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.skills?.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill (e.g., Python, React, Machine Learning)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <Label>Social & Professional Links</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Github className="h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="GitHub profile URL"
                        value={profile.github_url || ""}
                        onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="LinkedIn profile URL"
                        value={profile.linkedin_url || ""}
                        onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Portfolio website URL"
                        value={profile.portfolio_url || ""}
                        onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about platform activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {key === "email_notifications" && "Receive notifications via email"}
                        {key === "push_notifications" && "Receive browser push notifications"}
                        {key === "assignment_reminders" && "Get reminded about upcoming assignment deadlines"}
                        {key === "project_updates" && "Notifications about project activities and updates"}
                        {key === "achievement_alerts" && "Get notified when you earn new achievements"}
                        {key === "weekly_digest" && "Receive a weekly summary of your activities"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(key as keyof NotificationSettings, checked)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow other students to view your profile and projects
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">Display when you're online in the workspace</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Analytics Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve the platform by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium mb-3 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Light", "Dark", "System"].map((theme) => (
                        <Button
                          key={theme}
                          variant={theme === "Dark" ? "default" : "outline"}
                          className="h-20 flex-col"
                        >
                          <div className="w-8 h-8 rounded mb-2 bg-gradient-to-br from-primary to-purple-500" />
                          {theme}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">Language</Label>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Hindi</option>
                        <option>Tamil</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
