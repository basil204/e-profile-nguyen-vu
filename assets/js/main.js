// Tab functionality
document.querySelectorAll('.menu-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        // Xóa active khỏi tất cả nút
        document.querySelectorAll('.menu-btn').forEach(function (b) { b.classList.remove('active'); });
        // Ẩn tất cả tab
        document.querySelectorAll('.tab-content').forEach(function (tab) { tab.style.display = 'none'; });
        // Active nút này
        btn.classList.add('active');
        // Hiện tab tương ứng
        var tabId = btn.getAttribute('data-tab');
        var tab = document.getElementById(tabId);
        if (tab) tab.style.display = 'block';
        // Cuộn menu-btn vào giữa (sau khi xử lý tab)
        setTimeout(function () {
            scrollMenuBtnToCenter(btn);
        }, 80);
    });
});

function scrollMenuBtnToCenter(btn) {
    const menuBar = btn.closest('.menu-bar');
    if (!menuBar) return;
    const btnRect = btn.getBoundingClientRect();
    const barRect = menuBar.getBoundingClientRect();
    // Tính vị trí nút so với menu-bar
    const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
    const scrollTo = btnCenter - barRect.width / 2;
    menuBar.scrollTo({ left: scrollTo, behavior: 'smooth' });
}

// Smooth scroll handling for menu
window.addEventListener('scroll', function () {
    const menuBar = document.querySelector('.menu-bar');
    const scrollY = window.scrollY;

    // If scrolled past the initial position of menu-bar (adjust as needed)
    if (scrollY > 200) {
        // Add smooth transition for sticky effect
        menuBar.style.transition = 'top 0.3s ease';
    } else {
        // Remove transition when back at top
        menuBar.style.transition = 'none';
    }
});

// Script xử lý tabs năm
document.addEventListener('DOMContentLoaded', function () {
    // Script cho tabs chính
    const menuButtons = document.querySelectorAll('.menu-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    menuButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Xóa class active từ tất cả buttons
            menuButtons.forEach(btn => btn.classList.remove('active'));

            // Thêm class active vào button được click
            this.classList.add('active');

            // Ẩn tất cả tab content
            tabContents.forEach(tab => tab.style.display = 'none');

            // Hiển thị tab content được chọn
            const tabContent = document.getElementById(tabId);
            tabContent.style.display = 'block';

            // Cuộn đến phần tử đầu tiên trong tab-content (nếu có)
            // Ưu tiên cuộn đến phần tử con đầu tiên, nếu không thì cuộn đến chính tab-content
            let firstChild = tabContent.querySelector(':scope > *');
            let scrollTarget = firstChild || tabContent;
            const rect = scrollTarget.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // Trừ đi 40px để không bị che khuất
            const offset = rect.top + scrollTop - 40;
            window.scrollTo({ top: offset, behavior: 'smooth' });

            // Chỉ scroll nếu người dùng không ở gần menu-bar (ví dụ, đang ở cuối trang)
            const menuBar = document.querySelector('.menu-bar');
            if (menuBar) {
                const rect = menuBar.getBoundingClientRect();
                // Nếu menu-bar không nằm trong vùng nhìn thấy (trên hoặc dưới 40px so với viewport)
                if (rect.top < 0 || rect.top > 20) {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const offset = rect.top + scrollTop;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }
        });
    });

    // Script cho tabs năm
    const yearTabs = document.querySelectorAll('.year-tab');
    const companyCards = document.querySelectorAll('.company-card');
    const companyInfoContainer = document.querySelector('.company-info-container');
    let isAnimating = false;

    yearTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            if (isAnimating) return;
            isAnimating = true;
            // Hiệu ứng fade out
            companyInfoContainer.classList.remove('tab-fadein');
            companyInfoContainer.classList.add('tab-fadeout');
            setTimeout(() => {
                const year = this.getAttribute('data-year');
                // Xóa class active từ tất cả year tabs
                yearTabs.forEach(yearTab => yearTab.classList.remove('active'));
                // Thêm class active vào tab được click
                this.classList.add('active');
                // Ẩn tất cả company cards
                companyCards.forEach(card => card.style.display = 'none');
                // Hiển thị company cards tương ứng với năm được chọn
                document.querySelectorAll(`.company-card[data-year="${year}"]`).forEach(card => {
                    card.style.display = 'block';
                });
                // Hiệu ứng fade in
                companyInfoContainer.classList.remove('tab-fadeout');
                companyInfoContainer.classList.add('tab-fadein');
                setTimeout(() => { isAnimating = false; }, 400);
            }, 200);
        });
    });
    // Kích hoạt tab năm mặc định
    if (yearTabs.length > 0) {
        companyInfoContainer.classList.add('tab-fadein');
        yearTabs[0].click();
    }
});

