import { EmailListItem, type Email } from "./EmailListItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function EmailList({ emails, selectedId, onSelect }: EmailListProps) {
  if (emails.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-2">
        {emails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            isSelected={selectedId === email.id}
            onClick={() => onSelect(email.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
