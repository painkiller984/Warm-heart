import "/src/sass/style.scss";
import Swiper from "swiper";
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import JustValidate from "just-validate";
import "./product.js";
import markerIconUrl from "/src/logo/warm-heart-logo.png";
// ===================================================================
//                           SWIPER
// ===================================================================

let swiper = null;
if (document.querySelector(".promo__swiper")) {
    swiper = new Swiper(".promo__swiper", {
        modules: [Pagination, Navigation],
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            768: { direction: "vertical" },
        },
    });
}

let popularSwiper = null;
if (document.querySelector(".popular__swiper")) {
    popularSwiper = new Swiper(".popular__swiper", {
        modules: [Navigation, Pagination],
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        spaceBetween: 20,
        breakpoints: {
            480: { slidesPerView: 2 },
            1000: { slidesPerView: 3 },
            1200: { slidesPerView: 3, spaceBetween: 30 },
        },
    });
}

let shopSwiper = null;

// ===================================================================
//                           БУРГЕР
// ===================================================================

const headerBurger = document.querySelector(".header__burger");
const headerMenu = document.querySelector(".header__menu");
const headerClose = document.querySelector(".header__menu-close");
const headerOverlay = document.querySelector(".header__overlay");

function closeMenu() {
    if (!headerMenu || !headerOverlay) return;
    headerMenu.classList.remove("header__menu-active");
    headerOverlay.classList.remove("header__overlay-active");
    document.body.style.overflow = "";
}

if (headerBurger && headerMenu && headerOverlay) {
    headerBurger.addEventListener("click", () => {
        headerMenu.classList.toggle("header__menu-active");
        headerOverlay.classList.toggle("header__overlay-active");
        document.body.style.overflow = "hidden";
    });
}

if (headerClose) headerClose.addEventListener("click", closeMenu);
if (headerOverlay) headerOverlay.addEventListener("click", closeMenu);
// ===================================================================
//                         ВАЛИДАЦИЯ (только если форма есть)
// ===================================================================

if (document.querySelector(".get__form")) {
    const validation = new JustValidate(".get__form");

    validation
        .addField(
            "#email",
            [
                { rule: "required", errorMessage: "Enter email" },
                {
                    rule: "email",
                    errorMessage: "Uncorrected email. Example key@warm.com",
                },
            ],
            {
                errorsContainer: document.querySelector(
                    ".get__form-email-error"
                ),
            }
        )
        .onSuccess(async (event) => {
            event.preventDefault();

            const form = event.target;
            const email = form.querySelector("#email").value;

            try {
                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/posts",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                await res.json();
                form.reset();
            } catch (err) {
                console.error("Ошибка запроса:", err);
            }
        });
}

// ===================================================================
//                         АККОРДЕОН В ФУТЕРЕ
// ===================================================================

const footerItems = document.querySelectorAll(".footer__links-item");

footerItems.forEach((item) => {
    const header = item.querySelector(".footer__links-item-header");
    if (!header) return;

    header.addEventListener("click", () => {
        const isOpen = item.classList.contains("footer__links-item--open");

        footerItems.forEach((i) =>
            i.classList.remove("footer__links-item--open")
        );

        if (!isOpen) item.classList.add("footer__links-item--open");
    });
});

