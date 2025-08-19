document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tab = this.getAttribute('data-tab');
    if (tab === 'tab1') {
      document.getElementById('profile1').style.display = 'block';
      document.getElementById('profile2').style.display = 'none';
    } else if (tab === 'tab2') {
      document.getElementById('profile1').style.display = 'none';
      document.getElementById('profile2').style.display = 'block';
    } else {
      document.getElementById('profile1').style.display = 'none';
      document.getElementById('profile2').style.display = 'none';
    }
  });
});
