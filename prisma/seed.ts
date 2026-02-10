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
            where: { slug: 'sarees' },
            update: {},
            create: { name: 'Sarees', slug: 'sarees', description: 'Elegant sarees for every occasion', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' }
        }),
        prisma.category.upsert({
            where: { slug: 'blouses' },
            update: {},
            create: { name: 'Blouses', slug: 'blouses', description: 'Designer blouse pieces', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400' }
        }),
        prisma.category.upsert({
            where: { slug: 'shapewear' },
            update: {},
            create: { name: 'Shapewear', slug: 'shapewear', description: 'Comfortable shapewear for a perfect silhouette' }
        }),
        prisma.category.upsert({
            where: { slug: 'accessories' },
            update: {},
            create: { name: 'Accessories', slug: 'accessories', description: 'Complete your look with our accessories' }
        })
    ]);
    console.log('✅ Categories created:', categories.map(c => c.name).join(', '));

    const [sarees, blouses, shapewear, accessories] = categories;

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

    // Create products
    const products = [
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
            description: 'Lightweight Chanderi cotton silk saree with delicate printed motifs. Ideal for daily wear and office styling. Comfortable and breathable fabric for the Indian climate.',
            shortDescription: 'Lightweight Chanderi with printed motifs',
            basePrice: 1999, salePrice: 1499,
            fabric: 'Cotton Silk', careInstructions: 'Hand wash with mild detergent',
            categoryId: sarees.id,
            isTrending: false, isFeatured: true, isNewArrival: true,
            images: [
                'https://images.unsplash.com/photo-1594387303756-e10b6a483dba?w=800'
            ],
            variants: [
                { sku: 'CCS-PNK-OS', color: 'Pink', colorHex: '#EC4899', price: 1999, salePrice: 1499, stock: 20 },
                { sku: 'CCS-MNT-OS', color: 'Mint Green', colorHex: '#34D399', price: 1999, salePrice: 1499, stock: 12 },
                { sku: 'CCS-LVN-OS', color: 'Lavender', colorHex: '#A78BFA', price: 1999, salePrice: 1499, stock: 18 }
            ]
        },
        {
            name: 'Organza Floral Print Saree',
            slug: 'organza-floral-print-saree',
            description: 'Stunning organza saree with digital floral prints. Lightweight and trendy, perfect for summer parties and casual gatherings.',
            shortDescription: 'Digital floral print on organza',
            basePrice: 2499, salePrice: null,
            fabric: 'Organza', careInstructions: 'Dry clean recommended',
            categoryId: sarees.id,
            isTrending: true, isFeatured: false, isNewArrival: true,
            images: [
                'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
            ],
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
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'
            ],
            variants: [
                { sku: 'KPS-MAR-OS', color: 'Maroon', colorHex: '#991B1B', price: 8999, salePrice: 5999, stock: 5 },
                { sku: 'KPS-TLE-OS', color: 'Teal', colorHex: '#0D9488', price: 8999, salePrice: 5999, stock: 3 }
            ]
        },
        {
            name: 'Designer Embroidered Blouse',
            slug: 'designer-embroidered-blouse',
            description: 'Ready-to-wear designer blouse with hand embroidery and mirror work. Available in multiple sizes.',
            shortDescription: 'Hand-embroidered with mirror work',
            basePrice: 1299, salePrice: 999,
            fabric: 'Art Silk', careInstructions: 'Gentle hand wash',
            categoryId: blouses.id,
            isTrending: false, isFeatured: false, isNewArrival: true,
            images: [
                'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800'
            ],
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
            name: 'Seamless Saree Shapewear',
            slug: 'seamless-saree-shapewear',
            description: 'High-quality seamless shapewear designed specifically for saree draping. Provides a smooth silhouette and comfortable all-day wear.',
            shortDescription: 'Seamless design for perfect saree draping',
            basePrice: 799, salePrice: 599,
            fabric: 'Nylon Spandex', careInstructions: 'Machine wash cold',
            categoryId: shapewear.id,
            isTrending: false, isFeatured: false, isNewArrival: false,
            images: [],
            variants: [
                { sku: 'SSS-NDE-S', size: 'S', color: 'Nude', colorHex: '#D4A574', price: 799, salePrice: 599, stock: 30 },
                { sku: 'SSS-NDE-M', size: 'M', color: 'Nude', colorHex: '#D4A574', price: 799, salePrice: 599, stock: 25 },
                { sku: 'SSS-NDE-L', size: 'L', color: 'Nude', colorHex: '#D4A574', price: 799, salePrice: 599, stock: 20 },
                { sku: 'SSS-BLK-S', size: 'S', color: 'Black', colorHex: '#000000', price: 799, salePrice: 599, stock: 30 },
                { sku: 'SSS-BLK-M', size: 'M', color: 'Black', colorHex: '#000000', price: 799, salePrice: 599, stock: 25 },
                { sku: 'SSS-BLK-L', size: 'L', color: 'Black', colorHex: '#000000', price: 799, salePrice: 599, stock: 20 }
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

    // Create coupons
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

    // Create banners
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
