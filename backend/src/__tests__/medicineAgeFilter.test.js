const { getAgeInMonths, yearsToMonths, filterMedicinesByAge } = require('../services/medicineAgeFilter.service');

describe('Medicine Age Filter Service', () => {
  describe('getAgeInMonths()', () => {
    it('calculates age in months from a date of birth', () => {
      const now = new Date();
      const dob = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
      expect(getAgeInMonths(dob)).toBe(36);
    });

    it('returns 0 when date of birth is missing', () => {
      expect(getAgeInMonths(null)).toBe(0);
    });
  });

  describe('yearsToMonths()', () => {
    it('converts years to months', () => {
      expect(yearsToMonths(5)).toBe(60);
      expect(yearsToMonths('2.5')).toBe(30);
    });
  });

  describe('filterMedicinesByAge()', () => {
    const medicines = [
      {
        brandName: 'Child Syrup',
        ageRestriction: { minAgeMonths: 12, maxAgeMonths: 71, category: 'child' },
        dosageByAge: [
          { label: '1-6 years', minAgeMonths: 12, maxAgeMonths: 71, dosage: '5ml twice daily', notes: 'After meals' },
        ],
      },
      {
        brandName: 'Adult Tablet',
        ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
        dosageByAge: [
          { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet once daily', notes: '' },
        ],
      },
      {
        brandName: 'Universal Supplement',
      },
    ];

    it('filters out medicines outside the patient age range and adds recommendedDosage', () => {
      const filtered = filterMedicinesByAge(medicines, 60);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((m) => m.brandName)).toEqual(expect.arrayContaining(['Child Syrup', 'Universal Supplement']));
      expect(filtered.find((m) => m.brandName === 'Child Syrup').recommendedDosage).toEqual(
        expect.objectContaining({ dosage: '5ml twice daily' })
      );
      expect(filtered.find((m) => m.brandName === 'Universal Supplement').recommendedDosage).toBeNull();
    });

    it('includes all medicines when no ageRestriction is defined', () => {
      const filtered = filterMedicinesByAge(medicines, 10);
      expect(filtered.map((m) => m.brandName)).toEqual(expect.arrayContaining(['Universal Supplement']));
    });
  });
});
