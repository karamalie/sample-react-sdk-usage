"use client";

import {
  useTriaAuth,
  useTriaWallet,
  AuthenticationStatus,
} from "@tria-sdk/authenticate-react";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const contractDetails = {
  contractAddress: "0x83627cE513F4dF9790016544E30143463D38C406",
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_maxAmount",
          type: "uint256",
        },
      ],
      name: "createCoupon",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
    {
      inputs: [],
      name: "getAmt",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getValue",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
  functionName: "createCoupon",
  args: ["1234"],
};

export default function ContractPage() {
  const { userState, isReady } = useTriaAuth();
  const { writeContract } = useTriaWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const executeContract = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await writeContract(contractDetails);
      console.log("Contract interaction result:", result);
    } catch (err) {
      console.error("Contract interaction failed:", err);
      setError(
        err instanceof Error ? err.message : "Contract interaction failed"
      );
    } finally {
      setIsLoading(false);
    }
  }, [writeContract]);

  useEffect(() => {
    // Redirect if not authenticated
    if (
      isReady &&
      userState.authenticationStatus !== AuthenticationStatus.AUTHENTICATED
    ) {
      router.push("/");
      return;
    }

    // Execute contract write when component mounts and user is authenticated
    if (
      isReady &&
      userState.authenticationStatus === AuthenticationStatus.AUTHENTICATED
    ) {
      executeContract();
    }
  }, [executeContract, isReady, router, userState.authenticationStatus]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Loading SDK...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contract Interaction</h1>

      {isLoading && (
        <div className="text-blue-600">Processing contract interaction...</div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="text-green-600 bg-green-50 p-4 rounded-lg">
          Contract interaction completed successfully!
        </div>
      )}

      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back to Home
      </button>
    </div>
  );
}
