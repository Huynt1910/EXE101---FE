"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useState } from "react";
import { Pencil, Trash2, UserRoundPlus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  useAdminBuddies,
  useAdminBuddyDetail,
  useAdminMutations,
} from "@/features/admin/hooks/useAdmin";
import {
  DetailItem,
  EmptyState,
  PaginationControls,
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

export function BuddiesClient() {
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
  const buddyDetailQuery = useAdminBuddyDetail(selectedBuddyId);
  const { registerBuddyMutation, updateBuddyMutation, deleteBuddyMutation } =
    useAdminMutations();

  const buddies = buddiesQuery.data?.data.items ?? [];
  const totalBuddies = buddiesQuery.data?.data.totalCount ?? 0;
  const selectedBuddy =
    buddyDetailQuery.data?.data ??
    buddies.find((buddy) => buddy.id === selectedBuddyId) ??
    null;

  useEffect(() => {
    const firstBuddyId = buddies[0]?.id ?? null;

    if (!firstBuddyId) {
      setSelectedBuddyId(null);
      return;
    }

    if (
      !selectedBuddyId ||
      !buddies.some((buddy) => buddy.id === selectedBuddyId)
    ) {
      setSelectedBuddyId(firstBuddyId);
    }
  }, [buddies, selectedBuddyId]);

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

  const handleDeleteBuddy = async () => {
    if (!deleteTarget) return;

    try {
      await deleteBuddyMutation.mutateAsync(deleteTarget.id);
      if (selectedBuddyId === deleteTarget.id) setSelectedBuddyId(null);
      toast({
        title: "Buddy deleted",
        description: "The buddy profile has been removed.",
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

  return (
    <>
      <div className="space-y-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Buddy management</CardTitle>
            <CardDescription>
              Search, sort and inspect supply-side profiles from the admin buddy
              endpoints.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              >
                <UserRoundPlus className="mr-2 h-4 w-4" />
                Register buddy
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Buddy profiles</CardTitle>
              <CardDescription>
                {totalBuddies} buddy records available.
              </CardDescription>
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
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buddies.map((buddy) => (
                      <TableRow
                        key={buddy.id}
                        data-state={
                          buddy.id === selectedBuddyId ? "selected" : undefined
                        }
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
                          {formatStringList(buddy.languages) || "N/A"}
                        </TableCell>
                        <TableCell>
                          <StatusPill
                            label={
                              buddy.isActive === false ? "Inactive" : "Active"
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedBuddyId(buddy.id);
                                setBuddyForm(toBuddyFormState(buddy));
                                setIsEditBuddyDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(event) => {
                                event.stopPropagation();
                                setDeleteTarget({
                                  id: buddy.id,
                                  label:
                                    buddy.fullName ||
                                    buddy.name ||
                                    buddy.email ||
                                    "this buddy",
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
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
                    title="No buddies found"
                    description="Adjust the current search or sort and try again."
                  />
                </div>
              )}
            </CardContent>
            <PaginationControls
              page={buddiesQuery.data?.data.page ?? 1}
              totalPages={buddiesQuery.data?.data.totalPages ?? 1}
              hasPreviousPage={buddiesQuery.data?.data.hasPreviousPage ?? false}
              hasNextPage={buddiesQuery.data?.data.hasNextPage ?? false}
              onPrevious={() =>
                setBuddiesPage((current) => Math.max(current - 1, 1))
              }
              onNext={() =>
                setBuddiesPage((current) =>
                  buddiesQuery.data?.data.hasNextPage ? current + 1 : current,
                )
              }
            />
          </Card>

          <Card className="border-border/70">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1.5">
                <CardTitle>Selected buddy</CardTitle>
                <CardDescription>
                  Inspect detailed buddy profile data from the detail endpoint.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleOpenEditBuddy}
                disabled={!selectedBuddy}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit selected buddy
              </Button>
            </CardHeader>
            <CardContent>
              {selectedBuddy ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">
                        {selectedBuddy.fullName ||
                          selectedBuddy.name ||
                          "Unnamed buddy"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedBuddy.email || "No email"}
                      </p>
                    </div>
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border/70 bg-background">
                      {selectedBuddy.profilePicture ? (
                        <Image
                          src={selectedBuddy.profilePicture}
                          alt={
                            selectedBuddy.fullName ||
                            selectedBuddy.name ||
                            "Buddy avatar"
                          }
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                          {getInitials(
                            selectedBuddy.fullName ||
                              selectedBuddy.name ||
                              selectedBuddy.email,
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <DetailItem
                      label="Profile status"
                      value={
                        <StatusPill
                          label={
                            selectedBuddy.isActive === false
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
                    <DetailItem
                      label="Rating"
                      value={
                        typeof selectedBuddy.rate === "number"
                          ? selectedBuddy.rate.toFixed(1)
                          : "N/A"
                      }
                    />
                    <DetailItem
                      label="Activities"
                      value={
                        formatStringList(selectedBuddy.activities) || "N/A"
                      }
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
                    <DetailItem
                      label="Gender"
                      value={selectedBuddy.gender || "N/A"}
                    />
                    <DetailItem
                      label="Date of birth"
                      value={formatDate(selectedBuddy.dateOfBirth)}
                    />
                    <DetailItem
                      label="Address"
                      value={selectedBuddy.address || "N/A"}
                    />
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
              ) : (
                <EmptyState
                  title="No buddy selected"
                  description="Choose a buddy row to inspect the detailed buddy profile."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
