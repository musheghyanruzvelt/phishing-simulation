import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { locale } from "../locale";

interface ErrorDisplayProps {
  onRetry: () => void;
}

export const ErrorDisplay = ({ onRetry }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-red-500">
      <AlertTriangle className="h-10 w-10 mb-4" />
      <p className="mb-4">{locale.list.states.error.message}</p>
      <Button onClick={onRetry} variant="outline">
        {locale.list.states.error.retryButton}
      </Button>
    </div>
  );
};
