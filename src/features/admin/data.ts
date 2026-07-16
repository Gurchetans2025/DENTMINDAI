import {
  Activity,
  BadgeDollarSign,
  BarChart3,
  Bot,
  Brain,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileBarChart,
  HeartPulse,
  Images,
  Package,
  Newspaper,
  Settings,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Syringe,
  Users,
  WandSparkles,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

import type {
  AdminView,
  Appointment,
  ChartPoint,
  Doctor,
  InventoryItem,
  Invoice,
  NavItem,
  Patient,
  Treatment,
} from "./types";

type LiveRow = Record<string, unknown>;

export const navigation: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, group: "Clinic" },
  { id: "patients", label: "Patients", icon: Users, group: "Clinic" },
  { id: "doctors", label: "Doctors", icon: Stethoscope, group: "Clinic" },
  { id: "appointments", label: "Appointments", icon: CalendarDays, group: "Clinic" },
  { id: "treatments", label: "Treatments", icon: Syringe, group: "Clinic" },
  { id: "billing", label: "Billing", icon: CreditCard, group: "Business" },
  { id: "inventory", label: "Inventory", icon: Package, group: "Business" },
  { id: "blog", label: "Blog Posts", icon: Newspaper, group: "Business" },
  { id: "clinic-gallery", label: "Clinic Gallery", icon: Images, group: "Business" },
  { id: "reports", label: "Reports", icon: FileBarChart, group: "Business" },
  { id: "settings", label: "Settings", icon: Settings, group: "Business" },
  { id: "ai-center", label: "AI Center", icon: Bot, group: "AI Center" },
  { id: "ai-assistant", label: "AI Dental Assistant", icon: Sparkles, group: "AI Center" },
  { id: "ai-symptom-checker", label: "Symptom Checker", icon: Activity, group: "AI Center" },
  { id: "ai-treatment-recommendation", label: "Treatment AI", icon: Brain, group: "AI Center" },
  { id: "ai-appointment-scheduler", label: "AI Scheduler", icon: CalendarDays, group: "AI Center" },
  { id: "ai-cost-estimator", label: "Cost Estimator", icon: BadgeDollarSign, group: "AI Center" },
  { id: "ai-smile-analysis", label: "Smile Analysis", icon: WandSparkles, group: "AI Center" },
  { id: "oral-health-score", label: "Oral Health Score", icon: HeartPulse, group: "AI Center" },
  {
    id: "emergency-ai-guidance",
    label: "Emergency Guidance",
    icon: ShieldAlert,
    group: "AI Center",
  },
];

export let patients: Patient[] = [];
export let doctors: Doctor[] = [];
export let appointments: Appointment[] = [];
export let treatments: Treatment[] = [];
export let invoices: Invoice[] = [];
export let inventory: InventoryItem[] = [];
export let chartData: ChartPoint[] = [];
export let recentActivity: string[] = [];

export const aiModules: Array<{
  id: AdminView;
  title: string;
  description: string;
  output: string;
  progress: number;
}> = [
  {
    id: "ai-assistant",
    title: "AI Dental Assistant",
    description: "Clinical front-desk chat for appointment, treatment, and hygiene questions.",
    output: "Connect live clinic records to generate an assistant response.",
    progress: 0,
  },
  {
    id: "ai-symptom-checker",
    title: "AI Symptom Checker",
    description: "Collect symptoms, urgency, pain level, and relevant medical history.",
    output: "Add live symptoms or appointments to generate urgency guidance.",
    progress: 0,
  },
  {
    id: "ai-treatment-recommendation",
    title: "AI Treatment Recommendation",
    description: "Compare clinical findings against patient history and active plans.",
    output: "Treatment guidance will appear after live treatment records exist.",
    progress: 0,
  },
  {
    id: "ai-appointment-scheduler",
    title: "AI Appointment Scheduler",
    description: "Find the best doctor, chair, room, and follow-up window.",
    output: "Live appointment availability will appear here.",
    progress: 0,
  },
  {
    id: "ai-cost-estimator",
    title: "AI Cost Estimator",
    description: "Estimate plan cost from procedures, insurance, and payment preferences.",
    output: "Add live invoices or treatment costs to generate estimates.",
    progress: 0,
  },
  {
    id: "ai-smile-analysis",
    title: "AI Smile Analysis",
    description: "Evaluate smile symmetry, shade, gum line, and veneer suitability.",
    output: "Upload a real smile image to generate analysis.",
    progress: 0,
  },
  {
    id: "oral-health-score",
    title: "Oral Health Score",
    description: "Summarize hygiene, gum health, decay risk, and appointment adherence.",
    output: "Live patient history is required for a health score.",
    progress: 0,
  },
  {
    id: "emergency-ai-guidance",
    title: "Emergency AI Guidance",
    description: "Triage urgent dental issues and provide immediate care guidance.",
    output: "Enter real emergency details to generate first-aid guidance.",
    progress: 0,
  },
];