function mountShopSwiper(shopSwiperElement) {
    if (!shopSwiperElement) return null;

    if (shopSwiper) {
        shopSwiper.destroy(true, true);
        shopSwiper = null;
    }

    const paginationEl = shopSwiperElement.querySelector(".swiper-pagination");
    const nextEl = shopSwiperElement.querySelector(".swiper-button-next");
    const prevEl = shopSwiperElement.querySelector(".swiper-button-prev");

    if (!paginationEl || !nextEl || !prevEl) return null;

    shopSwiper = new Swiper(shopSwiperElement, {
        modules: [Pagination, Navigation],
        autoHeight: true,
        navigation: {
            clickable: true,
            nextEl,
            prevEl,
        },
        pagination: {
            el: paginationEl,
            clickable: true,
            type: "custom",
            renderCustom(swiper, current, total) {
                const isWide = window.matchMedia("(min-width: 480px)").matches;
                const maxFullPages = isWide ? 7 : 6;

                if (total <= maxFullPages) {
                    return Array.from({ length: total }, (_, i) => i + 1)
                        .map((num) => {
                            const active =
                                num === current
                                    ? " swiper-pagination-bullet-active"
                                    : "";
                            return `<span class="swiper-pagination-bullet${active}" data-index="${
                                num - 1
                            }">${num}</span>`;
                        })
                        .join("");
                }

                const pages = [1];

                if (current <= 2) {
                    pages.push(2, 3, 4);
                    if (isWide) pages.push(5);
                    pages.push("ellipsis", total);
                } else if (current >= total - 3) {
                    pages.push(
                        total - 4,
                        total - 3,
                        total - 2,
                        total - 1,
                        total
                    );
                } else {
                    pages.push(
                        current,
                        current + 1,
                        current + 2,
                        "ellipsis",
                        total
                    );
                }

                return pages
                    .map((num) => {
                        if (num === "ellipsis") {
                            return '<span class="swiper-pagination-ellipsis">...</span>';
                        }
                        const active =
                            num === current
                                ? " swiper-pagination-bullet-active"
                                : "";
                        return `<span class="swiper-pagination-bullet${active}" data-index="${
                            num - 1
                        }">${num}</span>`;
                    })
                    .join("");
            },
        },
        on: {
            afterInit(swiper) {
                const paginationEl = swiper.pagination.el;
                if (!paginationEl) return;
                paginationEl.addEventListener("click", (e) => {
                    const target = e.target.closest(
                        ".swiper-pagination-bullet"
                    );
                    if (!target) return;
                    const idx = Number(target.dataset.index);
                    if (Number.isFinite(idx)) swiper.slideTo(idx);
                });
            },
        },
    });

    return shopSwiper;
}

