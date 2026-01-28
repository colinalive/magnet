/**
 * main.js - v12.0 Final Production
 * 1. 详情页零延迟渲染 (通过 URL 透传参数)
 * 2. 完整的 SEO 多语言切换 (Title/Desc/Keywords)
 * 3. 磁力链接严格清洗
 */

// ==========================================
// 1. 字典配置 (SEO & 多语言)
// ==========================================
const API_BASE = 'https://api.cili.xyz'; 

const dictionary = {
    // 品牌与SEO
    'brand_name': {
        'zh-CN': '磁力先锋', 'zh-TW': '磁力先鋒',
        'en': 'Magnet Pioneer', 'ko': '마그넷 파이오니어', 'ja': 'マグネットパイオニア'
    },
    'meta_title': {
        'zh-CN': '磁力先锋 - 极速纯净的磁力搜索引擎',
        'zh-TW': '磁力先鋒 - 極速純淨的磁力搜尋引擎',
        'en': 'Magnet Pioneer - Fast & Clean Magnet Search',
        'ko': 'Magnet Pioneer - 빠르고 깨끗한 마그넷 검색',
        'ja': 'Magnet Pioneer - 高速でクリーンな磁気検索'
    },
    'meta_keywords': {
        'zh-CN': '磁力链接, 种子搜索, 磁力先锋, BT下载, 资源搜索',
        'zh-TW': '磁力連結, 種子搜尋, 磁力先鋒, BT下載, 資源搜尋',
        'en': 'magnet links, torrent search, magnet pioneer, p2p, file sharing',
        'ko': '마그넷, 토렌트, 파일 공유, 무료 다운로드',
        'ja': 'マグネット, トレント, P2P, ファイル共有, 無料ダウンロード'
    },
    'meta_desc': {
        'zh-CN': '磁力先锋提供极速的磁力链接索引服务，纯净无广告，支持多语言搜索。',
        'zh-TW': '磁力先鋒提供極速的磁力連結索引服務，純淨無廣告，支持多語言搜尋。',
        'en': 'Magnet Pioneer provides fast indexing of millions of magnet links. Clean, ad-free, and multilingual.',
        'ko': 'Magnet Pioneer는 수백만 개의 마그넷 링크에 대한 빠른 인덱싱을 제공합니다. 깨끗하고 광고가 없습니다.',
        'ja': 'Magnet Pioneerは、数百万のマグネットリンクの高速インデックスを提供します。 クリーンで広告はありません。'
    },

    // 界面文本
    'nav_home': { 'zh-CN': '首页', 'zh-TW': '首頁', 'en': 'Home', 'ko': '홈', 'ja': 'ホーム' },
    'hero_title': { 'zh-CN': '探索无限资源', 'zh-TW': '探索無限資源', 'en': 'Discover Anything', 'ko': '무한한 자원 탐색', 'ja': 'あらゆるものを検索' },
    'search_placeholder': { 'zh-CN': '搜索电影、剧集、软件...', 'zh-TW': '搜尋電影、劇集、軟體...', 'en': 'Search movies, software...', 'ko': '영화, 소프트웨어 검색...', 'ja': '映画、ソフト検索...' },
    'search_btn': { 'zh-CN': '搜索', 'zh-TW': '搜尋', 'en': 'Search', 'ko': '검색', 'ja': '検索' },
    'res_found': { 'zh-CN': '搜索结果', 'zh-TW': '搜尋結果', 'en': 'Results', 'ko': '검색 결과', 'ja': '検索結果' },
    
    // 详情页
    'label_size': { 'zh-CN': '文件大小', 'zh-TW': '檔案大小', 'en': 'File Size', 'ko': '파일 크기', 'ja': 'ファイルサイズ' },
    'label_date': { 'zh-CN': '收录日期', 'zh-TW': '收錄日期', 'en': 'Date Indexed', 'ko': '날짜', 'ja': '日付' },
    'label_hash': { 'zh-CN': '信息哈希', 'zh-TW': '資訊哈希', 'en': 'Info Hash', 'ko': '해시', 'ja': 'ハッシュ' },
    'label_files': { 'zh-CN': '文件概览', 'zh-TW': '檔案預覽', 'en': 'File Preview', 'ko': '파일 미리보기', 'ja': 'ファイルプレビュー' },
    'stat_seed':  { 'zh-CN': '做种', 'zh-TW': '做種', 'en': 'Seeders', 'ko': '시더', 'ja': 'シード' },
    'stat_leech': { 'zh-CN': '下载中', 'zh-TW': '下載中', 'en': 'Leechers', 'ko': '리처', 'ja': 'リーチ' },
    
    'btn_magnet': { 'zh-CN': '磁力下载', 'zh-TW': '磁力下載', 'en': 'Magnet Download', 'ko': '마그넷 다운로드', 'ja': 'マグネットDL' },
    'btn_copy':   { 'zh-CN': '复制链接', 'zh-TW': '複製連結', 'en': 'Copy Link', 'ko': '링크 복사', 'ja': 'リンクをコピー' },
    'msg_copied': { 'zh-CN': '链接已复制', 'zh-TW': '連結已複製', 'en': 'Link Copied', 'ko': '복사됨', 'ja': 'コピーしました' },
    
    'no_results': { 'zh-CN': '未找到相关资源', 'zh-TW': '未找到相關資源', 'en': 'No Results Found', 'ko': '결과 없음', 'ja': '結果なし' },
    'loading':    { 'zh-CN': '加载中...', 'zh-TW': '加載中...', 'en': 'Loading...', 'ko': '로딩 중...', 'ja': '読み込み中...' }
};

