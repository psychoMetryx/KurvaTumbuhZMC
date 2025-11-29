import React from 'react';

const faqs = [
  {
    question: 'Kenapa memantau tumbuh kembang penting?',
    answer:
      'Berat dan panjang badan yang dipantau rutin membantu mendeteksi masalah gizi, hormon, atau kondisi medis sejak dini.',
  },
  {
    question: 'Kapan sebaiknya ukur ulang?',
    answer:
      'Untuk balita, ukur minimal sebulan sekali. Jika ada infeksi, alergi berat, atau penurunan nafsu makan, percepat evaluasi.',
  },
  {
    question: 'Apa yang perlu dibawa saat konsultasi?',
    answer:
      'Catatan berat/panjang sebelumnya, pola makan harian, riwayat imunisasi, dan obat-obatan yang sedang dikonsumsi.',
  },
];

export default function EducationPanel() {
  return (
    <section
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6"
      role="tabpanel"
      aria-label="Edukasi pertumbuhan anak"
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Edukasi Orang Tua</p>
        <h2 className="text-2xl font-bold text-slate-900">Pahami pola tumbuh kembang dengan tenang</h2>
        <p className="text-slate-600 leading-relaxed">
          Banyak orang tua merasa cemas melihat angka berat atau tinggi yang berubah dari bulan ke bulan. Panduan singkat ini
          membantu Anda membaca hasil pengukuran, menyiapkan pertanyaan untuk tenaga kesehatan, dan mengenali tanda yang perlu
          diperiksa lebih lanjut.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article className="bg-teal-50 border border-teal-100 rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-teal-800">Ringkasan artikel</h3>
          <p className="text-sm text-teal-900 leading-relaxed">
            Pertumbuhan wajar biasanya mengikuti jalur persentil yang relatif stabil. Jika grafik turun lebih dari dua jalur
            persentil atau anak tampak lemas, segera konsultasi. Pastikan anak mendapat protein cukup, tidur berkualitas, dan
            kesempatan bermain aktif setiap hari.
          </p>
          <ul className="text-sm text-teal-900 space-y-2 list-disc list-inside">
            <li>Gunakan pakaian ringan saat mengukur berat untuk hasil konsisten.</li>
            <li>Catat tanggal, waktu, dan alat ukur yang dipakai.</li>
            <li>Bandingkan dengan standar usia dan jenis kelamin yang sesuai.</li>
          </ul>
        </article>

        <article className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">FAQ singkat</h3>
          <dl className="space-y-3">
            {faqs.map((item) => (
              <div key={item.question} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                <dt className="text-sm font-semibold text-slate-800">{item.question}</dt>
                <dd className="text-sm text-slate-600 leading-relaxed">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white rounded-lg p-4">
        <div>
          <p className="text-sm font-semibold">Butuh panduan lebih detail?</p>
          <p className="text-sm text-slate-200">Baca artikel lengkap tentang cara membaca grafik pertumbuhan anak.</p>
        </div>
        <a
          href="https://www.who.int/tools/child-growth-standards"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-md font-semibold shadow hover:shadow-md transition"
          target="_blank"
          rel="noreferrer"
        >
          Baca selengkapnya
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
