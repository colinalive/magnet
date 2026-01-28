/**
 * main.js - v6.0 Mobile Optimized & Routing Fix
 * 修复：URL参数读取丢失、手机端显示异常
 */

// ==========================================
// 1. 字典配置 (SEO & I18n)
// ==========================================
const dictionary = {
    // SEO Meta
    'meta_title': {
        'zh-CN': 'Cili.xyz - 磁力搜索 | 极速纯净',
        'en': 'Cili.xyz - Magnet Search | Fast & Clean'
    },
    'meta_keywords': {
        'zh-CN': '磁力链接, 种子搜索, BT下载, 电影下载',
        'en': 'magnet links, torrent search, free movies, p2p'
    },
    'meta_desc': {
        'zh-CN': '极速索引数千万磁力链接，提供高质量的电影、剧集、音乐、游戏和软件下载。',
        'en': 'Fast indexing of millions of magnet links for high-quality movies, TV series, music, games, and software.'
    },

    // UI Text
    'nav_home': { 'zh-CN': '首页', 'en': 'Home' },
    'hero_title': { 'zh-CN': '全网资源聚合', 'en': 'Discover Anything' },
    'search_placeholder': { 'zh-CN': '搜索电影、剧集、软件...', 'en': 'Search movies, software...' },
    'search_btn': { 'zh-CN': '搜索', 'en': 'Search' },
    'res_found': { 'zh-CN': '找到结果', 'en': 'Results' },
    'label_size': { 'zh-CN': '大小', 'en': 'Size' },
    'label_date': { 'zh-CN': '日期', 'en': 'Date' },
    'label_files': { 'zh-CN': '文件列表', 'en': 'Files' },
    'label_hash': { 'zh-CN': '信息哈希', 'en': 'Info Hash' },
    'btn_magnet': { 'zh-CN': '磁力下载', 'en': 'Magnet Download' },
    'btn_copy':   { 'zh-CN': '复制链接', 'en': 'Copy Link' },
    'msg_copied': { 'zh-CN': '已复制!', 'en': 'Copied!' }
};

const CONFIG = {
    defaultLang: 'en',
    storageKey: 'cili_lang',
    langs: [
        { code: 'zh-CN', flag: 'cn', name: '简体中文' },
        { code: 'en',    flag: 'us', name: 'English' },
        { code: 'ko',    flag: 'kr', name: '한국어' },
        { code: 'ja',    flag: 'jp', name: '日本語' },
        { code: 'es',    flag: 'es', name: 'Español' },
        { code: 'fr',    flag: 'fr', name: 'Français' }
    ]
};

// ==========================================
// 2. 核心工具函数
// ==========================================

// 修复路由解析 Bug：
// URL: https://cili.xyz/search/ubuntu
// pathname: /search/ubuntu
// split('/'): ["", "search", "ubuntu"] -> 关键词在 index 2
function getPathParam(index) {
    const segments = window.location.pathname.split('/');
    // 过滤掉空字符串，防止双斜杠影响
    const cleanSegments = segments.filter(s => s !== '');
    // cleanSegments: ["search", "ubuntu"] -> index 1 is "ubuntu"
    // 但为了逻辑通用，我们传入 "path depth"。 
    // 对于 /search/ubuntu: segment[1]
    return cleanSegments[index] ? decodeURIComponent(cleanSegments[index]) : null;
}

// 磁力清洗：只保留 Hash
function cleanMagnetLink(magnet) {
    const match = magnet.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
    return match ? `magnet:?xt=urn:btih:${match[1].toLowerCase()}` : magnet;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
}

// ==========================================
// 3. I18n & SEO 逻辑
// ==========================================
let currentLang = localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultLang;

function t(key) {
    return dictionary[key]?.[currentLang] || dictionary[key]?.['en'] || key;
}

function updatePageText() {
    // 1. 更新文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.placeholder) el.placeholder = t(key);
        else el.innerText = t(key);
    });

    // 2. 更新 SEO
    document.title = t('meta_title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t('meta_desc');

    // 3. 渲染国旗 (Bootstrap Flex Utilities)
    const container = document.getElementById('flagContainer');
    if (container) {
        container.innerHTML = CONFIG.langs.map(lang => `
            <button class="btn border-0 p-1 opacity-${lang.code === currentLang ? '100' : '50'}" 
                onclick="window.setLanguage('${lang.code}')" 
                title="${lang.name}">
                <span class="fi fi-${lang.flag} rounded shadow-sm" style="font-size: 1.2rem;"></span>
            </button>
        `).join('');
    }
}

window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem(CONFIG.storageKey, lang);
    updatePageText();
};

// ==========================================
// 4. 路由跳转与初始化
// ==========================================
const API_BASE = 'https://api.cili.xyz'; 

