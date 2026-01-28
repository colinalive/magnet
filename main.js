/**
 * main.js - v11.0 Diagnostic Fix
 * 包含：强制超时、错误显式抛出、状态可视化
 */

// ==========================================
// 1. 配置区
// ==========================================
// 请确保这个地址是你 Cloudflare Worker 的真实地址，不要带尾部斜杠
const API_BASE = 'https://api.cili.xyz'; 

const dictionary = {
    'brand_name': { 'zh-CN': '磁力先锋', 'en': 'Magnet Pioneer' },
    'meta_title': { 'zh-CN': '磁力先锋 - 极速纯净', 'en': 'Magnet Pioneer' },
    'search_placeholder': { 'zh-CN': '输入关键词搜索...', 'en': 'Search keyword...' },
    'search_btn': { 'zh-CN': '搜索', 'en': 'Search' },
    'res_found': { 'zh-CN': '搜索结果', 'en': 'Results' },
    'loading': { 'zh-CN': '正在连接全球网络...', 'en': 'Connecting to global network...' },
    'no_results': { 'zh-CN': '未找到相关资源', 'en': 'No Results Found' },
    
    // 详情页
    'label_size': { 'zh-CN': '大小', 'en': 'Size' },
    'label_date': { 'zh-CN': '日期', 'en': 'Date' },
    'btn_magnet': { 'zh-CN': '磁力下载', 'en': 'Download' },
    'btn_copy': { 'zh-CN': '复制链接', 'en': 'Copy Link' },
    'msg_copied': { 'zh-CN': '已复制', 'en': 'Copied' },
    'files': { 'zh-CN': '文件列表', 'en': 'Files' }
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
// 2. 核心工具
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

function extractHash(magnet) {
    if (!magnet) return null;
    const match = magnet.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
    return match ? match[1].toLowerCase() : null;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try { return new Date(dateStr).toLocaleDateString(); } catch (e) { return dateStr; }
}

// ==========================================
// 3. 业务逻辑
// ==========================================

// 搜索跳转
window.doSearch = function() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
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

    // 获取 URL 参数
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');

    // 页面路由检测
    const isSearchPage = document.getElementById('resultsList');
    const isDetailPage = document.getElementById('detailContainer');

    if (isSearchPage) {
        if (q) {
            if (input) input.value = q;
            loadSearchResults(q);
        } else {
            // 没有参数时，隐藏 loading
            const loading = document.getElementById('loading');
            if(loading) loading.classList.add('d-none');
        }
    }

    if (isDetailPage) {
        if (q) loadDetail(q);
        else showError('detailContainer', 'URL 参数错误: 缺少 Hash');
    }
});

// 显示错误信息的辅助函数
function showError(containerId, msg) {
    const el = document.getElementById(containerId);
    if(el) el.innerHTML = `<div class="alert alert-danger text-center my-5">${msg}</div>`;
    // 同时隐藏 loading
    const loading = document.getElementById('loading');
    if(loading) loading.classList.add('d-none');
}

// 带有超时的 Fetch
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options; // 8秒超时
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
}

// 加载搜索结果
async function loadSearchResults(query) {
    const list = document.getElementById('resultsList');
    const loading = document.getElementById('loading');
    const statusText = document.getElementById('statusText'); // 新增：状态显示

    // 重置状态
    loading.classList.remove('d-none');
    if(list) list.innerHTML = '';
    if(statusText) statusText.innerText = '正在连接 API 服务器...';

    try {
        const apiUrl = `${API_BASE}/?q=${encodeURIComponent(query)}`;
        
        // 发起请求
        const res = await fetchWithTimeout(apiUrl);
        
        if(statusText) statusText.innerText = '服务器已响应，正在解析数据...';

        if (!res.ok) {
            throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        
        // 隐藏 Loading
        loading.classList.add('d-none');

        // 数据为空
        if (!data || data.length === 0 || data.error) {
            list.innerHTML = `<div class="text-center py-5 text-muted display-6">
                <i class="fa-regular fa-folder-open mb-3"></i><br>${t('no_results')}
            </div>`;
            return;
        }

        // 渲染数据
        list.innerHTML = data.map(item => {
            const hash = extractHash(item.magnet);
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
        console.error(e); // 打印到控制台以防万一
        showError('resultsList', `请求失败: ${e.message}<br><small class="text-muted">请检查网络或 API 地址配置</small>`);
    }
}

// 加载详情
async function loadDetail(hash) {
    const container = document.getElementById('detailContainer');
    const loading = document.getElementById('loading'); // 复用 loading

    try {
        const res = await fetchWithTimeout(`${API_BASE}/?q=${hash}`);
        const data = await res.json();
        const item = (data && data.length > 0) ? data[0] : null;

        if(loading) loading.classList.add('d-none');

        if (!item) {
            showError('detailContainer', t('no_results'));
            return;
        }

        const cleanMagnet = item.magnet ? `magnet:?xt=urn:btih:${hash}` : '';
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
                <a href="${cleanMagnet}" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"><i class="fa-solid fa-magnet me-2"></i> <span data-i18n="btn_magnet">Download</span></a>
                <button onclick="window.copyToClipboard('${cleanMagnet}')" class="btn btn-outline-secondary btn-lg px-5 rounded-pill"><i class="fa-regular fa-copy me-2"></i> <span data-i18n="btn_copy">Copy</span></button>
            </div>
            <div class="mt-5 text-start"><h5 class="border-bottom pb-2 mb-3" data-i18n="files">Files</h5><div class="bg-light p-3 rounded text-muted small"><i class="fa-regular fa-file me-2"></i> ${item.name}</div></div>
        `;
        updatePageText();
    } catch (e) {
        showError('detailContainer', `加载详情失败: ${e.message}`);
    }
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => alert(t('msg_copied')));
};