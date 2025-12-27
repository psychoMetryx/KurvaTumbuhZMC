export type BadgeTone = 'green' | 'yellow' | 'red';

export interface MetricInterpretation {
  category: string;
  description: string;
  badgeClass: string;
}

const badgeClassMap: Record<BadgeTone, string> = {
  green: 'bg-green-100 text-green-800 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red: 'bg-red-100 text-red-800 border-red-200',
};

export const getMetricInterpretation = (
  percentile: number,
  zScore: number,
): MetricInterpretation => {
  const isHigh = zScore >= 0;

  if (percentile <= 3 || zScore <= -3 || percentile >= 97 || zScore >= 3) {
    return {
      category: isHigh ? 'Sangat tinggi' : 'Sangat rendah',
      description: isHigh
        ? 'Nilai sangat jauh di atas median (≈2 SD atau lebih); evaluasi risiko kelebihan pertumbuhan dan konteks klinis.'
        : 'Nilai sangat jauh di bawah median (≈2 SD atau lebih); pertimbangkan evaluasi gizi dan medis lebih lanjut.',
      badgeClass: badgeClassMap.red,
    };
  }

  if (percentile <= 10 || zScore <= -2 || percentile >= 90 || zScore >= 2) {
    return {
      category: isHigh ? 'Di atas rata-rata' : 'Di bawah rata-rata',
      description: isHigh
        ? 'Sekitar 2 SD di atas median; pantau tren pertumbuhan dan faktor risiko terkait.'
        : 'Sekitar 2 SD di bawah median; perlukan pemantauan tambahan terhadap pola pertumbuhan.',
      badgeClass: badgeClassMap.yellow,
    };
  }

  return {
    category: 'Dalam rentang wajar',
    description:
      'Berada di dekat median populasi rujukan dan umumnya konsisten dengan pola pertumbuhan sehat.',
    badgeClass: badgeClassMap.green,
  };
};
