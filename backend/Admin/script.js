
document.addEventListener('DOMContentLoaded', () => {
 
  const navItems = document.querySelectorAll('.nav-item');
 
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
 
  
  const actionItems = document.querySelectorAll('.action-item');
 
  actionItems.forEach(action => {
    action.addEventListener('click', () => {
      const label = action.textContent.trim();
      console.log(`Ação clicada: ${label}`);
      
    });
  });
 
});
 