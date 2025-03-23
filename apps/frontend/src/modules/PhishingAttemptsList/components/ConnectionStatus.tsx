import { FC } from "react";
import { WifiIcon, WifiOffIcon, LockIcon, UnlockIcon } from "lucide-react";
import { locale } from "../locale";

interface ConnectionStatusProps {
  connected: boolean;
  authenticated: boolean;
}

export const ConnectionStatus: FC<ConnectionStatusProps> = ({
  connected,
  authenticated,
}) => {
  return (
    <div className="flex gap-4">
      <div
        className={`flex items-center gap-2 text-sm ${
          connected ? "text-green-600" : "text-red-600"
        }`}
      >
        {connected ? (
          <WifiIcon className="h-4 w-4" />
        ) : (
          <WifiOffIcon className="h-4 w-4" />
        )}
        <span>
          {connected
            ? locale.connection.status.connected
            : locale.connection.status.disconnected}
        </span>
      </div>

      {connected && (
        <div
          className={`flex items-center gap-2 text-sm ${
            authenticated ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {authenticated ? (
            <LockIcon className="h-4 w-4" />
          ) : (
            <UnlockIcon className="h-4 w-4" />
          )}
          <span>
            {authenticated
              ? locale.connection.status.authenticated
              : locale.connection.status.unauthenticated}
          </span>
        </div>
      )}
    </div>
  );
};
