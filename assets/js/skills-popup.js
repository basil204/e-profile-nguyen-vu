// Nội dung mô tả cho từng kỹ năng
const skillDescriptions = {
    "Tư duy chiến lược": "Khả năng nhìn nhận tổng thể, xác định mục tiêu dài hạn và xây dựng kế hoạch hành động phù hợp để đạt được mục tiêu đó.",
    "Làm việc hệ thống/logic": "Tư duy mạch lạc, tổ chức công việc theo quy trình, đảm bảo hiệu quả và hạn chế sai sót.",
    "Giải quyết vấn đề và ra quyết định nhanh": "Nhanh chóng phân tích tình huống, đưa ra giải pháp tối ưu và quyết đoán trong hành động.",
    "Giao tiếp và truyền đạt hiệu quả": "Trình bày ý tưởng rõ ràng, lắng nghe và phản hồi phù hợp, tạo sự kết nối trong công việc.",
    "Đổi mới và sáng tạo trong tư duy": "Luôn tìm kiếm giải pháp mới, cải tiến quy trình và thích nghi với thay đổi.",
    "Hoạch định, tổ chức và phân bổ nguồn lực": "Lập kế hoạch, phân công nhiệm vụ và sử dụng nguồn lực hợp lý để đạt hiệu quả cao nhất."
};

// Hiệu ứng bung popup khi click vào kỹ năng
window.addEventListener('DOMContentLoaded', function() {
    const skillItems = document.querySelectorAll('.skills-diagram .skill-item');
    const popup = document.getElementById('skill-popup');
    const popupTitle = document.getElementById('skill-popup-title');
    const popupContent = document.getElementById('skill-popup-content');
    const closeBtn = document.getElementById('close-skill-popup');
    let popupBg = null;

    function showPopup(skill, content) {
        popupTitle.textContent = skill;
        popupContent.textContent = content;
        popup.style.display = 'block';
        // Thêm lớp nền mờ
        popupBg = document.createElement('div');
        popupBg.className = 'skill-popup-bg';
        document.body.appendChild(popupBg);
        // Đóng popup khi click nền
        popupBg.onclick = hidePopup;
        // Đóng popup khi nhấn ESC
        document.addEventListener('keydown', escHandler);
    }

    function hidePopup() {
        popup.style.display = 'none';
        if (popupBg) {
            document.body.removeChild(popupBg);
            popupBg = null;
        }
        document.removeEventListener('keydown', escHandler);
    }

    function escHandler(e) {
        if (e.key === 'Escape') hidePopup();
    }
    skillItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const skill = this.getAttribute('data-skill');
            showPopup(skill, skillDescriptions[skill] || 'Đang cập nhật mô tả...');
        });
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const skill = this.getAttribute('data-skill');
                showPopup(skill, skillDescriptions[skill] || 'Đang cập nhật mô tả...');
            }
        });
    });
    closeBtn.onclick = hidePopup;
});