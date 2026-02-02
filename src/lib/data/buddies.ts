// src/data/buddies.ts

import type { ActivityKey } from "./activities";

export interface Buddy {
  id: number;
  title: string;
  buddy: string;
  buddyImage: string;
  buddyBio: string;
  buddyRating: number;
  buddyReviews: number;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  activities: ActivityKey[];
  description: string;
  duration: string;
  groupSize: string;
  highlights: string[];
  includes: string[];
  notIncludes: string[];
  reviews_list: Array<{
    author: string;
    rating: number;
    date: string;
    text: string;
    avatar: string;
  }>;
}

export const buddiesData: Record<number, Buddy> = {
  1: {
    id: 1,
    title: "Travel Ho Chi Minh City with Linh",
    buddy: "Trần Hà Linh",
    buddyImage: "/buddies/buddy-woman.png",
    buddyBio:
      "Local food enthusiast with 8 years of experience showing travelers the best street food in Ho Chi Minh City.",
    buddyRating: 4.9,
    buddyReviews: 128,
    location: "Ho Chi Minh City, Vietnam",
    rating: 4.9,
    reviews: 12,
    price: 18,
    image: "/placeholder-img.png",
    activities: [
      "food_street_food_tour",
      "coffee_cafe_hopping",
      "saigon_by_night_motorbike_tour",
    ],
    description:
      "Explore the vibrant street food scene of Ho Chi Minh City with a local guide.",
    duration: "3 hours",
    groupSize: "2-8 people",
    highlights: [
      "Visit 5+ street food stalls",
      "Taste authentic Vietnamese dishes",
      "Explore local neighborhoods",
      "Cultural insights and stories",
    ],
    includes: ["Food tastings", "Beverages", "Local guide", "Walking tour"],
    notIncludes: ["Hotel pickup", "Meals beyond tastings", "Souvenirs"],
    reviews_list: [
      {
        author: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        text: "Linh was amazing! Super authentic and fun.",
        avatar: "/reviewer/reviewer-woman.png",
      },
    ],
  },
  2: {
    id: 2,
    title: "Motorbike Adventure to Ha Long Bay",
    buddy: "Nguyễn Minh Đức",
    buddyImage: "/buddies/buddy-man.png",
    buddyBio:
      "Adventure guide with 10 years of experience leading motorbike tours.",
    buddyRating: 4.8,
    buddyReviews: 95,
    location: "Halong City, Vietnam",
    rating: 4.8,
    reviews: 9,
    price: 20,
    image: "/motorbike-adventure-halong-bay.jpg",
    activities: ["adventure_outdoor_activities", "motorbike_rental_support"],
    description:
      "Thrilling motorbike ride through scenic routes to Ha Long Bay.",
    duration: "Full day",
    groupSize: "1-4 people",
    highlights: [
      "Scenic motorbike routes",
      "Local village visits",
      "Ha Long Bay viewpoints",
    ],
    includes: ["Motorbike rental", "Safety gear", "Lunch", "Guide", "Fuel"],
    notIncludes: ["Hotel pickup", "Personal expenses", "Insurance"],
    reviews_list: [
      {
        author: "Mike R.",
        rating: 5,
        date: "1 week ago",
        text: "Incredible adventure! Duc was professional.",
        avatar: "/reviewer/reviewer-man.png",
      },
    ],
  },
  3: {
    id: 3,
    title: "Traditional Cooking Class",
    buddy: "Phạm Thị Hoa",
    buddyImage: "/buddies/buddy-woman-2.png",
    buddyBio:
      "Professional chef with 15 years of experience teaching Vietnamese cooking.",
    buddyRating: 5.0,
    buddyReviews: 156,
    location: "Ho Chi Minh City, Vietnam",
    rating: 5.0,
    reviews: 15,
    price: 21,
    image: "/traditional-cooking-class-vietnam.jpg",
    activities: ["vietnamese_cooking_class", "local_markets_shopping_tour"],
    description:
      "Learn to cook authentic Vietnamese dishes in a hands-on class.",
    duration: "4 hours",
    groupSize: "2-6 people",
    highlights: [
      "Hands-on cooking experience",
      "Market visit",
      "Traditional recipes",
    ],
    includes: ["Cooking class", "Ingredients", "Meal", "Market tour"],
    notIncludes: ["Transportation", "Alcoholic beverages"],
    reviews_list: [],
  },
  4: {
    id: 4,
    title: "Saigon Nightlife & Rooftop Bars Experience",
    buddy: "Lê Quốc Nam",
    buddyImage: "/buddies/buddy-man-2.png",
    buddyBio:
      "Born and raised in Saigon, Nam knows every rooftop, bar, and hidden alley. Focused on fun but safe nightlife experiences for first-time visitors.",
    buddyRating: 4.9,
    buddyReviews: 87,
    location: "Ho Chi Minh City, Vietnam",
    rating: 4.9,
    reviews: 8,
    price: 8,
    image: "/saigon-nightlife-rooftop.jpg",
    activities: [
      "craft_beer_local_bars_tour",
      "rooftop_bars_night_view",
      "saigon_by_night_motorbike_tour",
      "lgbtq_friendly_nightlife_spots",
    ],
    description:
      "Discover Saigon's vibrant nightlife, from hidden cocktail bars to iconic rooftop views, with a local who knows where to go and what to avoid.",
    duration: "4 hours",
    groupSize: "2-10 people",
    highlights: [
      "Visit 3–4 rooftop or specialty bars",
      "Scenic night views of Saigon skyline",
      "Local insights on safe nightlife",
      "Customized stops based on your style",
    ],
    includes: ["Local guide", "1 welcome drink", "Nightlife recommendations"],
    notIncludes: ["Additional drinks", "Transportation to meeting point"],
    reviews_list: [
      {
        author: "Jason P.",
        rating: 5,
        date: "3 weeks ago",
        text: "Felt like going out with a local friend. Great spots and very safe.",
        avatar: "/reviewer/reviewer-man-2.png",
      },
    ],
  },

  5: {
    id: 5,
    title: "Cu Chi Tunnels & War History Day Tour",
    buddy: "Ngô Minh Thanh",
    buddyImage: "/buddies/buddy-man-3.png",
    buddyBio:
      "Licensed tour guide specializing in Vietnam War history with 7+ years of experience guiding international travelers.",
    buddyRating: 4.9,
    buddyReviews: 142,
    location: "Ho Chi Minh City, Vietnam",
    rating: 4.9,
    reviews: 12,
    price: 16,
    image: "/cu-chi-war-history-tour.jpg",
    activities: [
      "cu_chi_tunnels_tour",
      "war_history_museums",
      "colonial_architecture_landmarks",
      "temples_pagodas_spiritual_sites",
      "city_highlights_walking_tour",
    ],
    description:
      "Comprehensive Cu Chi & Saigon war history experience for travelers who want context, stories, and respectful insights.",
    duration: "8 hours",
    groupSize: "2-12 people",
    highlights: [
      "Guided visit to Cu Chi Tunnels",
      "War Remnants Museum & key landmarks",
      "Insightful storytelling with historical context",
      "Private or small-group options",
    ],
    includes: [
      "Transportation from HCMC",
      "Entrance fees to Cu Chi",
      "Local guide",
      "Bottled water",
    ],
    notIncludes: ["Lunch", "Personal expenses", "Travel insurance"],
    reviews_list: [
      {
        author: "Laura S.",
        rating: 5,
        date: "1 month ago",
        text: "Thanh explained everything clearly and respectfully. Super informative.",
        avatar: "/reviewer/reviewer-woman.png",
      },
    ],
  },

  6: {
    id: 6,
    title: "Mekong Delta Eco & Local Life Experience",
    buddy: "Trần Thu Mai",
    buddyImage: "/buddies/buddy-woman-3.png",
    buddyBio:
      "From a small village in the Mekong Delta, Mai connects travelers with authentic local life and nature-friendly experiences.",
    buddyRating: 4.8,
    buddyReviews: 101,
    location: "Ho Chi Minh City, Vietnam",
    rating: 4.8,
    reviews: 1,
    price: 12,
    image: "/mekong-delta-eco-tour.jpg",
    activities: [
      "mekong_delta_day_trip",
      "local_markets_shopping_tour",
      "handicraft_souvenir_workshops",
      "vietnamese_cooking_class",
      "photography_tour_city_alleys",
    ],
    description:
      "A slow and immersive Mekong Delta day trip with boats, markets, local homes, and optional cooking or craft workshops.",
    duration: "Full day",
    groupSize: "2-10 people",
    highlights: [
      "Boat ride through small canals",
      "Visit local markets & family businesses",
      "Seasonal fruit tasting",
      "Optional hands-on cooking or crafting",
    ],
    includes: [
      "Round-trip transport",
      "Boat ticket",
      "Local guide",
      "Snacks & fruits",
    ],
    notIncludes: ["Lunch (can be arranged on request)", "Personal shopping"],
    reviews_list: [
      {
        author: "Emily R.",
        rating: 5,
        date: "2 weeks ago",
        text: "Felt authentic and not tourist-trappy. Mai is super kind.",
        avatar: "/reviewer/reviewer-woman.png",
      },
    ],
  },

  7: {
    id: 7,
    title: "Saigon Coffee, Art & Hidden Alleys",
    buddy: "Nguyễn Thị Thu Hà",
    buddyImage: "/buddies/buddy-woman-4.png",
    buddyBio:
      "Creative guide and coffee geek who loves showing travelers Saigon's indie cafes, art spaces, and local subculture.",
    buddyRating: 5.0,
    buddyReviews: 64,
    location: "Ho Chi Minh City, Vietnam",
    rating: 5.0,
    reviews: 6,
    price: 21,
    image: "/saigon-coffee-art-tour.jpg",
    activities: [
      "coffee_cafe_hopping",
      "coffee_brewing_workshop",
      "street_art_creative_spaces",
      "language_culture_exchange_meetups",
    ],
    description:
      "Perfect for digital nomads and culture lovers: specialty coffee, hidden alleys, creative hubs and casual chats with locals.",
    duration: "3.5 hours",
    groupSize: "1-6 people",
    highlights: [
      "Visit 3 unique cafes",
      "Learn about Vietnamese coffee styles",
      "Discover street art & creative spaces",
      "Meet local creators when available",
    ],
    includes: [
      "Local guide",
      "1 coffee tasting",
      "Photo spots recommendations",
    ],
    notIncludes: [
      "Additional drinks",
      "Transportation",
      "Paid exhibitions (if any)",
    ],
    reviews_list: [
      {
        author: "Jonas K.",
        rating: 5,
        date: "3 days ago",
        text: "Best intro to Saigon's creative side. Not touristy at all.",
        avatar: "/reviewer/reviewer-man.png",
      },
    ],
  },

  8: {
    id: 8,
    title: "Can Gio Mangrove & Beach Day Trip",
    buddy: "Nguyễn Thị Hồng Vân",
    buddyImage: "/buddies/buddy-woman-5.png",
    buddyBio:
      "Nature-focused guide passionate about wildlife, mangroves and responsible tourism around Saigon.",
    buddyRating: 4.7,
    buddyReviews: 7,
    location: "Ho Chi Minh City, Vietnam",
    rating: 4.7,
    reviews: 7,
    price: 10,
    image: "/can-gio-mangrove-tour.jpg",
    activities: [
      "day_trip_vungtau_cangio",
      "adventure_outdoor_activities",
      "cycling_tours_city_suburbs",
      "saigon_river_cruise",
    ],
    description:
      "Escape the city for a day of mangrove forests, monkeys, local seafood and sea breeze in Can Gio.",
    duration: "Full day",
    groupSize: "2-12 people",
    highlights: [
      "Mangrove forest boat trip",
      "Visit local seafood market",
      "Beach time & viewpoints",
      "Focus on eco-friendly experience",
    ],
    includes: [
      "Round-trip transport",
      "Boat ticket in Can Gio",
      "Local guide",
      "Bottled water",
    ],
    notIncludes: ["Lunch", "Personal expenses", "Travel insurance"],
    reviews_list: [
      {
        author: "Sophie A.",
        rating: 4,
        date: "2 months ago",
        text: "Nice nature break from the city. Could spend even more time there.",
        avatar: "/reviewer/reviewer-woman-2.png",
      },
    ],
  },
};
