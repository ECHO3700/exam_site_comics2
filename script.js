// ========== ДАННЫЕ ==========
const products = [
    { id: 1, title: "Spider-Verse #1", publisher: "Marvel", price: 790, stock: 15, dateAdded: "2025-04-10", coverIcon: "fa-spider" },
    { id: 2, title: "Batman: Nightfall", publisher: "DC", price: 950, stock: 8, dateAdded: "2025-05-01", coverIcon: "fa-mask" },
    { id: 3, title: "Saga Vol.1", publisher: "Image", price: 650, stock: 22, dateAdded: "2025-03-15", coverIcon: "fa-rocket" },
    { id: 4, title: "X-Men: Evolution", publisher: "Marvel", price: 820, stock: 5, dateAdded: "2025-05-20", coverIcon: "fa-dna" },
    { id: 5, title: "Watchmen", publisher: "DC", price: 1100, stock: 3, dateAdded: "2025-01-30", coverIcon: "fa-clock" },
    { id: 6, title: "Invincible #10", publisher: "Image", price: 700, stock: 12, dateAdded: "2025-06-01", coverIcon: "fa-fist-raised" },
    { id: 7, title: "Daredevil: Red", publisher: "Marvel", price: 880, stock: 9, dateAdded: "2025-02-14", coverIcon: "fa-eye" },
    { id: 8, title: "Flashpoint", publisher: "DC", price: 990, stock: 7, dateAdded: "2025-04-22", coverIcon: "fa-bolt" }
];

// Функция определения — английское название или нет
function isEnglishTitle(title) {
    const firstChar = title.trim().charAt(0);
    return /[A-Za-z]/.test(firstChar);
}

// Сортировка: английские названия в конце
function sortEnglishLast(productsArray, baseSortedArray) {
    const englishItems = baseSortedArray.filter(p => isEnglishTitle(p.title));
    const otherItems = baseSortedArray.filter(p => !isEnglishTitle(p.title));
    return [...otherItems, ...englishItems];
}

// Пользователи (демо)
const users = {
    "user1": { password: "1234", balance: 5000, name: "Питер Паркер" },
    "admin": { password: "1234", balance: 9999, name: "Админ" }
};

// ========== СОСТОЯНИЕ ==========
let currentUser = null;
let cart = [];
let currentSort = "price-asc";
let filterPublisher = "all";
let filterMaxPrice = 2000;