try {
    document.addEventListener("DOMContentLoaded", function () {
        const filterBtn = document.querySelector(".shop__filters-left");
        const closeModal = document.getElementById("closeModal");
        const modalOverlay = document.getElementById("modalOverlay");
        const filterModal = document.getElementById("filterModal");
        const resetBtn = document.getElementById("resetBtn");
        const applyBtn = document.getElementById("applyBtn");
        const activeFiltersContainer = document.getElementById("activeFilters");
        const productsCount = document.querySelector(
            ".shop__filters-right-count"
        );
        const filterInputs = document.querySelectorAll(
            '.filter-option input[type="checkbox"]'
        );
        const shopSwiperElement =
            document.querySelector(".shop__swiper") ||
            document.querySelector(".shop-2__swiper");
        const shopWrapper =
            shopSwiperElement &&
            shopSwiperElement.querySelector(".swiper-wrapper");
        const cardSelector =
            "[data-size][data-color][data-material][data-price]";
        const baseSlideClass =
            (shopWrapper &&
                shopWrapper.querySelector(".swiper-slide")?.className) ||
            "swiper-slide";
        const shopCards =
            shopWrapper &&
            Array.from(shopWrapper.querySelectorAll(cardSelector)).map(
                (card) => ({
                    template: card.cloneNode(true),
                    size: (card.dataset.size || "").toLowerCase(),
                    color: (card.dataset.color || "").toLowerCase(),
                    material: (card.dataset.material || "").toLowerCase(),
                    price: Number(card.dataset.price) || 0,
                })
            );
        const placeholderSlides =
            shopWrapper &&
            Array.from(shopWrapper.querySelectorAll(".swiper-slide")).filter(
                (slide) => !slide.querySelector(cardSelector)
            );
        const filterGroups = document.querySelectorAll(".filter-group");

        function getCardsPerSlide(swiperEl) {
            const isWide = window.matchMedia("(min-width: 480px)").matches;
            const isShop2 = swiperEl?.classList.contains("shop-2__swiper");

            if (isShop2) {
                return 4;
            }

            return isWide ? 12 : 9;
        }

        function syncFilterLabels() {
            if (!filterInputs) return;
            filterInputs.forEach((input) => {
                const isChecked = input.checked;
                document
                    .querySelectorAll(`label[for="${input.id}"]`)
                    .forEach((label) => {
                        label.classList.toggle(
                            "filter-label-checked",
                            isChecked
                        );
                    });
            });
        }

        function updateProductsCount(value) {
            if (!productsCount) return;
            productsCount.textContent = `${value} products`;
        }

        function getSelectedFilters() {
            const filters = {
                sizes: [],
                colors: [],
                materials: [],
                prices: [],
            };

            const checkedFilters = document.querySelectorAll(
                '.filter-option input[type="checkbox"]:checked'
            );

            checkedFilters.forEach((checkbox) => {
                const value = (checkbox.value || "").toLowerCase();
                if (!value) return;

                if (checkbox.id.startsWith("size-")) {
                    filters.sizes.push(value);
                } else if (checkbox.id.startsWith("color-")) {
                    filters.colors.push(value);
                } else if (checkbox.id.startsWith("material-")) {
                    filters.materials.push(value);
                } else if (checkbox.id.startsWith("price-")) {
                    filters.prices.push(value);
                }
            });

            return filters;
        }

        function isPriceMatch(priceValue, priceFilters) {
            if (!priceFilters.length) return true;

            return priceFilters.some((priceRange) => {
                if (priceRange === "90-179") {
                    return priceValue >= 90 && priceValue <= 179;
                }

                if (priceRange === "179+") {
                    return priceValue >= 179;
                }

                return true;
            });
        }

        function matchesFilters(item, filters) {
            if (!item) return false;

            const sizeMatch =
                !filters.sizes.length || filters.sizes.includes(item.size);
            const colorMatch =
                !filters.colors.length || filters.colors.includes(item.color);
            const materialMatch =
                !filters.materials.length ||
                filters.materials.includes(item.material);
            const priceMatch = isPriceMatch(item.price, filters.prices);

            return sizeMatch && colorMatch && materialMatch && priceMatch;
        }

        function renderShopSlides(slides) {
            if (!shopWrapper || !shopSwiperElement) return;

            if (shopSwiper) {
                shopSwiper.destroy(true, true);
                shopSwiper = null;
            }

            shopWrapper.innerHTML = "";

            if (!slides.length) {
                mountShopSwiper(shopSwiperElement);
                return;
            }

            const chunkSize = getCardsPerSlide(shopSwiperElement);
            for (let i = 0; i < slides.length; i += chunkSize) {
                const chunk = slides.slice(i, i + chunkSize);
                const slideEl = document.createElement("div");
                slideEl.className = baseSlideClass;
                chunk.forEach((item) => {
                    slideEl.appendChild(item.template.cloneNode(true));
                });
                shopWrapper.appendChild(slideEl);
            }

            if (placeholderSlides && placeholderSlides.length) {
                placeholderSlides.forEach((phSlide) => {
                    shopWrapper.appendChild(phSlide.cloneNode(true));
                });
            }

            mountShopSwiper(shopSwiperElement);
            updateProductsCount(
                shopWrapper.querySelectorAll(cardSelector).length
            );
        }

        function applyShopFilters() {
            if (!shopCards || !shopCards.length || !shopWrapper) return;

            const filters = getSelectedFilters();
            const filteredCards = shopCards.filter((item) =>
                matchesFilters(item, filters)
            );

            renderShopSlides(filteredCards);
        }

        function updateActiveFilters() {
            if (!activeFiltersContainer) return;
            activeFiltersContainer.innerHTML = "";

            const checkedFilters = document.querySelectorAll(
                '.filter-option input[type="checkbox"]:checked'
            );

            checkedFilters.forEach((checkbox) => {
                const label = checkbox.getAttribute("data-label");
                const filterId = checkbox.id;

                const tag = document.createElement("div");
                tag.className = "filter-tag";
                tag.innerHTML = `
                        <svg class="filter-tag-icon-chrest" data-filter-id="${filterId}">
                                <use
                                    xlink:href="/src/icons/sprite.svg#shop_chrest"
                                ></use>
                            </svg>
                            <span>${label}</span>
                    `;

                activeFiltersContainer.appendChild(tag);
            });

            document
                .querySelectorAll(".filter-tag-icon-chrest")
                .forEach((closeBtn) => {
                    closeBtn.addEventListener("click", function (e) {
                        e.stopPropagation();
                        const filterId = this.getAttribute("data-filter-id");
                        const checkbox = document.getElementById(filterId);
                        if (checkbox) {
                            checkbox.checked = false;
                            updateActiveFilters();
                            applyShopFilters();
                            syncFilterLabels();
                        }
                    });
                });
        }

        function closeAllFilterGroups(except = null) {
            filterGroups.forEach((group) => {
                if (group !== except) group.classList.remove("active");
            });
        }

        function bindFilterGroupToggles() {
            filterGroups.forEach((group) => {
                const header = group.querySelector(".filter-group__header");
                if (!header) return;
                header.addEventListener("click", function () {
                    closeAllFilterGroups(group);
                    group.classList.toggle("active");
                });
            });

            document.addEventListener("click", (e) => {
                if (!e.target.closest(".filter-group")) {
                    closeAllFilterGroups();
                }
            });
        }

        if (filterBtn && modalOverlay && filterModal) {
            filterBtn.addEventListener("click", function (e) {
                e.preventDefault();
                modalOverlay.classList.add("active");
                filterModal.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        }

        function closeFilterModal() {
            if (!modalOverlay || !filterModal) return;
            modalOverlay.classList.remove("active");
            filterModal.classList.remove("active");
            document.body.style.overflow = "";
        }

        if (closeModal) {
            closeModal.addEventListener("click", closeFilterModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener("click", closeFilterModal);
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                filterInputs.forEach((checkbox) => {
                    checkbox.checked = false;
                });
                updateActiveFilters();
                applyShopFilters();
                syncFilterLabels();
            });
        }

        if (applyBtn) {
            applyBtn.addEventListener("click", function () {
                updateActiveFilters();
                applyShopFilters();
                closeFilterModal();
            });
        }

        applyShopFilters();
        updateActiveFilters();
        bindFilterGroupToggles();
        syncFilterLabels();

        if (filterInputs && filterInputs.length) {
            filterInputs.forEach((input) => {
                input.addEventListener("change", () => {
                    updateActiveFilters();
                    if (window.matchMedia("(min-width: 768px)").matches) {
                        applyShopFilters();
                    }
                    syncFilterLabels();
                });
            });
        }

        let resizeTimer = null;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                applyShopFilters();
            }, 150);
        });
    });
} catch (e) {}

