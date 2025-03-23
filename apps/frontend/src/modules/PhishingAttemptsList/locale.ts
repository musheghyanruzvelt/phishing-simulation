// src/locales/phishingAttempts.locale.ts

export const locale = {
  list: {
    title: "Phishing Attempts",
    states: {
      loading: "Loading phishing attempts...",
      error: {
        message: "Failed to load phishing attempts",
        retryButton: "Try Again",
      },
      empty: {
        message: "No phishing attempts found",
        description: "Create a new phishing simulation to get started",
      },
    },
  },

  table: {
    headers: {
      status: "Status",
      targetEmail: "Target Email",
      content: "Content",
      created: "Created",
      clicked: "Clicked",
    },
    values: {
      notAvailable: "N/A",
    },
  },

  connection: {
    status: {
      connected: "Connected",
      disconnected: "Disconnected",
      authenticated: "Authenticated",
      unauthenticated: "Unauthenticated",
    },
  },
};