// ========== DOM ЭЛЕМЕНТЫ ==========
const productsContainer = document.getElementById("productsContainer");
const cartButton = document.getElementById("cartButton");
const cartCounter = document.getElementById("cartCounter");
const cartModal = document.getElementById("cartModal");
const closeCartModal = document.getElementById("closeCartModal");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotal = document.getElementById("cartTotal");
const checkoutOrderBtn = document.getElementById("checkoutOrderBtn");
const loginModal = document.getElementById("loginModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const loginLogoutBtn = document.getElementById("loginLogoutBtn");
const performLoginBtn = document.getElementById("performLoginBtn");
const loginInput = document.getElementById("loginInput");
const passwordInput = document.getElementById("passwordInput");
const usernameDisplay = document.getElementById("usernameDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");
const userInfoDisplay = document.getElementById("userInfoDisplay");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const publisherFilter = document.getElementById("publisherFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const sortButtons = document.querySelectorAll(".sort-options button");
const adminJsonBtn = document.getElementById("adminJsonBtn");
const jsonModal = document.getElementById("jsonModal");
const closeJsonModal = document.getElementById("closeJsonModal");
const jsonContent = document.getElementById("jsonContent");

// ========== ФУНКЦИИ ==========

function updateUserUI() {
    if (currentUser) {
        usernameDisplay.textContent = currentUser.name;
        balanceDisplay.textContent = `${currentUser.balance} ₽`;
        loginLogoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        loginLogoutBtn.title = "Выйти";
        if (currentUser.login === "admin") {
            adminJsonBtn.style.display = "inline-block";
        } else {
            adminJsonBtn.style.display = "none";
        }
    } else {
        usernameDisplay.textContent = "Гость";
        balanceDisplay.textContent = "0 ₽";
        loginLogoutBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
        loginLogoutBtn.title = "Войти";
        adminJsonBtn.style.display = "none";
    }
}

function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
}

function getProductById(id) {
    return products.find(p => p.id === id);
}

function getFilteredAndSortedProducts() {
    let filtered = [...products];

    if (filterPublisher !== "all") {
        filtered = filtered.filter(p => p.publisher === filterPublisher);
    }
    filtered = filtered.filter(p => p.price <= filterMaxPrice);

    switch (currentSort) {
        case "price-asc":
            filtered.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            filtered.sort((a, b) => b.price - a.price);
            break;
        case "date-desc":
            filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case "date-asc":
            filtered.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            break;
        case "stock-desc":
            filtered.sort((a, b) => b.stock - a.stock);
            break;
        case "eng-last":
            filtered.sort((a, b) => a.price - b.price);
            filtered = sortEnglishLast(products, filtered);
            break;
        default:
            break;
    }
    return filtered;
}

function renderCatalog() {
    const items = getFilteredAndSortedProducts();
    productsContainer.innerHTML = "";
    if (items.length === 0) {
        productsContainer.innerHTML = "<p style='color:#94a3b8;'>Товары не найдены. Измените фильтры.</p>";
        return;
    }
    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-cover"><i class="fas ${product.coverIcon}"></i></div>
            <div class="product-title">${product.title}</div>
            <div class="product-meta">
                <span>${product.publisher}</span>
                <span><i class="far fa-calendar-alt"></i> ${product.dateAdded}</span>
            </div>
            <div class="product-meta">
                <span>В наличии: ${product.stock} шт.</span>
            </div>
            <div class="product-price">${product.price} ₽</div>
            <button class="add-to-cart-btn" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> В корзину
            </button>
        `;
        productsContainer.appendChild(card);
    });
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const productId = parseInt(e.currentTarget.getAttribute("data-id"));
            addToCart(productId);
        });
    });
}

function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert("Недостаточно товара на складе!");
            return;
        }
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }
    updateCartCounter();
    alert(`${product.title} добавлен в корзину!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartCounter();
    renderCartModal();
}

function renderCartModal() {
    cartItemsList.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
        cartItemsList.innerHTML = "<p>Корзина пуста.</p>";
        cartTotal.textContent = "Итого: 0 ₽";
        return;
    }
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (!product) return;
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span><strong>${product.title}</strong> (${item.quantity} шт.)</span>
            <span>${itemTotal} ₽</span>
            <button data-id="${product.id}"><i class="fas fa-trash"></i></button>
        `;
        cartItemsList.appendChild(div);
    });
    cartTotal.textContent = `Итого: ${total} ₽`;
    document.querySelectorAll(".cart-item button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.getAttribute("data-id"));
            removeFromCart(id);
        });
    });
}

function checkout() {
    if (!currentUser) {
        alert("Пожалуйста, войдите в систему для оформления заказа!");
        cartModal.classList.remove("active");
        loginModal.classList.add("active");
        return;
    }
    if (cart.length === 0) {
        alert("Корзина пуста!");
        return;
    }
    let total = 0;
    for (const item of cart) {
        const product = getProductById(item.productId);
        if (!product || item.quantity > product.stock) {
            alert(`Товар "${product?.title || 'Неизвестный'}" недоступен в нужном количестве.`);
            return;
        }
        total += product.price * item.quantity;
    }
    if (currentUser.balance < total) {
        alert(`Недостаточно средств! Не хватает ${total - currentUser.balance} ₽.`);
        return;
    }
    currentUser.balance -= total;
    for (const item of cart) {
        const product = getProductById(item.productId);
        product.stock -= item.quantity;
    }
    alert(`Заказ оформлен на сумму ${total} ₽. Спасибо за покупку!`);
    cart = [];
    updateCartCounter();
    updateUserUI();
    renderCatalog();
    renderCartModal();
    cartModal.classList.remove("active");
}

function generateAdminJSON() {
    const report = {
        generatedAt: new Date().toISOString(),
        totalProducts: products.length,
        totalStock: products.reduce((sum, p) => sum + p.stock, 0),
        productsList: products.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            stock: p.stock,
            publisher: p.publisher
        })),
        users: Object.keys(users).map(login => ({
            login: login,
            balance: users[login].balance,
            name: users[login].name
        })),
        cartSnapshot: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            productTitle: getProductById(item.productId)?.title
        }))
    };
    jsonContent.textContent = JSON.stringify(report, null, 2);
    jsonModal.classList.add("active");
}

// ========== ОБРАБОТЧИКИ ==========

sortButtons.forEach(btn => {
    btn.addEventListener("click", function() {
        sortButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentSort = this.getAttribute("data-sort");
        renderCatalog();
    });
});

applyFiltersBtn.addEventListener("click", () => {
    filterPublisher = publisherFilter.value;
    filterMaxPrice = parseInt(maxPriceFilter.value) || 2000;
    renderCatalog();
});

cartButton.addEventListener("click", () => {
    renderCartModal();
    cartModal.classList.add("active");
});

closeCartModal.addEventListener("click", () => {
    cartModal.classList.remove("active");
});
cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.classList.remove("active");
});

checkoutOrderBtn.addEventListener("click", checkout);

loginLogoutBtn.addEventListener("click", () => {
    if (currentUser) {
        currentUser = null;
        cart = [];
        updateCartCounter();
        updateUserUI();
        renderCatalog();
        alert("Вы вышли из системы.");
    } else {
        loginModal.classList.add("active");
    }
});

closeLoginModal.addEventListener("click", () => {
    loginModal.classList.remove("active");
});
loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.classList.remove("active");
});

performLoginBtn.addEventListener("click", () => {
    const login = loginInput.value.trim();
    const password = passwordInput.value;
    if (users[login] && users[login].password === password) {
        currentUser = {
            login: login,
            name: users[login].name,
            balance: users[login].balance
        };
        updateUserUI();
        loginModal.classList.remove("active");
        loginInput.value = "";
        passwordInput.value = "";
        alert(`Добро пожаловать, ${currentUser.name}!`);
        if (currentUser.login === "admin") {
            alert("Вы вошли как администратор. Доступна кнопка JSON отчёта.");
        }
    } else {
        alert("Неверный логин или пароль!");
    }
});

if (adminJsonBtn) {
    adminJsonBtn.addEventListener("click", generateAdminJSON);
}
if (closeJsonModal) {
    closeJsonModal.addEventListener("click", () => {
        jsonModal.classList.remove("active");
    });
    jsonModal.addEventListener("click", (e) => {
        if (e.target === jsonModal) jsonModal.classList.remove("active");
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        cartModal.classList.remove("active");
        loginModal.classList.remove("active");
        if (jsonModal) jsonModal.classList.remove("active");
    }
});

// ========== ИНИЦИАЛИЗАЦИЯ ==========
updateUserUI();
updateCartCounter();
renderCatalog();
