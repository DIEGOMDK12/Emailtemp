import { useState, useEffect, useCallback } from "react";
import { Mail, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EmailAddress } from "@/components/EmailAddress";
import { EmailList } from "@/components/EmailList";
import { EmailViewer } from "@/components/EmailViewer";
import { EmptyState } from "@/components/EmptyState";
import { type Email } from "@/components/EmailListItem";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function generateRandomEmail(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${result}@tempmail.io`;
}

// todo: remove mock functionality - replace with real API data
const mockEmails: Email[] = [
  {
    id: "1",
    from: "newsletter@empresa.com.br",
    subject: "Confirme seu cadastro na plataforma",
    preview: "Clique no link abaixo para confirmar seu e-mail e ativar sua conta...",
    timestamp: new Date(Date.now() - 120000),
    isRead: false,
    textBody: `Olá!

Obrigado por se cadastrar em nossa plataforma.

Para confirmar seu e-mail, clique no link abaixo:
https://exemplo.com/confirmar/abc123

Se você não solicitou este cadastro, ignore este e-mail.

Atenciosamente,
Equipe de Suporte`,
  },
  {
    id: "2",
    from: "suporte@loja.com.br",
    subject: "Seu pedido #12345 foi enviado!",
    preview: "Boas notícias! Seu pedido foi despachado e está a caminho...",
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
    textBody: `Olá Cliente!

Boas notícias! Seu pedido #12345 foi despachado.

Código de rastreamento: BR123456789XX
Previsão de entrega: 3-5 dias úteis

Acompanhe seu pedido em: https://correios.com.br/rastreamento

Obrigado por comprar conosco!`,
  },
  {
    id: "3",
    from: "no-reply@rede-social.com",
    subject: "Alguém curtiu sua publicação",
    preview: "João Silva curtiu sua foto. Veja o que mais está acontecendo...",
    timestamp: new Date(Date.now() - 7200000),
    isRead: true,
    textBody: `João Silva curtiu sua publicação.

Veja o que mais está acontecendo na sua rede!

Acesse: https://rede-social.com/notificacoes`,
  },
];

export default function Home() {
  const [email, setEmail] = useState(() => generateRandomEmail());
  const [expiresIn, setExpiresIn] = useState(600); // 10 minutes
  const [emails, setEmails] = useState<Email[]>(mockEmails); // todo: remove mock functionality
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const { toast } = useToast();

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          setEmail(generateRandomEmail());
          setEmails([]);
          setSelectedEmailId(null);
          toast({
            title: "E-mail expirado",
            description: "Um novo endereço foi gerado automaticamente",
          });
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toast]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // todo: remove mock functionality - replace with real API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Caixa atualizada",
        description: "Nenhum novo e-mail encontrado",
      });
    }, 1000);
  }, [toast]);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast({
        title: "Copiado!",
        description: "E-mail copiado para a área de transferência",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o e-mail",
        variant: "destructive",
      });
    }
  }, [email, toast]);

  const handleDeleteEmail = useCallback((id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmailId === id) {
      setSelectedEmailId(null);
    }
    toast({
      title: "E-mail excluído",
      description: "O e-mail foi removido da sua caixa",
    });
  }, [selectedEmailId, toast]);

  const handleSelectEmail = useCallback((id: string) => {
    setSelectedEmailId(id);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
    );
    setMobileSheetOpen(false);
  }, []);

  const handleGenerateNew = useCallback(() => {
    setEmail(generateRandomEmail());
    setExpiresIn(600);
    setEmails([]);
    setSelectedEmailId(null);
    toast({
      title: "Novo e-mail gerado",
      description: "Seu endereço temporário foi atualizado",
    });
  }, [toast]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 p-4 border-b bg-card flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-md">
            <Mail className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold" data-testid="text-app-title">
            TempMail
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerateNew} data-testid="button-generate-new">
            Novo E-mail
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Email Address Bar */}
      <div className="p-4 border-b bg-muted/30">
        <EmailAddress
          email={email}
          expiresIn={expiresIn}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-80 border-r bg-sidebar">
          <div className="p-3 border-b">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Caixa de Entrada ({emails.length})
            </h2>
          </div>
          {emails.length > 0 ? (
            <EmailList
              emails={emails}
              selectedId={selectedEmailId}
              onSelect={handleSelectEmail}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-sm text-muted-foreground text-center">
                Nenhum e-mail recebido
              </p>
            </div>
          )}
        </aside>

        {/* Mobile Menu */}
        <div className="lg:hidden absolute bottom-4 left-4 z-50">
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5 mr-2" />
                Caixa ({emails.length})
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Caixa de Entrada</SheetTitle>
              </SheetHeader>
              {emails.length > 0 ? (
                <EmailList
                  emails={emails}
                  selectedId={selectedEmailId}
                  onSelect={handleSelectEmail}
                />
              ) : (
                <div className="flex items-center justify-center p-8">
                  <p className="text-sm text-muted-foreground">
                    Nenhum e-mail recebido
                  </p>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Email Viewer / Empty State */}
        <main className="flex-1 overflow-hidden">
          {selectedEmail ? (
            <EmailViewer
              email={selectedEmail}
              onDelete={handleDeleteEmail}
              showBackButton={true}
              onBack={() => setSelectedEmailId(null)}
            />
          ) : (
            <EmptyState onCopyEmail={handleCopyEmail} />
          )}
        </main>
      </div>
    </div>
  );
}
