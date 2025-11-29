
export type Sex = 'male' | 'female';
export type UnitSystem = 'metric' | 'imperial';

export interface PatientData {
  dob: string;
  measurementDate: string;
  sex: Sex;
  weight: number; // always stored in kg
  height: number; // always stored in cm
  headCircumference?: number; // always stored in cm
}

export interface GrowthStats {
  ageInMonths: number;
  weightPercentile: number;
  weightZ: number;
  heightPercentile: number;
  heightZ: number;
  bmi: number;
  bmiPercentile: number;
  bmiZ: number;
  hcPercentile?: number;
  hcZ?: number;
}

// L, M, S parameters for LMS method
export interface LMSDataPoint {
  month: number;
  L: number;
  M: number;
  S: number;
}

export interface ChartDataset {
  label: string;
  data: LMSDataPoint[];
}
