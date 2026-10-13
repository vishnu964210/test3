
const depts = [
  ['General Medicine','🩺','Checkups and everyday health'],
  ['Cardiology','💙','Heart health and cardiac care'],
  ['Neurology','🧠','Brain and nervous system'],
  ['Orthopedics','🦴','Bones, joints and mobility'],
  ['Pediatrics','🧸','Infant and child healthcare'],
  ['Obstetrics & Gynecology','🌸','Women’s and maternity health'],
  ['Oncology','🎗️','Cancer diagnosis and care'],
  ['Dermatology','✨','Skin, hair and nail health'],
  ['Ophthalmology','👁️','Eye health and vision'],
  ['ENT','👂','Ear, nose and throat'],
  ['Psychiatry','🧩','Mental health support'],
  ['Gastroenterology','🫁','Digestive system and liver'],
  ['Pulmonology','🌬️','Lung and breathing health'],
  ['Nephrology','💧','Kidney health'],
  ['Urology','➕','Urinary tract health'],
  ['Endocrinology','⚖️','Hormones and diabetes'],
  ['Dentistry','🦷','Dental and oral care'],
  ['Emergency & Trauma','🚑','Emergency and urgent care'],
  ['Radiology & Imaging','🔬','Diagnostic imaging'],
  ['Pathology & Laboratory','🧪','Laboratory diagnostics'],
  ['Anesthesiology','💉','Anesthesia and pain care'],
  ['Physiotherapy & Rehab','🏃','Recovery and rehabilitation'],
  ['Infectious Diseases','🦠','Infection diagnosis and care'],
  ['Plastic & Reconstructive Surgery','🩹','Reconstructive surgery']
];

const firstNames = [
  'Aarav','Meera','Arjun','Ananya','Rohan','Ishita',
  'Kabir','Diya','Vihaan','Sana','Aditya','Nisha'
];

const surnames = [
  'Sharma','Reddy','Mehta','Rao','Kapoor','Nair',
  'Iyer','Patel','Malhotra','Desai','Kulkarni','Chowdhury'
];

const qualifications = ['MD, DM','MBBS, MD','MBBS, MS','MD, DNB','MBBS, Fellowship'];
const schools = ['AIIMS New Delhi','NIMS Hyderabad','CMC Vellore','JIPMER Puducherry'];
const doctors = [];

depts.forEach((dept, i) => {
  for (let j = 0; j < 3; j++) {
    const n = i * 3 + j;
    const first = firstNames[n % firstNames.length];
    const last = surnames[(i * 3 + j) % surnames.length];

    doctors.push({
      id: n + 1,
      name: `Dr. ${first} ${last}`,
      dept: dept[0],
      icon: dept[1],
      qual: qualifications[(i + j) % qualifications.length],
      exp: 6 + ((i * 3 + j * 5) % 19),
      fee: 600 + ((i * 3 + j) % 5) * 150,
      education: schools[(i + j) % schools.length],
      rating: (4.7 + ((i + j) % 3) * 0.1).toFixed(1),
      avatar: first[0] + last[0],
      languages: 'English, Hindi, Telugu',
      hours: ['Mon–Fri · 9 AM–2 PM','Mon–Sat · 10 AM–4 PM','Tue–Sat · 11 AM–6 PM'][(i + j) % 3],
      registration: `SYN-MED-${1000 + n}`,
      bio: 'Patient-focused care, evidence-based treatment and clear communication.'
    });
  }
});

const $ = id => document.getElementById(id);
const money = n => '₹' + Number(n).toLocaleString('en-IN');
let selectedDept = 'all';

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function go(page) {
  const pages = {
    home:'homePage',
    departments:'directoryPage',
    doctors:'directoryPage',
    appointments:'appointmentsPage',
    profile:'profilePage',
    billing:'billingPage',
    receipt:'receiptPage'
  };

  Object.values(pages).forEach(id => $(id).classList.add('hide'));
  $(pages[page] || 'homePage').classList.remove('hide');

  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.nav === page);
  });

  if (page === 'departments' || page === 'doctors') {
    if (page === 'doctors') selectedDept = 'all';
    $('directoryTitle').textContent =
      page === 'departments' ? 'Departments & specialists' : 'Our doctors';
    $('deptFilter').value = selectedDept;
    renderDirectory();
  }

  if (page === 'appointments') renderAppointments();
  if (page === 'billing') updateBill();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => go(btn.dataset.nav));
});

