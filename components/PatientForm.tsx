import React from 'react';
import { PatientData, UnitSystem } from '../types';
import { Calendar, Ruler, Scale, User, Calculator } from 'lucide-react';

interface Props {
  data: PatientData;
  onChange: (data: PatientData) => void;
  onCalculate: () => void;
}

const PatientForm: React.FC<Props> = ({ data, onChange, onCalculate }) => {
  const [unit, setUnit] = React.useState<UnitSystem>('metric');

  const handleChange = (field: keyof PatientData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  // Helpers for unit conversion display
  const displayWeight = unit === 'metric' ? data.weight : (data.weight * 2.20462).toFixed(1);
  const displayHeight = unit === 'metric' ? data.height : (data.height / 2.54).toFixed(1);

  const handleWeightChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    handleChange('weight', unit === 'metric' ? num : num / 2.20462);
  };

  const handleHeightChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    handleChange('height', unit === 'metric' ? num : num * 2.54);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" />
          Data Pasien
        </h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setUnit('metric')}
            className={`px-3 py-1 text-sm rounded-md transition-all ${unit === 'metric' ? 'bg-white shadow-sm text-teal-700 font-medium' : 'text-slate-500'}`}
          >
            Metrik
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1 text-sm rounded-md transition-all ${unit === 'imperial' ? 'bg-white shadow-sm text-teal-700 font-medium' : 'text-slate-500'}`}
          >
            Imperial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sex */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
          <div className="flex gap-4">
            <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.sex === 'male' ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500' : 'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" name="sex" className="hidden" checked={data.sex === 'male'} onChange={() => handleChange('sex', 'male')} />
              <span>Laki-laki</span>
            </label>
            <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${data.sex === 'female' ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-500' : 'border-slate-200 hover:border-slate-300'}`}>
              <input type="radio" name="sex" className="hidden" checked={data.sex === 'female'} onChange={() => handleChange('sex', 'female')} />
              <span>Perempuan</span>
            </label>
          </div>
        </div>

        {/* Dates */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input
              type="date"
              value={data.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Pengukuran</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input
              type="date"
              value={data.measurementDate}
              onChange={(e) => handleChange('measurementDate', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>

        {/* Measurements */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Berat Badan ({unit === 'metric' ? 'kg' : 'lbs'})</label>
          <div className="relative">
            <Scale className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input
              type="number"
              step="0.1"
              value={displayWeight}
              onChange={(e) => handleWeightChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tinggi Badan ({unit === 'metric' ? 'cm' : 'in'})</label>
          <div className="relative">
            <Ruler className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input
              type="number"
              step="0.1"
              value={displayHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onCalculate}
        className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        Hitung Persentil
      </button>
    </div>
  );
};

export default PatientForm;