/**
 * main.js - ePark Search Logic
 * 负责搜索请求、多语言切换、结果渲染
 */

// 🔥 你的 Cloudflare Worker 地址
const API_BASE = 'https://api.cili.xyz'; 

// 多语言字典
const i18n = {
    en: { 
        placeholder: "Search for movies, apps...", 
        btn: "Search", 
        empty: "No results found.", 
        error: "Connection error", 
        hot: "Hot", 
        verified: "Verified",
        downloads: "Downloads" 
    },
    zh: { 
        placeholder: "搜索电影、软件、资源...", 
        btn: "搜索", 
        empty: "未找到相关资源", 
        error: "连接失败，请重试", 
        hot: "热门", 
        verified: "官方认证",
        downloads: "次下载"
    },
    ko: { 
        placeholder: "영화, 앱 검색...", 
        btn: "검색", 
        empty: "결과가 없습니다.", 
        error: "연결 오류", 
        hot: "인기", 
        verified: "인증됨",
        downloads: "다운로드"
    }
};

// 默认语言
let currentLang = 'en';
// 缓存上一次的数据，用于切换语言时无需重新请求
let lastData = null;

// 初始化
window.onload = () => {
    // 检查 URL 是否有查询参数 (e.g. ?q=ubuntu)
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
        document.getElementById('searchInput').value = params.get('q');
        doSearch();
    }
    // 自动检测浏览器语言
    const userLang = navigator.language || navigator.userLanguage; 
    if (userLang.includes('zh')) setLang('zh');
    else if (userLang.includes('ko')) setLang('ko');
};

// 切换语言
function setLang(lang) {
    currentLang = lang;
    
    // 更新按钮状态
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick="setLang('${lang}')"]`).classList.add('active');
    
    // 更新 UI 文字
    document.getElementById('searchInput').placeholder = i18n[lang].placeholder;
    document.getElementById('btnSearch').textContent = i18n[lang].btn;
    
    // 如果已有结果，重新渲染以更新“热门”、“认证”等文字
    if (lastData) renderResults(lastData);
}

// 监听回车键
function handleEnter(e) { 
    if(e.key === 'Enter') doSearch(); 
}

// 执行搜索
async function doSearch(fetchNew = true) {
    const input = document.getElementById('searchInput');
    const q = input.value.trim();
    if (!q && fetchNew) return;

    const status = document.getElementById('status');
    const container = document.getElementById('results');

    if (fetchNew) {
        // 显示加载状态
        status.style.display = 'block';
        status.innerHTML = '<div class="loading">Loading...</div>';
        container.innerHTML = '';
        
        // 修改浏览器地址栏 URL (SEO友好)
        const url = new URL(window.location);
        url.searchParams.set('q', q);
        window.history.pushState({}, '', url);

        try {
            // 请求 Worker API
            const res = await fetch(`${API_BASE}/?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            
            // 缓存数据
            lastData = data; 
            renderResults(data);
        } catch (e) {
            status.innerHTML = `<div class="error">${i18n[currentLang].error}: ${e.message}</div>`;
        }
    } else if (lastData) {
        // 仅切换语言，不重新请求
        renderResults(lastData);
    }
}

// 渲染结果列表
function renderResults(data) {
    const container = document.getElementById('results');
    const status = document.getElementById('status');
    const t = i18n[currentLang];

    status.style.display = 'none';

    // 错误或空数据处理
    if (!data || data.length === 0 || data.error) {
        status.style.display = 'block';
        status.innerHTML = `<div class="error">${data.error || t.empty}</div>`;
        return;
    }

    // 生成 HTML
    container.innerHTML = data.map(item => {
        // 🔥 核心修改：生成只带 hash 的净化链接
        const detailUrl = `detail.html?hash=${item.infohash}`;
        
        // 认证绿勾逻辑
        const isVerified = item.verified ? `<span class="badge badge-verified">✅ ${t.verified}</span>` : '';
        
        // 热门标识逻辑 (>500 下载算热门)
        const isHot = (item.downloads && item.downloads > 500) ? `<span class="badge badge-hot">🔥 ${t.hot}</span>` : '';

        return `
        <a href="${detailUrl}" class="card" target="_blank">
            <div class="card-header">
                <div class="card-title">${item.name}</div>
                <div class="card-badges">
                    <span class="badge badge-size">${item.size}</span>
                    ${isVerified}
                </div>
            </div>
            <div class="card-meta">
                <div class="meta-item meta-seeders">⬆ ${item.seeders}</div>
                <div class="meta-item meta-leechers">⬇ ${item.leechers}</div>
                <div class="meta-item">📅 ${item.date}</div>
                <div class="meta-item">${isHot ? item.downloads + ' ' + t.downloads : ''}</div>
            </div>
        </a>
        `;
    }).join('');
}