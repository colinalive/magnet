/**
 * cili.xyz - Core Application Logic
 * Modern magnet search application
 * API: BitSearch API v1
 */

const CONFIG = {
    API_BASE: 'https://api.cili.xyz',
    BITSEARCH_API: 'https://bitsearch.to/api/v1',
    STORAGE_LANG: 'cili_lang',
    CACHE_PREFIX: 'cili_detail_',
    DEFAULT_LANG: 'en'
};

const LANGUAGES = {
    'en': {
        code: 'en',
        flag: 'us',
        name: 'English',
        nativeName: 'English'
    },
    'zh-CN': {
        code: 'zh-CN',
        flag: 'cn',
        name: 'Chinese (Simplified)',
        nativeName: '简体中文'
    },
    'zh-TW': {
        code: 'zh-TW',
        flag: 'tw',
        name: 'Chinese (Traditional)',
        nativeName: '繁體中文'
    },
    'ja': {
        code: 'ja',
        flag: 'jp',
        name: 'Japanese',
        nativeName: '日本語'
    },
    'ko': {
        code: 'ko',
        flag: 'kr',
        name: 'Korean',
        nativeName: '한국어'
    }
};

const i18n = {
    'en': {
        // Common
        siteName: 'cili.xyz',
        siteTitle: 'Magnet Pioneer',
        // Home
        heroTitle: 'cili<span>.xyz</span>',
        heroSubtitle: 'Magnet Pioneer: Indexing the Future',
        searchPlaceholder: 'Search for torrents...',
        searchButton: 'Search',
        // Search results
        searchTitle: 'Search Results',
        searchingText: 'Searching...',
        noResults: 'No results found',
        apiError: 'Connection error. Please try again.',
        resultsFor: 'Results for',
        // Pagination
        page: 'Page',
        of: 'of',
        prev: 'Previous',
        next: 'Next',
        total: 'Total',
        results: 'results',
        // Detail labels
        size: 'Size',
        seeds: 'Seeds',
        leechers: 'Leechers',
        downloads: 'Downloads',
        category: 'Category',
        subcategory: 'Subcategory',
        dateAdded: 'Date Added',
        uploadedAt: 'Uploaded',
        infoHash: 'Info Hash',
        magnetLink: 'Magnet Link',
        torrentFile: 'Torrent File',
        downloadTorrent: 'Download .torrent',
        copyMagnet: 'Copy Magnet Link',
        copied: 'Copied!',
        technicalDetails: 'Technical Details',
        fileList: 'File List',
        files: 'files',
        verified: 'Verified',
        imdbRating: 'IMDb Rating',
        // Navigation
        back: 'Back',
        home: 'Home',
        // Footer
        footerTagline: 'Fast, reliable magnet search',
        dmca: 'DMCA',
        privacy: 'Privacy',
        support: 'Support',
        copyright: '© 2026 cili.xyz. All rights reserved.',
        // Errors
        resourceNotFound: 'Resource not found',
        loadingError: 'Failed to load data',
        loading: 'Loading...',
        // SEO
        metaDescription: 'cili.xyz - Fast and reliable magnet link search engine. Find torrents quickly and easily.',
        searchMetaDescription: 'Search results for "{query}" on cili.xyz - Find magnet links fast'
    },
    'zh-CN': {
        siteName: 'cili.xyz',
        siteTitle: '磁力先锋',
        heroTitle: 'cili<span>.xyz</span>',
        heroSubtitle: '磁力先锋：索引未来资源',
        searchPlaceholder: '搜索资源...',
        searchButton: '搜索',
        searchTitle: '搜索结果',
        searchingText: '搜索中...',
        noResults: '未找到相关资源',
        apiError: '连接错误，请重试',
        resultsFor: '搜索结果',
        page: '第',
        of: '页，共',
        prev: '上一页',
        next: '下一页',
        total: '共',
        results: '条结果',
        size: '大小',
        seeds: '做种',
        leechers: '下载中',
        downloads: '下载次数',
        category: '分类',
        subcategory: '子分类',
        dateAdded: '添加日期',
        uploadedAt: '上传时间',
        infoHash: '哈希值',
        magnetLink: '磁力链接',
        torrentFile: '种子文件',
        downloadTorrent: '下载种子文件',
        copyMagnet: '复制磁力链接',
        copied: '已复制！',
        technicalDetails: '技术详情',
        fileList: '文件列表',
        files: '个文件',
        verified: '官方认证',
        imdbRating: 'IMDb 评分',
        back: '返回',
        home: '首页',
        footerTagline: '快速、可靠的磁力搜索',
        dmca: 'DMCA',
        privacy: '隐私政策',
        support: '帮助支持',
        copyright: '© 2026 磁力先锋 (cili.xyz). 保留所有权利。',
        resourceNotFound: '资源未找到',
        loadingError: '加载数据失败',
        loading: '加载中...',
        metaDescription: 'cili.xyz - 快速可靠的磁力链接搜索引擎。轻松查找种子资源。',
        searchMetaDescription: '"{query}" 的搜索结果 - cili.xyz 磁力搜索'
    },
    'zh-TW': {
        siteName: 'cili.xyz',
        siteTitle: '磁力先鋒',
        heroTitle: 'cili<span>.xyz</span>',
        heroSubtitle: '磁力先鋒：索引未來資源',
        searchPlaceholder: '搜尋資源...',
        searchButton: '搜尋',
        searchTitle: '搜尋結果',
        searchingText: '搜尋中...',
        noResults: '未找到相關資源',
        apiError: '連接錯誤，請重試',
        resultsFor: '搜尋結果',
        page: '第',
        of: '頁，共',
        prev: '上一頁',
        next: '下一頁',
        total: '共',
        results: '條結果',
        size: '大小',
        seeds: '做種',
        leechers: '下載中',
        downloads: '下載次數',
        category: '分類',
        subcategory: '子分類',
        dateAdded: '添加日期',
        uploadedAt: '上傳時間',
        infoHash: '哈希值',
        magnetLink: '磁力連結',
        torrentFile: '種子檔案',
        downloadTorrent: '下載種子檔案',
        copyMagnet: '複製磁力連結',
        copied: '已複製！',
        technicalDetails: '技術詳情',
        fileList: '檔案列表',
        files: '個檔案',
        verified: '官方認證',
        imdbRating: 'IMDb 評分',
        back: '返回',
        home: '首頁',
        footerTagline: '快速、可靠的磁力搜尋',
        dmca: 'DMCA',
        privacy: '隱私政策',
        support: '幫助支援',
        copyright: '© 2026 磁力先鋒 (cili.xyz). 保留所有權利。',
        resourceNotFound: '資源未找到',
        loadingError: '載入資料失敗',
        loading: '載入中...',
        metaDescription: 'cili.xyz - 快速可靠的磁力連結搜尋引擎。輕鬆查找種子資源。',
        searchMetaDescription: '"{query}" 的搜尋結果 - cili.xyz 磁力搜尋'
    },
    'ja': {
        siteName: 'cili.xyz',
        siteTitle: 'マグネットパイオニア',
        heroTitle: 'cili<span>.xyz</span>',
        heroSubtitle: 'マグネットパイオニア：未来をインデックス',
        searchPlaceholder: 'トレントを検索...',
        searchButton: '検索',
        searchTitle: '検索結果',
        searchingText: '検索中...',
        noResults: '結果が見つかりません',
        apiError: '接続エラー。もう一度お試しください。',
        resultsFor: '検索結果',
        page: 'ページ',
        of: '/',
        prev: '前へ',
        next: '次へ',
        total: '合計',
        results: '件',
        size: 'サイズ',
        seeds: 'シード',
        leechers: 'リーチャー',
        downloads: 'ダウンロード',
        category: 'カテゴリー',
        subcategory: 'サブカテゴリー',
        dateAdded: '追加日',
        uploadedAt: 'アップロード日',
        infoHash: 'ハッシュ',
        magnetLink: 'マグネットリンク',
        torrentFile: 'トレントファイル',
        downloadTorrent: '.torrentをダウンロード',
        copyMagnet: 'マグネットをコピー',
        copied: 'コピーしました！',
        technicalDetails: '技術詳細',
        fileList: 'ファイル一覧',
        files: 'ファイル',
        verified: '認証済み',
        imdbRating: 'IMDb評価',
        back: '戻る',
        home: 'ホーム',
        footerTagline: '高速で信頼性の高いマグネット検索',
        dmca: 'DMCA',
        privacy: 'プライバシー',
        support: 'サポート',
        copyright: '© 2026 cili.xyz. All rights reserved.',
        resourceNotFound: 'リソースが見つかりません',
        loadingError: 'データの読み込みに失敗しました',
        loading: '読み込み中...',
        metaDescription: 'cili.xyz - 高速で信頼性の高いマグネットリンク検索エンジン。',
        searchMetaDescription: '"{query}" の検索結果 - cili.xyz'
    },
    'ko': {
        siteName: 'cili.xyz',
        siteTitle: '마그넷 파이오니어',
        heroTitle: 'cili<span>.xyz</span>',
        heroSubtitle: '마그넷 파이오니어: 미래를 색인하다',
        searchPlaceholder: '토렌트 검색...',
        searchButton: '검색',
        searchTitle: '검색 결과',
        searchingText: '검색 중...',
        noResults: '결과를 찾을 수 없습니다',
        apiError: '연결 오류. 다시 시도해 주세요.',
        resultsFor: '검색 결과',
        page: '페이지',
        of: '/',
        prev: '이전',
        next: '다음',
        total: '총',
        results: '개 결과',
        size: '크기',
        seeds: '시드',
        leechers: '리처',
        downloads: '다운로드',
        category: '카테고리',
        subcategory: '하위 카테고리',
        dateAdded: '추가 날짜',
        uploadedAt: '업로드 날짜',
        infoHash: '해시',
        magnetLink: '마그넷 링크',
        torrentFile: '토렌트 파일',
        downloadTorrent: '.torrent 다운로드',
        copyMagnet: '마그넷 복사',
        copied: '복사됨!',
        technicalDetails: '기술 정보',
        fileList: '파일 목록',
        files: '파일',
        verified: '인증됨',
        imdbRating: 'IMDb 평점',
        back: '뒤로',
        home: '홈',
        footerTagline: '빠르고 신뢰할 수 있는 마그넷 검색',
        dmca: 'DMCA',
        privacy: '개인정보',
        support: '지원',
        copyright: '© 2026 cili.xyz. All rights reserved.',
        resourceNotFound: '리소스를 찾을 수 없습니다',
        loadingError: '데이터 로드 실패',
        loading: '로딩 중...',
        metaDescription: 'cili.xyz - 빠르고 신뢰할 수 있는 마그넷 링크 검색 엔진.',
        searchMetaDescription: '"{query}" 검색 결과 - cili.xyz'
    }
};

