import {
  appointments,
  chartData,
  doctors,
  inventory,
  invoices,
  patients,
  treatments,
} from "@/features/admin/data";
import type { AdminView } from "@/features/admin/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function total(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0);
}

export function getClinicMetrics() {
  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const today = appointments.filter((item) => item.date === todayLabel);
  const highRiskPatients = patients.filter((item) => item.risk === "High");
  const reviewPatients = patients.filter((item) => item.status === "Review");
  const openInvoices = invoices.filter((item) => item.status !== "Paid");
  const overdueInvoices = invoices.filter((item) => item.status === "Overdue");
  const lowInventory = inventory.filter((item) => item.status !== "Healthy");
  const availableDoctors = doctors.filter((item) => item.status === "Available");
  const activeTreatments = treatments.filter((item) => item.progress < 100);
  const latestMonth = chartData.at(-1);

  return {
    patients: patients.length,
    reviewPatients: reviewPatients.length,
    highRiskCount: highRiskPatients.length,
    appointmentsToday: today.length,
    bookedToday: today.filter((item) => item.status === "Booked").length,
    completedToday: today.filter((item) => item.status === "Completed").length,
    availableDoctors: availableDoctors.length,
    openInvoices: openInvoices.length,
    overdueInvoices: overdueInvoices.length,
    outstandingBalance: total(openInvoices.map((item) => item.amount - item.paid)),
    lowInventory: lowInventory.length,
    activeTreatments: activeTreatments.length,
    monthlyRevenue: latestMonth?.revenue ?? 0,
    monthlyAppointments: latestMonth?.appointments ?? 0,
    monthlyNewPatients: latestMonth?.patients ?? 0,
    nextOpenSlot:
      today.find((item) => item.status === "Cancelled" || item.status === "No Show") ??
      today.find((item) => item.status === "Rescheduled"),
    highRiskPatients,
    reviewPatientRecords: reviewPatients,
    openInvoices,
    lowInventory,
    activeTreatments,
    today,
  };
}

export function getModuleInsight(view: AdminView) {
  const metrics = getClinicMetrics();
  const topRisk = metrics.highRiskPatients[0] ?? metrics.reviewPatientRecords[0];
  const nextSlot = metrics.nextOpenSlot;
  const topTreatment = metrics.activeTreatments[0];
  const overdue = metrics.openInvoices[0];

  switch (view) {
    case "ai-symptom-checker":
      return {
        progress: topRisk ? 78 : 0,
        output: topRisk
          ? `${topRisk.name} is marked ${topRisk.risk} risk with ${topRisk.treatments.join(", ").toLowerCase()}. Use same-day clinical review if symptoms include swelling, fever, trauma, or severe pain.`
          : "No live patient risk records are available yet. Add patient history or appointment notes to generate symptom guidance.",
      };
    case "ai-treatment-recommendation":
      return {
        progress: topTreatment ? 72 : 0,
        output: topTreatment
          ? `${topTreatment.patient}'s active plan is ${topTreatment.plan}. Current stage: ${topTreatment.stage}. Recommended next step: review progress at ${topTreatment.progress}% before advancing treatment.`
          : "No live treatment plans are available yet. Create a treatment record to generate recommendations.",
      };
    case "ai-appointment-scheduler":
      return {
        progress: 91,
        output: nextSlot
          ? `Best recovery slot from today's schedule: ${nextSlot.time} on ${nextSlot.date}, ${nextSlot.chair}, originally ${nextSlot.treatment} for ${nextSlot.patient}.`
          : `No cancelled slot is open today. ${metrics.availableDoctors} doctors are available, with ${metrics.appointmentsToday} appointments on today's schedule.`,
      };
    case "ai-cost-estimator":
      return {
        progress: 69,
        output: overdue
          ? `${overdue.patient} has ${currency.format(overdue.amount - overdue.paid)} outstanding on ${overdue.id}. Clinic-wide open balance is ${currency.format(metrics.outstandingBalance)}.`
          : `All invoices are paid. Use treatment plans to estimate new patient responsibility.`,
      };
    case "ai-smile-analysis":
      return {
        progress: patients.some((item) => item.treatments.includes("Smile design")) ? 84 : 0,
        output: patients.find((item) => item.treatments.includes("Smile design"))?.name
          ? `${patients.find((item) => item.treatments.includes("Smile design"))?.name} has an active smile design workflow. Review digital scan, shade goals, and sensitivity history before final veneer planning.`
          : "No live smile design record is available yet. Upload a real smile image or treatment record to generate analysis.",
      };
    case "oral-health-score":
      return {
        progress: patients[0] ? 88 : 0,
        output: patients[0]
          ? `${patients[0].name}'s latest report includes "${patients[0].reports.join(", ")}". ${metrics.highRiskCount} high-risk patient needs hygiene reinforcement and gum review.`
          : "No live patient reports are available yet. Add reports to generate an oral health score.",
      };
    case "emergency-ai-guidance":
      return {
        progress: 96,
        output:
          "Emergency triage rule: swelling with fever, knocked-out tooth, uncontrolled bleeding, trauma, or severe pain should be escalated to immediate clinic contact and dentist review.",
      };
    case "ai-assistant":
    default:
      return {
        progress: 89,
        output: `Live clinic snapshot: ${metrics.appointmentsToday} appointments today, ${metrics.reviewPatients} patients in review, ${metrics.openInvoices} open invoices, and ${metrics.lowInventory} inventory alerts.`,
      };
  }
}

