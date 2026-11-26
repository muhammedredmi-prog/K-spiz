(function () {
    var ID_DATA_KEY = "kaspi_id_data";
    var ID_PHOTO_KEY = "kaspi_id_photo";
    var ID_PDF_NAME_KEY = "kaspi_id_pdf_name";
    var ID_PDF_DATA_KEY = "kaspi_id_pdf_data";
    var ID_PDF_RANDOM_KEY = "kaspi_id_pdf_random";

    function migrateFromSession() {
        var legacy = sessionStorage.getItem("id_data");
        if (legacy && !localStorage.getItem(ID_DATA_KEY)) {
            localStorage.setItem(ID_DATA_KEY, legacy);
        }
        var legacyPhoto = sessionStorage.getItem("id_photo");
        if (legacyPhoto && !localStorage.getItem(ID_PHOTO_KEY)) {
            localStorage.setItem(ID_PHOTO_KEY, legacyPhoto);
        }
        var legacyPdfName = sessionStorage.getItem("id_pdf_name");
        var legacyPdfData = sessionStorage.getItem("id_pdf_data");
        if (legacyPdfName && legacyPdfData && !localStorage.getItem(ID_PDF_NAME_KEY)) {
            localStorage.setItem(ID_PDF_NAME_KEY, legacyPdfName);
            localStorage.setItem(ID_PDF_DATA_KEY, legacyPdfData);
        }
    }

    function getIdData() {
        migrateFromSession();
        try {
            return JSON.parse(localStorage.getItem(ID_DATA_KEY) || "{}");
        } catch (e) {
            return {};
        }
    }

    function setIdData(data) {
        var json = JSON.stringify(data);
        localStorage.setItem(ID_DATA_KEY, json);
    }

    function isIdDataComplete(data) {
        data = data || getIdData();
        return !!(
            data.fio &&
            data.iin &&
            data.dob &&
            data.docnum &&
            data.issue &&
            data.expiry
        );
    }

    function getIdPhoto() {
        migrateFromSession();
        return localStorage.getItem(ID_PHOTO_KEY) || "";
    }

    function setIdPhoto(dataUrl) {
        localStorage.setItem(ID_PHOTO_KEY, dataUrl);
    }

    function clearIdPhoto() {
        localStorage.removeItem(ID_PHOTO_KEY);
    }

    function getIdPdf() {
        migrateFromSession();
        return {
            name: localStorage.getItem(ID_PDF_NAME_KEY) || "",
            data: localStorage.getItem(ID_PDF_DATA_KEY) || "",
        };
    }

    function setIdPdf(name, dataUrl) {
        localStorage.setItem(ID_PDF_NAME_KEY, name);
        localStorage.setItem(ID_PDF_DATA_KEY, dataUrl);
    }

    function getIdPdfRandom() {
        migrateFromSession();
        return localStorage.getItem(ID_PDF_RANDOM_KEY) || "";
    }

    function setIdPdfRandom(random) {
        localStorage.setItem(ID_PDF_RANDOM_KEY, random);
    }

    function clearIdPdf() {
        localStorage.removeItem(ID_PDF_NAME_KEY);
        localStorage.removeItem(ID_PDF_DATA_KEY);
        localStorage.removeItem(ID_PDF_RANDOM_KEY);
    }

    function clearAllIdData() {
        localStorage.removeItem(ID_DATA_KEY);
        localStorage.removeItem(ID_PHOTO_KEY);
        localStorage.removeItem(ID_PDF_NAME_KEY);
        localStorage.removeItem(ID_PDF_DATA_KEY);
        sessionStorage.removeItem("id_data");
        sessionStorage.removeItem("id_photo");
        sessionStorage.removeItem("id_pdf_name");
        sessionStorage.removeItem("id_pdf_data");
    }

    function hasIdPhoto() {
        return !!getIdPhoto();
    }

    function hasIdPdf() {
        var pdf = getIdPdf();
        return !!(pdf.name && pdf.data);
    }

    var PAGE_TRANSITION_FORWARD_MS = 300;
    var PAGE_TRANSITION_BACK_MS = 300;
    var NAV_DIR_KEY = "kaspi_nav_dir";
    var PIN_EASE = "cubic-bezier(0.32, 0.94, 0.6, 1)";
    var NATIVE_EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    var SKELETON_MAX_TIME_MS = 3000;
    var SKELETON_MIN_TIME_MS = 1200;

    function injectGlobalStyles() {
    if (document.getElementById("kaspi-global-styles")) return;
    var style = document.createElement("style");
    style.id = "kaspi-global-styles";
    style.textContent =
        /* Native-like smooth animations without background flash */
        "@keyframes kaspiSlideInForward{from{transform:translateX(100%)}to{transform:translateX(0)}}" +
        "@keyframes kaspiSlideOutForward{from{transform:translateX(0)}to{transform:translateX(-15%);opacity:0.95}}" +
        "@keyframes kaspiBackLeave{from{transform:translateX(0)}to{transform:translateX(100%);opacity:0.95}}" +
        "@keyframes kaspiSlideInBack{from{transform:translateX(-15%);opacity:0.95}to{transform:translateX(0)}}" +
        "@keyframes kaspiFadeIn{from{opacity:0}to{opacity:1}}" +
        "@keyframes kaspiFadeOut{from{opacity:1}to{opacity:0}}" +

        "html{background:#fff; height: 100%; contain: layout style;}" +
        "body{height: 100%; overflow: auto !important; background-color: #ffffff;}" +
        ".bottom-nav{position:fixed!important;bottom:0!important;left:0!important;right:0!important;width:100%;z-index:9999;transform:translateZ(0);-webkit-transform:translateZ(0);-webkit-backface-visibility:hidden;backface-visibility:hidden}" +
        "html,body,*{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}" +
        "input,textarea{-webkit-user-select:none;user-select:none}" +
        "img,svg.kaspi-no-drag{-webkit-user-drag:none;user-drag:none}" +
        ".service-img,.nav-icon,.doc-icon-img,.shop-loader-icon img,.bank-pin-faceid-img,.bank-pin-avatar-img,.bank-pin-exit-img{-webkit-touch-callout:none}" +
        ".nav-item--inert,.gov-list-item--inert,.gov-docs-link--inert,.gov-doc-card--inert,.gov-tab--inert{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation;pointer-events:none}" +
        ".kaspi-page-enter-forward{animation:kaspiSlideInForward 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;will-change:transform;transform:translateZ(0)}" +
        ".kaspi-page-leave-forward{animation:kaspiSlideOutForward 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;will-change:transform,opacity;transform:translateZ(0)}" +
        ".kaspi-page-enter-back{animation:kaspiSlideInBack 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;will-change:transform,opacity;transform:translateZ(0)}" +
        ".kaspi-page-leave-back{animation:kaspiBackLeave 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;will-change:transform,opacity;transform:translateZ(0)}" +
        ".kaspi-page-fade-in{animation:kaspiFadeIn 450ms ease-out forwards;will-change:opacity;transform:translateZ(0)}" +
        ".kaspi-page-fade-out{animation:kaspiFadeOut 450ms ease-in forwards;will-change:opacity;transform:translateZ(0)}";
    document.head.appendChild(style);
}

    function goTo(url, replace, direction) {
        var root = document.documentElement;
        if (!url || root.classList.contains("kaspi-page-leave-forward") || root.classList.contains("kaspi-page-leave-back")) {
            return;
        }
        if (direction !== "back" && direction !== "none") {
            direction = "forward";
        }
        try {
            if (direction === "none") {
                sessionStorage.removeItem(NAV_DIR_KEY);
            } else {
                sessionStorage.setItem(NAV_DIR_KEY, direction);
            }
        } catch (err) {
            /* ignore */
        }

        // Check if we're in SPA mode
        var appContainer = document.getElementById('app-container');
        if (appContainer) {
            // SPA routing
            var viewName = getViewNameFromPath(url);
            navigateToView(viewName, !replace);
            return;
        }

        // Fallback to traditional navigation for non-SPA
        // Pre-fetch следующей страницы для быстрой загрузки
        prefetchPage(url);

        // Мгновенная навигация без задержек
        if (replace) {
            window.location.replace(url);
        } else {
            window.location.href = url;
        }
    }

    function prefetchPage(url) {
        try {
            var link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        } catch (err) {
            /* ignore prefetch errors */
        }
    }

    function goBack(url) {
        if (!url) return;
        goTo(url, true, "back");
    }

    function isGovPinVerified() {
        try {
            return localStorage.getItem(GOV_PIN_OK_KEY) === "1";
        } catch (err) {
            return false;
        }
    }

    function markGovPinVerified() {
        try {
            localStorage.setItem(GOV_PIN_OK_KEY, "1");
        } catch (err) {
            /* ignore */
        }
    }

    function clearGovPinVerified() {
        try {
            localStorage.removeItem(GOV_PIN_OK_KEY);
        } catch (err) {
            /* ignore */
        }
    }

    function isAuthSessionValid() {
        try {
            var session = sessionStorage.getItem(AUTH_SESSION_KEY);
            if (!session) return false;
            var data = JSON.parse(session);
            var now = Date.now();
            return data.timestamp && (now - data.timestamp < 24 * 60 * 60 * 1000); // 24 часа
        } catch (err) {
            return false;
        }
    }

    function markAuthSessionValid() {
        try {
            var data = {
                timestamp: Date.now()
            };
            sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(data));
        } catch (err) {
            /* ignore */
        }
    }

    function clearAuthSession() {
        try {
            sessionStorage.removeItem(AUTH_SESSION_KEY);
            localStorage.removeItem(GOV_PIN_OK_KEY);
        } catch (err) {
            /* ignore */
        }
    }

    function initHistoryGuard() {
        if (!window.history || !window.history.replaceState) return;
        try {
            history.replaceState({ kaspi: 1 }, "", window.location.href);
        } catch (err) {
            /* ignore */
        }
    }

    function initPageTransitions() {
        injectGlobalStyles();
        initHistoryGuard();
        var direction = null;
        try {
            direction = sessionStorage.getItem(NAV_DIR_KEY);
            sessionStorage.removeItem(NAV_DIR_KEY);
        } catch (err) {
            /* ignore */
        }
        
        // Мгновенно добавляем класс анимации без requestAnimationFrame
        if (direction === "forward") {
            document.documentElement.classList.add("kaspi-page-enter-forward");
            document.documentElement.addEventListener("animationend", function() {
                document.documentElement.classList.remove("kaspi-page-enter-forward", "kaspi-page-enter-back");
            }, { once: true });
        }

        document.body.style.transform = "";
        document.body.style.transition = "";
        document.body.style.bottom = "0";
        document.body.style.top = "auto";

        // Pre-fetch вероятных страниц
        prefetchLikelyPages();

        document.addEventListener(
            "click",
            function (e) {
                var link = e.target.closest("a[href]");
                if (!link) return;
                var href = link.getAttribute("href");
                if (!href || href.charAt(0) === "#" || /^https?:/i.test(href) || /^mailto:|^tel:/i.test(href)) {
                    return;
                }
                if (!/\.html(\?|#|$)/i.test(href) && href.indexOf(".html") === -1) return;
                e.preventDefault();
                goTo(href, false);
            },
            true
        );
    }

    function prefetchLikelyPages() {
        try {
            var currentPage = window.location.pathname;
            var pagesToPrefetch = [];
            
            if (currentPage.includes('index.html')) {
                pagesToPrefetch = ['gov.html', 'bank.html'];
            } else if (currentPage.includes('gov.html')) {
                pagesToPrefetch = ['index.html'];
            } else if (currentPage.includes('bank.html')) {
                pagesToPrefetch = ['index.html'];
            }
            
            pagesToPrefetch.forEach(function(url) {
                prefetchPage(url);
            });
        } catch (err) {
            /* ignore prefetch errors */
        }
    }

    var clipboardWriteAllowed = false;
    var allowProgrammaticSelect = false;

    function copyToClipboard(text) {
        if (!text) return Promise.resolve(false);
        clipboardWriteAllowed = true;
        var done = function () {
            window.setTimeout(function () {
                clipboardWriteAllowed = false;
                allowProgrammaticSelect = false;
            }, 150);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(function () {
                done();
                return true;
            }).catch(function () {
                done();
                return false;
            });
        }
        try {
            allowProgrammaticSelect = true;
            var area = document.createElement("textarea");
            area.value = text;
            area.setAttribute("readonly", "");
            area.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
            document.body.appendChild(area);
            area.focus();
            area.setSelectionRange(0, text.length);
            var ok = document.execCommand("copy");
            document.body.removeChild(area);
            done();
            return Promise.resolve(!!ok);
        } catch (err) {
            done();
            return Promise.resolve(false);
        }
    }

    function initInertControls() {
        document.addEventListener(
            "click",
            function (e) {
                if (e.target.closest(".nav-item--inert, .gov-list-item--inert, .gov-docs-link--inert, .gov-doc-card--inert, .gov-tab--inert")) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
            true
        );
    }

    function initAppLike() {
        initInertControls();

        document.addEventListener(
            "contextmenu",
            function (e) {
                e.preventDefault();
            },
            true
        );

        document.addEventListener(
            "selectstart",
            function (e) {
                if (allowProgrammaticSelect) return;
                e.preventDefault();
            },
            true
        );

        document.addEventListener(
            "copy",
            function (e) {
                if (!clipboardWriteAllowed) {
                    e.preventDefault();
                }
            },
            true
        );

        document.addEventListener(
            "cut",
            function (e) {
                e.preventDefault();
            },
            true
        );

        document.addEventListener(
            "dragstart",
            function (e) {
                if (e.target && (e.target.tagName === "IMG" || e.target.closest("img"))) {
                    e.preventDefault();
                }
            },
            true
        );

        document.querySelectorAll("img").forEach(function (img) {
            img.setAttribute("draggable", "false");
            img.setAttribute("decoding", "async");
        });

        initSecureFormFields();
    }

    function initSecureFormFields() {
        document.querySelectorAll("input, textarea").forEach(function (el) {
            el.setAttribute("autocomplete", "off");
            el.setAttribute("autocorrect", "off");
            el.setAttribute("autocapitalize", "off");
            el.setAttribute("spellcheck", "false");
            el.setAttribute("data-lpignore", "true");
            el.setAttribute("data-1p-ignore", "true");
        });
    }

    function openGovServices() {
        if (isIdDataComplete()) {
            goTo("gov.html", false, "forward");
        } else {
            goTo("id-entry.html", false, "forward");
        }
    }

    function openIdDocument() {
        if (!isIdDataComplete()) {
            goTo("id-entry.html", false, "forward");
            return;
        }
        goTo("id-progress.html", false, "forward");
    }

    function initPwa() {
        var head = document.head;
        if (!head) return;

        function ensureMeta(name, content) {
            var el = document.querySelector('meta[name="' + name + '"]');
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute("name", name);
                head.appendChild(el);
            }
            el.setAttribute("content", content);
        }

        if (!document.querySelector('link[rel="manifest"]')) {
            var manifest = document.createElement("link");
            manifest.rel = "manifest";
            manifest.href = "manifest.json";
            head.appendChild(manifest);
        }

        ensureMeta("mobile-web-app-capable", "yes");
        ensureMeta("apple-mobile-web-app-capable", "yes");
        ensureMeta("apple-mobile-web-app-status-bar-style", "default");
        ensureMeta("apple-mobile-web-app-title", "Kaspi.kz");
        ensureMeta("application-name", "Kaspi.kz");
        ensureMeta("theme-color", "#ffffff");

        if (!document.querySelector('link[rel="apple-touch-icon"]')) {
            var touchIcon = document.createElement("link");
            touchIcon.rel = "apple-touch-icon";
            touchIcon.href = "../laaskakaps.netlify.app/main/img/1024x1024bb.html";
            head.appendChild(touchIcon);
        }

        if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
            document.documentElement.classList.add("is-standalone");
        }
    }

    function shouldBlockPageZoom(target) {
        if (!target || !target.closest) return true;
        if (target.closest(".bank-pin-key, .bank-pin-keypad")) return false;
        if (target.closest(".photo-zoom-viewport")) return false;
        return true;
    }

    var EDGE_BACK_ZONE_PX = 24;
    var EDGE_BACK_MIN_DX = 100;
    var EDGE_BACK_THRESHOLD_RATIO = 0.38;
    var GOV_PIN_OK_KEY = "kaspi_gov_pin_ok";
    var GOV_LOADED_KEY = "kaspi_gov_loaded";
    var APP_LOADED_KEY = "kaspi_app_loaded";
    var WEBAUTHN_CRED_KEY = "kaspi_webauthn_cred";
    var AUTH_SESSION_KEY = "kaspi_auth_session";

    function isGovLoaded() {
        try {
            return localStorage.getItem(GOV_LOADED_KEY) === "1";
        } catch (err) {
            return false;
        }
    }

    function markGovLoaded() {
        try {
            localStorage.setItem(GOV_LOADED_KEY, "1");
        } catch (err) {
            /* ignore */
        }
    }

    function isAppLoaded() {
        try {
            return localStorage.getItem(APP_LOADED_KEY) === "1";
        } catch (err) {
            return false;
        }
    }

    function markAppLoaded() {
        try {
            localStorage.setItem(APP_LOADED_KEY, "1");
        } catch (err) {
            /* ignore */
        }
    }

    function bufferToBase64url(buffer) {
        var bytes = new Uint8Array(buffer);
        var str = "";
        for (var i = 0; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    function base64urlToBuffer(base64url) {
        var base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
            base64 += "=";
        }
        var binary = atob(base64);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function randomChallenge() {
        var bytes = new Uint8Array(32);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(bytes);
        } else {
            for (var i = 0; i < bytes.length; i++) {
                bytes[i] = Math.floor(Math.random() * 256);
            }
        }
        return bytes;
    }

    function getWebAuthnRpId() {
        return window.location.hostname || "localhost";
    }

    function getStoredCredentialId() {
        try {
            return localStorage.getItem(WEBAUTHN_CRED_KEY) || "";
        } catch (err) {
            return "";
        }
    }

    function storeCredentialId(id) {
        try {
            localStorage.setItem(WEBAUTHN_CRED_KEY, id);
        } catch (err) {
            /* ignore */
        }
    }

    function registerWebAuthnCredential(onSuccess, onFail) {
        if (!window.PublicKeyCredential || !navigator.credentials || !navigator.credentials.create) {
            if (onFail) onFail();
            return;
        }
        var userId = randomChallenge();
        var options = {
            publicKey: {
                challenge: randomChallenge(),
                rp: { name: "Kaspi.kz", id: getWebAuthnRpId() },
                user: {
                    id: userId,
                    name: "kaspi-user",
                    displayName: "Kaspi User",
                },
                pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required",
                    residentKey: "preferred",
                },
                timeout: 60000,
                attestation: "none",
            },
        };
        navigator.credentials
            .create(options)
            .then(function (cred) {
                if (cred && cred.rawId) {
                    storeCredentialId(bufferToBase64url(cred.rawId));
                }
                if (onSuccess) onSuccess();
            })
            .catch(function () {
                if (onFail) onFail();
            });
    }

    function authenticateWebAuthn(onSuccess, onFail) {
        if (!window.PublicKeyCredential || !navigator.credentials || !navigator.credentials.get) {
            if (onFail) onFail();
            return;
        }
        var credId = getStoredCredentialId();
        var allowCredentials = [];
        if (credId) {
            allowCredentials.push({
                type: "public-key",
                id: base64urlToBuffer(credId),
            });
        }
        var options = {
            publicKey: {
                challenge: randomChallenge(),
                rpId: getWebAuthnRpId(),
                allowCredentials: allowCredentials,
                userVerification: "required",
                timeout: 60000,
            },
        };
        navigator.credentials
            .get(options)
            .then(function (cred) {
                if (cred && cred.rawId && !credId) {
                    storeCredentialId(bufferToBase64url(cred.rawId));
                }
                if (onSuccess) onSuccess();
            })
            .catch(function () {
                if (onFail) onFail();
            });
    }

    function tryBiometricAuth(onSuccess, onFail) {
        if (!window.isSecureContext || !window.PublicKeyCredential) {
            if (onFail) onFail();
            return false;
        }
        var done = false;
        function finish(success) {
            if (done) return;
            done = true;
            if (success) {
                if (onSuccess) onSuccess();
            } else if (onFail) {
                onFail();
            }
        }
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
            .then(function (available) {
                if (!available) {
                    finish(false);
                    return;
                }
                if (getStoredCredentialId()) {
                    authenticateWebAuthn(
                        function () {
                            finish(true);
                        },
                        function () {
                            registerWebAuthnCredential(
                                function () {
                                    finish(true);
                                },
                                function () {
                                    finish(false);
                                }
                            );
                        }
                    );
                } else {
                    registerWebAuthnCredential(
                        function () {
                            finish(true);
                        },
                        function () {
                            finish(false);
                        }
                    );
                }
            })
            .catch(function () {
                finish(false);
            });
        return true;
    }

    function initOverlayEdgeBack(options) {
        options = options || {};
        var canGo = options.canGo;
        var onBack = options.onBack;
        if (typeof canGo !== "function" || typeof onBack !== "function") return;

        var edgeTracking = false;
        var edgeStartX = 0;
        var edgeStartY = 0;
        var edgeCommitted = false;

        document.addEventListener(
            "touchstart",
            function (e) {
                if (e.touches.length !== 1) return;
                if (!canGo()) return;
                var x = e.touches[0].clientX;
                if (x > EDGE_BACK_ZONE_PX) return;
                edgeStartX = x;
                edgeStartY = e.touches[0].clientY;
                edgeTracking = true;
                edgeCommitted = false;
            },
            { passive: true }
        );

        document.addEventListener(
            "touchmove",
            function (e) {
                if (!edgeTracking) return;
                var dx = e.touches[0].clientX - edgeStartX;
                var dy = e.touches[0].clientY - edgeStartY;
                if (dx < 0) {
                    edgeTracking = false;
                    return;
                }
                if (dx <= 8) return;
                if (!edgeCommitted) {
                    if (Math.abs(dx) < 14) return;
                    if (Math.abs(dx) < Math.abs(dy) * 1.3) {
                        edgeTracking = false;
                        return;
                    }
                    edgeCommitted = true;
                }
                e.preventDefault();
            },
            { passive: false }
        );

        function endOverlayBack(e) {
            if (!edgeTracking) return;
            edgeTracking = false;
            var dx = e.changedTouches[0].clientX - edgeStartX;
            var threshold = Math.max(window.innerWidth * EDGE_BACK_THRESHOLD_RATIO, EDGE_BACK_MIN_DX);
            if (edgeCommitted && dx >= threshold) {
                onBack();
            }
            edgeCommitted = false;
        }

        document.addEventListener("touchend", endOverlayBack, { passive: true });
        document.addEventListener("touchcancel", endOverlayBack, { passive: true });
    }

    function initEdgeBackNavigation() {
        // Отключено - используем системный свайп
        return;
    }

    function initSmartSkeleton(skeletonId, contentReadyCallback, options) {
        options = options || {};
        var skeleton = document.getElementById(skeletonId);
        if (!skeleton) return;

        var startTime = Date.now();
        var contentReady = false;
        var timerStarted = false;
        var maxTimer = null;
        var minTimer = null;

        function hideSkeleton() {
            if (maxTimer) {
                clearTimeout(maxTimer);
                maxTimer = null;
            }
            if (minTimer) {
                clearTimeout(minTimer);
                minTimer = null;
            }
            skeleton.classList.add('skeleton-fade-out');
            if (document.body.classList.contains('skeleton-active')) {
                document.body.classList.remove('skeleton-active');
            }
        }

        function startMaxTimer() {
            if (timerStarted) return;
            timerStarted = true;
            maxTimer = setTimeout(function() {
                hideSkeleton();
            }, SKELETON_MAX_TIME_MS);
        }

        function onContentReady() {
            if (contentReady) return;
            contentReady = true;

            var elapsed = Date.now() - startTime;
            var remaining = Math.max(0, SKELETON_MIN_TIME_MS - elapsed);

            if (remaining > 0) {
                minTimer = setTimeout(function() {
                    hideSkeleton();
                }, remaining);
            } else {
                hideSkeleton();
            }
        }

        if (typeof contentReadyCallback === 'function') {
            contentReadyCallback(onContentReady);
        } else {
            onContentReady();
        }

        startMaxTimer();

        return {
            hide: hideSkeleton,
            markReady: onContentReady
        };
    }

    function preloadIdPhoto(callback) {
        var src = getIdPhoto();
        if (!src) {
            if (callback) callback(false);
            return;
        }
        var finished = false;
        function finish(ok) {
            if (finished) return;
            finished = true;
            if (callback) callback(ok);
        }
        var img = new Image();
        img.onload = function () {
            finish(true);
        };
        img.onerror = function () {
            finish(false);
        };
        img.src = src;
        window.setTimeout(function () {
            finish(false);
        }, 5000);
    }

    function applyIdDocPreparedState() {
        try {
            var root = document.documentElement;
            var photo = getIdPhoto();
            var pdf = getIdPdf();
            if (photo) {
                root.classList.add("has-id-photo");
                window.__KASPI_ID_PHOTO__ = photo;
            }
            if (pdf.data) {
                root.classList.add("has-id-pdf");
            }
        } catch (err) {
            /* ignore */
        }
    }

    function initNoZoom() {
        var meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute(
                "content",
                "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
            );
        }

        document.documentElement.style.touchAction = "manipulation";
        if (document.body) {
            document.body.style.touchAction = "manipulation";
        }

        document.addEventListener(
            "gesturestart",
            function (e) {
                if (!shouldBlockPageZoom(e.target)) return;
                e.preventDefault();
            },
            { passive: false }
        );

        document.addEventListener(
            "gesturechange",
            function (e) {
                if (!shouldBlockPageZoom(e.target)) return;
                e.preventDefault();
            },
            { passive: false }
        );

        document.addEventListener(
            "gestureend",
            function (e) {
                if (!shouldBlockPageZoom(e.target)) return;
                e.preventDefault();
            },
            { passive: false }
        );

        var lastTouchEnd = 0;
        document.addEventListener(
            "touchend",
            function (e) {
                if (!shouldBlockPageZoom(e.target)) return;
                var now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            },
            { passive: false }
        );

        document.addEventListener(
            "wheel",
            function (e) {
                if (!shouldBlockPageZoom(e.target)) return;
                if (e.ctrlKey) {
                    e.preventDefault();
                }
            },
            { passive: false }
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            initPwa();
            initNoZoom();
            initPageTransitions();
            initAppLike();
            initEdgeBackNavigation();
        });
    } else {
        initPwa();
        initNoZoom();
        initPageTransitions();
        initAppLike();
        initEdgeBackNavigation();
    }

    window.KaspiApp = {
        getIdData: getIdData,
        setIdData: setIdData,
        isIdDataComplete: isIdDataComplete,
        getIdPhoto: getIdPhoto,
        setIdPhoto: setIdPhoto,
        clearIdPhoto: clearIdPhoto,
        getIdPdf: getIdPdf,
        setIdPdf: setIdPdf,
        getIdPdfRandom: getIdPdfRandom,
        setIdPdfRandom: setIdPdfRandom,
        clearIdPdf: clearIdPdf,
        clearAllIdData: clearAllIdData,
        hasIdPhoto: hasIdPhoto,
        hasIdPdf: hasIdPdf,
        openGovServices: openGovServices,
        openIdDocument: openIdDocument,
        goTo: goTo,
        goBack: goBack,
        isGovPinVerified: isGovPinVerified,
        markGovPinVerified: markGovPinVerified,
        clearGovPinVerified: clearGovPinVerified,
        isGovLoaded: isGovLoaded,
        markGovLoaded: markGovLoaded,
        isAppLoaded: isAppLoaded,
        markAppLoaded: markAppLoaded,
        tryBiometricAuth: tryBiometricAuth,
        copyToClipboard: copyToClipboard,
        initNoZoom: initNoZoom,
        initPwa: initPwa,
        preloadIdPhoto: preloadIdPhoto,
        applyIdDocPreparedState: applyIdDocPreparedState,
        initEdgeBackNavigation: initEdgeBackNavigation,
        initSmartSkeleton: initSmartSkeleton,
        initOverlayEdgeBack: initOverlayEdgeBack,
        isAuthSessionValid: isAuthSessionValid,
        markAuthSessionValid: markAuthSessionValid,
        clearAuthSession: clearAuthSession,
        initSPA: initSPA,
    };
})();

