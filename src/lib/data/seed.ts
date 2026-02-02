export type Role = "guest" | "customer" | "host" | "admin";

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface Buddy {
  id: string;
  user_id: string;
  bio: string;
  location: string;
  video_path?: string;
  specialties: string[];
  price_per_hour: number;
  rating_avg: number;
  is_featured: boolean;
  languages: string[];
  activities: string[];
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "reschedule_requested"
  | "cancelled";

export interface Booking {
  id: string;
  buddy_id: string;
  customer_id: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  start_time?: string; // HH:mm
  duration_hours: number;
  status: BookingStatus;
  payment_method?: "vietqr" | "cash";
  created_at: string;
}

export type TripStatus = "open" | "matched" | "confirmed";

export interface Trip {
  id: string;
  customer_id: string;
  destination: string;
  date_from: string; // ISO date
  date_to: string; // ISO date
  num_people: number;
  looking_for: "woman" | "man" | "couple" | "family" | "group" | "any";
  activities_selected: string[];
  interests_selected: string[];
  status: TripStatus;
  created_at: string;
}

export type OfferStatus = "pending" | "accepted" | "rejected";

export interface TripOffer {
  id: string;
  trip_id: string;
  buddy_id: string;
  status: OfferStatus;
}

export interface Review {
  id: string;
  booking_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Message {
  id: string;
  booking_id?: string;
  trip_id?: string;
  from_role: "customer" | "host" | "system";
  text: string;
  created_at: string;
}

// Seed Users
export const seedUsers: User[] = [
  {
    id: "u_admin",
    role: "admin",
    name: "Admin",
    email: "admin@example.com",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "u_cust_1",
    role: "customer",
    name: "Lan Nguyen",
    email: "lan@example.com",
    phone: "+84-900-000-001",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "u_cust_2",
    role: "customer",
    name: "Minh Tran",
    email: "minh@example.com",
    phone: "+84-900-000-002",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "u_host_1",
    role: "host",
    name: "Anh Vu",
    email: "anhvu@example.com",
    phone: "+84-900-010-001",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "u_host_2",
    role: "host",
    name: "Thao Le",
    email: "thaole@example.com",
    phone: "+84-900-010-002",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "u_host_3",
    role: "host",
    name: "Khoa Pham",
    email: "khoa@example.com",
    phone: "+84-900-010-003",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "u_host_4",
    role: "host",
    name: "Huong Do",
    email: "huong@example.com",
    phone: "+84-900-010-004",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "u_host_5",
    role: "host",
    name: "Quang Nguyen",
    email: "quang@example.com",
    phone: "+84-900-010-005",
    created_at: "2025-10-01T00:00:00Z",
  },
];

// Seed Buddies (5)
export const seedBuddies: Buddy[] = [
  {
    id: "b_1",
    user_id: "u_host_1",
    bio: "Foodie guide in Hanoi with street food expertise.",
    location: "Hanoi",
    specialties: ["street-food", "walking-tours"],
    price_per_hour: 150000,
    rating_avg: 4.8,
    is_featured: true,
    languages: ["Vietnamese", "English"],
    activities: ["food-tour", "old-quarter"],
  },
  {
    id: "b_2",
    user_id: "u_host_2",
    bio: "Cultural experiences and craft villages near Hoi An.",
    location: "Hoi An",
    specialties: ["culture", "crafts"],
    price_per_hour: 180000,
    rating_avg: 4.7,
    is_featured: true,
    languages: ["Vietnamese", "English"],
    activities: ["bike-tour", "cooking-class"],
  },
  {
    id: "b_3",
    user_id: "u_host_3",
    bio: "Adventure buddy for Ha Long Bay kayaking.",
    location: "Ha Long",
    specialties: ["adventure", "kayaking"],
    price_per_hour: 220000,
    rating_avg: 4.6,
    is_featured: false,
    languages: ["Vietnamese", "English"],
    activities: ["kayak", "cave"],
  },
  {
    id: "b_4",
    user_id: "u_host_4",
    bio: "Sapa sunrise hikes and mindfulness sessions.",
    location: "Sapa",
    specialties: ["hiking", "meditation"],
    price_per_hour: 200000,
    rating_avg: 4.9,
    is_featured: false,
    languages: ["Vietnamese", "English"],
    activities: ["sunrise-hike", "village-visit"],
  },
  {
    id: "b_5",
    user_id: "u_host_5",
    bio: "Saigon nightlife and hidden bars enthusiast.",
    location: "Ho Chi Minh City",
    specialties: ["nightlife", "history"],
    price_per_hour: 170000,
    rating_avg: 4.5,
    is_featured: true,
    languages: ["Vietnamese", "English"],
    activities: ["night-market", "city-tour"],
  },
];

// Seed Trips (3 open)
export const seedTrips: Trip[] = [
  {
    id: "t_1",
    customer_id: "u_cust_1",
    destination: "Hanoi",
    date_from: "2025-10-21",
    date_to: "2025-10-23",
    num_people: 2,
    looking_for: "any",
    activities_selected: ["food-tour"],
    interests_selected: ["street-food", "culture"],
    status: "open",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "t_2",
    customer_id: "u_cust_2",
    destination: "Ha Long",
    date_from: "2025-10-25",
    date_to: "2025-10-26",
    num_people: 4,
    looking_for: "group",
    activities_selected: ["kayak"],
    interests_selected: ["adventure"],
    status: "open",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "t_3",
    customer_id: "u_cust_1",
    destination: "Sapa",
    date_from: "2025-11-01",
    date_to: "2025-11-03",
    num_people: 2,
    looking_for: "couple",
    activities_selected: ["sunrise-hike"],
    interests_selected: ["nature", "mindfulness"],
    status: "open",
    created_at: "2025-10-01T00:00:00Z",
  },
];

// Seed Bookings (10 total, mix of statuses)
export const seedBookings: Booking[] = [
  {
    id: "bk_001",
    buddy_id: "b_1",
    customer_id: "u_cust_1",
    start_date: "2025-10-22",
    end_date: "2025-10-22",
    start_time: "09:00",
    duration_hours: 3,
    status: "confirmed",
    payment_method: "vietqr",
    created_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "bk_002",
    buddy_id: "b_2",
    customer_id: "u_cust_2",
    start_date: "2025-10-24",
    end_date: "2025-10-24",
    start_time: "14:00",
    duration_hours: 2,
    status: "pending",
    payment_method: "cash",
    created_at: "2025-10-02T00:00:00Z",
  },
  {
    id: "bk_003",
    buddy_id: "b_3",
    customer_id: "u_cust_1",
    start_date: "2025-10-26",
    end_date: "2025-10-26",
    start_time: "08:00",
    duration_hours: 4,
    status: "reschedule_requested",
    payment_method: "vietqr",
    created_at: "2025-10-03T00:00:00Z",
  },
  {
    id: "bk_004",
    buddy_id: "b_4",
    customer_id: "u_cust_2",
    start_date: "2025-11-02",
    end_date: "2025-11-02",
    start_time: "05:30",
    duration_hours: 3,
    status: "pending",
    payment_method: "cash",
    created_at: "2025-10-04T00:00:00Z",
  },
  {
    id: "bk_005",
    buddy_id: "b_5",
    customer_id: "u_cust_2",
    start_date: "2025-10-28",
    end_date: "2025-10-28",
    start_time: "19:00",
    duration_hours: 3,
    status: "confirmed",
    payment_method: "vietqr",
    created_at: "2025-10-05T00:00:00Z",
  },
  {
    id: "bk_006",
    buddy_id: "b_2",
    customer_id: "u_cust_1",
    start_date: "2025-10-29",
    end_date: "2025-10-29",
    start_time: "10:00",
    duration_hours: 2,
    status: "cancelled",
    payment_method: "cash",
    created_at: "2025-10-06T00:00:00Z",
  },
  {
    id: "bk_007",
    buddy_id: "b_1",
    customer_id: "u_cust_2",
    start_date: "2025-10-27",
    end_date: "2025-10-27",
    start_time: "11:00",
    duration_hours: 2,
    status: "confirmed",
    payment_method: "vietqr",
    created_at: "2025-10-07T00:00:00Z",
  },
  {
    id: "bk_008",
    buddy_id: "b_3",
    customer_id: "u_cust_1",
    start_date: "2025-10-30",
    end_date: "2025-10-30",
    start_time: "13:00",
    duration_hours: 3,
    status: "pending",
    payment_method: "cash",
    created_at: "2025-10-08T00:00:00Z",
  },
  {
    id: "bk_009",
    buddy_id: "b_4",
    customer_id: "u_cust_1",
    start_date: "2025-11-03",
    end_date: "2025-11-03",
    start_time: "06:00",
    duration_hours: 3,
    status: "pending",
    payment_method: "cash",
    created_at: "2025-10-09T00:00:00Z",
  },
  {
    id: "bk_010",
    buddy_id: "b_5",
    customer_id: "u_cust_2",
    start_date: "2025-10-31",
    end_date: "2025-10-31",
    start_time: "20:00",
    duration_hours: 2,
    status: "confirmed",
    payment_method: "vietqr",
    created_at: "2025-10-10T00:00:00Z",
  },
];

// Offers based on trips
export const seedTripOffers: TripOffer[] = [
  { id: "to_1", trip_id: "t_1", buddy_id: "b_1", status: "pending" },
  { id: "to_2", trip_id: "t_1", buddy_id: "b_2", status: "pending" },
  { id: "to_3", trip_id: "t_2", buddy_id: "b_3", status: "pending" },
];

export const seedReviews: Review[] = [
  {
    id: "rv_1",
    booking_id: "bk_001",
    rating: 5,
    comment: "Amazing food tour!",
    created_at: "2025-10-12T00:00:00Z",
  },
  {
    id: "rv_2",
    booking_id: "bk_005",
    rating: 4,
    comment: "Great nightlife insights.",
    created_at: "2025-10-13T00:00:00Z",
  },
];

export const seedMessages: Message[] = [
  {
    id: "m_1",
    booking_id: "bk_001",
    from_role: "customer",
    text: "See you at 9am near Hoan Kiem!",
    created_at: "2025-10-12T08:00:00Z",
  },
  {
    id: "m_2",
    booking_id: "bk_001",
    from_role: "host",
    text: "Got it! I will be there.",
    created_at: "2025-10-12T08:05:00Z",
  },
  {
    id: "m_3",
    trip_id: "t_1",
    from_role: "system",
    text: "You have new offers from locals.",
    created_at: "2025-10-12T09:00:00Z",
  },
];

export const SEED = {
  users: seedUsers,
  buddies: seedBuddies,
  bookings: seedBookings,
  trips: seedTrips,
  offers: seedTripOffers,
  reviews: seedReviews,
  messages: seedMessages,
};