export type ClinicSnapshot = {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  treatments: Treatment[];
  invoices: Invoice[];
  inventory: InventoryItem[];
  chartData: ChartPoint[];
  recentActivity: string[];
  aiModules: typeof aiModules;
};

const emptySnapshot: ClinicSnapshot = {
  patients,
  doctors,
  appointments,
  treatments,
  invoices,
  inventory,
  chartData,
  recentActivity,
  aiModules,
};

export async function fetchClinicSnapshot(): Promise<ClinicSnapshot> {
  const [appointmentRows, profileRows, doctorRows, treatmentRows, invoiceRows, inventoryRows] =
    await Promise.all([
      readTable("appointments", "created_at", false),
      readTable("profiles", "created_at", false),
      readTable("doctors", "name", true),
      readTable("treatments", "created_at", false),
      readTable("invoices", "date", false),
      readTable("inventory", "name", true),
    ]);

  const liveAppointments = appointmentRows.map(toAppointment);
  const livePatients = buildPatients(profileRows, appointmentRows);
  const liveDoctors = doctorRows.length
    ? doctorRows.map(toDoctor)
    : deriveDoctors(liveAppointments);
  const liveTreatments = treatmentRows.length
    ? treatmentRows.map(toTreatment)
    : deriveTreatments(liveAppointments);
  const liveInvoices = invoiceRows.map(toInvoice);
  const liveInventory = inventoryRows.map(toInventoryItem);

  patients = livePatients;
  doctors = liveDoctors;
  appointments = liveAppointments;
  treatments = liveTreatments;
  invoices = liveInvoices;
  inventory = liveInventory;
  chartData = buildChartData(liveAppointments, liveInvoices, livePatients);
  recentActivity = buildRecentActivity(appointmentRows);

  return {
    ...emptySnapshot,
    appointments,
    patients,
    doctors,
    treatments,
    invoices,
    inventory,
    chartData,
    recentActivity,
  };
}

async function readTable(
  table: string,
  orderColumn: string,
  ascending: boolean,
): Promise<LiveRow[]> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderColumn, { ascending });
    if (error) return [];
    return (data ?? []) as LiveRow[];
  } catch {
    return [];
  }
}

function text(row: LiveRow, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = row[key];
    if (value !== null && value !== undefined && String(value).trim()) return String(value);
  }
  return fallback;
}

function numberValue(row: LiveRow, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = Number(row[key]);
    if (Number.isFinite(value)) return value;
  }
  return fallback;
}

function stringArray(row: LiveRow, keys: string[], fallback: string[] = []) {
  for (const key of keys) {
    const value = row[key];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string" && value.trim()) return [value];
  }
  return fallback;
}

function formatDate(value: unknown, fallback = "Not recorded") {
  if (!value) return fallback;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function normalizeAppointmentStatus(value: unknown): Appointment["status"] {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("complete")) return "Completed";
  if (status.includes("reschedule")) return "Rescheduled";
  if (status.includes("cancel")) return "Cancelled";
  if (status.includes("no show")) return "No Show";
  return "Booked";
}

function normalizeRisk(value: unknown): Patient["risk"] {
  const risk = String(value ?? "").toLowerCase();
  if (risk === "high") return "High";
  if (risk === "medium") return "Medium";
  return "Low";
}

function normalizePatientStatus(value: unknown): Patient["status"] {
  const status = String(value ?? "").toLowerCase();
  if (status === "review") return "Review";
  if (status === "inactive") return "Inactive";
  return "Active";
}

function normalizeDoctorStatus(value: unknown): Doctor["status"] {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("surgery")) return "In Surgery";
  if (status.includes("off")) return "Off Duty";
  return "Available";
}

