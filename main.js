/**
 * main.js - v4.0 (Pretty URL & Flag Switcher)
 * 支持静态路由解析 /search/{keyword} 和 /detail/{hash}
 */

// ==========================================
// 1. 字典与配置
// ==========================================
const dictionary = {
    'nav_home': { 'zh-CN': '首页', 'en': 'Home', 'ko': '홈', 'ja': 'ホーム', 'es': 'Inicio', 'fr': 'Accueil' },
    'hero_title': { 'zh-CN': '全网资源聚合', 'en': 'Discover Anything', 'ko': '모든 리소스 검색', 'ja': 'あらゆるものを検索', 'es': 'Descubre Todo', 'fr': 'Découvrez Tout' },
    'search_placeholder': { 'zh-CN': '搜索电影、剧集、软件...', 'en': 'Search movies, software...', 'ko': '영화, 소프트웨어 검색...', 'ja': '映画、ソフト検索...', 'es': 'Buscar archivos...', 'fr': 'Rechercher...' },
    'search_btn': { 'zh-CN': '搜索', 'en': 'Search', 'ko': '검색', 'ja': '検索', 'es': 'Buscar', 'fr': 'Chercher' },
    'res_found': { 'zh-CN': '找到结果', 'en': 'Results', 'ko': '결과', 'ja': '結果', 'es': 'Resultados', 'fr': 'Résultats' },
    'btn_download': { 'zh-CN': '磁力下载', 'en': 'Download', 'ko': '다운로드', 'ja': 'ダウンロード', 'es': 'Descargar', 'fr': 'Télécharger' },
    'label_files': { 'zh-CN': '文件列表', 'en': 'Files', 'ko': '파일', 'ja': 'ファイル', 'es': 'Archivos', 'fr': 'Fichiers' }
};

const CONFIG = {
    defaultLang: 'en',
    storageKey: 'cili_lang',
    // 定义支持的语言和对应的国旗代码 (flag-icons css类名)
    langs: [
        { code: 'zh-CN', flag: 'cn', name: '简体中文' }, // 中国
        { code: 'en',    flag: 'us', name: 'English' },  // 美国
        { code: 'ko',    flag: 'kr', name: '한국어' },    // 韩国
        { code: 'ja',    flag: 'jp', name: '日本語' },    // 日本
        { code: 'es',    flag: 'es', name: 'Español' },  // 西班牙
        { code: 'fr',    flag: 'fr', name: 'Français' }  // 法国
    ]
};

// 初始化语言
let currentLang = localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultLang;

// ==========================================
// 2. 核心功能函数
// ==========================================

function t(key) {
    return dictionary[key]?.[currentLang] || dictionary[key]?.['en'] || key;
}

// 渲染国旗栏
function renderFlags() {
    const container = document.getElementById('flagContainer');
    if (!container) return;

    let html = '';
    CONFIG.langs.forEach(lang => {
        // 判断是否激活
        const activeClass = lang.code === currentLang ? 'active' : '';
        // 生成国旗图标 (使用 flag-icons 的 fi fi-xx 类)
        html += `<div class="flag-btn fi fi-${lang.flag} ${activeClass}" 
                      onclick="setLanguage('${lang.code}')" 
                      title="${lang.name}"></div>`;
    });
    container.innerHTML = html;
}

function updatePageText() {
    // 更新文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.placeholder) el.placeholder = t(key);
        else el.innerText = t(key);
    });
    // 更新国旗高亮状态
    renderFlags();
}

// 全局切换语言函数
window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem(CONFIG.storageKey, lang);
    updatePageText();
};

// 执行搜索 (跳转到伪静态URL)
window.doSearch = function() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (query) {
        // 🔥 关键修改：跳转到 /search/{keyword}
        window.location.href = `/search/${encodeURIComponent(query)}`;
    }
};

