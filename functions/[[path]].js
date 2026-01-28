/**
 * Cloudflare Pages Function
 * 处理 clean URLs 路由
 */

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 静态资源直接放行
    if (
        pathname === '/style.css' ||
        pathname.startsWith('/js/') ||
        pathname.startsWith('/assets/') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.png')
    ) {
        return env.ASSETS.fetch(request);
    }

    // 路由映射
    let assetPath;

    if (pathname === '/' || pathname === '/index.html') {
        assetPath = '/index.html';
    } else if (pathname.startsWith('/search')) {
        assetPath = '/search.html';
    } else if (pathname.startsWith('/detail')) {
        assetPath = '/detail.html';
    } else {
        // 尝试作为静态资源，或返回首页
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.status === 200) {
            return assetResponse;
        }
        assetPath = '/index.html';
    }

    // 获取对应的 HTML 文件
    const assetUrl = new URL(assetPath, url.origin);
    return env.ASSETS.fetch(new Request(assetUrl.href, request));
}
