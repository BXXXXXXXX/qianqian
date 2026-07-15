import { createKtosLoop } from "../../../packages/domain/src/ktosLoop.js";
import { JsonStore } from "../../../packages/domain/src/storage/JsonStore.js";
import { json, notFound, readJsonBody, route, sendError, staticFile } from "./http.js";

const webRoot = new URL("../../web/", import.meta.url);

export function createApp(options = {}) {
  const store = options.store ?? new JsonStore(options.storeFile);
  const ktos = options.ktos ?? createKtosLoop({ store });

  return async function app(req, res) {
    try {
      if (req.method === "GET" && req.url === "/") {
        return staticFile(res, new URL("index.html", webRoot));
      }

      if (req.method === "GET" && req.url === "/app.js") {
        return staticFile(res, new URL("app.js", webRoot));
      }

      if (req.method === "GET" && req.url === "/style.css") {
        return staticFile(res, new URL("style.css", webRoot));
      }

      if (req.method === "GET" && req.url === "/health") {
        return json(res, 200, { ok: true, service: "ktos-backend" });
      }

      const recordRoute = route(req, "POST", "/api/v1/records");
      if (recordRoute) {
        const body = await readJsonBody(req);
        return json(res, 201, ktos.record(body));
      }

      const factsRoute = route(req, "GET", "/api/v1/facts");
      if (factsRoute) {
        const url = new URL(req.url, "http://localhost");
        return json(res, 200, ktos.listFacts({
          teacherId: url.searchParams.get("teacherId") ?? undefined,
          status: url.searchParams.get("status") ?? undefined
        }));
      }

      const confirmFactRoute = route(req, "POST", "/api/v1/facts/:factId/confirm");
      if (confirmFactRoute) {
        const body = await readJsonBody(req);
        return json(res, 200, ktos.confirmFact({
          factId: confirmFactRoute.params.factId,
          teacherId: body.teacherId
        }));
      }

      const rejectFactRoute = route(req, "POST", "/api/v1/facts/:factId/reject");
      if (rejectFactRoute) {
        const body = await readJsonBody(req);
        return json(res, 200, ktos.rejectFact({
          factId: rejectFactRoute.params.factId,
          teacherId: body.teacherId,
          reason: body.reason
        }));
      }

      const timelineRoute = route(req, "GET", "/api/v1/timeline");
      if (timelineRoute) {
        const url = new URL(req.url, "http://localhost");
        return json(res, 200, ktos.getTimeline({
          teacherId: url.searchParams.get("teacherId") ?? undefined,
          classId: url.searchParams.get("classId") ?? undefined,
          date: url.searchParams.get("date") ?? undefined
        }));
      }

      const reportRoute = route(req, "POST", "/api/v1/reports/daily");
      if (reportRoute) {
        const body = await readJsonBody(req);
        return json(res, 201, ktos.generateDailyReport(body));
      }

      const getReportRoute = route(req, "GET", "/api/v1/reports/:reportId");
      if (getReportRoute) {
        return json(res, 200, ktos.getReport(getReportRoute.params.reportId));
      }

      const confirmReportRoute = route(req, "POST", "/api/v1/reports/:reportId/confirm");
      if (confirmReportRoute) {
        const body = await readJsonBody(req);
        return json(res, 200, ktos.confirmReport({
          reportId: confirmReportRoute.params.reportId,
          teacherId: body.teacherId
        }));
      }

      const inboxRoute = route(req, "GET", "/api/v1/inbox/today");
      if (inboxRoute) {
        const url = new URL(req.url, "http://localhost");
        return json(res, 200, ktos.getTodayInbox({
          teacherId: url.searchParams.get("teacherId") ?? undefined,
          classId: url.searchParams.get("classId") ?? undefined,
          date: url.searchParams.get("date") ?? undefined
        }));
      }

      return notFound(res);
    } catch (error) {
      return sendError(res, error);
    }
  };
}
