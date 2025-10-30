import { NextResponse } from "next/server";
import { Transaction, PublicKey } from "@solana/web3.js";

export async function POST() {
  try {
    const GATEWAY_ENDPOINT = `https://tpg.sanctum.so/v1/devnet?apiKey=${process.env.NEXT_PUBLIC_GATEWAY_API_KEY}`;

    const testTransaction = new Transaction();
    testTransaction.recentBlockhash = "11111111111111111111111111111111";
    testTransaction.feePayer = new PublicKey(
      "11111111111111111111111111111111"
    );

    const serialized = testTransaction.serialize({
      requireAllSignatures: false,
    });
    const encodedTransaction = Buffer.from(serialized).toString("base64");

    const testRequest = {
      id: "test-format",
      jsonrpc: "2.0",
      method: "buildGatewayTransaction",
      params: [
        encodedTransaction,
        {
          encoding: "base64",
          skipSimulation: true,
        },
      ],
    };

    console.log("📤 Test request:", JSON.stringify(testRequest, null, 2));

    const response = await fetch(GATEWAY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testRequest),
    });

    const data = await response.json();

    return NextResponse.json({
      status: response.status,
      request: testRequest,
      response: data,
    });
  } catch (error) {
    return NextResponse.json({
      error: (error as Error).message,
    });
  }
}
