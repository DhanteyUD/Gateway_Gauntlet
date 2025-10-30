import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const GATEWAY_ENDPOINT = `https://tpg.sanctum.so/v1/${
      process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
    }?apiKey=${process.env.NEXT_PUBLIC_GATEWAY_API_KEY}`;

    console.log("📤 Sending to Gateway:", {
      method: body.method,
      paramsLength: body.params?.length,
    });

    const response = await fetch(GATEWAY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gateway API HTTP error:", response.status, errorText);
      throw new Error(`Gateway API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error("❌ Gateway API error response:", data.error);
    } else {
      console.log("✅ Gateway response received successfully");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gateway proxy error:", error);
    return NextResponse.json(
      {
        error: {
          code: -32000,
          message:
            "Failed to process gateway request: " + (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
