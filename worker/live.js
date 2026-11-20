import { DurableObject } from "cloudflare:workers";

const COOKIE = "__Host-iqra_live";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const json = (body, status = 200, headers = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export class LiveCounters extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS presence (id TEXT PRIMARY KEY, seen INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS expiry ON presence(seen);
      CREATE TABLE IF NOT EXISTS frames (id TEXT PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS pledges (id TEXT PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS visitor_countries (country TEXT PRIMARY KEY, count INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS config (secret BLOB NOT NULL);`);
    this.sql.exec("INSERT INTO config SELECT randomblob(32) WHERE NOT EXISTS (SELECT 1 FROM config)");
    const { secret } = this.sql.exec("SELECT secret FROM config").one();
    this.key = crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign","verify"]);
  }

  async fetch(request) {
    const session = new URL(request.url).pathname === "/api/live/session";
    const token = request.headers.get("Cookie")?.split(/;\s*/).find(v => v.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1) || "";
    const [id, signature] = token.split(".");
    const key = await this.key;
    const bytes = new TextEncoder();
    const valid = uuid.test(id) && /^[0-9a-f]{64}$/.test(signature) &&
      await crypto.subtle.verify("HMAC", key, Uint8Array.from(signature.match(/../g), h => parseInt(h,16)), bytes.encode(id));
    if (session) {
      if (valid) return json({ready:true});
      const visitor = crypto.randomUUID();
      const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, bytes.encode(visitor)));
      const hex = Array.from(mac, b => b.toString(16).padStart(2,"0")).join("");
      return json({ready:true}, 200, {"Set-Cookie": COOKIE+"="+visitor+"."+hex+"; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=31536000"});
    }
    if (!valid) return json({error:"session"},401);
    let data;
    try { data = await request.json(); } catch { return json({error:"invalid JSON"},400); }
    if (!data || typeof data.pledge !== "boolean" || !Array.isArray(data.frames) ||
      data.frames.length > 50 || data.frames.some(v => typeof v !== "string" || !uuid.test(v))) return json({error:"invalid event"},400);
    const now = Date.now();
    return this.ctx.storage.transactionSync(() => {
      this.sql.exec("DELETE FROM presence WHERE seen <= ?", now - 90000);
      this.sql.exec("INSERT OR REPLACE INTO presence VALUES (?,?)",id,now);
      for (const frame of data.frames) this.sql.exec("INSERT OR IGNORE INTO frames VALUES (?)",frame);
      if (data.pledge) this.sql.exec("INSERT OR IGNORE INTO pledges VALUES (?)",id);
      const inserted = this.sql.exec("INSERT OR IGNORE INTO visitors VALUES (?)", id).rowsWritten;
      if (inserted) {
        const country = request.headers.get("X-Visitor-Country") || "ZZ";
        this.sql.exec("INSERT INTO visitor_countries VALUES (?,1) ON CONFLICT(country) DO UPDATE SET count=count+1", country);
      }
      const countries = this.sql.exec("SELECT country,count FROM visitor_countries ORDER BY count DESC,country").toArray();
      const totals = this.sql.exec(`SELECT (SELECT count(*) FROM presence) AS onlineVisitors,
        (SELECT count(*) FROM frames) AS totalFrames, (SELECT count(*) FROM pledges) AS pledgedAttendees,
        EXISTS(SELECT 1 FROM pledges WHERE id=?) AS hasPledged`,id).one();
      return json({...totals, countries, totalVisitors: countries.reduce((sum, row) => sum + row.count, 0)});
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/live/")) return env.ASSETS.fetch(request);
    if (!["/api/live/session","/api/live/sync"].includes(url.pathname)) return json({},404);
    if (request.method !== "POST") return json({},405,{Allow:"POST"});
    if (request.headers.get("Origin") !== url.origin || request.headers.get("Content-Type") !== "application/json") return json({},403);
    const forwarded = new Request(request);
    const country = request.cf?.country;
    forwarded.headers.set("X-Visitor-Country", /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : "ZZ");
    return env.LIVE.getByName("mahfil-2026").fetch(forwarded);
  }
};
