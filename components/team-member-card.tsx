import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Mail, Phone, Clock } from "lucide-react"

interface TeamMemberCardProps {
  name: string
  role: string
  email: string
  bio?: string
  profileImage?: string
  phone?: string
  timezone?: string
  favoriteQuote?: string
}

export function TeamMemberCard({
  name,
  role,
  email,
  bio,
  profileImage,
  phone,
  timezone,
  favoriteQuote,
}: TeamMemberCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarImage src={profileImage || "/placeholder.svg"} alt={name} />
          <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{role}</p>

          {bio && <p className="text-sm text-foreground/80 mb-4 leading-relaxed italic">"{bio}"</p>}

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                {email}
              </a>
            </div>
            {phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
                  {phone}
                </a>
              </div>
            )}
            {timezone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{timezone}</span>
              </div>
            )}
          </div>

          {favoriteQuote && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground italic">Favorite quote:</p>
              <p className="text-sm text-foreground/70 mt-1">"{favoriteQuote}"</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
