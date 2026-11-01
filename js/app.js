/* ======================================================== */
/* FABER TAMPUBOLON | KELB'S STUDIO - APP LOGIC             */
/* Inspired by ian.dunkerley.dev Signature Architecture     */
/* Three.js 3D WebGL, 3D Physics Tilt, Calculator & Reveal  */
/* ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Setup Navigation, Mobile Menu Drawer & Active ScrollSpy (Persis Bidan Ismiasih)
    setupNavigationAndScrollSpy();

    // 3. Native 3D Card Tilt Physics (data-tilt)
    initCard3DTilt();

    // 4. Scroll Reveal Observer
    initScrollReveal();

    // 5. Interactive Simulator: Naegele HPL Calculator
    initHplSimulator();

    // 6. Three.js Interactive 3D Canvas in Hero
    initHero3DCanvas();

    // 7. Interactive Cafe Menu Cart Simulator (Proyek 2)
    initCafeSimulator();

    // 8. Interactive Auto Detailing Estimator (Proyek 3)
    initAutoEstimator();

    // 9. Interactive WA-Router Demo (Proyek 4)
    initWaRouterDemo();
});

// ========================================================
// 1. NAVIGATION & ACTIVE SCROLLSPY (PERSIS BIDAN ISMIASIH)
// ========================================================
function setupNavigationAndScrollSpy() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('#mobileMenu a.mobile-nav-link-soft');
    const desktopLinks = document.querySelectorAll('header nav a.nav-link-soft');

    // 1. Toggle Mobile Menu Drawer
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6 text-white"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6 text-white"></i>';
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (mobileBtn) {
                    mobileBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6 text-white"></i>';
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
                
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    setActiveNavLink(href.substring(1));
                }
            });
        });
    }

    // 2. Klik Link Desktop: Langsung update highlight tombol seketika
    desktopLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                setActiveNavLink(href.substring(1));
            }
        });
    });

    // 3. Scroll Listener dengan requestAnimationFrame untuk performa mulus
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateScrollSpy();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Inisialisasi awal saat halaman dibuka
    updateScrollSpy();
}

/**
 * Mengubah status tombol navigasi menjadi aktif (berwarna Soft 3D)
 */
function setActiveNavLink(targetId) {
    if (!targetId) return;

    // Desktop Navbar links
    const desktopLinks = document.querySelectorAll('header nav a.nav-link-soft');
    desktopLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${targetId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile Drawer links
    const mobileLinks = document.querySelectorAll('#mobileMenu a.mobile-nav-link-soft');
    mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${targetId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Mendeteksi bagian halaman yang sedang berada dalam pandangan mata (viewport)
 */
function updateScrollSpy() {
    const scrollPos = window.scrollY + 140; // Toleransi posisi scroll terhadap header sticky
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    // Jika pengguna sudah berada di paling bawah (Kontak / Footer)
    if (window.scrollY + windowHeight >= fullHeight - 80) {
        setActiveNavLink('kontak');
        return;
    }

    // Pemetaan ID section ke tombol nav aktif (Urutan dari bawah ke atas)
    const sectionIds = ['kontak', 'faq', 'tentang', 'layanan', 'karya', 'beranda'];
    for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
            const top = el.offsetTop;
            if (scrollPos >= top) {
                setActiveNavLink(id);
                return;
            }
        }
    }

    // Default aktif ke beranda jika di posisi atas
    setActiveNavLink('beranda');
}

// ========================================================
// 3D CARD TILT PHYSICS (data-tilt)
// ========================================================
function initCard3DTilt() {
    // Disable 3D tilt physics on touch devices (mobile/tablet) to prevent scroll interference
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        let glare = card.querySelector('.card-glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'card-glare';
            card.appendChild(glare);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
            
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`;
            glare.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            glare.style.opacity = '0';
        });
    });
}

// ========================================================
// SCROLL REVEAL OBSERVER
// ========================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ========================================================
// THREE.JS INTERACTIVE 3D CANVAS & HOLOGRAM IN HERO
// ========================================================
function initHero3DCanvas() {
    const container = document.getElementById('hero3dContainer');
    const logoWrapper = document.getElementById('hologramLogoWrapper');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '1';
    renderer.domElement.style.pointerEvents = 'none';
    container.insertBefore(renderer.domElement, container.firstChild);

    // Cyber Dust Particles (Twinkling cosmic field behind hologram)
    const particlesCount = 85;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 6;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.045,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse Tracking with smooth lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouseX = (e.clientX - windowHalfX) / windowHalfX;
        mouseY = (e.clientY - windowHalfY) / windowHalfY;
    });

    // Touch support for smartphones & iPads
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;
            mouseX = (e.touches[0].clientX - windowHalfX) / windowHalfX;
            mouseY = (e.touches[0].clientY - windowHalfY) / windowHalfY;
        }
    }, { passive: true });

    function handleResize() {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    let clock = 0;
    function animate() {
        requestAnimationFrame(animate);
        clock += 0.02;

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Rotate Cosmic Dust Particles
        particles.rotation.y -= 0.001;
        particles.rotation.x += 0.0008;

        // Interactive 3D Parallax Tilt for the Central Hologram Emblem
        if (logoWrapper) {
            const floatY = Math.sin(clock) * 9; // Gentle sinusoidal levitation
            const tiltY = targetX * 18;         // -18deg to +18deg yaw
            const tiltX = -targetY * 18;        // -18deg to +18deg pitch
            logoWrapper.style.transform = `perspective(1000px) translateY(${floatY.toFixed(1)}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
        }

        renderer.render(scene, camera);
    }
    animate();
}

// Copy to Clipboard with Toast Notification
function copyContact(text, label) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label} berhasil disalin!`);
        }).catch(() => fallbackCopy(text, label));
    } else {
        fallbackCopy(text, label);
    }
}

function fallbackCopy(text, label) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        showToast(`${label} berhasil disalin!`);
    } catch (e) {
        showToast(`Gagal menyalin ${label}`);
    }
    document.body.removeChild(tempInput);
}

function showToast(message) {
    let toast = document.getElementById('portfolioToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'portfolioToast';
        toast.className = 'fixed bottom-6 right-6 z-50 bg-[#0a001b] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold border border-blue-500/40 transition-all duration-300';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span><span>${message}</span>`;
    toast.style.display = 'flex';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3200);
}

