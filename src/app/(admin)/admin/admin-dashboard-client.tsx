"use client";

import {
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
  type ComponentType,
} from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock3,
  MapPinned,
  Pencil,
  Search,
  ShieldAlert,
  Trash2,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  useAdminBookingDetail,
  useAdminBookingIncidents,
  useAdminBookingReview,
  useAdminBuddies,
  useAdminIncidents,
  useAdminMutations,
  useAdminTripBookings,
  useAdminTripDetail,
  useAdminTrips,
  useAdminUserDetail,
  useAdminUsers,
} from "@/features/admin/hooks/useAdmin";
import type {
  AdminBookingStatus,
  AdminIncidentStatus,
  AdminIncidentType,
  AdminTripStatus,
  AdminUser,
} from "@/features/admin/type";
import { cn } from "@/lib/utils";

type AdminTab = "overview" | "users" | "buddies" | "operations" | "incidents";

interface AdminDashboardClientProps {
  initialTab: AdminTab;
}

interface UserFormState {
  fullName: string;
  gender: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  aboutMe: string;
}

interface BuddyFormState {
  userId: string;
  activities: string;
  costPerHour: string;
  languages: string;
  bio: string;
  isActive: string;
}

interface IncidentResolveFormState {
  status: string;
  resolution: string;
}

const ADMIN_TABS: { value: AdminTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "users", label: "Users" },
  { value: "buddies", label: "Buddies" },
  { value: "operations", label: "Trips & bookings" },
  { value: "incidents", label: "Incidents" },
];

const BOOKING_STATUS_OPTIONS: AdminBookingStatus[] = [
  "PendingCustomerConfirm",
  "PendingPayment",
  "Confirmed",
  "InProgress",
  "Completed",
  "Cancelled",
  "CancelledByTimeout",
  "Expired",
];

const INCIDENT_STATUS_OPTIONS: AdminIncidentStatus[] = [
  "Open",
  "InReview",
  "Resolved",
  "Closed",
];

const INCIDENT_TYPE_OPTIONS: AdminIncidentType[] = [
  "NoShow",
  "LateArrival",
  "QualityIssue",
  "SafetyIssue",
  "PaymentIssue",
  "Other",
];

const TRIP_STATUS_OPTIONS: AdminTripStatus[] = [
  "Draft",
  "Open",
  "Closed",
  "Expired",
  "Deleted",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const emptyUserForm: UserFormState = {
  fullName: "",
  gender: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: "",
  aboutMe: "",
};

const emptyBuddyForm: BuddyFormState = {
  userId: "",
  activities: "",
  costPerHour: "",
  languages: "",
  bio: "",
  isActive: "true",
};

const emptyIncidentResolveForm: IncidentResolveFormState = {
  status: "InReview",
  resolution: "",
};

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Something went wrong.";
}

