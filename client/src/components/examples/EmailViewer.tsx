import { EmailViewer } from "../EmailViewer";

const mockEmail = {
  id: "1",
  from: "newsletter@empresa.com",
  subject: "Confirme seu cadastro na plataforma",
  preview: "Clique no link abaixo para confirmar seu e-mail...",
  timestamp: new Date(Date.now() - 120000),
  isRead: true,
  textBody: `Olá!

Obrigado por se cadastrar em nossa plataforma.

Para confirmar seu e-mail, clique no link abaixo:
https://exemplo.com/confirmar/abc123

Se você não solicitou este cadastro, ignore este e-mail.

Atenciosamente,
Equipe de Suporte`,
};

export default function EmailViewerExample() {
  return (
    <div className="w-full h-96 border rounded-md">
      <EmailViewer
        email={mockEmail}
        onDelete={(id) => console.log("Delete email:", id)}
        showBackButton={true}
        onBack={() => console.log("Back clicked")}
      />
    </div>
  );
}
