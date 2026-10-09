// Route all requests through this guard before serving static assets.
const forbiddenSegment = /(^|\/)(?:\.[^/]+)(?:\/|$)/;
const forbiddenName = /(?:^|\/)(?:wrangler\.(?:toml|jsonc?|yaml)|package(?:-lock)?\.json|\.env(?:\.[^/]*)?|\.gitignore|\.assetsignore)(?:$|\/)/i;
export default {
  async fetch(request, env) {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response('Not Found', {status:404}); }
    const normalized = pathname.replace(/\\/g,'/');
    if (forbiddenSegment.test(normalized) || forbiddenName.test(normalized)) {
      return new Response('Not Found', {
        status:404,
        headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}
      });
    }
    return env.ASSETS.fetch(request);
  }
};
