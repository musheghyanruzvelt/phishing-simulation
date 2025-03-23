import { Loader2 } from "lucide-react";
import { locale } from "../locale";

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Loader2 className="h-10 w-10 animate-spin mb-4" />
      <p>{locale.list.states.loading}</p>
    </div>
  );
};
