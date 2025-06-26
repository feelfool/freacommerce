// js/script.js

// --- DATA PRODUK (Simulasi dari Database/API) ---
const products = [
    {
        id: 1,
        name: "Kaos Polos Katun",
        price: 75000,
        image: "images/product1.jpg",
        description: "Kaos nyaman 100% katun, tersedia berbagai warna.",
        category: "Pakaian"
    },
    {
        id: 2,
        name: "Celana Jeans Slim Fit",
        price: 250000,
        image: "images/product2.jpg",
        description: "Celana jeans modern dengan potongan slim fit.",
        category: "Pakaian"
    },
    {
        id: 3,
        name: "Jaket Bomber Pria",
        price: 320000,
        image: "images/product3.jpg",
        description: "Jaket bomber stylish, cocok untuk cuaca dingin.",
        category: "Pakaian"
    },
    {
        id: 4,
        name: "Sepatu Sneakers Klasik",
        price: 450000,
        image: "images/product4.jpg",
        description: "Sepatu sneakers ikonik, nyaman untuk aktivitas harian.",
        category: "Aksesoris"
    },
    {
        id: 5,
        name: "Topi Baseball Casual",
        price: 50000,
        image: "images/product5.jpg",
        description: "Topi baseball dengan desain sederhana namun trendy.",
        category: "Aksesoris"
    },
    {
        id: 6,
        name: "Jam Tangan Chronograph",
        price: 800000,
        image: "images/product6.jpg",
        description: "Jam tangan presisi tinggi dengan fitur chronograph.",
        category: "Aksesoris"
    },
    {
        id: 7,
        name: "Hoodie Polos Fleece",
        price: 180000,
        image: "images/product7.jpg",
        description: "Hoodie hangat dan nyaman dari bahan fleece.",
        category: "Pakaian"
    }
];

// --- ELEMEN DOM YANG MUNGKIN ADA DI BERBAGAI HALAMAN ---
const productGrid = document.getElementById('product-grid'); // Untuk products.html
const cartItemCount = document.getElementById('cart-item-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const emptyCartMessage = document.getElementById('empty-cart-message');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const categoryFilterContainer = document.querySelector('.category-filter'); // Container tombol filter

// --- ELEMEN DOM BARU UNTUK CAROUSEL ---
const productCarouselSlide = document.getElementById('product-carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev-btn');
const nextBtn = document.querySelector('.carousel-btn.next-btn');
const carouselDotsContainer = document.getElementById('carousel-dots');


// --- VARIABEL KERANJANG (Disimpan di Local Storage) ---
let cart = JSON.parse(localStorage.getItem('ecommerceCart')) || [];


// --- FUNGSI PRODUK DAN KERANJANG ---

// 1. Render Produk ke Halaman (Digunakan untuk products.html)
function renderProducts(targetGridElement, productsToRender) {
    if (targetGridElement) {
        targetGridElement.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <button class="add-to-cart-btn" data-product-id="${product.id}">Tambah ke Keranjang</button>
            `;
            targetGridElement.appendChild(productCard);
        });

        targetGridElement.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }
}

// 2. Menambah Produk ke Keranjang
function addToCart(event) {
    const productId = parseInt(event.target.dataset.productId);
    const productToAdd = products.find(product => product.id === productId);

    if (productToAdd) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        updateCart();
        alert(`${productToAdd.name} telah ditambahkan ke keranjang!`);
    }
}

// 3. Memperbarui Tampilan Keranjang dan Local Storage
function updateCart() {
    localStorage.setItem('ecommerceCart', JSON.stringify(cart));
    renderCartItems();
    updateCartTotal();
    updateCartItemCount();
}

// 4. Render Item di Keranjang Belanja
function renderCartItems() {
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (checkoutBtn) checkoutBtn.disabled = true;
            if (clearCartBtn) clearCartBtn.disabled = true;
        } else {
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            if (checkoutBtn) checkoutBtn.disabled = false;
            if (clearCartBtn) clearCartBtn.disabled = false;

            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>Rp ${item.price.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" value="${item.quantity}" min="1" data-item-id="${item.id}" class="item-quantity">
                        <button class="remove-item-btn" data-item-id="${item.id}">Hapus</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            document.querySelectorAll('.item-quantity').forEach(input => {
                input.addEventListener('change', updateQuantity);
            });

            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', removeFromCart);
            });
        }
    }
}

// 5. Memperbarui Kuantitas Item di Keranjang
function updateQuantity(event) {
    const itemId = parseInt(event.target.dataset.itemId);
    const newQuantity = parseInt(event.target.value);

    const itemToUpdate = cart.find(item => item.id === itemId);
    if (itemToUpdate && newQuantity > 0) {
        itemToUpdate.quantity = newQuantity;
        updateCart();
    } else if (newQuantity <= 0) {
        removeFromCart({ target: { dataset: { itemId: itemId } } });
    }
}

// 6. Menghapus Item dari Keranjang
function removeFromCart(event) {
    const itemId = parseInt(event.target.dataset.itemId);
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// 7. Memperbarui Total Harga Keranjang
function updateCartTotal() {
    if (cartTotalElement) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

// 8. Memperbarui Jumlah Item di Ikon Keranjang (Header)
function updateCartItemCount() {
    if (cartItemCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = totalItems;
    }
}

// 9. Membersihkan Seluruh Keranjang
function clearCart() {
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang belanja?')) {
        cart = [];
        updateCart();
    }
}

// 10. Fungsi untuk Checkout (Simulasi)
function handleCheckout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Terima kasih telah berbelanja! Total pembayaran Anda adalah Rp ${total.toLocaleString('id-ID')}.\n(Ini adalah simulasi checkout.)`);
    cart = [];
    updateCart();
}

// --- Fungsionalitas KATEGORI ---
function filterProducts(event) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    event.target.classList.add('active');

    const selectedCategory = event.target.dataset.category;
    let productsToDisplay = [];

    if (selectedCategory === 'all') {
        productsToDisplay = products;
    } else {
        productsToDisplay = products.filter(product => product.category === selectedCategory);
    }
    renderProducts(productGrid, productsToDisplay);
}


