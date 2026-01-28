/**
 * main.js - v5.0 Final Corrected
 * 包含：SEO动态注入、静态路由解析、磁力清洗、Bootstrap适配
 */

// ==========================================
// 1. 完整的多语言与 SEO 字典
// ==========================================
const dictionary = {
    // --- SEO Meta Data (保留之前确认的内容) ---
    'meta_title': {
        'zh-CN': 'Cili.xyz - 磁力搜索 | 极速纯净',
        'en': 'Cili.xyz - Magnet Search | Fast & Clean',
        'ko': 'Cili.xyz - 마그넷 검색',
        'ja': 'Cili.xyz - 磁気検索',
        'es': 'Cili.xyz - Búsqueda de Magnet',
        'fr': 'Cili.xyz - Recherche Magnet'
    },
    'meta_keywords': {
        'zh-CN': '磁力链接, 种子搜索, BT下载, 电影下载',
        'en': 'magnet links, torrent search, free movies, p2p',
        'ko': '마그넷, 토렌트',
        'ja': 'マグネット, トレント',
        'es': 'magnet, torrent',
        'fr': 'magnet, torrent'
    },
    'meta_desc': {
        'zh-CN': '极速索引数千万磁力链接，提供高质量的电影、剧集、音乐、游戏和软件下载。',
        'en': 'Fast indexing of millions of magnet links for high-quality movies, TV series, music, games, and software.',
        'ko': '수천만 개의 마그넷 링크 인덱싱.',
        'ja': '数百万のマグネットリンクを高速インデックス。',
        'es': 'Indexación rápida de millones de enlaces magnéticos.',
        'fr': 'Indexation rapide de millions de liens magnet.'
    },

    // --- 界面文本 ---
    'nav_home': { 'zh-CN': '首页', 'en': 'Home', 'ko': '홈', 'ja': 'ホーム', 'es': 'Inicio', 'fr': 'Accueil' },
    'hero_title': { 'zh-CN': '全网资源聚合', 'en': 'Discover Anything', 'ko': '모든 리소스 검색', 'ja': 'あらゆるものを検索', 'es': 'Descubre Todo', 'fr': 'Découvrez Tout' },
    'search_placeholder': { 'zh-CN': '搜索电影、剧集、软件...', 'en': 'Search movies, software...', 'ko': '영화, 소프트웨어 검색...', 'ja': '映画、ソフト検索...', 'es': 'Buscar archivos...', 'fr': 'Rechercher...' },
    'search_btn': { 'zh-CN': '搜索', 'en': 'Search', 'ko': '검색', 'ja': '検索', 'es': 'Buscar', 'fr': 'Chercher' },
    'res_found': { 'zh-CN': '找到结果', 'en': 'Results', 'ko': '결과', 'ja': '結果', 'es': 'Resultados', 'fr': 'Résultats' },
    
    // --- 详情页字段 ---
    'label_size': { 'zh-CN': '文件大小', 'en': 'File Size', 'ko': '파일 크기', 'ja': 'サイズ', 'es': 'Tamaño', 'fr': 'Taille' },
    'label_date': { 'zh-CN': '发布日期', 'en': 'Date Uploaded', 'ko': '날짜', 'ja': '日付', 'es': 'Fecha', 'fr': 'Date' },
    'label_cat':  { 'zh-CN': '资源分类', 'en': 'Category', 'ko': '카테고리', 'ja': 'カテゴリー', 'es': 'Catégorie', 'fr': 'Catégorie' },
    'label_hash': { 'zh-CN': '信息哈希', 'en': 'Info Hash', 'ko': '해시', 'ja': 'ハッシュ', 'es': 'Hash', 'fr': 'Hash' },
    'stat_seed':  { 'zh-CN': '做种', 'en': 'Seeders', 'ko': '시더', 'ja': 'シード', 'es': 'Semillas', 'fr': 'Sources' },
    'stat_leech': { 'zh-CN': '下载中', 'en': 'Leechers', 'ko': '리처', 'ja': 'リーチ', 'es': 'Clientes', 'fr': 'Clients' },
    'stat_down':  { 'zh-CN': '完成数', 'en': 'Downloads', 'ko': '다운로드', 'ja': 'DL数', 'es': 'Descargas', 'fr': 'Téléchargements' },
    
    'btn_magnet': { 'zh-CN': '磁力下载', 'en': 'Magnet Download', 'ko': '마그넷 다운로드', 'ja': 'マグネットDL', 'es': 'Descargar', 'fr': 'Télécharger' },
    'btn_copy':   { 'zh-CN': '复制链接', 'en': 'Copy Link', 'ko': '링크 복사', 'ja': 'リンクをコピー', 'es': 'Copiar', 'fr': 'Copier' },
    'msg_copied': { 'zh-CN': '已复制!', 'en': 'Copied!', 'ko': '복사됨!', 'ja': 'コピーしました!', 'es': 'Copiado!', 'fr': 'Copié!' }
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
// 2. 辅助函数：磁力清洗与 Hash 提取
// ==========================================

// 从完整磁力链提取纯 Hash (40位)
function extractHash(magnet) {
    const match = magnet.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
    return match ? match[1].toLowerCase() : null;
}

// 清洗磁力链接：只保留 magnet:?xt=urn:btih:HASH
function cleanMagnetLink(magnet) {
    const hash = extractHash(magnet);
    if (!hash) return magnet; // 提取失败则返回原样
    return `magnet:?xt=urn:btih:${hash}`;
}

// 格式化日期
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
}

