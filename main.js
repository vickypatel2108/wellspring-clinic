/* ---------- Active link + mobile menu ---------- */
const toggle = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');
if (toggle && links){
  toggle.addEventListener('click', ()=> links.classList.toggle('open'));
}

/* Mark current page in nav (aria-current="page") */
(function markActive(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(a=>{
    const href = a.getAttribute('href');
    if ((path === '' && href === 'index.html') || href === path) {
      a.setAttribute('aria-current','page');
    }
  });
})();

/* ---------- Scroll reveal animations ---------- */
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.15});

document.querySelectorAll('.reveal').forEach(el=> observer.observe(el));

/* ---------- Smooth anchor focus for accessibility ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const tgt = document.getElementById(id);
    if(tgt){
      e.preventDefault();
      tgt.scrollIntoView({behavior:'smooth', block:'start'});
      tgt.setAttribute('tabindex','-1');
      tgt.focus({preventScroll:true});
      setTimeout(()=>tgt.removeAttribute('tabindex'), 500);
    }
  });
});
