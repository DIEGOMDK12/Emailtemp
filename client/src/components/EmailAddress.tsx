import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EmailAddressProps {
  email: string;
  expiresIn: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function EmailAddress({ email, expiresIn, onRefresh, isRefreshing }: EmailAddressProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "E-mail copiado para a área de transferência",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o e-mail",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-card border border-card-border rounded-md px-4 py-2 flex-1 min-w-0">
          <span 
            className="font-mono text-lg md:text-xl truncate"
            data-testid="text-email-address"
          >
            {email}
          </span>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={handleCopy}
          data-testid="button-copy-email"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          data-testid="button-refresh-inbox"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Expira em:</span>
        <span className="font-mono font-medium" data-testid="text-expiration-timer">
          {formatTime(expiresIn)}
        </span>
      </div>
    </div>
  );
}
