// src/data/activities.ts

export const activities = [
  {
    key: "airport_transfers_pickup",
    label: "Airport Transfers & Pick-up",
    group: "Transportation",
    description: "Private airport pick-up and drop-off services.",
  },
  {
    key: "private_car_driver",
    label: "Private Car & Driver Service",
    group: "Transportation",
    description: "Hourly or full-day car with driver.",
  },
  {
    key: "city_highlights_walking_tour",
    label: "City Highlights Walking Tour",
    group: "City Tours",
    description: "Walking tour covering main attractions in the city center.",
  },
  {
    key: "saigon_by_night_motorbike_tour",
    label: "Saigon by Night Motorbike Tour",
    group: "City Tours",
    description: "Night motorbike tour through local streets and markets.",
  },
  {
    key: "food_street_food_tour",
    label: "Food & Street Food Tour",
    group: "Food & Drink",
    description: "Guided tasting of local dishes and street food spots.",
  },
  {
    key: "vegan_healthy_food_tour",
    label: "Vegan & Healthy Food Tour",
    group: "Food & Drink",
    description: "Plant-based and healthy food experiences.",
  },
  {
    key: "coffee_cafe_hopping",
    label: "Coffee & Cafe Hopping",
    group: "Food & Drink",
    description: "Explore Vietnam's coffee culture and unique cafes.",
  },
  {
    key: "craft_beer_local_bars_tour",
    label: "Craft Beer & Local Bars Tour",
    group: "Nightlife",
    description: "Visit local bars and craft beer venues.",
  },
  {
    key: "rooftop_bars_night_view",
    label: "Rooftop Bars & Night View",
    group: "Nightlife",
    description: "Discover rooftop bars with panoramic city views.",
  },
  {
    key: "cu_chi_tunnels_tour",
    label: "Cu Chi Tunnels Tour",
    group: "Day Trips",
    description: "Guided tour to Cu Chi Tunnels.",
  },
  {
    key: "mekong_delta_day_trip",
    label: "Mekong Delta Day Trip",
    group: "Day Trips",
    description: "Boat trips and local experiences in the Mekong Delta.",
  },
  {
    key: "chinatown_culture_tour",
    label: "Chinatown (Cho Lon) Culture Tour",
    group: "Culture & History",
    description: "Explore Cho Lon's temples, markets and local life.",
  },
  {
    key: "war_history_museums",
    label: "War History & Museums",
    group: "Culture & History",
    description: "Visits to key museums and historical sites.",
  },
  {
    key: "colonial_architecture_landmarks",
    label: "Colonial Architecture & Landmarks",
    group: "Culture & History",
    description: "Discover historical buildings and landmarks.",
  },
  {
    key: "temples_pagodas_spiritual_sites",
    label: "Temples, Pagodas & Spiritual Sites",
    group: "Culture & History",
    description: "Guided visits to religious and spiritual sites.",
  },
  {
    key: "local_markets_shopping_tour",
    label: "Local Markets & Shopping Tour",
    group: "Shopping",
    description: "Visit traditional markets and shopping areas.",
  },
  {
    key: "handicraft_souvenir_workshops",
    label: "Handicraft & Souvenir Workshops",
    group: "Workshops & Classes",
    description: "Hands-on craft workshops.",
  },
  {
    key: "vietnamese_cooking_class",
    label: "Vietnamese Cooking Class",
    group: "Workshops & Classes",
    description: "Learn to cook Vietnamese dishes.",
  },
  {
    key: "coffee_brewing_workshop",
    label: "Coffee Brewing Workshop",
    group: "Workshops & Classes",
    description: "Experience making Vietnamese coffee.",
  },
  {
    key: "photography_tour_city_alleys",
    label: "Photography Tour (City & Alleys)",
    group: "Photography & Art",
    description: "Guided photo walk in iconic and hidden spots.",
  },
  {
    key: "street_art_creative_spaces",
    label: "Street Art & Creative Spaces",
    group: "Photography & Art",
    description: "Explore creative hubs and street art.",
  },
  {
    key: "saigon_river_cruise",
    label: "Saigon River Cruise",
    group: "Cruises",
    description: "Scenic boat ride along the Saigon River.",
  },
  {
    key: "dinner_cruise_experience",
    label: "Dinner Cruise Experience",
    group: "Cruises",
    description: "Evening cruise with dinner.",
  },
  {
    key: "spa_massage_wellness",
    label: "Spa, Massage & Wellness",
    group: "Wellness",
    description: "Trusted spas and wellness services.",
  },
  {
    key: "yoga_meditation_sessions",
    label: "Yoga & Meditation Sessions",
    group: "Wellness",
    description: "Yoga and meditation classes.",
  },
  {
    key: "theme_parks_family_activities",
    label: "Theme Parks & Family Activities",
    group: "Family & Fun",
    description: "Family-friendly attractions.",
  },
  {
    key: "cycling_tours_city_suburbs",
    label: "Cycling Tours (City & Suburbs)",
    group: "Outdoor & Adventure",
    description: "Bike tours in the city and surroundings.",
  },
  {
    key: "motorbike_rental_support",
    label: "Motorbike Rental with Support",
    group: "Transportation",
    description: "Safe rental with support in English.",
  },
  {
    key: "day_trip_vungtau_cangio",
    label: "Day Trip to Vung Tau / Can Gio",
    group: "Day Trips",
    description: "Full-day coastal and nature trips.",
  },
  {
    key: "adventure_outdoor_activities",
    label: "Adventure & Outdoor Activities",
    group: "Outdoor & Adventure",
    description: "Light adventure activities.",
  },
  {
    key: "language_culture_exchange_meetups",
    label: "Language & Culture Exchange Meetups",
    group: "Community",
    description: "Events to meet locals and practice languages.",
  },
  {
    key: "business_coworking_support",
    label: "Business & Co-working Support",
    group: "Business",
    description: "Support for business travelers.",
  },
  {
    key: "lgbtq_friendly_nightlife_spots",
    label: "LGBTQ+ Friendly Nightlife & Spots",
    group: "Community",
    description: "Inclusive nightlife and venues.",
  },
  {
    key: "accessible_travel_assistance",
    label: "Accessible Travel Assistance",
    group: "Support Services",
    description: "Support for travelers with disabilities.",
  },
  {
    key: "translation_local_assistance",
    label: "Translation & Local Assistance",
    group: "Support Services",
    description: "On-demand translation and local help.",
  },
] as const;

export type Activity = (typeof activities)[number];
export type ActivityKey = Activity["key"];

export const activityMap: Record<ActivityKey, Activity> = activities.reduce(
  (acc, a) => {
    acc[a.key] = a;
    return acc;
  },
  {} as Record<ActivityKey, Activity>
);

export const ACTIVITIES = Array.from(new Set(activities.map((a) => a.label)));
