import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = (name) => `https://placehold.co/300x200?text=${encodeURIComponent(name)}`;

const products = [
  // Pain Relief
  {
    name: 'Panadol Extra',
    description: 'Fast-acting pain reliever for headaches, muscle aches, and fever reduction.',
    price: 35,
    stockQuantity: 180,
    imageUrl: img('Panadol Extra'),
    category: 'Pain Relief'
  },
  {
    name: 'Brufen 400mg',
    description: 'Ibuprofen tablets for moderate pain relief and anti-inflammatory support.',
    price: 45,
    stockQuantity: 160,
    imageUrl: img('Brufen 400mg'),
    category: 'Pain Relief'
  },
  {
    name: 'Cataflam 50mg',
    description: 'Diclofenac potassium tablets targeting strong muscle and joint pain.',
    price: 55,
    stockQuantity: 140,
    imageUrl: img('Cataflam 50mg'),
    category: 'Pain Relief'
  },
  {
    name: 'Aspirin Protect',
    description: 'Low-dose aspirin for heart health maintenance and mild pain relief.',
    price: 25,
    stockQuantity: 200,
    imageUrl: img('Aspirin Protect'),
    category: 'Pain Relief'
  },

  // Vitamins & Supplements
  {
    name: 'Vitamin C 1000mg',
    description: 'High-potency vitamin C effervescent tablets to support immunity.',
    price: 120,
    stockQuantity: 150,
    imageUrl: img('Vitamin C 1000mg'),
    category: 'Vitamins & Supplements'
  },
  {
    name: 'Omega-3 Fish Oil',
    description: 'Concentrated omega-3 capsules for heart and brain wellness.',
    price: 180,
    stockQuantity: 110,
    imageUrl: img('Omega-3 Fish Oil'),
    category: 'Vitamins & Supplements'
  },
  {
    name: 'Vitamin D3 5000IU',
    description: 'Maximum-strength vitamin D softgels for bone and immune support.',
    price: 150,
    stockQuantity: 120,
    imageUrl: img('Vitamin D3 5000IU'),
    category: 'Vitamins & Supplements'
  },
  {
    name: 'Zinc Tablets',
    description: 'Essential mineral tablets to aid immunity and skin health.',
    price: 90,
    stockQuantity: 170,
    imageUrl: img('Zinc Tablets'),
    category: 'Vitamins & Supplements'
  },
  {
    name: 'Multivitamin for Men',
    description: 'Daily multivitamin pack formulated for men’s energy and metabolism.',
    price: 220,
    stockQuantity: 130,
    imageUrl: img('Multivitamin for Men'),
    category: 'Vitamins & Supplements'
  },

  // First Aid
  {
    name: 'Digital Thermometer',
    description: 'Quick-read digital thermometer with flexible tip for accurate readings.',
    price: 130,
    stockQuantity: 90,
    imageUrl: img('Digital Thermometer'),
    category: 'First Aid'
  },
  {
    name: 'Medical Bandages (Pack)',
    description: 'Sterile elastic bandages suitable for dressing wounds and sprains.',
    price: 40,
    stockQuantity: 220,
    imageUrl: img('Medical Bandages'),
    category: 'First Aid'
  },
  {
    name: 'Antiseptic Solution (Betadine)',
    description: 'Trusted povidone-iodine solution for cleaning cuts and abrasions.',
    price: 60,
    stockQuantity: 140,
    imageUrl: img('Antiseptic Solution'),
    category: 'First Aid'
  },
  {
    name: 'Medical Face Masks (50 Pack)',
    description: 'Disposable three-layer face masks for everyday protection.',
    price: 100,
    stockQuantity: 180,
    imageUrl: img('Medical Face Masks'),
    category: 'First Aid'
  },

  // Skincare & Personal Care
  {
    name: 'Sunscreen SPF 50',
    description: 'Broad-spectrum sunscreen with hydrating finish and SPF 50.',
    price: 250,
    stockQuantity: 100,
    imageUrl: img('Sunscreen SPF 50'),
    category: 'Skincare & Personal Care'
  },
  {
    name: 'Moisturizing Cream',
    description: 'Daily face and body cream that locks in moisture for 24 hours.',
    price: 180,
    stockQuantity: 120,
    imageUrl: img('Moisturizing Cream'),
    category: 'Skincare & Personal Care'
  },
  {
    name: 'Face Wash (Oily Skin)',
    description: 'Oil-control gel wash that unclogs pores without over-drying.',
    price: 140,
    stockQuantity: 110,
    imageUrl: img('Face Wash Oily Skin'),
    category: 'Skincare & Personal Care'
  },
  {
    name: 'Hand Sanitizer Gel',
    description: 'Quick-dry sanitizer gel enriched with aloe for soft hands.',
    price: 35,
    stockQuantity: 250,
    imageUrl: img('Hand Sanitizer Gel'),
    category: 'Skincare & Personal Care'
  },

  // Baby Care
  {
    name: 'Baby Diapers (Size 3)',
    description: 'Breathable, leak-proof diapers designed for active infants.',
    price: 300,
    stockQuantity: 90,
    imageUrl: img('Baby Diapers Size 3'),
    category: 'Baby Care'
  },
  {
    name: 'Baby Shampoo',
    description: 'Tear-free gentle shampoo infused with chamomile for babies.',
    price: 120,
    stockQuantity: 130,
    imageUrl: img('Baby Shampoo'),
    category: 'Baby Care'
  },
  {
    name: 'Baby Rash Cream',
    description: 'Zinc-oxide diaper rash cream that soothes sensitive skin.',
    price: 85,
    stockQuantity: 150,
    imageUrl: img('Baby Rash Cream'),
    category: 'Baby Care'
  }
];

async function main() {
  console.log('Clearing existing data...');
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();

  console.log('Seeding products...');
  await prisma.product.createMany({ data: products });

  console.log('Seed complete.');

  // Create Admin User
  const adminEmail = 'admin@medconnect.com';
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!adminExists) {
    console.log('Creating admin user...');
    try {
      console.log('Hashing password...');
      const passwordHash = bcrypt.hashSync('admin123', 10);
      console.log('Password hashed. Creating user in DB...');
      await prisma.user.create({
        data: {
          email: adminEmail,
          username: 'Admin',
          passwordHash,
          role: 'ADMIN',
          cart: { create: {} }
        }
      });
      console.log('Admin user created.');
    } catch (err) {
      console.error('Error creating admin user:', err);
    }
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
