export const homePageContent = {
  hero: {
    imageAlt: "Travel in Vietnam with a local buddy",
    eyebrow: "Travel with a local in Vietnam",
    titleLine1: "Meet your",
    titleLine2: "local buddy.",
    description:
      "Tell us your interests and schedule. A verified local buddy crafts a personalized itinerary, recommends real experiences, and supports you in real time right in chat.",
    primaryCta: "Start your journey",
    secondaryCta: "How it works",
  },
  vietnamHighlights: {
    buttonText: "Explore",
    buttonHref: "/places",
    eyebrow: "Vietnam highlights",
    title: "Discover Vietnam's highlights.",
    subtitle:
      "From street-food nights to mountain getaways, explore culture, nature, and local life.",
    topRowHighlights: [
      { name: "Ben Thanh", image: "/places/ben-thanh.png" },
      { name: "Landmark 81", image: "/places/landmark-81.png" },
      { name: "Da Nang", image: "/places/da-nang.png" },
      { name: "Ha Long Bay", image: "/places/vinh-ha-long.png" },
      { name: "Da Lat", image: "/places/da-lat.png" },
      { name: "Sa Pa", image: "/places/sapa.png" },
      { name: "Hanoi", image: "/places/ha-noi.png" },
      { name: "Nha Trang", image: "/places/nha-trang.png" },
      { name: "Hoi An", image: "/places/hoi-an.png" },
    ],
    bottomRowHighlights: [
      { name: "Pho", image: "/foods/pho.png" },
      { name: "Banh mi", image: "/foods/banh-mi.png" },
      { name: "Nem nuong", image: "/foods/nem-nuong.png" },
      { name: "Banh xeo", image: "/foods/banh-xeo.png" },
      { name: "Com tam", image: "/foods/com-tam.png" },
      { name: "Bun dau", image: "/foods/bun-dau.png" },
      { name: "Banh cuon", image: "/foods/banh-cuon.png" },
      { name: "Crab soup", image: "/foods/sup-cua.png" },
      { name: "Bun thit nuong", image: "/foods/bun-thit-nuong.png" },
    ],
  },
  proof: {
    eyebrow: "Our approach",
    title: "A reliable foundation",
    description:
      "Bonddy combines personalized planning, quick communication, and profile verification so you can explore with confidence.",
    stats: [
      { icon: "users", value: "30+", label: "Verified buddies" },
      { icon: "shield", value: "100%", label: "Buddy screening" },
      { icon: "flask", value: "2h", label: "Avg response time" },
      { icon: "leaf", value: "6+", label: "Locations in Hồ Chí Minh" },
    ],
    principles: [
      {
        number: "01",
        title: "Personalized itinerary",
        description:
          "Tell us your city, dates, budget, and interests. Your buddy crafts a plan that matches your pace and style.",
      },
      {
        number: "02",
        title: "Chat before you decide",
        description:
          "Message your buddy to ask questions, adjust the plan, and align expectations before you confirm.",
      },
      {
        number: "03",
        title: "Verified buddies, safer trips",
        description:
          "We screen buddies and collect reviews after completed trips. If anything goes wrong, Bonddy support is here to help.",
      },
    ],
  },
  about: {
    eyebrow: "ABOUT BONDDY",
    eyebrowHint: "Meet our team and mission",
    headline: "Travel like a local with a buddy who knows the city.",
    subheadline:
      "Bonddy connects you with verified locals to design a personalized itinerary, share hidden gems, and support you before and during your trip.",
    description:
      "Instead of generic tours, you get real places, real food, and real recommendations based on your pace and preferences.",
    primaryButtonText: "Read our story",
    primaryButtonHref: "/about-us",
    secondaryButtonText: "Browse buddies",
    secondaryButtonHref: "/buddies",
    videoSrc: "/videos/tvc.mp4",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Travelers love our buddies",
    items: [
      {
        quote:
          "The itinerary felt truly personal, and our buddy adapted quickly whenever we changed plans.",
        author: "Marie L.",
        role: "User for 8 months",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        quote:
          "Bonddy's approach is practical and clear. Better planning, less stress, and more confidence on the road.",
        author: "Thomas D.",
        role: "User for 1 year",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        quote:
          "As a doctor, I value clear processes and trust. Bonddy's verification and support made a real difference.",
        author: "Dr. Sophie M.",
        role: "General practitioner",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        quote:
          "I saved so much time. Instead of searching for hours, I just asked in chat and got useful local tips instantly.",
        author: "Lucas P.",
        role: "User for 6 months",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        quote:
          "My first Vietnam trip felt easy and safe thanks to quick support and realistic recommendations.",
        author: "Claire B.",
        role: "User for 10 months",
        avatar: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  solution: {
    eyebrow: "Why Bonddy",
    title: "Travel the local way",
    description:
      "Personalized planning, verified buddies, and real-time support so you can explore with confidence.",
    highlights: [
      {
        name: "Your perfect trip",
        description:
          "Share your dates, interests, and pace — a local buddy will design a trip for you.",
        image: "/trip.png",
        tag: "Personalized",
        href: "/trip-request",
        cta: "Create trip request",
      },
      {
        name: "Local buddies",
        description:
          "Choose buddies by city and language. Profiles are reviewed to keep the community safe and high-quality.",
        image: "/verified.png",
        tag: "Verified",
        href: "/buddies",
        cta: "Browse buddies",
      },
      {
        name: "Chat and support",
        description:
          "Refine your plan in chat, ask local questions, and get practical tips before and during the trip.",
        image: "/chat.png",
        tag: "In chat",
        href: "/how-it-works",
        cta: "How it works",
      },
    ],
  },
  buddiesForm: {
    imageAlt: "Vietnam travel with local buddies",
    eyebrow: "Become a Local Buddy",
    title: "Turn your local knowledge into unforgettable trips",
    paragraph1:
      "Create personalized itineraries, recommend real local experiences, and support travelers in real time right in chat.",
    paragraph2:
      "We review every profile to keep the community safe and high-quality. Set your availability, choose your cities and languages, and start receiving matching trip requests.",
    meta: "Flexible schedule - Earn per booking - Meet travelers worldwide",
    primaryCta: "Apply now",
    primaryHref: "/buddy/apply",
    secondaryCta: "How it works",
    secondaryHref: "/how-it-works",
  },
  faq: {
    hero: {
      title1: "Frequently Asked Questions",
      title2: "when using",
      brand: "Bonddy",
    },
    items: [
      {
        q: "What is Bonddy and how does it work?",
        a: "Bonddy connects you with local buddies to design a personalized itinerary, quick advice, and support during your trip.",
      },
      {
        q: "Can I request a trip based on my interests?",
        a: "Yes. Share your interests, timing, and budget and we will suggest a tailored plan.",
      },
      {
        q: "Is the service suitable for families or couples?",
        a: "Absolutely. We optimize itineraries for different group sizes and needs.",
      },
      {
        q: "Is my personal data safe?",
        a: "Yes. We only use your details for consultation and never share them with third parties.",
      },
      {
        q: "How do I get started?",
        a: "Leave your info in the consultation form and we will contact you within 24 hours.",
      },
    ],
  },
} as const;

export const footerContent = {
  companyName: "Bonddy",
  tagline: "Your local expert for Vietnam trips",
  description: "Bonddy is your trusted partner for authentic local journeys.",
  email: "bonddy.contact@gmail.com",
  phone: "098 986 12 70",
  sections: [
    {
      title: "Bonddy",
      links: [
        { label: "Featured tours", href: "#" },
        { label: "Popular destinations", href: "#" },
        { label: "Travel guide", href: "#" },
      ],
    },
    {
      title: "Trips",
      links: [
        { label: "3-5 days", href: "#" },
        { label: "7-10 days", href: "#" },
        { label: "Family trips", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: "#" },
        { label: "Privacy policy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ],
} as const;