window.doSearch = function() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (query) {
        // 静态路由跳转
        window.location.href = `/search/${encodeURIComponent(query)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updatePageText();

    // 绑定回车
    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.doSearch();
        });
    }

    const path = window.location.pathname;

    // --- A. 搜索页逻辑 ---
    // 匹配 /search/keyword
    if (path.startsWith('/search')) {
        // path: /search/ubuntu -> segments: ["search", "ubuntu"] -> index 1
        const query = getPathParam(1); 
        
        // 只有当 query 存在时才执行，防止把 input 清空
        if (query) {
            if(input) input.value = query; // 回填搜索框
            loadSearchResults(query);
        }
    }

    // --- B. 详情页逻辑 ---
    // 匹配 /detail/hash
    if (path.startsWith('/detail')) {
        const hash = getPathParam(1);
        if (hash && hash.length === 40) {
            loadDetail(hash);
        } else {
            document.getElementById('detailContainer').innerHTML = 
                `<div class="alert alert-danger">Invalid Link</div>`;
        }
    }
});

// ==========================================
// 5. 数据加载 (API)
// ==========================================

async function loadSearchResults(query) {
    const list = document.getElementById('resultsList');
    const loading = document.getElementById('loading');
    
    try {
        const res = await fetch(`${API_BASE}/?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        loading.classList.add('d-none');

        if (data.error || data.length === 0) {
            list.innerHTML = `<div class="text-center py-5 text-muted">No results found</div>`;
            return;
        }

        list.innerHTML = data.map(item => {
            const hash = item.magnet.match(/xt=urn:btih:([a-zA-Z0-9]{40})/)?.[1] || '';
            const detailUrl = hash ? `/detail/${hash}` : '#';
            
            // 手机端适配：
            // d-flex flex-column flex-md-row: 手机竖排，电脑横排
            return `
            <div class="card mb-3 shadow-sm border-0">
                <div class="card-body p-3">
                    <div class="d-flex flex-column flex-md-row align-items-md-center">
                        
                        <div class="d-none d-md-block flex-shrink-0 bg-light rounded p-3 text-center me-3" style="width: 60px;">
                            <i class="fa-solid fa-file fs-4 text-primary"></i>
                        </div>

                        <div class="flex-grow-1 min-w-0">
                            <h5 class="card-title mb-2">
                                <a href="${detailUrl}?name=${encodeURIComponent(item.name)}&size=${item.size}" 
                                   class="text-decoration-none text-dark fw-bold text-break">
                                    ${item.name}
                                </a>
                            </h5>
                            
                            <div class="text-muted small d-flex flex-wrap gap-2 gap-md-3">
                                <span class="badge bg-light text-secondary border">${item.category}</span>
                                <span><i class="fa-solid fa-server me-1"></i> ${item.size}</span>
                                <span><i class="fa-regular fa-calendar me-1"></i> ${formatDate(item.date)}</span>
                                <span class="d-md-none text-success ms-auto"><i class="fa-solid fa-arrow-up"></i> ${item.seeders}</span>
                            </div>
                        </div>

                        <div class="text-end d-none d-md-block ms-4" style="min-width: 80px;">
                            <div class="text-success fw-bold mb-1"><i class="fa-solid fa-arrow-up"></i> ${item.seeders}</div>
                            <div class="text-danger small"><i class="fa-solid fa-arrow-down"></i> ${item.leechers}</div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

    } catch (e) {
        loading.innerHTML = `<div class="alert alert-danger">API Error</div>`;
    }
}

async function loadDetail(hash) {
    // 逻辑：如果 URL 带了 name 参数，直接渲染；如果没有，通过 hash 搜 API (假设 API 支持)
    // 这里为了响应速度，优先使用 URL 参数
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    const sizeParam = params.get('size');

    // 构造纯净磁力
    const cleanMagnet = `magnet:?xt=urn:btih:${hash}`;
    const container = document.getElementById('detailContainer');

    // 渲染函数
    const render = (name, size, date, seeds, leechs, downs) => {
        document.title = `${name} - Cili.xyz`;
        document.getElementById('fileName').innerText = name;
        document.getElementById('infoHash').innerText = hash;

        // 详情 Grid
        container.innerHTML = `
        <div class="row g-3 text-center mb-4">
            <div class="col-6 col-md-3">
                <div class="p-3 bg-light rounded border h-100">
                    <div class="text-muted small mb-1" data-i18n="label_size">Size</div>
                    <div class="fw-bold">${size}</div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="p-3 bg-light rounded border h-100">
                    <div class="text-muted small mb-1" data-i18n="label_date">Date</div>
                    <div class="fw-bold">${date}</div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="p-3 bg-light rounded border h-100">
                    <div class="text-muted small mb-1" data-i18n="stat_seed">Seeders</div>
                    <div class="fw-bold text-success">${seeds}</div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="p-3 bg-light rounded border h-100">
                    <div class="text-muted small mb-1" data-i18n="stat_down">Downloads</div>
                    <div class="fw-bold text-primary">${downs}</div>
                </div>
            </div>
        </div>

        <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-5">
            <a href="${cleanMagnet}" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
                <i class="fa-solid fa-magnet me-2"></i> <span data-i18n="btn_magnet">Download</span>
            </a>
            <button onclick="copyToClipboard('${cleanMagnet}')" class="btn btn-outline-secondary btn-lg px-5 rounded-pill">
                <i class="fa-regular fa-copy me-2"></i> <span data-i18n="btn_copy">Copy Link</span>
            </button>
        </div>
        `;
        updatePageText();
    };

    if (nameParam) {
        // 只有基本信息时，使用默认占位数据
        render(nameParam, sizeParam || '--', 'N/A', '-', '-', '-');
    } else {
        // 如果没有 name 参数，尝试 fetch API
        try {
            const res = await fetch(`${API_BASE}/?q=${hash}`);
            const data = await res.json();
            if(data && data.length > 0) {
                const item = data[0];
                render(item.name, item.size, formatDate(item.date), item.seeders, item.leechers, item.downloads);
            } else {
                render('Unknown Resource', '--', '--', '--', '--', '--');
            }
        } catch(e) {
            render('Error Loading', '--', '--', '--', '--', '--');
        }
    }
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => alert(t('msg_copied')));
};