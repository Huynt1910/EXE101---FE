"use client";

import { useEffect, useState } from "react";
import { Clock3, ShieldAlert } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAdminIncidents, useAdminMutations } from "@/features/admin/hooks/useAdmin";
import {
  DetailItem,
  EmptyState,
  INCIDENT_STATUS_OPTIONS,
  INCIDENT_TYPE_OPTIONS,
  PaginationControls,
  StatusPill,
  countResolvedIncidents,
  getErrorMessage,
  selectClassName,
} from "@/app/(admin)/admin/_components/admin-shared";
import { formatDateTime } from "@/utils/formatDateAndTime";

interface IncidentResolveFormState {
  status: string;
  resolution: string;
}

const emptyIncidentResolveForm: IncidentResolveFormState = {
  status: "InReview",
  resolution: "",
};

export function IncidentsClient() {
  const [incidentBookingIdFilter, setIncidentBookingIdFilter] = useState("");
  const [incidentStatusFilter, setIncidentStatusFilter] = useState("");
  const [incidentTypeFilter, setIncidentTypeFilter] = useState("");
  const [incidentsPage, setIncidentsPage] = useState(1);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isResolveIncidentDialogOpen, setIsResolveIncidentDialogOpen] = useState(false);
  const [incidentResolveForm, setIncidentResolveForm] =
    useState<IncidentResolveFormState>(emptyIncidentResolveForm);

  const incidentsQuery = useAdminIncidents({
    Page: incidentsPage,
    PageSize: 10,
    BookingId: incidentBookingIdFilter || undefined,
    Status: incidentStatusFilter || undefined,
    Type: incidentTypeFilter || undefined,
  });
  const { resolveIncidentMutation } = useAdminMutations();

  const incidents = incidentsQuery.data?.data.items ?? [];
  const totalIncidents = incidentsQuery.data?.data.totalCount ?? 0;
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId) ?? null;
  const unresolvedIncidentsOnPage = incidents.filter(
    (incident) => incident.status === "Open" || incident.status === "InReview",
  ).length;
  const resolvedIncidents = countResolvedIncidents(incidents);

  useEffect(() => {
    const firstIncidentId = incidents[0]?.id ?? null;
    if (!selectedIncidentId && firstIncidentId) setSelectedIncidentId(firstIncidentId);
  }, [incidents, selectedIncidentId]);

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
                        <TableCell className="font-mono text-xs text-muted-foreground">{incident.bookingId}</TableCell>
                        <TableCell className="text-muted-foreground">{incident.reportedByName || "Unknown reporter"}</TableCell>
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
                  <EmptyState title="No incidents found" description="The current filters did not return any incident records." />
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
                <CardDescription>Investigate context before updating the resolution state.</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsResolveIncidentDialogOpen(true)} disabled={!selectedIncident}>
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
                <EmptyState title="No incident selected" description="Select an incident row to inspect ticket details and save a resolution." />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
                onChange={(event) =>
                  setIncidentResolveForm((current) => ({ ...current, status: event.target.value }))
                }
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
                onChange={(event) =>
                  setIncidentResolveForm((current) => ({ ...current, resolution: event.target.value }))
                }
                placeholder="Explain how the issue was handled."
                className="min-h-32"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveIncidentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveIncident} disabled={resolveIncidentMutation.isPending || !selectedIncidentId}>
              Save resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