class CiliApp {
    constructor() {
        this.lang = this.detectLanguage();
        this.t = i18n[this.lang];
        this.langInfo = LANGUAGES[this.lang];
    }

    /**
     * Detect user language from localStorage or browser settings
     */
    detectLanguage() {
        // Check localStorage first (returning user)
        const saved = localStorage.getItem(CONFIG.STORAGE_LANG);
        if (saved && i18n[saved]) {
            return saved;
        }

        // Auto-detect for new users
        const navLang = navigator.language || navigator.userLanguage || '';
        const lang = navLang.toLowerCase();

        if (lang.includes('zh-tw') || lang.includes('zh-hk') || lang.includes('zh-hant')) {
            return 'zh-TW';
        }
        if (lang.includes('zh')) {
            return 'zh-CN';
        }
        if (lang.includes('ja')) {
            return 'ja';
        }
        if (lang.includes('ko')) {
            return 'ko';
        }

        return CONFIG.DEFAULT_LANG;
    }

    /**
     * Change language and reload page
     */
    changeLang(langCode) {
        if (i18n[langCode]) {
            localStorage.setItem(CONFIG.STORAGE_LANG, langCode);
            window.location.reload();
        }
    }

    /**
     * Get translation string
     */
    translate(key, replacements = {}) {
        let text = this.t[key] || i18n['en'][key] || key;
        Object.keys(replacements).forEach(k => {
            text = text.replace(`{${k}}`, replacements[k]);
        });
        return text;
    }

