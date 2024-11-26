"use client";

import { ReactNode } from "react";
import { TriaProvider } from "@tria-sdk/authenticate-react";
import {
  TriaAuthModal,
  useTriaAuth,
  AuthenticationStatus,
} from "@tria-sdk/authenticate-react";
import "@tria-sdk/authenticate-react/dist/style.css";

interface AppProps {
  children: ReactNode;
}

export default function App({ children }: AppProps) {
  const initialConfig = {
    analyticsKeys: {
      clientId: "b48d8230-57f9-43fb-a952-722668bb3521",
      projectId: "f5c9aa2c-a94e-42c5-a85b-b943f07b8bc9",
    },
    chain: "ETH",
    environment: "mainnet" as const,
    autoDIDCreationEnabled: true,
  };

  const initialUIConfig = {
    modalMode: true,
    darkMode: true,
    dappName: "Contract Demo",
    showPoweredByTria: true,
    layout: ["email-phone", "web2", "divider", "web3"],
    emailPhoneLoginMethods: ["email", "phone"],
    web2LoginMethods: ["google", "twitter", "apple", "discord"],
    web3LoginMethods: ["metamask", "walletconnect"],
  };

  const initialWalletUIConfig = {
    darkMode: true,
    primaryColor: "#7D40FF",
  };

  return (
    <TriaProvider
      initialConfig={initialConfig}
      initialUIConfig={initialUIConfig}
      initialWalletUIConfig={initialWalletUIConfig}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Auth Modal - Required for authentication */}
        <TriaAuthModal />

        {/* Header */}
        <header className="bg-white shadow-sm dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contract Demo
              </h1>
              <AuthButtons />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </TriaProvider>
  );
}

// Separate component for auth buttons
function AuthButtons() {
  const { showAuthModal, logout, userState, isReady } = useTriaAuth();

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userState.authenticationStatus === AuthenticationStatus.AUTHENTICATED ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {userState.loginId}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => showAuthModal({ intentOrigin: "user-action" })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      )}
    </div>
  );
}
