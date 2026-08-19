import { getStore } from "@netlify/blobs";

// Single shared blob store for this app. Everyone hitting the site
// reads/writes the same "state" key, which is how the auction stays
// in sync across the moderator's screen and everyone else watching.
const STORE_NAME = "super-league-auction";
const KEY = "state";

export default async (req) => {
  const store = getStore(STORE_NAME);

  if (req.method === "GET") {
    const value = await store.get(KEY, { type: "json" });
    return new Response(JSON.stringify(value ?? {}), {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST" || req.method === "PUT") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    await store.setJSON(KEY, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

// Exposes this function at /api/storage instead of the default
// /.netlify/functions/storage path.
export const config = {
  path: "/api/storage",
};