    /**
     * Initialize language selector dropdown
     */
    initLangSelector() {
        const selector = document.querySelector('.lang-selector');
        if (!selector) return;

        const btn = selector.querySelector('.lang-btn');
        const dropdown = selector.querySelector('.lang-dropdown');

        // Toggle dropdown
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            selector.classList.toggle('active');
        });

        // Close on outside click
        document.addEventListener('click', () => {
            selector.classList.remove('active');
        });

        // Prevent dropdown close when clicking inside
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Handle language selection
        dropdown.querySelectorAll('.lang-item').forEach(item => {
            item.addEventListener('click', () => {
                const lang = item.dataset.lang;
                this.changeLang(lang);
            });
        });
    }

    /**
     * Update page SEO meta tags
     */
    updateSEO(options = {}) {
        const { title, description, keywords, canonical } = options;

        if (title) {
            document.title = title;
            this.updateMetaTag('og:title', title);
            this.updateMetaTag('twitter:title', title);
        }

        if (description) {
            this.updateMetaTag('description', description);
            this.updateMetaTag('og:description', description);
            this.updateMetaTag('twitter:description', description);
        }

        if (keywords) {
            this.updateMetaTag('keywords', keywords);
        }

        if (canonical) {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'canonical';
                document.head.appendChild(link);
            }
            link.href = canonical;
        }
    }

    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`) ||
                   document.querySelector(`meta[property="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            if (name.startsWith('og:') || name.startsWith('twitter:')) {
                meta.setAttribute('property', name);
            } else {
                meta.setAttribute('name', name);
            }
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    /**
     * Show toast notification
     */
    showToast(message, duration = 2000) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(this.t.copied);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast(this.t.copied);
            return true;
        }
    }

    /**
     * Format file size
     */
    formatSize(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i];
    }

    /**
     * Format date
     */
    formatDate(dateStr) {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(this.lang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Search API - through our proxy
     */
    async search(query, options = {}) {
        const { page = 1, limit = 20, category, subcategory } = options;

        let url = `${CONFIG.API_BASE}/?q=${encodeURIComponent(query)}`;

        // Add optional parameters if our API supports them
        if (page > 1) url += `&page=${page}`;
        if (limit) url += `&limit=${limit}`;
        if (category) url += `&category=${category}`;
        if (subcategory) url += `&subcategory=${subcategory}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();

        // Handle both array response and paginated response
        if (Array.isArray(data)) {
            return {
                results: data,
                pagination: {
                    page: 1,
                    limit: data.length,
                    total: data.length
                }
            };
        }

        return data;
    }

    /**
     * Get torrent details by ID - through our proxy
     */
    async getDetail(id) {
        const response = await fetch(`${CONFIG.API_BASE}/detail/${id}`);
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    }

    /**
     * Cache detail data
     */
    cacheDetail(id, data) {
        try {
            const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
            sessionStorage.setItem(CONFIG.CACHE_PREFIX + id, encoded);
        } catch (e) {
            console.warn('Cache error:', e);
        }
    }

    /**
     * Get cached detail data
     */
    getCachedDetail(id) {
        try {
            const cached = sessionStorage.getItem(CONFIG.CACHE_PREFIX + id);
            if (cached) {
                return JSON.parse(decodeURIComponent(atob(cached)));
            }
        } catch (e) {
            console.warn('Cache read error:', e);
        }
        return null;
    }

    /**
     * Generate language selector HTML
     */
    generateLangSelector() {
        const currentLang = LANGUAGES[this.lang];
        let itemsHtml = '';

        Object.values(LANGUAGES).forEach(lang => {
            itemsHtml += `
                <button class="lang-item" data-lang="${lang.code}">
                    <span class="fi fi-${lang.flag}"></span>
                    <span>${lang.nativeName}</span>
                </button>
            `;
        });

        return `
            <div class="lang-selector">
                <button class="lang-btn">
                    <span class="fi fi-${currentLang.flag}"></span>
                    <span>${currentLang.nativeName}</span>
                </button>
                <div class="lang-dropdown">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }

    /**
     * Generate footer HTML
     */
    generateFooter() {
        return `
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-brand">⚡ ${this.t.siteName}</div>
                    <p class="footer-tagline">${this.t.footerTagline}</p>
                    <div class="footer-links">
                        <a href="/dmca" class="footer-link">${this.t.dmca}</a>
                        <a href="/privacy" class="footer-link">${this.t.privacy}</a>
                        <a href="/support" class="footer-link">${this.t.support}</a>
                    </div>
                    <p class="footer-copyright">${this.t.copyright}</p>
                </div>
            </footer>
        `;
    }
}

// Initialize app
window.App = new CiliApp();
