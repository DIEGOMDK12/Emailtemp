import { useState, useEffect, useCallback, useRef } from "react";
import { Mail, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EmailAddress } from "@/components/EmailAddress";
import { EmailList } from "@/components/EmailList";
import { EmailViewer } from "@/components/EmailViewer";
import { EmptyState } from "@/components/EmptyState";
import { type Email } from "@/components/EmailListItem";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { TempAddress, Email as ApiEmail } from "@shared/schema";

function mapApiEmailToEmail(apiEmail: ApiEmail): Email {
  return {
    id: apiEmail.id,
    from: apiEmail.from,
    subject: apiEmail.subject,
    preview: apiEmail.textBody?.substring(0, 100) || apiEmail.htmlBody?.substring(0, 100) || "",
    timestamp: new Date(apiEmail.timestamp),
    isRead: apiEmail.isRead,
    textBody: apiEmail.textBody,
    htmlBody: apiEmail.htmlBody,
  };
}

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [expiresIn, setExpiresIn] = useState(600);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  const { data: emailsData = [], refetch: refetchEmails, isLoading: isRefreshing } = useQuery<ApiEmail[]>({
    queryKey: ["/api/address", address, "emails"],
    enabled: !!address,
  });

  const emails = emailsData.map(mapApiEmailToEmail);
  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  const generateAddressMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/address");
      return res.json() as Promise<TempAddress>;
    },
    onSuccess: (data) => {
      setAddress(data.address);
      setExpiresAt(new Date(data.expiresAt));
      setSelectedEmailId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/address"] });
    },
  });

  const deleteEmailMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/address/${address}/emails/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/address", address, "emails"] });
      if (selectedEmailId === id) {
        setSelectedEmailId(null);
      }
      toast({
        title: "E-mail excluído",
        description: "O e-mail foi removido da sua caixa",
      });
    },
  });

  useEffect(() => {
    generateAddressMutation.mutate();
  }, []);

  useEffect(() => {
    if (!address) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", address }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "new_email") {
          queryClient.invalidateQueries({ queryKey: ["/api/address", address, "emails"] });
          toast({
            title: "Novo e-mail!",
            description: `De: ${data.data.from}`,
          });
        } else if (data.event === "email_deleted") {
          queryClient.invalidateQueries({ queryKey: ["/api/address", address, "emails"] });
        }
      } catch (e) {
        console.error("WebSocket message error:", e);
      }
    };

    return () => {
      ws.close();
    };
  }, [address, toast]);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      setExpiresIn(diff);

      if (diff <= 0) {
        generateAddressMutation.mutate();
        toast({
          title: "E-mail expirado",
          description: "Um novo endereço foi gerado automaticamente",
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, toast]);

  const handleRefresh = useCallback(() => {
    refetchEmails();
  }, [refetchEmails]);

  const handleCopyEmail = useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
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
  }, [address, toast]);

  const handleDeleteEmail = useCallback((id: string) => {
    deleteEmailMutation.mutate(id);
  }, [deleteEmailMutation]);

  const handleSelectEmail = useCallback((id: string) => {
    setSelectedEmailId(id);
    setMobileSheetOpen(false);
  }, []);

  const handleGenerateNew = useCallback(() => {
    generateAddressMutation.mutate();
    toast({
      title: "Novo e-mail gerado",
      description: "Seu endereço temporário foi atualizado",
    });
  }, [generateAddressMutation, toast]);

  if (!address) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Gerando endereço...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
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

      <div className="p-4 border-b bg-muted/30">
        <EmailAddress
          email={address}
          expiresIn={expiresIn}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
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
