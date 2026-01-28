/**
 * js/app.js - 磁力先锋 (cili.xyz) 核心控制逻辑
 */

const CONFIG = {
    API_BASE: 'https://api.cili.xyz', // 您的 Cloudflare Worker 域名
    STORAGE_LANG: 'cili_pioneer_lang',
    CACHE_PREFIX: 'cili_res_'
};

const i18n = {
    'en': { title: "Magnet Pioneer", search: "Search", verified: "Verified", seeds: "Seeds", date: "Date", size: "Size", downloads: "Downloads", copy: "Copy Magnet", back: "Back", loading: "Searching...", empty: "No Results", success: "Copied!", hash: "Info Hash", category: "Category" },
    'zh-CN': { title: "磁力先锋", search: "搜索", verified: "官方认证", seeds: "做种", date: "发布日期", size: "大小", downloads: "下载次数", copy: "复制链接", back: "返回", loading: "加载中...", empty: "未找到相关资源", success: "已复制到剪贴板", hash: "哈希值", category: "资源分类" },
    'zh-TW': { title: "磁力先鋒", search: "搜尋", verified: "官方認證", seeds: "做種", date: "發布日期", size: "大小", downloads: "下載次數", copy: "複製連結", back: "返回", loading: "載入中...", empty: "未找到相關資源", success: "已複製", hash: "哈希值", category: "資源分類" },
    'ja': { title: "マグネットパイオニア", search: "検索", verified: "認証済み", seeds: "シード", date: "日付", size: "サイズ", downloads: "ダウンロード", copy: "コピー", back: "戻る", loading: "読み込み中...", empty: "なし", success: "成功!", hash: "ハッシュ", category: "カテゴリー" },
    'ko': { title: "마그넷 파이오니어", search: "검색", verified: "인증됨", seeds: "시더", date: "날짜", size: "크기", downloads: "다운로드", copy: "복사", back: "뒤로", loading: "로딩 중...", empty: "결과 없음", success: "복사됨!", hash: "해시", category: "분류" }
};

class CiliApp {
    constructor() {
        this.lang = this.initLang();
        this.t = i18n[this.lang];
    }

    // 自动语言判断逻辑
    initLang() {
        let saved = localStorage.getItem(CONFIG.STORAGE_LANG);
        if (saved && i18n[saved]) return saved;

        // 识别陌生访客
        const nav = navigator.language.toLowerCase();
        if (nav.includes('zh-tw') || nav.includes('hk')) return 'zh-TW';
        if (nav.includes('zh')) return 'zh-CN';
        if (nav.includes('ja')) return 'ja';
        if (nav.includes('ko')) return 'ko';
        return 'en';
    }

    changeLang(l) {
        localStorage.setItem(CONFIG.STORAGE_LANG, l);
        window.location.reload(); //
    }

    // 更新 SEO 标题
    updateMeta(pageTitle) {
        document.title = `${pageTitle} - ${this.t.title}`;
    }
}

window.App = new CiliApp();