/* ============ DATA UNDANGAN: EDIT DI SINI SAJA ============ */
const C = {
  cover: "",                       // URL foto cover/hero, kosongkan untuk gradien

  // Dua pasang mempelai, ditampilkan berurutan di bagian "Mempelai"
  couples: [
    {
      nick: "Faiz & Nita",
      groom: { name: "Muhammad Faiz Rizkia Ilhamy", child: "Putra dari Bapak Sudarsono & Ibu Sriyati, M.Pd.<br><small>Guyangan Kauman RT 01 RW 06, Bangsri, Jepara, Jawa Tengah</small>", photo: "assets/foto/foto.jpeg" },
      bride: { name: "Anita Mazidah, AH.", child: "Putri dari Bapak Askandar & Ibu Ma'rufah<br><small>Guyangan Seberuk RT 02 RW 09, Bangsri, Jepara, Jawa Tengah</small>", photo: "assets/foto/foto2.jpeg" }
    },
    {
      nick: "Wahyu & Mila",
      groom: { name: "Muhammad Iqbal Wahyu Rizaldi, S.Hub.Int.", child: "Putra dari Bapak Sudarsono & Ibu Sriyati, M.Pd.<br><small>Guyangan Kauman RT 01 RW 06, Bangsri, Jepara, Jawa Tengah</small>", photo: "assets/foto/foto3.jpeg" },
      bride: { name: "Milatuzzulfa, S.Pd.", child: "Putri dari Bapak H. Toip (Alm.) & Ibu Hj. Sumarti<br><small>Desa Pepedan RT 01 RW 01, Moga, Pemalang, Jawa Tengah</small>", photo: "assets/foto/foto4.jpeg" }
    }
  ],

  // Acara digabung: satu waktu & tempat untuk kedua pasangan (akad tidak ditampilkan)
  event: {
    title: "Resepsi Pernikahan",
    dateLabel: "Sabtu, 03 Oktober 2026",
    date: "2026-10-03T19:00:00+07:00",   // dipakai untuk countdown & kalender
    time: "19.00 WIB – Selesai",
    place: "Rumah Mempelai Pria",
    addr: "Jl. Timur Perempatan Sukun, Guyangan Kauman RT 01 RW 06, Bangsri, Jepara, Jawa Tengah",
    map: "https://maps.app.goo.gl/yoWrunErMtxYnacw7"
  },

  gifts: [
    { bank: "BSI", no: "7339121723", name: "a.n. Sriyati" }
  ],
  address: "Alamat pengiriman tanda kasih: PAUD Mutiara Hati, Jl. Timur Perempatan Sukun, Guyangan RT 01 RW 06, Bangsri, Jepara",
  api: "https://script.google.com/macros/s/AKfycbwVyWH4iqFGC7sIoU3Tw0kzQwUDwycoXjqTHkRpKYIipiXhvGkoGq5ZabsAvqo2U_0F/exec", // URL Web App Apps Script, kosongkan bila tidak dipakai
  wa: "6285226371180",             // nomor WhatsApp untuk RSVP (format 62..., tanpa +)
  music: "assets/musik/lagu.mp3"   // path file mp3, kosongkan bila tidak ada
};
/* ========================================================== */

const $ = s => document.querySelector(s);

// Nama tamu dari ?to=
const to = new URLSearchParams(location.search).get('to');
if (to) $('#guest').textContent = to.replace(/[-_+]/g, ' ');

// Nama gabungan (dua baris) di cover & home
document.querySelectorAll('[data-bind=nick]').forEach(e => e.innerHTML = C.couples.map(c => c.nick).join('<br>'));

// Tanggal & foto cover
$('#dateText').textContent = C.event.dateLabel;
if (C.cover) document.documentElement.style.setProperty('--cover', `url("${C.cover}")`);

// Mempelai: dua pasang berurutan
const person = p => `<div><div class="photo"><div class="ph" style="${p.photo ? `background-image:url('${p.photo}')` : ''}"></div></div><h3>${p.name}</h3><p>${p.child}</p></div>`;
$('#couples').innerHTML = C.couples.map(c => `
  <div class="wrap">
    <h2>${c.nick}</h2>
    <div class="pair">${person(c.groom)}<div class="amp">&amp;</div>${person(c.bride)}</div>
  </div>`
).join('<hr style="border:none;border-top:1px solid rgba(185,154,95,.4);margin:48px auto;max-width:200px">');