const CONFIG = {
    defaultLang: 'en',
    storageKey: 'cili_lang',
    langs: [
        { code: 'zh-CN', flag: 'cn', name: '简体中文' },
        { code: 'zh-TW', flag: 'tw', name: '繁體中文' }, // 替换了法语，改为繁体
        { code: 'en',    flag: 'us', name: 'English' },
        { code: 'ko',    flag: 'kr', name: '한국어' },
        { code: 'ja',    flag: 'jp', name: '日本語' }
    ]
};

// ==========================================
// 2. 工具函数
// ==========================================
let currentLang = localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultLang;

function t(key) {
    return dictionary[key]?.[currentLang] || dictionary[key]?.['en'] || key;
}

function updatePageText() {
    // 1. 更新可见文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.placeholder) el.placeholder = t(key);
        else el.innerText = t(key);
    });

    // 2. 更新 SEO (Title, Desc, Keywords)
    document.title = t('meta_title');
    
    const setMeta = (name, content) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.name = name;
            document.head.appendChild(el);
        }
        el.content = content;
    };
    
    setMeta('description', t('meta_desc'));
    setMeta('keywords', t('meta_keywords'));

    // 3. 渲染国旗
    const container = document.getElementById('flagContainer');
    if (container) {
        container.innerHTML = CONFIG.langs.map(lang => `
            <button class="btn border-0 p-1 mx-1 ${lang.code === currentLang ? 'opacity-100' : 'opacity-50'}" 
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

function extractHash(magnet) {
    if (!magnet) return null;
    const match = magnet.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
    return match ? match[1].toLowerCase() : null;
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    try { return new Date(dateStr).toLocaleDateString(); } catch (e) { return dateStr; }
}

// ==========================================
// 3. 业务逻辑
// ==========================================

window.doSearch = function() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (query) {
        // 使用参数路由
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

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q'); // 关键词 或 Hash

    // A. 搜索页逻辑
    if (document.getElementById('resultsList')) {
        if (q) {
            if(input) input.value = q;
            loadSearchResults(q);
        } else {
            document.getElementById('loading').classList.add('d-none');
        }
    }

    // B. 详情页逻辑
    if (document.getElementById('detailContainer')) {
        // 优先从 URL 获取透传的参数 (秒开)
        const name = params.get('name');
        const size = params.get('size');
        const date = params.get('date');
        
        // q 在这里是 Hash
        if (q && q.length === 40) {
            initDetail(q, name, size, date);
        } else {
            showDetailError(t('error_invalid'));
        }
    }
});

// 加载搜索结果
async function loadSearchResults(query) {
    const list = document.getElementById('resultsList');
    const loading = document.getElementById('loading');
    
    loading.classList.remove('d-none');
    list.innerHTML = '';

    try {
        const res = await fetch(`${API_BASE}/?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        loading.classList.add('d-none');

        if (!data || data.length === 0 || data.error) {
            list.innerHTML = `<div class="text-center py-5 text-muted">${t('no_results')}</div>`;
            return;
        }

        list.innerHTML = data.map(item => {
            const hash = extractHash(item.magnet);
            // 🔥 核心优化：把所有已知数据透传给详情页，防止详情页 API 挂了显示空白
            const safeName = encodeURIComponent(item.name);
            const detailUrl = hash 
                ? `detail.html?q=${hash}&name=${safeName}&size=${item.size}&date=${item.date}` 
                : '#';
            
            let icon = 'fa-file';
            if(item.category.includes('Video')) icon = 'fa-film';
            if(item.category.includes('App')) icon = 'fa-cube';

            return `
            <div class="card mb-3 shadow-sm border-0 hover-shadow">
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
        loading.classList.add('d-none');
        list.innerHTML = `<div class="alert alert-danger text-center">API Error: ${e.message}</div>`;
    }
}

// 初始化详情页 (先渲染 URL 参数，再异步拉取 Seeders)
async function initDetail(hash, name, size, date) {
    const container = document.getElementById('detailContainer');
    const loading = document.getElementById('loading');
    
    // 构造纯净磁力
    const cleanMagnet = `magnet:?xt=urn:btih:${hash}`;

    // 1. 立即渲染基础信息 (防白屏)
    // 如果 URL 里没有名字，说明是直接访问的 URL，此时显示 Loading 并等待 API
    if (name) {
        renderDetailView(name, size, date, '-', '-', cleanMagnet, hash);
        if(loading) loading.classList.add('d-none');
    }

    // 2. 异步拉取详细信息 (Seeders 等)
    try {
        const res = await fetch(`${API_BASE}/?q=${hash}`);
        const data = await res.json();
        
        if (data && data.length > 0) {
            const item = data[0];
            // 更新为更准确的 API 数据
            renderDetailView(item.name, item.size, item.date, item.seeders, item.leechers, cleanMagnet, hash);
            if(loading) loading.classList.add('d-none');
        } else if (!name) {
            // 如果 URL 没名字，且 API 也没结果，那就是真的没了
            showDetailError(t('no_results'));
        }
    } catch (e) {
        console.error("Detail update failed", e);
        // 如果 API 失败但我们有 URL 参数，保持显示，不报错
        if (!name) showDetailError("Network Error");
    }
}

function renderDetailView(name, size, date, seeds, leechs, magnet, hash) {
    const container = document.getElementById('detailContainer');
    
    document.title = `${name} - ${t('brand_name')}`;
    document.getElementById('fileName').innerText = name;
    document.getElementById('infoHash').innerText = hash;

    container.innerHTML = `
        <div class="row g-3 text-center mb-5">
            <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="label_size">Size</div><div class="fw-bold">${size || 'N/A'}</div></div></div>
            <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="label_date">Date</div><div class="fw-bold">${formatDate(date)}</div></div></div>
            <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="stat_seed">Seeders</div><div class="fw-bold text-success">${seeds}</div></div></div>
            <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="stat_leech">Leechers</div><div class="fw-bold text-danger">${leechs}</div></div></div>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
            <a href="${magnet}" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"><i class="fa-solid fa-magnet me-2"></i> <span data-i18n="btn_magnet">Magnet Download</span></a>
            <button onclick="window.copyToClipboard('${magnet}')" class="btn btn-outline-secondary btn-lg px-5 rounded-pill"><i class="fa-regular fa-copy me-2"></i> <span data-i18n="btn_copy">Copy Link</span></button>
        </div>
        <div class="mt-5 text-start"><h5 class="border-bottom pb-2 mb-3" data-i18n="label_files">Files</h5><div class="bg-light p-3 rounded text-muted small text-break"><i class="fa-regular fa-file me-2"></i> ${name}</div></div>
    `;
    updatePageText(); // 确保新插入的 HTML 被翻译
}

function showDetailError(msg) {
    const container = document.getElementById('detailContainer');
    const loading = document.getElementById('loading');
    if(loading) loading.classList.add('d-none');
    container.innerHTML = `<div class="alert alert-warning text-center my-5">${msg}</div>`;
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => alert(t('msg_copied')));
};