// Preloader: load images progressively and update progress bar
document.addEventListener('DOMContentLoaded', function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    const bar = preloader.querySelector('.preloader-bar > span');
    const text = preloader.querySelector('.preloader-text');

    function collectCssBackgroundUrls() {
        const urls = [];
        try {
            for (const sheet of Array.from(document.styleSheets)) {
                let rules;
                try { rules = sheet.cssRules; } catch (e) { continue; }
                if (!rules) continue;
                for (const rule of Array.from(rules)) {
                    if (rule.style && rule.style.backgroundImage && rule.style.backgroundImage.includes('url(')) {
                        const match = rule.style.backgroundImage.match(/url\(("|\')?(.*?)("|\')?\)/);
                        if (match && match[2]) urls.push(match[2]);
                    }
                }
            }
        } catch (e) {}
        return urls;
    }

    function unique(list) {
        return Array.from(new Set(list));
    }

    const imgElements = Array.from(document.querySelectorAll('img'));
    const imgSrcs = imgElements.map(img => img.currentSrc || img.src).filter(Boolean);
    const cssBgSrcs = collectCssBackgroundUrls();
    const allSrcs = unique(imgSrcs.concat(cssBgSrcs));

    let loaded = 0;
    const total = allSrcs.length || 1;

    function updateProgress() {
        loaded = Math.min(loaded, total);
        const pct = Math.round((loaded / total) * 100);
        if (bar) bar.style.width = pct + '%';
        if (text) text.textContent = 'Đang tải ' + pct + '%';
    }

    function done() {
        preloader.classList.add('hidden');
        setTimeout(() => { preloader.remove(); }, 400);
    }

    if (total === 1) {
        updateProgress();
        done();
        return;
    }

    const timeout = setTimeout(done, 2500); // fail-safe to avoid blocking

    allSrcs.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = function () {
            loaded += 1;
            updateProgress();
            if (loaded >= total) {
                clearTimeout(timeout);
                done();
            }
        };
        // Respect current origin path
        img.decoding = 'async';
        try { img.loading = 'eager'; } catch (e) {}
        img.src = src;
        if (img.srcset) img.srcset = img.srcset; // no-op, placeholder for future
    });
});

// Tối ưu tải ảnh: đặt lazy-loading, decoding và fetchpriority phù hợp
document.addEventListener('DOMContentLoaded', function () {
    var viewport = window.innerHeight || document.documentElement.clientHeight;
    var images = Array.prototype.slice.call(document.querySelectorAll('img'));
    if (images.length === 0) return;

    // Xác định ảnh gần đỉnh viewport nhất (ứng viên LCP)
    var lcpCandidate = null;
    var bestTop = Infinity;
    images.forEach(function (img) {
        try {
            var rect = img.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < bestTop) {
                bestTop = rect.top;
                lcpCandidate = img;
            }
        } catch (e) {}
    });

    images.forEach(function (img) {
        try {
            var rect = img.getBoundingClientRect();
            var isActiveSlide = !!img.closest('.project-slide.active');
            var inView = rect.top < viewport * 0.9 && rect.bottom > 0;
            var isCritical = inView || isActiveSlide || img === lcpCandidate;

            if (isCritical) {
                img.setAttribute('loading', 'eager');
                img.setAttribute('decoding', 'sync');
                img.setAttribute('fetchpriority', img === lcpCandidate ? 'high' : 'auto');
            } else {
                if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
                img.setAttribute('decoding', 'async');
                if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
            }
        } catch (e) {}
    });
});
let currentSlide = 2;

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        const caption = slide.querySelector('.caption');
        if (caption) {
            caption.style.display = (i === index) ? 'block' : 'none';
        }
        if (dots[i]) {
            dots[i].classList.toggle('active', i === index);
        }
    });
}

// Hiển thị caption cho slide đầu tiên khi load
window.addEventListener('DOMContentLoaded', function () {
    goToSlide(0);
});

goToSlide(currentSlide);


