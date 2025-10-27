export interface Destination {
  id: number;
  name: string;
  image: string;
  tours: number;
  description: string;
}

export interface Testimonial {
  name: string;
  date: string;
  rating: number;
  text: string;
  image: string;
}

export interface WhyChooseUs {
  icon: any;
  title: string;
  description: string;
}

export const topDestinations: Destination[] = [
  {
    id: 1,
    name: "Hanoi",
    image: "/street-food-tour-hanoi.jpg",
    tours: 45,
    description:
      "Capital city with rich history and vibrant street food culture",
  },
  {
    id: 2,
    name: "Ha Long Bay",
    image: "/halong-bay.jpg",
    tours: 32,
    description: "UNESCO World Heritage site with stunning limestone karsts",
  },
  {
    id: 3,
    name: "Ho Chi Minh City",
    image: "/traditional-cooking-class-vietnam.jpg",
    tours: 38,
    description: "Dynamic metropolis blending tradition with modern energy",
  },
  {
    id: 4,
    name: "Sapa",
    image: "/sunrise-hike-meditation-sapa.jpg",
    tours: 28,
    description:
      "Mountain town known for terraced rice fields and ethnic cultures",
  },
];

export const feedbacksData: Testimonial[] = [
  {
    name: "Martina Di-marco",
    date: "Sep 22, 2025",
    rating: 5,
    text: "Trip to Vietnam organized with LocalHost: everything was perfect! Tailor-made itinerary, knowledgeable guides, punctual transfers, and well-chosen hotels. A reliable agency, always available. Highly recommended!",
    image: "/vietnamese-woman.jpg",
  },
  {
    name: "Tara Bergin",
    date: "Oct 9, 2025",
    rating: 5,
    text: "From the moment my husband and I contacted IZI tours we were paired with a kind, helpful agent. Lien was our dedicated agent who went above and beyond in organising...",
    image: "/vietnamese-woman.jpg",
  },
  {
    name: "Blanche Decroix",
    date: "Oct 9, 2025",
    rating: 5,
    text: "We highly recommend the izitour agency, and particularly Emily who not only helped us prepare for this trip but also adapted our stay based on our health condition and the...",
    image: "/vietnamese-woman.jpg",
  },
];
