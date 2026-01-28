/**
 * main.js - v10.0 Debug Edition
 * 增加详细日志，修复参数获取逻辑，优化加载状态
 */

// ==========================================
// 1. 配置
// ==========================================
const API_BASE = 'https://api.cili.xyz'; // 确保没有尾部斜杠

const dictionary = {
    'brand_name': { 'zh-CN': '磁力先锋', 'en': 'Magnet Pioneer' },
    'meta_title': { 'zh-CN': '磁力先锋 - 极速纯净', 'en': 'Magnet Pioneer - Fast Search' },
    'search_placeholder': { 'zh-CN': '搜索电影、剧集、软件...', 'en': 'Search...' },
    'search_btn': { 'zh-CN': '搜索', 'en': 'Search' },
    'res_found': { 'zh-CN': '搜索结果', 'en': 'Results' },
    'loading': { 'zh-CN': '加载中...', 'en': 'Loading...' },
    'error_api': { 'zh-CN': '连接服务器失败', 'en': 'Connection Failed' },
    'no_results': { 'zh-CN': '未找到相关资源', 'en': 'No Results Found' },
    
    // 详情页
    'label_size': { 'zh-CN': '大小', 'en': 'Size' },
    'label_date': { 'zh-CN': '日期', 'en': 'Date' },
    'btn_magnet': { 'zh-CN': '磁力下载', 'en': 'Download' },
    'btn_copy': { 'zh-CN': '复制链接', 'en': 'Copy Link' },
    'msg_copied': { 'zh-CN': '已复制', 'en': 'Copied' }
};

const CONFIG = {
    defaultLang: 'en',
    storageKey: 'cili_lang',
    langs: [
        { code: 'zh-CN', flag: 'cn', name: '简体中文' },
        { code: 'en',    flag: 'us', name: 'English' },
        { code: 'ko',    flag: 'kr', name: '한국어' },
        { code: 'ja',    flag: 'jp', name: '日本語' }
    ]
};

// ==========================================
// 2. 工具函数
// ==========================================

function extractHash(magnet) {
    if (!magnet) return null;
    const match = magnet.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
    return match ? match[1].toLowerCase() : null;
}

function makeCleanMagnet(hash) {
    return hash ? `magnet:?xt=urn:btih:${hash}` : '';
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        return new Date(dateStr).toLocaleDateString();
    } catch (e) { return dateStr; }
}

// ==========================================
// 3. I18n
// ==========================================
let currentLang = localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultLang;

function t(key) {
    return dictionary[key]?.[currentLang] || dictionary[key]?.['en'] || key;
}