// Vuốt để chuyển company-card cho .swipe-years với hiệu ứng mượt và chiều động
(function () {
    const swipe = document.querySelector('.swipe-years .company-info-container');
    const yearTabs = document.querySelectorAll('.year-tab');
    if (!swipe || yearTabs.length === 0) return;
    let startX = 0,
        isTouch = false,
        direction = 0;
    let animating = false;

    function animateCardChange(nextTab, dir) {
        if (animating) return;
        animating = true;
        if (dir === 'left') {
            swipe.classList.add('swipe-fadeout-left');
        } else {
            swipe.classList.add('swipe-fadeout-right');
        }
        setTimeout(() => {
            yearTabs.forEach(t => t.classList.remove('active'));
            nextTab.classList.add('active');
            const year = nextTab.getAttribute('data-year');
            document.querySelectorAll('.company-card').forEach(card => {
                card.style.display = card.getAttribute('data-year') === year ? '' : 'none';
            });
            swipe.classList.remove('swipe-fadeout-left');
            swipe.classList.remove('swipe-fadeout-right');
            if (dir === 'left') {
                swipe.classList.add('swipe-fadein-right');
            } else {
                swipe.classList.add('swipe-fadein-left');
            }
            setTimeout(() => {
                swipe.classList.remove('swipe-fadein-right');
                swipe.classList.remove('swipe-fadein-left');
                animating = false;
            }, 350);
        }, 180);
    }
    swipe.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        isTouch = true;
        startX = e.touches[0].clientX;
        direction = 0;
    });
    swipe.addEventListener('touchend', (e) => {
        isTouch = false;
    });
    swipe.addEventListener('touchmove', (e) => {
        if (!isTouch || animating) return;
        const moveX = e.touches[0].clientX;
        const diff = moveX - startX;
        if (Math.abs(diff) > 40) {
            const active = document.querySelector('.year-tab.active');
            let next, dir;
            if (diff < 0) {
                next = active.nextElementSibling;
                dir = 'left'; // vuốt trái qua phải, hiệu ứng từ phải vào
            } else {
                next = active.previousElementSibling;
                dir = 'right'; // vuốt phải qua trái, hiệu ứng từ trái vào
            }
            if (next && next.classList.contains('year-tab')) {
                animateCardChange(next, dir);
            }
            isTouch = false;
        }
    });
    // Click cũng chuyển company-card với hiệu ứng mặc định (fade ngang từ phải vào)
    yearTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            if (animating) return;
            // Xác định chiều hiệu ứng dựa vào vị trí tab
            const active = document.querySelector('.year-tab.active');
            let dir = 'left';
            if (active && active.compareDocumentPosition(this) & Node.DOCUMENT_POSITION_PRECEDING) {
                dir = 'right';
            }
            animateCardChange(this, dir);
        });
    });
    // Ẩn/hiện company-card ban đầu
    const active = document.querySelector('.year-tab.active');
    if (active) {
        const year = active.getAttribute('data-year');
        document.querySelectorAll('.company-card').forEach(card => {
            card.style.display = card.getAttribute('data-year') === year ? '' : 'none';
        });
    }
})();

