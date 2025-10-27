import { BookOpen, Award, Clock, DollarSign } from "lucide-react"

export interface WhyChooseUs {
  icon: any
  title: string
  description: string
}

export const whyChooseUs: WhyChooseUs[] = [
  {
    icon: BookOpen,
    title: "Local Knowledge & Expertise",
    description: "Our hosts are passionate locals who know their cities inside and out",
  },
  {
    icon: Award,
    title: "Excellent Reputation & Reviews",
    description: "Verified hosts with thousands of positive reviews from travelers worldwide",
  },
  {
    icon: Clock,
    title: "24/7 Customer Support",
    description: "Dedicated support team ready to help you before, during, and after your trip",
  },
  {
    icon: DollarSign,
    title: "Great Value for Money",
    description: "Competitive pricing with transparent costs and no hidden fees",
  },
]