function normalizeInvoiceStatus(value: unknown): Invoice["status"] {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("partial")) return "Partial";
  if (status.includes("overdue")) return "Overdue";
  if (status.includes("paid")) return "Paid";
  return "Pending";
}

function normalizeInventoryStatus(
  value: unknown,
  stock: number,
  minimum: number,
): InventoryItem["status"] {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("critical")) return "Critical";
  if (status.includes("low")) return "Low Stock";
  if (stock <= 0 || stock < minimum / 2) return "Critical";
  if (stock < minimum) return "Low Stock";
  return "Healthy";
}

function normalizeCategory(value: unknown): InventoryItem["category"] {
  const category = String(value ?? "").toLowerCase();
  if (category.includes("equipment")) return "Equipment";
  if (category.includes("medicine")) return "Medicine";
  return "Consumable";
}

function toAppointment(row: LiveRow): Appointment {
  return {
    id: text(row, ["id"], crypto.randomUUID()),
    time: text(row, ["preferred_time", "time", "start_time"], "Not set"),
    date: formatDate(row.preferred_date ?? row.date ?? row.created_at),
    patient: text(row, ["patient_name", "patient", "name"], "Unnamed patient"),
    doctor: text(row, ["preferred_doctor", "doctor", "dentist"], "Unassigned"),
    treatment: text(row, ["treatment_type", "treatment", "procedure"], "Consultation"),
    chair: text(row, ["chair", "room"], "Not assigned"),
    status: normalizeAppointmentStatus(row.status),
  };
}

function buildPatients(profileRows: LiveRow[], appointmentRows: LiveRow[]): Patient[] {
  const byKey = new Map<string, Patient>();

  for (const row of appointmentRows) {
    const email = text(row, ["email"]);
    const phone = text(row, ["phone"]);
    const key = email || phone || text(row, ["patient_name", "id"], crypto.randomUUID());
    const appointmentDate = formatDate(row.preferred_date ?? row.date ?? row.created_at);
    byKey.set(key, {
      id: text(row, ["user_id", "id"], key),
      name: text(row, ["patient_name", "name"], "Unnamed patient"),
      age: numberValue(row, ["age"], 0),
      phone,
      email,
      lastVisit: appointmentDate,
      nextVisit: appointmentDate,
      risk: normalizeRisk(row.risk),
      status: normalizePatientStatus(row.patient_status),
      dentist: text(row, ["preferred_doctor", "doctor", "dentist"], "Unassigned"),
      medicalHistory: stringArray(row, ["medical_history"], ["Not recorded"]),
      dentalHistory: stringArray(row, ["dental_history"], ["Appointment request"]),
      treatments: [text(row, ["treatment_type", "treatment"], "Consultation")],
      xray: text(row, ["xray"], "No X-rays uploaded"),
      prescriptions: stringArray(row, ["prescriptions"], ["None recorded"]),
      reports: stringArray(row, ["reports"], ["No reports uploaded"]),
      notes: text(row, ["notes"], "No notes recorded"),
    });
  }

  for (const row of profileRows) {
    const id = text(row, ["id"], crypto.randomUUID());
    if (byKey.has(id)) continue;
    byKey.set(id, {
      id,
      name: text(row, ["full_name", "name"], "Unnamed patient"),
      age: numberValue(row, ["age"], 0),
      phone: text(row, ["phone"]),
      email: text(row, ["email"]),
      lastVisit: "Not recorded",
      nextVisit: "Not scheduled",
      risk: normalizeRisk(row.risk),
      status: normalizePatientStatus(row.status),
      dentist: text(row, ["dentist", "preferred_doctor"], "Unassigned"),
      medicalHistory: stringArray(row, ["medical_history"], ["Not recorded"]),
      dentalHistory: stringArray(row, ["dental_history"], ["Not recorded"]),
      treatments: stringArray(row, ["treatments"], ["No treatment recorded"]),
      xray: text(row, ["xray"], "No X-rays uploaded"),
      prescriptions: stringArray(row, ["prescriptions"], ["None recorded"]),
      reports: stringArray(row, ["reports"], ["No reports uploaded"]),
      notes: text(row, ["notes"], "No notes recorded"),
    });
  }

  return Array.from(byKey.values());
}

