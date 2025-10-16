
// Import color theme images
import burntOrange from "@/assets/images/Burnt Orange.png";
import burntSienna from "@/assets/images/Burnt Sienna.png";
import darkForestGreen from "@/assets/images/Dark Forest Green.png";
import dustyRose from "@/assets/images/Dusty Rose.png";
import khakiGreen from "@/assets/images/Khaki Green.png";
import lightSageGreen from "@/assets/images/Light Sage Green.png";
import lightSkyBlue from "@/assets/images/Light Sky Blue.png";
import maroon from "@/assets/images/Maroon.png";
import navyBlue from "@/assets/images/Navy Blue.png";
import oliveGreen from "@/assets/images/Olive Green.png";
import royalBlue from "@/assets/images/Royal Blue.png";
import tealBlue from "@/assets/images/Teal Blue.png";

export interface ColorVariant {
  id: string;
  name: string;
  image: string;
  price: number;
  inStock: boolean;
}

export interface ProductDetail {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  material: string;
  weight: string;
  width: string;
  care: string;
  features: string[];
  colorVariants: ColorVariant[];
}

// Common color variants for different product types
const cottonColorVariants: ColorVariant[] = [
  { id: "teal-blue", name: "Teal Blue", image: tealBlue, price: 1599, inStock: true },
  { id: "royal-blue", name: "Royal Blue", image: royalBlue, price: 1599, inStock: true },
  { id: "navy-blue", name: "Navy Blue", image: navyBlue, price: 1599, inStock: true },
  { id: "light-sky-blue", name: "Light Sky Blue", image: lightSkyBlue, price: 1599, inStock: false },
  { id: "olive-green", name: "Olive Green", image: oliveGreen, price: 1799, inStock: true },
  { id: "light-sage-green", name: "Light Sage Green", image: lightSageGreen, price: 1799, inStock: true },
  { id: "khaki-green", name: "Khaki Green", image: khakiGreen, price: 1699, inStock: true },
  { id: "dark-forest-green", name: "Dark Forest Green", image: darkForestGreen, price: 1799, inStock: true },
  { id: "maroon", name: "Maroon", image: maroon, price: 1699, inStock: true },
  { id: "dusty-rose", name: "Dusty Rose", image: dustyRose, price: 1599, inStock: true },
  { id: "burnt-sienna", name: "Burnt Sienna", image: burntSienna, price: 1699, inStock: true },
  { id: "burnt-orange", name: "Burnt Orange", image: burntOrange, price: 1699, inStock: false }
];

const trouserColorVariants: ColorVariant[] = [
  { id: "navy-blue", name: "Navy Blue", image: navyBlue, price: 2199, inStock: true },
  { id: "dark-forest-green", name: "Dark Forest Green", image: darkForestGreen, price: 2299, inStock: true },
  { id: "maroon", name: "Maroon", image: maroon, price: 2199, inStock: true },
  { id: "burnt-sienna", name: "Burnt Sienna", image: burntSienna, price: 2199, inStock: true },
  { id: "khaki-green", name: "Khaki Green", image: khakiGreen, price: 2099, inStock: true },
  { id: "olive-green", name: "Olive Green", image: oliveGreen, price: 2199, inStock: false },
  { id: "royal-blue", name: "Royal Blue", image: royalBlue, price: 2199, inStock: true },
  { id: "burnt-orange", name: "Burnt Orange", image: burntOrange, price: 2199, inStock: true }
];

const ethnicColorVariants: ColorVariant[] = [
  { id: "royal-blue", name: "Royal Blue", image: royalBlue, price: 2899, inStock: true },
  { id: "maroon", name: "Maroon", image: maroon, price: 2899, inStock: true },
  { id: "dark-forest-green", name: "Dark Forest Green", image: darkForestGreen, price: 2999, inStock: true },
  { id: "burnt-orange", name: "Burnt Orange", image: burntOrange, price: 2899, inStock: true },
  { id: "dusty-rose", name: "Dusty Rose", image: dustyRose, price: 2799, inStock: true },
  { id: "olive-green", name: "Olive Green", image: oliveGreen, price: 2899, inStock: false },
  { id: "burnt-sienna", name: "Burnt Sienna", image: burntSienna, price: 2899, inStock: true },
  { id: "teal-blue", name: "Teal Blue", image: tealBlue, price: 2799, inStock: true }
];