document.querySelectorAll(".timeline details").forEach((det) => {
    det.addEventListener("toggle", function () {
        if (this.open) {
            document.querySelectorAll(".timeline details").forEach((other) => {
                if (other !== this) other.open = false;
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.certificate-slide');
    let current = 0;
    function showSlide(idx) {
        slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    }
    document.querySelector('.certificate-prev').onclick = function () {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    };
    document.querySelector('.certificate-next').onclick = function () {
        current = (current + 1) % slides.length;
        showSlide(current);
    };
    showSlide(current);
});

document.addEventListener('DOMContentLoaded', function () {
    // Modal xem ảnh lớn (dùng chung) + next/prev
    const modal = document.getElementById('project-img-modal');
    const modalImg = modal?.querySelector('#project-img-modal-img');
    const closeBtn = document.getElementById('project-img-modal-close');
    const nextBtn = document.getElementById('project-img-modal-next');
    const prevBtn = document.getElementById('project-img-modal-prev');

    let gallery = []; // danh sách URL ảnh hiện hành
    let galleryIndex = 0;

    function openModal(urls, startIndex) {
        gallery = urls || [];
        galleryIndex = Math.max(0, Math.min(startIndex || 0, gallery.length - 1));
        if (!modal || !modalImg) return;
        modalImg.src = gallery[galleryIndex] || '';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateNavVisibility();
    }
    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    function showNext(step) {
        if (!gallery.length) return;
        galleryIndex = (galleryIndex + step + gallery.length) % gallery.length;
        if (modalImg) modalImg.src = gallery[galleryIndex];
        updateNavVisibility();
    }
    function updateNavVisibility() {
        const hasMany = gallery.length > 1;
        if (nextBtn) nextBtn.style.display = hasMany ? 'flex' : 'none';
        if (prevBtn) prevBtn.style.display = hasMany ? 'flex' : 'none';
    }

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(1); });
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(-1); });
    document.addEventListener('keydown', (e) => {
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') showNext(1);
            if (e.key === 'ArrowLeft') showNext(-1);
        }
    });

    // Khởi tạo *mỗi* slider độc lập
    document.querySelectorAll('.project-slider').forEach((slider) => {
        const slides = Array.from(slider.querySelectorAll('.project-slide'));
        const prevBtn = slider.querySelector('.project-prev');
        const nextBtn = slider.querySelector('.project-next');
        let current = 0;

        function showSlide(idx) {
            current = (idx + slides.length) % slides.length;
            slides.forEach((s, i) => s.classList.toggle('active', i === current));
        }

        prevBtn?.addEventListener('click', () => showSlide(current - 1));
        nextBtn?.addEventListener('click', () => showSlide(current + 1));

        // Click ảnh để mở modal lớn, gom gallery theo slider hiện tại
        slides.forEach((s, idx) => {
            const img = s.querySelector('img');
            if (!img) return;
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                const urls = slides.map(sl => (sl.querySelector('img')?.src || ''));
                openModal(urls, idx);
            });
        });

        showSlide(0); // hiển thị slide đầu của slider này
    });
});


const DATA = {
    ketnoi: { title: "Kết nối", desc: "Xây dựng và mở rộng mạng lưới hợp tác, tạo ra giá trị chung cho khách hàng, đối tác và cộng đồng." },
    sangtao: { title: "Linh hoạt", desc: "Chủ động thích ứng với sự thay đổi của thị trường, tối ưu giải pháp cho từng nhu cầu cụ thể." },
    chuanmuc: { title: "Đồng hành", desc: "Cùng khách hàng phát triển bền vững, hỗ trợ toàn diện từ đầu tư, vận hành đến mở rộng kinh doanh." },
    hoptac: { title: "Hệ sinh thái", desc: "Cung cấp giải pháp bất động sản công nghiệp toàn diện, tích hợp dịch vụ hỗ trợ để gia tăng lợi ích cho khách hàng." },
    benvung: { title: "Bền vững", desc: "Cam kết phát triển dài hạn, chú trọng yếu tố xanh, thân thiện với môi trường và cộng đồng." }
};

// Extra load helpers: ensure active slider images are eagerly decoded when shown
document.addEventListener('DOMContentLoaded', function () {
    function eagerDecodeVisibleSlideImages() {
        document.querySelectorAll('.project-slide.active img, .certificate-slide.active img').forEach(img => {
            try {
                img.loading = 'eager';
                img.decoding = 'sync';
                if ('decode' in img) { img.decode().catch(() => {}); }
            } catch (e) {}
        });
    }
    eagerDecodeVisibleSlideImages();
    // Hook to next/prev buttons to decode next image early
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.project-prev, .project-next, .certificate-prev, .certificate-next');
        if (!btn) return;
        setTimeout(eagerDecodeVisibleSlideImages, 50);
    });

    // Prefetch images in upcoming slides on idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            document.querySelectorAll('.project-slide img, .certificate-slide img').forEach(img => {
                if (img.loading !== 'eager') {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.as = 'image';
                    link.href = img.currentSrc || img.src;
                    document.head.appendChild(link);
                }
            });
        }, { timeout: 2000 });
    }
});

const root = document.getElementById("core-values");
const tabs = root.querySelectorAll(".core-values-tab");
const content = document.getElementById("core-values-content");

function setActive(key) {
    tabs.forEach(btn => {
        const active = btn.dataset.key === key;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
        const label = btn.querySelector(".label");
        if (label) label.textContent = active ? DATA[key].title : label.textContent;
    });
    content.textContent = DATA[key].desc;
}

