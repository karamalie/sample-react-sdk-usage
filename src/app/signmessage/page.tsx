"use client";

import {
  useTriaAuth,
  useTriaWallet,
  AuthenticationStatus,
} from "@tria-sdk/authenticate-react";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignMessagePage() {
  const { userState, isReady } = useTriaAuth();
  const { signMessage } = useTriaWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const messageToSign = "Hello from Tria SDK!"; // You can customize this message

  const executeSignMessage = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await signMessage(messageToSign);
      console.log("Message signature:", result);
      setSignature(result?.data || null);
    } catch (err) {
      console.error("Message signing failed:", err);
      setError(err instanceof Error ? err.message : "Message signing failed");
    } finally {
      setIsLoading(false);
    }
  }, [signMessage]);

  useEffect(() => {
    // Redirect if not authenticated
    if (
      isReady &&
      userState.authenticationStatus !== AuthenticationStatus.AUTHENTICATED
    ) {
      router.push("/");
      return;
    }

    // Execute sign message when component mounts and user is authenticated
    if (
      isReady &&
      userState.authenticationStatus === AuthenticationStatus.AUTHENTICATED
    ) {
      executeSignMessage();
    }
  }, [executeSignMessage, isReady, router, userState.authenticationStatus]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Loading SDK...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sign Message</h1>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-medium mb-2">Message to Sign</h2>
        <p className="font-mono bg-white dark:bg-gray-900 p-3 rounded">
          {messageToSign}
        </p>
      </div>

      {isLoading && <div className="text-blue-600">Signing message...</div>}

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
      )}

      {!isLoading && !error && signature && (
        <div className="space-y-4">
          <div className="text-green-600 bg-green-50 p-4 rounded-lg">
            Message signed successfully!
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Signature</h2>
            <p className="font-mono bg-white dark:bg-gray-900 p-3 rounded break-all">
              {signature}
            </p>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Home
        </button>
        {!isLoading && (
          <button
            onClick={executeSignMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Again
          </button>
        )}
      </div>
    </div>
  );
}