function updatePageText() {
    document.title = t('meta_title');
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.placeholder) el.placeholder = t(key);
        else el.innerText = t(key);
    });
    
    const flagContainer = document.getElementById('flagContainer');
    if(flagContainer) {
        flagContainer.innerHTML = CONFIG.langs.map(lang => `
            <button class="btn border-0 p-1 ${lang.code === currentLang ? 'opacity-100' : 'opacity-50'}" 
                onclick="setLanguage('${lang.code}')">
                <span class="fi fi-${lang.flag} rounded shadow-sm fs-5"></span>
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
// 4. 业务逻辑 (带日志)
// ==========================================

// 执行搜索跳转
window.doSearch = function() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    console.log('[Search] User input:', query);
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Init] DOM Loaded');
    updatePageText();

    // 绑定回车
    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.doSearch();
        });
    }

    // 获取参数
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    console.log('[Init] URL Params q=', q);

    // 判断页面
    const isSearchPage = document.getElementById('resultsList');
    const isDetailPage = document.getElementById('detailContainer');

    if (isSearchPage) {
        if (q) {
            if(input) input.value = q;
            loadSearchResults(q);
        } else {
            console.log('[Search] No query param, staying idle.');
        }
    }

    if (isDetailPage) {
        if (q) {
            loadDetail(q);
        } else {
            document.getElementById('detailContainer').innerHTML = 
                `<div class="alert alert-danger text-center">Hash Missing</div>`;
        }
    }
});

async function loadSearchResults(query) {
    console.log('[API] Fetching results for:', query);
    
    const list = document.getElementById('resultsList');
    const loading = document.getElementById('loading');
    
    // 显示 Loading
    loading.classList.remove('d-none');
    list.innerHTML = '';

    try {
        // 构建 URL
        const apiUrl = `${API_BASE}?q=${encodeURIComponent(query)}`; // 注意：去掉了 /
        console.log('[API] Request URL:', apiUrl);

        const res = await fetch(apiUrl);
        console.log('[API] Response Status:', res.status);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        console.log('[API] Data received, length:', data.length);

        // 隐藏 Loading
        loading.classList.add('d-none');

        if (data.error || !Array.isArray(data) || data.length === 0) {
            list.innerHTML = `<div class="text-center py-5 text-muted">${t('no_results')}</div>`;
            return;
        }

        // 渲染列表
        list.innerHTML = data.map(item => {
            const hash = extractHash(item.magnet);
            const detailUrl = hash ? `detail.html?q=${hash}` : '#';
            
            // 图标判断
            let icon = 'fa-file';
            const cat = item.category || '';
            if(cat.includes('Video') || cat.includes('Movie')) icon = 'fa-film';
            if(cat.includes('App') || cat.includes('Software')) icon = 'fa-compact-disc';
            if(cat.includes('Music') || cat.includes('Audio')) icon = 'fa-music';

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
                                <span class="badge bg-light text-secondary border">${item.category || 'Other'}</span>
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
        console.error('[API Error]', e);
        loading.classList.add('d-none');
        list.innerHTML = `<div class="alert alert-danger text-center">${t('error_api')}: ${e.message}</div>`;
    }
}

async function loadDetail(hash) {
    console.log('[Detail] Loading hash:', hash);
    const container = document.getElementById('detailContainer');
    const cleanMagnet = makeCleanMagnet(hash);

    try {
        const res = await fetch(`${API_BASE}?q=${hash}`);
        const data = await res.json();
        const item = (data && data.length > 0) ? data[0] : null;

        if (!item) {
            container.innerHTML = `<div class="alert alert-warning text-center">${t('no_results')}</div>`;
            return;
        }

        document.title = `${item.name} - ${t('brand_name')}`;
        document.getElementById('fileName').innerText = item.name;
        document.getElementById('infoHash').innerText = hash;

        container.innerHTML = `
            <div class="row g-3 text-center mb-5">
                <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="label_size">Size</div><div class="fw-bold">${item.size}</div></div></div>
                <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="label_date">Date</div><div class="fw-bold">${formatDate(item.date)}</div></div></div>
                <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="stat_seed">Seeders</div><div class="fw-bold text-success">${item.seeders}</div></div></div>
                <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="stat_leech">Leechers</div><div class="fw-bold text-danger">${item.leechers}</div></div></div>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <a href="${cleanMagnet}" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"><i class="fa-solid fa-magnet me-2"></i> <span data-i18n="btn_magnet">Magnet Download</span></a>
                <button onclick="copyToClipboard('${cleanMagnet}')" class="btn btn-outline-secondary btn-lg px-5 rounded-pill"><i class="fa-regular fa-copy me-2"></i> <span data-i18n="btn_copy">Copy Link</span></button>
            </div>
            <div class="mt-5 text-start"><h5 class="border-bottom pb-2 mb-3">Files</h5><div class="bg-light p-3 rounded text-muted small"><i class="fa-regular fa-file me-2"></i> ${item.name}</div></div>
        `;
        updatePageText();
    } catch (e) {
        console.error('[Detail Error]', e);
        container.innerHTML = `<div class="alert alert-danger text-center">${t('error_api')}</div>`;
    }
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => alert(t('msg_copied')));
};