// Acara: satu kartu bersama
$('#eventList').innerHTML = `<div class="card"><h3>${C.event.title}</h3><p>${C.event.dateLabel}</p><p>${C.event.time}</p><p style="margin-top:10px"><b>${C.event.place}</b></p><p>${C.event.addr}</p><a class="btn" href="${C.event.map}" target="_blank" rel="noopener">Buka Peta</a></div>`;

// Hadiah
$('#giftList').innerHTML = C.gifts.map(g => `<div class="gift"><p>${g.bank}</p><b>${g.no}</b><p>${g.name}</p><button class="btn" data-copy="${g.no}">Salin Nomor</button></div>`).join('') + `<div class="gift"><p>${C.address}</p></div>`;
$('#giftList').addEventListener('click', e => {
  const b = e.target.closest('[data-copy]'); if (!b) return;
  navigator.clipboard.writeText(b.dataset.copy).then(() => { b.textContent = 'Tersalin'; setTimeout(() => b.textContent = 'Salin Nomor', 1800); });
});

// Countdown ke acara
const target = new Date(C.event.date).getTime();
function tick() {
  let d = Math.max(0, target - Date.now()) / 1000;
  const v = [['Hari', 86400], ['Jam', 3600], ['Menit', 60], ['Detik', 1]].map(([l, s]) => { const n = Math.floor(d / s); d -= n * s; return `<div><b>${String(n).padStart(2, '0')}</b><span>${l}</span></div>`; });
  $('#count').innerHTML = v.join('');
}
tick(); setInterval(tick, 1000);

// Simpan ke Google Calendar
const fmt = t => new Date(t).toISOString().replace(/[-:]|\.\d{3}/g, '');
const namaGabungan = C.couples.map(c => c.nick).join(' & ');
$('#saveDate').href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan ' + namaGabungan)}&dates=${fmt(target)}/${fmt(target + 6 * 3600e3)}&details=${encodeURIComponent('Undangan pernikahan ' + namaGabungan)}`;

// Buka undangan + musik
const audio = $('#audio'), mb = $('#music');
if (C.music) audio.src = C.music; else mb.style.display = 'none';
$('#openBtn').onclick = () => {
  $('#cover').classList.add('hide'); document.body.classList.add('open');
  if (C.music) { audio.play().then(() => mb.classList.add('spin')).catch(() => {}); }
  window.scrollTo(0, 0);
};
mb.onclick = () => { if (audio.paused) { audio.play(); mb.classList.add('spin'); } else { audio.pause(); mb.classList.remove('spin'); } };
if (!C.music) new MutationObserver(() => mb.style.display = 'none').observe(document.body, { attributes: true });

// RSVP + ucapan
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let wishes = [];
try { wishes = JSON.parse(localStorage.getItem('wishes') || '[]'); } catch (e) {}
function showWishes() {
  $('#wishes').innerHTML = wishes.slice().reverse().map(w => `<div class="wish"><b>${esc(w.n)}</b> <small>${esc(w.a)}</small><p>${esc(w.m)}</p></div>`).join('');
}
showWishes();
if (C.api) fetch(C.api).then(r => r.json()).then(d => { wishes = d; showWishes(); }).catch(() => {});
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const w = { n: $('#fName').value.trim(), a: $('#fAtt').value, m: $('#fMsg').value.trim() };
  wishes.push(w);
  try { localStorage.setItem('wishes', JSON.stringify(wishes)); } catch (er) {}
  showWishes();
  if (C.api) { fetch(C.api, { method: 'POST', body: JSON.stringify({ ...w, num: $('#fNum').value }) }).catch(() => {}); e.target.reset(); return; }
  const text = `Halo, saya ${w.n}. Konfirmasi: ${w.a} (${$('#fNum').value} orang).\nUcapan: ${w.m}`;
  window.open(`https://wa.me/${C.wa}?text=${encodeURIComponent(text)}`, '_blank');
  e.target.reset();
});

// Kelopak berjatuhan
const pt = document.createElement('div');
pt.id = 'petals';
document.body.appendChild(pt);
for (let i = 0; i < 14; i++) {
  const p = document.createElement('i');
  p.className = 'petal';
  p.style.cssText = `left:${Math.random() * 100}%;width:${8 + Math.random() * 8}px;height:${10 + Math.random() * 10}px;opacity:${.35 + Math.random() * .4};--d:${9 + Math.random() * 8}s;--s:${2 + Math.random() * 2}s;animation-delay:-${Math.random() * 12}s,0s`;
  pt.appendChild(p);
}
