// Vercel Node.js serverless entrypoint for Celestial Bloom.
// Forwards all requests to the TanStack React Start server.

import server from "../src/server";

export default async function handler(request: Request) {
  try {
    // Ensure request is a proper Request object
    if (!(request instanceof Request)) {
      return new Response("Invalid request", { status: 400 });
    }

    // Call the server's fetch handler
    const response = await server.fetch(request, {}, {});
    return response;
  } catch (error) {
    console.error("API handler error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { 
        status: 500, 
        headers: { "content-type": "application/json" } 
      }
    );
  }
}