// 获取 URL 路径参数 (兼容 /search/xxx 和 /detail/xxx)
function getPathParam(index) {
    const segments = window.location.pathname.split('/').filter(s => s);
    return segments[index] ? decodeURIComponent(segments[index]) : null;
}

// ==========================================
// 3. 语言与 SEO 核心逻辑
// ==========================================
let currentLang = localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultLang;

function t(key) {
    return dictionary[key]?.[currentLang] || dictionary[key]?.['en'] || key;
}

function updatePageText() {
    // 1. 更新页面可见文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.placeholder) el.placeholder = t(key);
        else el.innerText = t(key);
    });

    // 2. 更新 SEO Meta Tags (关键需求)
    document.title = t('meta_title');
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = t('meta_desc');

    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.name = 'keywords';
        document.head.appendChild(metaKw);
    }
    metaKw.content = t('meta_keywords');

    // 3. 渲染国旗
    const container = document.getElementById('flagContainer');
    if (container) {
        container.innerHTML = CONFIG.langs.map(lang => `
            <button class="btn btn-link p-0 text-decoration-none mx-1 ${lang.code === currentLang ? 'opacity-100' : 'opacity-50'}" 
                onclick="window.setLanguage('${lang.code}')" 
                title="${lang.name}">
                <span class="fi fi-${lang.flag} fs-5 rounded"></span>
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

// 搜索跳转 (静态路由)
window.doSearch = function() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (query) {
        // 静态化规则: /search/关键词
        window.location.href = `/search/${encodeURIComponent(query)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updatePageText();

    // 绑定回车搜索
    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.doSearch();
        });
    }

    // --- 页面路由判断 ---
    const path = window.location.pathname;

    // A. 搜索结果页
    if (path.startsWith('/search')) {
        const query = getPathParam(1);
        if (query) {
            if(input) input.value = query;
            loadSearchResults(query);
        }
    }

    // B. 详情页 (通过 Hash 获取数据)
    if (path.startsWith('/detail')) {
        const hash = getPathParam(1);
        if (hash && hash.length === 40) {
            loadDetail(hash);
        } else {
            document.getElementById('detailContainer').innerHTML = 
                `<div class="alert alert-danger">Invalid Hash</div>`;
        }
    }
});

