// Vercel Edge entrypoint for Celestial Bloom.
// All requests are rewritten to this function in vercel.json.

import server from "../src/server";

const handler = server.default ?? server;

export default async function (request: Request) {
  return await handler.fetch(request, {}, {});
}
