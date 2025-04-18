export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface CartItem extends Product {
  quantity: number
}

export const products: Product[] = [
  {
    id: "p1",
    name: "The Joy Of X",
    description: "A sleek and modern desk lamp with adjustable brightness and color temperature.",
    price: 89,
    image:
      "/images/marketplace/thejoyofx.jpg",
    category: "Maths",
  },
  {
    id: "p2",
    name: "How To Not Be Wrong",
    description: "Handcrafted ceramic coffee set including 4 cups and a matching pour-over dripper.",
    price: 65,
    image:
      "/images/marketplace/howtonotbewrong.jpg",
    category: "Maths",
  },
  {
    id: "p3",
    name: "Basic Physics For Begginers",
    description: "Soft linen throw pillow with minimalist pattern design.",
    price: 45,
    image:
      "/images/marketplace/phy4.jpg",
    category: "Physics",
  },
  {
    id: "p4",
    name: "Quantum Physics For Beginners",
    description: "Modern wooden wall clock with silent movement.",
    price: 79,
    image:
      "/images/marketplace/phy2.jpg",
      category: "Physics",
  },
  {
    id: "p5",
    name: "A Text Book Of Physical Chemistry",
    description: "Minimalist concrete planter perfect for succulents.",
    price: 34,
    image:
      "/images/marketplace/chem1.jpg",
      category: "Chemistry",
  },
  {
    id: "p6",
    name: "Organic Chemistry",
    description: "Set of 3 minimalist glass vases in varying sizes.",
    price: 55,
    image:
     "/images/marketplace/chem2.jpg",
     category: "Chemistry",
  },
  {
    id: "p7",
    name: "History Of English Literature",
    description: "Desk organizer made from sustainable bamboo.",
    price: 42,
    image:
      "/images/marketplace/eng1.jpg",
        category: "English",
  },
  {
    id: "p8",
    name: "English Literature",
    description: "Set of 4 marble coasters with cork backing.",
    price: 38,
    image:
      "/images/marketplace/eng2.jpg",
      category: "English",
  },
  {
    id: "p9",
    name: "Core Java",
    description: "Modern geometric brass bookends, set of 2.",
    price: 68,
    image:
    "/images/marketplace/cs1.jpg",
    category: "Computer Science",
  },
  {
    id: "p10",
    name: "Object Oriented Programming in C++" ,
    description: "Handmade ceramic plant pot with drainage hole.",
    price: 48,
    image:
      "/images/marketplace/cs2.jpg",
      category: "Computer Science",
  },
  {
    id: "p11",
    name: "The Biology Book",
    description: "Round wall mirror with minimal metal frame.",
    price: 120,
    image:
      "/images/marketplace/bio2.jpg",
      category: "Biology",
  },
  {
    id: "p12",
    name: "General Biology",
    description: "Round wall mirror with minimal metal frame.",
    price: 120,
    image:
    "/images/marketplace/bio4.jpg",
    category: "Biology",
  },
  {
    id: "p13",
    name: "Ancient Indian History",
    description: "Round wall mirror with minimal metal frame.",
    price: 120,
    image:
    "/images/marketplace/his1.jpg",
    category: "History",
  },
  {
    id: "p14",
    name: "Global History Of War",
    description: "Round wall mirror with minimal metal frame.",
    price: 120,
    image:
    "/images/marketplace/his2.jpg",
    category: "History",
  },
  {
    id: "p15",
    name: "The Economics Book",
    description: "Round wall mirror with minimal metal frame.",
    price: 120,
    image:
    "/images/marketplace/eco1.jpg",
    category: "Economics",
  },
  {
    id: "p16",
    name: "The Little Book Of Economics",
    description: "Round wall mirror with minimal metal frame.",
    price: 120,
    image:
    "/images/marketplace/eco2.jpg",
    category: "Economics",
  },
]