function deptCard(d) {
  return `
    <button class="dept ${selectedDept === d[0] ? 'selected' : ''}"
      onclick="chooseDept('${d[0].replace(/'/g, "\\'")}')">
      <div class="depticon">${d[1]}</div>
      <h3>${d[0]}</h3>
      <p>${d[2]}</p>
      <span class="count">3 SPECIALISTS · VIEW TEAM →</span>
    </button>`;
}

function doctorCard(d) {
  return `
    <article class="doctor">
      <div class="doctor-top"><div class="avatar">${d.avatar}</div></div>
      <div class="doctor-body">
        <h3>${d.name}</h3>
        <div class="role">${d.dept}</div>
        <p>${d.qual} · ${d.exp} years' experience.</p>
        <div class="tags">
          <span class="tag">★ ${d.rating}</span>
          <span class="tag">${d.exp} years</span>
          <span class="tag">${d.education}</span>
        </div>
        <div class="docfoot">
          <div><strong>${money(d.fee)}</strong><small>Consultation fee</small></div>
          <button class="primary" onclick="showDoctor(${d.id})">View profile →</button>
        </div>
      </div>
    </article>`;
}

function renderHome() {
  $('homeDepts').innerHTML = depts.slice(0, 6).map(deptCard).join('');
  $('homeDoctors').innerHTML = doctors.slice(0, 3).map(doctorCard).join('');
}

function renderDirectory() {
  const q = $('searchInput').value.toLowerCase().trim();
  const dept = $('deptFilter').value;
  const sort = $('sortFilter').value;

  $('allDepts').innerHTML = depts.filter(d =>
    (dept === 'all' || d[0] === dept) &&
    (!q || d.join(' ').toLowerCase().includes(q))
  ).map(deptCard).join('');

  let arr = doctors.filter(d =>
    (dept === 'all' || d.dept === dept) &&
    (selectedDept === 'all' || d.dept === selectedDept) &&
    (!q || [d.name,d.dept,d.qual,d.education].join(' ').toLowerCase().includes(q))
  );

  if (sort === 'fee') arr.sort((a,b) => a.fee - b.fee);
  if (sort === 'experience') arr.sort((a,b) => b.exp - a.exp);
  if (sort === 'name') arr.sort((a,b) => a.name.localeCompare(b.name));

  $('allDoctors').innerHTML = arr.length
    ? arr.map(doctorCard).join()
    : '<div class="empty">No results found. Try another search.</div>';
}

function chooseDept(name) {
  selectedDept = selectedDept === name ? 'all' : name;
  $('deptFilter').value = selectedDept;
  go('departments');
}

function showDoctor(id) {
  const d = doctors.find(doc => doc.id === id);
  if (!d) return;

  $('profileContent').innerHTML = `
    <section class="panel">
      <div class="profilehead">
        <div class="bigavatar">${d.avatar}</div>
        <div>
          <div class="eyebrow">${d.icon} ${d.dept}</div>
          <h1>${d.name}</h1>
          <p>${d.qual} · ${d.exp} years of experience</p>
          <div class="tags"><span class="tag">★ ${d.rating}</span></div>
        </div>
      </div>
    </section>
    <div class="profilegrid">
      <section class="panel">
        <h2>Doctor profile</h2>
        <p>${d.bio}</p>
        ${info('Specialty', d.dept)}
        ${info('Qualifications', d.qual)}
        ${info('Medical education', d.education)}
        ${info('Registration ID', d.registration)}
        ${info('Languages', d.languages)}
        ${info('Experience', d.exp + ' years')}
        ${info('Consultation hours', d.hours)}
        <p class="smallmuted">This is an illustrative sample profile.</p>
      </section>
      <aside class="bookbox">
        <h3>Consultation fee: ${money(d.fee)}</h3>
        <button class="primary" onclick="bookDoctor(${d.id})">Book appointment →</button>
      </aside>
    </div>`;

  go('profile');
}

function info(label, value) {
  return `<div class="infoitem"><small>${label}</small><strong>${value}</strong></div>`;
}