function formatDateTime(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDate(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}

function formatCurrency(amount?: number | null, currency = "USD") {
  if (typeof amount !== "number") return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function toDateInputValue(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

function toDateTimePayload(value: string) {
  return value ? `${value}T00:00:00` : null;
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinCsv(value?: string[] | null) {
  return value?.filter(Boolean).join(", ") ?? "";
}

function getInitials(value?: string | null) {
  const name = value?.trim() || "AD";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getStatusTone(status?: string | null) {
  switch (status) {
    case "Completed":
    case "Resolved":
    case "Closed":
    case "Confirmed":
    case "Active":
    case "Verified":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PendingPayment":
    case "PendingCustomerConfirm":
    case "InReview":
    case "InProgress":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Cancelled":
    case "CancelledByTimeout":
    case "Expired":
    case "Deleted":
    case "Inactive":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Open":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-border bg-muted text-foreground";
  }
}

function StatusPill({ label }: { label?: string | null }) {
  return (
    <Badge variant="outline" className={cn("font-medium", getStatusTone(label))}>
      {label ?? "Unknown"}
    </Badge>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">{value}</CardTitle>
          </div>
          <div className="rounded-xl border border-border/80 bg-muted/40 p-2.5">
            <Icon className="h-5 w-5 text-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

function PaginationControls({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border/70 px-6 py-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {Math.max(totalPages, 1)}
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onPrevious} disabled={!hasPreviousPage}>
          Previous
        </Button>
        <Button size="sm" variant="outline" onClick={onNext} disabled={!hasNextPage}>
          Next
        </Button>
      </div>
    </div>
  );
}

export function AdminDashboardClient({ initialTab }: AdminDashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTabTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const [userSearch, setUserSearch] = useState("");
  const deferredUserSearch = useDeferredValue(userSearch);
  const [userGenderFilter, setUserGenderFilter] = useState("");
  const [userVerificationFilter, setUserVerificationFilter] = useState("all");
  const [usersPage, setUsersPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);

  const [selectedBuddyId, setSelectedBuddyId] = useState<string | null>(null);
  const [isRegisterBuddyDialogOpen, setIsRegisterBuddyDialogOpen] = useState(false);
  const [isEditBuddyDialogOpen, setIsEditBuddyDialogOpen] = useState(false);
  const [buddyForm, setBuddyForm] = useState<BuddyFormState>(emptyBuddyForm);

  const [tripSearch, setTripSearch] = useState("");
  const deferredTripSearch = useDeferredValue(tripSearch);
  const [tripCityFilter, setTripCityFilter] = useState("");
  const [tripStatusFilter, setTripStatusFilter] = useState("");
  const [tripsPage, setTripsPage] = useState(1);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [bookingStatusDraft, setBookingStatusDraft] = useState("");

  const [incidentBookingIdFilter, setIncidentBookingIdFilter] = useState("");
  const [incidentStatusFilter, setIncidentStatusFilter] = useState("");
  const [incidentTypeFilter, setIncidentTypeFilter] = useState("");
  const [incidentsPage, setIncidentsPage] = useState(1);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isResolveIncidentDialogOpen, setIsResolveIncidentDialogOpen] = useState(false);
  const [incidentResolveForm, setIncidentResolveForm] =
    useState<IncidentResolveFormState>(emptyIncidentResolveForm);

  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "user" | "buddy";
    id: string;
    label: string;
  } | null>(null);

  const usersQuery = useAdminUsers({
    Page: usersPage,
    PageSize: 10,
    Search: deferredUserSearch || undefined,
    Gender: userGenderFilter || undefined,
    IsEmailVerified:
      userVerificationFilter === "all"
        ? undefined
        : userVerificationFilter === "verified",
    SortBy: "createdAt",
    SortOrder: "desc",
  });
  const userDetailQuery = useAdminUserDetail(selectedUserId);
  const buddiesQuery = useAdminBuddies();
  const tripsQuery = useAdminTrips({
    Page: tripsPage,
    PageSize: 10,
    Search: deferredTripSearch || undefined,
    City: tripCityFilter || undefined,
    Status: tripStatusFilter || undefined,
    SortBy: "createdAt",
    SortOrder: "desc",
  });
  const tripDetailQuery = useAdminTripDetail(selectedTripId);
  const tripBookingsQuery = useAdminTripBookings(selectedTripId);
  const bookingDetailQuery = useAdminBookingDetail(selectedBookingId);
  const bookingReviewQuery = useAdminBookingReview(selectedBookingId);
  const bookingIncidentsQuery = useAdminBookingIncidents(selectedBookingId);
  const incidentsQuery = useAdminIncidents({
    Page: incidentsPage,
    PageSize: 10,
    BookingId: incidentBookingIdFilter || undefined,
    Status: incidentStatusFilter || undefined,
    Type: incidentTypeFilter || undefined,
  });

  const {
    updateUserMutation,
    deleteUserMutation,
    registerBuddyMutation,
    updateBuddyMutation,
    deleteBuddyMutation,
    updateBookingStatusMutation,
    resolveIncidentMutation,
  } = useAdminMutations();

  const users = usersQuery.data?.data.items ?? [];
  const buddies = buddiesQuery.data?.data ?? [];
  const trips = tripsQuery.data?.data.items ?? [];
  const tripBookings = tripBookingsQuery.data?.data ?? [];
  const incidents = incidentsQuery.data?.data.items ?? [];

  const selectedUser =
    users.find((user) => user.id === selectedUserId) ?? userDetailQuery.data?.data ?? null;
  const selectedBuddy = buddies.find((buddy) => buddy.id === selectedBuddyId) ?? null;
  const selectedTrip =
    tripDetailQuery.data?.data ?? trips.find((trip) => trip.id === selectedTripId) ?? null;
  const selectedBooking =
    bookingDetailQuery.data?.data ??
    tripBookings.find((booking) => booking.id === selectedBookingId) ??
    null;
  const selectedIncident =
    incidents.find((incident) => incident.id === selectedIncidentId) ?? null;

  const totalUsers = usersQuery.data?.data.totalCount ?? 0;
  const totalBuddies = buddies.length;
  const totalTrips = tripsQuery.data?.data.totalCount ?? 0;
  const totalIncidents = incidentsQuery.data?.data.totalCount ?? 0;
  const verifiedUsersOnPage = users.filter((user) => user.isEmailVerified).length;
  const unresolvedIncidentsOnPage = incidents.filter(
    (incident) => incident.status === "Open" || incident.status === "InReview",
  ).length;
  const openTripsOnPage = trips.filter((trip) => trip.status === "Open").length;
  const confirmedBookingsOnTrip = tripBookings.filter(
    (booking) => booking.status === "Confirmed" || booking.status === "Completed",
  ).length;

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const recentTrips = [...trips]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const incidentQueue = [...incidents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const firstUserId = users[0]?.id ?? null;
    if (!selectedUserId && firstUserId) setSelectedUserId(firstUserId);
  }, [selectedUserId, users]);

  useEffect(() => {
    const firstBuddyId = buddies[0]?.id ?? null;
    if (!selectedBuddyId && firstBuddyId) setSelectedBuddyId(firstBuddyId);
  }, [buddies, selectedBuddyId]);

  useEffect(() => {
    const firstTripId = trips[0]?.id ?? null;
    if (!selectedTripId && firstTripId) setSelectedTripId(firstTripId);
  }, [selectedTripId, trips]);

  useEffect(() => {
    const firstBookingId = tripBookings[0]?.id ?? null;
    if (selectedTripId && !selectedBookingId && firstBookingId) {
      setSelectedBookingId(firstBookingId);
    }
  }, [selectedBookingId, selectedTripId, tripBookings]);

  useEffect(() => {
    const firstIncidentId = incidents[0]?.id ?? null;
    if (!selectedIncidentId && firstIncidentId) setSelectedIncidentId(firstIncidentId);
  }, [incidents, selectedIncidentId]);

  useEffect(() => {
    const detail = userDetailQuery.data?.data;
    if (!detail) return;

    setUserForm({
      fullName: detail.fullName ?? "",
      gender: detail.gender ?? "",
      phoneNumber: detail.phoneNumber ?? "",
      address: detail.address ?? "",
      dateOfBirth: toDateInputValue(detail.dateOfBirth),
      aboutMe: detail.aboutMe ?? "",
    });
  }, [userDetailQuery.data]);

  useEffect(() => {
    if (!selectedBuddy) return;

    setBuddyForm({
      userId: selectedBuddy.userId ?? "",
      activities: joinCsv(selectedBuddy.activities),
      costPerHour:
        typeof selectedBuddy.costPerHour === "number"
          ? String(selectedBuddy.costPerHour)
          : "",
      languages: joinCsv(selectedBuddy.languages),
      bio: selectedBuddy.bio ?? "",
      isActive: selectedBuddy.isActive === false ? "false" : "true",
    });
  }, [selectedBuddy]);

  useEffect(() => {
    setBookingStatusDraft(selectedBooking?.status ?? "");
  }, [selectedBooking?.status]);

  useEffect(() => {
    if (!selectedIncident) return;

    setIncidentResolveForm({
      status:
        selectedIncident.status === "Resolved" || selectedIncident.status === "Closed"
          ? selectedIncident.status
          : "InReview",
      resolution: selectedIncident.resolution ?? "",
    });
  }, [selectedIncident]);

  const handleUserFieldChange = (field: keyof UserFormState, value: string) => {
    setUserForm((current) => ({ ...current, [field]: value }));
  };

  const handleBuddyFieldChange = (field: keyof BuddyFormState, value: string) => {
    setBuddyForm((current) => ({ ...current, [field]: value }));
  };

  const handleIncidentResolveFieldChange = (
    field: keyof IncidentResolveFormState,
    value: string,
  ) => {
    setIncidentResolveForm((current) => ({ ...current, [field]: value }));
  };

  const handleTabChange = (nextTab: string) => {
    const value = nextTab as AdminTab;
    setActiveTab(value);
    startTabTransition(() => {
      router.replace(`${pathname}?tab=${value}`);
    });
  };

  const handleOpenEditUser = (userId: string) => {
    const user = users.find((item) => item.id === userId) ?? null;
    setSelectedUserId(userId);
    if (user) {
      setUserForm({
        fullName: user.fullName ?? "",
        gender: user.gender ?? "",
        phoneNumber: user.phoneNumber ?? "",
        address: user.address ?? "",
        dateOfBirth: toDateInputValue(user.dateOfBirth),
        aboutMe: user.aboutMe ?? "",
      });
    }
    setIsUserDialogOpen(true);
  };

  const handleOpenRegisterBuddy = (user?: AdminUser | null) => {
    setBuddyForm({
      ...emptyBuddyForm,
      userId: user?.id ?? "",
    });
    setIsRegisterBuddyDialogOpen(true);
  };

  const handleOpenEditBuddy = (buddyId: string) => {
    const buddy = buddies.find((item) => item.id === buddyId) ?? null;
    setSelectedBuddyId(buddyId);
    if (buddy) {
      setBuddyForm({
        userId: buddy.userId ?? "",
        activities: joinCsv(buddy.activities),
        costPerHour:
          typeof buddy.costPerHour === "number" ? String(buddy.costPerHour) : "",
        languages: joinCsv(buddy.languages),
        bio: buddy.bio ?? "",
        isActive: buddy.isActive === false ? "false" : "true",
      });
    }
    setIsEditBuddyDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.kind === "user") {
        await deleteUserMutation.mutateAsync(deleteTarget.id);
        if (selectedUserId === deleteTarget.id) setSelectedUserId(null);
        toast({ title: "User deleted", description: "The user record has been removed." });
      } else {
        await deleteBuddyMutation.mutateAsync(deleteTarget.id);
        if (selectedBuddyId === deleteTarget.id) setSelectedBuddyId(null);
        toast({
          title: "Buddy deleted",
          description: "The buddy profile has been removed.",
        });
      }

      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: "Action failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUserId) return;

    try {
      await updateUserMutation.mutateAsync({
        id: selectedUserId,
        payload: {
          fullName: userForm.fullName.trim() || null,
          gender: userForm.gender || null,
          phoneNumber: userForm.phoneNumber.trim() || null,
          address: userForm.address.trim() || null,
          dateOfBirth: toDateTimePayload(userForm.dateOfBirth),
          aboutMe: userForm.aboutMe.trim() || null,
        },
      });

      toast({
        title: "User updated",
        description: "The user profile has been updated successfully.",
      });
      setIsUserDialogOpen(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleRegisterBuddy = async () => {
    try {
      await registerBuddyMutation.mutateAsync({
        userId: buddyForm.userId.trim(),
        payload: {
          activities: splitCsv(buddyForm.activities),
          costPerHour: Number(buddyForm.costPerHour),
          languages: splitCsv(buddyForm.languages),
          bio: buddyForm.bio.trim() || null,
        },
      });

      toast({
        title: "Buddy profile created",
        description: "The selected user is now registered as a buddy.",
      });
      setIsRegisterBuddyDialogOpen(false);
      setBuddyForm(emptyBuddyForm);
    } catch (error) {
      toast({
        title: "Could not create buddy",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleUpdateBuddy = async () => {
    if (!selectedBuddyId) return;

    try {
      await updateBuddyMutation.mutateAsync({
        id: selectedBuddyId,
        payload: {
          activities: splitCsv(buddyForm.activities),
          costPerHour: buddyForm.costPerHour ? Number(buddyForm.costPerHour) : null,
          languages: splitCsv(buddyForm.languages),
          bio: buddyForm.bio.trim() || null,
          isActive: buddyForm.isActive === "true",
        },
      });

      toast({
        title: "Buddy updated",
        description: "Buddy availability and profile details have been updated.",
      });
      setIsEditBuddyDialogOpen(false);
    } catch (error) {
      toast({
        title: "Could not update buddy",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleUpdateBookingStatus = async () => {
    if (!selectedBookingId || !bookingStatusDraft) return;

    try {
      await updateBookingStatusMutation.mutateAsync({
        id: selectedBookingId,
        payload: { status: bookingStatusDraft },
      });
      toast({
        title: "Booking updated",
        description: "The booking status has been changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Could not update booking",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleResolveIncident = async () => {
    if (!selectedIncidentId) return;

    try {
      await resolveIncidentMutation.mutateAsync({
        id: selectedIncidentId,
        payload: {
          status: incidentResolveForm.status || undefined,
          resolution: incidentResolveForm.resolution.trim() || null,
        },
      });
      toast({
        title: "Incident updated",
        description: "The incident resolution status has been saved.",
      });
      setIsResolveIncidentDialogOpen(false);
    } catch (error) {
      toast({
        title: "Could not resolve incident",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/20 p-6 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit bg-background/80">
                Bonddy admin console
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Operations dashboard for users, buddies, bookings and incidents
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                  This workspace is mapped directly to your admin endpoints. Use it to
                  triage incidents, manage customer and buddy records, inspect trips, and
                  intervene on bookings without leaving the admin shell.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="gap-3 border-border/70 bg-background/90 px-5 py-4 shadow-none">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Response focus
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  {unresolvedIncidentsOnPage} unresolved incidents on the current page
                </div>
              </Card>

              <Card className="gap-3 border-border/70 bg-background/90 px-5 py-4 shadow-none">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Operations pulse
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Clock3 className="h-4 w-4 text-sky-600" />
                  {confirmedBookingsOnTrip} confirmed/completed bookings in the selected trip
                </div>
              </Card>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Users"
            value={String(totalUsers)}
            description={`${verifiedUsersOnPage} verified users on the current page.`}
            icon={Users}
          />
          <StatCard
            title="Buddy profiles"
            value={String(totalBuddies)}
            description="Active marketplace supply available for trip matching."
            icon={MapPinned}
          />
          <StatCard
            title="Trips"
            value={String(totalTrips)}
            description={`${openTripsOnPage} open trips in the current page slice.`}
            icon={BookOpen}
          />
          <StatCard
            title="Incident tickets"
            value={String(totalIncidents)}
            description="Escalations and support-sensitive booking issues."
            icon={AlertTriangle}
          />
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-1.5 lg:grid-cols-5">
            {ADMIN_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-xl px-3 py-2.5">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Control priorities</CardTitle>
                  <CardDescription>
                    Cross-functional snapshots for the most important admin workflows.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-700">
                      Verification queue
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-amber-950">
                      {Math.max(users.length - verifiedUsersOnPage, 0)}
                    </p>
                    <p className="mt-2 text-sm text-amber-800">
                      Accounts on this page that still need email verification follow-up.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-sky-700">
                      Open trip demand
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-sky-950">{openTripsOnPage}</p>
                    <p className="mt-2 text-sm text-sky-800">
                      Open trip requests visible in the current dataset.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-rose-700">
                      Incident pressure
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-rose-950">
                      {unresolvedIncidentsOnPage}
                    </p>
                    <p className="mt-2 text-sm text-rose-800">
                      Tickets on this page still waiting for a final resolution.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Quick moves</CardTitle>
                  <CardDescription>
                    Jump straight into the admin tasks that require action.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      label: "Review customer accounts",
                      description: "Inspect user records, verification state and editable profile fields.",
                      tab: "users" as AdminTab,
                    },
                    {
                      label: "Assign or edit buddies",
                      description: "Register user accounts as buddies and tune availability data.",
                      tab: "buddies" as AdminTab,
                    },
                    {
                      label: "Inspect trips and bookings",
                      description: "Check trip demand, booking status and review outcomes.",
                      tab: "operations" as AdminTab,
                    },
                    {
                      label: "Resolve incident queue",
                      description: "Move tickets from open/in-review to resolved or closed.",
                      tab: "incidents" as AdminTab,
                    },
                  ].map((item) => (
                    <button
                      key={item.tab}
                      type="button"
                      onClick={() => handleTabChange(item.tab)}
                      className="flex w-full items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-left transition-colors hover:bg-muted/40"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Recent users</CardTitle>
                  <CardDescription>Latest customer records coming into the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentUsers.length ? (
                    recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {user.fullName || "Unnamed user"}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">{user.email || "No email"}</p>
                        </div>
                        <StatusPill label={user.isEmailVerified ? "Verified" : "Pending"} />
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No users loaded"
                      description="The admin users endpoint did not return any records for the current filters."
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Latest trips</CardTitle>
                  <CardDescription>New traveler demand visible to operations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentTrips.length ? (
                    recentTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">{trip.city || "Unknown city"}</p>
                          <StatusPill label={trip.status} />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {trip.travelerName || "Unknown traveler"} • {formatDate(trip.startDate)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No trips loaded"
                      description="The admin trips endpoint has not returned any rows yet."
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Incident queue</CardTitle>
                  <CardDescription>Newest tickets currently visible to support/admin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incidentQueue.length ? (
                    incidentQueue.map((incident) => (
                      <div
                        key={incident.id}
                        className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">
                            {incident.typeName || incident.type}
                          </p>
                          <StatusPill label={incident.statusName || incident.status} />
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {incident.description || "No description provided."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No incidents loaded"
                      description="The incident queue is empty for the current filters."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>User management</CardTitle>
                <CardDescription>
                  Search and maintain customer accounts through the admin user endpoints.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="user-search">Search</Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="user-search"
                      value={userSearch}
                      onChange={(event) => {
                        setUsersPage(1);
                        setUserSearch(event.target.value);
                      }}
                      placeholder="Search by name or email"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-gender">Gender</Label>
                  <select
                    id="user-gender"
                    className={selectClassName}
                    value={userGenderFilter}
                    onChange={(event) => {
                      setUsersPage(1);
                      setUserGenderFilter(event.target.value);
                    }}
                  >
                    <option value="">All genders</option>
                    {GENDER_OPTIONS.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-verification">Email verification</Label>
                  <select
                    id="user-verification"
                    className={selectClassName}
                    value={userVerificationFilter}
                    onChange={(event) => {
                      setUsersPage(1);
                      setUserVerificationFilter(event.target.value);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOpenRegisterBuddy(selectedUser)}
                  >
                    <UserRoundPlus className="mr-2 h-4 w-4" />
                    Register selected user as buddy
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>
                    {totalUsers} total users from `/api/admin/users`.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {users.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-6">Customer</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Roles</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow
                            key={user.id}
                            data-state={user.id === selectedUserId ? "selected" : undefined}
                            className="cursor-pointer"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            <TableCell className="px-6">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {user.fullName || "Unnamed user"}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {user.phoneNumber || "No phone"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{user.email || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1.5">
                                {(user.roles?.length ? user.roles : ["User"]).map((role) => (
                                  <Badge key={role} variant="outline">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(user.createdAt)}
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleOpenEditUser(user.id);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleOpenRegisterBuddy(user);
                                  }}
                                >
                                  <UserRoundPlus className="mr-2 h-4 w-4" />
                                  Buddy
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setDeleteTarget({
                                      kind: "user",
                                      id: user.id,
                                      label: user.fullName || user.email || "this user",
                                    });
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="px-6 pb-6">
                      <EmptyState
                        title="No users found"
                        description="Adjust the current filters or check whether the admin users endpoint returns records."
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-border/70 px-0 pt-0">
                  <PaginationControls
                    page={usersQuery.data?.data.page ?? 1}
                    totalPages={usersQuery.data?.data.totalPages ?? 1}
                    hasPreviousPage={usersQuery.data?.data.hasPreviousPage ?? false}
                    hasNextPage={usersQuery.data?.data.hasNextPage ?? false}
                    onPrevious={() => setUsersPage((current) => Math.max(current - 1, 1))}
                    onNext={() =>
                      setUsersPage((current) =>
                        usersQuery.data?.data.hasNextPage ? current + 1 : current,
                      )
                    }
                  />
                </CardFooter>
              </Card>

              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Selected user</CardTitle>
                  <CardDescription>
                    Inspect profile data before editing or promoting the account to buddy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedUser ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-foreground">
                            {selectedUser.fullName || "Unnamed user"}
                          </p>
                          <p className="text-sm text-muted-foreground">{selectedUser.email || "No email"}</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background text-sm font-semibold">
                          {getInitials(selectedUser.fullName || selectedUser.email)}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <DetailItem
                          label="Roles"
                          value={
                            <div className="flex flex-wrap gap-1.5">
                              {(selectedUser.roles?.length ? selectedUser.roles : ["User"]).map((role) => (
                                <Badge key={role} variant="outline">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          }
                        />
                        <DetailItem label="Verification" value={<StatusPill label={selectedUser.isEmailVerified ? "Verified" : "Pending"} />} />
                        <DetailItem label="Phone" value={selectedUser.phoneNumber || "N/A"} />
                        <DetailItem label="Gender" value={selectedUser.gender || "N/A"} />
                        <DetailItem label="Date of birth" value={formatDate(selectedUser.dateOfBirth)} />
                        <DetailItem label="Address" value={selectedUser.address || "N/A"} />
                        <DetailItem label="About" value={selectedUser.aboutMe || "No about me provided."} />
                        <DetailItem label="Created" value={formatDateTime(selectedUser.createdAt)} />
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      title="No user selected"
                      description="Pick a row in the user table to inspect profile details."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buddies" className="space-y-6">
            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1.5">
                  <CardTitle>Buddy management</CardTitle>
                  <CardDescription>
                    Manage supply-side profiles created through `/api/admin/buddies`.
                  </CardDescription>
                </div>
                <Button onClick={() => handleOpenRegisterBuddy(null)}>
                  <UserRoundPlus className="mr-2 h-4 w-4" />
                  Register buddy profile
                </Button>
              </CardHeader>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Buddy profiles</CardTitle>
                  <CardDescription>{totalBuddies} buddy records available.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {buddies.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-6">Buddy</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Languages</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {buddies.map((buddy) => (
                          <TableRow
                            key={buddy.id}
                            data-state={buddy.id === selectedBuddyId ? "selected" : undefined}
                            className="cursor-pointer"
                            onClick={() => setSelectedBuddyId(buddy.id)}
                          >
                            <TableCell className="px-6">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {buddy.fullName || buddy.name || "Unnamed buddy"}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {buddy.email || buddy.userId || "No user link"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {typeof buddy.costPerHour === "number"
                                ? `${buddy.costPerHour} USD/hr`
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {joinCsv(buddy.languages) || "N/A"}
                            </TableCell>
                            <TableCell>
                              <StatusPill label={buddy.isActive === false ? "Inactive" : "Active"} />
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleOpenEditBuddy(buddy.id);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setDeleteTarget({
                                      kind: "buddy",
                                      id: buddy.id,
                                      label: buddy.fullName || buddy.name || "this buddy",
                                    });
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="px-6 pb-6">
                      <EmptyState
                        title="No buddies available"
                        description="Register a user as a buddy to populate the supply-side catalog."
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Selected buddy</CardTitle>
                  <CardDescription>Inspect price, language and biography details.</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedBuddy ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-foreground">
                            {selectedBuddy.fullName || selectedBuddy.name || "Unnamed buddy"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedBuddy.email || selectedBuddy.userId || "No linked account"}
                          </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background text-sm font-semibold">
                          {getInitials(selectedBuddy.fullName || selectedBuddy.name || selectedBuddy.email)}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <DetailItem
                          label="Profile status"
                          value={<StatusPill label={selectedBuddy.isActive === false ? "Inactive" : "Active"} />}
                        />
                        <DetailItem
                          label="Cost per hour"
                          value={
                            typeof selectedBuddy.costPerHour === "number"
                              ? `${selectedBuddy.costPerHour} USD`
                              : "N/A"
                          }
                        />
                        <DetailItem label="Activities" value={joinCsv(selectedBuddy.activities) || "N/A"} />
                        <DetailItem label="Languages" value={joinCsv(selectedBuddy.languages) || "N/A"} />
                        <DetailItem label="Bio" value={selectedBuddy.bio || "No biography provided."} />
                        <DetailItem label="Created" value={formatDateTime(selectedBuddy.createdAt)} />
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      title="No buddy selected"
                      description="Choose a buddy row to inspect the supply-side profile details."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Trips and bookings</CardTitle>
                <CardDescription>
                  Monitor demand from `/api/admin/trips`, inspect trip-linked bookings and update booking status.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="trip-search">Search</Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="trip-search"
                      value={tripSearch}
                      onChange={(event) => {
                        setTripsPage(1);
                        setTripSearch(event.target.value);
                      }}
                      placeholder="City or free-text search"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trip-city">City</Label>
                  <Input
                    id="trip-city"
                    value={tripCityFilter}
                    onChange={(event) => {
                      setTripsPage(1);
                      setTripCityFilter(event.target.value);
                    }}
                    placeholder="Ho Chi Minh City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trip-status">Trip status</Label>
                  <select
                    id="trip-status"
                    className={selectClassName}
                    value={tripStatusFilter}
                    onChange={(event) => {
                      setTripsPage(1);
                      setTripStatusFilter(event.target.value);
                    }}
                  >
                    <option value="">All statuses</option>
                    {TRIP_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTripSearch("");
                      setTripCityFilter("");
                      setTripStatusFilter("");
                      setTripsPage(1);
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.95fr)]">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Trips</CardTitle>
                  <CardDescription>
                    {totalTrips} total trip requests visible to admin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {trips.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-6">Trip</TableHead>
                          <TableHead>Traveler</TableHead>
                          <TableHead>Start</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Travel party</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trips.map((trip) => (
                          <TableRow
                            key={trip.id}
                            data-state={trip.id === selectedTripId ? "selected" : undefined}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedTripId(trip.id);
                              setSelectedBookingId(null);
                            }}
                          >
                            <TableCell className="px-6">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {trip.city || "Unknown city"}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {trip.notes || "No notes"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {trip.travelerName || "Unknown traveler"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(trip.startDate)}
                            </TableCell>
                            <TableCell>
                              <StatusPill label={trip.status} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {trip.adults} adults / {trip.children} children
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="px-6 pb-6">
                      <EmptyState
                        title="No trips found"
                        description="The current trip filters did not return any results."
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-border/70 px-0 pt-0">
                  <PaginationControls
                    page={tripsQuery.data?.data.page ?? 1}
                    totalPages={tripsQuery.data?.data.totalPages ?? 1}
                    hasPreviousPage={tripsQuery.data?.data.hasPreviousPage ?? false}
                    hasNextPage={tripsQuery.data?.data.hasNextPage ?? false}
                    onPrevious={() => setTripsPage((current) => Math.max(current - 1, 1))}
                    onNext={() =>
                      setTripsPage((current) =>
                        tripsQuery.data?.data.hasNextPage ? current + 1 : current,
                      )
                    }
                  />
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <Card className="border-border/70">
                  <CardHeader>
                    <CardTitle>Selected trip</CardTitle>
                    <CardDescription>
                      Trip detail from `/api/admin/trips/{'{id}'}`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedTrip ? (
                      <div className="grid gap-3">
                        <DetailItem label="City" value={selectedTrip.city || "N/A"} />
                        <DetailItem label="Traveler" value={selectedTrip.travelerName || "N/A"} />
                        <DetailItem label="Status" value={<StatusPill label={selectedTrip.status} />} />
                        <DetailItem label="Start date" value={formatDate(selectedTrip.startDate)} />
                        <DetailItem label="Start time" value={selectedTrip.startTime || "N/A"} />
                        <DetailItem label="Duration" value={`${selectedTrip.durationHours} hours`} />
                        <DetailItem
                          label="Preferred languages"
                          value={joinCsv(selectedTrip.preferredLanguages) || "N/A"}
                        />
                        <DetailItem label="Activities" value={joinCsv(selectedTrip.activities) || "N/A"} />
                        <DetailItem label="Notes" value={selectedTrip.notes || "No notes provided."} />
                      </div>
                    ) : (
                      <EmptyState
                        title="No trip selected"
                        description="Select a trip from the table to inspect demand and booking activity."
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/70">
                  <CardHeader>
                    <CardTitle>Bookings for selected trip</CardTitle>
                    <CardDescription>
                      Bookings linked to the trip through `/api/admin/trips/{'{tripId}'}/bookings`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    {tripBookings.length ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="px-6">Buddy</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tripBookings.map((booking) => (
                            <TableRow
                              key={booking.id}
                              data-state={booking.id === selectedBookingId ? "selected" : undefined}
                              className="cursor-pointer"
                              onClick={() => setSelectedBookingId(booking.id)}
                            >
                              <TableCell className="px-6">
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-foreground">
                                    {booking.buddyName || "Unknown buddy"}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {booking.bookedDate ? formatDate(booking.bookedDate) : "No booked date"}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <StatusPill label={booking.statusName || booking.status} />
                              </TableCell>
                              <TableCell>{formatCurrency(booking.totalAmount, booking.currency || "USD")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="px-6 pb-6">
                        <EmptyState
                          title="No bookings for this trip"
                          description="Select another trip or wait until booking demand is created."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-border/70">
              <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                <div className="space-y-1.5">
                  <CardTitle>Selected booking detail</CardTitle>
                  <CardDescription>
                    Booking detail, review and incident context for support/admin intervention.
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    aria-label="Booking status"
                    className={cn(selectClassName, "min-w-[220px]")}
                    value={bookingStatusDraft}
                    onChange={(event) => setBookingStatusDraft(event.target.value)}
                    disabled={!selectedBooking}
                  >
                    <option value="">Select status</option>
                    {BOOKING_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleUpdateBookingStatus}
                    disabled={!selectedBooking || !bookingStatusDraft || updateBookingStatusMutation.isPending}
                  >
                    Save booking status
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedBooking ? (
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <DetailItem label="Status" value={<StatusPill label={selectedBooking.statusName || selectedBooking.status} />} />
                      <DetailItem label="Buddy" value={selectedBooking.buddyName || "N/A"} />
                      <DetailItem label="Traveler" value={selectedBooking.travelerName || "N/A"} />
                      <DetailItem label="Booked date" value={formatDate(selectedBooking.bookedDate)} />
                      <DetailItem label="Start time" value={selectedBooking.bookedStartTime || "N/A"} />
                      <DetailItem
                        label="Duration"
                        value={
                          typeof selectedBooking.bookedDurationHours === "number"
                            ? `${selectedBooking.bookedDurationHours} hours`
                            : "N/A"
                        }
                      />
                      <DetailItem
                        label="Party size"
                        value={`${selectedBooking.bookedAdults ?? 0} adults / ${selectedBooking.bookedChildren ?? 0} children`}
                      />
                      <DetailItem
                        label="Total amount"
                        value={formatCurrency(selectedBooking.totalAmount, selectedBooking.currency || "USD")}
                      />
                      <DetailItem
                        label="Platform fee"
                        value={formatCurrency(selectedBooking.platformFeeAmount, selectedBooking.currency || "USD")}
                      />
                      <DetailItem label="Includes" value={selectedBooking.includes || "N/A"} />
                      <DetailItem label="Excludes" value={selectedBooking.excludes || "N/A"} />
                      <DetailItem label="Buddy note" value={selectedBooking.noteForCustomer || "No note for customer."} />
                    </div>

                    <div className="space-y-4">
                      <Card className="gap-4 border-border/70 bg-muted/20 py-4 shadow-none">
                        <CardHeader className="px-4">
                          <CardTitle className="text-base">Review snapshot</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4">
                          {bookingReviewQuery.data?.data ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-foreground">
                                  {bookingReviewQuery.data.data.reviewerName || "Anonymous reviewer"}
                                </p>
                                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                  {bookingReviewQuery.data.data.rating}/5
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {bookingReviewQuery.data.data.comment || "No review comment provided."}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(bookingReviewQuery.data.data.createdAt)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No review is attached to this booking yet.
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="gap-4 border-border/70 bg-muted/20 py-4 shadow-none">
                        <CardHeader className="px-4">
                          <CardTitle className="text-base">Incidents on this booking</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 px-4">
                          {bookingIncidentsQuery.data?.data.length ? (
                            bookingIncidentsQuery.data.data.map((incident) => (
                              <div
                                key={incident.id}
                                className="rounded-xl border border-border/70 bg-background px-4 py-3"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-medium text-foreground">
                                    {incident.typeName || incident.type}
                                  </p>
                                  <StatusPill label={incident.statusName || incident.status} />
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {incident.description || "No description provided."}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No incidents have been reported for this booking.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No booking selected"
                    description="Pick a booking from the selected trip to inspect payment-sensitive operations."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="incidents" className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Incident management</CardTitle>
                <CardDescription>
                  Filter the admin incident queue and close the loop on booking issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-booking">Booking ID</Label>
                  <Input
                    id="incident-booking"
                    value={incidentBookingIdFilter}
                    onChange={(event) => {
                      setIncidentsPage(1);
                      setIncidentBookingIdFilter(event.target.value);
                    }}
                    placeholder="Filter by booking id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-status">Status</Label>
                  <select
                    id="incident-status"
                    className={selectClassName}
                    value={incidentStatusFilter}
                    onChange={(event) => {
                      setIncidentsPage(1);
                      setIncidentStatusFilter(event.target.value);
                    }}
                  >
                    <option value="">All statuses</option>
                    {INCIDENT_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident type</Label>
                  <select
                    id="incident-type"
                    className={selectClassName}
                    value={incidentTypeFilter}
                    onChange={(event) => {
                      setIncidentsPage(1);
                      setIncidentTypeFilter(event.target.value);
                    }}
                  >
                    <option value="">All types</option>
                    {INCIDENT_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIncidentBookingIdFilter("");
                      setIncidentStatusFilter("");
                      setIncidentTypeFilter("");
                      setIncidentsPage(1);
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
              <Card className="border-border/70">
                <CardHeader>
                  <CardTitle>Incident queue</CardTitle>
                  <CardDescription>{totalIncidents} incidents returned by `/api/Incidents`.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {incidents.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-6">Issue</TableHead>
                          <TableHead>Booking</TableHead>
                          <TableHead>Reporter</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incidents.map((incident) => (
                          <TableRow
                            key={incident.id}
                            data-state={incident.id === selectedIncidentId ? "selected" : undefined}
                            className="cursor-pointer"
                            onClick={() => setSelectedIncidentId(incident.id)}
                          >
                            <TableCell className="px-6">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {incident.typeName || incident.type}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {incident.description || "No description"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {incident.bookingId}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {incident.reportedByName || "Unknown reporter"}
                            </TableCell>
                            <TableCell>
                              <StatusPill label={incident.statusName || incident.status} />
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedIncidentId(incident.id);
                                  setIsResolveIncidentDialogOpen(true);
                                }}
                              >
                                Resolve
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="px-6 pb-6">
                      <EmptyState
                        title="No incidents found"
                        description="The current filters did not return any incident records."
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-border/70 px-0 pt-0">
                  <PaginationControls
                    page={incidentsQuery.data?.data.page ?? 1}
                    totalPages={incidentsQuery.data?.data.totalPages ?? 1}
                    hasPreviousPage={incidentsQuery.data?.data.hasPreviousPage ?? false}
                    hasNextPage={incidentsQuery.data?.data.hasNextPage ?? false}
                    onPrevious={() => setIncidentsPage((current) => Math.max(current - 1, 1))}
                    onNext={() =>
                      setIncidentsPage((current) =>
                        incidentsQuery.data?.data.hasNextPage ? current + 1 : current,
                      )
                    }
                  />
                </CardFooter>
              </Card>

              <Card className="border-border/70">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-1.5">
                    <CardTitle>Selected incident</CardTitle>
                    <CardDescription>
                      Investigate context before updating the resolution state.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsResolveIncidentDialogOpen(true)}
                    disabled={!selectedIncident}
                  >
                    Resolve incident
                  </Button>
                </CardHeader>
                <CardContent>
                  {selectedIncident ? (
                    <div className="grid gap-3">
                      <DetailItem label="Type" value={selectedIncident.typeName || selectedIncident.type} />
                      <DetailItem label="Status" value={<StatusPill label={selectedIncident.statusName || selectedIncident.status} />} />
                      <DetailItem label="Booking ID" value={<code className="text-xs">{selectedIncident.bookingId}</code>} />
                      <DetailItem label="Reported by" value={selectedIncident.reportedByName || "Unknown reporter"} />
                      <DetailItem label="Created at" value={formatDateTime(selectedIncident.createdAt)} />
                      <DetailItem label="Resolved at" value={formatDateTime(selectedIncident.resolvedAt)} />
                      <DetailItem label="Description" value={selectedIncident.description || "No description provided."} />
                      <DetailItem label="Resolution" value={selectedIncident.resolution || "No resolution has been saved."} />
                    </div>
                  ) : (
                    <EmptyState
                      title="No incident selected"
                      description="Select an incident row to inspect ticket details and save a resolution."
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit user profile</DialogTitle>
            <DialogDescription>
              Update the fields exposed by `PUT /api/admin/users/{'{id}'}`.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-user-full-name">Full name</Label>
              <Input
                id="edit-user-full-name"
                value={userForm.fullName}
                onChange={(event) => handleUserFieldChange("fullName", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-gender">Gender</Label>
              <select
                id="edit-user-gender"
                className={selectClassName}
                value={userForm.gender}
                onChange={(event) => handleUserFieldChange("gender", event.target.value)}
              >
                <option value="">Unspecified</option>
                {GENDER_OPTIONS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-phone">Phone</Label>
              <Input
                id="edit-user-phone"
                value={userForm.phoneNumber}
                onChange={(event) => handleUserFieldChange("phoneNumber", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-dob">Date of birth</Label>
              <Input
                id="edit-user-dob"
                type="date"
                value={userForm.dateOfBirth}
                onChange={(event) => handleUserFieldChange("dateOfBirth", event.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-user-address">Address</Label>
              <Input
                id="edit-user-address"
                value={userForm.address}
                onChange={(event) => handleUserFieldChange("address", event.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-user-about">About me</Label>
              <Textarea
                id="edit-user-about"
                value={userForm.aboutMe}
                onChange={(event) => handleUserFieldChange("aboutMe", event.target.value)}
                className="min-h-28"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={updateUserMutation.isPending}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isRegisterBuddyDialogOpen}
        onOpenChange={(open) => {
          setIsRegisterBuddyDialogOpen(open);
          if (!open) setBuddyForm(emptyBuddyForm);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register buddy profile</DialogTitle>
            <DialogDescription>
              Create a new buddy profile through `POST /api/admin/buddies/{'{userId}'}`.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="buddy-user-id">User ID</Label>
              <Input
                id="buddy-user-id"
                value={buddyForm.userId}
                onChange={(event) => handleBuddyFieldChange("userId", event.target.value)}
                placeholder="UUID of the user to promote"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buddy-rate">Cost per hour</Label>
              <Input
                id="buddy-rate"
                type="number"
                min="0"
                value={buddyForm.costPerHour}
                onChange={(event) => handleBuddyFieldChange("costPerHour", event.target.value)}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buddy-languages">Languages</Label>
              <Input
                id="buddy-languages"
                value={buddyForm.languages}
                onChange={(event) => handleBuddyFieldChange("languages", event.target.value)}
                placeholder="English, Vietnamese"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="buddy-activities">Activities</Label>
              <Input
                id="buddy-activities"
                value={buddyForm.activities}
                onChange={(event) => handleBuddyFieldChange("activities", event.target.value)}
                placeholder="Street food, coffee walk, museums"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="buddy-bio">Bio</Label>
              <Textarea
                id="buddy-bio"
                value={buddyForm.bio}
                onChange={(event) => handleBuddyFieldChange("bio", event.target.value)}
                className="min-h-28"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterBuddyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRegisterBuddy}
              disabled={registerBuddyMutation.isPending || !buddyForm.userId.trim() || !buddyForm.costPerHour}
            >
              Create buddy profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditBuddyDialogOpen} onOpenChange={setIsEditBuddyDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit buddy profile</DialogTitle>
            <DialogDescription>
              Update rate, content and active state for the selected buddy.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-buddy-rate">Cost per hour</Label>
              <Input
                id="edit-buddy-rate"
                type="number"
                min="0"
                value={buddyForm.costPerHour}
                onChange={(event) => handleBuddyFieldChange("costPerHour", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-buddy-status">Status</Label>
              <select
                id="edit-buddy-status"
                className={selectClassName}
                value={buddyForm.isActive}
                onChange={(event) => handleBuddyFieldChange("isActive", event.target.value)}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-buddy-activities">Activities</Label>
              <Input
                id="edit-buddy-activities"
                value={buddyForm.activities}
                onChange={(event) => handleBuddyFieldChange("activities", event.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-buddy-languages">Languages</Label>
              <Input
                id="edit-buddy-languages"
                value={buddyForm.languages}
                onChange={(event) => handleBuddyFieldChange("languages", event.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-buddy-bio">Bio</Label>
              <Textarea
                id="edit-buddy-bio"
                value={buddyForm.bio}
                onChange={(event) => handleBuddyFieldChange("bio", event.target.value)}
                className="min-h-28"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBuddyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBuddy} disabled={updateBuddyMutation.isPending}>
              Save buddy profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResolveIncidentDialogOpen} onOpenChange={setIsResolveIncidentDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Resolve incident</DialogTitle>
            <DialogDescription>
              Save the new status and resolution message through `PATCH /api/admin/incidents/{'{id}'}/resolve`.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="resolve-status">Status</Label>
              <select
                id="resolve-status"
                className={selectClassName}
                value={incidentResolveForm.status}
                onChange={(event) => handleIncidentResolveFieldChange("status", event.target.value)}
              >
                {INCIDENT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resolve-note">Resolution</Label>
              <Textarea
                id="resolve-note"
                value={incidentResolveForm.resolution}
                onChange={(event) => handleIncidentResolveFieldChange("resolution", event.target.value)}
                placeholder="Explain how the issue was handled."
                className="min-h-32"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveIncidentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleResolveIncident}
              disabled={resolveIncidentMutation.isPending || !selectedIncidentId}
            >
              Save resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.kind}</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove {deleteTarget?.label || "the selected record"} from the admin dataset. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete permanently</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
