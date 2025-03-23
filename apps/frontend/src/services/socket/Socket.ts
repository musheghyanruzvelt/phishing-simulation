import { io, Socket } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
import { tokenService } from "@/common/tokenService";

class SocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;
  private authenticated: boolean = false;

  initialize() {
    if (!this.socket) {
      this.socket = io(window.location.origin, {
        transports: ["websocket", "polling"],
        path: "/api/management/socket.io",
        query: {
          token: tokenService.getToken() || "",
        },
      });

      this.setupEventListeners();
    }
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.connected = true;

      this.authenticate();
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      this.connected = false;
      this.authenticated = false;
    });

    this.socket.on("welcome", (data) => {
      console.log("Welcome received:", data);
    });

    this.socket.on("authSuccess", (data) => {
      console.log("Authentication successful:", data);
      this.authenticated = true;
    });

    this.socket.on("subscriptionConfirmed", (data) => {
      console.log("Subscription confirmed:", data);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  authenticate() {
    if (!this.socket || !this.connected) return;
    console.log("Authenticating socket...");
    this.socket.emit("authenticate");
  }

  subscribeToAttempts() {
    if (!this.socket || !this.connected) return;
    console.log("Subscribing to phishing attempts");
    this.socket.emit("subscribeToPhishingAttempts");
  }

  unsubscribeFromAttempts() {
    if (!this.socket || !this.connected) return;
    console.log("Unsubscribing from phishing attempts");
    this.socket.emit("unsubscribeFromPhishingAttempts");
  }

  ping() {
    if (!this.socket || !this.connected) return;
    this.socket.emit("ping");
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.connected;
  }

  isAuthenticated() {
    return this.authenticated;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.authenticated = false;
    }
  }
}

export const socketService = new SocketService();

export const useSocketConnection = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(socketService.isConnected());
  const [authenticated, setAuthenticated] = useState(
    socketService.isAuthenticated()
  );

  useEffect(() => {
    const socketInstance = socketService.initialize();
    setSocket(socketInstance);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => {
      setConnected(false);
      setAuthenticated(false);
    };
    const handleAuthSuccess = () => setAuthenticated(true);

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("authSuccess", handleAuthSuccess);

    const pingInterval = setInterval(() => {
      socketService.ping();
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("authSuccess", handleAuthSuccess);
    };
  }, []);

  const subscribeToAttempts = useCallback(() => {
    socketService.subscribeToAttempts();
  }, []);

  const unsubscribeFromAttempts = useCallback(() => {
    socketService.unsubscribeFromAttempts();
  }, []);

  return {
    socket,
    connected,
    authenticated,
    subscribeToAttempts,
    unsubscribeFromAttempts,
    getSocket: () => socketService.getSocket(),
  };
};
