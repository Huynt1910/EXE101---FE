"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { UserRoundPlus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SegmentedTabsList,
  SegmentedTabsTrigger,
} from "@/components/ui/segmented-tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { BuddyAllProfilesPanel } from "@/app/(admin)/admin/_components/buddy-all-profiles-panel";
import { PendingBuddyApplicationsPanel } from "@/app/(admin)/admin/_components/pending-buddy-applications-panel";
import {
  useAdminBuddies,
  useAdminBuddyDetail,
  useAdminMutations,
} from "@/features/admin/hooks/useAdmin";
import type { AdminBuddy } from "@/features/admin/type";
import { usePendingApplicantsQuery } from "@/features/buddy/hooks/useBuddy";
import type { BuddyProfile } from "@/features/buddy/type";
import {
  DetailItem,
  EmptyState,
  StatusPill,
  getErrorMessage,
  getInitials,
  selectClassName,
  splitCsv,
} from "@/app/(admin)/admin/_components/admin-shared";
import { formatDate, formatDateTime } from "@/utils/formatDateAndTime";
import { formatStringList } from "@/utils/formatListData";

interface BuddyFormState {
  userId: string;
  activities: string;
  costPerHour: string;
  languages: string;
  bio: string;
  isActive: string;
}

const BUDDY_SORT_OPTIONS = [
  { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Name A-Z", sortBy: "fullName", sortOrder: "asc" },
  { label: "Name Z-A", sortBy: "fullName", sortOrder: "desc" },
  { label: "Highest rate", sortBy: "costPerHour", sortOrder: "desc" },
  { label: "Lowest rate", sortBy: "costPerHour", sortOrder: "asc" },
] as const;

const emptyBuddyForm: BuddyFormState = {
  userId: "",
  activities: "",
  costPerHour: "",
  languages: "",
  bio: "",
  isActive: "true",
};

function toBuddyFormState(buddy: {
  userId?: string | null;
  activities?: string[] | null;
  costPerHour?: number | null;
  languages?: string[] | null;
  bio?: string | null;
  isActive?: boolean | null;
}): BuddyFormState {
  return {
    userId: buddy.userId ?? "",
    activities: formatStringList(buddy.activities),
    costPerHour:
      typeof buddy.costPerHour === "number" ? String(buddy.costPerHour) : "",
    languages: formatStringList(buddy.languages),
    bio: buddy.bio ?? "",
    isActive: buddy.isActive === false ? "false" : "true",
  };
}

function compareNullableText(left?: string | null, right?: string | null) {
  return (left ?? "").localeCompare(right ?? "", undefined, {
    sensitivity: "base",
  });
}

function compareNullableNumber(left?: number | null, right?: number | null) {
  return (left ?? 0) - (right ?? 0);
}

function compareNullableDate(left?: string | null, right?: string | null) {
  const leftTime = left ? new Date(left).getTime() : 0;
  const rightTime = right ? new Date(right).getTime() : 0;
  return leftTime - rightTime;
}

function getBuddyDisplayName(
  buddy:
    | AdminBuddy
    | BuddyProfile
    | { fullName?: string | null; name?: string | null; email?: string | null },
) {
  const withOptionalName = buddy as {
    fullName?: string | null;
    name?: string | null;
    email?: string | null;
  };
  return (
    withOptionalName.fullName ||
    withOptionalName.name ||
    withOptionalName.email ||
    "Unnamed buddy"
  );
}

export function BuddiesClient() {
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const [buddySearch, setBuddySearch] = useState("");
  const deferredBuddySearch = useDeferredValue(buddySearch);
  const [buddySortValue, setBuddySortValue] = useState(
    `${BUDDY_SORT_OPTIONS[0].sortBy}:${BUDDY_SORT_OPTIONS[0].sortOrder}`,
  );

  const [buddiesPage, setBuddiesPage] = useState(1);
  const [selectedBuddyId, setSelectedBuddyId] = useState<string | null>(null);
  const [isRegisterBuddyDialogOpen, setIsRegisterBuddyDialogOpen] =
    useState(false);
  const [isEditBuddyDialogOpen, setIsEditBuddyDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [buddyForm, setBuddyForm] = useState<BuddyFormState>(emptyBuddyForm);

  const [sortBy, sortOrder] = buddySortValue.split(":");

  const buddiesQuery = useAdminBuddies({
    Page: buddiesPage,
    PageSize: 10,
    Search: deferredBuddySearch || undefined,
    SortBy: sortBy || undefined,
    SortOrder: sortOrder || undefined,
  });
  const pendingApplicantsQuery = usePendingApplicantsQuery();
  const buddyDetailQuery = useAdminBuddyDetail(selectedBuddyId);
  const {
    registerBuddyMutation,
    updateBuddyMutation,
    approveBuddyMutation,
    deleteBuddyMutation,
  } = useAdminMutations();

  const buddies = buddiesQuery.data?.data.items ?? [];
  const totalBuddies = buddiesQuery.data?.data.totalCount ?? 0;
  const pendingApplicants = useMemo(() => {
    const searchTerm = deferredBuddySearch.trim().toLowerCase();
    const list = [...(pendingApplicantsQuery.data?.data ?? [])];

    const filtered = searchTerm
      ? list.filter((buddy) =>
          [buddy.fullName, buddy.email, buddy.userId]
            .filter((value): value is string => Boolean(value))
            .some((value) => value.toLowerCase().includes(searchTerm)),
        )
      : list;

    filtered.sort((left, right) => {
      let result = 0;

      switch (sortBy) {
        case "fullName":
          result = compareNullableText(left.fullName, right.fullName);
          break;
        case "costPerHour":
          result = compareNullableNumber(left.costPerHour, right.costPerHour);
          break;
        case "createdAt":
        default:
          result = compareNullableDate(left.createdAt, right.createdAt);
          break;
      }

      return sortOrder === "asc" ? result : -result;
    });

    return filtered;
  }, [
    deferredBuddySearch,
    pendingApplicantsQuery.data?.data,
    sortBy,
    sortOrder,
  ]);
  const displayedBuddies =
    activeTab === "pending" ? pendingApplicants : buddies;
  const selectedBuddy =
    buddyDetailQuery.data?.data ??
    displayedBuddies.find((buddy) => buddy.id === selectedBuddyId) ??
    null;

  useEffect(() => {
    const firstBuddyId = displayedBuddies[0]?.id ?? null;

    if (!firstBuddyId) {
      setSelectedBuddyId(null);
      return;
    }

    if (
      !selectedBuddyId ||
      !displayedBuddies.some((buddy) => buddy.id === selectedBuddyId)
    ) {
      setSelectedBuddyId(firstBuddyId);
    }
  }, [displayedBuddies, selectedBuddyId]);

  useEffect(() => {
    setSelectedBuddyId(null);
  }, [activeTab]);

  useEffect(() => {
    if (!selectedBuddy) return;
    setBuddyForm(toBuddyFormState(selectedBuddy));
  }, [selectedBuddy]);

  const handleBuddyFieldChange = (
    field: keyof BuddyFormState,
    value: string,
  ) => {
    setBuddyForm((current) => ({ ...current, [field]: value }));
  };

  const handleOpenEditBuddy = () => {
    if (!selectedBuddy) return;
    setBuddyForm(toBuddyFormState(selectedBuddy));
    setIsEditBuddyDialogOpen(true);
  };

  const handleRegisterBuddy = async () => {
    try {
      const response = await registerBuddyMutation.mutateAsync({
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
        description:
          response.message ||
          "The selected user is now registered as a buddy.",
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
      const response = await updateBuddyMutation.mutateAsync({
        id: selectedBuddyId,
        payload: {
          activities: splitCsv(buddyForm.activities),
          costPerHour: buddyForm.costPerHour
            ? Number(buddyForm.costPerHour)
            : null,
          languages: splitCsv(buddyForm.languages),
          bio: buddyForm.bio.trim() || null,
          isActive: buddyForm.isActive === "true",
        },
      });

      toast({
        title: "Buddy updated",
        description:
          response.message ||
          "Buddy availability and profile details have been updated.",
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

  const handleApproveBuddy = async (id: string) => {
    try {
      const response = await approveBuddyMutation.mutateAsync(id);
      if (selectedBuddyId === id) {
        setSelectedBuddyId(null);
      }
      toast({
        title: "Buddy approved",
        description:
          response.message || "The application has been approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Could not approve buddy",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleDeleteBuddy = async () => {
    if (!deleteTarget) return;

    try {
      const response = await deleteBuddyMutation.mutateAsync(deleteTarget.id);
      if (selectedBuddyId === deleteTarget.id) setSelectedBuddyId(null);
      toast({
        title: "Buddy deleted",
        description:
          response.message || "The buddy profile has been removed.",
      });
      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: "Action failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const renderBuddyIdentity = (buddy: AdminBuddy | BuddyProfile) => (
    <div className="min-w-0">
      <p className="truncate font-medium text-foreground">
        {getBuddyDisplayName(buddy)}
      </p>
      <p className="truncate text-xs text-muted-foreground">
        {buddy.email || buddy.userId || "No user link"}
      </p>
    </div>
  );

  const renderSelectedBuddyDetail = (mode: "all" | "pending") => {
    if (!selectedBuddy) {
      return (
        <EmptyState
          title={
            mode === "pending" ? "No applicant selected" : "No buddy selected"
          }
          description={
            mode === "pending"
              ? "Choose an applicant row to review the pending buddy profile."
              : "Choose a buddy row to inspect the detailed buddy profile."
          }
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">
              {getBuddyDisplayName(selectedBuddy)}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedBuddy.email || "No email"}
            </p>
          </div>
          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border/70 bg-background">
            {selectedBuddy.profilePicture ? (
              <Image
                src={selectedBuddy.profilePicture}
                alt={getBuddyDisplayName(selectedBuddy) || "Buddy avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                {getInitials(
                  getBuddyDisplayName(selectedBuddy) || selectedBuddy.email,
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailItem
            label={mode === "pending" ? "Application status" : "Profile status"}
            value={
              <StatusPill
                label={
                  mode === "pending"
                    ? "Pending"
                    : selectedBuddy.isActive === false
                      ? "Inactive"
                      : "Active"
                }
              />
            }
          />
          <DetailItem
            label="Cost per hour"
            value={
              typeof selectedBuddy.costPerHour === "number"
                ? `${selectedBuddy.costPerHour} USD`
                : "N/A"
            }
          />
          {mode === "all" ? (
            <DetailItem
              label="Rating"
              value={
                typeof selectedBuddy.rate === "number"
                  ? selectedBuddy.rate.toFixed(1)
                  : "N/A"
              }
            />
          ) : null}
          <DetailItem
            label="Activities"
            value={formatStringList(selectedBuddy.activities) || "N/A"}
          />
          <DetailItem
            label="Languages"
            value={formatStringList(selectedBuddy.languages) || "N/A"}
          />
          <DetailItem
            label="Bio"
            value={selectedBuddy.bio || "No biography provided."}
          />
          <DetailItem
            label="About"
            value={selectedBuddy.aboutMe || "No about me provided."}
          />
          <DetailItem
            label="Phone"
            value={selectedBuddy.phoneNumber || "N/A"}
          />
          <DetailItem label="Gender" value={selectedBuddy.gender || "N/A"} />
          <DetailItem
            label="Date of birth"
            value={formatDate(selectedBuddy.dateOfBirth)}
          />
          <DetailItem label="Address" value={selectedBuddy.address || "N/A"} />
          <DetailItem
            label="Created"
            value={formatDateTime(selectedBuddy.createdAt)}
          />
          <DetailItem
            label="Updated"
            value={formatDateTime(selectedBuddy.updatedAt)}
          />
        </div>
      </div>
    );
  };

  const tabSwitcher = (
    <SegmentedTabsList className="mt-1">
      <SegmentedTabsTrigger value="all" className="min-w-[160px]">
        All buddies
      </SegmentedTabsTrigger>
      <SegmentedTabsTrigger value="pending" className="min-w-[180px]">
        Pending approvals
      </SegmentedTabsTrigger>
    </SegmentedTabsList>
  );

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "pending")}
        className="space-y-6"
      >
        <div className="booking-muted-panel">
          <div className="space-y-1.5 p-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Buddy management
            </h2>
            <p className="text-sm text-muted-foreground">
              Search, sort and inspect supply-side profiles from the admin buddy
              endpoints.
            </p>
          </div>
          <div className="grid gap-4 px-6 pb-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="buddy-search">Search</Label>
              <Input
                id="buddy-search"
                value={buddySearch}
                onChange={(event) => {
                  setBuddiesPage(1);
                  setBuddySearch(event.target.value);
                }}
                placeholder="Search by name, email or user id"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buddy-sort">Sort</Label>
              <select
                id="buddy-sort"
                className={selectClassName}
                value={buddySortValue}
                onChange={(event) => {
                  setBuddiesPage(1);
                  setBuddySortValue(event.target.value);
                }}
              >
                {BUDDY_SORT_OPTIONS.map((option) => (
                  <option
                    key={`${option.sortBy}:${option.sortOrder}`}
                    value={`${option.sortBy}:${option.sortOrder}`}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setBuddyForm(emptyBuddyForm);
                  setIsRegisterBuddyDialogOpen(true);
                }}
                disabled={activeTab === "pending"}
              >
                <UserRoundPlus className="mr-2 h-4 w-4" />
                Register buddy
              </Button>
            </div>
          </div>
        </div>

        {tabSwitcher}

        <TabsContent value="all" className="mt-0">
          <BuddyAllProfilesPanel
            buddies={buddies}
            totalBuddies={totalBuddies}
            selectedBuddyId={selectedBuddyId}
            isSelectedBuddyAvailable={Boolean(selectedBuddy)}
            currentPage={buddiesQuery.data?.data.page ?? 1}
            totalPages={buddiesQuery.data?.data.totalPages ?? 1}
            hasPreviousPage={buddiesQuery.data?.data.hasPreviousPage ?? false}
            hasNextPage={buddiesQuery.data?.data.hasNextPage ?? false}
            detailContent={renderSelectedBuddyDetail("all")}
            onSelectBuddy={setSelectedBuddyId}
            onEditBuddy={(buddy) => {
              setSelectedBuddyId(buddy.id);
              setBuddyForm(toBuddyFormState(buddy));
              setIsEditBuddyDialogOpen(true);
            }}
            onDeleteBuddy={(buddy) => {
              setDeleteTarget({
                id: buddy.id,
                label:
                  buddy.fullName || buddy.name || buddy.email || "this buddy",
              });
            }}
            onPreviousPage={() =>
              setBuddiesPage((current) => Math.max(current - 1, 1))
            }
            onNextPage={() =>
              setBuddiesPage((current) =>
                buddiesQuery.data?.data.hasNextPage ? current + 1 : current,
              )
            }
            onEditSelectedBuddy={handleOpenEditBuddy}
            renderBuddyIdentity={renderBuddyIdentity}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <PendingBuddyApplicationsPanel
            pendingApplicants={pendingApplicants}
            selectedBuddyId={selectedBuddyId}
            isLoading={pendingApplicantsQuery.isLoading}
            isApproving={approveBuddyMutation.isPending}
            canApproveSelected={Boolean(selectedBuddyId)}
            detailContent={renderSelectedBuddyDetail("pending")}
            onSelectBuddy={setSelectedBuddyId}
            onApproveBuddy={(id) => {
              void handleApproveBuddy(id);
            }}
            onApproveSelectedBuddy={() => {
              if (!selectedBuddyId) return;
              void handleApproveBuddy(selectedBuddyId);
            }}
            renderBuddyIdentity={renderBuddyIdentity}
          />
        </TabsContent>
      </Tabs>

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
              Create a new buddy profile through `POST /api/admin/buddies/
              {"{userId}"}`.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="buddy-user-id">User ID</Label>
              <Input
                id="buddy-user-id"
                value={buddyForm.userId}
                onChange={(event) =>
                  handleBuddyFieldChange("userId", event.target.value)
                }
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
                onChange={(event) =>
                  handleBuddyFieldChange("costPerHour", event.target.value)
                }
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buddy-languages">Languages</Label>
              <Input
                id="buddy-languages"
                value={buddyForm.languages}
                onChange={(event) =>
                  handleBuddyFieldChange("languages", event.target.value)
                }
                placeholder="English, Vietnamese"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="buddy-activities">Activities</Label>
              <Input
                id="buddy-activities"
                value={buddyForm.activities}
                onChange={(event) =>
                  handleBuddyFieldChange("activities", event.target.value)
                }
                placeholder="Street food, coffee walk, museums"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="buddy-bio">Bio</Label>
              <Textarea
                id="buddy-bio"
                value={buddyForm.bio}
                onChange={(event) =>
                  handleBuddyFieldChange("bio", event.target.value)
                }
                className="min-h-28"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRegisterBuddyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegisterBuddy}
              disabled={
                registerBuddyMutation.isPending ||
                !buddyForm.userId.trim() ||
                !buddyForm.costPerHour
              }
            >
              Create buddy profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditBuddyDialogOpen}
        onOpenChange={setIsEditBuddyDialogOpen}
      >
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
                onChange={(event) =>
                  handleBuddyFieldChange("costPerHour", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-buddy-status">Status</Label>
              <select
                id="edit-buddy-status"
                className={selectClassName}
                value={buddyForm.isActive}
                onChange={(event) =>
                  handleBuddyFieldChange("isActive", event.target.value)
                }
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
                onChange={(event) =>
                  handleBuddyFieldChange("activities", event.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-buddy-languages">Languages</Label>
              <Input
                id="edit-buddy-languages"
                value={buddyForm.languages}
                onChange={(event) =>
                  handleBuddyFieldChange("languages", event.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-buddy-bio">Bio</Label>
              <Textarea
                id="edit-buddy-bio"
                value={buddyForm.bio}
                onChange={(event) =>
                  handleBuddyFieldChange("bio", event.target.value)
                }
                className="min-h-28"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditBuddyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBuddy}
              disabled={updateBuddyMutation.isPending}
            >
              Save buddy profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete buddy</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove{" "}
              {deleteTarget?.label || "the selected record"} from the admin
              dataset. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBuddy}>
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