// ----------------------------------------------------
// Interactive Naegele Calculator (Flagship Demo Widget)
// ----------------------------------------------------
function initHplSimulator() {
    const inputHpht = document.getElementById('simHpht');
    const btnHitung = document.getElementById('simBtnHitung');
    if (!inputHpht || !btnHitung) return;

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 60);
    inputHpht.value = defaultDate.toISOString().split('T')[0];

    btnHitung.addEventListener('click', calculateHpl);
    inputHpht.addEventListener('change', calculateHpl);

    calculateHpl();
}

function calculateHpl() {
    const inputHpht = document.getElementById('simHpht');
    const resultBox = document.getElementById('simResult');
    const hplDateEl = document.getElementById('simHplDate');
    const gestasiEl = document.getElementById('simGestasi');
    const trimesterEl = document.getElementById('simTrimester');

    if (!inputHpht || !inputHpht.value) return;

    const hpht = new Date(inputHpht.value);
    if (isNaN(hpht.getTime())) return;

    const hpl = new Date(hpht.getTime() + (280 * 24 * 60 * 60 * 1000));

    const today = new Date();
    const diffTime = today - hpht;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        if (hplDateEl) hplDateEl.innerText = "Tanggal belum terjadi";
        if (gestasiEl) gestasiEl.innerText = "-";
        if (trimesterEl) trimesterEl.innerText = "Periksa tanggal HPHT";
        return;
    }

    const weeks = Math.floor(diffDays / 7);
    const extraDays = diffDays % 7;

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedHpl = hpl.toLocaleDateString('id-ID', options);

    if (hplDateEl) hplDateEl.innerText = formattedHpl;
    if (gestasiEl) gestasiEl.innerText = `${weeks} Minggu ${extraDays} Hari (${diffDays} hari)`;

    let trimText = "Trimester 1 (0 - 13 Minggu)";
    let trimBadgeClass = "text-blue-700 bg-blue-50 border-blue-200";
    if (weeks >= 14 && weeks <= 27) {
        trimText = "Trimester 2 (14 - 27 Minggu)";
        trimBadgeClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
    } else if (weeks >= 28 && weeks <= 36) {
        trimText = "Trimester 3 (28 - 36 Minggu)";
        trimBadgeClass = "text-amber-800 bg-amber-50 border-amber-200";
    } else if (weeks >= 37 && weeks <= 42) {
        trimText = "Cukup Bulan / Siap Bersalin (37 - 42 Minggu)";
        trimBadgeClass = "text-rose-700 bg-rose-50 border-rose-200";
    } else if (weeks > 42) {
        trimText = "Lewat Waktu (Post-term > 42 Minggu)";
        trimBadgeClass = "text-red-700 bg-red-50 border-red-200";
    }

    if (trimesterEl) {
        trimesterEl.innerText = trimText;
        trimesterEl.className = `px-2.5 py-1 rounded-full text-[11px] font-mono border font-medium ${trimBadgeClass}`;
    }

    if (resultBox) {
        resultBox.classList.remove('hidden');
    }
}

