require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { Branch, Department } = require('../models/Branch');
const Medicine = require('../models/Medicine');
const Appointment = require('../models/Appointment');

async function seed() {
  await connectDB();

  console.log('Clearing existing demo data...');
  await Promise.all([
    User.deleteMany({}),
    Patient.deleteMany({}),
    Doctor.deleteMany({}),
    Branch.deleteMany({}),
    Department.deleteMany({}),
    Medicine.deleteMany({}),
    Appointment.deleteMany({}),
  ]);

  const branch = await Branch.create({
    name: 'City Central Hospital',
    address: '12 MG Road',
    city: 'Bengaluru',
    contactNumber: '+91-80-1234-5678',
  });

  const department = await Department.create({
    name: 'General Medicine',
    branch: branch._id,
    description: 'General physician consultations',
  });

  const homeopathyDept = await Department.create({
    name: 'Homeopathy',
    branch: branch._id,
    description: 'Homeopathic consultations',
  });

  const adminUser = await User.create({
    fullName: 'System Admin',
    email: 'admin@hospital.com',
    mobileNumber: '+919900000001',
    password: 'Admin@1234',
    role: 'admin',
  });

  const doctorUser = await User.create({
    fullName: 'Dr. Anjali Rao',
    email: 'doctor@hospital.com',
    mobileNumber: '+919900000002',
    password: 'Doctor@1234',
    role: 'doctor',
  });

  const doctorProfile = await Doctor.create({
    user: doctorUser._id,
    qualification: 'MBBS, MD (General Medicine)',
    registrationNumber: 'KMC-2014-00231',
    department: department._id,
    specialization: 'General Medicine',
    yearsOfExperience: 10,
    consultationFee: 500,
    availability: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDurationMinutes: 15 }],
  });

  const homeopathyDoctorUser = await User.create({
    fullName: 'Dr. Priya Sharma',
    email: 'homeodoctor@hospital.com',
    mobileNumber: '+919900000010',
    password: 'Doctor@1234',
    role: 'doctor',
  });

  const homeopathyDoctorProfile = await Doctor.create({
    user: homeopathyDoctorUser._id,
    qualification: 'BHMS',
    registrationNumber: 'KMC-2016-00512',
    department: homeopathyDept._id,
    specialization: 'Homeopathy',
    yearsOfExperience: 8,
    consultationFee: 400,
    availability: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDurationMinutes: 15 }],
  });

  const receptionistUser = await User.create({
    fullName: 'Reception Desk',
    email: 'reception@hospital.com',
    mobileNumber: '+919900000003',
    password: 'Reception@1234',
    role: 'receptionist',
  });

  const pharmacistUser = await User.create({
    fullName: 'Pharmacy Staff',
    email: 'pharmacist@hospital.com',
    mobileNumber: '+919900000004',
    password: 'Pharmacist@1234',
    role: 'pharmacist',
  });

  const patientUser = await User.create({
    fullName: 'Ramesh Kumar',
    email: 'patient@hospital.com',
    mobileNumber: '+919900000005',
    password: 'Patient@1234',
    role: 'patient',
  });

  const patientProfile = await Patient.create({
    user: patientUser._id,
    patientCode: 'PT-00000001',
    dob: new Date('1990-05-15'),
    gender: 'male',
    address: { line1: '45 Residency Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560025' },
    emergencyContact: { name: 'Sita Kumar', relationship: 'Spouse', mobileNumber: '+919900000006' },
    bloodGroup: 'B+',
    allergies: ['Penicillin'],
    existingDiseases: [],
    chronicMedications: [],
    familyHistory: { diabetes: true, hypertension: false, heartDisease: false },
  });

  // SRS Module 6 example data: expanded catalogue
  await Medicine.insertMany([
    {
      brandName: 'Dolo 650',
      genericName: 'Paracetamol',
      composition: 'Paracetamol 650mg',
      manufacturer: 'Micro Labs',
      form: 'tablet',
      category: 'Analgesic/Antipyretic',
      isPenicillinBased: false,
      contraindications: ['liver_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet, up to 3x/day', notes: 'After food' },
      ],
    },
    {
      brandName: 'Crocin 650',
      genericName: 'Paracetamol',
      composition: 'Paracetamol 650mg',
      manufacturer: 'GSK',
      form: 'tablet',
      category: 'Analgesic/Antipyretic',
      isPenicillinBased: false,
      contraindications: ['liver_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet, up to 3x/day', notes: 'After food' },
      ],
    },
    {
      brandName: 'Calpol 650',
      genericName: 'Paracetamol',
      composition: 'Paracetamol 650mg',
      manufacturer: 'Sanofi',
      form: 'tablet',
      category: 'Analgesic/Antipyretic',
      isPenicillinBased: false,
      contraindications: ['liver_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet, up to 3x/day', notes: 'After food' },
      ],
    },
    {
      brandName: 'Augmentin 625',
      genericName: 'Amoxicillin + Clavulanate',
      composition: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
      manufacturer: 'GSK',
      form: 'tablet',
      category: 'Antibiotic',
      isPenicillinBased: true,
      contraindications: ['kidney_disease'],
      interactsWith: [{ composition: 'Warfarin', severity: 'moderate', note: 'May increase bleeding risk' }],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet twice daily', notes: 'Complete full course as prescribed' },
      ],
    },
    {
      brandName: 'Dolo 500',
      genericName: 'Paracetamol',
      composition: 'Paracetamol 500mg',
      manufacturer: 'Micro Labs',
      form: 'tablet',
      category: 'Analgesic/Antipyretic',
      isPenicillinBased: false,
      contraindications: ['liver_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet every 6-8 hours as needed', notes: 'Do not exceed 4 tablets in 24 hours' },
      ],
    },
    {
      brandName: 'Crocin Advance',
      genericName: 'Paracetamol',
      composition: 'Paracetamol 500mg',
      manufacturer: 'GSK',
      form: 'tablet',
      category: 'Analgesic/Antipyretic',
      isPenicillinBased: false,
      contraindications: ['liver_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet every 6-8 hours as needed', notes: 'Do not exceed 4 tablets in 24 hours' },
      ],
    },
    {
      brandName: 'Benadryl',
      genericName: 'Diphenhydramine',
      composition: 'Diphenhydramine Hydrochloride 12.5mg/5ml',
      manufacturer: 'Johnson & Johnson',
      form: 'syrup',
      category: 'Antihistamine',
      isPenicillinBased: false,
      contraindications: ['glaucoma'],
      ageRestriction: { minAgeMonths: 24, maxAgeMonths: null, category: 'child' },
      dosageByAge: [
        { label: '2-5 years', minAgeMonths: 24, maxAgeMonths: 59, dosage: '5ml twice daily', notes: 'Take with food if stomach upset occurs' },
        { label: '6+ years', minAgeMonths: 72, maxAgeMonths: null, dosage: '10ml twice daily', notes: 'Take after food' },
      ],
    },
    {
      brandName: 'Phenadryl',
      genericName: 'Diphenhydramine',
      composition: 'Diphenhydramine Hydrochloride 12.5mg/5ml',
      manufacturer: 'Cipla',
      form: 'syrup',
      category: 'Antihistamine',
      isPenicillinBased: false,
      contraindications: ['glaucoma'],
      ageRestriction: { minAgeMonths: 24, maxAgeMonths: null, category: 'child' },
      dosageByAge: [
        { label: '2-5 years', minAgeMonths: 24, maxAgeMonths: 59, dosage: '5ml twice daily', notes: 'Take with food if stomach upset occurs' },
        { label: '6+ years', minAgeMonths: 72, maxAgeMonths: null, dosage: '10ml twice daily', notes: 'Take after food' },
      ],
    },
    {
      brandName: 'Cetzine',
      genericName: 'Cetirizine',
      composition: 'Cetirizine Hydrochloride 10mg',
      manufacturer: 'GSK',
      form: 'tablet',
      category: 'Antihistamine',
      isPenicillinBased: false,
      contraindications: [],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet once daily', notes: 'Preferably at bedtime' },
      ],
    },
    {
      brandName: 'Alerid',
      genericName: 'Cetirizine',
      composition: 'Cetirizine Hydrochloride 10mg',
      manufacturer: 'Cipla',
      form: 'tablet',
      category: 'Antihistamine',
      isPenicillinBased: false,
      contraindications: [],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet once daily', notes: 'Preferably at bedtime' },
      ],
    },
    {
      brandName: 'Okacet',
      genericName: 'Cetirizine',
      composition: 'Cetirizine Hydrochloride 10mg',
      manufacturer: 'Cipla',
      form: 'tablet',
      category: 'Antihistamine',
      isPenicillinBased: false,
      contraindications: [],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet once daily', notes: 'Preferably at bedtime' },
      ],
    },
    {
      brandName: 'Amoxil',
      genericName: 'Amoxicillin',
      composition: 'Amoxicillin 500mg',
      manufacturer: 'GSK',
      form: 'capsule',
      category: 'Antibiotic',
      isPenicillinBased: true,
      contraindications: ['penicillin_allergy'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 capsule thrice daily', notes: 'Complete full course' },
      ],
    },
    {
      brandName: 'Novamox',
      genericName: 'Amoxicillin',
      composition: 'Amoxicillin 500mg',
      manufacturer: 'Cipla',
      form: 'capsule',
      category: 'Antibiotic',
      isPenicillinBased: true,
      contraindications: ['penicillin_allergy'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 capsule thrice daily', notes: 'Complete full course' },
      ],
    },
    {
      brandName: 'Mox',
      genericName: 'Amoxicillin',
      composition: 'Amoxicillin 500mg',
      manufacturer: 'Ranbaxy',
      form: 'capsule',
      category: 'Antibiotic',
      isPenicillinBased: true,
      contraindications: ['penicillin_allergy'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 capsule thrice daily', notes: 'Complete full course' },
      ],
    },
    {
      brandName: 'Azithral 500',
      genericName: 'Azithromycin',
      composition: 'Azithromycin 500mg',
      manufacturer: 'Alembic',
      form: 'tablet',
      category: 'Antibiotic',
      isPenicillinBased: false,
      contraindications: ['liver_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet once daily', notes: 'Take with food' },
      ],
    },
    {
      brandName: 'Zithromax',
      genericName: 'Azithromycin',
      composition: 'Azithromycin 500mg',
      manufacturer: 'Pfizer',
      form: 'tablet',
      category: 'Antibiotic',
      isPenicillinBased: false,
      contraindications: ['liver_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet once daily', notes: 'Take with food' },
      ],
    },
    {
      brandName: 'Brufen 400',
      genericName: 'Ibuprofen',
      composition: 'Ibuprofen 400mg',
      manufacturer: 'Abbott',
      form: 'tablet',
      category: 'NSAID',
      isPenicillinBased: false,
      contraindications: ['kidney_disease', 'peptic_ulcer'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet every 8 hours', notes: 'Take with food' },
      ],
    },
    {
      brandName: 'Combiflam',
      genericName: 'Ibuprofen + Paracetamol',
      composition: 'Ibuprofen 400mg + Paracetamol 325mg',
      manufacturer: 'Sanofi',
      form: 'tablet',
      category: 'NSAID/Analgesic',
      isPenicillinBased: false,
      contraindications: ['kidney_disease', 'peptic_ulcer', 'liver_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet every 8 hours', notes: 'Take with food and do not exceed 4 tablets in 24 hours' },
      ],
    },
    {
      brandName: 'Omez',
      genericName: 'Omeprazole',
      composition: 'Omeprazole 20mg',
      manufacturer: "Dr. Reddy's",
      form: 'capsule',
      category: 'Proton Pump Inhibitor',
      isPenicillinBased: false,
      contraindications: [],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 capsule once daily before breakfast', notes: 'Take at least 30 minutes before food' },
      ],
    },
    {
      brandName: 'Prilosec',
      genericName: 'Omeprazole',
      composition: 'Omeprazole 20mg',
      manufacturer: 'AstraZeneca',
      form: 'capsule',
      category: 'Proton Pump Inhibitor',
      isPenicillinBased: false,
      contraindications: [],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 capsule once daily before breakfast', notes: 'Take at least 30 minutes before food' },
      ],
    },
    {
      brandName: 'Glycomet 500',
      genericName: 'Metformin',
      composition: 'Metformin Hydrochloride 500mg',
      manufacturer: 'USV',
      form: 'tablet',
      category: 'Antidiabetic',
      isPenicillinBased: false,
      contraindications: ['kidney_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet twice daily after food', notes: 'Take with meals to reduce gastrointestinal discomfort' },
      ],
    },
    {
      brandName: 'Glucophage',
      genericName: 'Metformin',
      composition: 'Metformin Hydrochloride 500mg',
      manufacturer: 'Merck',
      form: 'tablet',
      category: 'Antidiabetic',
      isPenicillinBased: false,
      contraindications: ['kidney_disease'],
      ageRestriction: { minAgeMonths: 144, maxAgeMonths: null, category: 'adult' },
      dosageByAge: [
        { label: '12+ years', minAgeMonths: 144, maxAgeMonths: null, dosage: '1 tablet twice daily after food', notes: 'Take with meals to reduce gastrointestinal discomfort' },
      ],
    },
  ]);

  const countAfterInsert = await Medicine.countDocuments();
  console.log('Medicines inserted, total now:', countAfterInsert);

  console.log('Seed complete.');
  console.log('Demo logins:');
  console.log('  Admin:        admin@hospital.com / Admin@1234');
  console.log('  Doctor:       doctor@hospital.com / Doctor@1234');
  console.log('  Homeo Doctor: homeodoctor@hospital.com / Doctor@1234');
  console.log('  Receptionist: reception@hospital.com / Reception@1234');
  console.log('  Pharmacist:   pharmacist@hospital.com / Pharmacist@1234');
  console.log('  Patient:      patient@hospital.com / Patient@1234');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});