/* =========================
   UTILITIES
========================= */
function scrollMenuBtnToCenter(btn) {
    const menuBar = btn.closest('.menu-bar');
    if (!menuBar) return;
    const barRect = menuBar.getBoundingClientRect();
    const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
    const scrollTo = btnCenter - barRect.width / 2;
    menuBar.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }
  
  /* =========================
     STICKY MENU TRANSITION
  ========================= */
  window.addEventListener('scroll', () => {
    const menuBar = document.querySelector('.menu-bar');
    if (!menuBar) return;
    menuBar.style.transition = (window.scrollY > 200) ? 'top 0.3s ease' : 'none';
  });
  
  /* =========================
     ONE-TIME DOM READY
  ========================= */
  document.addEventListener('DOMContentLoaded', () => {
    /* ---------- TABS CHÍNH (.menu-btn / .tab-content) ---------- */
    const menuButtons = document.querySelectorAll('.menu-btn');
    const tabContents = document.querySelectorAll('.tab-content');
  
    function activateMainTab(btn) {
      const tabId = btn.getAttribute('data-tab');
      const tab = document.getElementById(tabId);
      // nút
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // nội dung
      tabContents.forEach(t => (t.style.display = 'none'));
      if (tab) tab.style.display = 'block';
      // cuộn đến phần đầu tab (trừ 40px)
      const firstChild = tab?.querySelector(':scope > *');
      const target = firstChild || tab;
      if (target) {
        const rect = target.getBoundingClientRect();
        const top = (window.pageYOffset || document.documentElement.scrollTop) + rect.top - 40;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // cuộn thanh menu-btn vào giữa
      setTimeout(() => scrollMenuBtnToCenter(btn), 80);
      // nếu menu-bar ngoài màn, cuộn nó về tầm nhìn
      const menuBar = document.querySelector('.menu-bar');
      if (menuBar) {
        const r = menuBar.getBoundingClientRect();
        if (r.top < 0 || r.top > 20) {
          const top = (window.pageYOffset || document.documentElement.scrollTop) + r.top;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  
    menuButtons.forEach(btn => {
      btn.addEventListener('click', () => activateMainTab(btn));
    });
  
    /* ---------- TABS NĂM + FADE + SWIPE (.year-tab / .company-card) ---------- */
    const yearTabs = document.querySelectorAll('.year-tab');
    const companyCards = document.querySelectorAll('.company-card');
    const companyInfoContainer = document.querySelector('.company-info-container');
    let isAnimating = false;
  
    function showYear(year, direction = 'left') {
      if (!companyInfoContainer) return;
      if (isAnimating) return;
      isAnimating = true;
  
      companyInfoContainer.classList.remove('tab-fadein', 'tab-fadeout', 'swipe-fadeout-left', 'swipe-fadeout-right', 'swipe-fadein-left', 'swipe-fadein-right');
      companyInfoContainer.classList.add(direction === 'left' ? 'swipe-fadeout-left' : 'swipe-fadeout-right');
  
      setTimeout(() => {
        yearTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-year') === year));
        companyCards.forEach(card => {
          card.style.display = (card.getAttribute('data-year') === year) ? 'block' : 'none';
        });
        companyInfoContainer.classList.remove('swipe-fadeout-left', 'swipe-fadeout-right');
        companyInfoContainer.classList.add(direction === 'left' ? 'swipe-fadein-right' : 'swipe-fadein-left');
        setTimeout(() => {
          companyInfoContainer.classList.remove('swipe-fadein-right', 'swipe-fadein-left');
          isAnimating = false;
        }, 350);
      }, 180);
    }
  
    yearTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const active = document.querySelector('.year-tab.active');
        const dir = (active && (active.compareDocumentPosition(tab) & Node.DOCUMENT_POSITION_PRECEDING)) ? 'right' : 'left';
        showYear(tab.getAttribute('data-year'), dir);
      });
    });
  
    // Swipe ngang cho .swipe-years .company-info-container
    (function () {
      const swipeRoot = document.querySelector('.swipe-years .company-info-container');
      if (!swipeRoot || !yearTabs.length) return;
      let startX = 0, isTouch = false;
  
      function nextOf(active) { return active?.nextElementSibling?.classList?.contains('year-tab') ? active.nextElementSibling : null; }
      function prevOf(active) { return active?.previousElementSibling?.classList?.contains('year-tab') ? active.previousElementSibling : null; }
  
      swipeRoot.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        isTouch = true;
        startX = e.touches[0].clientX;
      }, { passive: true });
  
      swipeRoot.addEventListener('touchmove', (e) => {
        if (!isTouch || isAnimating) return;
        const diff = e.touches[0].clientX - startX;
        if (Math.abs(diff) > 40) {
          const active = document.querySelector('.year-tab.active');
          if (diff < 0) {
            const nx = nextOf(active);
            if (nx) showYear(nx.getAttribute('data-year'), 'left');
          } else {
            const pv = prevOf(active);
            if (pv) showYear(pv.getAttribute('data-year'), 'right');
          }
          isTouch = false;
        }
      }, { passive: true });
  
      swipeRoot.addEventListener('touchend', () => { isTouch = false; }, { passive: true });
  
      // Ẩn/hiện ban đầu theo tab active
      const active = document.querySelector('.year-tab.active') || yearTabs[0];
      if (active) {
        active.classList.add('active');
        const y = active.getAttribute('data-year');
        companyCards.forEach(card => {
          card.style.display = (card.getAttribute('data-year') === y) ? 'block' : 'none';
        });
        companyInfoContainer?.classList.add('tab-fadein');
      }
    })();
  
    /* ---------- PRELOADER (ảnh nền + <img>) ---------- */
    (function () {
      const preloader = document.getElementById('preloader');
      if (!preloader) return;
      const bar = preloader.querySelector('.preloader-bar > span');
      const text = preloader.querySelector('.preloader-text');
  
      function collectCssBackgroundUrls() {
        const urls = [];
        try {
          for (const sheet of Array.from(document.styleSheets)) {
            let rules; try { rules = sheet.cssRules; } catch { continue; }
            if (!rules) continue;
            for (const rule of Array.from(rules)) {
              if (rule.style && rule.style.backgroundImage && rule.style.backgroundImage.includes('url(')) {
                const m = rule.style.backgroundImage.match(/url\(("|')?(.*?)\1?\)/);
                if (m && m[2]) urls.push(m[2]);
              }
            }
          }
        } catch { }
        return urls;
      }
  
      const unique = arr => Array.from(new Set(arr));
      const imgSrcs = Array.from(document.querySelectorAll('img')).map(i => i.currentSrc || i.src).filter(Boolean);
      const cssSrcs = collectCssBackgroundUrls();
      const all = unique(imgSrcs.concat(cssSrcs));
  
      let loaded = 0, total = all.length || 1;
  
      function update() {
        const pct = Math.round((Math.min(loaded, total) / total) * 100);
        if (bar) bar.style.width = pct + '%';
        if (text) text.textContent = 'Đang tải ' + pct + '%';
      }
      function done() {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 400);
      }
      if (total === 1) { update(); done(); return; }
  
      const timeout = setTimeout(done, 2500);
      all.forEach(src => {
        const im = new Image();
        im.onload = im.onerror = () => {
          loaded += 1; update();
          if (loaded >= total) { clearTimeout(timeout); done(); }
        };
        im.decoding = 'async';
        try { im.loading = 'eager'; } catch {}
        im.src = src;
      });
    })();
  
    /* ---------- TỐI ƯU TẢI ẢNH LCP / SLIDE ACTIVE ---------- */
    (function () {
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      const images = Array.from(document.querySelectorAll('img'));
      if (!images.length) return;
  
      let lcp = null, bestTop = Infinity;
      images.forEach(img => {
        try {
          const r = img.getBoundingClientRect();
          if (r.top >= 0 && r.top < bestTop) { bestTop = r.top; lcp = img; }
        } catch {}
      });
  
      images.forEach(img => {
        try {
          const r = img.getBoundingClientRect();
          const isActiveSlide = !!img.closest('.project-slide.active, .certificate-slide.active');
          const inView = r.top < viewport * 0.9 && r.bottom > 0;
          const isCritical = inView || isActiveSlide || img === lcp;
  
          if (isCritical) {
            img.setAttribute('loading', 'eager');
            img.setAttribute('decoding', 'sync');
            img.setAttribute('fetchpriority', img === lcp ? 'high' : 'auto');
          } else {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
            if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
          }
        } catch {}
      });
    })();
  
    /* ---------- MODAL ẢNH LỚN + NEXT/PREV (dùng chung) ---------- */
    (function () {
      const modal = document.getElementById('project-img-modal');
      const modalImg = modal?.querySelector('#project-img-modal-img');
      const closeBtn = document.getElementById('project-img-modal-close');
      const nextBtn = document.getElementById('project-img-modal-next');
      const prevBtn = document.getElementById('project-img-modal-prev');
  
      let gallery = [], idx = 0;
  
      function updateNav() {
        const many = gallery.length > 1;
        if (nextBtn) nextBtn.style.display = many ? 'flex' : 'none';
        if (prevBtn) prevBtn.style.display = many ? 'flex' : 'none';
      }
      function open(urls, start = 0) {
        gallery = urls || [];
        idx = Math.max(0, Math.min(start, gallery.length - 1));
        if (!modal || !modalImg) return;
        modalImg.src = gallery[idx] || '';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateNav();
      }
      function close() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
      function move(step) {
        if (!gallery.length) return;
        idx = (idx + step + gallery.length) % gallery.length;
        if (modalImg) modalImg.src = gallery[idx];
        updateNav();
      }
  
      closeBtn?.addEventListener('click', close);
      modal?.addEventListener('click', e => { if (e.target === modal) close(); });
      nextBtn?.addEventListener('click', e => { e.stopPropagation(); move(1); });
      prevBtn?.addEventListener('click', e => { e.stopPropagation(); move(-1); });
      document.addEventListener('keydown', e => {
        if (!modal || modal.style.display !== 'flex') return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') move(1);
        if (e.key === 'ArrowLeft') move(-1);
      });
  
      // Khởi tạo từng .project-slider độc lập + click ảnh mở modal (kèm hiệu ứng trượt)
      document.querySelectorAll('.project-slider').forEach(slider => {
        const slides = Array.from(slider.querySelectorAll('.project-slide'));
        const prev = slider.querySelector('.project-prev');
        const next = slider.querySelector('.project-next');
        let cur = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
        if (cur === -1) cur = 0;

        let animating = false;
        const DURATION = 380;
        const EASING = 'transform .38s ease, opacity .38s ease';

        function show(i, direction = 'left') {
          if (!slides.length || animating) return;
          const n = slides.length;
          i = (i % n + n) % n;
          if (i === cur) return;

          const from = slides[cur];
          const to = slides[i];
          if (!from || !to) return;

          animating = true;

          // Chuẩn bị slide mới
          to.classList.add('active');
          to.style.transition = 'none';
          to.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
          to.style.opacity = '0.9';

          requestAnimationFrame(() => {
            from.style.transition = EASING;
            to.style.transition = EASING;

            from.style.transform = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
            from.style.opacity = '0.9';
            to.style.transform = 'translateX(0)';
            to.style.opacity = '1';

            setTimeout(() => {
              from.classList.remove('active');
              from.style.transition = '';
              from.style.transform = '';
              from.style.opacity = '';

              to.style.transition = '';
              to.style.transform = '';
              to.style.opacity = '';

              cur = i;
              animating = false;

              // Eager decode ảnh đang hiện
              const img = to.querySelector('img');
              if (img) { try { img.loading = 'eager'; img.decoding = 'sync'; img.decode?.(); } catch {} }
            }, DURATION);
          });
        }

        prev?.addEventListener('click', () => show(cur - 1, 'right'));
        next?.addEventListener('click', () => show(cur + 1, 'left'));

        slides.forEach((s, i) => {
          const img = s.querySelector('img');
          if (!img) return;
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', () => {
            const urls = slides.map(sl => sl.querySelector('img')?.src || '');
            open(urls, i);
          });
        });

        // Khởi tạo trạng thái ban đầu
        slides.forEach((s, k) => s.classList.toggle('active', k === cur));
      });
    })();
  
    /* ---------- CORE VALUES TABS (#core-values) ---------- */
    (function () {
      const DATA = {
        ketnoi: { title: "Kết nối", desc: "Xây dựng và mở rộng mạng lưới hợp tác, tạo ra giá trị chung cho khách hàng, đối tác và cộng đồng." },
        sangtao: { title: "Linh hoạt", desc: "Chủ động thích ứng với sự thay đổi của thị trường, tối ưu giải pháp cho từng nhu cầu cụ thể." },
        chuanmuc: { title: "Đồng hành", desc: "Cùng khách hàng phát triển bền vững, hỗ trợ toàn diện từ đầu tư, vận hành đến mở rộng kinh doanh." },
        hoptac: { title: "Hệ sinh thái", desc: "Cung cấp giải pháp bất động sản công nghiệp toàn diện, tích hợp dịch vụ hỗ trợ để gia tăng lợi ích cho khách hàng." },
        benvung: { title: "Bền vững", desc: "Cam kết phát triển dài hạn, chú trọng yếu tố xanh, thân thiện với môi trường và cộng đồng." }
      };
  
      const root = document.getElementById('core-values');
      if (!root) return;
      const tabs = root.querySelectorAll('.core-values-tab');
      const content = document.getElementById('core-values-content');
  
      function setActive(key) {
        tabs.forEach(btn => {
          const active = btn.dataset.key === key;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-selected', active ? 'true' : 'false');
          const label = btn.querySelector('.label');
          if (label && DATA[key]) label.textContent = active ? DATA[key].title : label.textContent;
        });
        if (DATA[key] && content) content.textContent = DATA[key].desc;
      }
  
      tabs.forEach(btn => {
        btn.addEventListener('click', () => setActive(btn.dataset.key));
        btn.addEventListener('keydown', (e) => {
          const list = Array.from(tabs);
          const i = list.indexOf(btn);
          if (e.key === 'ArrowRight') list[(i + 1) % list.length].focus();
          if (e.key === 'ArrowLeft') list[(i - 1 + list.length) % list.length].focus();
          if (e.key === 'Enter' || e.key === ' ') setActive(btn.dataset.key);
        });
      });
    })();
  
    /* ---------- SKILLS DIAGRAM DRAG SCROLL (.skills-diagram) ---------- */
    (function () {
      const scroller = document.querySelector('.skills-diagram');
      if (!scroller) return;
      let isDown = false, startX = 0, startLeft = 0;
  
      scroller.style.cursor = 'grab';
      scroller.addEventListener('pointerdown', (e) => {
        isDown = true;
        scroller.setPointerCapture(e.pointerId);
        scroller.style.cursor = 'grabbing';
        startX = e.clientX;
        startLeft = scroller.scrollLeft;
      });
      scroller.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        scroller.scrollLeft = startLeft - (e.clientX - startX);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => {
        scroller.addEventListener(ev, () => {
          isDown = false;
          scroller.style.cursor = 'grab';
        });
      });
    })();
  
    /* ---------- CERTIFICATE CAROUSEL (Autoplay + Swipe) ---------- */
    (function () {
      const root = document.querySelector('.certificate-slider');
      if (!root) return;
  
      const AUTOPLAY = true;
      const INTERVAL = 3500;
      const SWIPE_THRESHOLD = 40;
  
      const slides = Array.from(root.querySelectorAll('.certificate-slide'));
      const prevBtn = root.querySelector('.certificate-prev');
      const nextBtn = root.querySelector('.certificate-next');
  
      root.setAttribute('tabindex', '0');
      root.setAttribute('aria-roledescription', 'carousel');
  
      let current = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
      if (current === -1) { current = 0; slides[0]?.classList.add('active'); }
  
      // Ensure layout suitable for sliding
      try { root.style.position = root.style.position || 'relative'; } catch {}
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === current);
        try {
          s.style.position = 'absolute';
          s.style.inset = '0';
          s.style.display = idx === current ? 'block' : 'none';
        } catch {}
      });

      let timer = null;
      let animating = false;
      const DURATION = 380;
      const EASING = 'transform .38s ease, opacity .38s ease';

      const show = (i, direction = 'left') => {
        const n = slides.length; if (!n) return;
        i = (i % n + n) % n;
        if (i === current || animating) return;

        const from = slides[current];
        const to = slides[i];
        if (!from || !to) return;

        animating = true;

        // Prepare target
        to.classList.add('active');
        try { to.style.display = 'block'; } catch {}
        to.style.transition = 'none';
        to.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
        to.style.opacity = '0.99';

        requestAnimationFrame(() => {
          from.style.transition = EASING;
          to.style.transition = EASING;

          from.style.transform = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
          from.style.opacity = '0.9';
          to.style.transform = 'translateX(0)';
          to.style.opacity = '1';

          setTimeout(() => {
            from.classList.remove('active');
            try { from.style.display = 'none'; } catch {}
            from.style.transition = '';
            from.style.transform = '';
            from.style.opacity = '';

            to.style.transition = '';
            to.style.transform = '';
            to.style.opacity = '';

            current = i;
            animating = false;

            // Eager decode ảnh đang hiện
            const img = to.querySelector('img');
            if (img) { try { img.loading = 'eager'; img.decoding = 'sync'; img.decode?.(); } catch {} }
          }, DURATION);
        });
      };
      const next = () => show(current + 1, 'left');
      const prev = () => show(current - 1, 'right');
  
      const start = () => { if (AUTOPLAY && !timer) timer = setInterval(next, INTERVAL); };
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  
      prevBtn?.addEventListener('click', () => { stop(); prev(); start(); });
      nextBtn?.addEventListener('click', () => { stop(); next(); start(); });
  
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
      root.addEventListener('focusin', stop);
      root.addEventListener('focusout', start);
  
      root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { stop(); next(); start(); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { stop(); prev(); start(); e.preventDefault(); }
      });
  
      let sx = 0, sy = 0, t0 = 0, moved = false;
      root.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0];
        sx = t.clientX; sy = t.clientY; t0 = Date.now(); moved = false; stop();
      }, { passive: true });
      root.addEventListener('touchmove', (e) => {
        const t = e.changedTouches[0];
        if (Math.abs(t.clientX - sx) > 6 || Math.abs(t.clientY - sy) > 6) moved = true;
      }, { passive: true });
      root.addEventListener('touchend', (e) => {
        const t = e.changedTouches[0];
        const dx = t.clientX - sx, dy = t.clientY - sy, dt = Date.now() - t0;
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dy) < 60 && dt < 600) (dx < 0 ? next() : prev());
        start();
      }, { passive: true });
      root.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  
      start();
    })();
  
    /* ---------- SCROLL PROGRESS BAR ---------- */
    (function () {
      // Tạo thanh progress
      const progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress-bar';
             progressBar.innerHTML = `
         <div class="scroll-progress-fill"></div>
         <div class="scroll-progress-arrow">↑</div>
       `;
      
      // Thêm styles
      const style = document.createElement('style');
      style.textContent = `
        .scroll-progress-bar {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          z-index: 9999;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(26, 73, 187, 0.2);
        }
        
        .scroll-progress-bar:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(26, 73, 187, 0.3);
          border-color: rgba(26, 73, 187, 0.5);
        }
        
        .scroll-progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #1a49bb 0deg, #1a49bb 0deg, #e5e7eb 0deg);
          mask: radial-gradient(transparent 55%, black 55%);
          -webkit-mask: radial-gradient(transparent 55%, black 55%);
          transition: all 0.3s ease;
        }
        
                 .scroll-progress-arrow {
           font-size: 20px;
           font-weight: 600;
           color: #1a49bb;
           z-index: 1;
           font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
           line-height: 1;
         }
        
        .scroll-progress-bar.hidden {
          opacity: 0;
          transform: scale(0.8);
          pointer-events: none;
        }
        
        .scroll-progress-bar.scrolling-up {
          animation: scrollUpPulse 0.6s ease-out;
        }
        
        @keyframes scrollUpPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
          .scroll-progress-bar {
            bottom: 15px;
            right: 15px;
            width: 50px;
            height: 50px;
          }
          
                     .scroll-progress-arrow {
             font-size: 18px;
           }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(progressBar);
      
      // Biến để theo dõi trạng thái
      let isScrolling = false;
      let scrollTimeout;
      
      // Hàm cập nhật progress
      const updateProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
        
                 // Không cần cập nhật text nữa vì đã thay bằng mũi tên
        
        // Cập nhật fill
        const fillElement = progressBar.querySelector('.scroll-progress-fill');
        fillElement.style.background = `conic-gradient(from 0deg, #1a49bb 0deg, #1a49bb ${scrollPercent * 3.6}deg, #e5e7eb ${scrollPercent * 3.6}deg)`;
        
        // Ẩn/hiện thanh progress
        if (scrollPercent === 0) {
          progressBar.classList.add('hidden');
        } else {
          progressBar.classList.remove('hidden');
        }
      };
      
      // Hàm scroll lên đầu
      const scrollToTop = () => {
        if (isScrolling) return;
        
        isScrolling = true;
        progressBar.classList.add('scrolling-up');
        
        // Scroll mượt lên đầu
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Xóa animation class sau khi hoàn thành
        setTimeout(() => {
          progressBar.classList.remove('scrolling-up');
          isScrolling = false;
        }, 600);
      };
      
      // Event listeners
      progressBar.addEventListener('click', scrollToTop);
      
      // Touch events cho mobile
      progressBar.addEventListener('touchstart', (e) => {
        e.preventDefault();
        progressBar.style.transform = 'scale(0.95)';
      });
      
      progressBar.addEventListener('touchend', (e) => {
        e.preventDefault();
        progressBar.style.transform = '';
        scrollToTop();
      });
      
      // Cập nhật progress khi scroll
      window.addEventListener('scroll', () => {
        if (!isScrolling) {
          updateProgress();
        }
        
        // Throttle scroll events
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateProgress, 10);
      });
      
      // Cập nhật progress khi resize
      window.addEventListener('resize', updateProgress);
      
      // Khởi tạo ban đầu
      updateProgress();
    })();

    /* ---------- TIMELINE: chỉ mở 1 details ---------- */
    document.querySelectorAll('.timeline details').forEach(det => {
      det.addEventListener('toggle', function () {
        if (this.open) {
          document.querySelectorAll('.timeline details').forEach(o => { if (o !== this) o.open = false; });
        }
      });
    });
  
    /* ---------- ACTIVITY SCROLLER (drag + wheel ngang) ---------- */
    (function () {
      document.querySelectorAll('.activity-scroller').forEach(s => {
        let isDown = false, startX = 0, startLeft = 0, moved = false;
        const THRESH = 5;
        s.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return;
          isDown = true; moved = false;
          s.setPointerCapture(e.pointerId);
          s.classList.add('dragging');
          startX = e.clientX;
          startLeft = s.scrollLeft;
        });
        s.addEventListener('pointermove', (e) => {
          if (!isDown) return;
          const dx = e.clientX - startX;
          if (Math.abs(dx) > THRESH) moved = true;
          s.scrollLeft = startLeft - dx;
        });
        const end = () => { isDown = false; s.classList.remove('dragging'); };
        s.addEventListener('pointerup', end);
        s.addEventListener('pointercancel', end);
        s.addEventListener('pointerleave', end);
  
        s.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
        s.addEventListener('wheel', (e) => {
          if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
          e.preventDefault();
          s.scrollLeft += e.deltaX;
        }, { passive: false });
      });
    })();
  });
