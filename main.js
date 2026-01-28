/**
 * main.js - 公共逻辑库
 * 包含：API地址、多语言字典、公共工具函数
 */

// 🔥 请确保这是你最新的 Worker 地址
const API_BASE = 'https://api.cili.xyz'; 

// 多语言字典
const i18nData = {
    en: { 
        title: "ePark Search",
        placeholder: "Search for movies, apps, anime...", 
        btn: "Search", 
        empty: "No results found.", 
        error: "Connection error", 
        hot: "Hot", 
        verified: "Verified",
        downloads: "Downloads",
        size: "Size",
        date: "Date",
        seeders: "Seeders",
        leechers: "Leechers",
        back: "Back to Search",
        magnet_open: "Open Magnet",
        copy_success: "Copied!",
        loading: "Loading..."
    },
    zh: { 
        title: "ePark 搜索",
        placeholder: "搜索电影、软件、动漫资源...", 
        btn: "搜索", 
        empty: "未找到相关资源", 
        error: "连接失败，请重试", 
        hot: "热门", 
        verified: "官方认证",
        downloads: "次下载",
        size: "大小",
        date: "日期",
        seeders: "做种",
        leechers: "下载",
        back: "返回搜索",
        magnet_open: "打开磁力链接",
        copy_success: "已复制",
        loading: "加载中..."
    },
    ko: { 
        title: "ePark 검색",
        placeholder: "영화, 앱, 애니메이션 검색...", 
        btn: "검색", 
        empty: "결과가 없습니다.", 
        error: "연결 오류", 
        hot: "인기", 
        verified: "인증됨",
        downloads: "다운로드",
        size: "크기",
        date: "날짜",
        seeders: "시더",
        leechers: "리처",
        back: "검색으로 돌아가기",
        magnet_open: "마그넷 열기",
        copy_success: "복사됨",
        loading: "로딩 중..."
    }
};

// 获取当前语言 (默认 en)
function getLang() {
    const params = new URLSearchParams(window.location.search);
    if(params.get('lang')) return params.get('lang'); // URL优先
    
    const saved = localStorage.getItem('epark_lang');
    if(saved) return saved; // 缓存次之

    const navLang = navigator.language || navigator.userLanguage;
    if(navLang.includes('zh')) return 'zh';
    if(navLang.includes('ko')) return 'ko';
    return 'en';
}

// 设置语言
function setLang(lang) {
    localStorage.setItem('epark_lang', lang);
    // 刷新页面或追加参数以应用语言
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
}

// 初始化页面文字
function initI18n() {
    const lang = getLang();
    const t = i18nData[lang];

    // 设置 title
    document.title = t.title;

    // 设置通用元素
    const els = {
        '#searchInput': 'placeholder',
        '#btnSearch': 'textContent',
        '#loadingText': 'textContent',
        '.lang-zh': 'classList', // 标记当前语言按钮
        '.lang-en': 'classList',
        '.lang-ko': 'classList'
    };

    // 搜索框 placeholder
    const input = document.querySelector('#searchInput');
    if(input) input.placeholder = t.placeholder;

    // 搜索按钮
    const btn = document.querySelector('#btnSearch');
    if(btn) btn.textContent = t.btn;
    
    // 高亮当前语言按钮
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    if(activeBtn) activeBtn.classList.add('active');

    return t; // 返回翻译对象供页面逻辑使用
}