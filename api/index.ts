// Vercel Edge entrypoint for Celestial Bloom.
// Forwards all requests to the TanStack React Start server.

import server from "../src/server";

export default async function handler(request: Request) {
  try {
    // Call the fetch handler with empty env and ctx
    const response = await server.fetch(request, {}, {});
    return response;
  } catch (error) {
    console.error("Vercel Edge handler error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
