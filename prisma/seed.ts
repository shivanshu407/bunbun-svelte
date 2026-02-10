import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // --- Categories ---
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'sarees' },
            update: {},
            create: { name: 'Sarees', slug: 'sarees', description: 'Elegant sarees for every occasion', order: 1 }
        }),
        prisma.category.upsert({
            where: { slug: 'silk-sarees' },
            update: {},
            create: { name: 'Silk Sarees', slug: 'silk-sarees', description: 'Premium silk sarees', order: 2, parentId: undefined }
        }),
        prisma.category.upsert({
            where: { slug: 'cotton-sarees' },
            update: {},
            create: { name: 'Cotton Sarees', slug: 'cotton-sarees', description: 'Comfortable cotton sarees', order: 3 }
        }),
        prisma.category.upsert({
            where: { slug: 'blouses' },
            update: {},
            create: { name: 'Blouses', slug: 'blouses', description: 'Ready-made and designer blouses', order: 4 }
        }),
        prisma.category.upsert({
            where: { slug: 'shapewear' },
            update: {},
            create: { name: 'Shapewear', slug: 'shapewear', description: 'Body shaping essentials', order: 5 }
        }),
        prisma.category.upsert({
            where: { slug: 'towels' },
            update: {},
            create: { name: 'Towels', slug: 'towels', description: 'Premium quality towels', order: 6 }
        }),
        prisma.category.upsert({
            where: { slug: 'essentials' },
            update: {},
            create: { name: 'Essentials', slug: 'essentials', description: 'Daily essentials for women', order: 7 }
        }),
    ]);

    const [sarees, silkSarees, cottonSarees, blouses, shapewear, towels, essentials] = categories;

    // Update silk/cotton sarees to be children of sarees
    await prisma.category.update({ where: { slug: 'silk-sarees' }, data: { parentId: sarees.id } });
    await prisma.category.update({ where: { slug: 'cotton-sarees' }, data: { parentId: sarees.id } });

    // --- Products ---
    const products = [
        // SAREES (main category)
        {
            name: 'Banarasi Silk Saree',
            slug: 'banarasi-silk-saree',
            description: 'Exquisite Banarasi silk saree with intricate golden zari work. Perfect for weddings and festive occasions. This handwoven masterpiece features traditional motifs and a rich pallu.',
            shortDescription: 'Handwoven Banarasi silk with golden zari work',
            categoryId: sarees.id,
            basePrice: 8999,
            salePrice: 6999,
            discount: 22,
            fabric: 'Pure Silk',
            isFeatured: true,
            isBestseller: true,
            tags: JSON.stringify(['wedding', 'festive', 'silk', 'zari']),
            images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Banarasi Silk Saree' }],
            variants: [
                { size: 'Free Size', color: 'Red', colorHex: '#DC2626', sku: 'BNR-RED-001', price: 8999, salePrice: 6999, stock: 25 },
                { size: 'Free Size', color: 'Maroon', colorHex: '#7F1D1D', sku: 'BNR-MRN-001', price: 8999, salePrice: 6999, stock: 18 },
                { size: 'Free Size', color: 'Royal Blue', colorHex: '#1D4ED8', sku: 'BNR-BLU-001', price: 8999, salePrice: 6999, stock: 12 },
            ]
        },
        {
            name: 'Chanderi Silk Saree',
            slug: 'chanderi-silk-saree',
            description: 'Lightweight Chanderi silk saree with delicate butis and a sheer texture. Ideal for office wear and casual gatherings.',
            shortDescription: 'Lightweight Chanderi silk with delicate butis',
            categoryId: sarees.id,
            basePrice: 4499,
            salePrice: 3599,
            discount: 20,
            fabric: 'Chanderi Silk',
            isFeatured: true,
            isNewArrival: true,
            tags: JSON.stringify(['office', 'casual', 'lightweight']),
            images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', alt: 'Chanderi Silk Saree' }],
            variants: [
                { size: 'Free Size', color: 'Peach', colorHex: '#FBBF24', sku: 'CHN-PCH-001', price: 4499, salePrice: 3599, stock: 30 },
                { size: 'Free Size', color: 'Mint Green', colorHex: '#34D399', sku: 'CHN-MNT-001', price: 4499, salePrice: 3599, stock: 22 },
            ]
        },
        {
            name: 'Organza Floral Print Saree',
            slug: 'organza-floral-print-saree',
            description: 'Beautiful organza saree with vibrant floral prints. Features a contrasting border and lightweight drape perfect for summer occasions.',
            shortDescription: 'Vibrant floral print on pure organza',
            categoryId: sarees.id,
            basePrice: 3499,
            salePrice: 2499,
            discount: 29,
            fabric: 'Organza',
            isTrending: true,
            tags: JSON.stringify(['floral', 'summer', 'party']),
            images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', alt: 'Organza Floral Saree' }],
            variants: [
                { size: 'Free Size', color: 'White', colorHex: '#FFFFFF', sku: 'ORG-WHT-001', price: 3499, salePrice: 2499, stock: 35 },
                { size: 'Free Size', color: 'Pink', colorHex: '#EC4899', sku: 'ORG-PNK-001', price: 3499, salePrice: 2499, stock: 28 },
                { size: 'Free Size', color: 'Yellow', colorHex: '#EAB308', sku: 'ORG-YLW-001', price: 3499, salePrice: 2499, stock: 20 },
            ]
        },
        // SILK SAREES (sub-category)
        {
            name: 'Kanjivaram Pure Silk Saree',
            slug: 'kanjivaram-pure-silk-saree',
            description: 'Authentic Kanjivaram silk saree handwoven by master artisans of Tamil Nadu. Features traditional temple border and rich contrast pallu.',
            shortDescription: 'Authentic handwoven Kanjivaram from Tamil Nadu',
            categoryId: silkSarees.id,
            basePrice: 15999,
            salePrice: 12999,
            discount: 19,
            fabric: 'Pure Kanjivaram Silk',
            isFeatured: true,
            isBestseller: true,
            tags: JSON.stringify(['kanjivaram', 'wedding', 'bridal', 'premium']),
            images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Kanjivaram Silk Saree' }],
            variants: [
                { size: 'Free Size', color: 'Maroon', colorHex: '#7F1D1D', sku: 'KNJ-MRN-001', price: 15999, salePrice: 12999, stock: 10 },
                { size: 'Free Size', color: 'Green', colorHex: '#15803D', sku: 'KNJ-GRN-001', price: 15999, salePrice: 12999, stock: 8 },
                { size: 'Free Size', color: 'Purple', colorHex: '#7C3AED', sku: 'KNJ-PRP-001', price: 15999, salePrice: 12999, stock: 6 },
            ]
        },
        {
            name: 'Mysore Silk Saree',
            slug: 'mysore-silk-saree',
            description: 'Elegant Mysore silk saree with pure gold zari border. Known for its lustre and durability, this saree is a wardrobe essential.',
            shortDescription: 'GI-tagged Mysore silk with gold zari',
            categoryId: silkSarees.id,
            basePrice: 7999,
            fabric: 'Mysore Silk',
            isTrending: true,
            tags: JSON.stringify(['mysore', 'festive', 'traditional']),
            images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', alt: 'Mysore Silk Saree' }],
            variants: [
                { size: 'Free Size', color: 'Gold', colorHex: '#D97706', sku: 'MYS-GLD-001', price: 7999, stock: 15 },
                { size: 'Free Size', color: 'Navy', colorHex: '#1E3A5F', sku: 'MYS-NVY-001', price: 7999, stock: 12 },
            ]
        },
        // COTTON SAREES
        {
            name: 'Handloom Cotton Saree',
            slug: 'handloom-cotton-saree',
            description: 'Soft handloom cotton saree with traditional weave pattern. Perfect for daily wear and office styling. Breathable and comfortable.',
            shortDescription: 'Soft handloom cotton for everyday elegance',
            categoryId: cottonSarees.id,
            basePrice: 1999,
            salePrice: 1499,
            discount: 25,
            fabric: 'Pure Cotton',
            isBestseller: true,
            tags: JSON.stringify(['cotton', 'daily', 'office', 'handloom']),
            images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', alt: 'Handloom Cotton Saree' }],
            variants: [
                { size: 'Free Size', color: 'Indigo', colorHex: '#3730A3', sku: 'HLC-IND-001', price: 1999, salePrice: 1499, stock: 50 },
                { size: 'Free Size', color: 'Mustard', colorHex: '#CA8A04', sku: 'HLC-MST-001', price: 1999, salePrice: 1499, stock: 40 },
                { size: 'Free Size', color: 'Teal', colorHex: '#0D9488', sku: 'HLC-TEL-001', price: 1999, salePrice: 1499, stock: 35 },
            ]
        },
        {
            name: 'Tant Cotton Saree',
            slug: 'tant-cotton-saree',
            description: 'Traditional Bengali Tant cotton saree with contrasting border. Lightweight, breathable, and perfect for the Indian summer.',
            shortDescription: 'Bengali Tant weave — light and airy',
            categoryId: cottonSarees.id,
            basePrice: 2499,
            fabric: 'Tant Cotton',
            isNewArrival: true,
            tags: JSON.stringify(['tant', 'bengali', 'summer']),
            images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Tant Cotton Saree' }],
            variants: [
                { size: 'Free Size', color: 'White & Red', colorHex: '#EF4444', sku: 'TNT-WR-001', price: 2499, stock: 25 },
                { size: 'Free Size', color: 'Yellow & Green', colorHex: '#84CC16', sku: 'TNT-YG-001', price: 2499, stock: 20 },
            ]
        },
        // BLOUSES
        {
            name: 'Designer Embroidered Blouse',
            slug: 'designer-embroidered-blouse',
            description: 'Heavy embroidered designer blouse with sequin and thread work. Ready-to-wear with padded cups and back hook closure.',
            shortDescription: 'Heavy embroidery with sequin work',
            categoryId: blouses.id,
            basePrice: 2999,
            salePrice: 2299,
            discount: 23,
            fabric: 'Art Silk',
            isFeatured: true,
            isTrending: true,
            tags: JSON.stringify(['designer', 'embroidered', 'party', 'ready-made']),
            images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', alt: 'Embroidered Blouse' }],
            variants: [
                { size: 'S', color: 'Gold', colorHex: '#D97706', sku: 'BLS-GLD-S', price: 2999, salePrice: 2299, stock: 15 },
                { size: 'M', color: 'Gold', colorHex: '#D97706', sku: 'BLS-GLD-M', price: 2999, salePrice: 2299, stock: 20 },
                { size: 'L', color: 'Gold', colorHex: '#D97706', sku: 'BLS-GLD-L', price: 2999, salePrice: 2299, stock: 18 },
                { size: 'XL', color: 'Gold', colorHex: '#D97706', sku: 'BLS-GLD-XL', price: 2999, salePrice: 2299, stock: 10 },
            ]
        },
        {
            name: 'Cotton Readymade Blouse',
            slug: 'cotton-readymade-blouse',
            description: 'Comfortable cotton readymade blouse with boat neck design. Available in multiple colors to match your saree collection.',
            shortDescription: 'Boat neck cotton blouse — everyday comfort',
            categoryId: blouses.id,
            basePrice: 799,
            salePrice: 599,
            discount: 25,
            fabric: 'Cotton',
            isBestseller: true,
            tags: JSON.stringify(['cotton', 'readymade', 'daily']),
            images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', alt: 'Cotton Blouse' }],
            variants: [
                { size: 'S', color: 'Black', colorHex: '#000000', sku: 'CBL-BLK-S', price: 799, salePrice: 599, stock: 40 },
                { size: 'M', color: 'Black', colorHex: '#000000', sku: 'CBL-BLK-M', price: 799, salePrice: 599, stock: 45 },
                { size: 'L', color: 'Black', colorHex: '#000000', sku: 'CBL-BLK-L', price: 799, salePrice: 599, stock: 35 },
                { size: 'S', color: 'Maroon', colorHex: '#7F1D1D', sku: 'CBL-MRN-S', price: 799, salePrice: 599, stock: 30 },
                { size: 'M', color: 'Maroon', colorHex: '#7F1D1D', sku: 'CBL-MRN-M', price: 799, salePrice: 599, stock: 38 },
                { size: 'L', color: 'Maroon', colorHex: '#7F1D1D', sku: 'CBL-MRN-L', price: 799, salePrice: 599, stock: 28 },
            ]
        },
        {
            name: 'Silk Padded Blouse',
            slug: 'silk-padded-blouse',
            description: 'Premium silk padded blouse with princess cut for a flattering fit. Features elbow-length sleeves and round neck.',
            shortDescription: 'Princess cut silk with padding',
            categoryId: blouses.id,
            basePrice: 1499,
            fabric: 'Raw Silk',
            isNewArrival: true,
            tags: JSON.stringify(['silk', 'padded', 'premium']),
            images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Silk Padded Blouse' }],
            variants: [
                { size: 'S', color: 'Red', colorHex: '#DC2626', sku: 'SPB-RED-S', price: 1499, stock: 20 },
                { size: 'M', color: 'Red', colorHex: '#DC2626', sku: 'SPB-RED-M', price: 1499, stock: 25 },
                { size: 'L', color: 'Red', colorHex: '#DC2626', sku: 'SPB-RED-L', price: 1499, stock: 15 },
            ]
        },
        // SHAPEWEAR
        {
            name: 'Saree Shapewear Petticoat',
            slug: 'saree-shapewear-petticoat',
            description: 'High-waist saree shapewear petticoat that smooths your silhouette and provides excellent tummy control. Seamless design prevents show-through.',
            shortDescription: 'Tummy control shapewear petticoat',
            categoryId: shapewear.id,
            basePrice: 1299,
            salePrice: 999,
            discount: 23,
            fabric: 'Nylon Spandex',
            isFeatured: true,
            isBestseller: true,
            tags: JSON.stringify(['shapewear', 'petticoat', 'tummy-control']),
            images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', alt: 'Shapewear Petticoat' }],
            variants: [
                { size: 'S', color: 'Nude', colorHex: '#D2B48C', sku: 'SHP-NDE-S', price: 1299, salePrice: 999, stock: 30 },
                { size: 'M', color: 'Nude', colorHex: '#D2B48C', sku: 'SHP-NDE-M', price: 1299, salePrice: 999, stock: 40 },
                { size: 'L', color: 'Nude', colorHex: '#D2B48C', sku: 'SHP-NDE-L', price: 1299, salePrice: 999, stock: 35 },
                { size: 'XL', color: 'Nude', colorHex: '#D2B48C', sku: 'SHP-NDE-XL', price: 1299, salePrice: 999, stock: 25 },
                { size: 'M', color: 'Black', colorHex: '#000000', sku: 'SHP-BLK-M', price: 1299, salePrice: 999, stock: 30 },
                { size: 'L', color: 'Black', colorHex: '#000000', sku: 'SHP-BLK-L', price: 1299, salePrice: 999, stock: 25 },
            ]
        },
        {
            name: 'Full Body Shaper',
            slug: 'full-body-shaper',
            description: 'Full body shapewear with adjustable straps. Provides all-around compression for a smooth look under any outfit.',
            shortDescription: 'Full body compression shaper',
            categoryId: shapewear.id,
            basePrice: 1799,
            salePrice: 1399,
            discount: 22,
            fabric: 'Nylon Elastane',
            isTrending: true,
            tags: JSON.stringify(['shapewear', 'full-body', 'slimming']),
            images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', alt: 'Full Body Shaper' }],
            variants: [
                { size: 'S', color: 'Black', colorHex: '#000000', sku: 'FBS-BLK-S', price: 1799, salePrice: 1399, stock: 20 },
                { size: 'M', color: 'Black', colorHex: '#000000', sku: 'FBS-BLK-M', price: 1799, salePrice: 1399, stock: 30 },
                { size: 'L', color: 'Black', colorHex: '#000000', sku: 'FBS-BLK-L', price: 1799, salePrice: 1399, stock: 25 },
                { size: 'XL', color: 'Black', colorHex: '#000000', sku: 'FBS-BLK-XL', price: 1799, salePrice: 1399, stock: 15 },
            ]
        },
        {
            name: 'Waist Cincher Belt',
            slug: 'waist-cincher-belt',
            description: 'Adjustable waist cincher belt for instant waist reduction. Features steel bone support and breathable mesh panels.',
            shortDescription: 'Steel-boned waist cincher',
            categoryId: shapewear.id,
            basePrice: 899,
            fabric: 'Latex + Cotton',
            isNewArrival: true,
            tags: JSON.stringify(['waist', 'cincher', 'belt']),
            images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Waist Cincher' }],
            variants: [
                { size: 'S', color: 'Beige', colorHex: '#D2B48C', sku: 'WCB-BGE-S', price: 899, stock: 25 },
                { size: 'M', color: 'Beige', colorHex: '#D2B48C', sku: 'WCB-BGE-M', price: 899, stock: 35 },
                { size: 'L', color: 'Beige', colorHex: '#D2B48C', sku: 'WCB-BGE-L', price: 899, stock: 30 },
            ]
        },
        // TOWELS
        {
            name: 'Premium Bath Towel Set',
            slug: 'premium-bath-towel-set',
            description: 'Set of 2 ultra-soft premium bath towels made from 100% combed cotton. Highly absorbent with a plush feel. GSM 550.',
            shortDescription: 'Set of 2 — 550 GSM combed cotton',
            categoryId: towels.id,
            basePrice: 1499,
            salePrice: 1199,
            discount: 20,
            fabric: '100% Combed Cotton',
            isFeatured: true,
            isBestseller: true,
            tags: JSON.stringify(['bath', 'premium', 'cotton', 'set']),
            images: [{ url: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=600', alt: 'Premium Bath Towel' }],
            variants: [
                { size: 'Bath (30x60)', color: 'White', colorHex: '#FFFFFF', sku: 'BTW-WHT-001', price: 1499, salePrice: 1199, stock: 50 },
                { size: 'Bath (30x60)', color: 'Grey', colorHex: '#6B7280', sku: 'BTW-GRY-001', price: 1499, salePrice: 1199, stock: 40 },
                { size: 'Bath (30x60)', color: 'Navy', colorHex: '#1E3A5F', sku: 'BTW-NVY-001', price: 1499, salePrice: 1199, stock: 35 },
            ]
        },
        {
            name: 'Quick Dry Hand Towel',
            slug: 'quick-dry-hand-towel',
            description: 'Quick dry microfiber hand towel with antibacterial properties. Compact and lightweight — perfect for travel.',
            shortDescription: 'Microfiber quick-dry hand towel',
            categoryId: towels.id,
            basePrice: 399,
            salePrice: 299,
            discount: 25,
            fabric: 'Microfiber',
            tags: JSON.stringify(['hand', 'quick-dry', 'travel']),
            images: [{ url: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=600', alt: 'Hand Towel' }],
            variants: [
                { size: 'Hand (16x28)', color: 'Coral', colorHex: '#F97316', sku: 'HT-CRL-001', price: 399, salePrice: 299, stock: 60 },
                { size: 'Hand (16x28)', color: 'Teal', colorHex: '#0D9488', sku: 'HT-TEL-001', price: 399, salePrice: 299, stock: 55 },
                { size: 'Hand (16x28)', color: 'Lavender', colorHex: '#A78BFA', sku: 'HT-LVD-001', price: 399, salePrice: 299, stock: 45 },
            ]
        },
        {
            name: 'Turkish Cotton Face Towel Set',
            slug: 'turkish-cotton-face-towel-set',
            description: 'Set of 4 Turkish cotton face towels. Super soft, highly absorbent, and long-lasting. Perfect for daily skincare routines.',
            shortDescription: 'Set of 4 Turkish cotton face towels',
            categoryId: towels.id,
            basePrice: 699,
            fabric: 'Turkish Cotton',
            isNewArrival: true,
            tags: JSON.stringify(['face', 'turkish', 'set']),
            images: [{ url: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=600', alt: 'Face Towel Set' }],
            variants: [
                { size: 'Face (12x12)', color: 'Pastel Mix', colorHex: '#FBCFE8', sku: 'FT-PST-001', price: 699, stock: 40 },
                { size: 'Face (12x12)', color: 'Neutral Mix', colorHex: '#D6D3D1', sku: 'FT-NTR-001', price: 699, stock: 35 },
            ]
        },
        // ESSENTIALS
        {
            name: 'Saree Fall (Stitched)',
            slug: 'saree-fall-stitched',
            description: 'Pre-stitched saree fall for easy application. Provides weight to the saree for better draping and prevents wear on the border.',
            shortDescription: 'Pre-stitched saree fall — easy to apply',
            categoryId: essentials.id,
            basePrice: 199,
            salePrice: 149,
            discount: 25,
            fabric: 'Cotton Blend',
            isBestseller: true,
            tags: JSON.stringify(['saree-fall', 'stitched', 'essential']),
            images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', alt: 'Saree Fall' }],
            variants: [
                { size: 'Standard', color: 'White', colorHex: '#FFFFFF', sku: 'SF-WHT-001', price: 199, salePrice: 149, stock: 100 },
                { size: 'Standard', color: 'Beige', colorHex: '#D2B48C', sku: 'SF-BGE-001', price: 199, salePrice: 149, stock: 80 },
            ]
        },
        {
            name: 'Saree Pins (Pack of 12)',
            slug: 'saree-pins-pack-12',
            description: 'Decorative saree pins with stone work. Pack of 12 pins in assorted designs. Secure hold without damaging fabric.',
            shortDescription: 'Pack of 12 decorative saree pins',
            categoryId: essentials.id,
            basePrice: 299,
            salePrice: 199,
            discount: 33,
            tags: JSON.stringify(['pins', 'accessories', 'saree']),
            images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Saree Pins' }],
            variants: [
                { size: 'Pack of 12', color: 'Gold', colorHex: '#D97706', sku: 'SP-GLD-001', price: 299, salePrice: 199, stock: 75 },
                { size: 'Pack of 12', color: 'Silver', colorHex: '#9CA3AF', sku: 'SP-SLV-001', price: 299, salePrice: 199, stock: 60 },
            ]
        },
        {
            name: 'Cotton Petticoat',
            slug: 'cotton-petticoat',
            description: 'Pure cotton petticoat with drawstring waist. Essential undergarment for saree draping. Available in all popular colors.',
            shortDescription: 'Pure cotton drawstring petticoat',
            categoryId: essentials.id,
            basePrice: 499,
            salePrice: 399,
            discount: 20,
            fabric: 'Pure Cotton',
            isBestseller: true,
            isFeatured: true,
            tags: JSON.stringify(['petticoat', 'cotton', 'essential']),
            images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', alt: 'Cotton Petticoat' }],
            variants: [
                { size: 'Free Size', color: 'White', colorHex: '#FFFFFF', sku: 'CP-WHT-001', price: 499, salePrice: 399, stock: 60 },
                { size: 'Free Size', color: 'Red', colorHex: '#DC2626', sku: 'CP-RED-001', price: 499, salePrice: 399, stock: 50 },
                { size: 'Free Size', color: 'Black', colorHex: '#000000', sku: 'CP-BLK-001', price: 499, salePrice: 399, stock: 55 },
                { size: 'Free Size', color: 'Maroon', colorHex: '#7F1D1D', sku: 'CP-MRN-001', price: 499, salePrice: 399, stock: 45 },
            ]
        },
        {
            name: 'Blouse Hooks (Pack of 20)',
            slug: 'blouse-hooks-pack-20',
            description: 'High-quality blouse hooks with eye closure. Rust-resistant and long-lasting. Essential for blouse stitching.',
            shortDescription: 'Pack of 20 rust-resistant hooks',
            categoryId: essentials.id,
            basePrice: 99,
            tags: JSON.stringify(['hooks', 'blouse', 'stitching']),
            images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600', alt: 'Blouse Hooks' }],
            variants: [
                { size: 'Pack of 20', color: 'Silver', colorHex: '#9CA3AF', sku: 'BH-SLV-001', price: 99, stock: 100 },
                { size: 'Pack of 20', color: 'Gold', colorHex: '#D97706', sku: 'BH-GLD-001', price: 99, stock: 80 },
            ]
        },
    ];

    for (const prod of products) {
        const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
        if (existing) {
            console.log(`  ⏭️  Skipping "${prod.name}" (already exists)`);
            continue;
        }

        try {
            const { images, variants, ...productData } = prod;
            const created = await prisma.product.create({
                data: {
                    ...productData,
                    images: { create: images.map((img, i) => ({ ...img, order: i })) },
                    variants: { create: variants },
                }
            });
            console.log(`  ✅ Created "${created.name}"`);
        } catch (e: any) {
            console.log(`  ⚠️  Error creating "${prod.name}": ${e.message?.slice(0, 80)}`);
        }
    }

    console.log('\n🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
