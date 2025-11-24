/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('../model/category');
const SubCategory = require('../model/subCategory');
const Brand = require('../model/brand');
const VariantType = require('../model/variantType');
const Variant = require('../model/variant');
const Product = require('../model/product');
const Poster = require('../model/poster');
const Coupon = require('../model/couponCode');
const User = require('../model/user');

const MONGO_URL = process.env.MONGO_URL;

async function upsertOne(Model, where, data) {
  const existing = await Model.findOne(where);
  if (existing) return existing;
  const created = await Model.create(data);
  return created;
}

async function run() {
  if (!MONGO_URL) {
    console.error('MONGO_URL is not set in .env');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');

  // 1) Categories (with Indian-centric choices)
  const catElectronics = await upsertOne(Category, { name: 'Electronics' }, {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  });
  const catFashion = await upsertOne(Category, { name: 'Fashion' }, {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b09c3a?auto=format&fit=crop&w=1200&q=80',
  });
  const catGroceries = await upsertOne(Category, { name: 'Groceries' }, {
    name: 'Groceries',
    image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1200&q=80',
  });
  const catHome = await upsertOne(Category, { name: 'Home & Kitchen' }, {
    name: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
  });

  // 2) Subcategories
  const subMobiles = await upsertOne(SubCategory, { name: 'Mobiles', categoryId: catElectronics._id }, {
    name: 'Mobiles',
    categoryId: catElectronics._id,
  });
  const subLaptops = await upsertOne(SubCategory, { name: 'Laptops', categoryId: catElectronics._id }, {
    name: 'Laptops',
    categoryId: catElectronics._id,
  });
  const subMensWear = await upsertOne(SubCategory, { name: "Men's Wear", categoryId: catFashion._id }, {
    name: "Men's Wear",
    categoryId: catFashion._id,
  });
  const subKitchen = await upsertOne(SubCategory, { name: 'Kitchen Essentials', categoryId: catHome._id }, {
    name: 'Kitchen Essentials',
    categoryId: catHome._id,
  });
  const subStaples = await upsertOne(SubCategory, { name: 'Staples', categoryId: catGroceries._id }, {
    name: 'Staples',
    categoryId: catGroceries._id,
  });

  // 3) Brands (popular in India)
  const brandXiaomi = await upsertOne(Brand, { name: 'Xiaomi', subcategoryId: subMobiles._id }, {
    name: 'Xiaomi',
    subcategoryId: subMobiles._id,
  });
  const brandSamsung = await upsertOne(Brand, { name: 'Samsung', subcategoryId: subMobiles._id }, {
    name: 'Samsung',
    subcategoryId: subMobiles._id,
  });
  const brandOnePlus = await upsertOne(Brand, { name: 'OnePlus', subcategoryId: subMobiles._id }, {
    name: 'OnePlus',
    subcategoryId: subMobiles._id,
  });
  const brandPrestige = await upsertOne(Brand, { name: 'Prestige', subcategoryId: subKitchen._id }, {
    name: 'Prestige',
    subcategoryId: subKitchen._id,
  });
  const brandRealme = await upsertOne(Brand, { name: 'Realme', subcategoryId: subMobiles._id }, {
    name: 'Realme',
    subcategoryId: subMobiles._id,
  });
  const brandVivo = await upsertOne(Brand, { name: 'Vivo', subcategoryId: subMobiles._id }, {
    name: 'Vivo',
    subcategoryId: subMobiles._id,
  });
  const brandApple = await upsertOne(Brand, { name: 'Apple', subcategoryId: subMobiles._id }, {
    name: 'Apple',
    subcategoryId: subMobiles._id,
  });
  const brandDell = await upsertOne(Brand, { name: 'Dell', subcategoryId: subLaptops._id }, {
    name: 'Dell',
    subcategoryId: subLaptops._id,
  });
  const brandHP = await upsertOne(Brand, { name: 'HP', subcategoryId: subLaptops._id }, {
    name: 'HP',
    subcategoryId: subLaptops._id,
  });
  const brandLenovo = await upsertOne(Brand, { name: 'Lenovo', subcategoryId: subLaptops._id }, {
    name: 'Lenovo',
    subcategoryId: subLaptops._id,
  });
  const brandPeterEngland = await upsertOne(Brand, { name: 'Peter England', subcategoryId: subMensWear._id }, {
    name: 'Peter England',
    subcategoryId: subMensWear._id,
  });
  const brandFabindia = await upsertOne(Brand, { name: 'Fabindia', subcategoryId: subMensWear._id }, {
    name: 'Fabindia',
    subcategoryId: subMensWear._id,
  });
  const brandHawkins = await upsertOne(Brand, { name: 'Hawkins', subcategoryId: subKitchen._id }, {
    name: 'Hawkins',
    subcategoryId: subKitchen._id,
  });
  const brandAashirvaad = await upsertOne(Brand, { name: 'Aashirvaad', subcategoryId: subStaples._id }, {
    name: 'Aashirvaad',
    subcategoryId: subStaples._id,
  });

  // 4) Variant Types and Variants
  const vtColor = await upsertOne(VariantType, { name: 'Color' }, { name: 'Color', type: 'select' });
  const vtSize = await upsertOne(VariantType, { name: 'Size' }, { name: 'Size', type: 'select' });

  const varBlack = await upsertOne(Variant, { name: 'Black', variantTypeId: vtColor._id }, { name: 'Black', variantTypeId: vtColor._id });
  const varBlue = await upsertOne(Variant, { name: 'Blue', variantTypeId: vtColor._id }, { name: 'Blue', variantTypeId: vtColor._id });
  const varRed = await upsertOne(Variant, { name: 'Red', variantTypeId: vtColor._id }, { name: 'Red', variantTypeId: vtColor._id });

  // 5) Products (prices in INR, numeric only)
  await upsertOne(Product, { name: 'Redmi Note 13' }, {
    name: 'Redmi Note 13',
    description: '6GB RAM, 128GB ROM, AMOLED Display, Made for India',
    quantity: 100,
    price: 14999,
    offerPrice: 13999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandXiaomi._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlack._id), String(varBlue._id)],
    images: [
      { image: 1, url: 'https://images.unsplash.com/photo-1512499617640-c2f999098c83?auto=format&fit=crop&w=1200&q=80' },
    ],
  });

  await upsertOne(Product, { name: 'Samsung Galaxy M35' }, {
    name: 'Samsung Galaxy M35',
    description: '8GB RAM, 256GB ROM, sAMOLED 120Hz, India Model',
    quantity: 80,
    price: 22999,
    offerPrice: 20999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandSamsung._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlack._id), String(varRed._id)],
    images: [
      { image: 1, url: 'https://images.unsplash.com/photo-1510554310709-fea9a4e95f29?auto=format&fit=crop&w=1200&q=80' },
    ],
  });

  await upsertOne(Product, { name: 'OnePlus Nord CE 3' }, {
    name: 'OnePlus Nord CE 3',
    description: '8GB RAM, 128GB ROM, 80W SUPERVOOC, India Variant',
    quantity: 60,
    price: 24999,
    offerPrice: 22999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandOnePlus._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlue._id), String(varBlack._id)],
    images: [
      { image: 1, url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80' },
    ],
  });

  await upsertOne(Product, { name: 'Prestige Pressure Cooker 5L' }, {
    name: 'Prestige Pressure Cooker 5L',
    description: 'Popular Indian kitchen essential, 5 litre',
    quantity: 120,
    price: 2499,
    offerPrice: 1999,
    proCategoryId: catHome._id,
    proSubCategoryId: subKitchen._id,
    proBrandId: brandPrestige._id,
    images: [
      { image: 1, url: 'https://images.pexels.com/photos/5938/food-kitchen-cooking-pot.jpg?auto=compress&cs=tinysrgb&w=1200' },
    ],
  });

  // Laptops
  await upsertOne(Product, { name: 'Dell Inspiron 15' }, {
    name: 'Dell Inspiron 15',
    description: '15-inch laptop with 8GB RAM, 512GB SSD, ideal for students in India',
    quantity: 50,
    price: 52999,
    offerPrice: 49999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subLaptops._id,
    proBrandId: brandDell._id,
    images: [
      { image: 1, url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
    ],
  });
  await upsertOne(Product, { name: 'HP Pavilion 14' }, {
    name: 'HP Pavilion 14',
    description: '14-inch thin and light, 16GB RAM, 512GB SSD',
    quantity: 40,
    price: 64999,
    offerPrice: 61999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subLaptops._id,
    proBrandId: brandHP._id,
    images: [
      { image: 1, url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80' },
    ],
  });

  // Men's wear
  await upsertOne(Product, { name: 'Peter England Formal Shirt' }, {
    name: 'Peter England Formal Shirt',
    description: 'Cotton formal shirt for office wear',
    quantity: 200,
    price: 1499,
    offerPrice: 1199,
    proCategoryId: catFashion._id,
    proSubCategoryId: subMensWear._id,
    proBrandId: brandPeterEngland._id,
    images: [
      { image: 1, url: 'https://images.unsplash.com/photo-1520975693416-35a2b9200241?auto=format&fit=crop&w=1200&q=80' },
    ],
  });
  await upsertOne(Product, { name: 'Fabindia Kurta' }, {
    name: 'Fabindia Kurta',
    description: 'Traditional cotton kurta for festivals',
    quantity: 120,
    price: 1999,
    offerPrice: 1699,
    proCategoryId: catFashion._id,
    proSubCategoryId: subMensWear._id,
    proBrandId: brandFabindia._id,
    images: [
      { image: 1, url: 'https://images.unsplash.com/photo-1542060748-10c28b62716b?auto=format&fit=crop&w=1200&q=80' },
    ],
  });

  // Groceries
  await upsertOne(Product, { name: 'Aashirvaad Atta 10kg' }, {
    name: 'Aashirvaad Atta 10kg',
    description: 'Whole wheat flour, staple in Indian households',
    quantity: 300,
    price: 499,
    offerPrice: 449,
    proCategoryId: catGroceries._id,
    proSubCategoryId: subStaples._id,
    proBrandId: brandAashirvaad._id,
    images: [
      { image: 1, url: 'https://images.unsplash.com/photo-1586201375761-83865001e31b?auto=format&fit=crop&w=1200&q=80' },
    ],
  });

  // 6) Posters (banners)
  await upsertOne(Poster, { posterName: 'Big Billion Days' }, {
    posterName: 'Big Billion Days',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
  });
  await upsertOne(Poster, { posterName: 'Festive Offers' }, {
    posterName: 'Festive Offers',
    imageUrl: 'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?auto=format&fit=crop&w=1600&q=80',
  });

  // 7) Coupon (site-wide)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 60);
  await upsertOne(Coupon, { couponCode: 'INDIA10' }, {
    couponCode: 'INDIA10',
    discountType: 'percentage',
    discountAmount: 10,
    minimumPurchaseAmount: 1000,
    endDate,
    status: 'active',
  });

  // 8) Users (for client login)
  await upsertOne(User, { email: 'user@iiitranchi.ac.in' }, {
    name: 'Team IIIT User',
    email: 'user@iiitranchi.ac.in',
    password: 'password123',
    role: 'user',
  });
  await upsertOne(User, { email: 'admin@iiitranchi.ac.in' }, {
    name: 'Team IIIT',
    email: 'admin@iiitranchi.ac.in',
    password: 'admin123',
    role: 'admin',
  });

  console.log('Seeding completed.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});


