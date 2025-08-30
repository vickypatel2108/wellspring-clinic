const form = document.getElementById('bmi-form');
const out = document.getElementById('bmi-output');
const unitToggle = document.getElementById('unit');
const heightLabel = document.getElementById('height-label');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');

function toMeters(value, unit){
  if(unit === 'cm') return value / 100;
  return value; // meters
}

function category(bmi){
  if(bmi < 18.5) return {k:'Underweight', cls:'alert--warn'};
  if(bmi < 25)   return {k:'Normal', cls:'alert--success'};
  if(bmi < 30)   return {k:'Overweight', cls:'alert--warn'};
  return {k:'Obese', cls:'alert--warn'};
}

unitToggle?.addEventListener('change', ()=>{
  const u = unitToggle.value;
  heightLabel.textContent = u === 'cm' ? 'Height (cm)' : 'Height (m)';
  heightInput.setAttribute('step', u === 'cm' ? '1' : '0.01');
  heightInput.placeholder = u === 'cm' ? 'e.g., 170' : 'e.g., 1.70';
});

form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const u = unitToggle.value;
  const h = parseFloat(heightInput.value);
  const w = parseFloat(weightInput.value);

  out.innerHTML = '';
  if(isNaN(h) || isNaN(w) || h <= 0 || w <= 0){
    out.innerHTML = `<p class="error">Please enter valid positive numbers for height and weight.</p>`;
    return;
  }
  const meters = toMeters(h, u);
  if(meters <= 0 || meters > 2.72){ // sanity check (tallest person ~2.72m)
    out.innerHTML = `<p class="error">Height looks unrealistic. Please check and try again.</p>`;
    return;
  }
  const bmi = w / (meters*meters);
  const rounded = Math.round(bmi*10)/10;
  const cat = category(rounded);
  out.innerHTML = `
    <div class="alert ${cat.cls}">
      <strong>Your BMI is ${rounded}</strong> — ${cat.k}.
      <div class="mt8 help">Normal range is 18.5–24.9. Talk to a healthcare professional for personalised advice.</div>
    </div>
  `;
});
