import React from 'react';
import { Calendar, Ruler, Scale, User, Calculator, Clock } from 'lucide-react';
import { PatientData, UnitSystem } from '../types';
import { calculateAgeInMonths } from '../utils/growthMath';

interface Props {
  data: PatientData;
  onChange: (data: PatientData) => void;
  onCalculate: () => void;
}

const PatientForm: React.FC<Props> = ({ data, onChange, onCalculate }) => {
  const [unit, setUnit] = React.useState<UnitSystem>('metric');
  const ageMode = data.ageInputMode || 'dates';

  const updatePatient = (updates: Partial<PatientData>) => {
    onChange({ ...data, ...updates });
  };

  const toISODate = (date: Date) => date.toISOString().split('T')[0];
  const getMeasurementDate = () => data.measurementDate || toISODate(new Date());

  const deriveDobFromAge = (ageMonths: number, measurementDate: string) => {
    const measurement = new Date(measurementDate);
    const birthDate = new Date(measurement);
    const wholeMonths = Math.floor(ageMonths);
    const fractional = ageMonths - wholeMonths;

    birthDate.setMonth(birthDate.getMonth() - wholeMonths);

    if (fractional !== 0) {
      const daysInMonth = new Date(measurement.getFullYear(), measurement.getMonth() + 1, 0).getDate();
      birthDate.setDate(birthDate.getDate() - Math.round(daysInMonth * fractional));
    }

    return toISODate(birthDate);
  };

  const syncFromAge = (ageMonths: number, options?: { measurementDate?: string; mode?: 'dates' | 'age' }) => {
    const measurementDate = options?.measurementDate || getMeasurementDate();
    const dob = deriveDobFromAge(ageMonths, measurementDate);

    updatePatient({
      ageInMonths: ageMonths,
      measurementDate,
      dob,
      ...(options?.mode ? { ageInputMode: options.mode } : {}),
    });
  };

  const syncFromDates = (dobValue: string, measurementValue: string, options?: { mode?: 'dates' | 'age' }) => {
    if (!dobValue || !measurementValue) {
      updatePatient({
        dob: dobValue,
        measurementDate: measurementValue,
        ageInMonths: undefined,
        ...(options?.mode ? { ageInputMode: options.mode } : {}),
      });
      return;
    }

    const age = calculateAgeInMonths(dobValue, measurementValue);
    updatePatient({
      dob: dobValue,
      measurementDate: measurementValue,
      ageInMonths: age,
      ...(options?.mode ? { ageInputMode: options.mode } : {}),
    });
  };

  const handleChange = (field: keyof PatientData, value: string | number) => {
    updatePatient({ [field]: value } as Partial<PatientData>);
  };

  const handleDobChange = (value: string) => {
    const measurementDate = getMeasurementDate();
    syncFromDates(value, measurementDate, { mode: 'dates' });
  };

  const handleMeasurementDateChange = (value: string) => {
    if (ageMode === 'age' && data.ageInMonths !== undefined) {
      syncFromAge(data.ageInMonths, { measurementDate: value || getMeasurementDate(), mode: 'age' });
      return;
    }

    syncFromDates(data.dob, value, { mode: 'dates' });
  };

  const handleAgeChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    syncFromAge(num, { mode: 'age' });
  };

  const handleAgeModeChange = (mode: 'dates' | 'age') => {
    if (mode === ageMode) return;

    if (mode === 'age') {
      if (data.ageInMonths !== undefined) {
        syncFromAge(data.ageInMonths, { mode: 'age' });
        return;
      }

      if (data.dob) {
        const measurementDate = getMeasurementDate();
        const age = calculateAgeInMonths(data.dob, measurementDate);
        updatePatient({ ageInputMode: 'age', measurementDate, ageInMonths: age });
        return;
      }

      syncFromAge(6, { mode: 'age' });
      return;
    }

    const measurementDate = getMeasurementDate();
    if (!data.dob && data.ageInMonths !== undefined) {
      const dob = deriveDobFromAge(data.ageInMonths, measurementDate);
      updatePatient({ ageInputMode: 'dates', measurementDate, dob });
      return;
    }

    updatePatient({ ageInputMode: 'dates', measurementDate });
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

  const handlePresetAge = (months: number) => {
    syncFromAge(months, { mode: ageMode });
  };

  const isCalculateDisabled = ageMode === 'age' ? !data.ageInMonths : !data.dob;

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

        {/* Age input options */}
        <div className="col-span-1 md:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Metode Input Usia</label>
              <p className="text-xs text-slate-500">Gunakan tanggal lahir & pengukuran atau masukkan usia langsung.</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => handleAgeModeChange('dates')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${ageMode === 'dates' ? 'bg-white shadow-sm text-teal-700 font-medium' : 'text-slate-500'}`}
              >
                Tanggal
              </button>
              <button
                onClick={() => handleAgeModeChange('age')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${ageMode === 'age' ? 'bg-white shadow-sm text-teal-700 font-medium' : 'text-slate-500'}`}
              >
                Usia langsung
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[6, 12, 24].map((months) => (
              <button
                key={months}
                onClick={() => handlePresetAge(months)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${data.ageInMonths === months ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                {months} bln
              </button>
            ))}
          </div>
        </div>

        {ageMode === 'dates' ? (
          <>
            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={data.dob || ''}
                  onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">Isi tanggal lahir pasien untuk menghitung usia secara otomatis.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Pengukuran</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={data.measurementDate || ''}
                  onChange={(e) => handleMeasurementDateChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">Pilih tanggal saat tinggi dan berat diukur.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usia (bulan)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  value={data.ageInMonths ?? ''}
                  placeholder="cth: 6, 12, 18"
                  onChange={(e) => handleAgeChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">Sesuaikan usia atau gunakan preset di atas.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Pengukuran</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={data.measurementDate || ''}
                  onChange={(e) => handleMeasurementDateChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">Tanggal lahir akan disesuaikan otomatis dari usia.</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Perkiraan Tanggal Lahir</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={data.dob || ''}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500"
                />
                <p className="mt-1 text-xs text-slate-500">Beralih ke mode tanggal jika ingin mengubahnya secara manual.</p>
              </div>
            </div>
          </>
        )}

        {/* Measurements */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Berat Badan ({unit === 'metric' ? 'kg (kilogram)' : 'lbs (pound)'})
          </label>
          <div className="relative">
            <Scale className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input
              type="number"
              step="0.1"
              value={displayWeight}
              placeholder="cth: 12.4 kg / 27.3 lbs"
              onChange={(e) => handleWeightChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tinggi Badan ({unit === 'metric' ? 'cm (sentimeter)' : 'in (inci)'})
          </label>
          <div className="relative">
            <Ruler className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input
              type="number"
              step="0.1"
              value={displayHeight}
              placeholder="cth: 85 cm / 33.5 in"
              onChange={(e) => handleHeightChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onCalculate}
        disabled={isCalculateDisabled}
        className={`w-full mt-8 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
          isCalculateDisabled
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700'
        }`}
      >
        <Calculator className="w-5 h-5" />
        Hitung Persentil
      </button>
    </div>
  );
};

export default PatientForm;