// --- Fungsionalitas LOGIN / SIGNUP (Simulasi) ---
const authForm = document.querySelector('.auth-form');

if (authForm) {
    authForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();

        if (fileName === 'login.html') {
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            if (!emailInput || !passwordInput) {
                console.error("Elemen input email atau password tidak ditemukan di login.html");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            if (email === 'user@example.com' && password === 'password123') {
                alert('Login berhasil! Selamat datang.');
                window.location.href = 'index.html';
            } else {
                alert('Email atau password salah.');
            }

        } else if (fileName === 'signup.html') {
            const nameInput = document.getElementById('signup-name');
            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');
            const confirmPasswordInput = document.getElementById('signup-confirm-password');

            if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
                console.error("Satu atau lebih elemen input signup tidak ditemukan di signup.html");
                return;
            }

            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (password !== confirmPassword) {
                alert('Konfirmasi password tidak cocok!');
                return;
            }
            if (name && email && password) {
                alert(`Akun untuk ${name} berhasil dibuat! Silakan login.`);
                window.location.href = 'login.html';
            } else {
                alert('Semua kolom harus diisi.');
            }
        }
    });
}

// --- Fungsionalitas CAROUSEL ---
let currentSlide = 0;
let autoSlideInterval;
const slideIntervalTime = 5000; // Ganti setiap 5 detik

function renderCarouselItems() {
    if (productCarouselSlide) {
        productCarouselSlide.innerHTML = ''; // Bersihkan slide sebelum merender
        products.forEach((product, index) => { // Gunakan semua produk untuk carousel
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            carouselItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <button class="add-to-cart-btn" data-product-id="${product.id}">Tambah ke Keranjang</button>
            `;
            productCarouselSlide.appendChild(carouselItem);
        });

        // Tambahkan event listener ke tombol 'Tambah ke Keranjang' di carousel
        productCarouselSlide.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });

        // Inisialisasi dots
        renderCarouselDots();
        showSlide(currentSlide);
        startAutoSlide();
    }
}

function renderCarouselDots() {
    if (carouselDotsContainer) {
        carouselDotsContainer.innerHTML = '';
        for (let i = 0; i < products.length; i++) { // Jumlah dots sesuai jumlah produk
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slideIndex = i;
            dot.addEventListener('click', () => {
                showSlide(i);
                resetAutoSlide();
            });
            carouselDotsContainer.appendChild(dot);
        }
    }
}

function showSlide(index) {
    if (!productCarouselSlide || !carouselDotsContainer) return;

    if (index >= products.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = products.length - 1;
    } else {
        currentSlide = index;
    }

    const offset = -currentSlide * 100; // Pindahkan slide sebesar 100% dari lebar container
    productCarouselSlide.style.transform = `translateX(${offset}%)`;

    // Perbarui status active dot
    const dots = carouselDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startAutoSlide() {
    stopAutoSlide(); // Pastikan tidak ada interval ganda
    autoSlideInterval = setInterval(nextSlide, slideIntervalTime);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}


// --- Fungsionalitas HIDE ON SCROLL NAVBAR (BARU) ---
let lastScrollY = window.scrollY;
const header = document.querySelector('header');
// Ambil tinggi header setelah CSS dimuat dan elemen terbentuk
let headerHeight = 0;
if (header) {
    // Gunakan MutationObserver untuk mendeteksi perubahan tinggi header (misal, saat di mobile berubah layout)
    // Atau bisa juga hitung saat DOMContentLoaded
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === header) {
                headerHeight = entry.contentRect.height;
            }
        }
    });
    resizeObserver.observe(header);
}


if (header) {
    window.addEventListener('scroll', () => {
        // Hanya jalankan jika headerHeight sudah terdeteksi (tidak 0)
        if (headerHeight === 0) return;

        // Jika scroll ke bawah DAN posisi scroll sudah melewati tinggi header
        if (window.scrollY > lastScrollY && window.scrollY > headerHeight) {
            header.classList.add('hidden');
        } else {
            // Jika scroll ke atas, atau di bagian paling atas halaman (di bawah tinggi header)
            header.classList.remove('hidden');
        }
        lastScrollY = window.scrollY; // Update posisi scroll terakhir
    });
}


// --- EVENT LISTENERS GLOBAL ---
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
}
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
}
if (categoryFilterContainer) {
    categoryFilterContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-btn')) {
            filterProducts(event);
        }
    });
}
// Event listeners untuk tombol navigasi carousel
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
}
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
}


// --- INISIALISASI (Jalankan saat halaman dimuat) ---
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();

    if (fileName === 'products.html') {
        if (productGrid) {
            renderProducts(productGrid, products);
        }
    } else if (fileName === 'index.html' || fileName === '') {
        renderCarouselItems();
    } else if (fileName === 'cart.html') {
        renderCartItems(); // Pastikan cart items dirender di halaman cart.html
    }
    // Update keranjang dan hitungan item di header selalu dijalankan di semua halaman
    updateCart();
});