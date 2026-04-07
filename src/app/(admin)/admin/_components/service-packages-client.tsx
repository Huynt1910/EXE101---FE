"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { PackagePlus, Pencil, Trash2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  DetailItem,
  EmptyState,
  StatusPill,
  formatCurrency,
  getErrorMessage,
  selectClassName,
  splitCsv,
} from "@/app/(admin)/admin/_components/admin-shared";
import { ServicePackageSubscribersPanel } from "@/app/(admin)/admin/_components/service-package-subscribers-panel";
import {
  useAdminMutations,
  useAdminServicePackageDetail,
  useAdminServicePackages,
} from "@/features/admin/hooks/useAdmin";
import type { AdminServicePackage } from "@/features/admin/type";
import { formatDateTime } from "@/utils/formatDateAndTime";

interface ServicePackageFormState {
  name: string;
  description: string;
  pricePerMonth: string;
  currency: string;
  commissionRate: string;
  hasChatAccess: string;
  hasSearchPriority: string;
  hasPrioritySupport: string;
  hasProductFeedback: string;
  maxSlots: string;
  sortOrder: string;
  features: string;
}

const emptyServicePackageForm: ServicePackageFormState = {
  name: "",
  description: "",
  pricePerMonth: "",
  currency: "VND",
  commissionRate: "0",
  hasChatAccess: "true",
  hasSearchPriority: "false",
  hasPrioritySupport: "false",
  hasProductFeedback: "false",
  maxSlots: "0",
  sortOrder: "0",
  features: "",
};

function toServicePackageFormState(
  servicePackage: AdminServicePackage,
): ServicePackageFormState {
  return {
    name: servicePackage.name,
    description: servicePackage.description ?? "",
    pricePerMonth: String(servicePackage.pricePerMonth),
    currency: servicePackage.currency,
    commissionRate: String(servicePackage.commissionRate),
    hasChatAccess: servicePackage.hasChatAccess ? "true" : "false",
    hasSearchPriority: servicePackage.hasSearchPriority ? "true" : "false",
    hasPrioritySupport: servicePackage.hasPrioritySupport ? "true" : "false",
    hasProductFeedback: servicePackage.hasProductFeedback ? "true" : "false",
    maxSlots: String(servicePackage.maxSlots),
    sortOrder: String(servicePackage.sortOrder),
    features: servicePackage.features.join(", "),
  };
}

