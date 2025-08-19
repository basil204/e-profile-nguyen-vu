function showTab(tab) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.esg-tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector(`.tab-button.${tab}`).classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
}

// Hiệu ứng vuốt ngang cho .swipe-years
(function () {
    const swipe = document.querySelector('.swipe-years');
    if (!swipe) return;
    let isDown = false,
        startX, scrollLeft;
    swipe.addEventListener('mousedown', (e) => {
        isDown = true;
        swipe.classList.add('dragging');
        startX = e.pageX - swipe.offsetLeft;
        scrollLeft = swipe.scrollLeft;
    });
    swipe.addEventListener('mouseleave', () => {
        isDown = false;
        swipe.classList.remove('dragging');
    });
    swipe.addEventListener('mouseup', () => {
        isDown = false;
        swipe.classList.remove('dragging');
    });
    swipe.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - swipe.offsetLeft;
        const walk = (x - startX) * 1.2; // tốc độ kéo
        swipe.scrollLeft = scrollLeft - walk;
    });
    // Touch events cho mobile
    let touchStartX = 0,
        touchScrollLeft = 0;
    swipe.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = swipe.scrollLeft;
    });
    swipe.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        const walk = (x - touchStartX) * 1.2;
        swipe.scrollLeft = touchScrollLeft - walk;
    });
})();


// ======= ESG NEXT/PREV BUTTONS =======
window.addEventListener('DOMContentLoaded', function () {
    const tabOrder = ['e', 's', 'g'];

    function getCurrentTabIndex() {
        const activeBtn = document.querySelector('.tab-button.active');
        if (!activeBtn) return 0;
        if (activeBtn.classList.contains('e')) return 0;
        if (activeBtn.classList.contains('s')) return 1;
        if (activeBtn.classList.contains('g')) return 2;
        return 0;
    }
    document.querySelectorAll('.esg-next').forEach((btn, idx, arr) => {
        btn.onclick = function () {
            let cur = getCurrentTabIndex();
            if (idx === 0) {
                // Nút trái: prev
                let prev = (cur - 1 + tabOrder.length) % tabOrder.length;
                showTab(tabOrder[prev]);
            } else {
                // Nút phải: next
                let next = (cur + 1) % tabOrder.length;
                showTab(tabOrder[next]);
            }
        };
    });
});