try {
    const productSwiper2 = new Swiper(".product__swiper-2", {
        modules: [FreeMode],
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            1200: {
                direction: "vertical",
            },
        },
    });
    const productSwiper = new Swiper(".product__swiper", {
        modules: [Navigation, Thumbs, Pagination],
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: productSwiper2,
        },
        pagination: { el: ".swiper-pagination", clickable: false },
        breakpoints: {
            1200: {
                direction: "vertical",
            },
        },
    });
} catch (e) {}

try {
    document.addEventListener("DOMContentLoaded", () => {
        const tabButtons = Array.from(
            document.querySelectorAll("[data-tab-target]")
        );
        const tabPanels = Array.from(
            document.querySelectorAll("[data-tab-panel]")
        );

        if (!tabButtons.length || !tabPanels.length) {
            return;
        }

        const activateTab = (target) => {
            tabButtons.forEach((button) => {
                const isActive = button.dataset.tabTarget === target;

                button.setAttribute(
                    "aria-selected",
                    isActive ? "true" : "false"
                );
                button.tabIndex = isActive ? 0 : -1;
                button.classList.toggle("product__tab--active", isActive);
            });

            tabPanels.forEach((panel) => {
                const isActive = panel.dataset.tabPanel === target;
                panel.hidden = !isActive;
            });
        };

        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                activateTab(button.dataset.tabTarget);
            });
        });

        activateTab(tabButtons[0].dataset.tabTarget);
    });
} catch (e) {}

const LIKE_MAX_VISIBLE = 7;
const LIKE_BULLET_SPACING = 46; // 16px bullet + 30px gap

function createLikePaginationTrack(swiper) {
    const paginationEl = swiper.pagination?.el;
    const bullets = Array.from(swiper.pagination?.bullets || []);
    if (!paginationEl || !bullets.length) return null;

    if (!paginationEl.querySelector(".like-pagination")) {
        const track = document.createElement("div");
        track.className = "like-pagination";
        bullets.forEach((bullet, idx) => {
            bullet.dataset.index = idx.toString();
            bullet.classList.add("like-pagination__bullet");
            track.appendChild(bullet);
        });
        paginationEl.appendChild(track);
    }

    return paginationEl.querySelector(".like-pagination");
}

