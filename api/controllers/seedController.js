const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  {
    name: 'Past Papers',
    description: 'AKUEB past papers for various subjects and classes',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    order: 1
  },
  {
    name: 'SLOs',
    description: 'Student Learning Outcomes for AKUEB syllabus',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    order: 2
  },
  {
    name: 'Notes',
    description: 'Comprehensive notes for AKUEB curriculum',
    image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&q=80',
    order: 3
  },
  {
    name: 'Bundles',
    description: 'Specially curated bundles of past papers, notes, and SLOs',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    order: 4
  },
  {
    name: 'Deals',
    description: 'Limited time offers and discounted exam preparation materials',
    image: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=800&q=80',
    order: 5
  }
];

const products = [
  {
    title: 'Single Subject Past Paper',
    description: 'Detailed past papers for a single subject, including solved solutions and marking schemes for AKUEB.',
    price: 499,
    stock: 500,
    categoryName: 'Past Papers',
    brand: 'Smart Prep Station',
    images: [{ url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80' }],
    isFeatured: true,
    variants: [
      { name: 'Subject', options: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'] },
      { name: 'Class', options: ['9', '10', '11', '12'] }
    ]
  },
  {
    title: 'Student Learning Outcomes (SLOs)',
    description: 'Complete SLO-based resource guide for AKUEB students to excel in their exams.',
    price: 299,
    stock: 300,
    categoryName: 'SLOs',
    brand: 'Smart Prep Station',
    images: [{ url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80' }],
    isFeatured: true,
    variants: [
      { name: 'Subject', options: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'] },
      { name: 'Class', options: ['9', '10', '11', '12'] }
    ]
  },
  {
    title: 'Comprehensive Notes',
    description: 'High-quality, easy-to-understand notes covering the entire AKUEB syllabus for each subject.',
    price: 799,
    stock: 200,
    categoryName: 'Notes',
    brand: 'Smart Prep Station',
    images: [{ url: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&q=80' }],
    isFeatured: true,
    variants: [
      { name: 'Subject', options: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'] }
    ]
  },
  {
    title: 'All Subjects Past Paper Bundle',
    description: 'A complete bundle of past papers for all compulsory and elective subjects for a specific class.',
    price: 2499,
    originalPrice: 2999,
    stock: 100,
    categoryName: 'Bundles',
    brand: 'Smart Prep Station',
    images: [{ url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80' }],
    isFeatured: true,
    variants: [
      { name: 'Class', options: ['9', '10', '11', '12'] }
    ]
  },
  {
    title: 'Limited Time Deal - Math Booster Pack',
    description: 'Get Past Papers and SLOs for Mathematics at a special discounted price.',
    price: 599,
    originalPrice: 798,
    stock: 150,
    categoryName: 'Deals',
    brand: 'Smart Prep Station',
    images: [{ url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80' }],
    isFeatured: true,
    variants: [
      { name: 'Class', options: ['9', '10', '11', '12'] }
    ]
  }
];

exports.seedDatabase = async (req, res) => {
  const { key } = req.query;
  
  // Basic security check
  if (key !== process.env.SEED_KEY && key !== 'smartprep123') {
    return res.status(401).json({ success: false, message: 'Unauthorized seed attempt' });
  }

  try {
    // Clear existing data (optional, but good for fresh start)
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    // Check if seller exists, if not create
    let seller = await User.findOne({ email: 'simroz.asrany6@gmail.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Simroz Asrany',
        email: 'simroz.asrany6@gmail.com',
        password: 'sohail',
        role: 'seller',
        isActive: true
      });
    }

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    
    // Create category map
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Create products
    const productsWithRefs = products.map(p => ({
      ...p,
      category: categoryMap[p.categoryName],
      seller: seller._id
    }));

    await Product.insertMany(productsWithRefs);

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      categoriesCount: createdCategories.length,
      productsCount: productsWithRefs.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
