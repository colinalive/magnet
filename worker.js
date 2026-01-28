/**
 * cili.xyz - Cloudflare Worker
 * Handles clean URL routing for static site
 *
 * Routes:
 *   /                    -> index.html
 *   /search/{query}      -> search.html
 *   /detail/{hash}       -> detail.html
 *   /style.css           -> style.css
 *   /js/main.js          -> js/main.js
 */

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        // Handle static assets
        if (pathname === '/style.css' ||
            pathname === '/js/main.js' ||
            pathname.startsWith('/assets/')) {
            return env.ASSETS.fetch(request);
        }

        // Route handling
        let assetPath;

        if (pathname === '/' || pathname === '/index.html') {
            // Homepage
            assetPath = '/index.html';
        } else if (pathname.startsWith('/search/') || pathname === '/search') {
            // Search page: /search/{query}
            assetPath = '/search.html';
        } else if (pathname.startsWith('/detail/') || pathname === '/detail') {
            // Detail page: /detail/{hash}
            assetPath = '/detail.html';
        } else if (pathname === '/search.html' || pathname === '/detail.html') {
            // Direct HTML file access - redirect to clean URL
            const cleanPath = pathname.replace('.html', '');
            return Response.redirect(new URL(cleanPath, url.origin).href, 301);
        } else {
            // Try to serve as static asset, or return 404
            const assetResponse = await env.ASSETS.fetch(request);
            if (assetResponse.status === 200) {
                return assetResponse;
            }
            // 404 - redirect to home
            return Response.redirect(url.origin, 302);
        }

        // Fetch the HTML file
        const assetUrl = new URL(assetPath, url.origin);
        const assetRequest = new Request(assetUrl.href, {
            method: request.method,
            headers: request.headers,
        });

        const response = await env.ASSETS.fetch(assetRequest);

        // Add security headers
        const newHeaders = new Headers(response.headers);
        newHeaders.set('X-Content-Type-Options', 'nosniff');
        newHeaders.set('X-Frame-Options', 'DENY');
        newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    },
};
