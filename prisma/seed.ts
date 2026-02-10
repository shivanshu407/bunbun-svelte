import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bunbunclothing.com' },
        update: {},
        create: {
            email: 'admin@bunbunclothing.com',
            name: 'Admin',
            passwordHash: adminHash,
            role: 'admin'
        }
    });
    console.log('✅ Admin user created:', admin.email, '(password: admin123)');

    // Create test customer
    const customerHash = await bcrypt.hash('test1234', 10);
    const customer = await prisma.user.upsert({
        where: { email: 'test@customer.com' },
        update: {},
        create: {
            email: 'test@customer.com',
            name: 'Priya Sharma',
            phone: '+919876543210',
            passwordHash: customerHash,
            role: 'customer'
        }
    });
    console.log('✅ Test customer created:', customer.email, '(password: test1234)');

    // Create categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'sarees' }, update: {},
            create: { name: 'Sarees', slug: 'sarees', description: 'Elegant sarees for every occasion', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' }
        }),
        prisma.category.upsert({
            where: { slug: 'blouses' }, update: {},
            create: { name: 'Blouses', slug: 'blouses', description: 'Designer blouse pieces', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400' }
        }),
        prisma.category.upsert({
            where: { slug: 'shapewear' }, update: {},
            create: { name: 'Shapewear', slug: 'shapewear', description: 'Comfortable shapewear for a perfect silhouette' }
        }),
        prisma.category.upsert({
            where: { slug: 'towels' }, update: {},
            create: { name: 'Towels', slug: 'towels', description: 'Premium soft towels for daily use' }
        }),
        prisma.category.upsert({
            where: { slug: 'essentials' }, update: {},
            create: { name: 'Essentials', slug: 'essentials', description: 'Daily wear essentials and basics' }
        })
    ]);
    console.log('✅ Categories created:', categories.map(c => c.name).join(', '));

    const [sarees, blouses, shapewear, towels, essentials] = categories;

    // Create sub-categories for sarees
    await Promise.all([
        prisma.category.upsert({
            where: { slug: 'silk-sarees' }, update: {},
            create: { name: 'Silk Sarees', slug: 'silk-sarees', parentId: sarees.id }
        }),
        prisma.category.upsert({
            where: { slug: 'cotton-sarees' }, update: {},
            create: { name: 'Cotton Sarees', slug: 'cotton-sarees', parentId: sarees.id }
        }),
        prisma.category.upsert({
            where: { slug: 'georgette-sarees' }, update: {},
            create: { name: 'Georgette Sarees', slug: 'georgette-sarees', parentId: sarees.id }
        })
    ]);
    console.log('✅ Sub-categories created');

    // ==================== PRODUCTS ====================
    const products = [
        // ===== SAREES (6) =====
        {
            name: 'Royal Banarasi Silk Saree',
            slug: 'royal-banarasi-silk-saree',
            description: 'Exquisite Banarasi silk saree with traditional zari work. Perfect for weddings and festive occasions. The intricate gold thread weaving adds a royal touch to this timeless piece.',
            shortDescription: 'Handwoven Banarasi silk with gold zari work',
            basePrice: 4999, salePrice: 2999,
            fabric: 'Pure Silk', careInstructions: 'Dry clean only',
            categoryId: sarees.id,
            isTrending: true, isFeatured: true, isNewArrival: false,
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800'
            ],
            variants: [
                { sku: 'RBS-RED-OS', color: 'Red', colorHex: '#DC2626', price: 4999, salePrice: 2999, stock: 15 },
                { sku: 'RBS-GOLD-OS', color: 'Gold', colorHex: '#D97706', price: 4999, salePrice: 2999, stock: 10 },
                { sku: 'RBS-NAVY-OS', color: 'Navy Blue', colorHex: '#1E3A5F', price: 4999, salePrice: 2999, stock: 8 }
            ]
        },
        {
            name: 'Chanderi Cotton Silk Saree',
            slug: 'chanderi-cotton-silk-saree',
            description: 'Lightweight Chanderi cotton silk saree with delicate printed motifs. Ideal for daily wear and office styling.',
            shortDescription: 'Lightweight Chanderi with printed motifs',
            basePrice: 1999, salePrice: 1499,
            fabric: 'Cotton Silk', careInstructions: 'Hand wash with mild detergent',
            categoryId: sarees.id,
            isTrending: false, isFeatured: true, isNewArrival: true,
            images: ['https://images.unsplash.com/photo-1594387303756-e10b6a483dba?w=800'],
            variants: [
                { sku: 'CCS-PNK-OS', color: 'Pink', colorHex: '#EC4899', price: 1999, salePrice: 1499, stock: 20 },
                { sku: 'CCS-MNT-OS', color: 'Mint Green', colorHex: '#34D399', price: 1999, salePrice: 1499, stock: 12 },
                { sku: 'CCS-LVN-OS', color: 'Lavender', colorHex: '#A78BFA', price: 1999, salePrice: 1499, stock: 18 }
            ]
        },
        {
            name: 'Organza Floral Print Saree',
            slug: 'organza-floral-print-saree',
            description: 'Stunning organza saree with digital floral prints. Lightweight and trendy, perfect for summer parties.',
            shortDescription: 'Digital floral print on organza',
            basePrice: 2499, salePrice: null,
            fabric: 'Organza', careInstructions: 'Dry clean recommended',
            categoryId: sarees.id,
            isTrending: true, isFeatured: false, isNewArrival: true,
            images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'],
            variants: [
                { sku: 'OFP-WHT-OS', color: 'White', colorHex: '#FFFFFF', price: 2499, salePrice: null, stock: 25 },
                { sku: 'OFP-PEA-OS', color: 'Peach', colorHex: '#FBBF24', price: 2499, salePrice: null, stock: 15 }
            ]
        },
        {
            name: 'Kanjivaram Pure Silk Saree',
            slug: 'kanjivaram-pure-silk-saree',
            description: 'Traditional Kanjivaram saree crafted with pure mulberry silk. Features an elaborate pallu and contrasting border.',
            shortDescription: 'Traditional Kanjivaram with elaborate pallu',
            basePrice: 8999, salePrice: 5999,
            fabric: 'Pure Mulberry Silk', careInstructions: 'Dry clean only',
            categoryId: sarees.id,
            isTrending: true, isFeatured: true, isNewArrival: false,
            images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
            variants: [
                { sku: 'KPS-MAR-OS', color: 'Maroon', colorHex: '#991B1B', price: 8999, salePrice: 5999, stock: 5 },
                { sku: 'KPS-TLE-OS', color: 'Teal', colorHex: '#0D9488', price: 8999, salePrice: 5999, stock: 3 }
            ]
        },
        {
            name: 'Tussar Silk Handloom Saree',
            slug: 'tussar-silk-handloom-saree',
            description: 'Authentic Tussar silk handloom saree with natural sheen. Handwoven by artisans for a unique texture and drape.',
            shortDescription: 'Handloom Tussar silk with natural sheen',
            basePrice: 3499, salePrice: 2799,
            fabric: 'Tussar Silk', careInstructions: 'Dry clean only',
            categoryId: sarees.id,
            isTrending: false, isFeatured: true, isNewArrival: true,
            images: ['https://images.unsplash.com/photo-1594387303756-e10b6a483dba?w=800'],
            variants: [
                { sku: 'TSH-BGE-OS', color: 'Beige', colorHex: '#D4A574', price: 3499, salePrice: 2799, stock: 10 },
                { sku: 'TSH-OLV-OS', color: 'Olive', colorHex: '#65A30D', price: 3499, salePrice: 2799, stock: 8 }
            ]
        },
        {
            name: 'Georgette Sequin Party Saree',
            slug: 'georgette-sequin-party-saree',
            description: 'Glamorous georgette saree adorned with sequins and shimmer. Perfect for cocktail parties and evening events.',
            shortDescription: 'Sequin embellished georgette for parties',
            basePrice: 3999, salePrice: 2999,
            fabric: 'Georgette', careInstructions: 'Dry clean only',
            categoryId: sarees.id,
            isTrending: true, isFeatured: false, isNewArrival: false,
            images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'],
            variants: [
                { sku: 'GSP-BLK-OS', color: 'Black', colorHex: '#000000', price: 3999, salePrice: 2999, stock: 12 },
                { sku: 'GSP-WIN-OS', color: 'Wine', colorHex: '#7F1D1D', price: 3999, salePrice: 2999, stock: 8 },
                { sku: 'GSP-GLD-OS', color: 'Gold', colorHex: '#CA8A04', price: 3999, salePrice: 2999, stock: 6 }
            ]
        },

        // ===== BLOUSES (3) =====
        {
            name: 'Designer Embroidered Blouse',
            slug: 'designer-embroidered-blouse',
            description: 'Ready-to-wear designer blouse with hand embroidery and mirror work. Available in multiple sizes.',
            shortDescription: 'Hand-embroidered with mirror work',
            basePrice: 1299, salePrice: 999,
            fabric: 'Art Silk', careInstructions: 'Gentle hand wash',
            categoryId: blouses.id,
            isTrending: false, isFeatured: true, isNewArrival: true,
            images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800'],
            variants: [
                { sku: 'DEB-RED-S', size: 'S', color: 'Red', colorHex: '#EF4444', price: 1299, salePrice: 999, stock: 20 },
                { sku: 'DEB-RED-M', size: 'M', color: 'Red', colorHex: '#EF4444', price: 1299, salePrice: 999, stock: 15 },
                { sku: 'DEB-RED-L', size: 'L', color: 'Red', colorHex: '#EF4444', price: 1299, salePrice: 999, stock: 10 },
                { sku: 'DEB-BLK-S', size: 'S', color: 'Black', colorHex: '#000000', price: 1299, salePrice: 999, stock: 18 },
                { sku: 'DEB-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', price: 1299, salePrice: 999, stock: 12 },
                { sku: 'DEB-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', price: 1299, salePrice: 999, stock: 8 }
            ]
        },
        {
            name: 'Cotton Printed Readymade Blouse',
            slug: 'cotton-printed-readymade-blouse',
            description: 'Comfortable cotton blouse with traditional Kalamkari prints. Pairs beautifully with plain sarees and skirts.',
            shortDescription: 'Kalamkari printed cotton blouse',
            basePrice: 799, salePrice: 599,
            fabric: 'Cotton', careInstructions: 'Machine wash cold',
            categoryId: blouses.id,
            isTrending: true, isFeatured: true, isNewArrival: true,
            images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800'],
            variants: [
                { sku: 'CPR-BLU-S', size: 'S', color: 'Blue', colorHex: '#3B82F6', price: 799, salePrice: 599, stock: 25 },
                { sku: 'CPR-BLU-M', size: 'M', color: 'Blue', colorHex: '#3B82F6', price: 799, salePrice: 599, stock: 20 },
                { sku: 'CPR-BLU-L', size: 'L', color: 'Blue', colorHex: '#3B82F6', price: 799, salePrice: 599, stock: 15 },
                { sku: 'CPR-YLW-M', size: 'M', color: 'Yellow', colorHex: '#EAB308', price: 799, salePrice: 599, stock: 18 }
            ]
        },
        {
            name: 'Velvet Padded Party Blouse',
            slug: 'velvet-padded-party-blouse',
            description: 'Luxurious velvet blouse with padded cups and princess cut. Ideal for weddings and festive occasions.',
            shortDescription: 'Velvet princess cut padded blouse',
            basePrice: 1599, salePrice: null,
            fabric: 'Velvet', careInstructions: 'Dry clean only',
            categoryId: blouses.id,
            isTrending: false, isFeatured: true, isNewArrival: false,
            images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800'],
            variants: [
                { sku: 'VPP-MRN-S', size: 'S', color: 'Maroon', colorHex: '#991B1B', price: 1599, salePrice: null, stock: 10 },
                { sku: 'VPP-MRN-M', size: 'M', color: 'Maroon', colorHex: '#991B1B', price: 1599, salePrice: null, stock: 12 },
                { sku: 'VPP-MRN-L', size: 'L', color: 'Maroon', colorHex: '#991B1B', price: 1599, salePrice: null, stock: 8 },
                { sku: 'VPP-GRN-M', size: 'M', color: 'Emerald', colorHex: '#059669', price: 1599, salePrice: null, stock: 10 }
            ]
        },

        // ===== SHAPEWEAR (3) =====
        {
            name: 'Seamless Saree Shapewear',
            slug: 'seamless-saree-shapewear',
            description: 'High-quality seamless shapewear designed specifically for saree draping. Provides a smooth silhouette and comfortable all-day wear.',
            shortDescription: 'Seamless design for perfect saree draping',
            basePrice: 799, salePrice: 599,
            fabric: 'Nylon Spandex', careInstructions: 'Machine wash cold',
            categoryId: shapewear.id,
            isTrending: false, isFeatured: true, isNewArrival: false,
            images: [],
            variants: [
                { sku: 'SSS-NDE-S', size: 'S', color: 'Nude', colorHex: '#D4A574', price: 799, salePrice: 599, stock: 30 },
                { sku: 'SSS-NDE-M', size: 'M', color: 'Nude', colorHex: '#D4A574', price: 799, salePrice: 599, stock: 25 },
                { sku: 'SSS-NDE-L', size: 'L', color: 'Nude', colorHex: '#D4A574', price: 799, salePrice: 599, stock: 20 },
                { sku: 'SSS-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', price: 799, salePrice: 599, stock: 25 },
                { sku: 'SSS-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', price: 799, salePrice: 599, stock: 20 }
            ]
        },
        {
            name: 'Tummy Tucker Shapewear',
            slug: 'tummy-tucker-shapewear',
            description: 'High-waist tummy tucker with firm compression. Smoothens the waistline under sarees, lehengas, and western wear.',
            shortDescription: 'High-waist firm control tummy tucker',
            basePrice: 999, salePrice: 749,
            fabric: 'Nylon Lycra', careInstructions: 'Hand wash cold',
            categoryId: shapewear.id,
            isTrending: true, isFeatured: true, isNewArrival: true,
            images: [],
            variants: [
                { sku: 'TTS-NDE-M', size: 'M', color: 'Nude', colorHex: '#D4A574', price: 999, salePrice: 749, stock: 20 },
                { sku: 'TTS-NDE-L', size: 'L', color: 'Nude', colorHex: '#D4A574', price: 999, salePrice: 749, stock: 18 },
                { sku: 'TTS-NDE-XL', size: 'XL', color: 'Nude', colorHex: '#D4A574', price: 999, salePrice: 749, stock: 15 },
                { sku: 'TTS-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', price: 999, salePrice: 749, stock: 20 }
            ]
        },
        {
            name: 'Full Body Shaper Bodysuit',
            slug: 'full-body-shaper-bodysuit',
            description: 'All-in-one body shaping bodysuit with adjustable straps. Provides seamless support under all types of ethnic and western outfits.',
            shortDescription: 'Full body shaping with adjustable straps',
            basePrice: 1499, salePrice: 1199,
            fabric: 'Nylon Spandex', careInstructions: 'Hand wash, do not bleach',
            categoryId: shapewear.id,
            isTrending: false, isFeatured: false, isNewArrival: true,
            images: [],
            variants: [
                { sku: 'FBS-NDE-S', size: 'S', color: 'Nude', colorHex: '#D4A574', price: 1499, salePrice: 1199, stock: 12 },
                { sku: 'FBS-NDE-M', size: 'M', color: 'Nude', colorHex: '#D4A574', price: 1499, salePrice: 1199, stock: 15 },
                { sku: 'FBS-NDE-L', size: 'L', color: 'Nude', colorHex: '#D4A574', price: 1499, salePrice: 1199, stock: 10 },
                { sku: 'FBS-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', price: 1499, salePrice: 1199, stock: 12 }
            ]
        },

        // ===== TOWELS (3) =====
        {
            name: 'Premium Cotton Bath Towel',
            slug: 'premium-cotton-bath-towel',
            description: 'Ultra-soft 100% combed cotton bath towel with 600 GSM thickness. Highly absorbent and quick-drying.',
            shortDescription: '600 GSM combed cotton bath towel',
            basePrice: 699, salePrice: 499,
            fabric: '100% Combed Cotton', careInstructions: 'Machine wash warm, tumble dry low',
            categoryId: towels.id,
            isTrending: true, isFeatured: true, isNewArrival: false,
            images: [],
            variants: [
                { sku: 'PCT-WHT-OS', color: 'White', colorHex: '#FFFFFF', price: 699, salePrice: 499, stock: 40 },
                { sku: 'PCT-GRY-OS', color: 'Grey', colorHex: '#6B7280', price: 699, salePrice: 499, stock: 35 },
                { sku: 'PCT-NVY-OS', color: 'Navy', colorHex: '#1E3A5F', price: 699, salePrice: 499, stock: 30 },
                { sku: 'PCT-RSE-OS', color: 'Rose', colorHex: '#F43F5E', price: 699, salePrice: 499, stock: 25 }
            ]
        },
        {
            name: 'Bamboo Fiber Hand Towel Set',
            slug: 'bamboo-fiber-hand-towel-set',
            description: 'Set of 4 eco-friendly bamboo fiber hand towels. Naturally antibacterial, ultra-soft, and perfect for sensitive skin.',
            shortDescription: 'Set of 4 antibacterial bamboo hand towels',
            basePrice: 599, salePrice: null,
            fabric: 'Bamboo Fiber', careInstructions: 'Machine wash cold, hang dry',
            categoryId: towels.id,
            isTrending: false, isFeatured: true, isNewArrival: true,
            images: [],
            variants: [
                { sku: 'BFH-PST-OS', color: 'Pastel Mix', colorHex: '#FECDD3', price: 599, salePrice: null, stock: 50 },
                { sku: 'BFH-ERT-OS', color: 'Earthy Mix', colorHex: '#A8A29E', price: 599, salePrice: null, stock: 40 }
            ]
        },
        {
            name: 'Microfiber Quick-Dry Hair Towel',
            slug: 'microfiber-quick-dry-hair-towel',
            description: 'Specially designed microfiber hair towel with button closure. Reduces frizz and drying time by 50%.',
            shortDescription: 'Anti-frizz quick-dry microfiber hair wrap',
            basePrice: 399, salePrice: 299,
            fabric: 'Microfiber', careInstructions: 'Machine wash cold, no fabric softener',
            categoryId: towels.id,
            isTrending: true, isFeatured: false, isNewArrival: true,
            images: [],
            variants: [
                { sku: 'MQD-PNK-OS', color: 'Pink', colorHex: '#EC4899', price: 399, salePrice: 299, stock: 60 },
                { sku: 'MQD-PRP-OS', color: 'Purple', colorHex: '#A855F7', price: 399, salePrice: 299, stock: 45 },
                { sku: 'MQD-BLU-OS', color: 'Sky Blue', colorHex: '#38BDF8', price: 399, salePrice: 299, stock: 50 }
            ]
        },

        // ===== ESSENTIALS (3) =====
        {
            name: 'Cotton Saree Petticoat',
            slug: 'cotton-saree-petticoat',
            description: 'Premium cotton saree petticoat with drawstring waist. Essential for perfect saree draping with comfortable all-day wear.',
            shortDescription: 'Drawstring cotton petticoat',
            basePrice: 399, salePrice: 299,
            fabric: 'Cotton', careInstructions: 'Machine wash cold',
            categoryId: essentials.id,
            isTrending: false, isFeatured: true, isNewArrival: false,
            images: [],
            variants: [
                { sku: 'CSP-WHT-F', size: 'Free Size', color: 'White', colorHex: '#FFFFFF', price: 399, salePrice: 299, stock: 50 },
                { sku: 'CSP-BLK-F', size: 'Free Size', color: 'Black', colorHex: '#000000', price: 399, salePrice: 299, stock: 45 },
                { sku: 'CSP-MRN-F', size: 'Free Size', color: 'Maroon', colorHex: '#991B1B', price: 399, salePrice: 299, stock: 35 },
                { sku: 'CSP-NVY-F', size: 'Free Size', color: 'Navy', colorHex: '#1E3A5F', price: 399, salePrice: 299, stock: 30 }
            ]
        },
        {
            name: 'Saree Pins and Pleating Kit',
            slug: 'saree-pins-pleating-kit',
            description: 'Complete saree draping kit with 12 U-pins, 6 safety pins, and a pleating clip. Must-have for perfect saree styling.',
            shortDescription: 'Complete saree draping accessories kit',
            basePrice: 249, salePrice: null,
            fabric: 'Stainless Steel', careInstructions: 'Keep dry to prevent rust',
            categoryId: essentials.id,
            isTrending: true, isFeatured: false, isNewArrival: true,
            images: [],
            variants: [
                { sku: 'SPK-GLD-OS', color: 'Gold', colorHex: '#CA8A04', price: 249, salePrice: null, stock: 80 },
                { sku: 'SPK-SLV-OS', color: 'Silver', colorHex: '#9CA3AF', price: 249, salePrice: null, stock: 70 }
            ]
        },
        {
            name: 'Inskirt Saree Slip',
            slug: 'inskirt-saree-slip',
            description: 'Satin finish underskirt with adjustable elastic waist. Smooth and anti-static for effortless saree draping.',
            shortDescription: 'Satin finish anti-static saree underskirt',
            basePrice: 499, salePrice: 399,
            fabric: 'Satin', careInstructions: 'Hand wash, hang dry',
            categoryId: essentials.id,
            isTrending: false, isFeatured: true, isNewArrival: true,
            images: [],
            variants: [
                { sku: 'ISS-BLK-F', size: 'Free Size', color: 'Black', colorHex: '#000000', price: 499, salePrice: 399, stock: 35 },
                { sku: 'ISS-NDE-F', size: 'Free Size', color: 'Nude', colorHex: '#D4A574', price: 499, salePrice: 399, stock: 30 },
                { sku: 'ISS-WHT-F', size: 'Free Size', color: 'White', colorHex: '#FFFFFF', price: 499, salePrice: 399, stock: 28 }
            ]
        }
    ];

    for (const p of products) {
        const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
        if (existing) {
            console.log(`  ⏭ Skipping "${p.name}" - already exists`);
            continue;
        }

        const product = await prisma.product.create({
            data: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                shortDescription: p.shortDescription,
                basePrice: p.basePrice,
                salePrice: p.salePrice,
                fabric: p.fabric,
                careInstructions: p.careInstructions,
                categoryId: p.categoryId,
                isTrending: p.isTrending,
                isFeatured: p.isFeatured,
                isNewArrival: p.isNewArrival,
                images: {
                    create: p.images.map((url, i) => ({
                        url,
                        alt: p.name,
                        order: i
                    }))
                },
                variants: {
                    create: p.variants.map((v: any) => ({
                        sku: v.sku,
                        size: v.size ?? null,
                        color: v.color,
                        colorHex: v.colorHex,
                        price: v.price,
                        salePrice: v.salePrice,
                        stock: v.stock
                    }))
                }
            }
        });
        console.log(`  ✅ Created product: ${product.name}`);
    }

    // ==================== COUPONS ====================
    const now = new Date();
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    await Promise.all([
        prisma.coupon.upsert({
            where: { code: 'BUNBUN50' },
            update: {},
            create: {
                code: 'BUNBUN50',
                description: 'Flat 50% off on your first order',
                type: 'percentage',
                value: 50,
                maxDiscount: 500,
                minOrderAmount: 999,
                validFrom: now,
                validTo: oneMonthLater,
                usageLimit: 100
            }
        }),
        prisma.coupon.upsert({
            where: { code: 'FLAT200' },
            update: {},
            create: {
                code: 'FLAT200',
                description: '₹200 off on orders above ₹1500',
                type: 'fixed',
                value: 200,
                minOrderAmount: 1500,
                validFrom: now,
                validTo: oneMonthLater,
                usageLimit: 200
            }
        }),
        prisma.coupon.upsert({
            where: { code: 'SILK20' },
            update: {},
            create: {
                code: 'SILK20',
                description: '20% off on Silk Sarees',
                type: 'percentage',
                value: 20,
                maxDiscount: 1000,
                validFrom: now,
                validTo: oneMonthLater
            }
        })
    ]);
    console.log('✅ Coupons created: BUNBUN50, FLAT200, SILK20');

    // ==================== BANNERS ====================
    await prisma.banner.upsert({
        where: { id: 'banner-main' },
        update: {},
        create: {
            id: 'banner-main',
            title: 'Flat 50% OFF on All Sarees',
            subtitle: 'Use code BUNBUN50 at checkout',
            imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200',
            linkUrl: '/collections/sarees',
            order: 0
        }
    });
    console.log('✅ Banner created');

    console.log('\n🎉 Seed complete!');
    console.log('\n📋 Login credentials:');
    console.log('  Admin : admin@bunbunclothing.com / admin123');
    console.log('  Customer: test@customer.com / test1234');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
