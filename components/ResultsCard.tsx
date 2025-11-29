import React from 'react';
import { GrowthStats, PatientData } from '../types';
import PercentileChart from './PercentileChart';
import { Activity } from 'lucide-react';

interface Props {
  stats: GrowthStats | null;
  patient: PatientData;
}

const ResultsCard: React.FC<Props> = ({ stats, patient }) => {
  if (!stats) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-slate-400">
        <Activity className="w-16 h-16 mb-4 opacity-20" />
        <p>Masukkan data pasien dan tekan hitung untuk melihat hasil.</p>
      </div>
    );
  }

  const getBadgeColor = (p: number) => {
    if (p < 5 || p > 95) return 'bg-red-100 text-red-800 border-red-200';
    if (p < 15 || p > 85) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Usia Akurat</p>
          <p className="text-2xl font-bold text-slate-800">{stats.ageInMonths.toFixed(1)} <span className="text-sm font-normal text-slate-500">bulan</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Persentil Berat</p>
          <div className="flex items-center gap-2">
             <p className="text-2xl font-bold text-slate-800">{stats.weightPercentile.toFixed(1)}</p>
             <span className={`text-xs px-2 py-0.5 rounded border ${getBadgeColor(stats.weightPercentile)}`}>
               Z: {stats.weightZ.toFixed(2)}
             </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Persentil Tinggi</p>
          <div className="flex items-center gap-2">
             <p className="text-2xl font-bold text-slate-800">{stats.heightPercentile.toFixed(1)}</p>
             <span className={`text-xs px-2 py-0.5 rounded border ${getBadgeColor(stats.heightPercentile)}`}>
               Z: {stats.heightZ.toFixed(2)}
             </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Persentil IMT</p>
          <div className="flex items-center gap-2">
             <p className="text-2xl font-bold text-slate-800">{stats.bmiPercentile.toFixed(1)}</p>
             <span className={`text-xs px-2 py-0.5 rounded border ${getBadgeColor(stats.bmiPercentile)}`}>
               Z: {stats.bmiZ.toFixed(2)}
             </span>
          </div>
        </div>
      </div>

      {/* Charts - Single Column Stacked */}
      <div className="flex flex-col gap-8">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-2 px-2 pt-2">Grafik Berat terhadap Usia</h4>
            <PercentileChart 
                sex={patient.sex} 
                ageInMonths={stats.ageInMonths} 
                metric="weight" 
                patientValue={patient.weight} 
            />
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-2 px-2 pt-2">Grafik Tinggi terhadap Usia</h4>
            <PercentileChart 
                sex={patient.sex} 
                ageInMonths={stats.ageInMonths} 
                metric="height" 
                patientValue={patient.height} 
            />
        </div>
         <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-2 px-2 pt-2">Grafik IMT (BMI) terhadap Usia</h4>
            <PercentileChart 
                sex={patient.sex} 
                ageInMonths={stats.ageInMonths} 
                metric="bmi" 
                patientValue={stats.bmi} 
            />
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;