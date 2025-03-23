import { useEffect } from "react";
import { useSocketConnection } from "@/services/socket/Socket";
import { usePhishingQuery } from "@/services/phishing/usePhishingQuery";
import { PhishingAttempt } from "@phishing-simulation/types";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import { PhishingAttemptsTable } from "./components/PhishingAttemtsTable";
import { locale } from "./locale";

export const PhishingAttemptsList = () => {
  const { usePhishingAttempts } = usePhishingQuery();
  const { data, refetch, isError, isLoading } = usePhishingAttempts();
  const socketConnection = useSocketConnection();

  useEffect(() => {
    const subscribeTimer = setTimeout(() => {
      socketConnection.subscribeToAttempts();
    }, 1000);

    return () => {
      clearTimeout(subscribeTimer);
      socketConnection.unsubscribeFromAttempts();
    };
  }, [socketConnection]);

  useEffect(() => {
    const setupSocketListeners = () => {
      const socket = socketConnection.getSocket();
      if (!socket) return { cleanup: () => {} };

      const handleAttemptUpdate = (updatedAttempt: PhishingAttempt) => {
        console.log("RECEIVED UPDATE:", updatedAttempt);
        refetch();
      };

      const handleStatusChange = (data: {
        phishingAttempt: PhishingAttempt;
        previousStatus: string;
      }) => {
        console.log("RECEIVED STATUS CHANGE:", data);
        refetch();
      };

      socket.on("phishingAttemptUpdated", handleAttemptUpdate);
      socket.on("phishingAttemptStatusChanged", handleStatusChange);

      return {
        cleanup: () => {
          socket.off("phishingAttemptUpdated", handleAttemptUpdate);
          socket.off("phishingAttemptStatusChanged", handleStatusChange);
        },
      };
    };

    const { cleanup } = setupSocketListeners();
    return cleanup;
  }, [socketConnection, refetch]);

  const attempts = data?.attempts || [];

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (isError) {
      return <ErrorDisplay onRetry={refetch} />;
    }

    if (attempts.length === 0) {
      return <EmptyState />;
    }

    return <PhishingAttemptsTable attempts={attempts} />;
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {locale.list.title}
        </h1>
        <div className="flex items-center gap-4">
          <ConnectionStatus
            connected={socketConnection.connected}
            authenticated={socketConnection.authenticated}
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default PhishingAttemptsList;
