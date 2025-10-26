import 'module-alias/register';
import connectDB from '@/config/database';
import { Category } from '@/models/Category';

const categories = [
  {
    name: 'Tranh vẽ',
    slug: 'tranh-ve',
    description: 'Các tác phẩm tranh vẽ nghệ thuật, bao gồm tranh sơn dầu, tranh acrylic, tranh màu nước...',
    order: 1,
    isActive: true,
  },
  {
    name: 'Điêu khắc',
    slug: 'dieu-khac',
    description: 'Tác phẩm điêu khắc 3D, bao gồm điêu khắc đá, gỗ, kim loại...',
    order: 2,
    isActive: true,
  },
  {
    name: 'Nhiếp ảnh',
    slug: 'nhiep-anh',
    description: 'Các tác phẩm nhiếp ảnh nghệ thuật, bao gồm ảnh phong cảnh, chân dung, macro...',
    order: 3,
    isActive: true,
  },
  {
    name: 'Đồ trang trí',
    slug: 'do-trang-tri',
    description: 'Các sản phẩm trang trí nội thất, bao gồm bình hoa, tượng trang trí, đèn nghệ thuật...',
    order: 4,
    isActive: true,
  },
  {
    name: 'Thủ công mỹ nghệ',
    slug: 'thu-cong-my-nghe',
    description: 'Các sản phẩm thủ công mỹ nghệ truyền thống và hiện đại',
    order: 5,
    isActive: true,
  },
];

async function seedCategories() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Create categories
    for (const categoryData of categories) {
      await Category.create(categoryData);
      console.log(`✅ Created category: ${categoryData.name}`);
    }

    console.log('\n✨ Categories seeded successfully!');
    console.log(`📊 Total categories: ${categories.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();

