// Import actual fabric images
import floralCotton from "@/assets/The Coutures/Vertical Wise/Fabric/1 Floral Cotton - Lines Printed Unstitched Shirt Fabric - 2 Pure Cotton - Lines Mix Checks Shirt Fabric.jpg";
import linesLee from "@/assets/The Coutures/Vertical Wise/Fabric/100-Percent-Lines-60-Lee-Unstitched-Shirt-Fabric.jpg";
import cottonTextured from "@/assets/The Coutures/Vertical Wise/Fabric/Cotton Textured Shirt Fabric.jpg";
import denisArt from "@/assets/The Coutures/Vertical Wise/Fabric/Denis-Art-White-Edition-100-Percent-Cotton.jpg";
import egyptianGiza from "@/assets/The Coutures/Vertical Wise/Fabric/Egyptian-Giza-Cotton-80x80-Satin-Soft-Fabric.jpg";
import finestGiza from "@/assets/The Coutures/Vertical Wise/Fabric/Finest-Giza-Cotton-80x80-Satin-Soft-Fabric.jpg";
import paperCotton from "@/assets/The Coutures/Vertical Wise/Fabric/Paper-Cotton-Textured-Shirt-Fabric.jpg";
import pureItalian from "@/assets/The Coutures/Vertical Wise/Fabric/Pure-Italian-Cotton-White-Edition-Shirt-Fabric.jpg";
import texturedCotton from "@/assets/The Coutures/Vertical Wise/Fabric/Textured Printed Cotton - Linen Unstitched Shirt Fabric.jpg";
import westernGiza from "@/assets/The Coutures/Vertical Wise/Fabric/Western-Giza-Cotton-80x80-Satin-Soft-Fabric.jpg";

// Import trouser images
import armani19000 from "@/assets/The Coutures/Vertical Wise/Pant/Armani 19000 Unstitched Trouser Fabric.jpg";
import blackTrouser from "@/assets/The Coutures/Vertical Wise/Pant/Images - 2/Black 2.jpg";
import creamTrouser from "@/assets/The Coutures/Vertical Wise/Pant/Images - 2/Cream 1.jpg";
import maroonTrouser from "@/assets/The Coutures/Vertical Wise/Pant/Images - 2/Maroon 1.jpg";
import pineGreenTrouser from "@/assets/The Coutures/Vertical Wise/Pant/Images - 4/Pine Green 1.jpg";
import lorisTrouser from "@/assets/The Coutures/Vertical Wise/Pant/Loris Trouser Unstitched Dabric-1.jpg";
import lycraArmani from "@/assets/The Coutures/Vertical Wise/Pant/Lycra Armani Trouser Unstitched Fabric-1.jpg";
import ocmTrouser from "@/assets/The Coutures/Vertical Wise/Pant/OCM Unstritched Trouser Fabric Pure Cotton-1.jpg";
import popcornArmani from "@/assets/The Coutures/Vertical Wise/Pant/Popcorn Armani Unstitched Trouser Fabric.jpg";

// Import Indo-Western images
import indoWestern8 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-24.jpg";
import indoWestern9 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-25.jpg";
import indoWestern10 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-26.jpg";
import indoWestern1 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-3.jpg";
import indoWestern2 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-4.jpg";
import indoWestern3 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-5.jpg";
import indoWestern4 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-6.jpg";
import indoWestern5 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-7.jpg";
import indoWestern6 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-8.jpg";
import indoWestern7 from "@/assets/The Coutures/Vertical Wise/Indo-Western/IMG-9.jpg";

import { Product } from "@/components/ProductCard";

export const cottonProducts: Product[] = [
  {
    id: "linen-60-lee",
    name: "100% Linen-60 Lee",
    description: "Unstitched breathable shirt fabric",
    price: 1599,
    image: linesLee,
    material: "100% Pure Linen",
  },
  {
    id: "cotton-2",
    name: "Denis Art White Edition",
    description: "100% Egyptian Giza Cotton 80x80 Satin Soft Fabric",
    price: 2499,
    image: denisArt,
    material: "Egyptian Giza Cotton",
  },
  {
    id: "cotton-3",
    name: "Paper Cotton Textured",
    description: "Unique textured shirt fabric with superior comfort",
    price: 1599,
    image: paperCotton,
    material: "Paper Cotton",
  },
  {
    id: "cotton-4",
    name: "Egyptian Giza Cotton",
    description: "80x80 Satin Soft Fabric for premium shirts",
    price: 2299,
    image: egyptianGiza,
    material: "Egyptian Giza Cotton",
  },
  {
    id: "cotton-giza",
    name: "Western Giza Cotton",
    description: "80x80 Satin Soft Fabric for premium shirts",
    price: 2199,
    image: westernGiza,
    material: "Giza Cotton",
  },
  {
    id: "cotton-5",
    name: "Pure Italian Cotton",
    description: "White Edition premium shirt fabric from Italy",
    price: 2999,
    image: pureItalian,
    material: "Italian Cotton",
  },
  {
    id: "cotton-6",
    name: "Textured Cotton-Linen",
    description: "Printed cotton-linen unstitched shirt fabric",
    price: 1899,
    image: texturedCotton,
    material: "Cotton-Linen Blend",
  },
  {
    id: "cotton-7",
    name: "Floral Cotton Lines",
    description: "Printed unstitched shirt fabric with floral design",
    price: 1399,
    image: floralCotton,
    material: "Printed Cotton",
  },
  {
    id: "cotton-8",
    name: "Finest Giza Cotton",
    description: "80x80 Satin Soft premium fabric",
    price: 1799,
    image: finestGiza,
    material: "Finest Giza Cotton",
  },
  {
    id: "cotton-9",
    name: "Cotton Textured Fabric",
    description: "Premium textured shirt fabric",
    price: 2399,
    image: cottonTextured,
    material: "Cotton Textured",
  },
];