export const productDetails: Record<string, ProductDetail> = {
  "linen-60-lee": {
    id: "linen-60-lee",
    name: "100% Linen-60 Lee",
    subtitle: "Unstitched breathable shirt fabric",
    description: "Premium quality linen fabric perfect for creating breathable, comfortable shirts. This unstitched fabric offers superior comfort and durability with a sophisticated texture that's ideal for both casual and semi-formal wear.",
    material: "100% Pure Linen",
    weight: "60 GSM",
    width: "58 inches",
    care: "Machine wash cold, hang dry, iron on medium heat",
    features: ["Breathable", "Wrinkle-resistant", "Natural fiber", "Eco-friendly", "Durable"],
    colorVariants: cottonColorVariants
  },
  "cotton-2": {
    id: "cotton-2",
    name: "Denis Art White Edition",
    subtitle: "100% Egyptian Giza Cotton premium fabric",
    description: "Luxurious Egyptian Giza cotton fabric with 80x80 thread count. This premium satin-soft fabric provides exceptional comfort and elegance, perfect for high-end shirt tailoring.",
    material: "Egyptian Giza Cotton",
    weight: "80 GSM",
    width: "60 inches",
    care: "Dry clean recommended, gentle machine wash",
    features: ["Satin finish", "High thread count", "Luxury feel", "Color-fast", "Premium quality"],
    colorVariants: cottonColorVariants
  },
  "cotton-3": {
    id: "cotton-3",
    name: "Paper Cotton Textured",
    subtitle: "Unique textured shirt fabric",
    description: "Innovative paper cotton blend with unique texture that provides superior comfort and style. Perfect for contemporary shirt designs with a modern aesthetic.",
    material: "Paper Cotton Blend",
    weight: "65 GSM",
    width: "58 inches",
    care: "Machine wash cold, tumble dry low",
    features: ["Unique texture", "Lightweight", "Quick-dry", "Contemporary", "Comfortable"],
    colorVariants: cottonColorVariants
  },
  "trouser-1": {
    id: "trouser-1",
    name: "Premium Wool Blend",
    subtitle: "Formal trouser fabric",
    description: "High-quality wool blend fabric perfect for formal trousers. Offers excellent drape, durability, and professional appearance suitable for business and formal occasions.",
    material: "Wool Blend",
    weight: "280 GSM",
    width: "60 inches",
    care: "Dry clean only",
    features: ["Wrinkle-resistant", "Professional drape", "Durable", "Formal wear", "High-quality"],
    colorVariants: trouserColorVariants
  },
  "trouser-2": {
    id: "trouser-2",
    name: "Cotton Stretch Fabric",
    subtitle: "Comfortable trouser material",
    description: "Cotton blend with stretch technology for maximum comfort and flexibility. Ideal for both casual and semi-formal trouser styles.",
    material: "Cotton Stretch Blend",
    weight: "250 GSM",
    width: "58 inches",
    care: "Machine wash warm, iron medium heat",
    features: ["Stretch comfort", "Flexible", "Easy care", "Versatile", "Modern fit"],
    colorVariants: trouserColorVariants
  },
  "ethnic-1": {
    id: "ethnic-1",
    name: "Silk Brocade Premium",
    subtitle: "Traditional ethnic wear fabric",
    description: "Luxurious silk brocade fabric with intricate traditional patterns. Perfect for creating elegant ethnic wear and Indo-Western fusion garments.",
    material: "Pure Silk Brocade",
    weight: "200 GSM",
    width: "44 inches",
    care: "Dry clean only, handle with care",
    features: ["Traditional patterns", "Luxury silk", "Ethnic elegance", "Festive wear", "Premium finish"],
    colorVariants: ethnicColorVariants
  },
  "ethnic-2": {
    id: "ethnic-2",
    name: "Handloom Cotton Khadi",
    subtitle: "Artisan crafted ethnic fabric",
    description: "Authentic handloom cotton khadi fabric that celebrates traditional Indian craftsmanship. Perfect for creating contemporary ethnic wear with cultural heritage.",
    material: "Handloom Cotton Khadi",
    weight: "120 GSM",
    width: "45 inches",
    care: "Hand wash cold, air dry naturally",
    features: ["Handwoven", "Eco-friendly", "Cultural heritage", "Artisan crafted", "Sustainable"],
    colorVariants: ethnicColorVariants
  },
  "trouser-3": {
    id: "trouser-3",
    name: "Lycra Armani Trouser",
    subtitle: "Unstitched fabric with stretch comfort",
    description: "Premium lycra blend trouser fabric inspired by designer aesthetics. Offers exceptional stretch comfort while maintaining formal appearance for professional wear.",
    material: "Lycra Blend",
    weight: "260 GSM",
    width: "60 inches",
    care: "Machine wash warm, avoid bleach, iron low heat",
    features: ["Stretch comfort", "Designer inspired", "Formal appearance", "Professional grade", "Flexible fit"],
    colorVariants: trouserColorVariants
  },
  "trouser-4": {
    id: "trouser-4",
    name: "OCM Unstitched Trouser",
    subtitle: "Premium quality trouser fabric",
    description: "High-quality OCM trouser fabric engineered for durability and comfort. Perfect for creating professional trousers with superior finish and lasting wear.",
    material: "OCM Premium",
    weight: "275 GSM",
    width: "58 inches",
    care: "Dry clean recommended for best results",
    features: ["OCM quality", "Durable construction", "Professional finish", "Superior comfort", "Long-lasting"],
    colorVariants: trouserColorVariants
  },
  "ethnic-3": {
    id: "ethnic-3",
    name: "Blazer Fabric Premium",
    subtitle: "Luxury unstitched fabric for blazers",
    description: "Premium blazer fabric designed for sophisticated ethnic and Indo-Western wear. Features luxury texture and exceptional drape for creating statement blazers.",
    material: "Premium Ethnic Blend",
    weight: "320 GSM",
    width: "58 inches",
    care: "Dry clean only, professional pressing recommended",
    features: ["Luxury texture", "Premium drape", "Statement wear", "Indo-Western style", "Sophisticated finish"],
    colorVariants: ethnicColorVariants
  },
  "cotton-12": {
    id: "cotton-12",
    name: "Oxford Cotton Fabric",
    subtitle: "Premium oxford weave for formal wear",
    description: "Classic Oxford cotton fabric with distinctive weave pattern. Perfect for creating formal shirts with traditional elegance and professional appearance.",
    material: "Oxford Cotton",
    weight: "75 GSM",
    width: "60 inches",
    care: "Machine wash cold, iron medium heat, dry clean for best results",
    features: ["Oxford weave", "Formal elegance", "Professional appearance", "Classic style", "Distinctive pattern"],
    colorVariants: cottonColorVariants
  },
  "cotton-4": {
    id: "cotton-4",
    name: "Italian Cotton Dobby",
    subtitle: "Designer weave shirt fabric with sophisticated pattern",
    description: "Premium Italian cotton with sophisticated dobby weave pattern. Combines European craftsmanship with modern design sensibilities for discerning customers.",
    material: "Italian Cotton Dobby",
    weight: "75 GSM",
    width: "60 inches",
    care: "Machine wash cold, professional pressing recommended",
    features: ["Designer weave", "European quality", "Sophisticated pattern", "Premium cotton", "Modern aesthetic"],
    colorVariants: cottonColorVariants
  },
  "cotton-5": {
    id: "cotton-5",
    name: "Pure Italian Cotton",
    subtitle: "White Edition premium shirt fabric from Italy",
    description: "Exceptional Italian cotton fabric featuring pristine white finish and superior quality. Crafted in Italy with traditional European techniques for the ultimate luxury shirt experience.",
    material: "Pure Italian Cotton",
    weight: "85 GSM",
    width: "60 inches",
    care: "Dry clean recommended for best results, gentle machine wash acceptable",
    features: ["Italian craftsmanship", "Premium white finish", "Luxury feel", "European quality", "Superior durability"],
    colorVariants: cottonColorVariants
  },
  "cotton-6": {
    id: "cotton-6",
    name: "Pure Linen Premium",
    subtitle: "Unstitched breathable premium linen fabric",
    description: "High-quality pure linen fabric perfect for creating breathable, comfortable garments. Natural fiber with excellent moisture-wicking properties and timeless appeal.",
    material: "Pure Linen",
    weight: "65 GSM",
    width: "56 inches",
    care: "Machine wash cold, hang dry, iron while slightly damp",
    features: ["Natural fiber", "Breathable", "Moisture-wicking", "Eco-friendly", "Timeless appeal"],
    colorVariants: cottonColorVariants
  },
  "cotton-7": {
    id: "cotton-7",
    name: "Floral Cotton Lines",
    subtitle: "Printed unstitched shirt fabric with floral design",
    description: "Beautiful printed cotton fabric featuring elegant floral patterns. Perfect for creating stylish casual shirts with artistic flair and contemporary appeal.",
    material: "Printed Cotton",
    weight: "70 GSM",
    width: "58 inches",
    care: "Machine wash cold, gentle cycle, iron on reverse side",
    features: ["Floral patterns", "Artistic design", "Casual elegance", "Contemporary style", "Colorfast printing"],
    colorVariants: cottonColorVariants
  },
  "cotton-8": {
    id: "cotton-8",
    name: "Cotton-Linen Mix Checks",
    subtitle: "Pure cotton-linen blend with check pattern",
    description: "Premium cotton-linen blend fabric with classic check pattern. Combines the comfort of cotton with the elegance of linen for versatile styling options.",
    material: "Cotton-Linen Blend",
    weight: "72 GSM",
    width: "58 inches",
    care: "Machine wash cold, tumble dry low, iron medium heat",
    features: ["Check pattern", "Cotton comfort", "Linen elegance", "Versatile styling", "Classic design"],
    colorVariants: cottonColorVariants
  },
  "cotton-9": {
    id: "cotton-9",
    name: "Raymond Premium Cotton",
    subtitle: "Luxury shirt fabric with wrinkle-free finish",
    description: "Premium Raymond cotton fabric with advanced wrinkle-free technology. Perfect for busy professionals who demand style without compromise on convenience and comfort.",
    material: "Raymond Cotton",
    weight: "78 GSM",
    width: "58 inches",
    care: "Machine wash warm, minimal ironing required",
    features: ["Wrinkle-free", "Easy care", "Professional grade", "Premium brand", "All-day comfort"],
    colorVariants: cottonColorVariants
  },
  "cotton-10": {
    id: "cotton-10",
    name: "Silk Cotton Blend",
    subtitle: "Smooth silk-cotton blend for elegant shirts",
    description: "Luxurious silk-cotton blend fabric that combines the elegance of silk with the comfort of cotton. Perfect for creating sophisticated shirts with a premium feel and natural sheen.",
    material: "Silk-Cotton Blend",
    weight: "85 GSM",
    width: "60 inches",
    care: "Dry clean recommended, gentle hand wash acceptable",
    features: ["Silk elegance", "Cotton comfort", "Natural sheen", "Premium blend", "Sophisticated finish"],
    colorVariants: cottonColorVariants
  },
  "cotton-11": {
    id: "cotton-11",
    name: "Chambray Cotton Fabric",
    subtitle: "Classic chambray weave for casual shirts",
    description: "Traditional chambray cotton fabric with distinctive weave pattern. Ideal for creating casual yet refined shirts with timeless appeal and versatile styling options.",
    material: "Chambray Cotton",
    weight: "70 GSM",
    width: "58 inches",
    care: "Machine wash cold, tumble dry low, iron medium heat",
    features: ["Classic weave", "Casual elegance", "Versatile styling", "Timeless appeal", "Easy maintenance"],
    colorVariants: cottonColorVariants
  },
  "cotton-giza": {
    id: "cotton-giza",
    name: "Western Giza Cotton",
    subtitle: "80x80 Satin Soft Fabric for premium shirts",
    description: "Premium Egyptian Giza cotton with 80x80 thread count and satin-soft finish. Represents the pinnacle of cotton quality with exceptional durability and luxurious feel.",
    material: "Giza Cotton",
    weight: "82 GSM",
    width: "60 inches",
    care: "Dry clean preferred, gentle machine wash cold",
    features: ["Egyptian Giza", "80x80 thread count", "Satin finish", "Premium quality", "Exceptional durability"],
    colorVariants: cottonColorVariants
  },
  "trouser-5": {
    id: "trouser-5",
    name: "Pure Cotton Trouser",
    subtitle: "100% cotton unstitched trouser fabric",
    description: "Premium 100% cotton trouser fabric perfect for creating comfortable, breathable trousers. Natural cotton ensures all-day comfort with classic styling options.",
    material: "Pure Cotton",
    weight: "240 GSM",
    width: "58 inches",
    care: "Machine wash warm, iron high heat, tumble dry medium",
    features: ["100% cotton", "Breathable comfort", "Natural fiber", "Classic styling", "Easy care"],
    colorVariants: trouserColorVariants
  },
  "trouser-6": {
    id: "trouser-6",
    name: "Wool Blend Trouser",
    subtitle: "Premium wool blend for formal trousers",
    description: "High-quality wool blend trouser fabric designed for formal and business wear. Excellent drape and wrinkle resistance for professional appearance.",
    material: "Wool Blend",
    weight: "290 GSM",
    width: "60 inches",
    care: "Dry clean only, professional pressing recommended",
    features: ["Premium wool blend", "Formal elegance", "Wrinkle resistant", "Professional drape", "Business wear"],
    colorVariants: trouserColorVariants
  },
  "trouser-7": {
    id: "trouser-7",
    name: "Linen Club Trouser",
    subtitle: "Breathable linen fabric for summer wear",
    description: "Premium linen trouser fabric perfect for summer and casual wear. Natural breathability and comfort make it ideal for warm weather styling.",
    material: "Pure Linen",
    weight: "220 GSM",
    width: "56 inches",
    care: "Machine wash cold, hang dry, iron while damp",
    features: ["Summer comfort", "Natural linen", "Breathable", "Casual elegance", "Warm weather"],
    colorVariants: trouserColorVariants
  },
  "trouser-8": {
    id: "trouser-8",
    name: "Siyaram's Classic",
    subtitle: "Classic trouser fabric with elegant finish",
    description: "Premium Siyaram's trouser fabric with classic styling and elegant finish. Trusted brand quality with superior comfort and durability.",
    material: "Siyaram's Premium",
    weight: "270 GSM",
    width: "58 inches",
    care: "Dry clean recommended, gentle machine wash acceptable",
    features: ["Siyaram's quality", "Classic styling", "Elegant finish", "Brand trust", "Superior comfort"],
    colorVariants: trouserColorVariants
  },
  "trouser-9": {
    id: "trouser-9",
    name: "Raymond Trouser Fabric",
    subtitle: "Wrinkle-resistant premium trouser fabric",
    description: "Premium Raymond trouser fabric with advanced wrinkle-resistant technology. Perfect for professional wear with minimal maintenance requirements.",
    material: "Raymond Premium",
    weight: "285 GSM",
    width: "60 inches",
    care: "Machine wash warm, minimal ironing, tumble dry low",
    features: ["Raymond quality", "Wrinkle-resistant", "Professional wear", "Easy care", "Premium finish"],
    colorVariants: trouserColorVariants
  },
  "ethnic-4": {
    id: "ethnic-4",
    name: "Sherwani Fabric",
    subtitle: "Festive unstitched fabric with rich texture",
    description: "Premium sherwani fabric featuring rich texture and festive appeal. Perfect for creating elegant sherwanis for weddings and special occasions.",
    material: "Art Silk",
    weight: "350 GSM",
    width: "44 inches",
    care: "Dry clean only, handle with care, store properly",
    features: ["Rich texture", "Festive elegance", "Wedding wear", "Art silk quality", "Special occasions"],
    colorVariants: ethnicColorVariants
  },
  "ethnic-5": {
    id: "ethnic-5",
    name: "Jodhpuri Fabric",
    subtitle: "Traditional unstitched Jodhpuri fabric",
    description: "Authentic Jodhpuri fabric with traditional styling and modern finish. Perfect for creating classic Jodhpuri suits with contemporary appeal.",
    material: "Art Silk / Polyester",
    weight: "320 GSM",
    width: "58 inches",
    care: "Dry clean recommended, professional tailoring suggested",
    features: ["Traditional styling", "Modern finish", "Jodhpuri classic", "Versatile blend", "Contemporary appeal"],
    colorVariants: ethnicColorVariants
  },
  "ethnic-6": {
    id: "ethnic-6",
    name: "Premium Sherwani Gold",
    subtitle: "Premium sherwani fabric with golden embroidery",
    description: "Luxurious sherwani fabric featuring exquisite golden embroidery work. Designed for premium weddings and grand celebrations with royal elegance.",
    material: "Silk Brocade",
    weight: "380 GSM",
    width: "44 inches",
    care: "Dry clean only, expert handling required, store flat",
    features: ["Golden embroidery", "Royal elegance", "Premium weddings", "Silk brocade", "Luxury finish"],
    colorVariants: ethnicColorVariants
  },
  "ethnic-7": {
    id: "ethnic-7",
    name: "Ethnic Kurta Premium",
    subtitle: "Premium kurta fabric with traditional appeal",
    description: "High-quality kurta fabric combining traditional craftsmanship with modern comfort. Perfect for festive wear and ethnic celebrations.",
    material: "Cotton Silk",
    weight: "200 GSM",
    width: "45 inches",
    care: "Machine wash cold, iron medium heat, hang dry",
    features: ["Traditional craft", "Modern comfort", "Festive wear", "Cotton silk blend", "Ethnic celebrations"],
    colorVariants: ethnicColorVariants
  },
  "ethnic-8": {
    id: "ethnic-8",
    name: "Nehru Jacket Fabric",
    subtitle: "Classic Nehru jacket unstitched fabric",
    description: "Classic Nehru jacket fabric with sophisticated styling. Perfect for creating timeless Nehru jackets that complement both ethnic and Indo-Western wear.",
    material: "Cotton Silk",
    weight: "250 GSM",
    width: "58 inches",
    care: "Dry clean preferred, gentle machine wash acceptable",
    features: ["Classic styling", "Sophisticated finish", "Indo-Western", "Timeless design", "Versatile wear"],
    colorVariants: ethnicColorVariants
  },
  "ethnic-9": {
    id: "ethnic-9",
    name: "Wedding Blazer Fabric",
    subtitle: "Luxury fabric for wedding blazers",
    description: "Premium luxury fabric designed specifically for wedding blazers. Features elegant texture and superior drape for creating statement blazers.",
    material: "Premium Silk",
    weight: "340 GSM",
    width: "58 inches",
    care: "Dry clean only, professional pressing, careful storage",
    features: ["Luxury fabric", "Wedding elegance", "Statement wear", "Premium silk", "Superior drape"],
    colorVariants: ethnicColorVariants
  },
  "ethnic-10": {
    id: "ethnic-10",
    name: "Ethnic Kurta Set Fabric",
    subtitle: "Complete kurta set unstitched fabric",
    description: "Complete kurta set fabric package for creating coordinated ethnic wear. Includes fabric for kurta and complementary bottom wear.",
    material: "Art Silk",
    weight: "180 GSM",
    width: "45 inches",
    care: "Machine wash cold, separate colors, iron reverse side",
    features: ["Complete set", "Coordinated wear", "Art silk quality", "Ethnic styling", "Versatile options"],
    colorVariants: ethnicColorVariants
  }
};

export const getProductDetail = (productId: string): ProductDetail | null => {
  return productDetails[productId] || null;
};