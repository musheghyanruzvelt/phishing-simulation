import { InboxIcon } from "lucide-react";
import { locale } from "../locale";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <InboxIcon className="h-10 w-10 mb-4" />
      <p className="text-lg font-medium">{locale.list.states.empty.message}</p>
      <p className="mt-2">{locale.list.states.empty.description}</p>
    </div>
  );
};
