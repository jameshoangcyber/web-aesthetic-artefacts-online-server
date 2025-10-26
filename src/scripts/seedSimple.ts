import 'module-alias/register';
import mongoose from 'mongoose';
import { config } from '@/config/config';
import { User } from '@/models/User';
import { Artist } from '@/models/Artist';
import { Product } from '@/models/Product';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Use plain password - pre-save hook will hash it
    const plainPassword = 'password123';

    // ==================== USERS ====================
    console.log('👥 Creating users...');
    
    // Create users one by one to ensure pre-save hook triggers
    const admin = new User({
      firstName: 'Admin',
      lastName: 'ArtGallery',
      email: 'admin@artgallery.com',
      password: plainPassword,
      role: 'admin',
      phone: '0901234567',
      address: {
        street: '123 Nguyễn Huệ',
        city: 'Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
      },
      isEmailVerified: true,
    });
    await admin.save();

    const user1 = new User({
      firstName: 'Nguyễn',
      lastName: 'Văn An',
      email: 'user1@example.com',
      password: plainPassword,
      role: 'user',
      phone: '0912345678',
      isEmailVerified: true,
    });
    await user1.save();

    const user2 = new User({
      firstName: 'Trần',
      lastName: 'Thị Bình',
      email: 'user2@example.com',
      password: plainPassword,
      role: 'user',
      isEmailVerified: true,
    });
    await user2.save();

    const regularUsers = [user1, user2];

    console.log(`✅ Created ${1 + regularUsers.length} users\n`);

    // ==================== ARTISTS ====================
    console.log('🎨 Creating artists...');

    const artists = await Artist.create([
      {
        name: 'Nguyễn Văn Minh',
        specialty: 'Tranh Sơn Dầu',
        bio: 'Nghệ sĩ chuyên về tranh sơn dầu với phong cách ấn tượng, lấy cảm hứng từ thiên nhiên và cuộc sống đô thị.',
        avatar: 'https://i.pravatar.cc/400?img=12',
        email: 'nguyenvanminh@artist.com',
        phone: '0945678901',
        socialLinks: {
          instagram: 'https://instagram.com/nguyenvanminh.art',
          facebook: 'https://facebook.com/nguyenvanminh.artist',
        },
        isActive: true,
      },
      {
        name: 'Phạm Thu Hà',
        specialty: 'Tranh Thủy Mặc',
        bio: 'Nghệ sĩ tranh thủy mặc đương đại, kết hợp giữa kỹ thuật truyền thống phương Đông và phong cách hiện đại.',
        avatar: 'https://i.pravatar.cc/400?img=45',
        email: 'phamthuha@artist.com',
        phone: '0956789012',
        isActive: true,
      },
      {
        name: 'Trần Đức Long',
        specialty: 'Điêu Khắc',
        bio: 'Nghệ sĩ điêu khắc đương đại, khám phá mối quan hệ giữa con người và không gian.',
        avatar: 'https://i.pravatar.cc/400?img=33',
        email: 'tranduclong@artist.com',
        phone: '0967890123',
        isActive: true,
      },
      {
        name: 'Lê Thị Mai Anh',
        specialty: 'Nhiếp Ảnh Nghệ Thuật',
        bio: 'Nhiếp ảnh gia chuyên về chân dung và phong cảnh đô thị với phong cách độc đáo.',
        avatar: 'https://i.pravatar.cc/400?img=48',
        email: 'lethimaianh@artist.com',
        phone: '0978901234',
        isActive: true,
      },
    ]);

    console.log(`✅ Created ${artists.length} artists\n`);

    // ==================== PRODUCTS ====================
    console.log('🖼️  Creating products...');

    const products = await Product.create([
      {
        title: 'Hoàng Hôn Trên Phố',
        description: 'Tranh sơn dầu miêu tả cảnh hoàng hôn trên con phố cổ Hà Nội.',
        price: '15.000.000 ₫',
        priceValue: 15000000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'],
        category: 'Tranh vẽ',
        dimensions: { width: 80, height: 60, unit: 'cm' },
        material: 'Sơn dầu trên canvas',
        year: 2023,
        artistId: artists[0]!._id,
        artistName: artists[0]!.name,
        isAvailable: true,
        stock: 1,
        tags: ['phong cảnh', 'hoàng hôn', 'đô thị'],
        featured: true,
        views: 125,
        likes: 18,
      },
      {
        title: 'Cánh Đồng Lúa Chín',
        description: 'Bức tranh sơn dầu tái hiện vẻ đẹp của cánh đồng lúa chín vàng mùa gặt.',
        price: '18.000.000 ₫',
        priceValue: 18000000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800'],
        category: 'Tranh vẽ',
        dimensions: { width: 100, height: 70, unit: 'cm' },
        material: 'Sơn dầu trên canvas',
        year: 2023,
        artistId: artists[0]!._id,
        artistName: artists[0]!.name,
        isAvailable: true,
        stock: 1,
        tags: ['phong cảnh', 'thiên nhiên', 'nông thôn'],
        featured: true,
        views: 98,
        likes: 15,
      },
      {
        title: 'Thiền Tịnh',
        description: 'Tranh thủy mặc thể hiện trạng thái thiền định với những nét vẽ tinh tế, mềm mại.',
        price: '8.500.000 ₫',
        priceValue: 8500000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800'],
        category: 'Tranh vẽ',
        dimensions: { width: 60, height: 90, unit: 'cm' },
        material: 'Mực trên giấy xước',
        year: 2023,
        artistId: artists[1]!._id,
        artistName: artists[1]!.name,
        isAvailable: true,
        stock: 1,
        tags: ['thiền', 'tối giản', 'đương đại'],
        featured: true,
        views: 156,
        likes: 24,
      },
      {
        title: 'Tre Việt',
        description: 'Tác phẩm thủy mặc miêu tả rặng tre xanh tươi mát.',
        price: '7.000.000 ₫',
        priceValue: 7000000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1579762593131-f3c57c355e99?w=800'],
        category: 'Tranh vẽ',
        dimensions: { width: 50, height: 70, unit: 'cm' },
        material: 'Mực trên giấy dó',
        year: 2024,
        artistId: artists[1]!._id,
        artistName: artists[1]!.name,
        isAvailable: true,
        stock: 1,
        tags: ['tre', 'thiên nhiên', 'Việt Nam'],
        featured: false,
        views: 82,
        likes: 12,
      },
      {
        title: 'Không Gian Giao Thoa',
        description: 'Tác phẩm điêu khắc đương đại khám phá mối quan hệ giữa không gian thực và không gian ảo.',
        price: '45.000.000 ₫',
        priceValue: 45000000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1577720643272-265f491a3f2f?w=800'],
        category: 'Điêu khắc',
        dimensions: { width: 50, height: 120, depth: 50, unit: 'cm' },
        material: 'Thép không gỉ và gỗ',
        year: 2023,
        artistId: artists[2]!._id,
        artistName: artists[2]!.name,
        isAvailable: true,
        stock: 1,
        tags: ['điêu khắc', 'đương đại', 'trừu tượng'],
        featured: true,
        views: 234,
        likes: 38,
      },
      {
        title: 'Chuyển Hóa',
        description: 'Tác phẩm điêu khắc thể hiện quá trình chuyển hóa và biến đổi không ngừng trong tự nhiên.',
        price: '32.000.000 ₫',
        priceValue: 32000000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1580121441575-41bcb5c6b47c?w=800'],
        category: 'Điêu khắc',
        dimensions: { width: 40, height: 80, depth: 40, unit: 'cm' },
        material: 'Đồng đỏ',
        year: 2024,
        artistId: artists[2]!._id,
        artistName: artists[2]!.name,
        isAvailable: true,
        stock: 1,
        tags: ['điêu khắc', 'đồng', 'trừu tượng'],
        featured: false,
        views: 167,
        likes: 28,
      },
      {
        title: 'Chân Dung Nghệ Nhân',
        description: 'Ảnh nghệ thuật chân dung một nghệ nhân làng nghề truyền thống.',
        price: '5.500.000 ₫',
        priceValue: 5500000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800'],
        category: 'Ảnh nghệ thuật',
        dimensions: { width: 60, height: 90, unit: 'cm' },
        material: 'In Fine Art trên giấy Hahnemühle',
        year: 2024,
        artistId: artists[3]!._id,
        artistName: artists[3]!.name,
        isAvailable: true,
        stock: 3,
        tags: ['chân dung', 'nghệ nhân', 'văn hóa'],
        featured: true,
        views: 198,
        likes: 34,
      },
      {
        title: 'Sài Gòn Về Đêm',
        description: 'Series ảnh nghệ thuật về Sài Gòn về đêm với những tòa nhà cao tầng lung linh ánh đèn.',
        price: '6.800.000 ₫',
        priceValue: 6800000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800'],
        category: 'Ảnh nghệ thuật',
        dimensions: { width: 100, height: 70, unit: 'cm' },
        material: 'In Fine Art trên giấy Hahnemühle',
        year: 2023,
        artistId: artists[3]!._id,
        artistName: artists[3]!.name,
        isAvailable: true,
        stock: 2,
        tags: ['Sài Gòn', 'đêm', 'đô thị'],
        featured: true,
        views: 312,
        likes: 52,
      },
      {
        title: 'Đèn Trang Trí Gốm Sứ',
        description: 'Đèn trang trí làm từ gốm sứ Bát Tràng với họa tiết truyền thống.',
        price: '3.500.000 ₫',
        priceValue: 3500000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1543198126-a8b8c3c94a06?w=800'],
        category: 'Đồ trang trí',
        dimensions: { width: 30, height: 50, depth: 30, unit: 'cm' },
        material: 'Gốm sứ Bát Tràng',
        year: 2024,
        artistId: artists[0]!._id,
        artistName: artists[0]!.name,
        isAvailable: true,
        stock: 5,
        tags: ['đèn', 'gốm sứ', 'trang trí'],
        featured: false,
        views: 89,
        likes: 14,
      },
      {
        title: 'Tượng Gỗ Trừu Tượng',
        description: 'Tượng gỗ với phong cách trừu tượng hiện đại.',
        price: '12.500.000 ₫',
        priceValue: 12500000,
        currency: 'VND',
        images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'],
        category: 'Đồ trang trí',
        dimensions: { width: 25, height: 60, depth: 25, unit: 'cm' },
        material: 'Gỗ lim',
        year: 2024,
        artistId: artists[2]!._id,
        artistName: artists[2]!.name,
        isAvailable: true,
        stock: 2,
        tags: ['tượng', 'gỗ', 'trừu tượng'],
        featured: false,
        views: 143,
        likes: 21,
      },
    ]);

    console.log(`✅ Created ${products.length} products\n`);

    console.log('📊 Seeding Summary:');
    console.log('════════════════════════════════════════');
    console.log(`👥 Users:     ${1 + regularUsers.length} (1 admin, ${regularUsers.length} users)`);
    console.log(`🎨 Artists:   ${artists.length}`);
    console.log(`🖼️  Products:  ${products.length}`);
    console.log('════════════════════════════════════════\n');

    console.log('🔑 Login Credentials:');
    console.log('   Admin: admin@artgallery.com / password123');
    console.log('   User:  user1@example.com / password123\n');

    console.log('✅ Database seeding completed!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();

