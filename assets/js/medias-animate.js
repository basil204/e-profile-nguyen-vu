// Hiệu ứng trôi vào cho các box truyền thông khi vuốt/chạm đến (scroll into view)
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight - 60 &&
        rect.bottom > 60
    );
}

function animateMediasBoxes() {
    const boxes = document.querySelectorAll('.tabs-medias-boxes > a, .tabs-medias-boxes > div');
    let delay = 0;
    boxes.forEach((box, idx) => {
        if (box.classList.contains('media-fade-in')) return;
        if (isInViewport(box)) {
            box.classList.add('media-fade-init');
            // Bên trái: trôi từ trái vào, bên phải: trôi từ phải vào
            if (idx % 2 === 0) {
                box.classList.add('media-fade-left');
            } else {
                box.classList.add('media-fade-right');
            }
            // Tăng delay cho từng box để hiệu ứng mượt và đều hơn
            setTimeout(() => {
                box.classList.add('media-fade-in');
            }, delay);
            delay += 120; // delay nhỏ hơn, hiệu ứng nối tiếp mượt hơn
        }
    });
}

window.addEventListener('DOMContentLoaded', function() {
    animateMediasBoxes();
    window.addEventListener('scroll', animateMediasBoxes);

    // Hiệu ứng trượt từ trái về phải cho các block giải thưởng
    const prizeBlocks = document.querySelectorAll('.prizes-blocks .prize-block');

    function isPrizeInView(block) {
        const rect = block.getBoundingClientRect();
        return rect.top < window.innerHeight - 60 && rect.bottom > 60;
    }

    function animatePrizes() {
        prizeBlocks.forEach((block, idx) => {
            if (block.classList.contains('prize-slide-in')) return;
            if (isPrizeInView(block)) {
                block.classList.add('prize-slide-init');
                setTimeout(() => {
                    block.classList.add('prize-slide-in');
                }, idx * 160);
            }
        });
    }
    animatePrizes();
    window.addEventListener('scroll', animatePrizes);
});