export const trouserProducts: Product[] = [
  {
    id: "trouser-1",
    name: "Lycra Armani Trouser",
    description: "Unstitched fabric with stretch comfort",
    price: 2199,
    image: lycraArmani,
    material: "Lycra Blend",
  },
  {
    id: "trouser-2",
    name: "OCM Pure Cotton Trouser",
    description: "Premium quality pure cotton trouser fabric",
    price: 1999,
    image: ocmTrouser,
    material: "Pure Cotton",
  },
  {
    id: "trouser-3",
    name: "Armani 19000 Trouser",
    description: "Premium unstitched trouser fabric",
    price: 2199,
    image: armani19000,
    material: "Premium Blend",
  },
  {
    id: "trouser-4",
    name: "Loris Trouser Fabric",
    description: "High-quality unstitched trouser fabric",
    price: 1599,
    image: lorisTrouser,
    material: "Premium Cotton",
  },
  {
    id: "trouser-5",
    name: "Popcorn Armani Trouser",
    description: "Textured premium trouser fabric",
    price: 1299,
    image: popcornArmani,
    material: "Armani Blend",
  },
  {
    id: "trouser-6",
    name: "Maroon Classic Trouser",
    description: "Rich maroon colored trouser fabric",
    price: 2499,
    image: maroonTrouser,
    material: "Premium Cotton",
  },
  {
    id: "trouser-7",
    name: "Cream Elegant Trouser",
    description: "Sophisticated cream trouser fabric",
    price: 1899,
    image: creamTrouser,
    material: "Premium Cotton",
  },
  {
    id: "trouser-8",
    name: "Classic Black Trouser",
    description: "Timeless black trouser fabric",
    price: 1699,
    image: blackTrouser,
    material: "Premium Cotton",
  },
  {
    id: "trouser-9",
    name: "Pine Green Trouser",
    description: "Modern pine green trouser fabric",
    price: 2299,
    image: pineGreenTrouser,
    material: "Premium Cotton",
  },
];

export const ethnicProducts: Product[] = [
  {
    id: "ethnic-1",
    name: "Indo-Western Silk Fabric",
    description: "Premium Indo-Western unstitched fabric",
    price: 2899,
    image: indoWestern1,
    material: "Art Silk",
  },
  {
    id: "ethnic-2",
    name: "Modi Jacket Fabric",
    description: "Elegant Modi jacket unstitched fabric",
    price: 2999,
    image: indoWestern2,
    material: "Polyester Blend",
  },
  {
    id: "ethnic-3",
    name: "Sherwani Premium Fabric",
    description: "Luxury unstitched sherwani fabric",
    price: 3999,
    image: indoWestern3,
    material: "Art Silk",
  },
  {
    id: "ethnic-4",
    name: "Jodhpuri Suit Fabric",
    description: "Traditional Jodhpuri unstitched fabric",
    price: 4499,
    image: indoWestern4,
    material: "Silk Blend",
  },
  {
    id: "ethnic-5",
    name: "Ethnic Blazer Fabric",
    description: "Contemporary ethnic blazer fabric",
    price: 3299,
    image: indoWestern5,
    material: "Polyester Silk",
  },
  {
    id: "ethnic-6",
    name: "Festive Wear Fabric",
    description: "Rich festive unstitched fabric",
    price: 1999,
    image: indoWestern6,
    material: "Art Silk",
  },
  {
    id: "ethnic-7",
    name: "Wedding Sherwani Fabric",
    description: "Premium wedding sherwani fabric",
    price: 4999,
    image: indoWestern7,
    material: "Silk Brocade",
  },
  {
    id: "ethnic-8",
    name: "Designer Indo-Western",
    description: "Modern Indo-Western unstitched fabric",
    price: 2799,
    image: indoWestern8,
    material: "Silk Polyester",
  },
  {
    id: "ethnic-9",
    name: "Royal Ethnic Fabric",
    description: "Luxurious royal ethnic fabric",
    price: 4299,
    image: indoWestern9,
    material: "Premium Silk",
  },
  {
    id: "ethnic-10",
    name: "Traditional Wear Fabric",
    description: "Classic traditional unstitched fabric",
    price: 2499,
    image: indoWestern10,
    material: "Art Silk",
  },
];

export const brands = {
  cotton: ["Raymond", "Siyaram's", "Arvind", "Vimal", "Reid & Taylor", "Grasim"],
  trouser: ["Armani", "OCM", "Siyaram's", "Raymond", "Linen Club", "Louis Philippe"],
  ethnic: ["Manyavar", "Peter England", "Raymond", "Van Heusen", "Blackberrys", "Jade Blue"],
};
