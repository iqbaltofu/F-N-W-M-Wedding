// Backend RSVP & ucapan: simpan ke Google Sheets.
const SHEET = 'Ucapan';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET);
  if (!s) { s = ss.insertSheet(SHEET); s.appendRow(['Waktu', 'Nama', 'Kehadiran', 'Jumlah', 'Ucapan']); }
  return s;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
// Menerima kiriman dari form undangan
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  sheet_().appendRow([new Date(), d.n, d.a, d.num, d.m]);
  return json_({ ok: true });
}
// Mengirim 50 ucapan terakhir ke halaman undangan
function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  return json_(rows.map(r => ({ n: r[1], a: r[2], m: r[4] })).slice(-50));
}
