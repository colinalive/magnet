/**
 * main.js - v8.0 Stable (Query Params)
 * 核心功能：
 * 1. 路由模式：search.html?q=xxx, detail.html?q=hash
 * 2. 磁力清洗：只保留 Hash，去除所有杂质参数
 * 3. 品牌重塑：磁力先锋 (Magnet Pioneer)
 */

// ==========================================
// 1. 字典配置 (品牌、SEO、界面)
// ==========================================
const dictionary = {
    // 品牌名称
    'brand_name': {
        'zh-CN': '磁力先锋',
        'en': 'Magnet Pioneer',
        'ko': '마그넷 파이오니어',
        'ja': 'マグネットパイオニア',
        'es': 'Pionero Magnético',
        'fr': 'Pionnier Magnétique'
    },
    
    // SEO Meta
    'meta_title': { 
        'zh-CN': '磁力先锋 - 极速纯净的磁力搜索引擎', 
        'en': 'Magnet Pioneer - Fast & Clean Magnet Search' 
    },
    'meta_keywords': { 
        'zh-CN': '磁力链接, 种子搜索, 磁力先锋, BT下载', 
        'en': 'magnet links, torrent search, magnet pioneer, p2p' 
    },
    'meta_desc': { 
        'zh-CN': '磁力先锋提供极速的磁力链接索引服务，纯净无广告，支持多语言搜索。', 
        'en': 'Magnet Pioneer provides fast indexing of millions of magnet links. Clean, ad-free, and multilingual.' 
    },

    // 界面文本
    'nav_home': { 'zh-CN': '首页', 'en': 'Home' },
    'hero_title': { 'zh-CN': '探索无限资源', 'en': 'Discover Anything' },
    'search_placeholder': { 'zh-CN': '搜索电影、剧集、软件...', 'en': 'Search movies, software...' },
    'search_btn': { 'zh-CN': '搜索', 'en': 'Search' },
    'res_found': { 'zh-CN': '搜索结果', 'en': 'Results' },
    
    // 详情页
    'label_size': { 'zh-CN': '文件大小', 'en': 'File Size' },
    'label_date': { 'zh-CN': '收录日期', 'en': 'Date Indexed' },
    'label_hash': { 'zh-CN': '信息哈希', 'en': 'Info Hash' },
    'label_files': { 'zh-CN': '文件概览', 'en': 'File Preview' },
    'stat_seed':  { 'zh-CN': '做种', 'en': 'Seeders' },
    'stat_leech': { 'zh-CN': '下载中', 'en': 'Leechers' },
    'stat_down':  { 'zh-CN': '完成数', 'en': 'Downloads' },

    'btn_magnet': { 'zh-CN': '磁力下载', 'en': 'Magnet Download' },
    'btn_copy':   { 'zh-CN': '复制链接', 'en': 'Copy Link' },
    'msg_copied': { 'zh-CN': '链接已复制', 'en': 'Link Copied' },
    'loading':    { 'zh-CN': '加载中...', 'en': 'Loading...' },
    'error_api':  { 'zh-CN': '数据加载失败', 'en': 'Data Load Failed' },
    'error_invalid': { 'zh-CN': '无效的链接', 'en': 'Invalid Link' }
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
// 2. 核心工具：清洗与提取
// ==========================================

// 提取 40位 Hash (核心逻辑)
function extractHash(magnet) {
    if (!magnet) return null;
    const match = magnet.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
    return match ? match[1].toLowerCase() : null;
}

// 构造纯净磁力链 (无任何杂质参数)
function makeCleanMagnet(hash) {
    if (!hash) return '';
    return `magnet:?xt=urn:btih:${hash}`;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
}

// ==========================================
// 3. 语言与 SEO 逻辑
// ==========================================
let currentLang = localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultLang;

function t(key) {
    return dictionary[key]?.[currentLang] || dictionary[key]?.['en'] || key;
}

function updatePageText() {
    // 1. 更新 data-i18n 元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.placeholder) el.placeholder = t(key);
        else el.innerText = t(key);
    });

    // 2. 更新品牌名称 (Class: brand-text)
    document.querySelectorAll('.brand-text').forEach(el => {
        el.innerText = t('brand_name');
    });

    // 3. 更新 SEO Meta
    document.title = t('meta_title');
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = t('meta_desc');

    // 4. 渲染国旗
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
// 4. 路由与业务逻辑
// ==========================================
const API_BASE = 'https://api.cili.xyz'; 