export function ServicePackagesClient() {
  const [packageSearch, setPackageSearch] = useState("");
  const deferredPackageSearch = useDeferredValue(packageSearch);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [packageForm, setPackageForm] = useState<ServicePackageFormState>(
    emptyServicePackageForm,
  );

  const servicePackagesQuery = useAdminServicePackages();
  const servicePackageDetailQuery =
    useAdminServicePackageDetail(selectedPackageId);
  const {
    createServicePackageMutation,
    updateServicePackageMutation,
    deleteServicePackageMutation,
  } = useAdminMutations();

  const servicePackages = useMemo(
    () => servicePackagesQuery.data?.data ?? [],
    [servicePackagesQuery.data?.data],
  );
  const sortedPackages = useMemo(() => {
    const keyword = deferredPackageSearch.trim().toLowerCase();
    const filteredPackages = servicePackages.filter((item) => {
      if (!keyword) return true;

      return [item.name, item.description, item.currency, ...item.features]
        .filter((value): value is string => typeof value === "string")
        .some((value) => value.toLowerCase().includes(keyword));
    });

    return [...filteredPackages].sort(
      (left, right) =>
        left.sortOrder - right.sortOrder || left.name.localeCompare(right.name),
    );
  }, [deferredPackageSearch, servicePackages]);
  const selectedPackage = useMemo(
    () =>
      servicePackageDetailQuery.data?.data ??
      sortedPackages.find((item) => item.id === selectedPackageId) ??
      null,
    [selectedPackageId, servicePackageDetailQuery.data?.data, sortedPackages],
  );

  useEffect(() => {
    const firstPackageId = sortedPackages[0]?.id ?? null;

    if (!firstPackageId) {
      setSelectedPackageId(null);
      return;
    }

    if (
      !selectedPackageId ||
      !sortedPackages.some((item) => item.id === selectedPackageId)
    ) {
      setSelectedPackageId(firstPackageId);
    }
  }, [selectedPackageId, sortedPackages]);

  useEffect(() => {
    if (!selectedPackage) return;
    setPackageForm(toServicePackageFormState(selectedPackage));
  }, [selectedPackage]);

  const handleFieldChange = (
    field: keyof ServicePackageFormState,
    value: string,
  ) => {
    setPackageForm((current) => ({ ...current, [field]: value }));
  };

  const buildPayload = () => ({
    name: packageForm.name.trim(),
    description: packageForm.description.trim(),
    pricePerMonth: Number(packageForm.pricePerMonth) || 0,
    currency: packageForm.currency.trim() || "VND",
    commissionRate: Number(packageForm.commissionRate) || 0,
    hasChatAccess: packageForm.hasChatAccess === "true",
    hasSearchPriority: packageForm.hasSearchPriority === "true",
    hasPrioritySupport: packageForm.hasPrioritySupport === "true",
    hasProductFeedback: packageForm.hasProductFeedback === "true",
    maxSlots: Number(packageForm.maxSlots) || 0,
    sortOrder: Number(packageForm.sortOrder) || 0,
    features: splitCsv(packageForm.features),
  });

  const handleCreatePackage = async () => {
    try {
      const response = await createServicePackageMutation.mutateAsync(
        buildPayload(),
      );
      toast({
        title: "Service package created",
        description:
          response.message || "The new service package has been published.",
      });
      setIsCreateDialogOpen(false);
      setPackageForm(emptyServicePackageForm);
    } catch (error) {
      toast({
        title: "Could not create package",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleUpdatePackage = async () => {
    if (!selectedPackageId) return;

    try {
      const response = await updateServicePackageMutation.mutateAsync({
        id: selectedPackageId,
        payload: buildPayload(),
      });
      toast({
        title: "Service package updated",
        description:
          response.message || "The selected package has been saved.",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Could not update package",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleDeletePackage = async () => {
    if (!deleteTarget) return;

    try {
      const response = await deleteServicePackageMutation.mutateAsync(
        deleteTarget.id,
      );
      if (selectedPackageId === deleteTarget.id) setSelectedPackageId(null);
      toast({
        title: "Service package deleted",
        description:
          response.message || "The package was soft-deleted successfully.",
      });
      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: "Could not delete package",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Tabs defaultValue="packages" className="space-y-6">
        <TabsContent value="packages">
          <div className="space-y-6">
            <div className="booking-muted-panel">
              <div className="space-y-1.5 p-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Service package management
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage your service packages.
                </p>
              </div>
              <div className="grid gap-4 px-6 pb-6 md:grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-2">
                  <Label htmlFor="service-package-search">Search</Label>
                  <Input
                    id="service-package-search"
                    value={packageSearch}
                    onChange={(event) => setPackageSearch(event.target.value)}
                    placeholder="Search by name, description, currency or feature"
                    className="bg-background"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setPackageForm(emptyServicePackageForm);
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <PackagePlus className="mr-2 h-4 w-4" />
                    New package
                  </Button>
                </div>
              </div>
            </div>

            <SegmentedTabsList className="mt-1">
              <SegmentedTabsTrigger
                value="packages"
                className="min-w-[160px]"
              >
                Packages
              </SegmentedTabsTrigger>
              <SegmentedTabsTrigger
                value="subscribers"
                className="min-w-[180px]"
              >
                Subscribed buddies
              </SegmentedTabsTrigger>
            </SegmentedTabsList>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
              <div className="booking-muted-panel">
                <div className="space-y-1.5 p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Service packages
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {sortedPackages.length} / {servicePackages.length} packages
                    visible.
                  </p>
                </div>
                <div className="px-0">
                  {sortedPackages.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-6">Package</TableHead>
                          <TableHead>Monthly price</TableHead>
                          <TableHead>Slots</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedPackages.map((servicePackage) => (
                          <TableRow
                            key={servicePackage.id}
                            data-state={
                              servicePackage.id === selectedPackageId
                                ? "selected"
                                : undefined
                            }
                            className="cursor-pointer"
                            onClick={() =>
                              setSelectedPackageId(servicePackage.id)
                            }
                          >
                            <TableCell className="px-6">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {servicePackage.name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {servicePackage.description ||
                                    "No description provided."}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatCurrency(
                                servicePackage.pricePerMonth,
                                servicePackage.currency,
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {servicePackage.currentSlots}/
                              {servicePackage.maxSlots || "Unlimited"}
                            </TableCell>
                            <TableCell>
                              <StatusPill
                                label={
                                  servicePackage.isActive
                                    ? "Active"
                                    : "Inactive"
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
                                    setSelectedPackageId(servicePackage.id);
                                    setPackageForm(
                                      toServicePackageFormState(servicePackage),
                                    );
                                    setIsEditDialogOpen(true);
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
                                      id: servicePackage.id,
                                      label: servicePackage.name,
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
                        title="No service packages found"
                        description="Create a package or adjust the current search keyword."
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="booking-muted-panel">
                <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                      Selected package
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Detail data loaded from `GET /api/ServicePackages/{"{id}"}
                      `.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!selectedPackage) return;
                      setPackageForm(
                        toServicePackageFormState(selectedPackage),
                      );
                      setIsEditDialogOpen(true);
                    }}
                    disabled={!selectedPackage}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="px-6 pb-6">
                  {selectedPackage ? (
                    <div className="grid grid-cols-2 gap-3">
                      <DetailItem label="Name" value={selectedPackage.name} />
                      <DetailItem
                        label="Status"
                        value={
                          <StatusPill
                            label={
                              selectedPackage.isActive ? "Active" : "Inactive"
                            }
                          />
                        }
                      />
                      <DetailItem
                        label="Price"
                        value={formatCurrency(
                          selectedPackage.pricePerMonth,
                          selectedPackage.currency,
                        )}
                      />
                      <DetailItem
                        label="Commission"
                        value={`${selectedPackage.commissionRate}%`}
                      />
                      <DetailItem
                        label="Slots"
                        value={`${selectedPackage.currentSlots}/${selectedPackage.maxSlots || "Unlimited"}`}
                      />
                      <DetailItem
                        label="Sort order"
                        value={selectedPackage.sortOrder}
                      />
                      <DetailItem
                        label="Access flags"
                        value={
                          [
                            selectedPackage.hasChatAccess && "Chat access",
                            selectedPackage.hasSearchPriority &&
                              "Search priority",
                            selectedPackage.hasPrioritySupport &&
                              "Priority support",
                            selectedPackage.hasProductFeedback &&
                              "Product feedback",
                          ]
                            .filter(Boolean)
                            .join(", ") || "No feature flags enabled."
                        }
                      />
                      <DetailItem
                        label="Features"
                        value={
                          selectedPackage.features.length ? (
                            <div className="flex flex-wrap gap-1.5">
                              {selectedPackage.features.map((feature) => (
                                <Badge key={feature} variant="outline">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            "No package features."
                          )
                        }
                      />
                      <DetailItem
                        label="Description"
                        value={
                          selectedPackage.description ||
                          "No description provided."
                        }
                      />
                      <DetailItem
                        label="Created"
                        value={formatDateTime(selectedPackage.createdAt)}
                      />
                      <DetailItem
                        label="Updated"
                        value={formatDateTime(selectedPackage.updatedAt)}
                      />
                    </div>
                  ) : (
                    <EmptyState
                      title="No package selected"
                      description="Select a service package row to inspect full details."
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscribers">
          <ServicePackageSubscribersPanel />
        </TabsContent>
      </Tabs>

      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) setPackageForm(emptyServicePackageForm);
        }}
      >
        <ServicePackageDialogContent
          title="Create service package"
          description="Create a package through `POST /api/ServicePackages`."
          packageForm={packageForm}
          onFieldChange={handleFieldChange}
          onCancel={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreatePackage}
          submitLabel="Create package"
          isSubmitting={createServicePackageMutation.isPending}
        />
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ServicePackageDialogContent
          title="Edit service package"
          description="Update package fields through `PUT /api/ServicePackages/{id}`."
          packageForm={packageForm}
          onFieldChange={handleFieldChange}
          onCancel={() => setIsEditDialogOpen(false)}
          onSubmit={handleUpdatePackage}
          submitLabel="Save package"
          isSubmitting={updateServicePackageMutation.isPending}
        />
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete service package</AlertDialogTitle>
            <AlertDialogDescription>
              This action will soft-delete{" "}
              {deleteTarget?.label || "the selected package"}. It will remain
              queryable from `/api/ServicePackages/all`.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePackage}>
              Delete package
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ServicePackageDialogContent({
  title,
  description,
  packageForm,
  onFieldChange,
  onCancel,
  onSubmit,
  submitLabel,
  isSubmitting,
}: {
  title: string;
  description: string;
  packageForm: ServicePackageFormState;
  onFieldChange: (field: keyof ServicePackageFormState, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitting: boolean;
}) {
  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="package-name">Name</Label>
          <Input
            id="package-name"
            value={packageForm.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
            placeholder="Monthly Premium"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-currency">Currency</Label>
          <Input
            id="package-currency"
            value={packageForm.currency}
            onChange={(event) => onFieldChange("currency", event.target.value)}
            placeholder="VND"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-price">Price per month</Label>
          <Input
            id="package-price"
            type="number"
            min="0"
            value={packageForm.pricePerMonth}
            onChange={(event) =>
              onFieldChange("pricePerMonth", event.target.value)
            }
            placeholder="99000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-commission">Commission rate (%)</Label>
          <Input
            id="package-commission"
            type="number"
            min="0"
            value={packageForm.commissionRate}
            onChange={(event) =>
              onFieldChange("commissionRate", event.target.value)
            }
            placeholder="15"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-max-slots">Max slots</Label>
          <Input
            id="package-max-slots"
            type="number"
            min="0"
            value={packageForm.maxSlots}
            onChange={(event) => onFieldChange("maxSlots", event.target.value)}
            placeholder="100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-sort-order">Sort order</Label>
          <Input
            id="package-sort-order"
            type="number"
            value={packageForm.sortOrder}
            onChange={(event) => onFieldChange("sortOrder", event.target.value)}
            placeholder="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-chat-access">Chat access</Label>
          <select
            id="package-chat-access"
            className={selectClassName}
            value={packageForm.hasChatAccess}
            onChange={(event) =>
              onFieldChange("hasChatAccess", event.target.value)
            }
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-search-priority">Search priority</Label>
          <select
            id="package-search-priority"
            className={selectClassName}
            value={packageForm.hasSearchPriority}
            onChange={(event) =>
              onFieldChange("hasSearchPriority", event.target.value)
            }
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-priority-support">Priority support</Label>
          <select
            id="package-priority-support"
            className={selectClassName}
            value={packageForm.hasPrioritySupport}
            onChange={(event) =>
              onFieldChange("hasPrioritySupport", event.target.value)
            }
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="package-product-feedback">Product feedback</Label>
          <select
            id="package-product-feedback"
            className={selectClassName}
            value={packageForm.hasProductFeedback}
            onChange={(event) =>
              onFieldChange("hasProductFeedback", event.target.value)
            }
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="package-features">Features</Label>
          <Input
            id="package-features"
            value={packageForm.features}
            onChange={(event) => onFieldChange("features", event.target.value)}
            placeholder="Chat, Top search placement, Priority support"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="package-description">Description</Label>
          <Textarea
            id="package-description"
            value={packageForm.description}
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
            className="min-h-28"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !packageForm.name.trim()}
        >
          {submitLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
