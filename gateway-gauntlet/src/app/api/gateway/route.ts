// app/api/gateway/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params } = body;

    const GATEWAY_ENDPOINT = `https://tpg.sanctum.so/v1/${
      process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
    }?apiKey=${process.env.NEXT_PUBLIC_GATEWAY_API_KEY}`;

    const gatewayRequest = {
      jsonrpc: "2.0",
      id: "gateway-gauntlet",
      method,
      params,
    };

    console.log("📤 Sending to Gateway:", {
      method,
      paramsLength: params?.length,
      firstParamLength: params?.[0]?.length,
    });

    const response = await fetch(GATEWAY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gatewayRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gateway API error:", response.status, errorText);
      throw new Error(`Gateway API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Gateway response received");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gateway proxy error:", error);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: "gateway-gauntlet",
        error: {
          code: -32000,
          message: "Failed to process gateway request",
          data: { originalError: (error as Error).message },
        },
      },
      { status: 500 }
    );
  }
}
