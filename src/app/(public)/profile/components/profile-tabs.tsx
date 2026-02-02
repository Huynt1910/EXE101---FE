// app/profile/components/profile-tabs.tsx
"use client";

import { useMemo, useState } from "react";
import type { ProfileUser } from "./profile-header";

type TabKey = "overview" | "activity" | "settings" | "security";

const TAB_LABEL: Record<TabKey, string> = {
  overview: "Overview",
  activity: "Activity",
  settings: "Settings",
  security: "Security",
};

function TabsPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1.5 text-sm transition",
        active
          ? "bg-neutral-900 text-white"
          : "border bg-white hover:bg-neutral-50",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function Card({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

export function ProfileTabs({
  user,
  isOwner = true,
}: {
  user: ProfileUser;
  isOwner?: boolean;
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  const isBuddy = useMemo(() => user.role === "buddy", [user.role]);

  return (
    <div className="mt-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(TAB_LABEL).map((k) => {
          const key = k as TabKey;
          return (
            <TabsPill
              key={key}
              active={tab === key}
              onClick={() => setTab(key)}
            >
              {TAB_LABEL[key]}
            </TabsPill>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-4 grid gap-4">
        {tab === "overview" && (
          <>
            <Card title="About">
              <div className="text-sm text-neutral-700">
                <div className="grid gap-2">
                  <div>
                    <span className="text-neutral-500">Name:</span>{" "}
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Username:</span>{" "}
                    <span className="font-medium">@{user.username}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Role:</span>{" "}
                    <span className="font-medium">
                      {isBuddy ? "Buddy" : "Customer"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {isBuddy ? (
              <Card
                title="Buddy profile"
                right={
                  isOwner ? (
                    <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50">
                      Edit services
                    </button>
                  ) : null
                }
              >
                <div className="grid gap-3 text-sm text-neutral-700">
                  <div className="rounded-xl border bg-neutral-50 p-3">
                    <div className="font-medium">Services</div>
                    <ul className="mt-2 list-disc pl-5 text-neutral-600">
                      <li>1:1 Consulting</li>
                      <li>Weekly mentorship</li>
                      <li>Project review</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border bg-neutral-50 p-3">
                    <div className="font-medium">Availability</div>
                    <div className="mt-1 text-neutral-600">
                      Mon–Fri · 18:00–22:00
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card
                title="Customer overview"
                right={
                  isOwner ? (
                    <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50">
                      Manage addresses
                    </button>
                  ) : null
                }
              >
                <div className="grid gap-3 text-sm text-neutral-700">
                  <div className="rounded-xl border bg-neutral-50 p-3">
                    <div className="font-medium">Recent orders</div>
                    <div className="mt-1 text-neutral-600">
                      No recent orders yet.
                    </div>
                  </div>
                  <div className="rounded-xl border bg-neutral-50 p-3">
                    <div className="font-medium">Wishlist</div>
                    <div className="mt-1 text-neutral-600">
                      Save items to your wishlist for later.
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {tab === "activity" && (
          <>
            <Card title="Recent activity">
              <div className="grid gap-2 text-sm text-neutral-700">
                {[
                  "Updated profile bio",
                  "Liked a post",
                  "Joined a new community",
                  "Completed an order",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border bg-white px-3 py-2"
                  >
                    <div className="text-neutral-700">{item}</div>
                    <div className="text-xs text-neutral-500">Just now</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="History (placeholder)">
              <div className="text-sm text-neutral-600">
                Bạn có thể thay phần này bằng:
                <ul className="mt-2 list-disc pl-5">
                  <li>Post list</li>
                  <li>Order history</li>
                  <li>Review history</li>
                  <li>Login history</li>
                </ul>
              </div>
            </Card>
          </>
        )}

        {tab === "settings" && (
          <>
            <Card
              title="Edit profile"
              right={
                <button className="rounded-xl bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800">
                  Save changes
                </button>
              }
            >
              <form className="grid gap-3">
                <div className="grid gap-1">
                  <label className="text-sm text-neutral-600">
                    Display name
                  </label>
                  <input
                    defaultValue={user.name}
                    className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm text-neutral-600">Bio</label>
                  <textarea
                    defaultValue={user.bio}
                    className="min-h-[90px] w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="Tell something about you"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm text-neutral-600">Location</label>
                  <input
                    defaultValue={user.location}
                    className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="Ho Chi Minh City"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm text-neutral-600">Website</label>
                  <input
                    defaultValue={user.website}
                    className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="https://..."
                  />
                </div>
              </form>
            </Card>

            <Card title="Notifications">
              <div className="grid gap-2 text-sm text-neutral-700">
                <label className="flex items-center justify-between rounded-xl border px-3 py-2">
                  <span>Email notifications</span>
                  <input type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-xl border px-3 py-2">
                  <span>App push</span>
                  <input type="checkbox" />
                </label>
              </div>
            </Card>

            <Card title="Danger zone">
              <button className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">
                Delete account
              </button>
            </Card>
          </>
        )}

        {tab === "security" && (
          <>
            <Card title="Password">
              <div className="grid gap-3">
                <input
                  className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="Current password"
                  type="password"
                />
                <input
                  className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="New password"
                  type="password"
                />
                <button className="w-fit rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800">
                  Update password
                </button>
              </div>
            </Card>

            <Card title="Two-factor authentication">
              <label className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
                <span>Enable 2FA</span>
                <input type="checkbox" />
              </label>
              <p className="mt-2 text-sm text-neutral-600">
                Bật 2FA để bảo vệ tài khoản tốt hơn.
              </p>
            </Card>

            <Card title="Devices">
              <div className="grid gap-2 text-sm text-neutral-700">
                {["Windows • Chrome", "iPhone • Safari"].map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border px-3 py-2"
                  >
                    <div>{d}</div>
                    <button className="rounded-lg border px-2 py-1 text-xs hover:bg-neutral-50">
                      Sign out
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
