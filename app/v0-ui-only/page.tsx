"use client"

import { useState } from "react"
import {
  Bell,
  Home,
  FileText,
  Users,
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Mock data
const mockProofs = [
  {
    id: "4092",
    title: "HVAC Repair - Unit 4B",
    timeAgo: "14 mins ago",
    technician: "Mike Ross",
    role: "Technician",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
    status: "urgent",
    description: "Replaced the compressor fan. System running at optimal pressure.",
  },
  {
    id: "4105",
    title: "Electrical Inspection",
    timeAgo: "32 mins ago",
    technician: "Jane Smith",
    role: "Lead Electrician",
    status: "pending",
  },
]

const mockTeamMembers = [
  {
    id: "1",
    name: "John Doe",
    status: "On Site",
    statusDetail: "(15m)",
    location: "123 Main St",
    color: "bg-green-500",
  },
  {
    id: "2",
    name: "Sarah Jones",
    status: "Traveling",
    color: "bg-yellow-500",
  },
  {
    id: "3",
    name: "Robert Fox",
    status: "Idle",
    color: "bg-gray-500",
  },
]

const mockTeamList = [
  {
    id: "sarah",
    name: "Sarah Jenkins",
    email: "sarah.j@jobproof.com",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "Active 2m ago",
  },
  {
    id: "mike",
    name: "Mike Ross",
    email: "m.ross@jobproof.com",
    role: "Field Tech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    status: "Active 1d ago",
  },
  {
    id: "davina",
    name: "Davina Claire",
    email: "davina@jobproof.com",
    role: "Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Davina",
    status: "Invite Pending...",
  },
  {
    id: "john",
    name: "John Doe",
    email: "j.doe@jobproof.com",
    role: "Field Tech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    status: "Active 1 week ago",
  },
  {
    id: "emily",
    name: "Emily Smith",
    email: "emily.s@jobproof.com",
    role: "Viewer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    status: "Active 30 days ago",
  },
]

export default function UIOnlyDashboard() {
  const [currentView, setCurrentView] = useState<"dashboard" | "team" | "jobs" | "messages">("dashboard")
  const [selectedProof, setSelectedProof] = useState<string | null>(null)
  const [showTeamDetails, setShowTeamDetails] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleApprove = () => {
    alert("Proof approved!")
    setSelectedProof(null)
  }

  const handleReject = () => {
    alert("Proof rejected")
    setSelectedProof(null)
  }

  // Dashboard View
  if (currentView === "dashboard" && !selectedProof && !showTeamDetails) {
    return (
      <div className="min-h-screen bg-white pb-20 md:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm text-gray-600">Tue, Oct 24</h2>
              <h1 className="text-xl font-semibold">Good Morning, Sarah</h1>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>

        {/* Action Alert */}
        <div className="mx-4 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Action Required</h3>
            <p className="text-sm text-blue-800">You have 5 items in the review queue requiring your attention.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 mt-6 grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-600 font-medium">ACTIVE JOBS</span>
            </div>
            <p className="text-3xl font-bold">12</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-xs text-gray-600 font-medium">PENDING</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">5</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-600 font-medium">DONE TODAY</span>
            </div>
            <p className="text-3xl font-bold">8</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-600 font-medium">TEAM</span>
            </div>
            <p className="text-3xl font-bold">8/10</p>
          </Card>
        </div>

        {/* Proof Review Queue */}
        <div className="px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Proof Review Queue</h3>
            <button className="text-blue-600 text-sm font-medium">See all (5)</button>
          </div>

          <div className="space-y-4">
            {mockProofs.map((proof) => (
              <Card
                key={proof.id}
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedProof(proof.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{proof.title}</h4>
                      {proof.status === "urgent" && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Job #{proof.id} • {proof.timeAgo}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>
                          {proof.technician
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{proof.technician}</span>
                      <span className="text-xs text-gray-600">{proof.role}</span>
                    </div>
                    {proof.description && <p className="text-sm text-gray-700 italic mb-3">"{proof.description}"</p>}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 bg-transparent">
                        Reject
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Approve
                      </Button>
                    </div>
                  </div>
                  {proof.image && (
                    <img
                      src={proof.image || "/placeholder.svg"}
                      alt={proof.title}
                      className="w-20 h-20 rounded object-cover flex-shrink-0"
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Status */}
        <div className="px-4 mt-8 pb-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Team Status</h3>
          </div>

          <div className="flex gap-2 mb-4">
            <Button variant={true ? "default" : "outline"} size="sm" className={true ? "bg-gray-900 text-white" : ""}>
              List View
            </Button>
            <Button variant="outline" size="sm">
              Map View
            </Button>
          </div>

          <div className="space-y-3">
            {mockTeamMembers.map((member) => (
              <Card key={member.id} className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${member.color}`}></div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-600">
                      {member.status} {member.statusDetail}
                    </p>
                  </div>
                </div>
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setCurrentView("dashboard")}
          >
            <Home className={`w-6 h-6 ${currentView === "dashboard" ? "text-blue-600" : "text-gray-600"}`} />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setCurrentView("jobs")}
          >
            <FileText className={`w-6 h-6 ${currentView === "jobs" ? "text-blue-600" : "text-gray-600"}`} />
            <span className="text-xs">Jobs</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setCurrentView("team")}
          >
            <Users className={`w-6 h-6 ${currentView === "team" ? "text-blue-600" : "text-gray-600"}`} />
            <span className="text-xs">Team</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setCurrentView("messages")}
          >
            <MessageCircle className={`w-6 h-6 ${currentView === "messages" ? "text-blue-600" : "text-gray-600"}`} />
            <span className="text-xs">Messages</span>
          </Button>
        </div>
      </div>
    )
  }

  // Team Management View
  if (currentView === "team" && !showTeamDetails) {
    return (
      <div className="min-h-screen bg-white pb-20 md:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentView("dashboard")} className="md:hidden">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </Button>
            <h1 className="text-xl font-semibold flex-1">Team Management</h1>
            <Button variant="ghost" size="icon">
              <Plus className="w-6 h-6 text-blue-600" />
            </Button>
          </div>
        </div>

        {/* Plan Card */}
        <div className="mx-4 mt-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">CURRENT PLAN</p>
                <h3 className="text-2xl font-bold">Enterprise Plan</h3>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                ★
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Seat Capacity</p>
                <p className="text-sm font-bold">42 / 50</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "84%" }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">8 seats remaining until upgrade needed</p>
            </div>
            <Button className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50">
              Manage Billing
            </Button>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="px-4 mt-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search team members..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Button size="sm" className="bg-gray-900 text-white rounded-full whitespace-nowrap">
              All Roles
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap bg-transparent">
              Admins (3)
            </Button>
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap bg-transparent">
              Field Techs (28)
            </Button>
          </div>
        </div>

        {/* Team Members */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Team Members</h3>
            <button className="text-blue-600 text-sm font-medium">Export CSV</button>
          </div>

          <div className="space-y-3">
            {mockTeamList.map((member) => (
              <Card key={member.id} className="p-4 cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{member.status}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{member.role}</Badge>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setCurrentView("dashboard")}
          >
            <Home className="w-6 h-6 text-gray-600" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setCurrentView("jobs")}
          >
            <FileText className="w-6 h-6 text-gray-600" />
            <span className="text-xs">Jobs</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setCurrentView("team")}
          >
            <Users className={`w-6 h-6 ${currentView === "team" ? "text-blue-600" : "text-gray-600"}`} />
            <span className="text-xs">Team</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1"
            onClick={() => setCurrentView("messages")}
          >
            <MessageCircle className="w-6 h-6 text-gray-600" />
            <span className="text-xs">Messages</span>
          </Button>
        </div>
      </div>
    )
  }

  // Placeholder for other views
  return (
    <div className="min-h-screen bg-white flex items-center justify-center pb-20 md:pb-0">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Coming soon: {currentView} view</p>
        <Button onClick={() => setCurrentView("dashboard")}>Back to Dashboard</Button>
      </div>
    </div>
  )
}