function findPatient(question: string) {
  const normalized = question.toLowerCase();
  return patients.find((patient) => normalized.includes(patient.name.toLowerCase()));
}

export function answerClinicQuestion(question: string) {
  const normalized = question.toLowerCase();
  const metrics = getClinicMetrics();
  const patient = findPatient(question);

  if (patient) {
    return [
      `**${patient.name}** is an ${patient.status.toLowerCase()} patient assigned to **${patient.dentist}**.`,
      `Risk: **${patient.risk}**. Next visit: **${patient.nextVisit}**. Active treatments: ${patient.treatments.join(", ")}.`,
      `Latest record: ${patient.xray}. Notes: ${patient.notes}`,
    ].join("\n\n");
  }

  if (
    normalized.includes("appointment") ||
    normalized.includes("schedule") ||
    normalized.includes("slot")
  ) {
    const today = metrics.today
      .map((item) => `${item.time} ${item.patient} with ${item.doctor} (${item.status})`)
      .join("; ");
    return `Today has **${metrics.appointmentsToday} appointments**${today ? `: ${today}` : ""}. ${
      metrics.nextOpenSlot
        ? `Best possible recovery slot: **${metrics.nextOpenSlot.time}**, ${metrics.nextOpenSlot.chair}.`
        : "No open recovery slot is currently visible."
    }`;
  }

  if (
    normalized.includes("invoice") ||
    normalized.includes("billing") ||
    normalized.includes("payment")
  ) {
    return `There are **${metrics.openInvoices} open invoices** with **${currency.format(metrics.outstandingBalance)}** outstanding. Overdue count: **${metrics.overdueInvoices}**.`;
  }

  if (normalized.includes("inventory") || normalized.includes("stock")) {
    const alerts = metrics.lowInventory
      .map((item) => `${item.name}: ${item.stock}/${item.minimum}`)
      .join("; ");
    return alerts
      ? `Inventory alerts: ${alerts}. Reorder these before the next clinical day.`
      : "Inventory is healthy. No low-stock or critical alerts are currently listed.";
  }

  if (normalized.includes("risk") || normalized.includes("review")) {
    const names = metrics.reviewPatientRecords
      .map((item) => `${item.name} (${item.risk})`)
      .join(", ");
    return names
      ? `Patients needing review: ${names}. High-risk count: **${metrics.highRiskCount}**.`
      : "No live patients are currently marked for review.";
  }

  if (normalized.includes("revenue") || normalized.includes("report")) {
    return `Latest month: **${currency.format(metrics.monthlyRevenue)}** revenue, **${metrics.monthlyAppointments}** appointments, and **${metrics.monthlyNewPatients}** new patients.`;
  }

  if (
    normalized.includes("emergency") ||
    normalized.includes("pain") ||
    normalized.includes("bleeding")
  ) {
    return "For severe pain, swelling with fever, trauma, knocked-out tooth, or uncontrolled bleeding: treat it as urgent, avoid chewing on the area, use cold compress externally, and contact the clinic immediately. This is guidance only and does not replace dentist diagnosis.";
  }

  return `Clinic snapshot: **${metrics.patients} patients**, **${metrics.appointmentsToday} appointments today**, **${metrics.availableDoctors} doctors available**, **${metrics.openInvoices} open invoices**, and **${metrics.lowInventory} inventory alerts**. Ask about a patient, appointment, billing, inventory, report, or emergency triage for details.`;
}
