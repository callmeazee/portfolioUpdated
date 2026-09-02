/*
 * The boilerplate routed this through src/api/{routes,controllers,services} —
 * three files of Express-style indirection to return a static object. Collapsed
 * per CLAUDE.md §14 (no unnecessary abstractions).
 */
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