// SPA Router and View Management
function initSPA() {
    var appContainer = document.getElementById('app-container');
    if (!appContainer) return;

    // Load all views into memory
    loadViews();
    
    // Initialize routing
    initRouter();
    
    // Apply global styles for SPA
    applySPAGlobalStyles();
}

function loadViews() {
    var views = ['index', 'gov', 'bank', 'id-form', 'id-entry', 'id-progress', 'id-loading'];
    var appContainer = document.getElementById('app-container');
    
    views.forEach(function(viewName) {
        var viewElement = document.createElement('div');
        viewElement.id = 'view-' + viewName;
        viewElement.className = 'spa-view';
        viewElement.dataset.view = viewName;
        
        // Load content from corresponding HTML file
        loadViewContent(viewName, viewElement);
        
        appContainer.appendChild(viewElement);
    });
}

function loadViewContent(viewName, viewElement) {
    var htmlFile = viewName + '.html';
    
    // For now, create placeholder - will load actual content via fetch
    viewElement.innerHTML = '<div class="view-placeholder">Loading ' + viewName + '...</div>';
    
    // Load actual content
    fetch(htmlFile)
        .then(function(response) {
            if (!response.ok) throw new Error('Failed to load ' + htmlFile);
            return response.text();
        })
        .then(function(html) {
            // Extract body content
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            var bodyContent = doc.body.innerHTML;
            
            // Extract and inject styles
            var styles = doc.querySelectorAll('style');
            styles.forEach(function(style) {
                var styleElement = document.createElement('style');
                styleElement.textContent = style.textContent;
                document.head.appendChild(styleElement);
            });
            
            viewElement.innerHTML = bodyContent;
            
            // Initialize view-specific scripts
            initViewScripts(viewName, viewElement);
        })
        .catch(function(error) {
            console.error('Error loading view:', error);
            viewElement.innerHTML = '<div class="view-placeholder">Error loading ' + viewName + '</div>';
        });
}

