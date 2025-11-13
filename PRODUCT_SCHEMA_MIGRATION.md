# Product Schema Migration Guide

## Overview
The new-couture-project now supports the new **variant-based product schema** introduced in the admin panel. This allows products to have multiple color variants with individual prices, images, and stock levels.

## What Changed

### Updated Files
1. **`/src/lib/collectionService.ts`** - Updated Product interface to support variants
2. **`/src/components/ProductCard.tsx`** - Enhanced to display variant-based products
3. **`/src/pages/ProductDetailPage2.tsx`** - Full support for both old and new product structures

## New Product Schema

### Product Interface
```typescript
interface ProductVariant {
  color: string;
  price: number;
  stock: number;
  images: string[];
}

interface Product {
  id: string;
  collectionId: string;
  
  // New variant-based structure
  title?: string;           // Product title (new format)
  variants?: ProductVariant[]; // Array of color variants (new format)
  
  // Old structure (backward compatible)
  name?: string;            // Product name (old format)
  price?: number;           // Price (old format)
  images?: string[];        // Images (old format)
  color?: string;           // Single color (old format)
  
  // Common fields
  description?: string;
  material?: string;
  category?: string;
  // ... other fields
}
```

## Backward Compatibility

### ✅ The system is fully backward compatible

**Old Format Products:**
```json
{
  "id": "prod123",
  "name": "Cotton Fabric",
  "price": 500,
  "color": "Red",
  "images": ["image1.jpg", "image2.jpg"],
  "collectionId": "col123"
}
```
✅ Will continue to work as before

**New Format Products:**
```json
{
  "id": "prod456",
  "title": "Premium Cotton Fabric",
  "variants": [
    {
      "color": "Red",
      "price": 500,
      "stock": 100,
      "images": ["red1.jpg", "red2.jpg"]
    },
    {
      "color": "Blue",
      "price": 550,
      "stock": 80,
      "images": ["blue1.jpg", "blue2.jpg"]
    }
  ],
  "collectionId": "col123"
}
```
✅ Will display with color selection and variant-specific pricing

## UI Changes

### 1. ProductCard Component

**Old Format Display:**
- Shows product name
- Shows single price
- Shows first image

**New Format Display:**
- Shows product title
- Shows price range if variants have different prices (e.g., "₹500 - ₹550")
- Shows single price if all variants have the same price
- Shows first variant's first image
- Displays a badge showing number of colors available (e.g., "3 colors")

### 2. ProductDetailPage2

**Old Format:**
- Displays product name
- Shows single price
- Shows all product images
- Standard "Add to Cart"

**New Format:**
- Displays product title
- Shows current variant's price (changes when color is selected)
- Shows current variant's images (changes when color is selected)
- Color selection grid with:
  - Visual preview of each color
  - Selected state indicator (checkmark)
  - Out of stock indicator
  - Color name label
- "Add to Cart" adds specific color variant to cart

## How Products Are Displayed

### Product Cards (Collection/Home Pages)

| Aspect | Old Format | New Format |
|--------|-----------|------------|
| **Name** | `product.name` | `product.title` or fallback to `product.name` |
| **Price** | `₹500` | `₹500 - ₹550` (range) or `₹500` (same price) |
| **Image** | `product.image` | First variant's first image |
| **Badge** | None | "3 colors" badge if multiple variants |

### Product Detail Page

| Aspect | Old Format | New Format |
|--------|-----------|------------|
| **Title** | `product.name` | `product.title` |
| **Price** | Fixed | Changes based on selected variant |
| **Images** | All product images | Current variant's images |
| **Color Selection** | Not available | Grid of color options with previews |
| **Stock Status** | Product-level | Variant-level (per color) |
| **Cart Item Name** | "Product Name" | "Product Name - Color" |

## Developer Guide

### Checking Product Structure
```typescript
// Check if product uses new variant structure
const hasVariants = !!(product.variants && product.variants.length > 0);

if (hasVariants) {
  // Product uses new structure
  console.log("Product has", product.variants.length, "color variants");
} else {
  // Product uses old structure
  console.log("Product is a legacy single-color product");
}
```

