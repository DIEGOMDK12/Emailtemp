import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: Date;
  isRead: boolean;
  htmlBody?: string;
  textBody?: string;
}

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

export function EmailListItem({ email, isSelected, onClick }: EmailListItemProps) {
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return "agora";
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Card
      className={`p-3 cursor-pointer hover-elevate active-elevate-2 transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
      onClick={onClick}
      data-testid={`card-email-${email.id}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className={`relative ${!email.isRead ? "text-primary" : "text-muted-foreground"}`}>
            <Mail className="h-5 w-5" />
            {!email.isRead && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span 
              className={`text-sm truncate ${!email.isRead ? "font-semibold" : ""}`}
              data-testid={`text-sender-${email.id}`}
            >
              {email.from}
            </span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatRelativeTime(email.timestamp)}
            </span>
          </div>
          <p 
            className={`text-sm truncate ${!email.isRead ? "font-medium" : "text-muted-foreground"}`}
            data-testid={`text-subject-${email.id}`}
          >
            {email.subject}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-1">
            {email.preview}
          </p>
        </div>
      </div>
    </Card>
  );
}
