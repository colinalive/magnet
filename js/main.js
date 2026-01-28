/**
 * js/main.js - 核心逻辑 (Bootstrap 版)
 */

// 🔥 你的 Cloudflare Worker API 地址
const API_BASE = 'https://api.cili.xyz'; 

// 多语言字典
const i18nData = {
    en: { 
        title: "Magnet Pioneer",
        placeholder: "Search for movies, serials, anime...", 
        btn: "Search", 
        empty: "No results found.", 
        error: "Network Error", 
        hot: "Hot", 
        verified: "Verified",
        downloads: "Downloads",
        size: "Size",
        date: "Date",
        seeders: "Seeds",
        leechers: "Leeches",
        back: "Back",
        magnet_open: "Magnet Link",
        copy_success: "Copied!",
        loading: "Loading...",
        infohash: "Info Hash",
        files: "Files"
    },
    zh: { 
        title: "磁力先锋",
        placeholder: "搜索电影、剧集、动漫、软件...", 
        btn: "搜索", 
        empty: "未找到相关资源", 
        error: "网络连接失败", 
        hot: "热门", 
        verified: "官方认证",
        downloads: "次下载",
        size: "大小",
        date: "发布日期",
        seeders: "做种",
        leechers: "下载",
        back: "返回",
        magnet_open: "磁力链接",
        copy_success: "已复制",
        loading: "加载中...",
        infohash: "哈希值 (Info Hash)",
        files: "文件列表"
    },
    ko: { 
        title: "마그넷 파이오니어",
        placeholder: "영화, 드라마, 애니메이션 검색...", 
        btn: "검색", 
        empty: "결과가 없습니다.", 
        error: "네트워크 오류", 
        hot: "인기", 
        verified: "인증됨",
        downloads: "다운로드",
        size: "크기",
        date: "날짜",
        seeders: "시더",
        leechers: "리처",
        back: "뒤로",
        magnet_open: "마그넷 링크",
        copy_success: "복사됨",
        loading: "로딩 중...",
        infohash: "인포 해시",
        files: "파일 목록"
    }
};

// --- 全局工具函数 (挂载到 window 以防止 ReferenceError) ---

// 1. 获取语言
window.getLang = function() {
    const params = new URLSearchParams(window.location.search);
    if(params.get('lang')) return params.get('lang');
    const saved = localStorage.getItem('cili_lang');
    if(saved) return saved;
    const nav = navigator.language || navigator.userLanguage;
    if(nav.includes('zh')) return 'zh';
    if(nav.includes('ko')) return 'ko';
    return 'en';
};

// 2. 设置语言
window.setLang = function(lang) {
    localStorage.setItem('cili_lang', lang);
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
};

// 3. 初始化页面通用元素 (Title, Placeholders)
window.initPage = function() {
    const lang = getLang();
    const t = i18nData[lang];

    // 设置网页标题
    document.title = `${t.title} - cili.xyz`;

    // 设置 Logo 文字
    const logo = document.querySelector('.navbar-brand');
    if(logo) logo.innerHTML = `🧲 ${t.title}`;

    // 设置搜索框 Placeholder
    const input = document.querySelector('#searchInput');
    if(input) input.placeholder = t.placeholder;

    // 设置搜索按钮
    const btn = document.querySelector('#btnSearch');
    if(btn) btn.textContent = t.btn;

    // 高亮当前语言
    document.querySelectorAll('.lang-select').forEach(el => {
        if(el.dataset.lang === lang) el.classList.add('active', 'fw-bold');
    });

    return t; // 返回字典供页面特定逻辑使用
};

// 4. 回车搜索
window.handleEnter = function(e) {
    if(e.key === 'Enter') window.goSearch();
};

// 5. 跳转搜索
window.goSearch = function() {
    const input = document.getElementById('searchInput');
    if(!input) return;
    const q = input.value.trim();
    if(!q) return;
    const lang = getLang();
    // 跳转到 search.html
    window.location.href = `search.html?q=${encodeURIComponent(q)}&lang=${lang}`;
};