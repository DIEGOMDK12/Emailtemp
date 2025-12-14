import { type Email } from "./EmailListItem";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailViewerProps {
  email: Email;
  onDelete: (id: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function EmailViewer({ email, onDelete, onBack, showBackButton }: EmailViewerProps) {
  const formatFullDate = (date: Date) => {
    return date.toLocaleString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 p-4 border-b flex-wrap">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button size="icon" variant="ghost" onClick={onBack} data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-semibold truncate" data-testid="text-email-subject">
            {email.subject}
          </h2>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(email.id)}
          data-testid="button-delete-email"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="p-4 border-b bg-muted/30">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground w-12">De:</span>
            <span className="font-medium" data-testid="text-email-from">{email.from}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-12">Data:</span>
            <span data-testid="text-email-date">{formatFullDate(email.timestamp)}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {email.htmlBody ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: email.htmlBody }}
              data-testid="content-email-body"
            />
          ) : (
            <pre
              className="whitespace-pre-wrap font-sans text-sm"
              data-testid="content-email-body"
            >
              {email.textBody || email.preview}
            </pre>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
