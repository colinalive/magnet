/**
 * main.js - v15.0 API-First Detail Page
 * 1. 详情页完全独立：只依赖 Hash，数据全走 API
 * 2. 修复了依赖 URL 参数导致详情页空白的问题
 * 3. 保持多语言、SEO 和 Footer 统一
 */

const API_BASE = 'https://api.cili.xyz'; 

const dictionary = {
    // 品牌
    'brand_name': { 'zh-CN': '磁力先锋', 'zh-TW': '磁力先鋒', 'en': 'Magnet Pioneer', 'ko': '마그넷 파이오니어', 'ja': 'マグネットパイオニア' },
    'home_title': { 'zh-CN': '极速纯净的磁力搜索引擎', 'zh-TW': '極速純淨的磁力搜尋引擎', 'en': 'Fast & Clean Magnet Search', 'ko': '빠르고 깨끗한 마그넷 검색', 'ja': '高速でクリーンな磁気検索' },
    
    // SEO
    'meta_keywords': { 'zh-CN': '磁力链接, 种子搜索, 磁力先锋', 'en': 'magnet links, torrent search, magnet pioneer' },
    'meta_desc': { 'zh-CN': '磁力先锋提供极速的磁力链接索引服务。', 'en': 'Magnet Pioneer provides fast indexing of millions of magnet links.' },

    // 界面
    'nav_home': { 'zh-CN': '首页', 'zh-TW': '首頁', 'en': 'Home', 'ko': '홈', 'ja': 'ホーム' },
    'hero_title': { 'zh-CN': '探索无限资源', 'zh-TW': '探索無限資源', 'en': 'Discover Anything', 'ko': '무한한 자원 탐색', 'ja': 'あらゆるものを検索' },
    'search_placeholder': { 'zh-CN': '搜索电影、剧集、软件...', 'zh-TW': '搜尋電影、劇集、軟體...', 'en': 'Search...', 'ko': '검색...', 'ja': '検索...' },
    'search_btn': { 'zh-CN': '搜索', 'zh-TW': '搜尋', 'en': 'Search', 'ko': '검색', 'ja': '検索' },
    'res_found': { 'zh-CN': '搜索结果', 'zh-TW': '搜尋結果', 'en': 'Results', 'ko': '검색 결과', 'ja': '検索結果' },
    
    // 详情页
    'label_size': { 'zh-CN': '文件大小', 'zh-TW': '檔案大小', 'en': 'File Size', 'ko': '파일 크기', 'ja': 'サイズ' },
    'label_date': { 'zh-CN': '收录日期', 'zh-TW': '收錄日期', 'en': 'Date Indexed', 'ko': '날짜', 'ja': '日付' },
    'label_files':{ 'zh-CN': '文件概览', 'zh-TW': '檔案預覽', 'en': 'File Preview', 'ko': '파일 미리보기', 'ja': 'ファイル' },
    'stat_seed':  { 'zh-CN': '做种', 'zh-TW': '做種', 'en': 'Seeders', 'ko': '시더', 'ja': 'シード' },
    'stat_leech': { 'zh-CN': '下载中', 'zh-TW': '下載中', 'en': 'Leechers', 'ko': '리처', 'ja': 'リーチ' },
    'btn_magnet': { 'zh-CN': '磁力下载', 'zh-TW': '磁力下載', 'en': 'Magnet Download', 'ko': '마그넷 다운로드', 'ja': 'マグネットDL' },
    'btn_copy':   { 'zh-CN': '复制链接', 'zh-TW': '複製連結', 'en': 'Copy Link', 'ko': '링크 복사', 'ja': 'リンクをコピー' },
    'msg_copied': { 'zh-CN': '链接已复制', 'zh-TW': '連結已複製', 'en': 'Link Copied', 'ko': '복사됨', 'ja': 'コピーしました' },
    
    'loading':    { 'zh-CN': '正在加载数据...', 'zh-TW': '正在加載數據...', 'en': 'Fetching Data...', 'ko': '데이터 로드 중...', 'ja': 'データ読み込み中...' },
    'no_results': { 'zh-CN': '未找到相关资源', 'zh-TW': '未找到相關資源', 'en': 'No Results Found', 'ko': '결과 없음', 'ja': '結果なし' },
    'error_api':  { 'zh-CN': '连接服务器失败', 'zh-TW': '連接服務器失敗', 'en': 'Connection Failed', 'ko': '연결 실패', 'ja': '接続失敗' },
    
    'copyright':  { 'zh-CN': '© 2026 磁力先锋。仅提供元数据索引，不存储任何文件。', 'zh-TW': '© 2026 磁力先鋒。僅提供元數據索引，不存儲任何文件。', 'en': '© 2026 Magnet Pioneer. Metadata index only, no files hosted.', 'ko': '© 2026 Magnet Pioneer. 메타데이터 인덱스 전용.', 'ja': '© 2026 Magnet Pioneer. メタデータインデックスのみ。' }
};

const CONFIG = {
    defaultLang: 'en',
    storageKey: 'cili_lang',
    langs: [
        { code: 'zh-CN', flag: 'cn', name: '简体中文' },
        { code: 'zh-TW', flag: 'tw', name: '繁體中文' },
        { code: 'en',    flag: 'us', name: 'English' },
        { code: 'ko',    flag: 'kr', name: '한국어' },
        { code: 'ja',    flag: 'jp', name: '日本語' }
    ]
};

