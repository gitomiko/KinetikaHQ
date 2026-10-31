const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const ROOT_DIR = path.join(__dirname, "site");
const INDEX_PATH = path.join(ROOT_DIR, "index.html");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    if (!key || process.env[key] !== undefined) continue;
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function setCommonHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cache-Control", "no-store");
}

function sendText(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

function sendFile(res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(statusCode, { "Content-Type": contentType });
  const stream = fs.createReadStream(filePath);
  stream.on("error", () => sendText(res, 500, "Internal Server Error"));
  stream.pipe(res);
}

function resolveRequestPath(urlPathname) {
  const decodedPath = decodeURIComponent(urlPathname);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(ROOT_DIR, safePath);
  if (!absolutePath.startsWith(ROOT_DIR)) return null;
  return absolutePath;
}

loadEnvFile(path.join(__dirname, ".env"));

const host = process.env.TOOLS_BIND_IP || "127.0.0.1";
const port = Number.parseInt(process.env.TOOLS_HTTP_PORT || "8088", 10);
const edgeUpstream = process.env.KINETIKA_EDGE_UPSTREAM || "";

function proxyRequest(req, res) {
  let upstreamUrl;
  try {
    upstreamUrl = new URL(req.url || "/", edgeUpstream);
  } catch {
    return sendText(res, 500, "Invalid edge upstream");
  }

  const transport = upstreamUrl.protocol === "https:" ? https : http;
  const forwardedFor = [req.headers["x-forwarded-for"], req.socket.remoteAddress]
    .filter(Boolean)
    .join(", ");
  const headers = {
    ...req.headers,
    host: upstreamUrl.host,
    "x-forwarded-for": forwardedFor,
    "x-forwarded-host": req.headers.host || "",
    "x-forwarded-proto": req.socket.encrypted ? "https" : "http",
  };

  const proxyReq = transport.request(
    upstreamUrl,
    {
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", () => sendText(res, 502, "Bad Gateway"));
  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  if (edgeUpstream) return proxyRequest(req, res);

  setCommonHeaders(res);
  if (!req.url) return sendText(res, 400, "Bad Request");
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;

  if (pathname === "/healthz") return sendText(res, 200, "ok");

  const candidatePath = resolveRequestPath(pathname);
  if (!candidatePath) return sendText(res, 403, "Forbidden");

  fs.stat(candidatePath, (err, stats) => {
    if (!err && stats.isFile()) return sendFile(res, candidatePath);

    if (!err && stats.isDirectory()) {
      const nestedIndex = path.join(candidatePath, "index.html");
      return fs.stat(nestedIndex, (nestedErr, nestedStats) => {
        if (!nestedErr && nestedStats.isFile()) return sendFile(res, nestedIndex);
        return sendText(res, 404, "Not Found");
      });
    }

    if (!path.basename(pathname).includes(".")) {
      return sendFile(res, INDEX_PATH);
    }

    return sendText(res, 404, "Not Found");
  });
});

server.listen(port, host, () => {
  process.stdout.write(`Kinetika HQ listening on http://${host}:${port}\n`);
});
