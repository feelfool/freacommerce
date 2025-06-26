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
// Deklarasi global, akan diisi null jika elemen tidak ada di halaman saat ini,
// tapi akan dicek sebelum digunakan.
const productGrid = document.getElementById('product-grid'); // Untuk products.html
const cartItemCount = document.getElementById('cart-item-count'); // Untuk header di semua halaman
const cartItemsContainer = document.getElementById('cart-items'); // Untuk cart.html
const cartTotalElement = document.getElementById('cart-total'); // Untuk cart.html
const emptyCartMessage = document.getElementById('empty-cart-message'); // Untuk cart.html
const checkoutBtn = document.getElementById('checkout-btn'); // Untuk cart.html
const clearCartBtn = document.getElementById('clear-cart-btn'); // Untuk cart.html
const categoryFilterContainer = document.querySelector('.category-filter'); // Untuk products.html

// ELEMEN DOM UNTUK CAROUSEL (Hanya di index.html)
const productCarouselSlide = document.getElementById('product-carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev-btn');
const nextBtn = document.querySelector('.carousel-btn.next-btn');
const carouselDotsContainer = document.getElementById('carousel-dots');

// ELEMEN DOM UNTUK FORM AUTENTIKASI (login.html, signup.html)
const authForm = document.querySelector('.auth-form');


// --- VARIABEL KERANJANG (Disimpan di Local Storage) ---
let cart = JSON.parse(localStorage.getItem('ecommerceCart')) || [];


// --- FUNGSI PRODUK DAN KERANJANG ---