window.doSearch = function() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (query) {
        // 回归 Query Param 模式
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updatePageText();

    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.doSearch();
        });
    }

    // URL 参数解析
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q'); // search页是keyword，detail页是hash

    const pathname = window.location.pathname;

    // A. 搜索页逻辑
    if (pathname.includes('search.html') && q) {
        if(input) input.value = q;
        loadSearchResults(q);
    }

    // B. 详情页逻辑
    if (pathname.includes('detail.html') && q) {
        loadDetail(q);
    }
});

// 加载搜索结果
async function loadSearchResults(keyword) {
    const list = document.getElementById('resultsList');
    const loading = document.getElementById('loading');
    
    try {
        const res = await fetch(`${API_BASE}/?q=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        
        loading.classList.add('d-none');

        if (data.error || data.length === 0) {
            list.innerHTML = `<div class="text-center py-5 text-muted">No results found</div>`;
            return;
        }

        list.innerHTML = data.map(item => {
            const hash = extractHash(item.magnet);
            // 详情页链接：detail.html?q=HASH
            const detailUrl = hash ? `detail.html?q=${hash}` : '#';
            
            let icon = 'fa-file';
            if(item.category.includes('Video')) icon = 'fa-film';
            if(item.category.includes('App')) icon = 'fa-cube';

            return `
            <div class="card mb-3 shadow-sm border-0">
                <div class="card-body p-3">
                    <div class="d-flex flex-column flex-md-row align-items-md-center">
                        <div class="d-none d-md-block flex-shrink-0 bg-light rounded p-3 text-center me-3" style="width: 60px;">
                            <i class="fa-solid ${icon} fs-4 text-primary"></i>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <h5 class="card-title mb-2">
                                <a href="${detailUrl}" class="text-decoration-none text-dark fw-bold text-break">
                                    ${item.name}
                                </a>
                            </h5>
                            <div class="text-muted small d-flex flex-wrap gap-3">
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
        loading.innerHTML = `<div class="alert alert-danger text-center">${t('error_api')}</div>`;
    }
}

// 加载详情 (通过 Hash 反查)
async function loadDetail(hash) {
    const container = document.getElementById('detailContainer');
    
    // 构造纯净磁力链
    const cleanMagnet = makeCleanMagnet(hash);

    try {
        // 使用 Hash 去 API 搜索详情
        const res = await fetch(`${API_BASE}/?q=${hash}`);
        const data = await res.json();
        
        // 假设第一个结果就是
        const item = data && data.length > 0 ? data[0] : null;

        if (!item) {
            container.innerHTML = `<div class="alert alert-warning text-center">${t('error_invalid')}</div>`;
            return;
        }

        // 更新页面标题
        document.title = `${item.name} - ${t('brand_name')}`;
        document.getElementById('fileName').innerText = item.name;
        document.getElementById('infoHash').innerText = hash;

        // 渲染数据
        container.innerHTML = `
            <div class="row g-3 text-center mb-5">
                <div class="col-6 col-md-3">
                    <div class="p-3 bg-light rounded border h-100">
                        <div class="text-muted small mb-1" data-i18n="label_size">Size</div>
                        <div class="fw-bold">${item.size}</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="p-3 bg-light rounded border h-100">
                        <div class="text-muted small mb-1" data-i18n="label_date">Date</div>
                        <div class="fw-bold">${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="p-3 bg-light rounded border h-100">
                        <div class="text-muted small mb-1" data-i18n="stat_seed">Seeders</div>
                        <div class="fw-bold text-success">${item.seeders}</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="p-3 bg-light rounded border h-100">
                        <div class="text-muted small mb-1" data-i18n="stat_leech">Leechers</div>
                        <div class="fw-bold text-danger">${item.leechers}</div>
                    </div>
                </div>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <a href="${cleanMagnet}" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
                    <i class="fa-solid fa-magnet me-2"></i> <span data-i18n="btn_magnet">Magnet Download</span>
                </a>
                <button onclick="copyToClipboard('${cleanMagnet}')" class="btn btn-outline-secondary btn-lg px-5 rounded-pill">
                    <i class="fa-regular fa-copy me-2"></i> <span data-i18n="btn_copy">Copy Link</span>
                </button>
            </div>
            
            <div class="mt-5 text-start">
                 <h5 class="border-bottom pb-2 mb-3" data-i18n="label_files">Files</h5>
                 <div class="bg-light p-3 rounded text-muted small">
                    <i class="fa-regular fa-file me-2"></i> ${item.name}
                 </div>
            </div>
        `;
        
        // 重新应用翻译
        updatePageText();

    } catch (e) {
        container.innerHTML = `<div class="alert alert-danger text-center">${t('error_api')}</div>`;
    }
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(t('msg_copied'));
    });
};