import products from "./products.js";

function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id ? id.toLowerCase() : null;
}

function findProductById(id) {
    if (!id) return null;
    return products.find((item) => item.id.toLowerCase() === id) || null;
}

function setTextContent(el, value) {
    if (el && typeof value === "string") {
        el.textContent = value;
    }
}

function renderSlides(wrapper, imgs, slideClass) {
    if (!wrapper || !imgs || !imgs.length) return;
    wrapper.innerHTML = "";
    imgs.forEach((src) => {
        const slide = document.createElement("div");
        slide.className = slideClass;
        const img = document.createElement("img");
        img.src = src;
        slide.appendChild(img);
        wrapper.appendChild(slide);
    });
}

function renderThumbs(wrapper, imgs, slideClass) {
    if (!wrapper || !imgs || !imgs.length) return;
    const navButtons = Array.from(
        wrapper.querySelectorAll(".swiper-button-next, .swiper-button-prev")
    );
    wrapper.innerHTML = "";
    imgs.forEach((src) => {
        const slide = document.createElement("div");
        slide.className = slideClass;
        const img = document.createElement("img");
        img.src = src;
        slide.appendChild(img);
        wrapper.appendChild(slide);
    });
    navButtons.forEach((btn) => wrapper.appendChild(btn));
}

// ===================================================================
//                           РџРѕРёСЃРє РІ header
// ===================================================================

function buildSearchData(list) {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
        id: item.id,
        title: item.title || "",
        price: item.price || "",
        color: item.color || "",
        img: item.images && item.images.length ? item.images[0] : "",
    }));
}

function filterSearch(list, query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return list.filter(
        (item) =>
            item.title.toLowerCase().includes(q) ||
            item.color.toLowerCase().includes(q)
    );
}

function renderSearchSuggestions(box, items) {
    if (!box) return;
    box.innerHTML = "";
    if (!items.length) {
        box.style.display = "none";
        return;
    }
    box.style.display = "block";
    items.forEach((item) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "search-suggestions__item";
        btn.dataset.id = item.id;
        btn.innerHTML = `
            <img src="${item.img}" alt="${
            item.title
        }" class="search-suggestions__img" />
            <div class="search-suggestions__info">
                <span class="search-suggestions__title">${item.title}</span>
                <span class="search-suggestions__meta">${item.price}${
            item.color ? `  ${item.color}` : ""
        }</span>
            </div>
        `;
        box.appendChild(btn);
    });
}

function goToProduct(id) {
    if (!id) return;
    window.location.href = `card.html?id=${id}`;
}

function initHeaderInlineSearch() {
    const headerLinksLeft = document.querySelector(".header__links-left");
    if (!headerLinksLeft) return;

    const data = buildSearchData(products);
    if (!data.length) return;

    const inlineForm = document.createElement("form");
    inlineForm.className = "header__links-search-form-inline";

    const inlineInput = document.createElement("input");
    inlineInput.type = "search";
    inlineInput.name = "search";
    inlineInput.placeholder = "Search";
    inlineInput.className = "header__links-search-inline";
    inlineInput.autocomplete = "off";
    inlineInput.style.width = "0";
    inlineInput.style.transition = "width 0.25s ease";
    inlineInput.style.transformOrigin = "100% 50%";
    inlineForm.style.overflow = "visible";
    inlineForm.style.display = "flex";
    inlineForm.style.justifyContent = "flex-end";
    inlineForm.appendChild(inlineInput);

    const inlineBox = document.createElement("div");
    inlineBox.className = "search-suggestions search-suggestions--inline";
    inlineBox.style.display = "none";
    inlineForm.appendChild(inlineBox);

    const originalContent = headerLinksLeft.innerHTML;
    let isOpen = false;
    const WIDTH_ANIM = 250;
    let targetWidth = "";

    function closeInlineSearch() {
        if (!isOpen) return;
        isOpen = false;
        inlineBox.style.display = "none";
        inlineInput.style.width = "0";
        setTimeout(() => {
            headerLinksLeft.innerHTML = originalContent;
            targetWidth = "";
        }, WIDTH_ANIM);
    }

    inlineInput.addEventListener("input", () => {
        const items = filterSearch(data, inlineInput.value);
        renderSearchSuggestions(inlineBox, items);
    });

    inlineInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const items = filterSearch(data, inlineInput.value);
            if (items.length) {
                goToProduct(items[0].id);
            }
        }
        if (e.key === "Escape") {
            closeInlineSearch();
        }
    });

    inlineBox.addEventListener("click", (e) => {
        const btn = e.target.closest(".search-suggestions__item");
        if (!btn) return;
        goToProduct(btn.dataset.id);
    });

    headerLinksLeft.addEventListener("click", (e) => {
        if (isOpen) return;
        e.preventDefault();
        isOpen = true;
        headerLinksLeft.innerHTML = "";
        headerLinksLeft.appendChild(inlineForm);
        inlineInput.style.width = "0px";
        inlineInput.style.maxWidth = "100%";
        requestAnimationFrame(() => {
            inlineInput.style.width = "100%";
            inlineInput.focus();
        });
    });

    document.addEventListener(
        "click",
        (e) => {
            if (!headerLinksLeft.contains(e.target)) {
                closeInlineSearch();
            }
        },
        true
    );
}

