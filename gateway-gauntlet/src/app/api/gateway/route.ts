import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params, id, jsonrpc } = body;

    if (!method) {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id || null,
          error: {
            code: -32600,
            message: "Missing method in request",
          },
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GATEWAY_API_KEY;
    if (!apiKey) {
      console.error("❌ No Gateway API key configured");
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id || null,
          error: {
            code: -32000,
            message: "Gateway API key not configured",
          },
        },
        { status: 500 }
      );
    }

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
    const GATEWAY_ENDPOINT = `https://tpg.sanctum.so/v1/${network}?apiKey=${apiKey}`;

    const gatewayRequest = {
      jsonrpc: jsonrpc || "2.0",
      id: id || "gateway-gauntlet",
      method,
      params: params || [],
    };

    console.log("📤 Sending to Gateway:", {
      endpoint: `https://tpg.sanctum.so/v1/${network}`,
      method,
      paramsLength: params?.length,
      hasApiKey: !!apiKey,
    });

    const response = await fetch(GATEWAY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gatewayRequest),
    });

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "❌ Failed to parse Gateway response:",
        responseText,
        "parseError:",
        parseError
      );
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id || null,
          error: {
            code: -32603,
            message: "Invalid JSON response from Gateway",
            data: { responseText: responseText.slice(0, 200) },
          },
        },
        { status: 502 }
      );
    }

    if (data.error) {
      console.error("❌ Gateway API error response:", {
        method,
        error: data.error,
      });
    } else {
      console.log("✅ Gateway response received successfully:", {
        method,
        hasResult: !!data.result,
      });
    }

    return NextResponse.json(data, {
      status: response.ok ? 200 : response.status,
    });
  } catch (error) {
    console.error("❌ Gateway proxy error:", error);

    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32000,
          message: "Failed to process gateway request",
          data: {
            originalError: (error as Error).message,
            stack:
              process.env.NODE_ENV === "development"
                ? (error as Error).stack
                : undefined,
          },
        },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GATEWAY_API_KEY;
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";

  return NextResponse.json({
    status: "ok",
    hasApiKey: !!apiKey,
    network,
    endpoint: `https://tpg.sanctum.so/v1/${network}`,
  });
}