// 1. Render Produk ke Halaman (Digunakan untuk products.html)
function renderProducts(targetGridElement, productsToRender) {
    if (targetGridElement) { // Pastikan elemen grid ada
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

        // Add event listeners for 'add to cart' buttons *after* rendering
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
    renderCartItems(); // Render item di halaman keranjang (jika di halaman itu)
    updateCartTotal(); // Update total harga (jika di halaman keranjang)
    updateCartItemCount(); // Update ikon keranjang di header (selalu)
}

// 4. Render Item di Keranjang Belanja (Hanya untuk cart.html)
function renderCartItems() {
    if (cartItemsContainer) { // Pastikan ini hanya berjalan jika ada elemen cartItemsContainer
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

            // Add event listeners for quantity and remove buttons
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
    if (itemToUpdate) { // Hanya update jika item ditemukan
        if (newQuantity > 0) {
            itemToUpdate.quantity = newQuantity;
        } else { // Jika kuantitas 0 atau kurang, hapus item
            removeFromCart({ target: { dataset: { itemId: itemId } } });
        }
        updateCart();
    }
}

// 6. Menghapus Item dari Keranjang
function removeFromCart(event) {
    const itemId = parseInt(event.target.dataset.itemId);
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// 7. Memperbarui Total Harga Keranjang (Hanya untuk cart.html)
function updateCartTotal() {
    if (cartTotalElement) { // Pastikan elemen total ada
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

// 8. Memperbarui Jumlah Item di Ikon Keranjang (Header - selalu aktif)
function updateCartItemCount() {
    if (cartItemCount) { // Pastikan elemen ikon keranjang ada
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = totalItems;
    }
}

// 9. Membersihkan Seluruh Keranjang (Hanya untuk cart.html)
function clearCart() {
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang belanja?')) {
        cart = [];
        updateCart();
    }
}

// 10. Fungsi untuk Checkout (Simulasi - Hanya untuk cart.html)
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

// --- Fungsionalitas KATEGORI (Hanya untuk products.html) ---
function filterProducts(event) {
    // Hapus kelas 'active' dari semua tombol filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Tambahkan kelas 'active' ke tombol yang diklik
    event.target.classList.add('active');

    const selectedCategory = event.target.dataset.category;
    let productsToDisplay = [];

    if (selectedCategory === 'all') {
        productsToDisplay = products;
    } else {
        productsToDisplay = products.filter(product => product.category === selectedCategory);
    }
    renderProducts(productGrid, productsToDisplay); // Render ulang produk
}


// --- Fungsionalitas LOGIN / SIGNUP (Simulasi) ---
// authForm sudah dideklarasikan di scope global.
if (authForm) { // Hanya tambahkan event listener jika form ada di halaman
    authForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Mencegah form submit secara default

        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();

        if (fileName === 'login.html') {
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            // Pastikan elemen input ada sebelum mengakses valuenya
            if (!emailInput || !passwordInput) {
                console.error("Elemen input email atau password tidak ditemukan di login.html");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            // Simulasi Login
            if (email === 'user@example.com' && password === 'password123') {
                alert('Login berhasil! Selamat datang.');
                window.location.href = 'index.html'; // Redirect ke halaman utama
            } else {
                alert('Email atau password salah.');
            }

        } else if (fileName === 'signup.html') {
            const nameInput = document.getElementById('signup-name');
            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');
            const confirmPasswordInput = document.getElementById('signup-confirm-password');

            // Pastikan elemen input ada sebelum mengakses valuenya
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
            if (name && email && password) { // Cek basic input validation
                alert(`Akun untuk ${name} berhasil dibuat! Silakan login.`);
                window.location.href = 'login.html'; // Redirect ke halaman login
            } else {
                alert('Semua kolom harus diisi.');
            }
        }
    });
}

// --- Fungsionalitas CAROUSEL (Hanya untuk index.html) ---
let currentSlide = 0;
let autoSlideInterval;
const slideIntervalTime = 5000; // Ganti setiap 5 detik

function renderCarouselItems() {
    if (productCarouselSlide) { // Pastikan elemen carousel ada
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
    if (carouselDotsContainer) { // Pastikan container dots ada
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
    if (!productCarouselSlide || !carouselDotsContainer) return; // Keluar jika elemen tidak ada

    if (index >= products.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = products.length - 1;
    } else {
        currentSlide = index;
    }

    const offset = -currentSlide * 100;
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


// --- Fungsionalitas HIDE ON SCROLL NAVBAR (Aktif di semua halaman) ---
let lastScrollY = window.scrollY;
const header = document.querySelector('header'); // Header harus ada di semua halaman
let headerHeight = 0; // Inisialisasi

if (header) { // Pastikan elemen header ada
    // Gunakan ResizeObserver untuk mendapatkan tinggi header secara dinamis
    // Ini sangat penting karena tinggi header bisa berubah (misal: di mobile nav-nya wrap)
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === header) {
                headerHeight = entry.contentRect.height;
                // console.log("Header height detected:", headerHeight); // Debug
            }
        }
    });
    resizeObserver.observe(header);

    window.addEventListener('scroll', () => {
        // Hanya jalankan jika headerHeight sudah terdeteksi (tidak 0)
        if (headerHeight === 0) return;

        // console.log("Scroll Y:", window.scrollY, "Last Scroll Y:", lastScrollY, "Header Height:", headerHeight); // Debug: Aktifkan untuk debugging

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


// --- INISIALISASI (Jalankan saat DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    // Mendapatkan nama file terakhir dari path URL
    // Contoh: "/ecommerce/index.html" -> "index.html"
    // Contoh: "/ecommerce/" atau "/" -> "" (untuk root index.html)
    const fileName = currentPath.split('/').pop();

    // Selalu update hitungan item di ikon keranjang di header
    updateCartItemCount();

    // Logika spesifik untuk halaman `index.html` (Homepage)
    if (fileName === 'index.html' || fileName === '') {
        renderCarouselItems(); // Render carousel dan pasang event listeners add-to-cart
        // Event listeners untuk tombol navigasi carousel hanya di halaman index.html
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
    }
    // Logika spesifik untuk halaman `products.html`
    else if (fileName === 'products.html') {
        if (productGrid) { // Pastikan elemen product grid ada
            renderProducts(productGrid, products); // Render semua produk awal
        }
        // Tambahkan event listener untuk tombol filter kategori HANYA jika container ada
        if (categoryFilterContainer) {
            categoryFilterContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('filter-btn')) {
                    filterProducts(event);
                }
            });
        }
    }
    // Logika spesifik untuk halaman `cart.html`
    else if (fileName === 'cart.html') {
        renderCartItems(); // Render item di keranjang
        if (checkoutBtn) { // Pastikan tombol checkout ada
            checkoutBtn.addEventListener('click', handleCheckout);
        }
        if (clearCartBtn) { // Pastikan tombol clear cart ada
            clearCartBtn.addEventListener('click', clearCart);
        }
    }

    // PENTING: `updateCart()` dipanggil di akhir DOMContentLoaded
    // untuk memastikan semua data keranjang diinisialisasi dengan benar di semua halaman.
    updateCart();
});