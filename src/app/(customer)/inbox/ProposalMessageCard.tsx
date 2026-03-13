import { Button } from "@/components/ui/button";
type Proposal = {
  startTime: string;
  meetingPoint: string;
  groupSize: number;
  finalPrice: number;
};
export function ProposalMessageCard({
  proposal,
  bookingStatus,
  onConfirm,
  onReject,
}: {
  proposal: Proposal;
  bookingStatus: string;
  onConfirm: () => void;
  onReject: () => void;
}) {
  return (
    <div className="mt-2 rounded-2xl border border-border bg-muted/20 p-4">
      <div className="mb-3">
        <p className="text-sm font-semibold text-foreground">Trip proposal</p>
        <p className="text-xs text-muted-foreground">
          Review the final details before payment
        </p>
      </div>

      <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
        <p>
          Start:{" "}
          <span className="font-medium text-foreground">
            {proposal.startTime}
          </span>
        </p>
        <p>
          Meeting point:{" "}
          <span className="font-medium text-foreground">
            {proposal.meetingPoint}
          </span>
        </p>
        <p>
          Group size:{" "}
          <span className="font-medium text-foreground">
            {proposal.groupSize}
          </span>
        </p>
        <p>
          Final price:{" "}
          <span className="font-medium text-foreground">
            ${proposal.finalPrice}
          </span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          className="rounded-full px-5"
          disabled={bookingStatus !== "PROPOSAL_SENT"}
          onClick={onConfirm}
        >
          Confirm
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full px-5"
          disabled={bookingStatus !== "PROPOSAL_SENT"}
          onClick={onReject}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
