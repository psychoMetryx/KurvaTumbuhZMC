import { getLMSForAge } from '../constants';
import { Sex, LMSDataPoint } from '../types';

// Standard Normal CDF
const cdf = (x: number): number => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) return 1 - prob;
  return prob;
};

// Calculate Z-score using LMS method
// Z = ((X/M)^L - 1) / (L * S)
export const calculateZScore = (value: number, lms: LMSDataPoint): number => {
  const { L, M, S } = lms;
  if (L === 0) {
    return Math.log(value / M) / S;
  }
  return (Math.pow(value / M, L) - 1) / (L * S);
};

export const zScoreToPercentile = (z: number): number => {
  return cdf(z) * 100;
};

export const calculateAgeInMonths = (dob: string, measurementDate: string): number => {
  const birth = new Date(dob);
  const current = new Date(measurementDate);
  
  let months = (current.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += current.getMonth();
  
  // Adjust for days
  const dayDiff = current.getDate() - birth.getDate();
  const daysInMonth = new Date(current.getFullYear(), current.getMonth(), 0).getDate();
  
  return Math.max(0, months + (dayDiff / daysInMonth));
};

export const calculateFullStats = (
  sex: Sex,
  ageInMonths: number,
  weight: number,
  height: number,
  hc?: number
) => {
    // 1. Weight for Age
    const weightLMS = getLMSForAge(sex, 'weight', ageInMonths);
    const weightZ = calculateZScore(weight, weightLMS);
    const weightP = zScoreToPercentile(weightZ);

    // 2. Height for Age
    const heightLMS = getLMSForAge(sex, 'height', ageInMonths);
    const heightZ = calculateZScore(height, heightLMS);
    const heightP = zScoreToPercentile(heightZ);

    // 3. BMI (Weight / Height^2)
    const heightM = height / 100; // cm to m
    const bmi = weight / (heightM * heightM);
    
    // BMI for age (only relevant usually > 2 years, but we calculate for all for demo)
    const bmiLMS = getLMSForAge(sex, 'bmi', ageInMonths);
    const bmiZ = calculateZScore(bmi, bmiLMS);
    const bmiP = zScoreToPercentile(bmiZ);

    return {
        ageInMonths,
        weightPercentile: weightP,
        weightZ,
        heightPercentile: heightP,
        heightZ,
        bmi,
        bmiPercentile: bmiP,
        bmiZ,
        // Head Circumference could be added similarly
    };
};
