// Tab functionality
document.querySelectorAll('.menu-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        // Xóa active khỏi tất cả nút
        document.querySelectorAll('.menu-btn').forEach(function(b) { b.classList.remove('active'); });
        // Ẩn tất cả tab
        document.querySelectorAll('.tab-content').forEach(function(tab) { tab.style.display = 'none'; });
        // Active nút này
        btn.classList.add('active');
        // Hiện tab tương ứng
        var tabId = btn.getAttribute('data-tab');
        var tab = document.getElementById(tabId);
        if (tab) tab.style.display = 'block';
        // Cuộn menu-btn vào giữa (sau khi xử lý tab)
        setTimeout(function() {
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
window.addEventListener('scroll', function() {
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
document.addEventListener('DOMContentLoaded', function() {
    // Script cho tabs chính
    const menuButtons = document.querySelectorAll('.menu-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
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
        tab.addEventListener('click', function() {
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
window.addEventListener('DOMContentLoaded', function() {
    goToSlide(0);
});

goToSlide(currentSlide);

// Hiệu ứng đánh máy cho .send
window.addEventListener('DOMContentLoaded', function() {
    var send = document.querySelector('.send');
    if (send) {
        var text = send.textContent;
        send.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                send.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 18); // tốc độ đánh máy
            }
        }
        typeWriter();
    }
});

// Vuốt để chuyển company-card cho .swipe-years với hiệu ứng mượt và chiều động
(function() {
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
        tab.addEventListener('click', function() {
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