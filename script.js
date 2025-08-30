/* ========= WellSpring Family Clinic - Scripts ========= */

// --------- Mobile Nav Toggle ----------
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks){
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// --------- Active Nav Link ----------
(function markActiveNav(){
  const links = document.querySelectorAll('.nav-links a');
  const here = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if ((here === '' && href === 'index.html') || href === here){
      a.classList.add('active');
    }
  });
})();

// --------- Scroll Reveal (IntersectionObserver) ----------
(function revealOnScroll(){
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  els.forEach(el=>io.observe(el));
})();

// --------- BMI Calculator ----------
function computeBMI({cm=null, m=null, kg}){
  let meters = m ? parseFloat(m) : (cm ? parseFloat(cm)/100 : null);
  const weight = parseFloat(kg);
  if (!meters || !weight || meters<=0 || weight<=0) return null;
  const bmi = weight / (meters*meters);
  return Number(bmi.toFixed(1));
}

function bmiCategory(bmi){
  if (bmi == null) return null;
  if (bmi < 18.5) return {label:'Underweight', cls:'badge-warn'};
  if (bmi < 25)   return {label:'Normal', cls:'badge-ok'};
  if (bmi < 30)   return {label:'Overweight', cls:'badge-warn'};
  return {label:'Obese', cls:'badge-bad'};
}

(function attachBMILogic(){
  const form = document.getElementById('bmiForm');
  if (!form) return;
  const out = document.getElementById('bmiOutput');
  const advice = document.getElementById('bmiAdvice');

  const setResult = (text, cat) => {
    out.innerHTML = text;
    if (cat){
      out.className = 'result';
      advice.innerHTML = `<span class="badge ${cat.cls}" style="padding:6px 10px; border-radius:9999px; font-weight:700">${cat.label}</span>`;
    } else {
      advice.textContent = '';
    }
  };

  form.addEventListener('input', ()=>{
    const kg = form.querySelector('#weight').value;
    const cm = form.querySelector('#heightCm').value;
    const m  = form.querySelector('#heightM').value;
    const bmi = computeBMI({cm, m, kg});
    if (!bmi){
      setResult('Enter valid height and weight to see your BMI.', null);
      return;
    }
    const cat = bmiCategory(bmi);
    setResult(`Your BMI is <strong>${bmi}</strong>`, cat);
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // nothing else needed; live preview already computed
  });

  // prime UI
  setResult('Enter your details to calculate BMI.', null);
})();

// --------- Basic Form Validation ----------
function validateEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());
}
function validatePhone(v){
  return /^[0-9+()\-\s]{7,20}$/.test(String(v));
}
function setFieldError(el, msg){
  const err = el.parentElement.querySelector('.error');
  if (err){ err.textContent = msg || ''; }
}

// --------- EmailJS Setup (Replace placeholders!) ----------
/*
  1) Go to https://www.emailjs.com
  2) Create a Service and Template
  3) Replace the values below:
     EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_APPT, EMAILJS_TEMPLATE_ID_CONTACT
*/
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID_APPT = "YOUR_TEMPLATE_ID_APPOINTMENT";
const EMAILJS_TEMPLATE_ID_CONTACT = "YOUR_TEMPLATE_ID_CONTACT";

(function initEmailJS(){
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY"){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

// --------- Appointment Form ----------
(function attachAppointment(){
  const form = document.getElementById('appointmentForm');
  if (!form) return;
  const notice = document.getElementById('appointmentNotice');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const date = form.date.value;
    const message = form.message.value.trim();

    // client-side validation
    let ok = true;
    if (name.length < 2){ setFieldError(form.name, 'Enter your full name'); ok=false; } else setFieldError(form.name,'');
    if (!validateEmail(email)){ setFieldError(form.email, 'Enter a valid email'); ok=false; } else setFieldError(form.email,'');
    if (!validatePhone(phone)){ setFieldError(form.phone, 'Enter a valid phone'); ok=false; } else setFieldError(form.phone,'');
    if (!date){ setFieldError(form.date, 'Please choose a date'); ok=false; } else setFieldError(form.date,'');

    if (!ok) return;

    notice.textContent = 'Sending...';

    try{
      if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"){
        throw new Error('EmailJS not configured. Replace placeholders in assets/script.js');
      }
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_APPT, {
        user_name: name,
        user_email: email,
        user_phone: phone,
        preferred_date: date,
        message
      });
      notice.innerHTML = '<span class="success">Appointment request sent successfully. We will contact you soon.</span>';
      form.reset();
    }catch(err){
      notice.innerHTML = `<span class="error">Failed to send. ${err.message}</span>`;
    }
  });
})();

// --------- Contact Form ----------
(function attachContact(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const notice = document.getElementById('contactNotice');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    let ok = true;
    if (name.length < 2){ setFieldError(form.name, 'Enter your full name'); ok=false; } else setFieldError(form.name,'');
    if (!validateEmail(email)){ setFieldError(form.email, 'Enter a valid email'); ok=false; } else setFieldError(form.email,'');
    if (subject.length < 3){ setFieldError(form.subject, 'Provide a subject'); ok=false; } else setFieldError(form.subject,'');

    if (!ok) return;

    notice.textContent = 'Sending...';
    try{
      if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"){
        throw new Error('EmailJS not configured. Replace placeholders in assets/script.js');
      }
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_CONTACT, {
        user_name: name,
        user_email: email,
        subject,
        message
      });
      notice.innerHTML = '<span class="success">Message sent successfully. We will get back to you shortly.</span>';
      form.reset();
    }catch(err){
      notice.innerHTML = `<span class="error">Failed to send. ${err.message}</span>`;
    }
  });
})();
