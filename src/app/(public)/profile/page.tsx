// app/profile/page.tsx
import { ProfileHeader, type ProfileUser } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";

export default async function ProfilePage() {
  // Demo: giả lập data server-side
  const user: ProfileUser = {
    id: "u_001",
    name: "Hình Sự Huyện",
    username: "hinh-su-huyen",
    role: "buddy", // đổi thành "customer" để test UI customer
    bio: "Building products with Next.js + AI. Focus on clean UX and scalable components.",
    location: "Ho Chi Minh City, VN",
    website: "https://example.com",
    avatarUrl: "", // set ảnh nếu bạn có
    coverUrl: "", // set ảnh nếu bạn có
    stats: {
      followers: 1200,
      following: 180,
      posts: 34,
      orders: 12,
      rating: 4.8,
    },
  };

  const isOwner = true;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="grid gap-4">
        <ProfileHeader user={user} isOwner={isOwner} />
        <ProfileTabs user={user} isOwner={isOwner} />
      </div>
    </main>
  );
}
