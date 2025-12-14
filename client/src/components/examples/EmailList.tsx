import { EmailList } from "../EmailList";
import { useState } from "react";

const mockEmails = [
  {
    id: "1",
    from: "newsletter@empresa.com",
    subject: "Confirme seu cadastro",
    preview: "Clique no link abaixo para confirmar...",
    timestamp: new Date(Date.now() - 120000),
    isRead: false,
  },
  {
    id: "2",
    from: "suporte@loja.com",
    subject: "Seu pedido foi enviado",
    preview: "Seu pedido #12345 foi despachado...",
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
  },
];

export default function EmailListExample() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-80 h-64 border rounded-md">
      <EmailList emails={mockEmails} selectedId={selected} onSelect={setSelected} />
    </div>
  );
}