function initViewScripts(viewName, viewElement) {
    // View-specific initialization will be handled here
    switch(viewName) {
        case 'gov':
            initGovView(viewElement);
            break;
        case 'bank':
            initBankView(viewElement);
            break;
        case 'id-form':
            initIdFormView(viewElement);
            break;
        // Add other view initializations as needed
    }
}

function initGovView(viewElement) {
    // Initialize gov-specific functionality
    var skeleton = viewElement.querySelector('#skeleton-screen');
    if (skeleton) {
        var skipSkeleton = false;
        try {
            skipSkeleton = sessionStorage.getItem('kaspi_skip_gov_skeleton') === 'true';
            sessionStorage.removeItem('kaspi_skip_gov_skeleton');
        } catch (err) {
            /* ignore */
        }

        if (skipSkeleton) {
            skeleton.style.display = 'none';
            return;
        }

        skeleton.classList.remove('skeleton-fade-out');
        viewElement.classList.add('skeleton-active');

        setTimeout(function() {
            skeleton.classList.add('skeleton-fade-out');
            viewElement.classList.remove('skeleton-active');
        }, 1100);
    }
}

function initBankView(viewElement) {
    // Initialize bank-specific functionality
    var skeleton = viewElement.querySelector('#bank-skeleton');
    if (skeleton) {
        skeleton.classList.remove('skeleton-fade-out');
        viewElement.classList.add('skeleton-active');

        setTimeout(function() {
            skeleton.classList.add('skeleton-fade-out');
        }, 1100);
    }
}

