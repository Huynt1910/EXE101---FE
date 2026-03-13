"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBuddyWalletSnapshot } from "@/lib/buddy-flow";

export default function BuddyWalletPage() {
  const wallet = getBuddyWalletSnapshot();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5fbfa_0%,#ffffff_45%,#fffaf3_100%)] text-foreground">
      <section className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Buddy wallet</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Payout and commission</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Track wallet balance, pending payout, completed payout, commission, cash deductions, and debt.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href="/buddy-dashboard">Back to dashboard</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Wallet balance</p>
            <p className="mt-3 text-3xl font-semibold">${wallet.balance}</p>
          </Card>
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Payout pending</p>
            <p className="mt-3 text-3xl font-semibold">${wallet.payoutPending}</p>
          </Card>
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Payout completed</p>
            <p className="mt-3 text-3xl font-semibold">${wallet.payoutCompleted}</p>
          </Card>
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Current rating</p>
            <p className="mt-3 text-3xl font-semibold">{wallet.currentRating}</p>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Commission history</h2>
            <div className="mt-5 space-y-3">
              {wallet.commissionHistory.map((item) => (
                <div key={item.id} className="rounded-3xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.title}</p>
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      ${Math.abs(item.amount)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Cash trip deductions</h2>
            <div className="mt-5 space-y-3">
              {wallet.cashTripDeductions.map((item) => (
                <div key={item.id} className="rounded-3xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.trip}</p>
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      ${Math.abs(item.amount)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Debt</h2>
            <div className="mt-5 space-y-3">
              {wallet.debts.map((item) => (
                <div key={item.id} className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-amber-950">{item.title}</p>
                    <Badge className="rounded-full px-3 py-1">${item.amount}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-amber-900">Due: {item.due}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