// ----------------------------------------------------
// Interactive Cafe Simulator (Proyek 2: Selaras Coffee)
// ----------------------------------------------------
function initCafeSimulator() {
    const cafeItems = document.querySelectorAll('.cafe-item-cb');
    const cafeTableInput = document.getElementById('cafeTableInput');
    const cafeTotalEl = document.getElementById('cafeTotalDisplay');
    const cafeBtnOrder = document.getElementById('cafeBtnOrder');

    if (!cafeItems.length || !cafeTotalEl || !cafeBtnOrder) return;

    function updateCafeOrder() {
        let total = 0;
        let selectedList = [];

        cafeItems.forEach(cb => {
            if (cb.checked) {
                const price = parseInt(cb.getAttribute('data-price') || '0', 10);
                const name = cb.getAttribute('data-name') || 'Item';
                total += price;
                selectedList.push(name);
            }
        });

        // Format Rupiah
        cafeTotalEl.innerText = 'Rp ' + total.toLocaleString('id-ID');

        // Update WA link
        const tableNum = (cafeTableInput && cafeTableInput.value.trim()) ? cafeTableInput.value.trim() : '04 (Bar)';
        const waNumber = '6282160641174';

        if (selectedList.length === 0) {
            cafeBtnOrder.setAttribute('href', `https://wa.me/${waNumber}?text=Halo%20Selaras%20Coffee,%20saya%20ingin%20melihat%20menu%20dan%20order`);
        } else {
            const itemsText = selectedList.join(', ');
            const message = `Halo Selaras Coffee, saya mau pesan [Meja: ${tableNum}]:\n- ${itemsText}\nTotal: Rp ${total.toLocaleString('id-ID')}`;
            cafeBtnOrder.setAttribute('href', `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`);
        }
    }

    cafeItems.forEach(cb => cb.addEventListener('change', updateCafeOrder));
    if (cafeTableInput) {
        cafeTableInput.addEventListener('input', updateCafeOrder);
    }

    updateCafeOrder();
}

// ----------------------------------------------------
// Interactive Auto Estimator (Proyek 3: Prima Auto Detailing)
// ----------------------------------------------------
const AUTO_TIERS = {
    small: {
        title: "City Car / Small Hatchback",
        examples: "Honda Brio, Toyota Yaris, Mazda 2, Suzuki Swift",
        price: "Rp 1.800.000",
        duration: "1 - 2 Hari Kerja",
        warranty: "2 Tahun Garansi Kilau",
        features: [
            "3-Stage Paint Correction & Swirl Mark Removal",
            "Nano Ceramic Coating 9H (2 Layer Body)",
            "Interior Detailing & AC Ozone Sterilization",
            "Glass Water Repellent Coating (Anti Jamur)"
        ],
        waText: "Halo Prima Detailing, saya mau konsultasi & booking slot Nano Ceramic untuk City Car (Kategori Small)."
    },
    medium: {
        title: "Medium Sedan & Compact SUV",
        examples: "Honda HR-V, Civic, CR-V, Toyota Corolla Cross, Mazda CX-5",
        price: "Rp 2.400.000",
        duration: "2 Hari Kerja",
        warranty: "3 Tahun Garansi Kilau",
        features: [
            "3-Stage Deep Paint Correction & Gloss Restoration",
            "Nano Ceramic Coating 9H (3 Layer Body & Trim)",
            "Full Engine Bay Dressing & Protection",
            "Interior Leather Deep Clean & UV Protectant",
            "Full Windshield & Glass Hydrophobic Coating"
        ],
        waText: "Halo Prima Detailing, saya mau konsultasi & booking slot Nano Ceramic untuk Medium SUV/Sedan (Kategori Medium)."
    },
    large: {
        title: "Large SUV, Luxury & Premium MPV",
        examples: "Toyota Fortuner, Pajero Sport, Alphard, Land Cruiser, Palisade",
        price: "Rp 3.200.000",
        duration: "3 Hari Kerja",
        warranty: "3 Tahun Garansi Kilau + Free 1x Maintenance",
        features: [
            "Heavy Cut 4-Stage Multi-Step Paint Correction",
            "Graphene & Nano Ceramic 10H Hybrid Coating",
            "Full Velg, Caliper & Undercarriage Wash Dressing",
            "Interior Antibacterial Ozone Fogging + Leather Coating",
            "Semua Kaca Nano Glass Guard Hydrophobic 100%"
        ],
        waText: "Halo Prima Detailing, saya mau konsultasi & booking slot Nano Ceramic untuk Big SUV / Luxury MPV (Kategori Large)."
    }
};

