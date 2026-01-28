/**
 * js/main.js - 核心逻辑 (修复版)
 */

// 🔥 你的 API 地址 (Cloudflare Worker)
const API_BASE = 'https://api.cili.xyz'; 

// 多语言字典 (完整版)
const i18nData = {
    'en': { 
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
        files: "Files",
        category: "Category"
    },
    'zh-CN': { 
        title: "磁力先锋",
        placeholder: "搜索电影、剧集、动漫、软件...", 
        btn: "搜索", 
        empty: "未找到相关资源", 
        error: "网络连接失败 (请检查 API)", 
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
        files: "文件列表",
        category: "分类"
    },
    'zh-TW': { 
        title: "磁力先鋒",
        placeholder: "搜尋電影、劇集、動漫、軟體...", 
        btn: "搜尋", 
        empty: "未找到相關資源", 
        error: "網絡連接失敗", 
        hot: "熱門", 
        verified: "官方認證",
        downloads: "次下載",
        size: "大小",
        date: "發布日期",
        seeders: "做種",
        leechers: "下載",
        back: "返回",
        magnet_open: "磁力連結",
        copy_success: "已複製",
        loading: "載入中...",
        infohash: "哈希值 (Info Hash)",
        files: "檔案列表",
        category: "分類"
    },
    'ja': { 
        title: "マグネットパイオニア",
        placeholder: "映画、アニメ、ソフトウェアを検索...", 
        btn: "検索", 
        empty: "結果が見つかりません", 
        error: "ネットワークエラー", 
        hot: "人気", 
        verified: "認証済み",
        downloads: "ダウンロード",
        size: "サイズ",
        date: "日付",
        seeders: "シード",
        leechers: "リーチ",
        back: "戻る",
        magnet_open: "マグネットリンク",
        copy_success: "コピーしました",
        loading: "読み込み中...",
        infohash: "情報ハッシュ",
        files: "ファイルリスト",
        category: "カテゴリー"
    },
    'ko': { 
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
        files: "파일 목록",
        category: "분류"
    }
};

// --- 工具函数 (全部挂载到 window，防止 ReferenceError) ---

// 1. 语言代码标准化 (关键修复：解决 zh-CN 匹配不到的问题)
window.normalizeLang = function(lang) {
    if (!lang) return 'en';
    lang = lang.toLowerCase();
    if (lang.includes('zh-tw') || lang.includes('hk') || lang.includes('hant')) return 'zh-TW';
    if (lang.includes('zh')) return 'zh-CN';
    if (lang.includes('ja')) return 'ja';
    if (lang.includes('ko')) return 'ko';
    return 'en';
};

// 2. 获取当前语言
window.getLang = function() {
    const params = new URLSearchParams(window.location.search);
    if(params.get('lang')) return window.normalizeLang(params.get('lang'));
    
    const saved = localStorage.getItem('cili_lang');
    if(saved) return window.normalizeLang(saved);
    
    const nav = navigator.language || navigator.userLanguage;
    return window.normalizeLang(nav);
};

// 3. 设置语言
window.setLang = function(lang) {
    localStorage.setItem('cili_lang', lang);
    // 刷新页面并带上参数
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
};

// 4. 初始化页面
window.initPage = function() {
    const lang = window.getLang();
    // 🔥 回退保护：如果字典里没有该语言，回退到 en
    const t = i18nData[lang] || i18nData['en'];

    // 设置网页标题
    document.title = `${t.title} - cili.xyz`;

    // 设置 Logo
    const logo = document.querySelector('.navbar-brand');
    if(logo) logo.innerHTML = `🧲 ${t.title}`;

    // 设置搜索框
    const input = document.querySelector('#searchInput');
    if(input) input.placeholder = t.placeholder;

    // 设置按钮
    const btn = document.querySelector('#btnSearch');
    if(btn) btn.textContent = t.btn;

    // 高亮当前语言标记
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.dataset.lang === lang) {
            btn.classList.add('active', 'bg-secondary', 'text-white'); 
        } else {
            btn.classList.remove('active', 'bg-secondary', 'text-white');
        }
    });

    return t; 
};

// 5. 回车监听
window.handleEnter = function(e) {
    if(e.key === 'Enter') window.goSearch();
};

// 6. 跳转搜索
window.goSearch = function() {
    const input = document.getElementById('searchInput');
    if(!input) return;
    const q = input.value.trim();
    if(!q) return;
    const lang = window.getLang();
    window.location.href = `search.html?q=${encodeURIComponent(q)}&lang=${lang}`;
};