"use client";

import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
  PaginationControls,
  StatusPill,
} from "@/app/(admin)/admin/_components/admin-shared";
import type { AdminBuddy } from "@/features/admin/type";
import { formatStringList } from "@/utils/formatListData";

interface BuddyAllProfilesPanelProps {
  buddies: AdminBuddy[];
  totalBuddies: number;
  selectedBuddyId: string | null;
  isSelectedBuddyAvailable: boolean;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  detailContent: ReactNode;
  onSelectBuddy: (id: string) => void;
  onEditBuddy: (buddy: AdminBuddy) => void;
  onDeleteBuddy: (buddy: AdminBuddy) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onEditSelectedBuddy: () => void;
  renderBuddyIdentity: (buddy: AdminBuddy) => ReactNode;
}

export function BuddyAllProfilesPanel({
  buddies,
  totalBuddies,
  selectedBuddyId,
  isSelectedBuddyAvailable,
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  detailContent,
  onSelectBuddy,
  onEditBuddy,
  onDeleteBuddy,
  onPreviousPage,
  onNextPage,
  onEditSelectedBuddy,
  renderBuddyIdentity,
}: BuddyAllProfilesPanelProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
      <div className="booking-muted-panel">
        <div className="space-y-1.5 p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Buddy profiles
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalBuddies} buddy records available.
          </p>
        </div>
        <div className="px-0">
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
                    onClick={() => onSelectBuddy(buddy.id)}
                  >
                    <TableCell className="px-6">
                      {renderBuddyIdentity(buddy)}
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
                        label={buddy.isActive === false ? "Inactive" : "Active"}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEditBuddy(buddy);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteBuddy(buddy);
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
        </div>
        <PaginationControls
          page={currentPage}
          totalPages={totalPages}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
        />
      </div>

      <div className="booking-muted-panel">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Selected buddy
            </h2>
            <p className="text-sm text-muted-foreground">
              Inspect detailed buddy profile.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onEditSelectedBuddy}
            disabled={!isSelectedBuddyAvailable}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit selected buddy
          </Button>
        </div>
        <div className="px-6 pb-6">{detailContent}</div>
      </div>
    </div>
  );
}
