/**
 * Calculates a patient's age in months from their date of birth.
 */
function getAgeInMonths(dateOfBirth) {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let months = (now.getFullYear() - dob.getFullYear()) * 12;
  months += now.getMonth() - dob.getMonth();
  if (now.getDate() < dob.getDate()) months -= 1;
  return Math.max(months, 0);
}

/**
 * Converts age in years to months.
 */
function yearsToMonths(ageInYears) {
  return Number(ageInYears) * 12;
}

/**
 * Filters a list of medicine documents by patient age and attaches
 * the matched dosage block if available.
 */
function filterMedicinesByAge(medicines, patientAgeInMonths) {
  if (!Array.isArray(medicines)) return [];

  return medicines
    .filter((medicine) => {
      const restriction = medicine.ageRestriction;
      if (!restriction) return true;

      const { minAgeMonths = 0, maxAgeMonths } = restriction;
      if (patientAgeInMonths < minAgeMonths) return false;
      if (maxAgeMonths !== null && maxAgeMonths !== undefined && patientAgeInMonths > maxAgeMonths) {
        return false;
      }
      return true;
    })
    .map((medicine) => {
      const medObj = medicine.toObject ? medicine.toObject() : medicine;
      const matchedDosage = (medObj.dosageByAge || []).find(
        (entry) =>
          patientAgeInMonths >= entry.minAgeMonths &&
          (entry.maxAgeMonths === null || entry.maxAgeMonths === undefined || patientAgeInMonths <= entry.maxAgeMonths)
      );

      return {
        ...medObj,
        recommendedDosage: matchedDosage || null,
      };
    });
}

module.exports = { getAgeInMonths, yearsToMonths, filterMedicinesByAge };