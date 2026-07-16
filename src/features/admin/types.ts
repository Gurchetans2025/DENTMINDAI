import type { LucideIcon } from "lucide-react";

export type AdminView =
  | "dashboard"
  | "patients"
  | "doctors"
  | "appointments"
  | "treatments"
  | "billing"
  | "inventory"
  | "blog"
  | "clinic-gallery"
  | "ai-center"
  | "ai-assistant"
  | "ai-symptom-checker"
  | "ai-treatment-recommendation"
  | "ai-appointment-scheduler"
  | "ai-cost-estimator"
  | "ai-smile-analysis"
  | "oral-health-score"
  | "emergency-ai-guidance"
  | "reports"
  | "settings";

export type NavItem = {
  id: AdminView;
  label: string;
  icon: LucideIcon;
  group: "Clinic" | "AI Center" | "Business";
};

export type StatusTone = "blue" | "teal" | "amber" | "red" | "slate" | "green";

export type Patient = {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  lastVisit: string;
  nextVisit: string;
  risk: "Low" | "Medium" | "High";
  status: "Active" | "Review" | "Inactive";
  dentist: string;
  medicalHistory: string[];
  dentalHistory: string[];
  treatments: string[];
  xray: string;
  prescriptions: string[];
  reports: string[];
  notes: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  availability: string;
  schedule: string;
  rating: number;
  appointments: number;
  status: "Available" | "In Surgery" | "Off Duty";
};

export type Appointment = {
  id: string;
  time: string;
  date: string;
  patient: string;
  doctor: string;
  treatment: string;
  chair: string;
  status: "Booked" | "Rescheduled" | "Cancelled" | "Completed" | "No Show";
};

export type Treatment = {
  id: string;
  patient: string;
  plan: string;
  cost: number;
  progress: number;
  stage: string;
  beforeAfter: string;
};

export type Invoice = {
  id: string;
  patient: string;
  amount: number;
  paid: number;
  date: string;
  method: string;
  status: "Paid" | "Pending" | "Partial" | "Overdue";
};

export type InventoryItem = {
  id: string;
  name: string;
  category: "Equipment" | "Medicine" | "Consumable";
  stock: number;
  minimum: number;
  supplier: string;
  status: "Healthy" | "Low Stock" | "Critical";
};

export type ChartPoint = {
  month: string;
  revenue: number;
  appointments: number;
  patients: number;
};
