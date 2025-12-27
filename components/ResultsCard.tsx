import React, { Suspense, useMemo } from 'react';
import { Activity } from 'lucide-react';
import { getMetricInterpretation } from '../utils/interpretation';
import { GrowthStats, PatientData } from '../types';

const PercentileChart = React.lazy(() => import('./PercentileChart'));

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

  const renderMetricCard = (title: string, percentile: number, zScore: number) => {
    const interpretation = getMetricInterpretation(percentile, zScore);

    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase">{title}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-2xl font-bold text-slate-800">{percentile.toFixed(1)}</p>
          <span className={`text-xs px-2 py-0.5 rounded border ${interpretation.badgeClass}`}>
            Z: {zScore.toFixed(2)}
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded border ${interpretation.badgeClass}`}>
            {interpretation.category}
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-2 leading-snug">{interpretation.description}</p>
      </div>
    );
  };

  const chartConfigs = useMemo(
    () => [
      {
        title: 'Grafik Berat terhadap Usia',
        metric: 'weight' as const,
        patientValue: patient.weight,
      },
      {
        title: 'Grafik Tinggi terhadap Usia',
        metric: 'height' as const,
        patientValue: patient.height,
      },
      {
        title: 'Grafik IMT (BMI) terhadap Usia',
        metric: 'bmi' as const,
        patientValue: stats.bmi,
      },
    ],
    [patient.height, patient.weight, stats.bmi],
  );

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Usia Akurat</p>
          <p className="text-2xl font-bold text-slate-800">
            {stats.ageInMonths.toFixed(1)}{' '}
            <span className="text-sm font-normal text-slate-500">bulan</span>
          </p>
        </div>
        {renderMetricCard('Persentil Berat', stats.weightPercentile, stats.weightZ)}
        {renderMetricCard('Persentil Tinggi', stats.heightPercentile, stats.heightZ)}
        {renderMetricCard('Persentil IMT', stats.bmiPercentile, stats.bmiZ)}
      </div>

      {/* Charts - Single Column Stacked */}
      <div className="flex flex-col gap-8">
        <Suspense
          fallback={(
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-slate-500 text-sm">
              Memuat grafik pertumbuhan...
            </div>
          )}
        >
          {chartConfigs.map((chart) => (
            <div key={chart.metric} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
              <h4 className="font-semibold text-slate-700 mb-2 px-2 pt-2">{chart.title}</h4>
              <PercentileChart
                sex={patient.sex}
                ageInMonths={stats.ageInMonths}
                metric={chart.metric}
                patientValue={chart.patientValue}
              />
            </div>
          ))}
        </Suspense>
      </div>
    </div>
  );
};

export default ResultsCard;
