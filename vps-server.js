/**
 * server.js - v9.0 Rich Data Edition
 * VPS 桥接服务器 (hands.cili.xyz)
 *
 * 功能：
 *   GET /search?q={keyword}     - 搜索接口
 *   GET /detail/{id}            - 详情接口（新增）
 *
 * 部署在 VPS 上，因为 BitSearch 阻止 Cloudflare Worker 直接访问
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 80;

// 🔥 访问密码
const VPS_ACCESS_TOKEN = 'mima123456';

// 🔥 BitSearch API Keys (轮询使用)
const BITSEARCH_KEYS = [
    'bs_930d35f049182c2e7dfe7ab53ebb271ad8516111bfc9aa85781088ac55767042',
    'bs_21b69ce9b77f5353a0c0710ef5808d7b6e870f191c9e4653004d0df0c3324eb9'
];

app.use(cors());

function getRandomKey() {
    return BITSEARCH_KEYS[Math.floor(Math.random() * BITSEARCH_KEYS.length)];
}

// 格式化文件大小
function formatSize(val) {
    if (typeof val === 'string') return val;
    if (!val) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(val) / Math.log(k));
    return parseFloat((val / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 验证请求
function authenticate(req) {
    return req.headers['x-access-token'] === VPS_ACCESS_TOKEN;
}

// 分类映射
const CATEGORY_MAP = {
    1: 'Video',
    2: 'Audio',
    3: 'Software',
    4: 'Games',
    5: 'Books',
    6: 'Anime',
    7: 'Other'
};

function getCategory(catId) {
    return CATEGORY_MAP[catId] || 'Other';
}

/**
 * 搜索接口
 * GET /search?q={keyword}&enc=b64
 */
app.get('/search', async (req, res) => {
    // 1. 鉴权
    if (!authenticate(req)) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    let query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    // 2. Base64 解密
    if (req.query.enc === 'b64') {
        try {
            query = Buffer.from(query, 'base64').toString('utf-8');
            console.log(`[SEARCH] Decoded: ${query}`);
        } catch (e) {
            console.error('Decode failed', e);
        }
    } else {
        console.log(`[SEARCH] Query: ${query}`);
    }

    // 3. 请求 BitSearch
    const currentApiKey = getRandomKey();

    try {
        const targetUrl = `https://bitsearch.to/api/v1/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(targetUrl, {
            headers: { 'X-Api-Key': currentApiKey },
            timeout: 20000
        });

        const list = response.data.results || [];

        // 映射数据
        const cleanData = list.map(item => ({
            id: item.id,
            name: item.title,
            size: formatSize(item.size),
            size_bytes: item.size,
            date: item.createdAt ? item.createdAt.split('T')[0] : 'Unknown',
            seeders: item.seeders || 0,
            leechers: item.leechers || 0,
            downloads: item.downloads || 0,
            verified: item.verified === true,
            infohash: item.infohash,
            magnet: `magnet:?xt=urn:btih:${item.infohash}`,
            category: getCategory(item.category),
            // 额外字段（如果有）
            imdb: item.imdb || null
        }));

        res.json(cleanData);

    } catch (error) {
        console.error('[SEARCH] API Error:', error.message);
        res.status(500).json({ error: 'Proxy Error', details: error.message });
    }
});

/**
 * 详情接口
 * GET /detail/{id}
 */
app.get('/detail/:id', async (req, res) => {
    // 1. 鉴权
    if (!authenticate(req)) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Missing ID' });
    }

    console.log(`[DETAIL] Fetching ID: ${id}`);

    // 2. 请求 BitSearch 详情 API
    const currentApiKey = getRandomKey();

    try {
        const targetUrl = `https://bitsearch.to/api/v1/torrents/${id}`;
        const response = await axios.get(targetUrl, {
            headers: { 'X-Api-Key': currentApiKey },
            timeout: 20000
        });

        const item = response.data;

        if (!item || !item.id) {
            return res.status(404).json({ error: 'Not found' });
        }

        // 映射详情数据
        const detail = {
            id: item.id,
            name: item.title,
            size: formatSize(item.size),
            size_bytes: item.size,
            date: item.createdAt ? item.createdAt.split('T')[0] : 'Unknown',
            createdAt: item.createdAt,
            seeders: item.seeders || 0,
            leechers: item.leechers || 0,
            downloads: item.downloads || 0,
            verified: item.verified === true,
            infohash: item.infohash,
            magnet: item.magnetUrl || `magnet:?xt=urn:btih:${item.infohash}`,
            torrentUrl: item.torrentUrl || null,
            category: getCategory(item.category),
            subcategory: item.subcategory || null,
            // IMDb 信息
            imdb: item.imdb || null,
            // 文件列表
            files: (item.files || []).map(f => ({
                name: f.name || f.path,
                size: formatSize(f.size),
                size_bytes: f.size
            })),
            // 描述（如果有）
            description: item.description || null
        };

        res.json(detail);

    } catch (error) {
        console.error('[DETAIL] API Error:', error.message);

        // 区分 404 和其他错误
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(500).json({ error: 'Proxy Error', details: error.message });
    }
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '9.0' });
});

app.listen(PORT, () => {
    console.log(`🚀 VPS Bridge Server v9.0 running on port ${PORT}`);
    console.log(`   - Search:  GET /search?q={keyword}`);
    console.log(`   - Detail:  GET /detail/{id}`);
});
