import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params } = body;

    const GATEWAY_ENDPOINT = `https://tpg.sanctum.so/v1/${
      process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
    }?apiKey=${process.env.NEXT_PUBLIC_GATEWAY_API_KEY}`;

    const response = await fetch(GATEWAY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "gateway-gauntlet",
        jsonrpc: "2.0",
        method,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gateway proxy error:", error);
    return NextResponse.json(
      { error: "Failed to process gateway request" },
      { status: 500 }
    );
  }
}
