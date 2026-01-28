/**
 * main.js - v3.0 Ultimate (Smart Search & Rich Details)
 * * Core Features:
 * 1. Auto I18n & Dynamic SEO (Title/Keywords)
 * 2. Smart Tags Generation (Analyzes filename for 1080p, 4K, etc.)
 * 3. Magnet Link Deep Parsing (Extracts real Trackers & Hash)
 * 4. Virtual File System (Generates file list from metadata)
 */

/* ==========================================
   🌍 1. Multi-language Dictionary (Full)
   ========================================== */
const dictionary = {
    // --- SEO Meta Data ---
    'meta_title': {
        'zh-CN': 'BitSearch Clone - 免费磁力搜索 | 极速下载',
        'en': 'BitSearch Clone - Free Torrent Search | Fast Download',
    },
    'meta_desc': {
        'zh-CN': '全球最大的磁力搜索引擎。极速索引数千万磁力链接，提供高质量的电影、剧集、音乐、游戏和软件下载。',
        'en': 'The world\'s largest magnet search engine. Fast indexing of millions of magnet links for high-quality movies, TV series, music, games, and software.',
    },
    
    // --- Navigation ---
    'nav_home':     { 'zh-CN': '首页', 'en': 'Home' }, 
    'nav_language': { 'zh-CN': '语言', 'en': 'Language' },

    // --- Hero / Home ---
    'hero_title': { 'zh-CN': '全网资源聚合', 'en': 'Discover Anything' },
    'hero_subtitle': { 'zh-CN': '极速 · 纯净 · 智能云缓存', 'en': 'Fast · Clean · Smart Cloud Cache' },
    'search_placeholder': { 'zh-CN': '搜索电影、剧集、软件...', 'en': 'Search movies, software...' },
    'search_btn':   { 'zh-CN': '搜索', 'en': 'Search' },

    // --- Categories ---
    'cat_title':  { 'zh-CN': '热门分类', 'en': 'Popular Categories' },
    'cat_movies': { 'zh-CN': '电影', 'en': 'Movies' },
    'cat_tv':     { 'zh-CN': '剧集', 'en': 'TV Series' },
    'cat_music':  { 'zh-CN': '音乐', 'en': 'Music' },
    'cat_games':  { 'zh-CN': '游戏', 'en': 'Games' },
    'cat_soft':   { 'zh-CN': '软件', 'en': 'Software' },

    // --- Results Page ---
    'res_found':  { 'zh-CN': '找到结果', 'en': 'Results Found' },
    
    // --- Detail Page Labels ---
    'label_verified': { 'zh-CN': '已验证', 'en': 'Verified' },
    'label_hash':     { 'zh-CN': '信息哈希', 'en': 'Info Hash' },
    'tab_files':      { 'zh-CN': '文件列表', 'en': 'Files' },
    'tab_trackers':   { 'zh-CN': 'Tracker 服务器', 'en': 'Trackers' },
    'btn_copy':       { 'zh-CN': '复制链接', 'en': 'Copy Magnet' },
    'btn_download':   { 'zh-CN': '磁力下载', 'en': 'Magnet Download' },
    'sect_tags':      { 'zh-CN': '资源标签', 'en': 'Tags' }
};

/* ==========================================
   ⚙️ 2. System Configuration
   ========================================== */
const CONFIG = {
    defaultLang: 'en', // Default to English for international look
    storageKey: 'site_lang',
    supportedLangs: ['zh-CN', 'en']
};

// Auto-detect language: Storage > Browser > Default
let currentLang = localStorage.getItem(CONFIG.storageKey) || 
                  (navigator.language.startsWith('zh') ? 'zh-CN' : 'en');

/* ==========================================
   🛠️ 3. Core I18n Functions
   ========================================== */

function t(key) {
    const item = dictionary[key];
    return (item && item[currentLang]) ? item[currentLang] : (item?.en || key);
}

function updatePageText() {
    // 1. Update visible text & placeholders
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(el.placeholder) el.placeholder = t(key);
        else el.innerText = t(key);
    });
    
    // 2. Update Language Button Label
    const btn = document.getElementById('currentLangLabel');
    if(btn) btn.innerText = currentLang === 'zh-CN' ? '简体中文' : 'English';
    
    // 3. Update HTML Lang Attribute
    document.documentElement.lang = currentLang;

    // 4. Update SEO Title & Description
    if(dictionary.meta_title) document.title = t('meta_title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc && dictionary.meta_desc) metaDesc.content = t('meta_desc');
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(CONFIG.storageKey, lang);
    updatePageText();
    // Re-run detail page logic if on detail page (to translate dynamic content if needed)
    if(window.location.pathname.includes('detail.html')) {
        initDetailPage(); 
    }
}

/* ==========================================
   🔍 4. Search Logic
   ========================================== */

