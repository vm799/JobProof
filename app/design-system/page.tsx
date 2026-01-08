"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Users,
  Home,
  Briefcase,
  MessageSquare,
  Plus,
  Search,
  MoreVertical,
} from "lucide-react"
import { ThemeLogo } from "@/components/theme-logo"

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedProof, setSelectedProof] = useState<string | null>(null)
  const [showTeamDetails, setShowTeamDetails] = useState(false)
  const [selectedRole, setSelectedRole] = useState("all")

  // Mock Data
  const mockStats = {
    activeJobs: 12,
    pending: 5,
    doneToday: 8,
    teamTotal: 8,
    teamCapacity: 10,
  }

  const mockProofs = [
    {
      id: "1",
      jobName: "HVAC Repair - Unit 4B",
      jobId: "#4092",
      time: "14 mins ago",
      priority: "Urgent",
      tech: "Mike Ross",
      role: "Technician",
      description: "Replaced the compressor fan. System running at optimal pressure.",
      image: "/hvac-repair.jpg",
      avatar: "MR",
    },
    {
      id: "2",
      jobName: "Electrical Inspection",
      jobId: "#4105",
      time: "32 mins ago",
      priority: "Normal",
      tech: "Jane Smith",
      role: "Lead Electrician",
      description: "Completed full panel inspection",
      image: "/electrical-panel.jpg",
      avatar: "JS",
    },
  ]

  const mockTeamMembers = [
    {
      id: "1",
      name: "Sarah Jenkins",
      email: "sarah.j@jobproof.com",
      role: "Admin",
      status: "Active 2m",
      avatar: "SJ",
      color: "bg-pink-500",
    },
    {
      id: "2",
      name: "Mike Ross",
      email: "m.ross@jobproof.com",
      role: "Field Tech",
      status: "Active 1d ago",
      avatar: "MR",
      color: "bg-orange-500",
    },
    {
      id: "3",
      name: "Davina Claire",
      email: "davina@jobproof.com",
      role: "Manager",
      status: "Invite Pend...",
      avatar: "DC",
      color: "bg-yellow-500",
    },
    {
      id: "4",
      name: "John Doe",
      email: "j.doe@jobproof.com",
      role: "Field Tech",
      status: "Active 1 wee...",
      avatar: "JD",
      color: "bg-blue-500",
    },
    {
      id: "5",
      name: "Emily Smith",
      email: "emily.s@jobproof.com",
      role: "Viewer",
      status: "Active 30...",
      avatar: "ES",
      color: "bg-green-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ThemeLogo width={140} height={35} />
            <div className="text-xs text-muted-foreground">Design System V0</div>
          </div>
          <div className="text-sm font-medium text-muted-foreground">UI-Only Prototype</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Action Alert */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100">Action Required</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      You have 5 items in the review queue requiring your attention.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">ACTIVE JOBS</p>
                      <p className="text-3xl font-bold mt-2">{mockStats.activeJobs}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">PENDING</p>
                      <p className="text-3xl font-bold mt-2 text-orange-600">{mockStats.pending}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">DONE TODAY</p>
                      <p className="text-3xl font-bold mt-2 text-green-600">{mockStats.doneToday}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">TEAM</p>
                      <p className="text-3xl font-bold mt-2">
                        {mockStats.teamTotal}/{mockStats.teamCapacity}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Proof Review Queue */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Proof Review Queue</h2>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  See all (5)
                </Button>
              </div>

              {mockProofs.map((proof) => (
                <Card
                  key={proof.id}
                  className="cursor-pointer hover:shadow-md transition"
                  onClick={() => setSelectedProof(selectedProof === proof.id ? null : proof.id)}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{proof.jobName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Job #{proof.jobId} • {proof.time}
                          </p>
                        </div>
                        <Badge variant={proof.priority === "Urgent" ? "destructive" : "secondary"}>
                          {proof.priority}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{proof.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{proof.tech}</p>
                          <p className="text-xs text-muted-foreground">{proof.role}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">"{proof.description}"</p>

                      {selectedProof === proof.id && (
                        <div className="space-y-4 pt-4 border-t">
                          <img
                            src={proof.image || "/placeholder.svg"}
                            alt="Proof"
                            className="w-full rounded-lg h-48 object-cover bg-muted"
                          />
                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 bg-transparent">
                              Reject
                            </Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Approve</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            {/* Plan Info */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">CURRENT PLAN</p>
                    <h2 className="text-2xl font-bold mt-2">Enterprise Plan</h2>
                  </div>
                  <Badge className="bg-blue-600">Premium</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Seat Capacity</span>
                    <span className="font-semibold">42 / 50</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-muted-foreground">8 seats remaining until upgrade needed</p>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  Manage Billing
                </Button>
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search team members..." className="pl-10" />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {["all", "admin", "manager", "field"].map((role) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole(role)}
                    className="whitespace-nowrap"
                  >
                    {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Team Members</h3>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Export CSV
                </Button>
              </div>

              {mockTeamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar>
                          <AvatarFallback className={member.color}>{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email} • {member.status}
                          </p>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Jobs Management</CardTitle>
                <CardDescription>Create and manage field service jobs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  <Plus className="w-4 h-4 mr-2" /> Create New Job
                </Button>
                <p className="text-sm text-muted-foreground text-center py-8">Job creation workflow UI coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auth Tab */}
          <TabsContent value="auth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Flows</CardTitle>
                <CardDescription>Sign in, magic links, and verification screens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12 bg-transparent">
                    Sign In
                  </Button>
                  <Button variant="outline" className="h-12 bg-transparent">
                    Magic Link
                  </Button>
                  <Button variant="outline" className="h-12 bg-transparent">
                    Sign Up
                  </Button>
                  <Button variant="outline" className="h-12 bg-transparent">
                    Email Verify
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center py-8">Auth screens UI coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-card md:hidden">
        <div className="flex items-center justify-around h-16">
          <button className="flex flex-col items-center justify-center h-full flex-1 text-blue-600">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center h-full flex-1 text-muted-foreground">
            <Briefcase className="w-5 h-5" />
            <span className="text-xs mt-1">Jobs</span>
          </button>
          <button className="flex flex-col items-center justify-center h-full flex-1 text-muted-foreground">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Team</span>
          </button>
          <button className="flex flex-col items-center justify-center h-full flex-1 text-muted-foreground">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs mt-1">Messages</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:hidden" />
    </div>
  )
}
