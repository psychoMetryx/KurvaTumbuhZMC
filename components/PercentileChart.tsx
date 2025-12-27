import React, { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PatientData, Sex } from '../types';
import { getLMSForAge } from '../constants';

interface Props {
  sex: Sex;
  ageInMonths: number;
  metric: 'weight' | 'height' | 'bmi';
  patientValue: number;
}

const zScoreMap: Record<string, string> = {
  'Persentil ke-3': '-1.88',
  'Persentil ke-15': '-1.04',
  'Persentil ke-50': '0',
  'Persentil ke-85': '+1.04',
  'Persentil ke-97': '+1.88',
};

const PercentileChart: React.FC<Props> = ({ sex, ageInMonths, metric, patientValue }) => {
  const data = useMemo(() => {
    const points = [];
    const startAge = Math.max(0, Math.floor(ageInMonths - 12));
    const endAge = Math.ceil(ageInMonths + 12);

    for (let m = startAge; m <= endAge; m++) {
      const lms = getLMSForAge(sex, metric, m);

      const getValue = (z: number) => {
        if (lms.L === 0) return lms.M * Math.exp(lms.S * z);
        return lms.M * Math.pow(1 + lms.L * lms.S * z, 1 / lms.L);
      };

      points.push({
        month: m,
        p3: getValue(-1.88),
        p15: getValue(-1.04),
        p50: getValue(0),
        p85: getValue(1.04),
        p97: getValue(1.88),
      });
    }

    return points;
  }, [sex, ageInMonths, metric]);

  const axisLabels = useMemo(() => {
    if (metric === 'bmi') return { label: 'IMT (BMI)', unit: '' };
    if (metric === 'height') return { label: 'Tinggi (cm)', unit: 'cm' };
    return { label: 'Berat (kg)', unit: 'kg' };
  }, [metric]);

  return (
    <div className="w-full h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            label={{ value: 'Usia (Bulan)', position: 'insideBottom', offset: -10 }}
            type="number"
            domain={['dataMin', 'dataMax']}
            allowDecimals={false}
          />
          <YAxis label={{ value: axisLabels.label, angle: -90, position: 'insideLeft' }} domain={['auto', 'auto']} />
          <Tooltip
            labelFormatter={(value) => `Usia: ${value} bln`}
            formatter={(value: number, name: string) => {
              const z = zScoreMap[name];
              const formattedValue = value.toFixed(1);
              const valueText = `${formattedValue} ${axisLabels.unit}`.trim();
              return [z ? `${valueText} (Z:${z})` : valueText, name];
            }}
            contentStyle={{
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 100,
              padding: '8px',
              fontSize: '12px',
              lineHeight: '1.2',
            }}
            itemStyle={{ paddingBottom: '2px' }}
          />
          <Legend verticalAlign="top" height={36} />

          <Line type="monotone" dataKey="p97" stroke="#0f172a" strokeWidth={2} dot={false} name="Persentil ke-97" />
          <Line type="monotone" dataKey="p85" stroke="#2563eb" strokeWidth={2} dot={false} name="Persentil ke-85" />
          <Line type="monotone" dataKey="p50" stroke="#16a34a" strokeWidth={3} dot={false} name="Persentil ke-50" />
          <Line type="monotone" dataKey="p15" stroke="#f59e0b" strokeWidth={2} dot={false} name="Persentil ke-15" />
          <Line type="monotone" dataKey="p3" stroke="#9333ea" strokeWidth={2} dot={false} name="Persentil ke-3" />

          <ReferenceDot x={ageInMonths} y={patientValue} r={6} fill="#dc2626" stroke="white" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(PercentileChart);
