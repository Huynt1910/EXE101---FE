export interface Activity {
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
  category: string;
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

export const activitiesData: Record<number, Activity> = {
  1: {
    id: 1,
    title: "Street Food Tour in Hanoi",
    buddy: "Linh",
    buddyImage: "/vietnamese-woman.jpg",
    buddyBio:
      "Local food enthusiast with 8 years of experience showing travelers the best street food in Hanoi. Passionate about Vietnamese culture and cuisine.",
    buddyRating: 4.9,
    buddyReviews: 128,
    location: "Hanoi, Vietnam",
    rating: 4.9,
    reviews: 128,
    price: 45,
    image: "/Hanoi_Street_Food.jpg",
    category: "Food & Culture",
    description:
      "Explore the vibrant street food scene of Hanoi with a local guide. Visit hidden gems, taste authentic dishes, and learn about Vietnamese food culture.",
    duration: "3 hours",
    groupSize: "2-8 people",
    highlights: [
      "Visit 5+ street food stalls",
      "Learn cooking techniques from locals",
      "Taste authentic Vietnamese dishes",
      "Explore Old Quarter neighborhoods",
      "Cultural insights and stories",
    ],
    includes: ["Food tastings", "Beverages", "Local guide", "Walking tour"],
    notIncludes: ["Hotel pickup", "Meals beyond tastings", "Souvenirs"],
    reviews_list: [
      {
        author: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        text: "Linh was amazing! She took us to the best street food spots and shared so much about Vietnamese culture. Highly recommend!",
        avatar: "/woman-avatar.png",
      },
      {
        author: "John D.",
        rating: 5,
        date: "1 month ago",
        text: "Best food tour I've ever done. Authentic, delicious, and Linh's passion for her city is contagious.",
        avatar: "/man-avatar.png",
      },
      {
        author: "Emma L.",
        rating: 4,
        date: "2 months ago",
        text: "Great experience overall. The food was incredible and Linh was very knowledgeable. A bit fast-paced but worth it.",
        avatar: "/woman-avatar-2.png",
      },
    ],
  },
  2: {
    id: 2,
    title: "Motorbike Adventure to Ha Long Bay",
    buddy: "Duc",
    buddyImage: "/vietnamese-man.jpg",
    buddyBio:
      "Adventure guide with 10 years of experience leading motorbike tours through Vietnam's most scenic routes.",
    buddyRating: 4.8,
    buddyReviews: 95,
    location: "Halong City, Vietnam",
    rating: 4.8,
    reviews: 95,
    price: 65,
    image: "/motorbike-adventure-halong-bay.jpg",
    category: "Adventure",
    description:
      "Thrilling motorbike ride through scenic routes to Ha Long Bay with stops at local villages and viewpoints.",
    duration: "Full day",
    groupSize: "1-4 people",
    highlights: [
      "Scenic motorbike routes",
      "Local village visits",
      "Ha Long Bay viewpoints",
      "Traditional lunch",
      "Safety equipment included",
    ],
    includes: ["Motorbike rental", "Safety gear", "Lunch", "Guide", "Fuel"],
    notIncludes: ["Hotel pickup", "Personal expenses", "Insurance"],
    reviews_list: [
      {
        author: "Mike R.",
        rating: 5,
        date: "1 week ago",
        text: "Incredible adventure! Duc was professional and the views were breathtaking.",
        avatar: "/man-avatar.png",
      },
      {
        author: "Lisa K.",
        rating: 4,
        date: "3 weeks ago",
        text: "Great experience, though quite challenging for beginners.",
        avatar: "/woman-avatar.png",
      },
    ],
  },
  3: {
    id: 3,
    title: "Traditional Cooking Class",
    buddy: "Hoa",
    buddyImage: "/vietnamese-chef.jpg",
    buddyBio:
      "Professional chef with 15 years of experience teaching traditional Vietnamese cooking techniques.",
    buddyRating: 5.0,
    buddyReviews: 156,
    location: "Ho Chi Minh City, Vietnam",
    rating: 5.0,
    reviews: 156,
    price: 55,
    image: "/traditional-cooking-class-vietnam.jpg",
    category: "Culinary",
    description:
      "Learn to cook authentic Vietnamese dishes from a local chef in a hands-on cooking class.",
    duration: "4 hours",
    groupSize: "2-6 people",
    highlights: [
      "Hands-on cooking experience",
      "Traditional recipes",
      "Market visit",
      "Recipe booklet",
      "Meal included",
    ],
    includes: [
      "Cooking class",
      "Ingredients",
      "Recipe booklet",
      "Meal",
      "Market tour",
    ],
    notIncludes: ["Transportation", "Alcoholic beverages"],
    reviews_list: [
      {
        author: "Anna T.",
        rating: 5,
        date: "5 days ago",
        text: "Hoa is an amazing teacher! I learned so much about Vietnamese cuisine.",
        avatar: "/woman-avatar-2.png",
      },
      {
        author: "David W.",
        rating: 5,
        date: "2 weeks ago",
        text: "Best cooking class ever! The food was delicious and the experience was unforgettable.",
        avatar: "/man-avatar.png",
      },
    ],
  },
};

export const featuredActivities = [
  activitiesData[1],
  activitiesData[2],
  activitiesData[3],
];

export const allActivities = Object.values(activitiesData);