// 加载搜索结果
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

        // 渲染列表 (Bootstrap Standard Components)
        list.innerHTML = data.map(item => {
            const hash = extractHash(item.magnet);
            // 静态化详情链接: /detail/HASH
            const detailUrl = hash ? `/detail/${hash}` : '#';
            
            // 简单的分类图标逻辑
            let icon = 'fa-file';
            if(item.category.includes('Video')) icon = 'fa-film';
            if(item.category.includes('Audio')) icon = 'fa-music';
            if(item.category.includes('App')) icon = 'fa-cube';

            return `
            <div class="card mb-3 shadow-sm border-0 hover-shadow transition-base">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 bg-light rounded p-3 text-center me-3" style="width: 60px;">
                            <i class="fa-solid ${icon} fs-4 text-primary"></i>
                        </div>
                        <div class="flex-grow-1 min-w-0">
                            <h5 class="card-title text-truncate mb-1">
                                <a href="${detailUrl}" class="text-decoration-none text-dark stretched-link fw-bold">
                                    ${item.name}
                                </a>
                            </h5>
                            <div class="text-muted small">
                                <span class="badge bg-light text-secondary me-2 border">${item.category}</span>
                                <span class="me-3"><i class="fa-solid fa-server me-1"></i> ${item.size}</span>
                                <span><i class="fa-regular fa-calendar me-1"></i> ${formatDate(item.date)}</span>
                            </div>
                        </div>
                        <div class="text-end d-none d-md-block ms-3">
                            <div class="badge bg-success bg-opacity-10 text-success mb-1 d-block">
                                <i class="fa-solid fa-arrow-up"></i> ${item.seeders}
                            </div>
                            <div class="badge bg-danger bg-opacity-10 text-danger d-block">
                                <i class="fa-solid fa-arrow-down"></i> ${item.leechers}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

    } catch (e) {
        loading.innerHTML = `<div class="alert alert-danger text-center">Service Error</div>`;
    }
}

// 加载详情 (通过 Hash 反查)
async function loadDetail(hash) {
    const container = document.getElementById('detailContainer');
    
    try {
        // 使用 Hash 作为关键词搜索，获取 API 里的详细信息
        const res = await fetch(`${API_BASE}/?q=${hash}`);
        const data = await res.json();
        
        // 假设第一个结果就是我们要的 (Hash 搜索通常唯一)
        const item = data && data.length > 0 ? data[0] : null;

        if (!item) {
            container.innerHTML = `<div class="alert alert-warning text-center">Resource details not found.</div>`;
            return;
        }

        // 清洗磁力链接
        const cleanMagnet = cleanMagnetLink(item.magnet);
        
        // 更新 UI
        document.title = `${item.name} - Cili.xyz`;
        
        // 渲染详情 (Bootstrap Card)
        document.getElementById('fileName').innerText = item.name;
        document.getElementById('infoHash').innerText = hash;
        
        // 填充所有数据
        const metaHtml = `
            <div class="row g-3 text-center mb-4">
                <div class="col-6 col-md-3">
                    <div class="p-3 bg-light rounded border">
                        <div class="text-muted small mb-1" data-i18n="label_size">Size</div>
                        <div class="fw-bold">${item.size}</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="p-3 bg-light rounded border">
                        <div class="text-muted small mb-1" data-i18n="label_date">Date</div>
                        <div class="fw-bold">${formatDate(item.date)}</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="p-3 bg-light rounded border">
                        <div class="text-muted small mb-1" data-i18n="stat_seed">Seeders</div>
                        <div class="fw-bold text-success">${item.seeders}</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="p-3 bg-light rounded border">
                        <div class="text-muted small mb-1" data-i18n="stat_down">Downloads</div>
                        <div class="fw-bold text-primary">${item.downloads}</div>
                    </div>
                </div>
            </div>
        `;
        
        // 操作按钮区 (使用清洗后的 Clean Magnet)
        const actionHtml = `
            <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <a href="${cleanMagnet}" class="btn btn-primary btn-lg px-5 shadow-sm rounded-pill">
                    <i class="fa-solid fa-magnet me-2"></i> <span data-i18n="btn_magnet">Magnet Download</span>
                </a>
                <button onclick="copyToClipboard('${cleanMagnet}')" class="btn btn-outline-secondary btn-lg px-5 rounded-pill">
                    <i class="fa-regular fa-copy me-2"></i> <span data-i18n="btn_copy">Copy Link</span>
                </button>
            </div>
        `;

        container.innerHTML = metaHtml + actionHtml;
        
        // 重新触发翻译，确保新插入的 HTML 变成对应语言
        updatePageText();

    } catch (e) {
        container.innerHTML = `<div class="alert alert-danger text-center">Network Error</div>`;
    }
}

// 复制功能
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(t('msg_copied'));
    });
};