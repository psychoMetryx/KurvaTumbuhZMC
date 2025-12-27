import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import PatientForm from './components/PatientForm';
import ResultsCard from './components/ResultsCard';
import { PatientData, GrowthStats } from './types';
import { calculateFullStats, calculateAgeInMonths } from './utils/growthMath';

const INITIAL_PATIENT: PatientData = {
  dob: '',
  measurementDate: '',
  ageInputMode: 'dates',
  sex: 'male',
  weight: 12,
  height: 85,
};

export default function App() {
  const [patient, setPatient] = useState<PatientData>(() => ({
    ...INITIAL_PATIENT,
    measurementDate: new Date().toISOString().split('T')[0],
  }));
  const [stats, setStats] = useState<GrowthStats | null>(null);

  const handleCalculate = () => {
    const measurementDate = patient.measurementDate || new Date().toISOString().split('T')[0];
    const age = patient.ageInputMode === 'age'
      ? patient.ageInMonths
      : patient.dob
        ? calculateAgeInMonths(patient.dob, measurementDate)
        : null;

    if (age === null || age === undefined) {
      setStats(null);
      return;
    }

    const results = calculateFullStats(patient.sex, age, patient.weight, patient.height);
    setStats(results);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-teal-500">
              GrowthCompass
            </h1>
          </div>
          <div className="text-sm text-slate-500">
            Standar CDC & WHO
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-10 lg:mb-12 text-center lg:text-left space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Kalkulator Pertumbuhan</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">GrowthCompass – Kalkulator Kurva Pertumbuhan Anak</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto lg:mx-0">
            Hitung persentil berat dan tinggi anak berdasarkan usia dan jenis kelamin untuk memahami posisi pertumbuhan menurut standar WHO dan CDC.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                <strong>Catatan:</strong> Alat ini otomatis memakai{' '}
                <a
                  href="https://www.who.int/tools/child-growth-standards"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-medium text-blue-900"
                >
                  WHO Child Growth Standards (2006)
                </a>{' '}
                untuk usia 0–24 bulan dan beralih ke{' '}
                <a
                  href="https://www.cdc.gov/growthcharts"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-medium text-blue-900"
                >
                  CDC Growth Charts (2000)
                </a>{' '}
                untuk usia 2–20 tahun.
              </div>
              <PatientForm
                data={patient}
                onChange={setPatient}
                onCalculate={handleCalculate}
              />
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <ResultsCard stats={stats} patient={patient} />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-600 space-y-2">
          <div className="font-semibold text-slate-700">Sumber Standar Pertumbuhan</div>
          <p>
            <span className="font-medium text-slate-800">WHO Child Growth Standards (2006)</span>{' '}
            (publikasi resmi WHO) digunakan otomatis untuk anak usia 0–24 bulan. Sumber: {' '}
            <a
              href="https://www.who.int/tools/child-growth-standards"
              target="_blank"
              rel="noreferrer"
              className="text-teal-700 hover:text-teal-800 font-medium"
            >
              WHO Anthro Data &amp; Publication
            </a>
            .
          </p>
          <p>
            <span className="font-medium text-slate-800">CDC Growth Charts (2000)</span>{' '}
            (rilis resmi CDC tahun 2000) diterapkan otomatis untuk anak usia 2–20 tahun. Sumber: {' '}
            <a
              href="https://www.cdc.gov/growthcharts"
              target="_blank"
              rel="noreferrer"
              className="text-teal-700 hover:text-teal-800 font-medium"
            >
              CDC Growth Charts Resources
            </a>
            .
          </p>
          <p className="text-slate-500">Standar aktif mengikuti usia: WHO (0–24 bulan) dan CDC (2–20 tahun).</p>
        </div>
      </footer>
    </div>
  );
}