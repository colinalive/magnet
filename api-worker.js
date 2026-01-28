/**
 * api.cili.xyz - Cloudflare Worker API
 * 通过 VPS 桥接 (hands.cili.xyz) 访问 BitSearch API
 *
 * 端点：
 *   GET /?q={keyword}     - 搜索
 *   GET /detail/{id}      - 获取详情
 *
 * 注意：BitSearch 阻止 Cloudflare Worker 直接访问，
 *       必须通过 VPS 做桥接
 */

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
};

// 🔥 VPS 桥接配置
const VPS_API = 'http://hands.cili.xyz';
const SECRET = 'mima123456';

// 缓存时间
const CACHE_TTL_SEARCH = 72 * 60 * 60;        // 搜索结果缓存 72 小时 (3天)
const CACHE_TTL_DETAIL = 30 * 24 * 60 * 60;   // 详情缓存 30 天 (1个月)

/**
 * 中文转 Base64 (防乱码)
 */
function utf8ToBase64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: CORS_HEADERS });
        }

        const url = new URL(request.url);
        const pathname = url.pathname;

        try {
            // 路由: GET /detail/{id} - 获取详情
            if (pathname.startsWith('/detail/')) {
                const id = pathname.replace('/detail/', '');
                return await handleDetail(id, env, ctx);
            }

            // 路由: GET /?q={keyword} - 搜索
            const query = url.searchParams.get('q');
            if (query) {
                return await handleSearch(query, env, ctx);
            }

            // 无效路由
            return new Response(JSON.stringify({ error: 'Missing query parameter' }), {
                status: 400,
                headers: CORS_HEADERS
            });

        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: CORS_HEADERS
            });
        }
    }
};

/**
 * 处理搜索请求
 */
async function handleSearch(query, env, ctx) {
    // 构建缓存 key - 直接使用搜索词，更可读
    const cacheKey = `search:${query}`;

    // 1. 检查缓存
    if (env.MAGNET_CACHE) {
        const cached = await env.MAGNET_CACHE.get(cacheKey);
        if (cached) {
            return new Response(cached, {
                headers: { ...CORS_HEADERS, "X-Cache-Status": "HIT" }
            });
        }
    }

    // 2. 请求 VPS 桥接
    const rawBase64 = utf8ToBase64(query);
    const safeQuery = encodeURIComponent(rawBase64);
    const targetUrl = `${VPS_API}/search?q=${safeQuery}&enc=b64`;

    const response = await fetch(targetUrl, {
        headers: {
            'x-access-token': SECRET,
            'Content-Type': 'application/json',
            'User-Agent': 'CF-Worker/cili.xyz'
        },
        cf: { timeout: 25 }
    });

    if (!response.ok) {
        throw new Error(`VPS Error: ${response.status}`);
    }

    const data = await response.text();

    // 3. 写入缓存
    if (env.MAGNET_CACHE && data.startsWith('[') && data.length > 5) {
        ctx.waitUntil(
            env.MAGNET_CACHE.put(cacheKey, data, { expirationTtl: CACHE_TTL_SEARCH })
        );
    }

    return new Response(data, {
        headers: { ...CORS_HEADERS, "X-Cache-Status": "MISS" }
    });
}

/**
 * 处理详情请求
 */
async function handleDetail(id, env, ctx) {
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing ID' }), {
            status: 400,
            headers: CORS_HEADERS
        });
    }

    // 构建缓存 key
    const cacheKey = `detail:${id}`;

    // 1. 检查缓存
    if (env.MAGNET_CACHE) {
        const cached = await env.MAGNET_CACHE.get(cacheKey);
        if (cached) {
            return new Response(cached, {
                headers: { ...CORS_HEADERS, "X-Cache-Status": "HIT" }
            });
        }
    }

    // 2. 请求 VPS 桥接
    const targetUrl = `${VPS_API}/detail/${id}`;

    const response = await fetch(targetUrl, {
        headers: {
            'x-access-token': SECRET,
            'Content-Type': 'application/json',
            'User-Agent': 'CF-Worker/cili.xyz'
        },
        cf: { timeout: 25 }
    });

    if (!response.ok) {
        if (response.status === 404) {
            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: CORS_HEADERS
            });
        }
        throw new Error(`VPS Error: ${response.status}`);
    }

    const data = await response.text();

    // 3. 写入缓存
    if (env.MAGNET_CACHE && data.startsWith('{') && data.length > 10) {
        ctx.waitUntil(
            env.MAGNET_CACHE.put(cacheKey, data, { expirationTtl: CACHE_TTL_DETAIL })
        );
    }

    return new Response(data, {
        headers: { ...CORS_HEADERS, "X-Cache-Status": "MISS" }
    });
}
