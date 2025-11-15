import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer tablets (500mg).',
    price: 25.0,
    stockQuantity: 200,
    imageUrl: 'https://via.placeholder.com/300x200?text=Paracetamol'
  },
  {
    name: 'Vitamin C 1000mg',
    description: 'High potency Vitamin C for immune support.',
    price: 120.0,
    stockQuantity: 150,
    imageUrl: 'https://via.placeholder.com/300x200?text=Vitamin+C'
  },
  {
    name: 'Blood Pressure Monitor',
    description: 'Digital arm blood pressure monitor with cuff.',
    price: 950.0,
    stockQuantity: 40,
    imageUrl: 'https://via.placeholder.com/300x200?text=BP+Monitor'
  },
  {
    name: 'Insulin Pen Needles (100 pack)',
    description: 'Sterile single-use insulin pen needles.',
    price: 85.0,
    stockQuantity: 100,
    imageUrl: 'https://via.placeholder.com/300x200?text=Insulin+Needles'
  },
  {
    name: 'Ibuprofen 200mg',
    description: 'NSAID for pain and inflammation relief.',
    price: 45.0,
    stockQuantity: 180,
    imageUrl: 'https://via.placeholder.com/300x200?text=Ibuprofen'
  },
  {
    name: 'Sunscreen SPF 50',
    description: 'Broad-spectrum UVA/UVB protection SPF 50.',
    price: 210.0,
    stockQuantity: 120,
    imageUrl: 'https://via.placeholder.com/300x200?text=Sunscreen+SPF50'
  },
  {
    name: 'Omega-3 Fish Oil',
    description: 'Omega-3 capsules for heart and brain support.',
    price: 180.0,
    stockQuantity: 130,
    imageUrl: 'https://via.placeholder.com/300x200?text=Omega-3'
  },
  {
    name: 'Digital Thermometer',
    description: 'Quick-read digital thermometer for body temperature.',
    price: 130.0,
    stockQuantity: 90,
    imageUrl: 'https://via.placeholder.com/300x200?text=Thermometer'
  },
  {
    name: 'Antacid Chewable Tablets',
    description: 'Fast relief from heartburn and indigestion.',
    price: 65.0,
    stockQuantity: 160,
    imageUrl: 'https://via.placeholder.com/300x200?text=Antacid'
  },
  {
    name: 'Multivitamin Daily',
    description: 'Daily multivitamin for overall wellness.',
    price: 140.0,
    stockQuantity: 140,
    imageUrl: 'https://via.placeholder.com/300x200?text=Multivitamin'
  }
];

async function main() {
  console.log('Seeding products...');
  await prisma.product.createMany({ data: products });
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