function bookDoctor(id) {
  const d = doctors.find(doc => doc.id === id);
  if (!d) return;

  go('appointments');
  $('appointmentDept').value = d.dept;
  updateAppointmentDoctors();
  $('appointmentDoctor').value = String(d.id);
  $('appointmentPatient').focus();
}

function readAppointments() {
  try {
    return JSON.parse(localStorage.getItem('syntraxsAppointments') || '[]');
  } catch {
    return [];
  }
}

function writeAppointments(items) {
  localStorage.setItem('syntraxsAppointments', JSON.stringify(items));
}

function updateAppointmentDoctors() {
  const dept = $('appointmentDept').value;
  $('appointmentDoctor').innerHTML = doctors
    .filter(d => d.dept === dept)
    .map(d => `<option value="${d.id}">${d.name} · ${money(d.fee)}</option>`)
    .join('');
}

function saveAppointment() {
  const name = $('appointmentPatient').value.trim();
  const date = $('appointmentDate').value;
  const doctor = doctors.find(d => d.id === Number($('appointmentDoctor').value));

  if (!name) return alert('Please enter the patient name.');
  if (!date || date < today()) return alert('Please choose today or a future date.');
  if (!doctor) return alert('Please choose a doctor.');

  const items = readAppointments();
  items.unshift({
    id: 'APT-' + Date.now().toString().slice(-8),
    name,
    date,
    doctorId: doctor.id,
    doctor: doctor.name,
    dept: doctor.dept,
    time: $('appointmentTime').value,
    visit: $('appointmentVisit').value,
    reason: $('appointmentReason').value.trim(),
    status: 'Booked'
  });

  writeAppointments(items);
  renderAppointments();
  alert('Appointment saved in this browser.');
}

function renderAppointments() {
  const items = readAppointments();

  $('appointmentList').innerHTML = items.length
    ? items.map(a => `
      <div class="infoitem">
        <strong>${a.doctor}</strong>
        <p>${a.dept}</p>
        <p>Patient: ${a.name}</p>
        <p>Date: ${a.date} · ${a.time}</p>
        <p>Visit: ${a.visit}</p>
        <span class="tag">${a.status}</span>
        <button class="secondary" onclick="cancelAppointment('${a.id}')">Cancel</button>
      </div>
    `).join('')
    : '<div class="empty">No appointments yet.</div>';
}

function cancelAppointment(id) {
  if (!confirm('Cancel this appointment?')) return;
  writeAppointments(readAppointments().filter(a => a.id !== id));
  renderAppointments();
}

function updateBill() {
  const prices = {
    consult:800, lab:1250, scan:2200,
    room:3500, pharmacy:650, custom:1000
  };

  const doc = doctors.find(d => d.id === Number($('billDoctor').value));
  const service = doc && $('billService').value === 'consult'
    ? doc.fee : prices[$('billService').value];

  const facility = 100;
  const extra = Math.max(0, Number($('extraCharge').value) || 0);
  const tax = Math.round((service + facility + extra) * 0.05);

  $('servicePrice').textContent = money(service);
  $('facilityPrice').textContent = money(facility);
  $('extraPrice').textContent = money(extra);
  $('taxPrice').textContent = money(tax);
  $('totalPrice').textContent = money(service + facility + extra + tax);
}

function payBill() {
  const name = $('patientName').value.trim();
  if (!name) return alert('Please enter the patient name.');

  const doc = doctors.find(d => d.id === Number($('billDoctor').value));

  $('receiptDetails').innerHTML = `
    ${info('Patient', name)}
    ${info('Service', $('billService').selectedOptions[0].text)}
    ${info('Doctor', doc ? doc.name : 'Not specified')}
    ${info('Payment method', $('payMethod').value)}
    ${info('Total', $('totalPrice').textContent)}
    ${info('Receipt reference', 'SYN-' + Date.now().toString().slice(-8))}
  `;

  go('receipt');
}

depts.forEach(d => {
  $('deptFilter').add(new Option(d[0], d[0]));
  $('appointmentDept').add(new Option(d[0], d[0]));
});

doctors.forEach(d => {
  $('billDoctor').add(new Option(d.name + ' — ' + d.dept, d.id));
});

$('appointmentDate').min = today();
$('appointmentDate').value = today();
$('billDoctor').addEventListener('change', updateBill);

updateAppointmentDoctors();
renderHome();
renderAppointments();
updateBill();