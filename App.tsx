import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import PatientForm from './components/PatientForm';
import ResultsCard from './components/ResultsCard';
import EducationPanel from './components/EducationPanel';
import { PatientData, GrowthStats } from './types';
import { calculateFullStats, calculateAgeInMonths } from './utils/growthMath';

const INITIAL_PATIENT: PatientData = {
  dob: '2023-01-01',
  measurementDate: new Date().toISOString().split('T')[0],
  sex: 'male',
  weight: 12,
  height: 85,
};

export default function App() {
  const [patient, setPatient] = useState<PatientData>(INITIAL_PATIENT);
  const [stats, setStats] = useState<GrowthStats | null>(null);
  const [activeTab, setActiveTab] = useState<'education' | 'journal'>('education');

  const handleCalculate = () => {
    const age = calculateAgeInMonths(patient.dob, patient.measurementDate);
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
        <div className="flex gap-3 mb-6" role="tablist" aria-label="Tampilan informasi">
          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
              activeTab === 'education'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            role="tab"
            aria-selected={activeTab === 'education'}
          >
            Edukasi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
              activeTab === 'journal'
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            role="tab"
            aria-selected={activeTab === 'journal'}
          >
            Jurnal Nyeri
          </button>
        </div>

        {activeTab === 'education' ? (
          <EducationPanel />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" role="tabpanel" aria-label="Jurnal Nyeri">

            {/* Left Column: Input */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                  <strong>Catatan:</strong> Alat ini menggunakan Standar WHO untuk usia 0-24 bulan dan Grafik CDC untuk usia 2-20 tahun.
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
        )}
      </main>
    </div>
  );
}