// 辅助：从URL路径获取参数 (用于 /search/ubuntu 和 /detail/hash)
function getPathParam(index) {
    // 路径像这样: /search/ubuntu/
    // split('/') -> ["", "search", "ubuntu", ""]
    const segments = window.location.pathname.split('/').filter(s => s);
    // index 1 也就是第二个片段 (0是search, 1是ubuntu)
    return segments[index] ? decodeURIComponent(segments[index]) : null;
}

// ==========================================
// 3. 页面初始化逻辑
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderFlags(); // 先渲染国旗
    updatePageText(); // 再更新文字

    // 绑定搜索框回车
    const input = document.getElementById('searchInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.doSearch();
        });
    }

    // --- 详情页逻辑 (/detail/hash) ---
    if (window.location.pathname.startsWith('/detail')) {
        // 从路径获取 hash (它是路径的第二部分)
        // 例如: /detail/5b3260...
        const hash = getPathParam(1); 
        
        if (hash) {
            // 这里为了演示，我们把 hash 当作 ID 去请求。
            // 实际中 BitSearch API 也是可以用 hash 搜的，或者你需要根据你的 API 调整。
            // 假设我们把 hash 当作 query 传给 API (通常 API 支持 q=hash)
            initDetailPage(hash); 
        } else {
            document.getElementById('fileName').innerText = 'Invalid URL';
        }
    }

    // --- 搜索页逻辑 (/search/keyword) ---
    if (window.location.pathname.startsWith('/search')) {
        const query = getPathParam(1);
        if (query) {
            document.getElementById('searchInput').value = query;
            initSearchPage(query);
        }
    }
});

// ==========================================
// 4. API 业务逻辑 (保持精简)
// ==========================================
const API_BASE = 'https://api.cili.xyz'; 

async function initSearchPage(query) {
    const list = document.getElementById('resultsList');
    const loading = document.getElementById('loading');
    
    try {
        const res = await fetch(`${API_BASE}/?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        loading.style.display = 'none';

        if (data.error || data.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:40px; color:#999;">No results found</div>`;
            return;
        }

        list.innerHTML = data.map(item => `
            <div class="result-card">
                <a href="/detail/${extractHash(item.magnet)}?name=${encodeURIComponent(item.name)}&size=${item.size}" class="result-title">${item.name}</a>
                <div class="meta-tags">
                    <span class="tag video">${item.category}</span>
                    <span class="tag">${item.size}</span>
                    <span class="tag text-success">↑ ${item.seeders}</span>
                    <span class="tag text-danger">↓ ${item.leechers}</span>
                    <span class="tag">${item.date}</span>
                </div>
            </div>
        `).join('');

    } catch (e) {
        loading.innerHTML = 'Error loading results';
    }
}

function initDetailPage(hash) {
    // 因为 /detail/{hash} 页面没有带文件名等参数，我们需要用这个 hash 去 API 搜一下，或者 API 有专门的 detail 接口
    // 这里为了逻辑闭环，我们假设 URL 里还带了 query params 作为补充信息 (从 search页跳转过来带的)
    // 如果是纯 hash 访问，需要调用 API fetch 一次详情
    
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get('name');
    const sizeFromUrl = params.get('size');

    // 如果 URL 有参数直接用，没有则显示 Loading 等待 API (这里简化处理)
    if(nameFromUrl) {
        document.getElementById('fileName').innerText = nameFromUrl;
        document.getElementById('fileSize').innerText = sizeFromUrl || '--';
        // 构造磁力链
        const magnet = `magnet:?xt=urn:btih:${hash}`;
        document.getElementById('magnetBtn').href = magnet;
        document.getElementById('infoHash').innerText = hash;
    } else {
         // 如果用户直接访问 /detail/hash 且没有参数，你应该在这里 fetch API
         document.getElementById('fileName').innerText = "Fetching details for " + hash + "...";
         // ... fetch logic ...
    }
}

// 辅助：从磁力链提取 Hash
function extractHash(magnet) {
    const match = magnet.match(/xt=urn:btih:([a-zA-Z0-9]+)/);
    return match ? match[1] : 'unknown';
}