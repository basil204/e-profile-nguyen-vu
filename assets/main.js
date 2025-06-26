// Tab functionality
document.querySelectorAll('.menu-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Xóa active khỏi tất cả nút
    document.querySelectorAll('.menu-btn').forEach(function(b){b.classList.remove('active');});
    // Ẩn tất cả tab
    document.querySelectorAll('.tab-content').forEach(function(tab){tab.style.display='none';});
    // Active nút này
    btn.classList.add('active');
    // Hiện tab tương ứng
    var tabId = btn.getAttribute('data-tab');
    var tab = document.getElementById(tabId);
    if(tab) tab.style.display = 'block';
  });
});

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
            document.getElementById(tabId).style.display = 'block';
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
