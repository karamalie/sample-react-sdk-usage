"use client";

import {
  useTriaAuth,
  AuthenticationStatus,
} from "@tria-sdk/authenticate-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { userState, isReady } = useTriaAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to contract page when authentication is successful
    if (
      isReady &&
      userState.authenticationStatus === AuthenticationStatus.AUTHENTICATED
    ) {
      router.push("/signmessage");
    }
  }, [userState.authenticationStatus, isReady, router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Tria Demo</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {userState.authenticationStatus === AuthenticationStatus.AUTHENTICATED
            ? "Redirecting to contract interaction..."
            : "Please login to continue"}
        </p>
      </div>
    </div>
  );
}
