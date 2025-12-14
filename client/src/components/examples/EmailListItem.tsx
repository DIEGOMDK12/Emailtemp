import { EmailListItem } from "../EmailListItem";

export default function EmailListItemExample() {
  return (
    <div className="w-80">
      <EmailListItem
        email={{
          id: "1",
          from: "newsletter@empresa.com",
          subject: "Confirme seu cadastro",
          preview: "Clique no link abaixo para confirmar seu e-mail...",
          timestamp: new Date(Date.now() - 120000),
          isRead: false,
        }}
        isSelected={false}
        onClick={() => console.log("Email clicked")}
      />
    </div>
  );
}