function toDoctor(row: LiveRow): Doctor {
  return {
    id: text(row, ["id"], crypto.randomUUID()),
    name: text(row, ["name", "doctor"], "Unnamed doctor"),
    specialization: text(row, ["specialization", "specialty"], "General Dentistry"),
    availability: text(row, ["availability"], "Not set"),
    schedule: text(row, ["schedule"], "Not set"),
    rating: numberValue(row, ["rating"], 0),
    appointments: numberValue(row, ["appointments", "appointment_count"], 0),
    status: normalizeDoctorStatus(row.status),
  };
}

function deriveDoctors(rows: Appointment[]): Doctor[] {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    if (row.doctor !== "Unassigned") counts.set(row.doctor, (counts.get(row.doctor) ?? 0) + 1);
  });
  return Array.from(counts.entries()).map(([name, count], index) => ({
    id: `doctor-${index + 1}`,
    name,
    specialization: "General Dentistry",
    availability: "Live appointment data",
    schedule: "Live appointment data",
    rating: 0,
    appointments: count,
    status: "Available",
  }));
}

function toTreatment(row: LiveRow): Treatment {
  return {
    id: text(row, ["id"], crypto.randomUUID()),
    patient: text(row, ["patient", "patient_name"], "Unnamed patient"),
    plan: text(row, ["plan", "treatment_type", "treatment"], "Treatment plan"),
    cost: numberValue(row, ["cost", "amount"], 0),
    progress: numberValue(row, ["progress"], 0),
    stage: text(row, ["stage", "status"], "Not started"),
    beforeAfter: text(row, ["before_after", "beforeAfter"], "No before/after record uploaded"),
  };
}

function deriveTreatments(rows: Appointment[]): Treatment[] {
  return rows.map((row) => ({
    id: row.id,
    patient: row.patient,
    plan: row.treatment,
    cost: 0,
    progress: row.status === "Completed" ? 100 : 0,
    stage: row.status,
    beforeAfter: "No before/after record uploaded",
  }));
}

function toInvoice(row: LiveRow): Invoice {
  const amount = numberValue(row, ["amount", "total"], 0);
  const paid = numberValue(row, ["paid", "paid_amount"], 0);
  return {
    id: text(row, ["id", "invoice_no"], crypto.randomUUID()),
    patient: text(row, ["patient", "patient_name"], "Unnamed patient"),
    amount,
    paid,
    date: formatDate(row.date ?? row.created_at),
    method: text(row, ["method", "payment_method"], "Not recorded"),
    status: normalizeInvoiceStatus(row.status),
  };
}

function toInventoryItem(row: LiveRow): InventoryItem {
  const stock = numberValue(row, ["stock", "quantity"], 0);
  const minimum = numberValue(row, ["minimum", "minimum_stock"], 0);
  return {
    id: text(row, ["id"], crypto.randomUUID()),
    name: text(row, ["name", "item"], "Unnamed item"),
    category: normalizeCategory(row.category),
    stock,
    minimum,
    supplier: text(row, ["supplier"], "Not recorded"),
    status: normalizeInventoryStatus(row.status, stock, minimum),
  };
}

function buildChartData(
  liveAppointments: Appointment[],
  liveInvoices: Invoice[],
  livePatients: Patient[],
): ChartPoint[] {
  const months = new Map<string, ChartPoint>();
  const ensure = (dateLabel: string) => {
    const month = dateLabel.split(" ")[0] || "Live";
    if (!months.has(month)) months.set(month, { month, revenue: 0, appointments: 0, patients: 0 });
    return months.get(month)!;
  };

  liveAppointments.forEach((appointment) => {
    ensure(appointment.date).appointments += 1;
  });
  liveInvoices.forEach((invoice) => {
    ensure(invoice.date).revenue += invoice.paid;
  });
  livePatients.forEach((patient) => {
    ensure(patient.nextVisit).patients += 1;
  });

  return Array.from(months.values());
}

function buildRecentActivity(rows: LiveRow[]) {
  return rows.slice(0, 6).map((row) => {
    const patient = text(row, ["patient_name", "name"], "A patient");
    const treatment = text(row, ["treatment_type", "treatment"], "an appointment");
    const date = formatDate(row.preferred_date ?? row.created_at);
    return `${patient} requested ${treatment} for ${date}.`;
  });
}
