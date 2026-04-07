"use client";

import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EmptyState,
  StatusPill,
} from "@/app/(admin)/admin/_components/admin-shared";
import type { BuddyProfile } from "@/features/buddy/type";
import { formatDateTime } from "@/utils/formatDateAndTime";
import { formatStringList } from "@/utils/formatListData";

interface PendingBuddyApplicationsPanelProps {
  pendingApplicants: BuddyProfile[];
  selectedBuddyId: string | null;
  isLoading: boolean;
  isApproving: boolean;
  canApproveSelected: boolean;
  detailContent: ReactNode;
  onSelectBuddy: (id: string) => void;
  onApproveBuddy: (id: string) => void;
  onApproveSelectedBuddy: () => void;
  renderBuddyIdentity: (buddy: BuddyProfile) => ReactNode;
}

export function PendingBuddyApplicationsPanel({
  pendingApplicants,
  selectedBuddyId,
  isLoading,
  isApproving,
  canApproveSelected,
  detailContent,
  onSelectBuddy,
  onApproveBuddy,
  onApproveSelectedBuddy,
  renderBuddyIdentity,
}: PendingBuddyApplicationsPanelProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
      <div className="booking-muted-panel">
        <div className="space-y-1.5 p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Pending buddy applications
          </h2>
          <p className="text-sm text-muted-foreground">
            {pendingApplicants.length} applicants are waiting for approval.
          </p>
        </div>
        <div className="px-0">
          {isLoading ? (
            <div className="px-6 pb-6 text-sm text-muted-foreground">
              Loading applicants...
            </div>
          ) : pendingApplicants.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Applicant</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Languages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApplicants.map((buddy) => (
                  <TableRow
                    key={buddy.id}
                    data-state={
                      buddy.id === selectedBuddyId ? "selected" : undefined
                    }
                    className="cursor-pointer"
                    onClick={() => onSelectBuddy(buddy.id)}
                  >
                    <TableCell className="px-6">
                      {renderBuddyIdentity(buddy)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(buddy.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatStringList(buddy.languages) || "N/A"}
                    </TableCell>
                    <TableCell>
                      <StatusPill label="Pending" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          onApproveBuddy(buddy.id);
                        }}
                        disabled={isApproving}
                      >
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="px-6 pb-6">
              <EmptyState
                title="No pending applications"
                description="New buddy registrations waiting for approval will appear here."
              />
            </div>
          )}
        </div>
      </div>

      <div className="booking-muted-panel">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Applicant details
            </h2>
            <p className="text-sm text-muted-foreground">
              Review the pending buddy profile before approving it.
            </p>
          </div>
          <Button
            onClick={onApproveSelectedBuddy}
            disabled={!canApproveSelected || isApproving}
          >
            <BadgeCheck className="mr-2 h-4 w-4" />
            Approve selected applicant
          </Button>
        </div>
        <div className="px-6 pb-6">{detailContent}</div>
      </div>
    </div>
  );
}
