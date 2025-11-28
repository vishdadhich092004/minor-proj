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
const Order = require('../model/order');
const Notification = require('../model/notification');

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

  // 1) Categories (images will be added manually)
  const catElectronics = await upsertOne(Category, { name: 'Electronics' }, {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03', // Image to be added manually
  });
  const catFashion = await upsertOne(Category, { name: 'Fashion' }, {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', // Image to be added manually
  });
  const catGroceries = await upsertOne(Category, { name: 'Groceries' }, {
    name: 'Groceries',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d', // Image to be added manually
  });
  const catHome = await upsertOne(Category, { name: 'Home & Kitchen' }, {
    name: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae', // Image to be added manually
  });
  const catBeauty = await upsertOne(Category, { name: 'Beauty & Personal Care' }, {
    name: 'Beauty & Personal Care',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9', // Image to be added manually
  });
  const catSports = await upsertOne(Category, { name: 'Sports & Fitness' }, {
    name: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211', // Image to be added manually
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
  const subHeadphones = await upsertOne(SubCategory, { name: 'Headphones & Audio', categoryId: catElectronics._id }, {
    name: 'Headphones & Audio',
    categoryId: catElectronics._id,
  });
  const subMensWear = await upsertOne(SubCategory, { name: "Men's Wear", categoryId: catFashion._id }, {
    name: "Men's Wear",
    categoryId: catFashion._id,
  });
  const subWomensWear = await upsertOne(SubCategory, { name: "Women's Wear", categoryId: catFashion._id }, {
    name: "Women's Wear",
    categoryId: catFashion._id,
  });
  const subKitchen = await upsertOne(SubCategory, { name: 'Kitchen Essentials', categoryId: catHome._id }, {
    name: 'Kitchen Essentials',
    categoryId: catHome._id,
  });
  const subFurniture = await upsertOne(SubCategory, { name: 'Furniture', categoryId: catHome._id }, {
    name: 'Furniture',
    categoryId: catHome._id,
  });
  const subStaples = await upsertOne(SubCategory, { name: 'Staples', categoryId: catGroceries._id }, {
    name: 'Staples',
    categoryId: catGroceries._id,
  });
  const subSnacks = await upsertOne(SubCategory, { name: 'Snacks & Beverages', categoryId: catGroceries._id }, {
    name: 'Snacks & Beverages',
    categoryId: catGroceries._id,
  });
  const subSkincare = await upsertOne(SubCategory, { name: 'Skincare', categoryId: catBeauty._id }, {
    name: 'Skincare',
    categoryId: catBeauty._id,
  });
  const subFitness = await upsertOne(SubCategory, { name: 'Fitness Equipment', categoryId: catSports._id }, {
    name: 'Fitness Equipment',
    categoryId: catSports._id,
  });

  // 3) Brands
  // Mobile brands
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
  const brandOppo = await upsertOne(Brand, { name: 'Oppo', subcategoryId: subMobiles._id }, {
    name: 'Oppo',
    subcategoryId: subMobiles._id,
  });

  // Laptop brands
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
  const brandAsus = await upsertOne(Brand, { name: 'Asus', subcategoryId: subLaptops._id }, {
    name: 'Asus',
    subcategoryId: subLaptops._id,
  });

  // Audio brands
  const brandBoat = await upsertOne(Brand, { name: 'Boat', subcategoryId: subHeadphones._id }, {
    name: 'Boat',
    subcategoryId: subHeadphones._id,
  });
  const brandJBL = await upsertOne(Brand, { name: 'JBL', subcategoryId: subHeadphones._id }, {
    name: 'JBL',
    subcategoryId: subHeadphones._id,
  });
  const brandSony = await upsertOne(Brand, { name: 'Sony', subcategoryId: subHeadphones._id }, {
    name: 'Sony',
    subcategoryId: subHeadphones._id,
  });

  // Fashion brands
  const brandPeterEngland = await upsertOne(Brand, { name: 'Peter England', subcategoryId: subMensWear._id }, {
    name: 'Peter England',
    subcategoryId: subMensWear._id,
  });
  const brandFabindia = await upsertOne(Brand, { name: 'Fabindia', subcategoryId: subMensWear._id }, {
    name: 'Fabindia',
    subcategoryId: subMensWear._id,
  });
  const brandVanHeusen = await upsertOne(Brand, { name: 'Van Heusen', subcategoryId: subMensWear._id }, {
    name: 'Van Heusen',
    subcategoryId: subMensWear._id,
  });
  const brandAllenSolly = await upsertOne(Brand, { name: 'Allen Solly', subcategoryId: subMensWear._id }, {
    name: 'Allen Solly',
    subcategoryId: subMensWear._id,
  });

  // Kitchen brands
  const brandPrestige = await upsertOne(Brand, { name: 'Prestige', subcategoryId: subKitchen._id }, {
    name: 'Prestige',
    subcategoryId: subKitchen._id,
  });
  const brandHawkins = await upsertOne(Brand, { name: 'Hawkins', subcategoryId: subKitchen._id }, {
    name: 'Hawkins',
    subcategoryId: subKitchen._id,
  });
  const brandMilton = await upsertOne(Brand, { name: 'Milton', subcategoryId: subKitchen._id }, {
    name: 'Milton',
    subcategoryId: subKitchen._id,
  });

  // Grocery brands
  const brandAashirvaad = await upsertOne(Brand, { name: 'Aashirvaad', subcategoryId: subStaples._id }, {
    name: 'Aashirvaad',
    subcategoryId: subStaples._id,
  });
  const brandTata = await upsertOne(Brand, { name: 'Tata', subcategoryId: subStaples._id }, {
    name: 'Tata',
    subcategoryId: subStaples._id,
  });
  const brandLay = await upsertOne(Brand, { name: "Lay's", subcategoryId: subSnacks._id }, {
    name: "Lay's",
    subcategoryId: subSnacks._id,
  });

  // 4) Variant Types and Variants
  const vtColor = await upsertOne(VariantType, { name: 'Color' }, { name: 'Color', type: 'select' });
  const vtSize = await upsertOne(VariantType, { name: 'Size' }, { name: 'Size', type: 'select' });
  const vtStorage = await upsertOne(VariantType, { name: 'Storage' }, { name: 'Storage', type: 'select' });
  const vtRAM = await upsertOne(VariantType, { name: 'RAM' }, { name: 'RAM', type: 'select' });

  // Color variants
  const varBlack = await upsertOne(Variant, { name: 'Black', variantTypeId: vtColor._id }, { name: 'Black', variantTypeId: vtColor._id });
  const varBlue = await upsertOne(Variant, { name: 'Blue', variantTypeId: vtColor._id }, { name: 'Blue', variantTypeId: vtColor._id });
  const varRed = await upsertOne(Variant, { name: 'Red', variantTypeId: vtColor._id }, { name: 'Red', variantTypeId: vtColor._id });
  const varWhite = await upsertOne(Variant, { name: 'White', variantTypeId: vtColor._id }, { name: 'White', variantTypeId: vtColor._id });
  const varGreen = await upsertOne(Variant, { name: 'Green', variantTypeId: vtColor._id }, { name: 'Green', variantTypeId: vtColor._id });
  const varGray = await upsertOne(Variant, { name: 'Gray', variantTypeId: vtColor._id }, { name: 'Gray', variantTypeId: vtColor._id });

  // Size variants
  const varS = await upsertOne(Variant, { name: 'S', variantTypeId: vtSize._id }, { name: 'S', variantTypeId: vtSize._id });
  const varM = await upsertOne(Variant, { name: 'M', variantTypeId: vtSize._id }, { name: 'M', variantTypeId: vtSize._id });
  const varL = await upsertOne(Variant, { name: 'L', variantTypeId: vtSize._id }, { name: 'L', variantTypeId: vtSize._id });
  const varXL = await upsertOne(Variant, { name: 'XL', variantTypeId: vtSize._id }, { name: 'XL', variantTypeId: vtSize._id });

  // Storage variants
  const var64GB = await upsertOne(Variant, { name: '64GB', variantTypeId: vtStorage._id }, { name: '64GB', variantTypeId: vtStorage._id });
  const var128GB = await upsertOne(Variant, { name: '128GB', variantTypeId: vtStorage._id }, { name: '128GB', variantTypeId: vtStorage._id });
  const var256GB = await upsertOne(Variant, { name: '256GB', variantTypeId: vtStorage._id }, { name: '256GB', variantTypeId: vtStorage._id });
  const var512GB = await upsertOne(Variant, { name: '512GB', variantTypeId: vtStorage._id }, { name: '512GB', variantTypeId: vtStorage._id });

  // RAM variants
  const var4GB = await upsertOne(Variant, { name: '4GB', variantTypeId: vtRAM._id }, { name: '4GB', variantTypeId: vtRAM._id });
  const var6GB = await upsertOne(Variant, { name: '6GB', variantTypeId: vtRAM._id }, { name: '6GB', variantTypeId: vtRAM._id });
  const var8GB = await upsertOne(Variant, { name: '8GB', variantTypeId: vtRAM._id }, { name: '8GB', variantTypeId: vtRAM._id });
  const var12GB = await upsertOne(Variant, { name: '12GB', variantTypeId: vtRAM._id }, { name: '12GB', variantTypeId: vtRAM._id });

  // 5) Products (images will be added manually - using empty arrays)
  // Mobile Phones
  const prodRedmiNote13 = await upsertOne(Product, { name: 'Redmi Note 13' }, {
    name: 'Redmi Note 13',
    description: '6GB RAM, 128GB ROM, AMOLED Display, 50MP AI Camera, 5000mAh Battery, Made for India',
    quantity: 100,
    price: 14999,
    offerPrice: 13999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandXiaomi._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlack._id), String(varBlue._id)],
    images: [
      { image: 1, url: "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/g/x/q/-original-imagzrfwvvyqpvps.jpeg" },
      { image: 2, url: "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/g/l/j/-original-imagzrfwkeu2zazh.jpeg" }
    ], // Images to be added manually
  });

  const prodSamsungM35 = await upsertOne(Product, { name: 'Samsung Galaxy M35' }, {
    name: 'Samsung Galaxy M35',
    description: '8GB RAM, 256GB ROM, sAMOLED 120Hz Display, 50MP Triple Camera, 6000mAh Battery, India Model',
    quantity: 80,
    price: 22999,
    offerPrice: 20999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandSamsung._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlack._id), String(varRed._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/41Cg3xysr9L._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/71zFoZAM8gL._SX679_.jpg" },
      { image: 3, url: "https://m.media-amazon.com/images/I/71XIscFoQfL._SX679_.jpg" }
    ], // Images to be added manually
  });

  const prodOnePlusNord = await upsertOne(Product, { name: 'OnePlus Nord CE 3' }, {
    name: 'OnePlus Nord CE 3',
    description: '8GB RAM, 128GB ROM, 80W SUPERVOOC Fast Charging, 50MP Camera, India Variant',
    quantity: 60,
    price: 24999,
    offerPrice: 22999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandOnePlus._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlue._id), String(varBlack._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/41bkMtA7usL._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/51jCor3c-EL._SX679_.jpg" }
    ], // Images to be added manually
  });

  const prodRealme12 = await upsertOne(Product, { name: 'Realme 12 Pro' }, {
    name: 'Realme 12 Pro',
    description: '12GB RAM, 256GB ROM, 120Hz Curved Display, 50MP Sony Camera, 5000mAh Battery',
    quantity: 75,
    price: 27999,
    offerPrice: 25999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandRealme._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlue._id), String(varGreen._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/41jIRLVwCIL.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/31pPg3fr8YL.jpg" }
    ], // Images to be added manually
  });

  const prodVivoV30 = await upsertOne(Product, { name: 'Vivo V30' }, {
    name: 'Vivo V30',
    description: '8GB RAM, 128GB ROM, AMOLED Display, 50MP Selfie Camera, 5000mAh Battery',
    quantity: 65,
    price: 29999,
    offerPrice: 27999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandVivo._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlack._id), String(varBlue._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/51BhGw0B6uL._SX679_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/41Vmnq2FQYL._SX679_.jpg" }
    ], // Images to be added manually
  });

  const prodiPhone15 = await upsertOne(Product, { name: 'iPhone 15' }, {
    name: 'iPhone 15',
    description: '128GB Storage, A16 Bionic Chip, 48MP Main Camera, 6.1-inch Super Retina Display',
    quantity: 40,
    price: 79900,
    offerPrice: 74900,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subMobiles._id,
    proBrandId: brandApple._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlack._id), String(varBlue._id), String(varGreen._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/31Q14qzdoZL._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/61f4dTush1L._SX679_.jpg" }
    ], // Images to be added manually
  });

  // Laptops
  const prodDellInspiron = await upsertOne(Product, { name: 'Dell Inspiron 15' }, {
    name: 'Dell Inspiron 15',
    description: '15.6-inch FHD Display, Intel Core i5, 8GB RAM, 512GB SSD, Windows 11, ideal for students',
    quantity: 50,
    price: 52999,
    offerPrice: 49999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subLaptops._id,
    proBrandId: brandDell._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/71iIEPk5qOL._SX569_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/71T+EOuz41L._SX569_.jpg" }
    ], // Images to be added manually
  });

  const prodHPPavilion = await upsertOne(Product, { name: 'HP Pavilion 14' }, {
    name: 'HP Pavilion 14',
    description: '14-inch FHD Display, AMD Ryzen 5, 16GB RAM, 512GB SSD, Windows 11, Thin and Light',
    quantity: 40,
    price: 64999,
    offerPrice: 61999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subLaptops._id,
    proBrandId: brandHP._id,
    images: [
      { image: 1, url: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08689354_evo_i5.png" },
      { image: 2, url: "https://in-media.apjonlinecdn.com/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/c/0/c08689414_1.png" }
    ], // Images to be added manually
  });

  const prodLenovoIdeaPad = await upsertOne(Product, { name: 'Lenovo IdeaPad 3' }, {
    name: 'Lenovo IdeaPad 3',
    description: '15.6-inch FHD Display, Intel Core i3, 8GB RAM, 256GB SSD, Windows 11',
    quantity: 55,
    price: 39999,
    offerPrice: 36999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subLaptops._id,
    proBrandId: brandLenovo._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/513bplmZ3VL._SY450_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/61NJJEoyHNL._SY450_.jpg" }
    ], // Images to be added manually
  });

  const prodAsusVivoBook = await upsertOne(Product, { name: 'Asus VivoBook 15' }, {
    name: 'Asus VivoBook 15',
    description: '15.6-inch FHD Display, AMD Ryzen 3, 8GB RAM, 512GB SSD, Windows 11',
    quantity: 45,
    price: 44999,
    offerPrice: 41999,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subLaptops._id,
    proBrandId: brandAsus._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/4191S774zwL._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/91bOog4NSVL._SX569_.jpg" }
    ], // Images to be added manually
  });

  // Headphones
  const prodBoatRockerz = await upsertOne(Product, { name: 'Boat Rockerz 450' }, {
    name: 'Boat Rockerz 450',
    description: 'Wireless Bluetooth Headphones, 40mm Drivers, 15 Hours Battery, Fast Charging',
    quantity: 150,
    price: 1999,
    offerPrice: 1499,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subHeadphones._id,
    proBrandId: brandBoat._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlack._id), String(varBlue._id), String(varRed._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/31ztpzzaDSL._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/71pyO5+Dn5L._SY450_.jpg" }
    ], // Images to be added manually
  });

  const prodJBLTune = await upsertOne(Product, { name: 'JBL Tune 510BT' }, {
    name: 'JBL Tune 510BT',
    description: 'Wireless On-Ear Headphones, Pure Bass Sound, 40 Hours Battery, Quick Charge',
    quantity: 120,
    price: 2999,
    offerPrice: 2499,
    proCategoryId: catElectronics._id,
    proSubCategoryId: subHeadphones._id,
    proBrandId: brandJBL._id,
    proVariantTypeId: vtColor._id,
    proVariantId: [String(varBlack._id), String(varBlue._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/31gTzmkKS0S._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/61UJsRPkM-L._SY450_.jpg" }
    ], // Images to be added manually
  });

  // Men's Wear
  const prodPeterEnglandShirt = await upsertOne(Product, { name: 'Peter England Formal Shirt' }, {
    name: 'Peter England Formal Shirt',
    description: 'Cotton formal shirt for office wear, Easy Care, Regular Fit',
    quantity: 200,
    price: 1499,
    offerPrice: 1199,
    proCategoryId: catFashion._id,
    proSubCategoryId: subMensWear._id,
    proBrandId: brandPeterEngland._id,
    proVariantTypeId: vtSize._id,
    proVariantId: [String(varM._id), String(varL._id), String(varXL._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/61bZeIVHrcL._SY741_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/61bZeIVHrcL._SY741_.jpg" }
    ], // Images to be added manually
  });

  const prodFabindiaKurta = await upsertOne(Product, { name: 'Fabindia Cotton Kurta' }, {
    name: 'Fabindia Cotton Kurta',
    description: 'Traditional cotton kurta for festivals and casual wear, Handcrafted',
    quantity: 120,
    price: 1999,
    offerPrice: 1699,
    proCategoryId: catFashion._id,
    proSubCategoryId: subMensWear._id,
    proBrandId: brandFabindia._id,
    proVariantTypeId: vtSize._id,
    proVariantId: [String(varM._id), String(varL._id), String(varXL._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/41QYjnIDRZL._SX679_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/41QYjnIDRZL._SX679_.jpg" }
    ], // Images to be added manually
  });

  const prodVanHeusenTShirt = await upsertOne(Product, { name: 'Van Heusen Polo T-Shirt' }, {
    name: 'Van Heusen Polo T-Shirt',
    description: 'Premium cotton polo t-shirt, Classic fit, Machine washable',
    quantity: 180,
    price: 1299,
    offerPrice: 999,
    proCategoryId: catFashion._id,
    proSubCategoryId: subMensWear._id,
    proBrandId: brandVanHeusen._id,
    proVariantTypeId: vtSize._id,
    proVariantId: [String(varS._id), String(varM._id), String(varL._id), String(varXL._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/51c1nV5z-OL._SY741_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/811mrE0EinL._SX569_.jpg" }
    ], // Images to be added manually
  });

  const prodAllenSollyJeans = await upsertOne(Product, { name: 'Allen Solly Slim Fit Jeans' }, {
    name: 'Allen Solly Slim Fit Jeans',
    description: 'Slim fit denim jeans, Stretchable fabric, Comfortable wear',
    quantity: 150,
    price: 2499,
    offerPrice: 1999,
    proCategoryId: catFashion._id,
    proSubCategoryId: subMensWear._id,
    proBrandId: brandAllenSolly._id,
    proVariantTypeId: vtSize._id,
    proVariantId: [String(varM._id), String(varL._id), String(varXL._id)],
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/61Wh7Kivx+L._SY879_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/616-sfRaT7L._SY741_.jpg" }
    ], // Images to be added manually
  });

  // Kitchen Essentials
  const prodPrestigeCooker = await upsertOne(Product, { name: 'Prestige Pressure Cooker 5L' }, {
    name: 'Prestige Pressure Cooker 5L',
    description: 'Popular Indian kitchen essential, 5 litre capacity, Hard Anodized',
    quantity: 120,
    price: 2499,
    offerPrice: 1999,
    proCategoryId: catHome._id,
    proSubCategoryId: subKitchen._id,
    proBrandId: brandPrestige._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/51b3IHLTcdL._SX569_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/61+ZTYn-1TL._SX569_.jpg" }
    ], // Images to be added manually
  });

  const prodHawkinsCooker = await upsertOne(Product, { name: 'Hawkins Classic Pressure Cooker 3L' }, {
    name: 'Hawkins Classic Pressure Cooker 3L',
    description: '3 litre pressure cooker, Stainless steel, Classic design',
    quantity: 100,
    price: 1899,
    offerPrice: 1599,
    proCategoryId: catHome._id,
    proSubCategoryId: subKitchen._id,
    proBrandId: brandHawkins._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/41ZRR8vYFVL._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/71N2HElu+fL._SX679_.jpg" }
    ], // Images to be added manually
  });

  const prodMiltonBottle = await upsertOne(Product, { name: 'Milton Thermosteel Water Bottle 1L' }, {
    name: 'Milton Thermosteel Water Bottle 1L',
    description: '1 litre stainless steel water bottle, Keeps water hot/cold for 24 hours',
    quantity: 200,
    price: 899,
    offerPrice: 699,
    proCategoryId: catHome._id,
    proSubCategoryId: subKitchen._id,
    proBrandId: brandMilton._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/41lTfXSregL._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/61Orgei15+L._SX679_.jpg" }
    ], // Images to be added manually
  });

  // Groceries
  const prodAashirvaadAtta = await upsertOne(Product, { name: 'Aashirvaad Atta 10kg' }, {
    name: 'Aashirvaad Atta 10kg',
    description: 'Whole wheat flour, staple in Indian households, 10kg pack',
    quantity: 300,
    price: 499,
    offerPrice: 449,
    proCategoryId: catGroceries._id,
    proSubCategoryId: subStaples._id,
    proBrandId: brandAashirvaad._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/51zKigKcz6L._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/81csDw35vbL._SX679_.jpg" }
    ], // Images to be added manually
  });

  const prodTataSalt = await upsertOne(Product, { name: 'Tata Salt 1kg' }, {
    name: 'Tata Salt 1kg',
    description: 'Iodized salt, 1kg pack, Essential kitchen ingredient',
    quantity: 500,
    price: 25,
    offerPrice: 22,
    proCategoryId: catGroceries._id,
    proSubCategoryId: subStaples._id,
    proBrandId: brandTata._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/51NSsXLT1KL._SY300_SX300_QL70_FMwebp_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/519NbkBj-eL.jpg" }
    ], // Images to be added manually
  });

  const prodLaysChips = await upsertOne(Product, { name: "Lay's Classic Salted Chips 200g" }, {
    name: "Lay's Classic Salted Chips 200g",
    description: 'Classic salted potato chips, 200g pack, Perfect snack',
    quantity: 400,
    price: 45,
    offerPrice: 38,
    proCategoryId: catGroceries._id,
    proSubCategoryId: subSnacks._id,
    proBrandId: brandLay._id,
    images: [
      { image: 1, url: "https://m.media-amazon.com/images/I/71axGdrNHoL._SX679_.jpg" },
      { image: 2, url: "https://m.media-amazon.com/images/I/711hcR3q8gL._SX679_.jpg" }
    ], // Images to be added manually
  });

  // 6) Posters (banners - images to be added manually)
  await upsertOne(Poster, { posterName: 'Big Billion Days' }, {
    posterName: 'Big Billion Days',
    imageUrl: 'https://img-cdn.publive.online/fit-in/640x360/filters:format(webp)/buzzincontent-1/media/media_files/2025/10/19/flipkart-big-billion-days-2025-10-19-23-32-55.png', // Image to be added manually
  });
  await upsertOne(Poster, { posterName: 'Festive Offers' }, {
    posterName: 'Festive Offers',
    imageUrl: 'https://i.pinimg.com/736x/90/19/42/901942b1f88572edafc28863138664bf.jpg', // Image to be added manually
  });
  await upsertOne(Poster, { posterName: 'Summer Sale' }, {
    posterName: 'Summer Sale',
    imageUrl: 'https://media.istockphoto.com/id/1481822038/vector/summer-sale-podium-display-on-yellow-background-eps-10-vector-illustration.jpg?s=612x612&w=0&k=20&c=ChJ4Vbd_17lV854aZGuKrtGimyerugUaXyZ1-qYiWsY=', // Image to be added manually
  });
  await upsertOne(Poster, { posterName: 'New Arrivals' }, {
    posterName: 'New Arrivals',
    imageUrl: 'https://media.istockphoto.com/id/1366258243/vector/vector-illustration-new-arrival-label-modern-web-banner-on-yellow-background.jpg?s=612x612&w=0&k=20&c=ddLMrtth5QRoW-jJe8_ozTWmvRejIFlq3cv4BAIq_HQ=', // Image to be added manually
  });

  // 7) Coupons
  const endDate1 = new Date();
  endDate1.setDate(endDate1.getDate() + 60);
  await upsertOne(Coupon, { couponCode: 'INDIA10' }, {
    couponCode: 'INDIA10',
    discountType: 'percentage',
    discountAmount: 10,
    minimumPurchaseAmount: 1000,
    endDate: endDate1,
    status: 'active',
  });

  const endDate2 = new Date();
  endDate2.setDate(endDate2.getDate() + 90);
  await upsertOne(Coupon, { couponCode: 'WELCOME20' }, {
    couponCode: 'WELCOME20',
    discountType: 'percentage',
    discountAmount: 20,
    minimumPurchaseAmount: 2000,
    endDate: endDate2,
    status: 'active',
  });

  const endDate3 = new Date();
  endDate3.setDate(endDate3.getDate() + 30);
  await upsertOne(Coupon, { couponCode: 'FLAT500' }, {
    couponCode: 'FLAT500',
    discountType: 'fixed',
    discountAmount: 500,
    minimumPurchaseAmount: 3000,
    endDate: endDate3,
    status: 'active',
  });

  const endDate4 = new Date();
  endDate4.setDate(endDate4.getDate() + 45);
  await upsertOne(Coupon, { couponCode: 'ELECTRONICS15' }, {
    couponCode: 'ELECTRONICS15',
    discountType: 'percentage',
    discountAmount: 15,
    minimumPurchaseAmount: 5000,
    endDate: endDate4,
    status: 'active',
    applicableCategory: catElectronics._id,
  });

  // 8) Users
  const user1 = await upsertOne(User, { email: 'user@iiitranchi.ac.in' }, {
    name: 'Team IIIT User',
    email: 'user@iiitranchi.ac.in',
    password: 'password123',
    role: 'user',
  });

  const adminUser = await upsertOne(User, { email: 'admin@iiitranchi.ac.in' }, {
    name: 'Team IIIT Admin',
    email: 'admin@iiitranchi.ac.in',
    password: 'admin123',
    role: 'admin',
  });

  const testUser = await upsertOne(User, { email: 'test@example.com' }, {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
    role: 'user',
  });

  // 9) Sample Orders
  const orderDate1 = new Date();
  orderDate1.setDate(orderDate1.getDate() - 5);
  await upsertOne(Order, { 
    userID: user1._id,
    'items.productID': prodRedmiNote13._id,
    orderDate: orderDate1
  }, {
    userID: user1._id,
    orderDate: orderDate1,
    orderStatus: 'delivered',
    items: [
      {
        productID: prodRedmiNote13._id,
        productName: 'Redmi Note 13',
        quantity: 1,
        price: 13999,
        variant: 'Black',
      }
    ],
    totalPrice: 13999,
    shippingAddress: {
      phone: '9876543210',
      street: '123 Main Street',
      city: 'Ranchi',
      state: 'Jharkhand',
      postalCode: '834001',
      country: 'India'
    },
    paymentMethod: 'prepaid',
    orderTotal: {
      subtotal: 13999,
      discount: 0,
      total: 13999
    },
    trackingUrl: 'https://tracking.example.com/order123'
  });

  const orderDate2 = new Date();
  orderDate2.setDate(orderDate2.getDate() - 3);
  await upsertOne(Order, { 
    userID: user1._id,
    'items.productID': prodBoatRockerz._id,
    orderDate: orderDate2
  }, {
    userID: user1._id,
    orderDate: orderDate2,
    orderStatus: 'shipped',
    items: [
      {
        productID: prodBoatRockerz._id,
        productName: 'Boat Rockerz 450',
        quantity: 2,
        price: 1499,
        variant: 'Blue',
      }
    ],
    totalPrice: 2998,
    shippingAddress: {
      phone: '9876543210',
      street: '123 Main Street',
      city: 'Ranchi',
      state: 'Jharkhand',
      postalCode: '834001',
      country: 'India'
    },
    paymentMethod: 'prepaid',
    orderTotal: {
      subtotal: 2998,
      discount: 0,
      total: 2998
    },
    trackingUrl: 'https://tracking.example.com/order124'
  });

  const orderDate3 = new Date();
  orderDate3.setDate(orderDate3.getDate() - 1);
  await upsertOne(Order, { 
    userID: testUser._id,
    'items.productID': prodDellInspiron._id,
    orderDate: orderDate3
  }, {
    userID: testUser._id,
    orderDate: orderDate3,
    orderStatus: 'processing',
    items: [
      {
        productID: prodDellInspiron._id,
        productName: 'Dell Inspiron 15',
        quantity: 1,
        price: 49999,
        variant: null,
      }
    ],
    totalPrice: 49999,
    shippingAddress: {
      phone: '9876543211',
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India'
    },
    paymentMethod: 'prepaid',
    orderTotal: {
      subtotal: 49999,
      discount: 0,
      total: 49999
    }
  });

  // 10) Notifications
  await upsertOne(Notification, { notificationId: 'NOTIF001' }, {
    notificationId: 'NOTIF001',
    title: 'Welcome to Our Store!',
    description: 'Get 10% off on your first order. Use code WELCOME20',
    imageUrl: 'https://img.freepik.com/premium-vector/10-off-rubber-stamp-red-10-off-rubber-grunge-stamp-seal-vector-illustration-vector_140916-45168.jpg?semt=ais_hybrid&w=740&q=80', // Image to be added manually
  });

  await upsertOne(Notification, { notificationId: 'NOTIF002' }, {
    notificationId: 'NOTIF002',
    title: 'Big Sale Coming Soon!',
    description: 'Big Billion Days sale starting next week. Stay tuned!',
    imageUrl: 'https://www.shutterstock.com/image-vector/big-sale-coming-soon-promotional-260nw-2675850929.jpg', // Image to be added manually
  });

  await upsertOne(Notification, { notificationId: 'NOTIF003' }, {
    notificationId: 'NOTIF003',
    title: 'New Arrivals',
    description: 'Check out our latest collection of smartphones and laptops',
    imageUrl: 'https://www.shutterstock.com/image-vector/big-sale-coming-soon-promotional-260nw-2675850929.jpg', // Image to be added manually
  });

  await upsertOne(Notification, { notificationId: 'NOTIF004' }, {
    notificationId: 'NOTIF004',
    title: 'Free Delivery',
    description: 'Free delivery on orders above ₹500. Shop now!',
    imageUrl: 'https://www.shutterstock.com/image-vector/free-delivery-service-concept-courier-260nw-2530174257.jpg', // Image to be added manually
  });

  console.log('✅ Seeding completed successfully!');
  console.log('📝 Note: Images need to be added manually for categories, products, posters, and notifications.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (e) => {
  console.error('❌ Error during seeding:', e);
  await mongoose.disconnect();
  process.exit(1);
});