tabs.forEach(btn => {
    btn.addEventListener("click", () => setActive(btn.dataset.key));
    btn.addEventListener("keydown", (e) => {
        const list = Array.from(tabs);
        const i = list.indexOf(btn);
        if (e.key === "ArrowRight") { list[(i + 1) % list.length].focus(); }
        if (e.key === "ArrowLeft") { list[(i - 1 + list.length) % list.length].focus(); }
        if (e.key === "Enter" || e.key === " ") { setActive(btn.dataset.key); }
    });
});

  (function(){
    const scroller = document.querySelector('.skills-diagram');
    if(!scroller) return;

    let isDown = false, startX = 0, startLeft = 0;

    scroller.addEventListener('pointerdown', (e) => {
      isDown = true;
      scroller.setPointerCapture(e.pointerId);
      scroller.style.cursor = 'grabbing';
      startX = e.clientX;
      startLeft = scroller.scrollLeft;
    });

    scroller.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      scroller.scrollLeft = startLeft - dx;
    });

    ['pointerup','pointercancel','pointerleave'].forEach(ev=>{
      scroller.addEventListener(ev, () => {
        isDown = false;
        scroller.style.cursor = 'grab';
      });
    });
  })();

  (function(){
    const root = document.querySelector('.certificate-slider');
    if (!root) return;
  
    // ======= TÙY CHỌN =======
    const AUTOPLAY = true;
    const INTERVAL = 3000;   // ms
    const SWIPE_THRESHOLD = 30; // px (vuốt tối thiểu)
    const DRAG_THRESHOLD = 10; // px (ngưỡng kéo)
  
    // ======= PHẦN TỬ =======
    const slides = Array.from(root.querySelectorAll('.certificate-slide'));
    const prevBtn = root.querySelector('.certificate-prev');
    const nextBtn = root.querySelector('.certificate-next');
  
    if (slides.length === 0) return;
  
    // A11y cơ bản
    root.setAttribute('tabindex', '0');
    root.setAttribute('aria-roledescription', 'carousel');
  
    // ======= TRẠNG THÁI =======
    let current = 0;
    let timer = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let dragDistance = 0;
    let dragDirection = 0;
  
    // Khởi tạo slide đầu tiên
    slides[current].classList.add('active');
  
    function show(idx) {
      const n = slides.length;
      if (!n) return;
      
      // Tính index hợp lệ
      idx = (idx % n + n) % n;
      if (idx === current) return;
      
      // Ẩn slide hiện tại
      slides[current].classList.remove('active');
      
      // Hiện slide mới
      slides[idx].classList.add('active');
      current = idx;
      
      // Reset drag state
      isDragging = false;
      dragDistance = 0;
      dragDirection = 0;
    }
  
    function next() { show(current + 1); }
    function prev() { show(current - 1); }
  
    // ======= AUTOPLAY =======
    function startAutoplay() {
      if (!AUTOPLAY || timer) return;
      timer = setInterval(next, INTERVAL);
    }
    
    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  
    // ======= SỰ KIỆN NÚT =======
    prevBtn?.addEventListener('click', () => {
      stopAutoplay();
      prev();
      startAutoplay();
    });
    
    nextBtn?.addEventListener('click', () => {
      stopAutoplay();
      next();
      startAutoplay();
    });
  
    // ======= PAUSE KHI HOVER/FOCUS =======
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);
  
    // ======= PHÍM MŨI TÊN =======
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        stopAutoplay();
        next();
        startAutoplay();
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        stopAutoplay();
        prev();
        startAutoplay();
        e.preventDefault();
      }
    });
  
    // ======= VUỐT VÀ KÉO MOBILE =======
    function handleTouchStart(e) {
      const touch = e.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      currentX = startX;
      isDragging = true;
      dragDistance = 0;
      dragDirection = 0;
      
      stopAutoplay();
      
      // Thêm class để CSS có thể style
      root.classList.add('dragging');
    }
  
    function handleTouchMove(e) {
      if (!isDragging) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      // Tính khoảng cách kéo
      dragDistance = Math.abs(deltaX);
      dragDirection = deltaX > 0 ? 1 : -1;
      
      // Chỉ cho phép kéo ngang, không cho kéo dọc
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      
      // Cập nhật vị trí hiện tại
      currentX = touch.clientX;
      
      // Thêm hiệu ứng kéo (có thể thêm CSS transform)
      const activeSlide = slides[current];
      if (activeSlide) {
        const translateX = deltaX * 0.3; // Giảm độ di chuyển để tạo hiệu ứng
        activeSlide.style.transform = `translateX(${translateX}px)`;
        activeSlide.style.transition = 'none';
      }
      
      e.preventDefault();
    }
  
    function handleTouchEnd(e) {
      if (!isDragging) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      // Reset transform
      const activeSlide = slides[current];
      if (activeSlide) {
        activeSlide.style.transform = '';
        activeSlide.style.transition = 'transform 0.3s ease';
      }
      
      // Xử lý vuốt
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaY) < 60) {
        if (deltaX < 0) {
          // Vuốt trái -> next
          next();
        } else {
          // Vuốt phải -> prev
          prev();
        }
      }
      
      // Reset state
      isDragging = false;
      dragDistance = 0;
      dragDirection = 0;
      root.classList.remove('dragging');
      
      // Khởi động lại autoplay
      startAutoplay();
    }
  
    // ======= MOUSE DRAG (cho desktop) =======
    function handleMouseDown(e) {
      if (e.button !== 0) return; // Chỉ chuột trái
      
      startX = e.clientX;
      startY = e.clientY;
      currentX = startX;
      isDragging = true;
      dragDistance = 0;
      dragDirection = 0;
      
      stopAutoplay();
      root.classList.add('dragging');
      
      // Bắt sự kiện mouse
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  
    function handleMouseMove(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Tính khoảng cách kéo
      dragDistance = Math.abs(deltaX);
      dragDirection = deltaX > 0 ? 1 : -1;
      
      // Chỉ cho phép kéo ngang
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      
      // Cập nhật vị trí hiện tại
      currentX = e.clientX;
      
      // Thêm hiệu ứng kéo
      const activeSlide = slides[current];
      if (activeSlide) {
        const translateX = deltaX * 0.3;
        activeSlide.style.transform = `translateX(${translateX}px)`;
        activeSlide.style.transition = 'none';
      }
    }
  
    function handleMouseUp(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Reset transform
      const activeSlide = slides[current];
      if (activeSlide) {
        activeSlide.style.transform = '';
        activeSlide.style.transition = 'transform 0.3s ease';
      }
      
      // Xử lý kéo
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaY) < 60) {
        if (deltaX < 0) {
          next();
        } else {
          prev();
        }
      }
      
      // Reset state
      isDragging = false;
      dragDistance = 0;
      dragDirection = 0;
      root.classList.remove('dragging');
      
      // Bỏ event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Khởi động lại autoplay
      startAutoplay();
    }
  
    // ======= GẮN SỰ KIỆN =======
    // Touch events
    root.addEventListener('touchstart', handleTouchStart, { passive: false });
    root.addEventListener('touchmove', handleTouchMove, { passive: false });
    root.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse events
    root.addEventListener('mousedown', handleMouseDown);
    
    // Ngăn chọn text khi kéo
    root.addEventListener('selectstart', (e) => {
      if (isDragging) e.preventDefault();
    });
  
    // Khởi động
    startAutoplay();
  })();
  (function(){
    const scrollers = document.querySelectorAll('.activity-scroller');
    scrollers.forEach(s=>{
      let isDown=false, startX=0, scrollStart=0, moved=false;
      const THRESH = 5; // px
  
      s.addEventListener('pointerdown', (e)=>{
        if (e.button !== 0) return;      // chỉ chuột trái
        isDown = true; moved = false;
        s.setPointerCapture(e.pointerId);
        s.classList.add('dragging');
        startX = e.clientX;
        scrollStart = s.scrollLeft;
      });
  
      s.addEventListener('pointermove', (e)=>{
        if (!isDown) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > THRESH) moved = true;
        s.scrollLeft = scrollStart - dx;
      });
  
      const end = ()=>{ isDown=false; s.classList.remove('dragging'); };
      s.addEventListener('pointerup', end);
      s.addEventListener('pointercancel', end);
      s.addEventListener('pointerleave', end);
  
      // Ngăn click vào card sau khi kéo
      s.addEventListener('click', (e)=>{
        if (moved){ e.preventDefault(); e.stopPropagation(); }
      }, true);
  
      // Wheel ngang: giữ nguyên hành vi trackpad; với chuột “tilt wheel” thì thêm này
      s.addEventListener('wheel', (e)=>{
        // nếu người dùng cuộn dọc là chính thì bỏ qua
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
        e.preventDefault();
        s.scrollLeft += e.deltaX;
      }, {passive:false});
    });
  })();
  