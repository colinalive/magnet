/**
 * main.js - v2.0 (SEO Enhanced)
 * Handles I18n, Routing, and Dynamic SEO Meta Tags.
 */

const dictionary = {
    // ==========================================
    // 🔍 SEO META DATA (关键新增部分)
    // ==========================================
    'meta_title': {
        'zh-CN': 'BitSearch Clone - 免费磁力搜索 | 电影、剧集、软件下载',
        'zh-TW': 'BitSearch Clone - 免費磁力搜尋 | 電影、劇集、軟體下載',
        'en': 'BitSearch Clone - Free Torrent Search | Movies, TV, Software',
        'ko': 'BitSearch Clone - 무료 토렌트 검색 | 영화, TV, 소프트웨어',
        'ja': 'BitSearch Clone - 無料トレント検索 | 映画、ドラマ、ソフト',
        'es': 'BitSearch Clone - Búsqueda de Torrents Gratis',
        'fr': 'BitSearch Clone - Recherche Torrent Gratuite'
    },
    'meta_keywords': {
        'zh-CN': '磁力链接, 种子搜索, BT下载, 免费电影, 电视剧, 软件破解, 游戏下载',
        'zh-TW': '磁力連結, 種子搜尋, BT下載, 免費電影, 電視劇, 軟體破解, 遊戲下載',
        'en': 'magnet links, torrent search, free movies, tv shows download, software crack, p2p, bittorrent',
        'ko': '마그넷 링크, 토렌트 검색, 무료 영화, TV 쇼 다운로드, 소프트웨어 크랙',
        'ja': 'マグネットリンク, トレント検索, 無料映画, ドラマダウンロード, ソフトウェア',
        'es': 'enlaces magnéticos, buscar torrents, películas gratis, series, software',
        'fr': 'liens magnet, recherche torrent, films gratuits, séries, logiciels'
    },
    'meta_desc': {
        'zh-CN': '全球最大的磁力搜索引擎。极速索引数千万磁力链接，提供高质量的电影、剧集、音乐、游戏和软件下载。无广告，纯净体验。',
        'zh-TW': '全球最大的磁力搜尋引擎。極速索引數千萬磁力連結，提供高質量的電影、劇集、音樂、遊戲和軟體下載。無廣告，純淨體驗。',
        'en': 'The world\'s largest magnet search engine. Fast indexing of millions of magnet links for high-quality movies, TV series, music, games, and software. Ad-free.',
        'ko': '세계 최대의 마그넷 검색 엔진. 수천만 개의 마그넷 링크를 빠르게 인덱싱하여 고품질 영화, TV 시리즈, 음악, 게임 및 소프트웨어를 제공합니다.',
        'ja': '世界最大のマグネット検索エンジン。数百万のリンクを高速インデックスし、高品質な映画、音楽、ゲーム、ソフトウェアを提供します。',
        'es': 'El motor de búsqueda de enlaces magnéticos más grande del mundo. Indexación rápida de millones de archivos.',
        'fr': 'Le plus grand moteur de recherche de liens magnet au monde. Indexation rapide de millions de fichiers.'
    },

    // --- 🧭 Navigation Bar ---
    'nav_home':     { 'zh-CN': '首页', 'zh-TW': '首頁', 'en': 'Home', 'ko': '홈', 'ja': 'ホーム', 'es': 'Inicio', 'fr': 'Accueil' },
    'nav_language': { 'zh-CN': '语言', 'zh-TW': '語言', 'en': 'Language', 'ko': '언어', 'ja': '言語', 'es': 'Idioma', 'fr': 'Langue' },

    // --- 🏠 Home Page ---
    'hero_title': {
        'zh-CN': '全网资源聚合', 'zh-TW': '全網資源聚合', 'en': 'Discover Anything',
        'ko': '모든 리소스 검색', 'ja': 'あらゆるものを検索', 'es': 'Descubre Todo', 'fr': 'Découvrez Tout'
    },
    'hero_subtitle': {
        'zh-CN': '极速 · 纯净 · 智能云缓存',
        'zh-TW': '極速 · 純淨 · 智能雲緩存',
        'en': 'Fast · Clean · Smart Cloud Cache',
        'ko': '빠르고 · 깨끗하고 · 스마트한 클라우드 캐시',
        'ja': '高速 · クリーン · スマートクラウドキャッシュ',
        'es': 'Rápido · Limpio · Caché Inteligente',
        'fr': 'Rapide · Propre · Cache Intelligent'
    },
    'search_placeholder': {
        'zh-CN': '搜索电影、剧集、软件...',
        'zh-TW': '搜尋電影、劇集、軟體...',
        'en': 'Search movies, TV shows, software...',
        'ko': '영화, TV 쇼, 소프트웨어 검색...',
        'ja': '映画、テレビ番組、ソフトを検索...',
        'es': 'Buscar películas, series, software...',
        'fr': 'Rechercher films, séries, logiciels...'
    },
    'search_btn': { 'zh-CN': '搜索', 'zh-TW': '搜尋', 'en': 'Search', 'ko': '검색', 'ja': '検索', 'es': 'Buscar', 'fr': 'Chercher' },

    // --- 🔥 Popular Categories ---
    'cat_title':  { 'zh-CN': '热门分类', 'zh-TW': '熱門分類', 'en': 'Popular Categories', 'ko': '인기 카테고리', 'ja': '人気カテゴリー', 'es': 'Categorías', 'fr': 'Catégories' },
    'cat_movies': { 'zh-CN': '电影', 'zh-TW': '電影', 'en': 'Movies', 'ko': '영화', 'ja': '映画', 'es': 'Películas', 'fr': 'Films' },
    'cat_tv':     { 'zh-CN': '剧集', 'zh-TW': '劇集', 'en': 'TV Series', 'ko': 'TV 시리즈', 'ja': 'テレビ番組', 'es': 'Series', 'fr': 'Séries' },
    'cat_music':  { 'zh-CN': '音乐', 'zh-TW': '音樂', 'en': 'Music', 'ko': '음악', 'ja': '音楽', 'es': 'Música', 'fr': 'Musique' },
    'cat_games':  { 'zh-CN': '游戏', 'zh-TW': '遊戲', 'en': 'Games', 'ko': '게임', 'ja': 'ゲーム', 'es': 'Juegos', 'fr': 'Jeux' },
    'cat_soft':   { 'zh-CN': '软件', 'zh-TW': '軟體', 'en': 'Software', 'ko': '소프트웨어', 'ja': 'ソフト', 'es': 'Software', 'fr': 'Logiciels' },
    'why_us':     { 'zh-CN': '为什么选择我们', 'zh-TW': '為什麼選擇我們', 'en': 'Why Choose Us', 'ko': '우리를 선택하는 이유', 'ja': '選ばれる理由', 'es': 'Por qué elegirnos', 'fr': 'Pourquoi nous choisir' },

    // --- 📄 Results & Common ---
    'res_found':      { 'zh-CN': '找到结果', 'zh-TW': '找到結果', 'en': 'Results Found', 'ko': '검색 결과', 'ja': '検索結果', 'es': 'Resultados', 'fr': 'Résultats' },
    'sort_by':        { 'zh-CN': '排序', 'zh-TW': '排序', 'en': 'Sort by', 'ko': '정렬', 'ja': '並び替え', 'es': 'Ordenar', 'fr': 'Trier' },
    'label_size':     { 'zh-CN': '大小', 'zh-TW': '大小', 'en': 'Size', 'ko': '크기', 'ja': 'サイズ', 'es': 'Tamaño', 'fr': 'Taille' },
    'label_date':     { 'zh-CN': '日期', 'zh-TW': '日期', 'en': 'Date', 'ko': '날짜', 'ja': '日付', 'es': 'Fecha', 'fr': 'Date' },
    'label_seeders':  { 'zh-CN': '做种', 'zh-TW': '做種', 'en': 'Seeders', 'ko': '시더', 'ja': 'シード', 'es': 'Semillas', 'fr': 'Sources' },
    'label_leechers': { 'zh-CN': '下载', 'zh-TW': '下載', 'en': 'Leechers', 'ko': '리처', 'ja': 'リーチ', 'es': 'Sanguijuelas', 'fr': 'Clients' },

    // --- ℹ️ Details Page ---
    'btn_magnet':   { 'zh-CN': '磁力链接', 'zh-TW': '磁力連結', 'en': 'Magnet Link', 'ko': '마그넷 링크', 'ja': 'マグネット', 'es': 'Enlace Magnético', 'fr': 'Lien Magnet' },
    'btn_torrent':  { 'zh-CN': '下载种子', 'zh-TW': '下載種子', 'en': 'Download .torrent', 'ko': '토렌트 다운로드', 'ja': 'トレントDL', 'es': 'Descargar .torrent', 'fr': 'Télécharger .torrent' },
    'sec_files':    { 'zh-CN': '文件列表', 'zh-TW': '檔案列表', 'en': 'Files', 'ko': '파일 목록', 'ja': 'ファイル', 'es': 'Archivos', 'fr': 'Fichiers' },
    'sec_trackers': { 'zh-CN': 'Tracker 服务器', 'zh-TW': 'Tracker 伺服器', 'en': 'Trackers', 'ko': '트래커', 'ja': 'トラッカー', 'es': 'Rastreadores', 'fr': 'Trackers' }
};

