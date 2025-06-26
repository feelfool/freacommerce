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
const productGrid = document.getElementById('product-grid');
const cartItemCount = document.getElementById('cart-item-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const emptyCartMessage = document.getElementById('empty-cart-message');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const categoryFilterContainer = document.querySelector('.category-filter');

// ELEMEN DOM UNTUK CAROUSEL (Hanya di index.html)
const productCarouselSlide = document.getElementById('product-carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev-btn');
const nextBtn = document.querySelector('.carousel-btn.next-btn');
const carouselDotsContainer = document.getElementById('carousel-dots');

// ELEMEN DOM UNTUK FORM AUTENTIKASI (login.html, signup.html)
const authForm = document.querySelector('.auth-form');

// ELEMEN DOM UNTUK MENU TOGGLE
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');


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
    renderCartItems(); // Akan berjalan hanya jika cartItemsContainer ada di halaman
    updateCartTotal(); // Akan berjalan hanya jika cartTotalElement ada di halaman
    updateCartItemCount();
}

// 4. Render Item di Keranjang Belanja (Hanya untuk cart.html)
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
    if (itemToUpdate) {
        if (newQuantity > 0) {
            itemToUpdate.quantity = newQuantity;
        } else {
            // Jika kuantitas 0 atau kurang, hapus item
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
    if (cartTotalElement) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

// 8. Memperbarui Jumlah Item di Ikon Keranjang (Header - selalu aktif)
function updateCartItemCount() {
    if (cartItemCount) {
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
    // Pastikan event.target adalah tombol dengan kelas 'filter-btn'
    if (!event.target.classList.contains('filter-btn')) {
        return;
    }

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
// Blok ini akan dijalankan hanya jika authForm elemen ditemukan di halaman
if (authForm) {
    authForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();

        if (fileName === 'login.html') {
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            // Cek apakah elemen input ditemukan sebelum mengakses value
            if (!emailInput || !passwordInput) {
                console.error("Elemen input email atau password tidak ditemukan di login.html");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            // Simulasi login
            if (email === 'user@example.com' && password === 'password123') {
                alert('Login berhasil! Selamat datang.');
                window.location.href = 'index.html'; // Redirect ke halaman beranda
            } else {
                alert('Email atau password salah.');
            }

        } else if (fileName === 'signup.html') {
            const nameInput = document.getElementById('signup-name');
            const emailInput = document.getElementById('signup-email');
            const passwordInput = document.getElementById('signup-password');
            const confirmPasswordInput = document.getElementById('signup-confirm-password');

            // Cek apakah elemen input ditemukan
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
            if (name && email && password) { // Cek input tidak kosong
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
const slideIntervalTime = 5000; // Ganti interval slide (5 detik)

function renderCarouselItems() {
    if (!productCarouselSlide || products.length === 0) return; // Pastikan elemen dan data produk ada

    productCarouselSlide.innerHTML = '';
    products.forEach((product, index) => {
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

    // Tambahkan event listener untuk tombol "Tambah ke Keranjang" di carousel
    productCarouselSlide.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    renderCarouselDots();
    showSlide(currentSlide);
    startAutoSlide(); // Mulai auto-slide setelah rendering
}

function renderCarouselDots() {
    if (!carouselDotsContainer || products.length === 0) return; // Pastikan elemen dan data produk ada

    carouselDotsContainer.innerHTML = '';
    for (let i = 0; i < products.length; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.slideIndex = i; // Untuk identifikasi dot
        dot.addEventListener('click', () => {
            showSlide(i);
            resetAutoSlide(); // Reset auto-slide saat dot diklik
        });
        carouselDotsContainer.appendChild(dot);
    }
}

function showSlide(index) {
    if (!productCarouselSlide || !carouselDotsContainer || products.length === 0) return;

    if (index >= products.length) {
        currentSlide = 0; // Kembali ke slide pertama jika sudah di akhir
    } else if (index < 0) {
        currentSlide = products.length - 1; // Kembali ke slide terakhir jika sudah di awal
    } else {
        currentSlide = index;
    }

    const offset = -currentSlide * 100; // Hitung offset untuk transformasi
    productCarouselSlide.style.transform = `translateX(${offset}%)`;

    // Perbarui status dot aktif
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
    stopAutoSlide(); // Pastikan tidak ada interval sebelumnya yang berjalan
    autoSlideInterval = setInterval(nextSlide, slideIntervalTime);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}


// --- Fungsionalitas MENU TOGGLE ---
if (menuToggle && mainNav) { // Pastikan kedua elemen ditemukan sebelum menambahkan event listener
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active'); // Menambahkan atau menghapus kelas 'active'
        // Ubah ikon hamburger menjadi 'X' dan sebaliknya
        if (mainNav.classList.contains('active')) {
            menuToggle.querySelector('i').classList.replace('fa-bars', 'fa-times');
        } else {
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    });

    // Tutup menu saat link navigasi diklik (opsional, tapi disarankan untuk UX mobile)
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Hanya tutup jika menu aktif dan di tampilan mobile
            if (mainNav.classList.contains('active') && window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });
}


// --- INISIALISASI (Jalankan saat DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();

    // Ini dipanggil di semua halaman untuk memperbarui jumlah item di keranjang header
    updateCartItemCount();

    // Inisialisasi spesifik untuk halaman index.html
    if (fileName === 'index.html' || fileName === '') {
        renderCarouselItems();
        // Hanya tambahkan event listener jika tombol ada
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
    // Inisialisasi spesifik untuk halaman products.html
    else if (fileName === 'products.html') {
        if (productGrid) {
            renderProducts(productGrid, products);
        }
        if (categoryFilterContainer) {
            categoryFilterContainer.addEventListener('click', filterProducts); // Event listener untuk filter kategori
        }
    }
    // Inisialisasi spesifik untuk halaman cart.html
    else if (fileName === 'cart.html') {
        renderCartItems(); // Memanggil renderCartItems untuk menampilkan isi keranjang
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', handleCheckout);
        }
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
    }

    // Panggil updateCart setelah semua inisialisasi awal selesai,
    // ini memastikan data keranjang dimuat dan tampilan diperbarui
    updateCart();
});