function initMenuSearch() {
    const form = document.querySelector(".header__menu-search-form");
    const input = document.querySelector(".header__menu-search");
    if (!form || !input) return;

    form.setAttribute("autocomplete", "off");
    input.setAttribute("autocomplete", "off");

    const data = buildSearchData(products);
    if (!data.length) return;

    const box = document.createElement("div");
    box.className = "search-suggestions";
    box.style.display = "none";
    form.appendChild(box);

    form.addEventListener("submit", (e) => e.preventDefault());

    function update() {
        const items = filterSearch(data, input.value);
        renderSearchSuggestions(box, items);
    }

    input.addEventListener("input", update);

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const items = filterSearch(data, input.value);
            if (items.length) goToProduct(items[0].id);
        }
        if (e.key === "Escape") {
            box.style.display = "none";
            input.blur();
        }
    });

    box.addEventListener("click", (e) => {
        const btn = e.target.closest(".search-suggestions__item");
        if (!btn) return;
        goToProduct(btn.dataset.id);
    });
}

// ===================================================================
//                         Last viewed
// ===================================================================

const LAST_VIEWED_KEY = "lastViewedProducts";
const LAST_VIEWED_LIMIT = 4;
const lastViewedContainer = document.querySelector(".last-viewed__cards");

function getLastViewed() {
    try {
        const raw = localStorage.getItem(LAST_VIEWED_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function saveLastViewed(id) {
    if (!id) return;
    const current = getLastViewed().filter((item) => item !== id);
    current.unshift(id);
    const trimmed = current.slice(0, LAST_VIEWED_LIMIT);
    try {
        localStorage.setItem(LAST_VIEWED_KEY, JSON.stringify(trimmed));
    } catch (e) {
        /* ignore quota errors */
    }
}

function renderLastViewed() {
    const container = lastViewedContainer;
    if (!container) return;

    const viewedIds = getLastViewed();
    container.innerHTML = "";
    if (!viewedIds.length) return;

    viewedIds.forEach((id) => {
        const productData = findProductById(id);
        if (!productData) return;

        const link = document.createElement("a");
        link.href = `card.html?id=${productData.id}`;

        const card = document.createElement("div");
        card.className = "last-viewed__card";

        const img = document.createElement("img");
        img.src = (productData.images && productData.images[0]) || "";
        img.alt = productData.title || "";

        card.appendChild(img);
        link.appendChild(card);
        container.appendChild(link);
    });
}

function applyProduct(product) {
    if (!product) return;

    const breadcrumb = document.querySelector(".product__links p");
    const titleEl = document.querySelector(".title-h1");
    const priceEl = document.querySelector(".product__info-sell");
    const sizeEl = document.querySelector(
        ".product__info-properties p:nth-child(1) span"
    );
    const colorEl = document.querySelector(
        ".product__info-properties p:nth-child(2) span"
    );
    const descriptionEl = document.querySelector(
        '[data-tab-panel="description"] p'
    );
    const detailsEl = document.querySelector('[data-tab-panel="details"] p');
    const deliveryEl = document.querySelector('[data-tab-panel="delivery"] p');
    const swiperMainWrapper = document.querySelector(
        ".product__swiper .swiper-wrapper"
    );
    const swiperThumbWrapper = document.querySelector(
        ".product__swiper-2 .swiper-wrapper"
    );

    setTextContent(breadcrumb, product.title);
    setTextContent(titleEl, product.title);
    setTextContent(priceEl, product.price);
    setTextContent(sizeEl, product.size);
    setTextContent(colorEl, product.color);

    setTextContent(descriptionEl, product.description || "");
    setTextContent(detailsEl, product.details || "");
    setTextContent(deliveryEl, product.delivery || "");
    const mainImages =
        product.images && product.images.length
            ? product.images
            : ["/src/img/shop/helgum.png"];
    const thumbImages =
        (product.thumbs && product.thumbs.length && product.thumbs) ||
        mainImages;

    renderSlides(
        swiperMainWrapper,
        mainImages,
        "swiper-slide swiper-slide-big"
    );
    renderThumbs(
        swiperThumbWrapper,
        thumbImages,
        "swiper-slide swiper-slide-min"
    );
    saveLastViewed(product.id);
}

const productId = getProductIdFromURL();
const product = findProductById(productId);

applyProduct(product);
renderLastViewed();
initHeaderInlineSearch();
initMenuSearch();

// ===================================================================
//                          Cart logic
// ===================================================================

const CART_KEY = "cartItems";

function readCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function writeCart(list) {
    localStorage.setItem(CART_KEY, JSON.stringify(list));
}

function findProductInfo(id) {
    return products.find((p) => p.id === id) || null;
}

function calcCartCount(list) {
    return list.reduce((sum, item) => sum + (item.qty || 0), 0);
}

function updateCartCounters() {
    const list = readCart();
    const count = calcCartCount(list);
    document
        .querySelectorAll(".cart-count")
        .forEach((el) => (el.textContent = count));
}

function addToCart(productId, qty) {
    const list = readCart();
    const idx = list.findIndex((item) => item.id === productId);
    if (idx >= 0) {
        list[idx].qty += qty;
    } else {
        list.push({ id: productId, qty });
    }
    writeCart(list);
    updateCartCounters();
}

function updateCartItem(productId, qty) {
    const list = readCart();
    const idx = list.findIndex((item) => item.id === productId);
    if (idx >= 0) {
        list[idx].qty = qty;
        if (list[idx].qty <= 0) {
            list.splice(idx, 1);
        }
        writeCart(list);
        updateCartCounters();
    }
}

function removeCartItem(productId) {
    const list = readCart().filter((item) => item.id !== productId);
    writeCart(list);
    updateCartCounters();
}

function getPriceNumber(priceStr) {
    const num = parseFloat(
        (priceStr || "").replace(/[^\d.,-]/g, "").replace(",", ".")
    );
    return Number.isFinite(num) ? num : 0;
}

function renderCartPage() {
    const goodsContainer = document.querySelector(".cart__goods");
    const subtotalEl = document.querySelector(
        ".cart__order-purchase-right:nth-child(2)"
    );
    const totalEls = document.querySelectorAll(
        ".cart__order-purchase li.title-h3"
    );
    const totalEl = totalEls.length > 1 ? totalEls[1] : totalEls[0];
    if (!goodsContainer) return;

    const cart = readCart();
    goodsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item) => {
        const info = findProductInfo(item.id);
        if (!info) return;
        const priceNum = getPriceNumber(info.price);
        const itemTotal = priceNum * (item.qty || 1);
        subtotal += itemTotal;

        const good = document.createElement("div");
        good.className = "cart__good";

        const imgWrap = document.createElement("div");
        imgWrap.className = "cart__good-img";
        const img = document.createElement("img");
        img.src = info.images?.[0] || "";
        img.alt = info.title || "";
        imgWrap.appendChild(img);

        const wrapper = document.createElement("div");
        wrapper.className = "cart__good-wrapper";

        const infoBlock = document.createElement("div");
        infoBlock.className = "cart__good-info";
        const title = document.createElement("p");
        title.className = "title-h3 cart__good-info-title";
        title.textContent = info.title || "";
        const meta = document.createElement("p");
        meta.className = "cart__good-info-text";
        meta.textContent = `${info.size || ""}${
            info.color ? `, ${info.color}` : ""
        }`;
        infoBlock.appendChild(title);
        infoBlock.appendChild(meta);

        const right = document.createElement("div");
        right.className = "cart__good-right";

        const qtyBlock = document.createElement("div");
        qtyBlock.className = "product__info-add";
        const minus = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        minus.classList.add("icon-minus");
        const minusUse = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "use"
        );
        minusUse.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "href",
            "/src/icons/sprite.svg#minus"
        );
        minus.appendChild(minusUse);

        const qtyWrap = document.createElement("div");
        qtyWrap.className = "product__info-add-count";
        const qtySpan = document.createElement("span");
        qtySpan.className = "product__info-add-count-number";
        qtySpan.textContent = item.qty;
        qtyWrap.appendChild(qtySpan);

        const plus = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        plus.classList.add("icon-plus");
        const plusUse = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "use"
        );
        plusUse.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "href",
            "/src/icons/svg/plus.svg#plus"
        );
        plus.appendChild(plusUse);

        qtyBlock.appendChild(minus);
        qtyBlock.appendChild(qtyWrap);
        qtyBlock.appendChild(plus);

        const price = document.createElement("div");
        price.className = "cart__good-right-sell";
        price.textContent = info.price || "";

        right.appendChild(qtyBlock);
        right.appendChild(price);

        const cross = document.createElement("div");
        cross.className = "cart__good-cross";
        const crossSpan1 = document.createElement("span");
        const crossSpan2 = document.createElement("span");
        cross.appendChild(crossSpan1);
        cross.appendChild(crossSpan2);

        wrapper.appendChild(infoBlock);
        wrapper.appendChild(right);
        wrapper.appendChild(cross);

        good.appendChild(imgWrap);
        good.appendChild(wrapper);
        goodsContainer.appendChild(good);

        minus.addEventListener("click", () => {
            const newQty = Math.max(0, (item.qty || 1) - 1);
            if (newQty === 0) {
                removeCartItem(item.id);
            } else {
                updateCartItem(item.id, newQty);
            }
            renderCartPage();
        });

        plus.addEventListener("click", () => {
            const newQty = (item.qty || 1) + 1;
            updateCartItem(item.id, newQty);
            renderCartPage();
        });

        cross.addEventListener("click", () => {
            removeCartItem(item.id);
            renderCartPage();
        });
    });

    const formattedSubtotal = `€${subtotal.toFixed(2).replace(/\.00$/, "")}`;
    if (subtotalEl) subtotalEl.textContent = formattedSubtotal;
    if (totalEl) totalEl.textContent = formattedSubtotal;
}

function initProductPageCart() {
    const purchaseBlock = document.querySelector(".product__info-purchase");
    if (!purchaseBlock || !product) return;

    const qtyEl = purchaseBlock.querySelector(
        ".product__info-add-count-number"
    );
    const decBtn = purchaseBlock.querySelector(".icon-minus");
    const incBtn = purchaseBlock.querySelector(".icon-plus");
    const addToCartBtn = purchaseBlock.querySelector(
        ".product__info-purchase-btn"
    );

    const readNumber = (value) => {
        const num = parseInt(value, 10);
        return Number.isFinite(num) ? num : 0;
    };

    let qty = readNumber(qtyEl?.textContent) || 1;

    const renderQty = () => {
        if (qtyEl) qtyEl.textContent = qty;
    };

    renderQty();

    decBtn?.addEventListener("click", () => {
        if (qty > 1) {
            qty -= 1;
            renderQty();
        }
    });

    incBtn?.addEventListener("click", () => {
        qty += 1;
        renderQty();
    });

    addToCartBtn?.addEventListener("click", () => {
        addToCart(product.id, qty);
    });
}

updateCartCounters();
initProductPageCart();
renderCartPage();