// ---- CẤU HÌNH ÁNH XẠ TAB -> SECTION HIỆN ----
// Nếu tab4 cần hiện .profile-section-4 thì đổi giá trị tương ứng.
const TAB_TO_SECTION = {
    tab1: '.profile-section',
    tab2: '.profile-section-2',
    tab3: '.profile-section-3',
    tab4: '.profile-section-4', // đổi thành '.profile-section-4' nếu bạn có section riêng
  };
  
  // Ẩn tất cả tab & tất cả profile-section*
  function hideAll() {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[class^="profile-section"]').forEach(el => el.style.display = 'none');
  }
  
  // Kích hoạt tab theo id và hiện section khớp
  function activateTab(tabId) {
    if (!tabId) return;
  
    // Active trạng thái nút
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
  
    // Ẩn & hiện nội dung
    hideAll();
    const tabEl = document.getElementById(tabId);
    if (tabEl) tabEl.style.display = 'block';
  
    const sectionSel = TAB_TO_SECTION[tabId];
    if (sectionSel) {
      const sectionEl = document.querySelector(sectionSel);
      if (sectionEl) sectionEl.style.display = 'flex';
    }
  }
  
  // Cuộn nút đang active về giữa thanh menu (nếu có)
  function scrollActiveMenuBtnIntoCenter() {
    const activeBtn = document.querySelector('.menu-btn.active');
    const menuBar = activeBtn?.closest('.menu-bar');
    if (!activeBtn || !menuBar) return;
    const barRect = menuBar.getBoundingClientRect();
    const btnCenter = activeBtn.offsetLeft + activeBtn.offsetWidth / 2;
    const scrollTo = btnCenter - barRect.width / 2;
    menuBar.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }
  
  // Lắng nghe click cho tất cả nút menu
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.getAttribute('data-tab'));
      // Cuộn nút về giữa sau khi chuyển tab
      setTimeout(scrollActiveMenuBtnIntoCenter, 80);
    });
  });
  
  // Nút “đi đến liên hệ”
  window.addEventListener('DOMContentLoaded', () => {
    const goToContactBtn = document.getElementById('go-to-contact');
    if (!goToContactBtn) return;
  
    goToContactBtn.addEventListener('click', () => {
      // Chuyển sang tab4 bằng cùng 1 logic
      activateTab('tab4');
  
      // Đảm bảo nút tab4 hiện trong viewport thanh menu
      setTimeout(scrollActiveMenuBtnIntoCenter, 100);
  
      // Nếu cần cuộn thanh menu vào vùng nhìn
      const menuBar = document.querySelector('.menu-bar');
      if (menuBar) {
        const rect = menuBar.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offset = rect.top + scrollTop - 20;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
// Gắn click cho các nút dẫn tới tab Liên hệ
window.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.custom-btn, .custom-btn-2, .end, .connect-text, .nut');
    if (!triggers.length) return;
  
    triggers.forEach(el => {
      el.addEventListener('click', () => {
        // Dùng lại logic chung, không lặp
        activateTab('tab4');
  
        // Cuộn nút tab đang active (tab4) vào giữa thanh menu
        setTimeout(scrollActiveMenuBtnIntoCenter, 80);
  
        // (Tuỳ chọn) đảm bảo menu-bar hiện trong viewport
        const menuBar = document.querySelector('.menu-bar');
        if (menuBar) {
          const rect = menuBar.getBoundingClientRect();
          const y = (window.pageYOffset || document.documentElement.scrollTop) + rect.top - 20;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const details = document.querySelectorAll(".timeline details");
  
    details.forEach((el) => {
      el.addEventListener("toggle", function () {
        if (this.open) {
          // Nếu mở cái này thì đóng các cái khác
          details.forEach((other) => {
            if (other !== this) {
              other.removeAttribute("open");
            }
          });
        } else {
          // Nếu người dùng cố đóng cái cuối cùng -> mở lại nó
          const stillOpen = Array.from(details).some(d => d.open);
          if (!stillOpen) {
            this.setAttribute("open", "");
          }
        }
      });
    });
  
    // Đảm bảo mặc định có ít nhất 1 cái mở
    if (![...details].some(d => d.open) && details.length > 0) {
      details[0].setAttribute("open", "");
    }
  });
  document.querySelectorAll(".project-slide img").forEach(img => {
    img.classList.add("loading");
    img.addEventListener("load", () => {
      img.classList.remove("loading");
    });
  });
  
    /* ---------- PROJECT SECTION ITEM CLICK -> SCROLL TO SKILL BOX ---------- */
    (function () {
      const projectItems = document.querySelectorAll('.skill-next-text');
      const skillBoxes = Array.from(document.querySelectorAll('.skill-box'));
      
      if (!projectItems.length || !skillBoxes.length) return;
      
      let currentSkillIndex = 0;
      
      projectItems.forEach((item, itemIndex) => {
        // Hàm xử lý scroll đến skill-box
        const handleScrollToSkill = () => {
          // Tính toán skill-box tiếp theo để scroll đến
          const nextSkillIndex = (currentSkillIndex + 1) % skillBoxes.length;
          const targetSkillBox = skillBoxes[nextSkillIndex];
          
          if (targetSkillBox) {
            // Scroll mượt đến skill-box
            targetSkillBox.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
            
            // Cập nhật index hiện tại
            currentSkillIndex = nextSkillIndex;
            
            // Thêm hiệu ứng highlight tạm thời
            targetSkillBox.style.transition = 'all 0.3s ease';
            targetSkillBox.style.transform = 'scale(1.05)';
            targetSkillBox.style.boxShadow = '0 8px 25px rgba(26, 73, 187, 0.3)';
            
            setTimeout(() => {
              targetSkillBox.style.transform = 'scale(1)';
              targetSkillBox.style.boxShadow = '';
            }, 600);
          }
        };

        // Click event cho desktop
        item.addEventListener('click', handleScrollToSkill);
        
        // Touch events cho mobile
        let touchStartY = 0;
        let touchStartX = 0;
        
        item.addEventListener('touchstart', (e) => {
          touchStartY = e.touches[0].clientY;
          touchStartX = e.touches[0].clientX;
        });
        
        item.addEventListener('touchend', (e) => {
          const touchEndY = e.changedTouches[0].clientY;
          const touchEndX = e.changedTouches[0].clientX;
          
          // Tính khoảng cách di chuyển
          const deltaY = Math.abs(touchEndY - touchStartY);
          const deltaX = Math.abs(touchEndX - touchStartX);
          
          // Chỉ kích hoạt nếu touch ngắn và ít di chuyển (tap)
          if (deltaY < 10 && deltaX < 10) {
            handleScrollToSkill();
          }
        });
        
        // Thêm cursor pointer để người dùng biết có thể click
        item.style.cursor = 'pointer';
        item.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        item.style.userSelect = 'none'; // Ngăn select text trên mobile
        
        // Hover effect (chỉ trên desktop)
        item.addEventListener('mouseenter', () => {
          if (!('ontouchstart' in window)) { // Chỉ trên desktop
            item.style.transform = 'translateY(-2px)';
            item.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
          }
        });
        
        item.addEventListener('mouseleave', () => {
          if (!('ontouchstart' in window)) { // Chỉ trên desktop
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '';
          }
        });
        
        // Active state cho mobile
        item.addEventListener('touchstart', () => {
          if ('ontouchstart' in window) {
            item.style.transform = 'scale(0.98)';
            item.style.opacity = '0.8';
          }
        });
        
        item.addEventListener('touchend', () => {
          if ('ontouchstart' in window) {
            setTimeout(() => {
              item.style.transform = 'scale(1)';
              item.style.opacity = '1';
            }, 150);
          }
        });
      });
    })();

    /* ---------- ACTIVITY LABEL CLICK -> SCROLL TO ACTIVITY CARD ---------- */
    (function () {
      const activityLabels = document.querySelectorAll('.activity-label');
      const activityCards = Array.from(document.querySelectorAll('.activity-card'));
      
      if (!activityLabels.length || !activityCards.length) return;
      
      let currentActivityIndex = 0;
      
      activityLabels.forEach((label, labelIndex) => {
        // Hàm xử lý scroll đến activity-card
        const handleScrollToActivity = () => {
          // Tính toán activity-card tiếp theo để scroll đến
          const nextActivityIndex = (currentActivityIndex + 1) % activityCards.length;
          const targetActivityCard = activityCards[nextActivityIndex];
          
          if (targetActivityCard) {
            // Scroll mượt đến activity-card
            targetActivityCard.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
            
            // Cập nhật index hiện tại
            currentActivityIndex = nextActivityIndex;
            
            // Thêm hiệu ứng highlight tạm thời
            targetActivityCard.style.transition = 'all 0.3s ease';
            targetActivityCard.style.transform = 'scale(1.05)';
            targetActivityCard.style.boxShadow = '0 8px 25px rgba(26, 73, 187, 0.3)';
            
            setTimeout(() => {
              targetActivityCard.style.transform = 'scale(1)';
              targetActivityCard.style.boxShadow = '';
            }, 600);
          }
        };

        // Click event cho desktop
        label.addEventListener('click', handleScrollToActivity);
        
        // Touch events cho mobile
        let touchStartY = 0;
        let touchStartX = 0;
        
        label.addEventListener('touchstart', (e) => {
          touchStartY = e.touches[0].clientY;
          touchStartX = e.touches[0].clientX;
        });
        
        label.addEventListener('touchend', (e) => {
          const touchEndY = e.changedTouches[0].clientY;
          const touchEndX = e.changedTouches[0].clientX;
          
          // Tính khoảng cách di chuyển
          const deltaY = Math.abs(touchEndY - touchStartY);
          const deltaX = Math.abs(touchEndX - touchStartX);
          
          // Chỉ kích hoạt nếu touch ngắn và ít di chuyển (tap)
          if (deltaY < 10 && deltaX < 10) {
            handleScrollToActivity();
          }
        });
        
        // Thêm cursor pointer để người dùng biết có thể click
        label.style.cursor = 'pointer';
        label.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        label.style.userSelect = 'none'; // Ngăn select text trên mobile
        
        // Hover effect (chỉ trên desktop)
        label.addEventListener('mouseenter', () => {
          if (!('ontouchstart' in window)) { // Chỉ trên desktop
            label.style.transform = 'translateY(-2px)';
            label.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
          }
        });
        
        label.addEventListener('mouseleave', () => {
          if (!('ontouchstart' in window)) { // Chỉ trên desktop
            label.style.transform = 'translateY(0)';
            label.style.boxShadow = '';
          }
        });
        
        // Active state cho mobile
        label.addEventListener('touchstart', () => {
          if ('ontouchstart' in window) {
            label.style.transform = 'scale(0.98)';
            label.style.opacity = '0.8';
          }
        });
        
        label.addEventListener('touchend', () => {
          if ('ontouchstart' in window) {
            setTimeout(() => {
              label.style.transform = 'scale(1)';
              label.style.opacity = '1';
            }, 150);
          }
        });
      });
    })();
  