// ==========================================
// 2. 核心工具
// ==========================================
let currentLang = localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultLang;
window.pageTitlePrefix = null; // 用于动态标题

function t(key) {
    return dictionary[key]?.[currentLang] || dictionary[key]?.['en'] || key;
}

function updatePageText() {
    // 更新 data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.placeholder) el.placeholder = t(key);
        else el.innerText = t(key);
    });

    // 更新品牌
    document.querySelectorAll('.brand-text').forEach(el => el.innerText = t('brand_name'));

    // 更新 Title
    const brand = t('brand_name');
    document.title = window.pageTitlePrefix ? `${window.pageTitlePrefix} - ${brand}` : `${brand} - ${t('home_title')}`;

    // 更新 SEO Meta
    const setMeta = (name, content) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
        el.content = content;
    };
    setMeta('description', t('meta_desc'));
    setMeta('keywords', t('meta_keywords'));

    // 渲染国旗
    const container = document.getElementById('flagContainer');
    if (container) {
        container.innerHTML = CONFIG.langs.map(lang => `
            <button class="btn border-0 p-1 mx-1 ${lang.code === currentLang ? 'opacity-100' : 'opacity-50'}" 
                onclick="window.setLanguage('${lang.code}')" title="${lang.name}">
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

window.doSearch = function() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (query) window.location.href = `search.html?q=${encodeURIComponent(query)}`;
};

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => alert(t('msg_copied')));
};

// ==========================================
// 3. 业务逻辑入口
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updatePageText();

    const input = document.getElementById('searchInput');
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.doSearch(); });

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q'); 

    // A. 搜索页逻辑
    if (document.getElementById('resultsList') && q) {
        if(input) input.value = q;
        window.pageTitlePrefix = q; 
        updatePageText();
        loadSearchResults(q);
    }

    // B. 详情页逻辑
    if (document.getElementById('detailContainer')) {
        // 如果有 q 参数 (Hash)，则请求 API
        if (q && q.length === 40) {
            loadDetailFromApi(q);
        } else {
            showDetailError(t('no_results'));
        }
    }
});

// 加载搜索列表
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
            // 🔥 Clean URL: 只有 ?q=HASH
            const detailUrl = hash ? `detail.html?q=${hash}` : '#';
            
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

// 详情页：完全依赖 API 获取数据
async function loadDetailFromApi(hash) {
    const container = document.getElementById('detailContainer');
    // 显示 Loading 状态
    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-3" data-i18n="loading">Fetching...</p>
        </div>
    `;
    updatePageText(); // 翻译 "Fetching..."

    try {
        // 使用 Hash 查询 API
        const res = await fetch(`${API_BASE}/?q=${hash}`);
        const data = await res.json();
        
        // 假设 API 返回数组，取第一个匹配项
        const item = (data && data.length > 0) ? data[0] : null;

        if (!item) {
            showDetailError(t('no_results'));
            return;
        }

        // 设置动态标题
        window.pageTitlePrefix = item.name;
        updatePageText();

        // 渲染详情
        renderDetailView(item, hash);

    } catch (e) {
        showDetailError(`${t('error_api')}: ${e.message}`);
    }
}

function renderDetailView(item, hash) {
    const container = document.getElementById('detailContainer');
    const magnet = `magnet:?xt=urn:btih:${hash}`;
    
    container.innerHTML = `
        <div class="card-header bg-white text-center py-5 border-bottom">
            <div class="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style="width: 80px; height: 80px;">
                <i class="fa-solid fa-file-lines fa-3x"></i>
            </div>
            <h1 class="h3 fw-bold px-3 text-break">${item.name}</h1>
            <div class="mt-3">
                <span class="badge bg-light text-secondary border font-monospace">${hash}</span>
            </div>
        </div>

        <div class="card-body p-4 p-md-5">
            <div class="row g-3 text-center mb-5">
                <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="label_size">Size</div><div class="fw-bold">${item.size}</div></div></div>
                <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="label_date">Date</div><div class="fw-bold">${formatDate(item.date)}</div></div></div>
                <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="stat_seed">Seeders</div><div class="fw-bold text-success">${item.seeders}</div></div></div>
                <div class="col-6 col-md-3"><div class="p-3 bg-light rounded border h-100"><div class="text-muted small mb-1" data-i18n="stat_leech">Leechers</div><div class="fw-bold text-danger">${item.leechers}</div></div></div>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <a href="${magnet}" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"><i class="fa-solid fa-magnet me-2"></i> <span data-i18n="btn_magnet">Download</span></a>
                <button onclick="window.copyToClipboard('${magnet}')" class="btn btn-outline-secondary btn-lg px-5 rounded-pill"><i class="fa-regular fa-copy me-2"></i> <span data-i18n="btn_copy">Copy</span></button>
            </div>
            
            <div class="mt-5 text-start">
                 <h5 class="border-bottom pb-2 mb-3" data-i18n="label_files">Files</h5>
                 <div class="bg-light p-3 rounded text-muted small text-break">
                    <i class="fa-regular fa-file me-2"></i> ${item.name}
                 </div>
            </div>
        </div>
    `;
    updatePageText(); // 确保新渲染的 HTML (Size/Date标签) 被翻译
}

function showDetailError(msg) {
    document.getElementById('detailContainer').innerHTML = 
        `<div class="alert alert-danger text-center my-5">${msg}</div>`;
}