"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Send,
  Save,
  Eye,
  AlertCircle,
  Info,
  CheckCircle,
  Bell,
  Users,
  Calendar,
  Tag,
  Paperclip,
  ImageIcon,
  Link,
} from "lucide-react"

export default function CreateAnnouncement() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    type: "info" as "info" | "warning" | "success" | "urgent",
    audience: "all" as "all" | "students" | "teachers" | "admins",
    priority: "medium" as "low" | "medium" | "high",
    tags: [] as string[],
    expiresAt: "",
    attachments: [] as string[],
    isPinned: false,
    allowComments: true,
  })
  const [newTag, setNewTag] = useState("")
  const [preview, setPreview] = useState(false)

  const handleSubmit = async (isDraft = false) => {
    if (!announcement.title.trim() || !announcement.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and content.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const announcementData = {
        ...announcement,
        id: Date.now().toString(),
        author: {
          name: user?.name || "Admin",
          avatar: user?.avatar_url || "",
          role: user?.role || "admin",
        },
        createdAt: new Date().toISOString(),
        isActive: !isDraft,
        isDraft,
        views: 0,
        reactions: [],
        comments: [],
      }

      // Here you would save to your database
      console.log("Creating announcement:", announcementData)

      toast({
        title: isDraft ? "Draft Saved! 📝" : "Announcement Published! 📢",
        description: isDraft
          ? "Your announcement has been saved as a draft."
          : "Your announcement has been published successfully.",
      })

      router.push("/admin/announcements")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !announcement.tags.includes(newTag.trim())) {
      setAnnouncement((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setAnnouncement((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "urgent":
        return <Bell className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500"
      case "warning":
        return "bg-yellow-500"
      case "success":
        return "bg-green-500"
      case "urgent":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Announcement</h1>
            <p className="text-muted-foreground">Broadcast a message to your community</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Announcement Details</CardTitle>
                <CardDescription>Fill in the information for your announcement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    value={announcement.title}
                    onChange={(e) => setAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-medium"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your announcement content here..."
                    rows={8}
                    value={announcement.content}
                    onChange={(e) => setAnnouncement((prev) => ({ ...prev, content: e.target.value }))}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {announcement.content.length} characters • Supports markdown formatting
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  {announcement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {announcement.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expiration Date */}
                <div className="space-y-2">
                  <Label htmlFor="expires">Expiration Date (Optional)</Label>
                  <Input
                    id="expires"
                    type="datetime-local"
                    value={announcement.expiresAt}
                    onChange={(e) => setAnnouncement((prev) => ({ ...prev, expiresAt: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty for permanent announcement. Expired announcements are automatically hidden.
                  </p>
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Paperclip className="h-8 w-8 text-muted-foreground" />
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <Link className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type */}
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={announcement.type}
                    onValueChange={(value: any) => setAnnouncement((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Information
                        </div>
                      </SelectItem>
                      <SelectItem value="warning">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Warning
                        </div>
                      </SelectItem>
                      <SelectItem value="success">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Success
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Urgent
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Audience */}
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select
                    value={announcement.audience}
                    onValueChange={(value: any) => setAnnouncement((prev) => ({ ...prev, audience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          All Users
                        </div>
                      </SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="teachers">Teachers Only</SelectItem>
                      <SelectItem value="admins">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={announcement.priority}
                    onValueChange={(value: any) => setAnnouncement((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Options */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pinned" className="text-sm">
                      Pin to top
                    </Label>
                    <input
                      id="pinned"
                      type="checkbox"
                      checked={announcement.isPinned}
                      onChange={(e) => setAnnouncement((prev) => ({ ...prev, isPinned: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments" className="text-sm">
                      Allow comments
                    </Label>
                    <input
                      id="comments"
                      type="checkbox"
                      checked={announcement.allowComments}
                      onChange={(e) => setAnnouncement((prev) => ({ ...prev, allowComments: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {announcement.title || announcement.content ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getTypeColor(announcement.type)} text-white gap-1`}>
                        {getTypeIcon(announcement.type)}
                        {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                      </Badge>
                      {announcement.priority === "high" && <Badge variant="destructive">High Priority</Badge>}
                      {announcement.isPinned && <Badge variant="outline">Pinned</Badge>}
                    </div>
                    {announcement.title && <h3 className="font-semibold">{announcement.title}</h3>}
                    {announcement.content && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{announcement.content}</p>
                    )}
                    {announcement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {announcement.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Start typing to see a preview...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Publish Announcement
                  </Button>
                  <Button onClick={() => handleSubmit(true)} disabled={isLoading} variant="outline" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
