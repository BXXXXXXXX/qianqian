export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

export function json(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

export function notFound(res) {
  json(res, 404, { error: "Not found." });
}

export function sendError(res, error) {
  json(res, error.statusCode ?? 500, {
    error: error.message ?? "Unexpected error."
  });
}

export function route(req, method, pattern) {
  if (req.method !== method) {
    return null;
  }

  const url = new URL(req.url, "http://localhost");
  const actualParts = url.pathname.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);

  if (actualParts.length !== patternParts.length) {
    return null;
  }

  const params = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index];
    const actual = actualParts[index];

    if (expected.startsWith(":")) {
      params[expected.slice(1)] = decodeURIComponent(actual);
      continue;
    }

    if (expected !== actual) {
      return null;
    }
  }

  return { params };
}
