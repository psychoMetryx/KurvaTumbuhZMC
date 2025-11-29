import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Legend } from 'recharts';
import { PatientData, Sex } from '../types';
import { getLMSForAge } from '../constants';

interface Props {
  sex: Sex;
  ageInMonths: number;
  metric: 'weight' | 'height' | 'bmi';
  patientValue: number;
}

const PercentileChart: React.FC<Props> = ({ sex, ageInMonths, metric, patientValue }) => {
  
  // Generate curve data points dynamically around the patient's age
  const data = useMemo(() => {
    const points = [];
    const startAge = Math.max(0, Math.floor(ageInMonths - 12));
    const endAge = Math.ceil(ageInMonths + 12);
    
    // Generate standard deviation lines (z-scores: -2, -1, 0, 1, 2) roughly corresponding to percentiles
    // P3 ~= -1.88, P15 ~= -1.04, P50 = 0, P85 ~= 1.04, P97 ~= 1.88
    
    for (let m = startAge; m <= endAge; m++) {
      const lms = getLMSForAge(sex, metric, m);
      
      // Reverse Z-score formula to get Value from Z
      // X = M * (1 + L*S*Z)^(1/L)
      const getValue = (z: number) => {
          if (lms.L === 0) return lms.M * Math.exp(lms.S * z);
          return lms.M * Math.pow((1 + lms.L * lms.S * z), 1/lms.L);
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

  const label = metric === 'bmi' ? 'IMT (BMI)' : metric === 'height' ? 'Tinggi (cm)' : 'Berat (kg)';
  const unit = metric === 'bmi' ? '' : (metric === 'height' ? 'cm' : 'kg');

  const zScoreMap: Record<string, string> = {
    "P 3%": "-1.88",
    "P 15%": "-1.04",
    "P 50%": "0",
    "P 85%": "+1.04",
    "P 97%": "+1.88",
  };

  return (
    // Increased height to 600px
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
          <YAxis 
             label={{ value: label, angle: -90, position: 'insideLeft' }} 
             domain={['auto', 'auto']}
          />
          <Tooltip 
             labelFormatter={(value) => `Usia: ${value} bln`}
             formatter={(value: number, name: string) => {
                const z = zScoreMap[name];
                const formattedValue = value.toFixed(1);
                const valueText = `${formattedValue} ${unit}`;
                return [
                    z ? `${valueText} (Z:${z})` : valueText,
                    name
                ];
             }}
             // Tooltip styles to ensure it floats above and is compact
             contentStyle={{ 
                 borderRadius: '0.5rem', 
                 border: '1px solid #e2e8f0', 
                 boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                 backgroundColor: 'rgba(255, 255, 255, 0.95)',
                 zIndex: 100,
                 padding: '8px',
                 fontSize: '12px',
                 lineHeight: '1.2'
             }}
             itemStyle={{ paddingBottom: '2px' }}
          />
          <Legend verticalAlign="top" height={36}/>
          
          {/* Growth Curves - Reordered to Descending (Top to Bottom visual order) 
              This ensures the Tooltip lists P97 first (top) down to P3 (bottom) */}
          <Line type="monotone" dataKey="p97" stroke="#cbd5e1" strokeWidth={1} dot={false} name="P 97%" />
          <Line type="monotone" dataKey="p85" stroke="#94a3b8" strokeWidth={1} dot={false} name="P 85%" />
          <Line type="monotone" dataKey="p50" stroke="#0d9488" strokeWidth={2} dot={false} name="P 50%" />
          <Line type="monotone" dataKey="p15" stroke="#94a3b8" strokeWidth={1} dot={false} name="P 15%" />
          <Line type="monotone" dataKey="p3" stroke="#cbd5e1" strokeWidth={1} dot={false} name="P 3%" />

          {/* Patient Dot */}
          <ReferenceDot x={ageInMonths} y={patientValue} r={6} fill="#dc2626" stroke="white" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PercentileChart;