function initAutoEstimator() {
    const tierButtons = document.querySelectorAll('.auto-tier-btn');
    const titleEl = document.getElementById('autoTierTitle');
    const examplesEl = document.getElementById('autoTierExamples');
    const priceEl = document.getElementById('autoTierPrice');
    const durationEl = document.getElementById('autoTierDuration');
    const warrantyEl = document.getElementById('autoTierWarranty');
    const featureListEl = document.getElementById('autoTierFeatures');
    const waBtn = document.getElementById('autoTierWaBtn');

    if (!tierButtons.length || !priceEl) return;

    function selectTier(tierKey) {
        const data = AUTO_TIERS[tierKey] || AUTO_TIERS.medium;

        // Button styles
        tierButtons.forEach(btn => {
            const btnKey = btn.getAttribute('data-tier');
            if (btnKey === tierKey) {
                btn.className = 'auto-tier-btn flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all bg-blue-600 text-white shadow-md shadow-blue-500/20';
            } else {
                btn.className = 'auto-tier-btn flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all bg-white text-slate-700 border border-slate-200 hover:border-blue-400';
            }
        });

        // Content update
        if (titleEl) titleEl.innerText = data.title;
        if (examplesEl) examplesEl.innerText = data.examples;
        if (priceEl) priceEl.innerText = data.price;
        if (durationEl) durationEl.innerText = data.duration;
        if (warrantyEl) warrantyEl.innerText = data.warranty;

        if (featureListEl) {
            featureListEl.innerHTML = data.features.map(f => `
                <li class="flex items-center gap-2">
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-blue-600 shrink-0"></i>
                    <span>${f}</span>
                </li>
            `).join('');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        if (waBtn) {
            const waNumber = '6282160641174';
            waBtn.setAttribute('href', `https://wa.me/${waNumber}?text=${encodeURIComponent(data.waText)}`);
        }
    }

    tierButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tierKey = btn.getAttribute('data-tier');
            selectTier(tierKey);
        });
    });

    // Default Medium
    selectTier('medium');
}

// ----------------------------------------------------
// Interactive WA-Router Demo (Proyek 4: Kelb's WA-Router.js)
// ----------------------------------------------------
function initWaRouterDemo() {
    const demoForm = document.getElementById('waRouterDemoForm');
    const previewEl = document.getElementById('waRouterPreviewUrl');

    if (!demoForm) return;

    function updatePreview() {
        const name = (document.getElementById('waRouterInputName')?.value || 'Budi Santoso').trim();
        const service = document.getElementById('waRouterInputService')?.value || 'Website Profil Bisnis & UMKM';
        const notes = (document.getElementById('waRouterInputNotes')?.value || 'Ada konsep referensi').trim();

        const message = `Halo Faber (Kelb's Studio)!\nSaya: ${name}\nIngin pesan: ${service}\nCatatan: ${notes}\n(Terkirim via Kelb's WA-Router.js)`;
        const encoded = encodeURIComponent(message);
        const fullUrl = `https://wa.me/6282160641174?text=${encoded}`;

        if (previewEl) {
            previewEl.innerText = `wa.me/6282160641174?text=${encoded.substring(0, 38)}...`;
        }

        return fullUrl;
    }

    demoForm.addEventListener('input', updatePreview);

    demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = updatePreview();
        showToast("Membuka WhatsApp via WA-Router...");
        window.open(url, '_blank');
    });

    updatePreview();
}


