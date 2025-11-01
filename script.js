// ===== PDF DATA (Simplified to one item, but ready for more) =====
const pdfData = [
    {
        id: 1,
        title: "Legs of steel(Featured)",
        description: "The foundational 12-week program designed to build core muscle mass and maximize raw power output.",
        category: "strength",
        pages: 45,
        size: "2.3 MB",
        url: "https://bit.ly/47Ropkr"
    }
    // Add more PDF objects here to see the list grow live
];

// ===== PARTICLE SYSTEM (Updated to #00d6d6) =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 40;
        
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < this.maxParticles; i++) {
            setTimeout(() => this.createParticle(), i * 150);
        }
        this.animate();
    }
    
    createParticle() {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 10,
            size: 2 + Math.random() * 3,
            speedY: -0.5 - Math.random() * 1.5,
            speedX: (Math.random() - 0.5) * 0.5,
            opacity: 0.6 + Math.random() * 0.4,
            life: 1
        };
        
        this.particles.push(particle);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.y += particle.speedY;
            particle.x += particle.speedX;
            particle.life -= 0.002;
            
            if (particle.life <= 0 || particle.y < -10) {
                this.particles.splice(index, 1);
                if (this.particles.length < this.maxParticles) {
                    this.createParticle();
                }
                return;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity * particle.life;
            this.ctx.fillStyle = '#00d6d6'; /* --- CYAN COLOR --- */
            this.ctx.shadowColor = '#00d6d6'; /* --- CYAN COLOR --- */
            this.ctx.shadowBlur = 15;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    new ParticleSystem();
    initNavigation();
    initWorkoutSection();
    initScrollEffects();
    initLoadingScreen();
});

// ===== NAVIGATION & HERO (Simplified, focus on scroll/parallax) =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

function initHero() {
    const heroSection = document.querySelector('.hero-section');
    const layers = document.querySelectorAll('.hero-bg-layer');
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            layers.forEach((layer, index) => {
                // Slower parallax movement
                const speed = (index + 1) * 5; 
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                
                // Adjust translation to be smaller
                layer.style.transform = `scale(1.01) translate(${x}px, ${y}px)`; 
            });
        });
    }
}

// ===== WORKOUT SECTION (Simplified for single PDF box) =====
function initWorkoutSection() {
    renderPDFCards(pdfData);
    setupSearch();
    setupFilters();
    setupDownloadAll();
}

function renderPDFCards(pdfs) {
    const grid = document.getElementById('pdfGrid');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (pdfs.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    pdfs.forEach((pdf, index) => {
        const card = createPDFCard(pdf);
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
        grid.appendChild(card);
    });
}

function createPDFCard(pdf) {
    const card = document.createElement('div');
    card.className = 'pdf-card';
    card.dataset.category = pdf.category;
    
    card.innerHTML = `
        <div class="pdf-icon">
            <i class="fas fa-file-pdf"></i>
        </div>
        <h3>${pdf.title}</h3>
        <p>${pdf.description}</p>
        <div class="pdf-meta">
            <span><i class="fas fa-tag"></i> ${getCategoryName(pdf.category)}</span>
            <span><i class="fas fa-file"></i> ${pdf.pages} pages</span>
        </div>
        <div class="pdf-meta">
            <span><i class="fas fa-hdd"></i> ${pdf.size}</span>
        </div>
        <button class="pdf-download-btn" onclick="downloadPDF('${pdf.url}', '${pdf.title}')">
            <i class="fas fa-download"></i> Download PDF
        </button>
    `;
    
    return card;
}

function getCategoryName(category) {
    const categories = {
        'strength': 'Strength Training',
        'cardio': 'Cardio',
        'nutrition': 'Nutrition',
        'bodyweight': 'Bodyweight',
        'flexibility': 'Flexibility'
    };
    return categories[category] || category;
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    if (!searchInput || !clearBtn) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
        
        const activeCategoryElement = document.querySelector('.filter-tags .active');
        const activeCategory = activeCategoryElement ? activeCategoryElement.dataset.category : 'all';
        
        filterPDFs(searchTerm, activeCategory);
    });
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        const activeCategoryElement = document.querySelector('.filter-tags .active');
        const activeCategory = activeCategoryElement ? activeCategoryElement.dataset.category : 'all';
        filterPDFs('', activeCategory);
    });
}

function setupFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            const category = tag.dataset.category;
            const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
            filterPDFs(searchTerm, category);
        });
    });
}

function filterPDFs(searchTerm, category) {
    let filtered = pdfData;
    
    if (category !== 'all') {
        filtered = filtered.filter(pdf => pdf.category === category);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(pdf => 
            pdf.title.toLowerCase().includes(searchTerm) ||
            pdf.description.toLowerCase().includes(searchTerm) ||
            getCategoryName(pdf.category).toLowerCase().includes(searchTerm)
        );
    }
    
    renderPDFCards(filtered);
}

function downloadPDF(url, title) {
    // In a live environment, this URL needs to be accessible
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Downloading: ${title}`);
}

function setupDownloadAll() {
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', () => {
            showNotification(`Starting download of ${pdfData.length} resource(s)...`);
            
            pdfData.forEach((pdf, index) => {
                setTimeout(() => {
                    downloadPDF(pdf.url, pdf.title);
                }, index * 600);
            });
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #00d6d6, #00a0a0);
        color: white;
        padding: 20px 35px;
        border-radius: 15px;
        box-shadow: 0 15px 40px rgba(0, 214, 214, 0.4);
        z-index: 100000;
        font-weight: 600;
        font-size: 15px;
        animation: slideInRight 0.4s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3500);
}

// ===== SCROLL EFFECTS & LOADING =====
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.pdf-card, .footer-column').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function initLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }, 800);
    });
}

// ===== CSS ANIMATIONS (Utility classes needed for notifications) =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(styleSheet);
