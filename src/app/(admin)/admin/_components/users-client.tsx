"use client";

import { useDeferredValue, useEffect, useState } from "react";
import {
  Clock3,
  Pencil,
  ShieldAlert,
  Trash2,
  UserRoundPlus,
} from "lucide-react";
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
  useAdminMutations,
  useAdminUserDetail,
  useAdminUsers,
} from "@/features/admin/hooks/useAdmin";
import type { AdminUser } from "@/features/admin/type";
import {
  DetailItem,
  EmptyState,
  GENDER_OPTIONS,
  PaginationControls,
  StatusPill,
  getErrorMessage,
  getInitials,
  selectClassName,
  splitCsv,
  toDateInputValue,
  toDateTimePayload,
} from "@/app/(admin)/admin/_components/admin-shared";
import { formatDate, formatDateTime } from "@/utils/formatDateAndTime";
import Image from "next/image";

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
}

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
};

export function UsersClient() {
  const [userSearch, setUserSearch] = useState("");
  const deferredUserSearch = useDeferredValue(userSearch);
  const [userGenderFilter, setUserGenderFilter] = useState("");
  const [userVerificationFilter, setUserVerificationFilter] = useState("all");
  const [usersPage, setUsersPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRegisterBuddyDialogOpen, setIsRegisterBuddyDialogOpen] =
    useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);
  const [buddyForm, setBuddyForm] = useState<BuddyFormState>(emptyBuddyForm);

  const usersQuery = useAdminUsers({
    Page: usersPage,
    PageSize: 10,
    Search: deferredUserSearch || undefined,
    Gender: userGenderFilter || undefined,
    IsEmailVerified:
      userVerificationFilter === "all"
        ? undefined
        : userVerificationFilter === "verified",
    SortBy: "fullName",
    SortOrder: "desc",
  });
  const userDetailQuery = useAdminUserDetail(selectedUserId);
  const { updateUserMutation, deleteUserMutation, registerBuddyMutation } =
    useAdminMutations();

  const users = usersQuery.data?.data.items ?? [];
  const totalUsers = usersQuery.data?.data.totalCount ?? 0;
  const verifiedUsersOnPage = users.filter(
    (user) => user.isEmailVerified,
  ).length;
  const selectedUser =
    users.find((user) => user.id === selectedUserId) ??
    userDetailQuery.data?.data ??
    null;

  useEffect(() => {
    const firstUserId = users[0]?.id ?? null;
    if (!selectedUserId && firstUserId) setSelectedUserId(firstUserId);
  }, [selectedUserId, users]);

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

  const handleUserFieldChange = (field: keyof UserFormState, value: string) => {
    setUserForm((current) => ({ ...current, [field]: value }));
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

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;

    try {
      await deleteUserMutation.mutateAsync(deleteTarget.id);
      if (selectedUserId === deleteTarget.id) setSelectedUserId(null);
      toast({
        title: "User deleted",
        description: "The user record has been removed.",
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
            <CardTitle>User management</CardTitle>
            <CardDescription>
              Search and maintain customer accounts through the admin user
              endpoints.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="user-search">Search</Label>
              <Input
                id="user-search"
                value={userSearch}
                onChange={(event) => {
                  setUsersPage(1);
                  setUserSearch(event.target.value);
                }}
                placeholder="Search by name or email"
                className="bg-background"
              />
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
              <CardDescription>{totalUsers} total users.</CardDescription>
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
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        data-state={
                          user.id === selectedUserId ? "selected" : undefined
                        }
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
                        <TableCell className="text-muted-foreground">
                          {user.email || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {(user.roles?.length ? user.roles : ["User"]).map(
                              (role) => (
                                <Badge key={role} variant="outline">
                                  {role}
                                </Badge>
                              ),
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDateTime(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleOpenEditUser(user.id);
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
                                  id: user.id,
                                  label:
                                    user.fullName || user.email || "this user",
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
                    title="No users found"
                    description="Adjust the current filters or check whether the admin users endpoint returns records."
                  />
                </div>
              )}
            </CardContent>
            <PaginationControls
              page={usersQuery.data?.data.page ?? 1}
              totalPages={usersQuery.data?.data.totalPages ?? 1}
              hasPreviousPage={usersQuery.data?.data.hasPreviousPage ?? false}
              hasNextPage={usersQuery.data?.data.hasNextPage ?? false}
              onPrevious={() =>
                setUsersPage((current) => Math.max(current - 1, 1))
              }
              onNext={() =>
                setUsersPage((current) =>
                  usersQuery.data?.data.hasNextPage ? current + 1 : current,
                )
              }
            />
          </Card>

          <div className="space-y-6">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>Selected user</CardTitle>
                <CardDescription>
                  Inspect profile data before editing or promoting the account
                  to buddy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">
                          {selectedUser.fullName || "Unnamed user"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.email || "No email"}
                        </p>
                      </div>
                      <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border/70 bg-background">
                        {selectedUser.profilePicture ? (
                          <Image
                            src={selectedUser.profilePicture}
                            alt={selectedUser.fullName || "User avatar"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                            {getInitials(
                              selectedUser.fullName || selectedUser.email,
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DetailItem
                        label="Roles"
                        value={
                          <div className="flex flex-wrap gap-1.5">
                            {(selectedUser.roles?.length
                              ? selectedUser.roles
                              : ["User"]
                            ).map((role) => (
                              <Badge key={role} variant="outline">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        }
                      />
                      <DetailItem
                        label="Verification"
                        value={
                          <StatusPill
                            label={
                              selectedUser.isEmailVerified
                                ? "Verified"
                                : "Pending"
                            }
                          />
                        }
                      />
                      <DetailItem
                        label="Phone"
                        value={selectedUser.phoneNumber || "N/A"}
                      />
                      <DetailItem
                        label="Gender"
                        value={selectedUser.gender || "N/A"}
                      />
                      <DetailItem
                        label="Date of birth"
                        value={formatDate(selectedUser.dateOfBirth)}
                      />
                      <DetailItem
                        label="Address"
                        value={selectedUser.address || "N/A"}
                      />
                      <DetailItem
                        label="About"
                        value={selectedUser.aboutMe || "No about me provided."}
                      />
                      <DetailItem
                        label="Created"
                        value={formatDateTime(selectedUser.createdAt)}
                      />
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
        </div>
      </div>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit user profile</DialogTitle>
            <DialogDescription>Update the fields.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-user-full-name">Full name</Label>
              <Input
                id="edit-user-full-name"
                value={userForm.fullName}
                onChange={(event) =>
                  handleUserFieldChange("fullName", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-gender">Gender</Label>
              <select
                id="edit-user-gender"
                className={selectClassName}
                value={userForm.gender}
                onChange={(event) =>
                  handleUserFieldChange("gender", event.target.value)
                }
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
                onChange={(event) =>
                  handleUserFieldChange("phoneNumber", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-dob">Date of birth</Label>
              <Input
                id="edit-user-dob"
                type="date"
                value={userForm.dateOfBirth}
                onChange={(event) =>
                  handleUserFieldChange("dateOfBirth", event.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-user-address">Address</Label>
              <Input
                id="edit-user-address"
                value={userForm.address}
                onChange={(event) =>
                  handleUserFieldChange("address", event.target.value)
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-user-about">About me</Label>
              <Textarea
                id="edit-user-about"
                value={userForm.aboutMe}
                onChange={(event) =>
                  handleUserFieldChange("aboutMe", event.target.value)
                }
                className="min-h-28"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={updateUserMutation.isPending}
            >
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
            <DialogDescription>Create a new buddy profile.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="buddy-user-id">User ID</Label>
              <Input
                id="buddy-user-id"
                value={buddyForm.userId}
                onChange={(event) =>
                  setBuddyForm((current) => ({
                    ...current,
                    userId: event.target.value,
                  }))
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
                  setBuddyForm((current) => ({
                    ...current,
                    costPerHour: event.target.value,
                  }))
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
                  setBuddyForm((current) => ({
                    ...current,
                    languages: event.target.value,
                  }))
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
                  setBuddyForm((current) => ({
                    ...current,
                    activities: event.target.value,
                  }))
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
                  setBuddyForm((current) => ({
                    ...current,
                    bio: event.target.value,
                  }))
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

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove{" "}
              {deleteTarget?.label || "the selected record"} from the admin
              dataset. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