function initIdFormView(viewElement) {
    // Initialize id-form specific functionality
    try {
        sessionStorage.setItem('kaspi_skip_gov_skeleton', 'true');
    } catch (err) {
        /* ignore */
    }
}

function initRouter() {
    // Handle browser back/forward
    window.addEventListener('popstate', handleRouteChange);
    
    // Handle initial route
    handleRouteChange();
}

function handleRouteChange() {
    var path = window.location.pathname;
    var viewName = getViewNameFromPath(path);
    
    navigateToView(viewName, false);
}

function getViewNameFromPath(path) {
    if (path.includes('gov.html')) return 'gov';
    if (path.includes('bank.html')) return 'bank';
    if (path.includes('id-form.html')) return 'id-form';
    if (path.includes('id-entry.html')) return 'id-entry';
    if (path.includes('id-progress.html')) return 'id-progress';
    if (path.includes('id-loading.html')) return 'id-loading';
    return 'index';
}

function navigateToView(viewName, pushState) {
    var currentView = document.querySelector('.spa-view.active');
    var targetView = document.getElementById('view-' + viewName);
    
    if (!targetView) return;
    
    // Remove active class from current view
    if (currentView) {
        currentView.classList.remove('active');
        currentView.classList.add('leaving');
        
        // Clean up leaving animation
        currentView.addEventListener('animationend', function() {
            currentView.classList.remove('leaving');
        }, { once: true });
    }
    
    // Add active class to target view
    targetView.classList.add('active');
    
    // Update URL if needed
    if (pushState) {
        var url = getViewUrl(viewName);
        window.history.pushState({ view: viewName }, '', url);
    }
}

function getViewUrl(viewName) {
    switch(viewName) {
        case 'gov': return 'gov.html';
        case 'bank': return 'bank.html';
        case 'id-form': return 'id-form.html';
        case 'id-entry': return 'id-entry.html';
        case 'id-progress': return 'id-progress.html';
        case 'id-loading': return 'id-loading.html';
        default: return 'index.html';
    }
}

function applySPAGlobalStyles() {
    var style = document.createElement('style');
    style.id = 'spa-global-styles';
    style.textContent = `
        .spa-view {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            background: #ffffff;
            contain: layout style paint;
        }
        
        .spa-view.active {
            display: block;
            animation: viewEnter 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        
        .spa-view:not(.active) {
            display: none;
        }
        
        .spa-view.leaving {
            display: block;
            animation: viewLeave 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        
        @keyframes viewEnter {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes viewLeave {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(-20%);
                opacity: 0.9;
            }
        }
        
        /* App Shell optimization */
        #app-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            contain: layout style;
        }
        
        /* Fixed elements should not be contained */
        .bottom-nav, .gov-header, [style*="position: fixed"] {
            contain: none !important;
        }
    `;
    document.head.appendChild(style);
}