### Getting Product Name
```typescript
// Always use this pattern for safety
const productName = product.title || product.name || 'Untitled Product';
```

### Getting Product Price
```typescript
// For display on product cards
const priceDisplay = hasVariants && product.variants
  ? (() => {
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice === maxPrice 
        ? `₹${minPrice}` 
        : `₹${minPrice} - ₹${maxPrice}`;
    })()
  : `₹${product.price || 0}`;
```

### Getting Product Images
```typescript
// For display image
const displayImage = hasVariants && product.variants
  ? product.variants[0]?.images[0]
  : product.image || product.images?.[0];

// For all images (detail page)
const allImages = hasVariants && currentVariant
  ? currentVariant.images
  : product.images || [product.thumbnail];
```

## Testing Checklist

### Old Format Products
- [ ] Display correctly on collection pages
- [ ] Show correct name and price
- [ ] Images load properly
- [ ] Can add to cart
- [ ] Cart shows correct product info
- [ ] Detail page displays all information

### New Format Products
- [ ] Display correctly on collection pages
- [ ] Show price range when variants have different prices
- [ ] Show single price when all variants have same price
- [ ] Badge shows correct number of colors
- [ ] First variant's image displays
- [ ] Detail page shows color selection grid
- [ ] Selecting a color updates:
  - [ ] Displayed images
  - [ ] Price
  - [ ] Stock status
- [ ] Can add specific color to cart
- [ ] Cart item name includes color (e.g., "Hoodie - Black")
- [ ] Out of stock colors are disabled

### Mixed Environment
- [ ] Both old and new format products display in same collection
- [ ] Searching/filtering works for both formats
- [ ] Cart can contain mix of old and new format products

## Migration Strategy

### Option 1: Gradual Migration (Recommended)
1. Create new products using admin panel with variant structure
2. Keep existing products as-is
3. System handles both formats seamlessly
4. Migrate old products to new format when updating inventory

### Option 2: Bulk Migration
1. Export existing products
2. Transform data to new format
3. Bulk upload with new structure
4. Test thoroughly before deployment

## Example: Adding to Cart

### Old Format
```typescript
{
  id: "prod123",
  name: "Cotton Fabric",
  price: 500,
  image: "image.jpg",
  quantity: 2
}
```

### New Format
```typescript
{
  id: "prod456-Red",  // Includes color variant
  name: "Premium Cotton Fabric - Red",
  price: 500,
  image: "red1.jpg",
  quantity: 2
}
```

## API Compatibility

All existing Firebase queries work for both formats:
- `getProductById()` - Returns product with correct structure
- `getProductsByCollection()` - Returns mix of old and new formats
- `getFeaturedProducts()` - Works with both formats

## Future Enhancements

Potential improvements:
1. Size variants in addition to colors
2. Combined color + size matrix
3. Variant-specific descriptions
4. Bulk price updates for variants
5. Variant performance analytics
6. Quick variant switching on product cards

## Troubleshooting

### Product name shows as "undefined"
**Issue**: Using `product.name` for new format products
**Fix**: Use `product.title || product.name`

### Price shows as "NaN" or "0"
**Issue**: Accessing `product.price` for variant-based products
**Fix**: Use variant's price or implement price calculation logic

### Images not displaying for variants
**Issue**: Using `product.images` for variant-based products
**Fix**: Use `currentVariant.images` or `product.variants[index].images`

### Cart shows wrong color
**Issue**: Not including variant identifier in cart item
**Fix**: Use `${product.id}-${variantColor}` as cart item ID

## Support

For questions or issues:
1. Check this migration guide
2. Review the code in updated components
3. Test with sample products from admin panel
4. Check Firebase Console for data structure

---

**Migration Completed**: November 11, 2025
**Version**: 2.0.0
**Backward Compatible**: Yes ✅