function updateLikePagination(swiper) {
    const paginationEl = swiper.pagination?.el;
    const track = paginationEl?.querySelector(".like-pagination");
    const bullets = Array.from(swiper.pagination?.bullets || []);
    if (!paginationEl || !track || !bullets.length) return;

    const isWide = window.matchMedia("(min-width: 480px)").matches;
    const isMedium = window.matchMedia(
        "(min-width: 480px) and (max-width: 999px)"
    ).matches;
    const isLarge = window.matchMedia("(min-width: 1000px)").matches;
    const total = bullets.length;
    const visibleCap = isLarge ? 6 : isMedium ? 8 : LIKE_MAX_VISIBLE;
    const visibleMax = Math.min(total, visibleCap);
    const maxStart = Math.max(total - visibleMax, 0);
    const activeIndex = swiper.realIndex % total;
    let start =
        typeof swiper._likeWindowStart === "number"
            ? swiper._likeWindowStart
            : 0;

    const atWindowEnd = activeIndex >= start + visibleMax - 1;
    const canPeekNext = activeIndex < total - 1;
    const atWindowStart = activeIndex <= start;
    const canPeekPrev = activeIndex > 0;
    const desiredStart = activeIndex > 0 ? Math.max(activeIndex - 1, 0) : 0;

    if (atWindowEnd && canPeekNext) {
        start = Math.min(activeIndex - (visibleMax - 2), maxStart);
    } else if (activeIndex > start + visibleMax - 1) {
        start = Math.min(activeIndex - (visibleMax - 1), maxStart);
    } else if (atWindowStart && canPeekPrev) {
        start = Math.max(activeIndex - 1, 0);
    } else if (activeIndex < start) {
        start = Math.max(activeIndex, 0);
    }

    if (start > desiredStart) {
        start = desiredStart;
    }

    start = Math.min(Math.max(start, 0), maxStart);
    swiper._likeWindowStart = start;

    const end = start + visibleMax - 1;
    const shrinkFront = activeIndex >= total - 2;
    const activeAtRightPenultimate = activeIndex === end - 1;
    const activeAtAbsoluteEnd = activeIndex === total - 1;

    track.style.setProperty(
        "--like-shift",
        `${-start * LIKE_BULLET_SPACING}px`
    );

    bullets.forEach((bullet, idx) => {
        bullet.classList.remove(
            "like-pagination__bullet--edge",
            "like-pagination__bullet--secondary",
            "like-pagination__bullet--main",
            "like-pagination__bullet--hidden",
            "like-pagination__bullet--active"
        );
        bullet.style.width = "";
        bullet.style.height = "";
        bullet.style.margin = "";
        bullet.style.transform = "";

        const inWindow = idx >= start && idx <= end;
        const keepMainSecondFromEnd =
            activeIndex === total - 1 && idx === total - 2;
        const isPrevOfActive = idx === activeIndex - 1;
        let sizeState = "hidden";

        if (inWindow) {
            const pos = idx - start;
            const isFirstTwo = idx === 0 || idx === 1;
            const isSecondFromEnd =
                total > 1 && idx === total - 2 && activeIndex === total - 1;

            if (idx === activeIndex) {
                sizeState = "main";
                bullet.classList.add("like-pagination__bullet--active");
            } else if (isWide) {
                sizeState = "main";
            } else if (start > 0 && pos === 0) {
                sizeState = "edge";
            } else if (start > 0 && pos === 1) {
                sizeState = "secondary";
            } else if (
                (activeAtRightPenultimate || activeAtAbsoluteEnd) &&
                pos === 0
            ) {
                sizeState = "edge";
            } else if (
                (activeAtRightPenultimate || activeAtAbsoluteEnd) &&
                pos === 1
            ) {
                sizeState = "secondary";
            } else if (start === 0 && (pos === 0 || pos === 1)) {
                sizeState = "main";
            } else if (isPrevOfActive) {
                sizeState = "main";
            } else if (isSecondFromEnd || keepMainSecondFromEnd) {
                sizeState = "main";
            } else if (pos === 0 || pos === visibleMax - 1) {
                sizeState = "edge";
            } else if (pos === 1 || pos === visibleMax - 2) {
                sizeState = "secondary";
            } else {
                sizeState = "main";
            }
        }

        bullet.classList.add(`like-pagination__bullet--${sizeState}`);
        bullet.setAttribute("aria-current", idx === activeIndex);
    });

    if (activeIndex === total - 1 && bullets[total - 2]) {
        const prev = bullets[total - 2];
        prev.classList.remove(
            "like-pagination__bullet--edge",
            "like-pagination__bullet--secondary",
            "like-pagination__bullet--hidden"
        );
        prev.classList.add("like-pagination__bullet--main");
        prev.style.width = "16px";
        prev.style.height = "16px";
        prev.style.margin = "0 15px";
        prev.style.transform = "scale(1)";
    }
}

