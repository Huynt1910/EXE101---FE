// app/profile/components/profile-header.tsx
import Image from "next/image";

export type ProfileUser = {
  id: string;
  name: string;
  username: string;
  role?: "buddy" | "customer";
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  coverUrl?: string;
  stats?: {
    followers?: number;
    following?: number;
    posts?: number;
    orders?: number;
    rating?: number;
  };
};

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="rounded-xl border bg-white/60 px-3 py-2">
      <div className="text-sm font-semibold">{value ?? "—"}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

export function ProfileHeader({
  user,
  isOwner = true,
}: {
  user: ProfileUser;
  isOwner?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      {/* Cover */}
      <div className="relative h-40 w-full bg-neutral-100">
        {user.coverUrl ? (
          <Image
            src={user.coverUrl}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-neutral-200" />
        )}
      </div>

      {/* Main */}
      <div className="relative px-5 pb-5">
        {/* Avatar */}
        <div className="-mt-10 flex items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border bg-white shadow-sm">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-semibold text-neutral-500">
                  {user.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("")}
                </div>
              )}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold">{user.name}</h1>
                {user.role && (
                  <span className="rounded-full border bg-neutral-50 px-2 py-0.5 text-xs text-neutral-600">
                    {user.role === "buddy" ? "Buddy" : "Customer"}
                  </span>
                )}
              </div>
              <div className="text-sm text-neutral-500">@{user.username}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {isOwner ? (
              <>
                <button className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
                  Edit profile
                </button>
                <button className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800">
                  Share
                </button>
              </>
            ) : (
              <>
                <button className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
                  Message
                </button>
                <button className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800">
                  Follow
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 max-w-3xl text-sm text-neutral-700">{user.bio}</p>
        )}

        {/* Meta */}
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-600">
          {user.location && (
            <span className="rounded-full border bg-neutral-50 px-3 py-1">
              📍 {user.location}
            </span>
          )}
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border bg-neutral-50 px-3 py-1 hover:bg-neutral-100"
            >
              🔗 {user.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Stat label="Followers" value={user.stats?.followers} />
          <Stat label="Following" value={user.stats?.following} />
          <Stat label="Posts" value={user.stats?.posts} />
          <Stat label="Orders" value={user.stats?.orders} />
          <Stat label="Rating" value={user.stats?.rating} />
        </div>
      </div>
    </section>
  );
}
