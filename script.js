// script.js - Interactivity for the portfolio
// - Typing effect
// - Smooth scroll navigation and scroll-spy
// - Mobile hamburger toggle
// - Reveal-on-scroll and skill animations
// - Project hover tilt
// - Contact form handling and resume download

// Small helpers
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearEl = qs('#year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Typing effect
  const typingEl = qs('#typing');
  const phrases = [
    'Creating modern, responsive interfaces.',
    'Building pixel-perfect UI with performance.',
    'Designing delightful user experiences.'
  ];
  let p = 0, ti = 0, deleting = false;
  const typeSpeed = 60;
  function tick(){
    if(!typingEl) return;
    const full = phrases[p];
    typingEl.textContent = full.slice(0, ti) + (ti % 2 ? '|' : '');
    if(!deleting) {
      if(ti < full.length) ti++; else { deleting = true; setTimeout(tick, 900); return }
    } else {
      if(ti > 0) ti--; else { deleting=false; p=(p+1)%phrases.length }
    }
    setTimeout(tick, deleting?30:typeSpeed);
  }
  tick();

  // Hamburger toggle for mobile nav
  const hamburger = qs('#hamburger');
  const navLinks = qs('#nav-links');
  if(hamburger && navLinks){
    hamburger.addEventListener('click', ()=>{
      navLinks.classList.toggle('nav-open');
      hamburger.classList.toggle('open');
    });
  }

  // Smooth scroll for nav links
  qsa('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      if(target){
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile nav
        if(navLinks.classList.contains('nav-open')) navLinks.classList.remove('nav-open');
      }
    });
  });

  // Scroll spy - highlight active nav item
  const sections = qsa('main section');
  const navItems = qsa('.nav-link');
  const opts = {root:null,threshold:0.45};
  const observer = new IntersectionObserver(entries =>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        navItems.forEach(n=>n.classList.toggle('active', n.dataset.target===id));
      }
    });
  }, opts);
  sections.forEach(s=>observer.observe(s));

  // Reveal on scroll for glass cards and skill bars
  const reveals = qsa('.card, .skill-card, .project-card, .hero-content');
  const revObserver = new IntersectionObserver((entries)=>{
    entries.forEach(ent =>{
      if(ent.isIntersecting){
        ent.target.style.opacity = 1;
        ent.target.style.transform = 'translateY(0)';
        ent.target.classList.add('revealed');
        revObserver.unobserve(ent.target);
        // animate skill bar
        if(ent.target.classList.contains('skill-card')){
          const bar = ent.target.querySelector('.skill-bar > div');
          if(bar){
            const val = bar.style.getPropertyValue('--val') || bar.getAttribute('data-val');
            bar.style.width = val || '80%';
          }
        }
      }
    });
  },{threshold:0.18});
  reveals.forEach(r=>{
    r.style.opacity = 0; r.style.transform = 'translateY(18px)'; revObserver.observe(r);
  });

  // Project tilt effect
  qsa('.project-card').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const cx = rect.width/2; const cy = rect.height/2;
      const dx = (x-cx)/cx; const dy = (y-cy)/cy;
      card.style.transform = `perspective(800px) rotateX(${ -dy*6 }deg) rotateY(${ dx*6 }deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', ()=>{card.style.transform='translateY(0)';});
  });

  // Back to top
  const back = qs('#backToTop');
  if(back){
    back.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', ()=>{
      back.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
  }

  // Contact form submit (fake, simple validation)
  const form = qs('#contactForm');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name');
      const email = data.get('email');
      const message = data.get('message');
      if(!name||!email||!message){ alert('Please complete all fields.'); return }
      // Simulate send
      const btn = form.querySelector('button');
      const old = btn.textContent; btn.textContent='Sending...'; btn.disabled=true;
      setTimeout(()=>{ btn.textContent='Sent ✓'; form.reset(); setTimeout(()=>{btn.textContent=old; btn.disabled=false},2000)},900);
    });
  }

  // Download resume photo from uploaded image file
  const dl = qs('#downloadResume');
  if(dl){
    dl.addEventListener('click', e=>{
      // Use page anchor fallback if JS is enabled; no need to block navigation
      if(dl.href){
        const a = document.createElement('a');
        a.href = dl.href;
        a.download = dl.getAttribute('download') || 'MyPhoto.jpeg';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    });
  }

});

// Small safety: hide back-to-top by default
window.addEventListener('load', ()=>{const b=document.getElementById('backToTop'); if(b) b.style.display='none'})