try {
    const likeSwiper = new Swiper(".like__swiper", {
        modules: [Pagination, Navigation],
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: "bullets",
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        spaceBetween: 20,
        breakpoints: {
            480: {
                slidesPerView: 2,
            },
            1000: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
        on: {
            afterInit(swiper) {
                createLikePaginationTrack(swiper);
                updateLikePagination(swiper);

                const paginationEl = swiper.pagination.el;
                if (paginationEl) {
                    paginationEl.addEventListener("click", (e) => {
                        const target = e.target.closest(
                            ".like-pagination__bullet"
                        );
                        if (!target) return;
                        const idx = Number(target.dataset.index);
                        if (!Number.isFinite(idx)) return;
                        if (typeof swiper.slideToLoop === "function") {
                            swiper.slideToLoop(idx);
                        } else {
                            swiper.slideTo(idx);
                        }
                    });
                }

                let resizeTimer = null;
                window.addEventListener("resize", () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => {
                        createLikePaginationTrack(swiper);
                        updateLikePagination(swiper);
                    }, 120);
                });
            },
            slideChange(swiper) {
                updateLikePagination(swiper);
            },
            resize(swiper) {
                updateLikePagination(swiper);
            },
            breakpoint(swiper) {
                createLikePaginationTrack(swiper);
                updateLikePagination(swiper);
            },
        },
    });
} catch (e) {}

const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const CONTACT_MARKERS = [
    {
        title: "Warm Heart Shop",
        address: "2A Craven Street, Northampton",
        coords: [52.24455607022386, -0.8935470590990587],
    },
    {
        title: "Warm Heart Office",
        address: "70 Edith Street, Northampton",
        coords: [52.239944135633145, -0.8837003927330591],
    },
];

function injectLeafletCss() {
    if (document.querySelector('link[data-leaflet-css="true"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS_URL;
    link.dataset.leafletCss = "true";
    document.head.appendChild(link);
}

function loadLeafletScript() {
    if (window.L) return Promise.resolve(window.L);

    const existing = document.querySelector('script[data-leaflet="true"]');
    if (existing) {
        return new Promise((resolve, reject) => {
            existing.addEventListener("load", () => resolve(window.L));
            existing.addEventListener("error", () =>
                reject(new Error("Leaflet failed to load"))
            );
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = LEAFLET_JS_URL;
        script.async = true;
        script.defer = true;
        script.dataset.leaflet = "true";
        script.onload = () => resolve(window.L);
        script.onerror = () => reject(new Error("Leaflet failed to load"));
        document.head.appendChild(script);
    });
}

async function createLeafletContactsMap() {
    const mapElement = document.getElementById("contacts-map");
    if (!mapElement || mapElement.dataset.initialized === "true") return;

    mapElement.dataset.initialized = "true";
    injectLeafletCss();

    try {
        const L = await loadLeafletScript();
        const map = L.map(mapElement, {
            zoomControl: false,
            attributionControl: true,
        });

        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            {
                attribution:
                    '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>',
                maxZoom: 19,
            }
        ).addTo(map);

        const markerIcon = L.icon({
            iconUrl: markerIconUrl,
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            className: "contacts__marker",
        });

        const bounds = L.latLngBounds([]);

        CONTACT_MARKERS.forEach((item) => {
            if (!item.coords || item.coords.length !== 2) return;
            const latLng = L.latLng(item.coords[0], item.coords[1]);
            bounds.extend(latLng);
            L.marker(latLng, { icon: markerIcon, title: item.title }).addTo(
                map
            );
        });

        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                paddingTopLeft: [50, 80],
                paddingBottomRight: [0, 0],
                maxZoom: 14,
            });
        }
    } catch (err) {
        console.error("Failed to initialize Leaflet map:", err);
    }
}

try {
    document.addEventListener("DOMContentLoaded", createLeafletContactsMap);
} catch (e) {}
