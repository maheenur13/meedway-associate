/**
 * Seed job listings. TODO: replace with data from the DB (Job model) once
 * Prisma/Neon is connected and the admin panel can manage these.
 */
export type Job = {
  id: string;
  title: string;
  category: string;
  country: string;
  vacancies: number;
  salary: string;
  workingHours: string;
  contract: string;
  experience: string;
  accommodation: boolean;
  deadline: string; // ISO date
  documents: string[];
};

export const jobs: Job[] = [
  {
    id: "construction-worker-ksa",
    title: "Construction Worker",
    category: "Construction",
    country: "Saudi Arabia",
    vacancies: 50,
    salary: "Based on experience",
    workingHours: "8 hrs/day, 6 days/week",
    contract: "2 years",
    experience: "Minimum 2 years",
    accommodation: true,
    deadline: "2026-08-30",
    documents: ["Valid passport", "Medical certificate", "Experience letter"],
  },
  {
    id: "factory-operator-malaysia",
    title: "Factory Operator",
    category: "Factory",
    country: "Malaysia",
    vacancies: 80,
    salary: "MYR 1,500 – 1,800",
    workingHours: "8 hrs/day + OT",
    contract: "3 years",
    experience: "Freshers welcome",
    accommodation: true,
    deadline: "2026-09-15",
    documents: ["Valid passport", "Medical certificate"],
  },
  {
    id: "driver-uae",
    title: "Light Vehicle Driver",
    category: "Drivers",
    country: "United Arab Emirates",
    vacancies: 20,
    salary: "AED 2,000 – 2,500",
    workingHours: "9 hrs/day",
    contract: "2 years",
    experience: "Minimum 3 years + valid licence",
    accommodation: true,
    deadline: "2026-08-25",
    documents: ["Valid passport", "Driving licence", "Medical certificate"],
  },
  {
    id: "cleaner-qatar",
    title: "Cleaner",
    category: "Cleaners",
    country: "Qatar",
    vacancies: 40,
    salary: "QAR 1,200",
    workingHours: "8 hrs/day",
    contract: "2 years",
    experience: "Freshers welcome",
    accommodation: true,
    deadline: "2026-09-05",
    documents: ["Valid passport", "Medical certificate"],
  },
  {
    id: "welder-oman",
    title: "Welder",
    category: "Welders",
    country: "Oman",
    vacancies: 15,
    salary: "OMR 250 – 320",
    workingHours: "8 hrs/day + OT",
    contract: "2 years",
    experience: "Minimum 2 years + trade test",
    accommodation: true,
    deadline: "2026-08-28",
    documents: ["Valid passport", "Trade certificate", "Experience letter"],
  },
  {
    id: "hotel-staff-kuwait",
    title: "Hotel & Restaurant Staff",
    category: "Hotel & restaurant",
    country: "Kuwait",
    vacancies: 30,
    salary: "KWD 120 – 160",
    workingHours: "9 hrs/day",
    contract: "2 years",
    experience: "1 year preferred",
    accommodation: true,
    deadline: "2026-09-20",
    documents: ["Valid passport", "Medical certificate"],
  },
];

export const jobCategories = Array.from(new Set(jobs.map((j) => j.category)));
export const jobCountries = Array.from(new Set(jobs.map((j) => j.country)));
