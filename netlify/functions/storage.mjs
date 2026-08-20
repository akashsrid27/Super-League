import { getStore } from "@netlify/blobs";

// Single shared blob store for this app. Everyone hitting the site
// reads/writes the same "state" key, which is how the auction stays
// in sync across the moderator's screen and everyone else watching.
//
// The stored value is wrapped as { version, data }. Every write must
// declare the version it was based on (expectedVersion). If another
// tab/device has written since then, the version won't match and the
// write is rejected (409) instead of silently overwriting a newer
// state — this is what stops a stale background tab from undoing a
// more recent sale.
const STORE_NAME = "super-league-auction";
const KEY = "state";

export default async (req) => {
  const store = getStore(STORE_NAME);

  if (req.method === "GET") {
    const stored = await store.get(KEY, { type: "json" });
    const payload = stored ?? { version: 0, data: null };
    return new Response(JSON.stringify(payload), {
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

    const { expectedVersion, data } = body;
    const current = (await store.get(KEY, { type: "json" })) ?? { version: 0, data: null };

    if (typeof expectedVersion === "number" && expectedVersion !== current.version) {
      // Someone else already wrote a newer version. Reject this write and
      // hand back the current truth so the client can resync instead of
      // clobbering it.
      return new Response(JSON.stringify({ conflict: true, version: current.version, data: current.data }), {
        status: 409,
        headers: { "content-type": "application/json" },
      });
    }

    const nextVersion = current.version + 1;
    await store.setJSON(KEY, { version: nextVersion, data });
    return new Response(JSON.stringify({ ok: true, version: nextVersion }), {
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