function performSearch() {
    const input = document.getElementById('searchInput');
    let query = input.value.trim();
    if (!query) return;

    // Redirect to search page with query
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

// Helper for UI chips (onclick="appendSearch(' 1080p')")
window.appendSearch = function(suffix) {
    const input = document.getElementById('searchInput');
    if(input) {
        input.value += suffix;
        input.focus();
    }
};

/* ==========================================
   📄 5. Detail Page Engine (Rich Content Generator)
   ========================================== */

function initDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    
    // If no name param, we can't do much (or handle error)
    if (!name) return; 

    const size = params.get('size') || '--';
    const magnet = params.get('magnet') || '';
    const date = new Date().toISOString().split('T')[0]; 

    // --- A. Basic Info Rendering ---
    document.title = `${name} - Download`; // Update Tab Title
    setText('fileName', name);
    setText('fileSize', size);
    setText('fileDate', date);
    
    const magnetBtn = document.getElementById('magnetBtn');
    if(magnetBtn) magnetBtn.href = magnet;

    // --- B. Smart Tags Generation (Analyze Filename) ---
    const tagsContainer = document.getElementById('smartTags');
    if (tagsContainer) {
        // Keywords dictionary for tagging
        const keywords = [
            '1080p', '2160p', '4K', '720p', 'BluRay', 'HDR', 'x265', 'HEVC', 
            'H.264', 'WebDL', 'AAC', 'DDP5', 'Atmos', 'Remux', 'DV'
        ];
        let tagsHtml = '';
        const nameLower = name.toLowerCase();

        // 1. File Type Tags
        if(nameLower.match(/\.(mkv|mp4|avi|mov)$/)) tagsHtml += `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 me-2">Video</span>`;
        if(nameLower.match(/\.(iso|exe|dmg|pkg)$/)) tagsHtml += `<span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 me-2">App/Game</span>`;
        if(nameLower.match(/\.(mp3|flac|wav)$/))    tagsHtml += `<span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 me-2">Audio</span>`;

        // 2. Quality/Codec Tags
        keywords.forEach(kw => {
            if (nameLower.includes(kw.toLowerCase())) {
                tagsHtml += `<span class="badge bg-light text-secondary border me-2">${kw}</span>`;
            }
        });
        
        // 3. Fallback
        if(!tagsHtml) tagsHtml = '<span class="badge bg-light text-secondary border">Resource</span>';
        
        tagsContainer.innerHTML = tagsHtml;
    }

    // --- C. Magnet Deep Parsing (Hash & Trackers) ---
    if (magnet) {
        // 1. Extract Info Hash
        const hashMatch = magnet.match(/xt=urn:btih:([a-zA-Z0-9]+)/);
        if (hashMatch) {
            setText('infoHash', hashMatch[1]);
        }

        // 2. Extract Trackers (Real data from magnet)
        // Regex to find all 'tr=' parameters
        const trackerMatches = [...magnet.matchAll(/tr=([^&]+)/g)];
        const trackerList = document.getElementById('trackerList');
        
        if (trackerList) {
            if (trackerMatches.length > 0) {
                // Render real trackers
                trackerList.innerHTML = trackerMatches.map(m => `
                    <div class="list-group-item text-truncate py-2 border-0 border-bottom small">
                        <i class="fa-solid fa-server me-2 text-success"></i>
                        <span class="text-secondary">${decodeURIComponent(m[1])}</span>
                    </div>
                `).join('');
            } else {
                // Fallback: Display default high-speed trackers if none in link
                const defaultTrackers = [
                    'udp://tracker.opentrackr.org:1337',
                    'udp://9.rarbg.to:2710',
                    'udp://tracker.coppersurfer.tk:6969',
                    'udp://open.demonii.com:1337'
                ];
                trackerList.innerHTML = defaultTrackers.map(t => `
                    <div class="list-group-item text-truncate py-2 border-0 border-bottom small">
                        <i class="fa-solid fa-server me-2 text-secondary opacity-50"></i>
                        <span class="text-secondary">${t}</span>
                    </div>
                `).join('');
            }
        }
    }

    // --- D. Virtual File List Generator ---
    // Since API doesn't return file structure, we mock it based on file extension
    const fileList = document.getElementById('fileList');
    if (fileList) {
        // Determine icon based on name
        let icon = 'fa-file';
        if(name.match(/\.(mkv|mp4|avi)$/i)) icon = 'fa-file-video';
        else if(name.match(/\.(mp3|flac)$/i)) icon = 'fa-file-audio';
        else if(name.match(/\.(zip|rar|7z|iso)$/i)) icon = 'fa-file-zipper';
        else if(name.match(/\.(jpg|png)$/i)) icon = 'fa-file-image';
        
        fileList.innerHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center py-3 border-0 border-bottom">
                <div class="text-truncate me-3">
                    <i class="fa-regular ${icon} me-3 text-primary"></i>
                    <span class="fw-500 text-dark">${name}</span>
                </div>
                <span class="badge bg-light text-secondary border">${size}</span>
            </li>
            <li class="list-group-item text-center py-2 bg-light small text-muted border-0 rounded-bottom">
                <i class="fa-solid fa-info-circle me-1"></i> Directory structure hidden for privacy
            </li>
        `;
    }
}

// Helper: Safely set text content by ID
function setText(id, text) {
    const el = document.getElementById(id);
    if(el) el.innerText = text;
}

/* ==========================================
   🚀 6. Initialization (Event Listeners)
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI Text
    updatePageText();

    // 2. Search Events
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if(searchBtn) searchBtn.addEventListener('click', performSearch);
    if(searchInput) searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // 3. Language Switcher Events
    document.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // 4. Detail Page Logic Trigger
    if(window.location.pathname.includes('detail.html')) {
        initDetailPage();
    }
    
    // 5. Copy Button Logic (Detail Page)
    const copyBtn = document.getElementById('copyBtn');
    if(copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const magnetLink = document.getElementById('magnetBtn').href;
            
            // Clipboard API
            navigator.clipboard.writeText(magnetLink).then(() => {
                // Visual feedback
                const originalHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
                copyBtn.classList.replace('btn-pill-light', 'btn-pill-primary'); // Change color
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalHtml;
                    copyBtn.classList.replace('btn-pill-primary', 'btn-pill-light'); // Revert color
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Copy failed, please copy from address bar or right click download button.');
            });
        });
    }
});