"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Plus } from "lucide-react"

interface Conversation {
  id: string
  message: string
  updated_at: string
  participants: any[]
}

export function MessagingInterface({
  conversations,
  teamMembers,
  currentUserId,
}: {
  conversations: Conversation[]
  teamMembers: any[]
  currentUserId: string
}) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null,
  )
  const [messageText, setMessageText] = useState("")
  const [showNewMessage, setShowNewMessage] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-8 h-screen">
      {/* Conversations List */}
      <Card className="md:col-span-1 flex flex-col">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowNewMessage(!showNewMessage)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-0">
          {showNewMessage ? (
            <div className="p-4 space-y-2">
              <p className="text-sm font-medium">Start conversation with:</p>
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition"
                  onClick={() => {
                    setSelectedConversation(member.id)
                    setShowNewMessage(false)
                  }}
                >
                  <p className="text-sm font-medium">{member.full_name}</p>
                  <p className="text-xs text-gray-600">{member.email}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-600">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition ${
                      selectedConversation === conv.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={conv.participants[0]?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{conv.participants[0]?.full_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conv.participants.map((p) => p.full_name).join(", ")}
                        </p>
                        <p className="text-xs text-gray-600 truncate">{conv.message}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b">
              <CardTitle>Conversation</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Sample message from team member</p>
                  <p className="text-xs text-gray-600 mt-1">10:30 AM</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Sample reply message</p>
                  <p className="text-xs text-blue-200 mt-1">10:35 AM</p>
                </div>
              </div>
            </CardContent>

            <div className="border-t p-4 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && messageText.trim()) {
                    setMessageText("")
                  }
                }}
              />
              <Button onClick={() => messageText.trim() && setMessageText("")} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-gray-600">Select a conversation to start messaging</p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
