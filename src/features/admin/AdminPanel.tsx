import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Download,
  Filter,
  Menu,
  Moon,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getModuleInsight } from "@/lib/clinic-ai";
import { cn } from "@/lib/utils";

import { aiModules, fetchClinicSnapshot, navigation } from "./data";
import type { ClinicSnapshot } from "./data";
import type {
  AdminView,
  Appointment,
  Doctor,
  InventoryItem,
  Invoice,
  Patient,
  StatusTone,
  Treatment,
} from "./types";

type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  search?: (row: T) => string;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function HealthyGrinzAdmin() {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    return () => document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const currentLabel = navigation.find((item) => item.id === activeView)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-hero-gradient text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background/92 shadow-card backdrop-blur-xl transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          activeView={activeView}
          onNavigate={setActiveView}
          close={() => setSidebarOpen(false)}
        />
      </aside>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </Button>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                HealthyGrinz Admin
              </p>
              <h1 className="truncate text-lg font-semibold">{currentLabel}</h1>
            </div>
            <div className="ml-auto hidden w-full max-w-md items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm md:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                placeholder="Search patients, invoices, appointments..."
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toast.success("Notifications reviewed")}
              aria-label="Notifications"
            >
              <Bell />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode((value) => !value)}
              aria-label="Dark mode"
            >
              {darkMode ? <Sun /> : <Moon />}
            </Button>
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 sm:flex">
              <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                HG
              </div>
              <div className="leading-tight">
                <div className="text-xs font-medium">Admin Team</div>
                <div className="text-[11px] text-muted-foreground">Downtown Clinic</div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 lg:px-8">
          <AdminPage
            activeView={activeView}
            setActiveView={setActiveView}
            globalSearch={globalSearch}
          />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  activeView,
  onNavigate,
  close,
}: {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
  close: () => void;
}) {
  const groups = ["Clinic", "AI Center", "Business"] as const;
  return (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-gradient font-bold text-white shadow-glow">
          HG
        </div>
        <div>
          <div className="font-semibold">HealthyGrinz Admin</div>
          <div className="text-xs text-muted-foreground">Premium clinic operations</div>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={close}>
          <X />
        </Button>
      </div>
      <nav className="admin-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group} className="mb-5">
            <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {group}
            </div>
            <div className="space-y-1">
              {navigation
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  const active = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        close();
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                        active &&
                          "bg-primary text-primary-foreground shadow-soft hover:bg-primary hover:text-primary-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <div className="rounded-md bg-muted p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-teal" />
            HIPAA-ready UI layer
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Connected to Supabase live records. Empty panels mean no records have been added yet.
          </p>
        </div>
        <Button asChild variant="ghost" className="mt-3 w-full justify-start">
          <Link to="/">Back to clinic site</Link>
        </Button>
      </div>
    </>
  );
}

function AdminPage({
  activeView,
  setActiveView,
  globalSearch,
}: {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  globalSearch: string;
}) {
  const query = useQuery({
    queryKey: ["healthygrinz-admin-snapshot"],
    queryFn: fetchClinicSnapshot,
    staleTime: 1000 * 60 * 10,
  });

  if (query.isLoading) return <DashboardSkeleton />;

  const data = query.data ?? {
    patients: [],
    doctors: [],
    appointments: [],
    treatments: [],
    invoices: [],
    inventory: [],
    chartData: [],
    recentActivity: [],
    aiModules,
  };

  if (activeView === "dashboard")
    return <DashboardPage data={data} setActiveView={setActiveView} />;
  if (activeView === "patients")
    return <PatientsPage rows={data.patients} globalSearch={globalSearch} />;
  if (activeView === "doctors") return <DoctorsPage rows={data.doctors} />;
  if (activeView === "appointments") return <AppointmentsPage rows={data.appointments} />;
  if (activeView === "treatments") return <TreatmentsPage rows={data.treatments} />;
  if (activeView === "billing") return <BillingPage rows={data.invoices} />;
  if (activeView === "inventory") return <InventoryPage rows={data.inventory} />;
  if (activeView === "reports") return <ReportsPage data={data} />;
  if (activeView === "settings") return <SettingsPage />;
  if (activeView === "ai-center") return <AICenterPage setActiveView={setActiveView} />;
  return <AIModulePage view={activeView} />;
}

function DashboardPage({
  data,
  setActiveView,
}: {
  data: ClinicSnapshot;
  setActiveView: (view: AdminView) => void;
}) {
  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const today = data.appointments.filter((item) => item.date === todayLabel);
  const upcoming = data.appointments.filter(
    (item) => item.status !== "Completed" && item.status !== "Cancelled",
  );
  const revenue = data.invoices.reduce((sum, invoice) => sum + invoice.paid, 0);
  const pending = data.invoices.reduce((sum, invoice) => sum + invoice.amount - invoice.paid, 0);
  const stats = [
    {
      label: "Today's Appointments",
      value: String(today.length),
      delta: "Live",
      icon: CalendarClock,
    },
    {
      label: "Upcoming Appointments",
      value: String(upcoming.length),
      delta: "Live",
      icon: ClipboardList,
    },
    {
      label: "Total Patients",
      value: String(data.patients.length),
      delta: "Live",
      icon: UserRoundPlus,
    },
    { label: "Revenue", value: currency.format(revenue), delta: "Live", icon: CircleDollarSign },
    {
      label: "Pending Payments",
      value: currency.format(pending),
      delta: "Live",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clinic command center"
        title="Daily operations at a glance"
        description="A clear five-minute overview of appointments, revenue, growth, and AI activity."
        action={
          <Button onClick={() => setActiveView("appointments")}>
            <Plus /> Book appointment
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <ChartPanel title="Revenue" subtitle="Monthly collected revenue">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.chartData}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#554c72" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#554c72" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis
                stroke="var(--muted-foreground)"
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
              />
              <Tooltip formatter={(value) => currency.format(Number(value))} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#554c72"
                fill="url(#revenue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentActivity.map((activity, index) => (
              <div key={activity} className="flex gap-3 rounded-md bg-muted/55 p-3">
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-teal/15 text-xs font-semibold text-teal">
                  {index + 1}
                </div>
                <p className="text-sm leading-6">{activity}</p>
              </div>
            ))}
            {data.recentActivity.length === 0 && (
              <p className="rounded-md bg-muted/55 p-3 text-sm text-muted-foreground">
                No live activity yet. New bookings will appear here automatically.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Appointments" subtitle="Booked visits by month">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Bar dataKey="appointments" fill="#554c72" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Patient Growth" subtitle="New patients acquired">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#554c72"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </div>
  );
}

function PatientsPage({ rows, globalSearch }: { rows: Patient[]; globalSearch: string }) {
  const [selected, setSelected] = useState<Patient | null>(rows[0] ?? null);

  useEffect(() => {
    setSelected((current) => {
      if (!rows.length) return null;
      return rows.find((row) => row.id === current?.id) ?? rows[0];
    });
  }, [rows]);

  const columns: Column<Patient>[] = [
    {
      header: "Patient",
      search: (row) => `${row.name} ${row.email}`,
      cell: (row) => <ProfileCell title={row.name} subtitle={row.email} />,
    },
    { header: "Risk", cell: (row) => <StatusBadge label={row.risk} tone={riskTone(row.risk)} /> },
    { header: "Dentist", search: (row) => row.dentist, cell: (row) => row.dentist },
    { header: "Last Visit", cell: (row) => row.lastVisit },
    { header: "Next Visit", cell: (row) => row.nextVisit },
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.8fr]">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Patient management"
          title="Patients, history, X-rays, reports, and notes"
          description="Live patients are loaded from Supabase profiles and appointment requests."
        />
        <DataTable
          rows={rows}
          columns={columns}
          initialSearch={globalSearch}
          statusOptions={["Active", "Review", "Inactive"]}
          statusOf={(row) => row.status}
          onRowClick={setSelected}
        />
      </div>
      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base">{selected?.name ?? "No patient selected"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {selected
              ? `${selected.id} - ${selected.age || "Age not recorded"} - ${selected.phone || "No phone"}`
              : "Book an appointment or add a Supabase profile to see patient details here."}
          </p>
        </CardHeader>
        <CardContent>
          {selected ? (
            <Tabs defaultValue="medical" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-3">
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="dental">Dental</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="medical" className="space-y-3">
                <DetailList title="Medical History" items={selected.medicalHistory} />
                <DetailList title="Prescriptions" items={selected.prescriptions} />
              </TabsContent>
              <TabsContent value="dental" className="space-y-3">
                <DetailList title="Dental History" items={selected.dentalHistory} />
                <DetailList title="Treatment History" items={selected.treatments} />
              </TabsContent>
              <TabsContent value="files" className="space-y-3">
                <DetailList title="X-rays" items={[selected.xray]} />
                <DetailList title="Reports" items={selected.reports} />
                <div className="rounded-md border border-border p-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Notes
                  </div>
                  <p className="mt-2 text-sm leading-6">{selected.notes}</p>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <EmptyState message="No live patient records found." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DoctorsPage({ rows }: { rows: Doctor[] }) {
  const columns: Column<Doctor>[] = [
    {
      header: "Doctor",
      search: (row) => `${row.name} ${row.specialization}`,
      cell: (row) => <ProfileCell title={row.name} subtitle={row.specialization} />,
    },
    { header: "Availability", cell: (row) => row.availability },
    { header: "Schedule", cell: (row) => row.schedule },
    { header: "Appointments", cell: (row) => row.appointments },
    { header: "Rating", cell: (row) => row.rating.toFixed(2) },
    {
      header: "Status",
      cell: (row) => (
        <StatusBadge
          label={row.status}
          tone={
            row.status === "Available" ? "teal" : row.status === "In Surgery" ? "amber" : "slate"
          }
        />
      ),
    },
  ];
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Care team"
        title="Doctors, availability, schedules, and specializations"
        description="A compact view for staffing decisions and chair allocation."
      />
      <DataTable
        rows={rows}
        columns={columns}
        statusOptions={["Available", "In Surgery", "Off Duty"]}
        statusOf={(row) => row.status}
      />
    </div>
  );
}

function AppointmentsPage({ rows }: { rows: Appointment[] }) {
  const columns: Column<Appointment>[] = [
    { header: "Time", cell: (row) => <span className="font-medium">{row.time}</span> },
    { header: "Patient", search: (row) => row.patient, cell: (row) => row.patient },
    { header: "Doctor", search: (row) => row.doctor, cell: (row) => row.doctor },
    { header: "Treatment", search: (row) => row.treatment, cell: (row) => row.treatment },
    { header: "Chair", cell: (row) => row.chair },
    {
      header: "Status",
      cell: (row) => <StatusBadge label={row.status} tone={appointmentTone(row.status)} />,
    },
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md border border-border"
          />
          <Button className="w-full" asChild>
            <a href="/#booking">
              <Plus /> Book appointment
            </a>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            {["Reschedule", "Cancel", "Completed", "No Show"].map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={() => toast.success(`${action} action applied`)}
              >
                {action}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Appointment desk"
          title="Calendar, booking, reschedule, cancellations, and outcomes"
          description="Manage the day across chairs, doctors, treatment rooms, and patient status."
        />
        <DataTable
          rows={rows}
          columns={columns}
          statusOptions={["Booked", "Rescheduled", "Cancelled", "Completed", "No Show"]}
          statusOf={(row) => row.status}
        />
      </div>
    </div>
  );
}

function TreatmentsPage({ rows }: { rows: Treatment[] }) {
  const columns: Column<Treatment>[] = [
    { header: "Patient", search: (row) => row.patient, cell: (row) => row.patient },
    { header: "Plan", search: (row) => row.plan, cell: (row) => row.plan },
    { header: "Cost", cell: (row) => currency.format(row.cost) },
    { header: "Progress", cell: (row) => <ProgressBar value={row.progress} /> },
    { header: "Stage", cell: (row) => row.stage },
  ];
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Treatment planning"
        title="Plans, cost, progress, and before/after records"
        description="Keep premium clinical journeys visually clear and financially transparent."
      />
      <DataTable rows={rows} columns={columns} />
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map((item) => (
          <Card key={item.id} className="border-border shadow-card">
            <CardContent className="p-4">
              <div className="aspect-[16/10] rounded-md bg-gradient-to-br from-[#eeeaf5] via-[#d8d2e8] to-white dark:from-[#2a233d] dark:via-[#3a3152] dark:to-[#171326]" />
              <div className="mt-3 font-medium">{item.patient}</div>
              <p className="text-sm text-muted-foreground">{item.beforeAfter}</p>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <EmptyState message="No live treatment records found." />}
      </div>
    </div>
  );
}

function BillingPage({ rows }: { rows: Invoice[] }) {
  const columns: Column<Invoice>[] = [
    {
      header: "Invoice",
      search: (row) => row.id,
      cell: (row) => <span className="font-medium">{row.id}</span>,
    },
    { header: "Patient", search: (row) => row.patient, cell: (row) => row.patient },
    { header: "Amount", cell: (row) => currency.format(row.amount) },
    { header: "Paid", cell: (row) => currency.format(row.paid) },
    { header: "Method", cell: (row) => row.method },
    {
      header: "Status",
      cell: (row) => <StatusBadge label={row.status} tone={invoiceTone(row.status)} />,
    },
  ];
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Billing"
        title="Invoices, payments, and payment history"
        description="Review collections, pending balances, insurance payments, and overdue accounts."
      />
      <DataTable
        rows={rows}
        columns={columns}
        statusOptions={["Paid", "Pending", "Partial", "Overdue"]}
        statusOf={(row) => row.status}
      />
    </div>
  );
}

function InventoryPage({ rows }: { rows: InventoryItem[] }) {
  const columns: Column<InventoryItem>[] = [
    { header: "Item", search: (row) => row.name, cell: (row) => row.name },
    { header: "Category", cell: (row) => row.category },
    { header: "Stock", cell: (row) => `${row.stock} units` },
    { header: "Minimum", cell: (row) => row.minimum },
    { header: "Supplier", search: (row) => row.supplier, cell: (row) => row.supplier },
    {
      header: "Status",
      cell: (row) => (
        <StatusBadge
          label={row.status}
          tone={row.status === "Healthy" ? "teal" : row.status === "Low Stock" ? "amber" : "red"}
        />
      ),
    },
  ];
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Inventory"
        title="Equipment, medicines, and low stock alerts"
        description="Keep clinical supplies visible before they become operational problems."
      />
      <div className="grid gap-3 md:grid-cols-3">
        <AlertCard
          title="Critical"
          value={`${rows.filter((item) => item.status === "Critical").length} items`}
          tone="red"
        />
        <AlertCard
          title="Low stock"
          value={`${rows.filter((item) => item.status === "Low Stock").length} items`}
          tone="amber"
        />
        <AlertCard
          title="Healthy"
          value={`${rows.filter((item) => item.status === "Healthy").length} items`}
          tone="teal"
        />
      </div>
      <DataTable
        rows={rows}
        columns={columns}
        statusOptions={["Healthy", "Low Stock", "Critical"]}
        statusOf={(row) => row.status}
      />
    </div>
  );
}

function AICenterPage({ setActiveView }: { setActiveView: (view: AdminView) => void }) {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="AI Center"
        title="AI modules for dental operations"
        description="Each module has a dedicated workflow with forms, chat UI where useful, progress indicators, and result panels."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {aiModules.map((module) => {
          const insight = getModuleInsight(module.id);
          return (
            <Card
              key={module.id}
              className="border-border shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <CardContent className="p-5">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-primary-gradient text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{module.title}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">
                  {module.description}
                </p>
                <ProgressBar value={insight.progress} />
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {insight.output}
                </p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => setActiveView(module.id)}
                >
                  Open module
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AIModulePage({ view }: { view: AdminView }) {
  const module = aiModules.find((item) => item.id === view) ?? aiModules[0];
  const insight = getModuleInsight(module.id);
  const isChat = view === "ai-assistant" || view === "emergency-ai-guidance";
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
      <div className="space-y-5">
        <PageHeader eyebrow="AI workflow" title={module.title} description={module.description} />
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">
              {isChat ? "Conversation" : "Clinical input"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isChat ? (
              <ChatPanel urgent={view === "emergency-ai-guidance"} />
            ) : (
              <AIForm title={module.title} />
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Result panel</CardTitle>
          <p className="text-sm text-muted-foreground">
            Live output generated from current clinic records for review before clinical use.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar value={insight.progress} />
          <div className="rounded-md border border-teal/25 bg-teal/10 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">
              AI result
            </div>
            <p className="mt-2 text-sm leading-6">{insight.output}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => toast.success("Result saved for clinical review")}>
              <CheckCircle2 /> Save
            </Button>
            <Button variant="outline" onClick={() => toast.success("Result exported")}>
              <Download /> Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsPage({ data }: { data: ClinicSnapshot }) {
  const revenue = data.invoices.reduce((sum, invoice) => sum + invoice.paid, 0);
  const appointmentCount = data.appointments.length;
  const patientCount = data.patients.length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Reports"
        title="Revenue, appointment, and patient reports"
        description="Executive summaries for operational reviews and business planning."
        action={
          <Button onClick={() => toast.success("Reports exported")}>
            <Download /> Export
          </Button>
        }
      />
      <div className="grid gap-5 xl:grid-cols-3">
        {[
          ["Revenue Report", currency.format(revenue), "collected live revenue"],
          ["Appointment Report", String(appointmentCount), "live appointment records"],
          ["Patient Report", String(patientCount), "live patient records"],
        ].map(([title, value, detail]) => (
          <Card key={title} className="border-border shadow-card">
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">{title}</div>
              <div className="mt-2 text-3xl font-semibold">{value}</div>
              <p className="mt-2 text-sm text-teal">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ChartPanel title="Business trend" subtitle="Revenue, appointments, and patient growth">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#554c72" strokeWidth={2} />
            <Line type="monotone" dataKey="appointments" stroke="#554c72" strokeWidth={2} />
            <Line type="monotone" dataKey="patients" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Settings"
        title="Clinic profile, working hours, admin profile, and security"
        description="Frontend settings screens prepared for future real-world integrations."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsCard
          title="Clinic Profile"
          fields={["Healthy Grins Dental Clinic", "+91 9821127942", "WhatsApp: +91 9821127942"]}
        />
        <SettingsCard
          title="Working Hours"
          fields={["Mon-Sat: 10am-02pm", "Mon-Sat: 05pm-08pm", "Sun: By Appointment Only"]}
        />
        <SettingsCard title="Admin Profile" fields={["Admin Team", "Clinic Operations Lead"]} />
        <SettingsCard
          title="Security"
          fields={[
            "Two-factor authentication enabled",
            "Role-based access ready",
            "Audit log UI prepared",
          ]}
        />
      </div>
    </div>
  );
}

function DataTable<T>({
  rows,
  columns,
  initialSearch = "",
  statusOptions,
  statusOf,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  initialSearch?: string;
  statusOptions?: string[];
  statusOf?: (row: T) => string;
  onRowClick?: (row: T) => void;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const text = columns
        .map((column) => column.search?.(row) ?? String(column.cell(row)))
        .join(" ")
        .toLowerCase();
      const statusMatch = status === "all" || statusOf?.(row) === status;
      return statusMatch && (!term || text.includes(term));
    });
  }, [columns, rows, search, status, statusOf]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  return (
    <Card className="border-border shadow-card">
      <CardContent className="p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search table..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          {statusOptions && (
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer" : undefined}
              >
                {columns.map((column) => (
                  <TableCell key={column.header}>{column.cell(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} records</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft />
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: typeof CalendarClock;
}) {
  const positive = !delta.startsWith("-");
  return (
    <Card className="border-border shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              positive ? "text-teal" : "text-amber-600",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {delta}
          </span>
        </div>
        <div className="mt-4 text-2xl font-semibold">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  const styles: Record<StatusTone, string> = {
    blue: "border-[#d8d2e8] bg-[#f5f3f8] text-[#554c72] dark:border-[#5f547d] dark:bg-[#2a233d] dark:text-[#d8d2e8]",
    teal: "border-[#d8d2e8] bg-[#f5f3f8] text-[#554c72] dark:border-[#5f547d] dark:bg-[#2a233d] dark:text-[#d8d2e8]",
    amber:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
    slate:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    green:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  };
  return (
    <Badge variant="outline" className={styles[tone]}>
      {label}
    </Badge>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary-gradient" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ProfileCell({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-muted text-xs font-semibold">
        {title.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ChatPanel({ urgent }: { urgent: boolean }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const prompts = urgent
    ? [
        "Patient reports knocked-out tooth and bleeding",
        "Severe swelling with fever",
        "Broken crown with sharp edge",
      ]
    : [
        "Can I schedule whitening next week?",
        "Explain implant recovery",
        "Summarize today's patient flow",
      ];
  const [messages, setMessages] = useState([
    {
      role: "AI",
      text: urgent
        ? "Tell me the injury, pain level, bleeding status, and time since it happened."
        : "Hi, I can answer from current clinic records: patients, appointments, billing, inventory, and reports.",
    },
    { role: "Admin", text: prompts[0], align: "right" as const },
    {
      role: "AI",
      text: urgent
        ? "High priority. Preserve tooth in milk or saline, control bleeding with gauze, and contact the clinic now."
        : "I can prepare an appointment-ready summary and recommended next steps for clinician review.",
    },
  ]);

  async function sendPrompt(prompt = message) {
    const text = prompt.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "Admin", text, align: "right" as const }];
    setMessages(nextMessages);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((item) => ({
            role: item.role === "Admin" ? "user" : "assistant",
            content: item.text,
          })),
        }),
      });

      if (!response.ok || !response.body) throw new Error("AI request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      let buffer = "";
      setMessages([...nextMessages, { role: "AI", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (!delta) continue;
          answer += delta;
          setMessages([...nextMessages, { role: "AI", text: answer }]);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "AI request failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-md border border-border bg-muted/40 p-3">
        {messages.map((item, index) => (
          <ChatBubble key={`${item.role}-${index}`} {...item} text={item.text || "Thinking..."} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <Button
            key={prompt}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => sendPrompt(prompt)}
            disabled={loading}
          >
            {prompt}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a prompt..."
          onKeyDown={(event) => {
            if (event.key === "Enter") sendPrompt();
          }}
        />
        <Button onClick={() => sendPrompt()} disabled={loading || !message.trim()}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

function ChatBubble({
  role,
  text,
  align = "left",
}: {
  role: string;
  text: string;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("flex", align === "right" && "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-md px-3 py-2 text-sm leading-6",
          align === "right"
            ? "bg-primary text-primary-foreground"
            : "bg-background border border-border",
        )}
      >
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">
          {role}
        </div>
        {text}
      </div>
    </div>
  );
}

function AIForm({ title }: { title: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Patient">
        <Input placeholder="Search or enter live patient" />
      </Field>
      <Field label="Module">
        <Input readOnly value={title} />
      </Field>
      <Field label="Symptoms or findings" className="sm:col-span-2">
        <Textarea placeholder="Enter real symptoms, report notes, or clinical findings." />
      </Field>
      <Field label="Clinical priority">
        <Select defaultValue="routine">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="routine">Routine</SelectItem>
            <SelectItem value="soon">Soon</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Supporting files">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast.info("Connect storage to attach real image/report files.")}
        >
          <Upload /> Upload image/report
        </Button>
      </Field>
      <Button className="sm:col-span-2" onClick={() => toast.success("AI result generated")}>
        <Sparkles /> Generate result
      </Button>
    </div>
  );
}

function SettingsCard({ title, fields }: { title: string; fields: string[] }) {
  return (
    <Card className="border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fields.map((field) => (
          <Input key={field} defaultValue={field} />
        ))}
        <Button variant="outline" onClick={() => toast.success(`${title} saved`)}>
          <Settings2 /> Save
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function AlertCard({ title, value, tone }: { title: string; value: string; tone: StatusTone }) {
  return (
    <Card className="border-border shadow-card">
      <CardContent className="p-4">
        <StatusBadge label={title} tone={tone} />
        <div className="mt-3 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-md bg-muted" />
        <div className="h-80 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}

function riskTone(risk: Patient["risk"]): StatusTone {
  if (risk === "Low") return "teal";
  if (risk === "Medium") return "amber";
  return "red";
}

function appointmentTone(status: Appointment["status"]): StatusTone {
  if (status === "Completed") return "teal";
  if (status === "Booked") return "blue";
  if (status === "Rescheduled") return "amber";
  if (status === "Cancelled") return "red";
  return "slate";
}

function invoiceTone(status: Invoice["status"]): StatusTone {
  if (status === "Paid") return "teal";
  if (status === "Partial") return "blue";
  if (status === "Pending") return "amber";
  return "red";
}
