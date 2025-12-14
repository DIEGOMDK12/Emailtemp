import { Inbox, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCopyEmail: () => void;
}

export function EmptyState({ onCopyEmail }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-muted rounded-full p-4 mb-4">
        <Inbox className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2" data-testid="text-empty-title">
        Nenhum e-mail ainda
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm" data-testid="text-empty-description">
        Sua caixa de entrada temporária está vazia. Envie um e-mail para o endereço acima para testá-lo.
      </p>
      <Button onClick={onCopyEmail} data-testid="button-copy-email-empty">
        <Copy className="h-4 w-4 mr-2" />
        Copiar Endereço
      </Button>
    </div>
  );
}