const CONFIG = {
    defaultLang: 'en',
    fallbackLang: 'en',    
    storageKey: 'site_lang',
    supportedLangs: ['zh-CN', 'zh-TW', 'en', 'ko', 'ja', 'es', 'fr']
};

function getInitialLanguage() {
    const savedLang = localStorage.getItem(CONFIG.storageKey);
    if (savedLang) return savedLang;
    const sysLang = navigator.language || navigator.userLanguage; 
    if (!sysLang) return CONFIG.defaultLang;
    if (CONFIG.supportedLangs.includes(sysLang)) return sysLang;
    const shortLang = sysLang.split('-')[0]; 
    if (shortLang === 'zh') return (sysLang === 'zh-TW' || sysLang === 'zh-HK') ? 'zh-TW' : 'zh-CN';
    if (CONFIG.supportedLangs.includes(shortLang)) return shortLang;
    return CONFIG.defaultLang;
}

let currentLang = getInitialLanguage();

function t(key) {
    const item = dictionary[key];
    if (!item) return key; 
    return item[currentLang] || item[CONFIG.fallbackLang] || Object.values(item)[0];
}

/**
 * 🔄 更新页面所有文本 + SEO Meta
 */
function updatePageText() {
    // 1. 更新可见文本
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translatedText = t(key);
        if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
            element.placeholder = translatedText;
        } else {
            element.innerText = translatedText;
        }
    });

    // 2. 更新语言菜单文字
    const langLabel = document.getElementById('currentLangLabel');
    if (langLabel) {
        const langNames = {
            'zh-CN': '简体中文', 'zh-TW': '繁體中文', 'en': 'English',
            'ko': '한국어', 'ja': '日本語', 'es': 'Español', 'fr': 'Français'
        };
        langLabel.innerText = langNames[currentLang] || 'Language';
    }

    // 3. 🔥 SEO 关键：动态更新 Meta 标签
    document.documentElement.lang = currentLang; // 更新 <html lang="en">

    // 更新 Title
    document.title = t('meta_title');

    // 更新 Description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
        descTag = document.createElement('meta');
        descTag.name = 'description';
        document.head.appendChild(descTag);
    }
    descTag.content = t('meta_desc');

    // 更新 Keywords
    let kwTag = document.querySelector('meta[name="keywords"]');
    if (!kwTag) {
        kwTag = document.createElement('meta');
        kwTag.name = 'keywords';
        document.head.appendChild(kwTag);
    }
    kwTag.content = t('meta_keywords');
}

function setLanguage(lang) {
    if (currentLang === lang) return;
    currentLang = lang;
    localStorage.setItem(CONFIG.storageKey, lang);
    updatePageText();
}

document.addEventListener('DOMContentLoaded', () => {
    updatePageText();

    document.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(e.target.getAttribute('data-lang'));
        });
    });

    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchInput) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        };
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') performSearch(); });
    }
});