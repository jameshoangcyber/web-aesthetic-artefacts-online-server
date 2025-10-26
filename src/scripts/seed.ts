import 'module-alias/register';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '@/config/config';
import { User } from '@/models/User';
import { Artist } from '@/models/Artist';
import { Product } from '@/models/Product';

/**
 * Seed data for the database
 */

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ==================== USERS ====================
    console.log('👥 Creating users...');
    
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'ArtGallery',
      email: 'admin@artgallery.com',
      password: hashedPassword,
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

    const regularUsers = await User.create([
      {
        firstName: 'Nguyễn',
        lastName: 'Văn An',
        email: 'user1@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '0912345678',
        address: {
          street: '456 Lê Lợi',
          city: 'Hà Nội',
          district: 'Hoàn Kiếm',
          ward: 'Phường Tràng Tiền',
        },
        isEmailVerified: true,
      },
      {
        firstName: 'Trần',
        lastName: 'Thị Bình',
        email: 'user2@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '0923456789',
        isEmailVerified: true,
      },
      {
        firstName: 'Lê',
        lastName: 'Minh Cường',
        email: 'user3@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '0934567890',
        isEmailVerified: true,
      },
    ]);

    console.log(`✅ Created ${1 + regularUsers.length} users`);
    console.log(`   - Admin: ${adminUser.email}`);
    console.log(`   - Users: ${regularUsers.map(u => u.email).join(', ')}\n`);

    // ==================== ARTISTS ====================
    console.log('🎨 Creating artists...');

    const artists = await Artist.create([
      {
        name: 'Nguyễn Văn Minh',
        specialty: 'Tranh Sơn Dầu',
        bio: 'Nghệ sĩ chuyên về tranh sơn dầu với phong cách ấn tượng, lấy cảm hứng từ thiên nhiên và cuộc sống đô thị. Tốt nghiệp Đại học Mỹ thuật Hà Nội năm 2010, đã tham gia nhiều triển lãm trong và ngoài nước.',
        avatar: 'https://i.pravatar.cc/400?img=12',
        email: 'nguyenvanminh@artist.com',
        phone: '0945678901',
        socialLinks: {
          instagram: 'https://instagram.com/nguyenvanminh.art',
          facebook: 'https://facebook.com/nguyenvanminh.artist',
          website: 'https://nguyenvanminh-art.com',
        },
        isActive: true,
      },
      {
        name: 'Phạm Thu Hà',
        specialty: 'Tranh Thủy Mặc',
        bio: 'Nghệ sĩ tranh thủy mặc đương đại, kết hợp giữa kỹ thuật truyền thống phương Đông và phong cách hiện đại. Các tác phẩm mang đậm chất thiền và triết lý sống.',
        avatar: 'https://i.pravatar.cc/400?img=45',
        email: 'phamthuha@artist.com',
        phone: '0956789012',
        socialLinks: {
          instagram: 'https://instagram.com/phamthuha.art',
          facebook: 'https://facebook.com/phamthuha.artist',
        },
        isActive: true,
      },
      {
        name: 'Trần Đức Long',
        specialty: 'Điêu Khắc & Nghệ Thuật Sắp Đặt',
        bio: 'Nghệ sĩ điêu khắc và sắp đặt đa phương tiện, tốt nghiệp thạc sĩ Mỹ thuật tại Paris. Tác phẩm thường khám phá mối quan hệ giữa con người và không gian.',
        avatar: 'https://i.pravatar.cc/400?img=33',
        email: 'tranduclong@artist.com',
        phone: '0967890123',
        socialLinks: {
          instagram: 'https://instagram.com/tranduclong.sculpture',
          website: 'https://tranduclong-art.com',
          twitter: 'https://twitter.com/tranduclong_art',
        },
        isActive: true,
      },
      {
        name: 'Lê Thị Mai Anh',
        specialty: 'Tranh Lụa & Mỹ Nghệ',
        bio: 'Nghệ sĩ tranh lụa truyền thống với hơn 15 năm kinh nghiệm. Chuyên về các chủ đề văn hóa Việt Nam, phong cảnh và nhân vật. Tác phẩm được trưng bày tại nhiều bảo tàng và phòng trưng bày quốc tế.',
        avatar: 'https://i.pravatar.cc/400?img=48',
        email: 'lethimaianh@artist.com',
        phone: '0978901234',
        socialLinks: {
          facebook: 'https://facebook.com/lethimaianh.silkpainting',
          instagram: 'https://instagram.com/lethimaianh.art',
        },
        isActive: true,
      },
      {
        name: 'Hoàng Minh Tuấn',
        specialty: 'Nhiếp Ảnh Nghệ Thuật',
        bio: 'Nhiếp ảnh gia nghệ thuật chuyên về chân dung và phong cảnh đô thị. Phong cách độc đáo với sử dụng ánh sáng tự nhiên và góc máy sáng tạo. Đạt nhiều giải thưởng nhiếp ảnh quốc tế.',
        avatar: 'https://i.pravatar.cc/400?img=15',
        email: 'hoangminhtuan@artist.com',
        phone: '0989012345',
        socialLinks: {
          instagram: 'https://instagram.com/hoangminhtuan.photo',
          website: 'https://hoangminhtuan-photography.com',
          facebook: 'https://facebook.com/hoangminhtuan.photographer',
        },
        isActive: true,
      },
    ]);

    console.log(`✅ Created ${artists.length} artists\n`);

    // ==================== PRODUCTS ====================
    console.log('🖼️  Creating products...');

    const products = await Product.create([
      // Nguyễn Văn Minh - Tranh Sơn Dầu
      {
        title: 'Hoàng Hôn Trên Phố',
        description: 'Tranh sơn dầu miêu tả cảnh hoàng hôn trên con phố cổ Hà Nội. Ánh nắng chiều rực rỡ xuyên qua những tán cây xanh, tạo nên bầu không khí thơ mộng và ấm áp. Tác phẩm thể hiện vẻ đẹp bình dị của cuộc sống thường ngày.',
        price: '15.000.000 ₫',
        priceValue: 15000000,
        currency: 'VND',
        images: [
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200',
        ],
        category: 'Tranh vẽ',
        dimensions: {
          width: 80,
          height: 60,
          unit: 'cm',
        },
        material: 'Sơn dầu trên canvas',
        year: 2023,
        artistId: artists[0]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['phong cảnh', 'hoàng hôn', 'đô thị', 'Hà Nội'],
        featured: true,
        views: 125,
        likes: 18,
      },
      {
        title: 'Cánh Đồng Lúa Chín',
        description: 'Bức tranh sơn dầu tái hiện vẻ đẹp của cánh đồng lúa chín vàng mùa gặt. Những luống lúa nghiêng mình theo gió, tạo nên những đường nét uốn lượn tuyệt đẹp. Màu vàng rực rỡ của lúa chín và xanh của núi non xa xa tạo nên sự tương phản hài hòa.',
        price: 18000000,
        images: [
          'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800',
        ],
        category: 'Tranh Sơn Dầu',
        dimensions: {
          width: 100,
          height: 70,
          unit: 'cm',
        },
        material: 'Sơn dầu trên canvas',
        year: 2023,
        artistId: artists[0]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['phong cảnh', 'thiên nhiên', 'nông thôn', 'lúa'],
        featured: true,
        views: 98,
        likes: 15,
      },
      {
        title: 'Khu Phố Đêm',
        description: 'Tác phẩm thể hiện vẻ đẹp lung linh của khu phố về đêm với ánh đèn neon rực rỡ. Phản chiếu trên mặt đường ướt sau cơn mưa, tạo nên hiệu ứng màu sắc độc đáo và cuốn hút.',
        price: 12000000,
        images: [
          'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
        ],
        category: 'Tranh Sơn Dầu',
        dimensions: {
          width: 70,
          height: 50,
          unit: 'cm',
        },
        material: 'Sơn dầu trên canvas',
        year: 2024,
        artistId: artists[0]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['đô thị', 'đêm', 'hiện đại'],
        featured: false,
        views: 67,
        likes: 9,
      },

      // Phạm Thu Hà - Tranh Thủy Mặc
      {
        title: 'Thiền Tịnh',
        description: 'Tranh thủy mặc thể hiện trạng thái thiền định với những nét vẽ tinh tế, mềm mại. Sự kết hợp giữa mực đen và không gian trắng tạo nên sự cân bằng hoàn hảo, phản ánh triết lý âm dương trong văn hóa phương Đông.',
        price: 8500000,
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
        ],
        category: 'Tranh Thủy Mặc',
        dimensions: {
          width: 60,
          height: 90,
          unit: 'cm',
        },
        material: 'Mực trên giấy xước',
        year: 2023,
        artistId: artists[1]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['thiền', 'tối giản', 'đương đại'],
        featured: true,
        views: 156,
        likes: 24,
      },
      {
        title: 'Tre Việt',
        description: 'Tác phẩm thủy mặc miêu tả rặng tre xanh tươi mát. Những đường nét mảnh mai, uốn lượn thể hiện sự uyển chuyển và bền bỉ của tre - biểu tượng của người Việt Nam. Tác phẩm mang đến cảm giác thanh tịnh và gần gũi với thiên nhiên.',
        price: 7000000,
        images: [
          'https://images.unsplash.com/photo-1579762593131-f3c57c355e99?w=800',
        ],
        category: 'Tranh Thủy Mặc',
        dimensions: {
          width: 50,
          height: 70,
          unit: 'cm',
        },
        material: 'Mực trên giấy dó',
        year: 2024,
        artistId: artists[1]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['tre', 'thiên nhiên', 'Việt Nam', 'truyền thống'],
        featured: false,
        views: 82,
        likes: 12,
      },
      {
        title: 'Sương Mai',
        description: 'Bức tranh thủy mặc về cảnh sương sớm bao phủ núi non. Những lớp mực loang tạo nên cảm giác mờ ảo, huyền bí của sương mai. Kỹ thuật dùng nước và mực khéo léo tạo nên chiều sâu và không gian ba chiều.',
        price: 9500000,
        images: [
          'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800',
        ],
        category: 'Tranh Thủy Mặc',
        dimensions: {
          width: 70,
          height: 50,
          unit: 'cm',
        },
        material: 'Mực trên giấy xước',
        year: 2023,
        artistId: artists[1]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['phong cảnh', 'sương', 'núi non'],
        featured: true,
        views: 143,
        likes: 21,
      },

      // Trần Đức Long - Điêu Khắc
      {
        title: 'Không Gian Giao Thoa',
        description: 'Tác phẩm điêu khắc đương đại khám phá mối quan hệ giữa không gian thực và không gian ảo. Sử dụng thép không gỉ kết hợp với gỗ tạo nên hình khối độc đáo, phản chiếu ánh sáng và môi trường xung quanh.',
        price: 45000000,
        images: [
          'https://images.unsplash.com/photo-1577720643272-265f491a3f2f?w=800',
        ],
        category: 'Điêu Khắc',
        dimensions: {
          width: 50,
          height: 120,
          depth: 50,
          unit: 'cm',
        },
        material: 'Thép không gỉ và gỗ',
        year: 2023,
        artistId: artists[2]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['điêu khắc', 'đương đại', 'không gian', 'trừu tượng'],
        featured: true,
        views: 234,
        likes: 38,
      },
      {
        title: 'Chuyển Hóa',
        description: 'Tác phẩm điêu khắc thể hiện quá trình chuyển hóa và biến đổi không ngừng trong tự nhiên. Hình khối xoắn ốc làm từ đồng tạo cảm giác chuyển động và sinh động.',
        price: 32000000,
        images: [
          'https://images.unsplash.com/photo-1580121441575-41bcb5c6b47c?w=800',
        ],
        category: 'Điêu Khắc',
        dimensions: {
          width: 40,
          height: 80,
          depth: 40,
          unit: 'cm',
        },
        material: 'Đồng đỏ',
        year: 2024,
        artistId: artists[2]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['điêu khắc', 'đồng', 'trừu tượng'],
        featured: false,
        views: 167,
        likes: 28,
      },

      // Lê Thị Mai Anh - Tranh Lụa
      {
        title: 'Thiếu Nữ Bên Hoa Sen',
        description: 'Tranh lụa truyền thống miêu tả hình ảnh thiếu nữ Việt Nam áo dài bên hồ sen. Màu sắc nhẹ nhàng, tươi mới với kỹ thuật nhuộm lụa tinh xảo. Tác phẩm thể hiện vẻ đẹp dịu dàng, thanh khiết của người phụ nữ Việt.',
        price: 11000000,
        images: [
          'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
        ],
        category: 'Tranh Lụa',
        dimensions: {
          width: 60,
          height: 80,
          unit: 'cm',
        },
        material: 'Lụa tơ tằm và màu vẽ lụa',
        year: 2023,
        artistId: artists[3]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['truyền thống', 'chân dung', 'sen', 'áo dài'],
        featured: true,
        views: 189,
        likes: 32,
      },
      {
        title: 'Phố Cổ Hội An',
        description: 'Tranh lụa tái hiện vẻ đẹp cổ kính của phố cổ Hội An với những ngôi nhà rêu phong, đèn lồng rực rỡ. Kỹ thuật vẽ lụa tỉ mỉ từng chi tiết tạo nên bức tranh sống động và đầy màu sắc.',
        price: 13500000,
        images: [
          'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        ],
        category: 'Tranh Lụa',
        dimensions: {
          width: 80,
          height: 60,
          unit: 'cm',
        },
        material: 'Lụa tơ tằm và màu vẽ lụa',
        year: 2024,
        artistId: artists[3]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['Hội An', 'phố cổ', 'văn hóa', 'du lịch'],
        featured: true,
        views: 276,
        likes: 45,
      },
      {
        title: 'Mùa Thu Hà Nội',
        description: 'Tác phẩm tranh lụa về Hà Nội mùa thu với hàng cây lá vàng rơi. Màu sắc ấm áp của mùa thu được thể hiện tinh tế qua kỹ thuật nhuộm màu độc đáo trên lụa.',
        price: 9800000,
        images: [
          'https://images.unsplash.com/photo-1507120410856-1f35574c3b45?w=800',
        ],
        category: 'Tranh Lụa',
        dimensions: {
          width: 70,
          height: 50,
          unit: 'cm',
        },
        material: 'Lụa tơ tằm và màu vẽ lụa',
        year: 2023,
        artistId: artists[3]!._id,
        isAvailable: true,
        stock: 1,
        tags: ['Hà Nội', 'mùa thu', 'phong cảnh'],
        featured: false,
        views: 134,
        likes: 19,
      },

      // Hoàng Minh Tuấn - Nhiếp Ảnh
      {
        title: 'Chân Dung Nghệ Nhân',
        description: 'Ảnh nghệ thuật chân dung một nghệ nhân làng nghề truyền thống. Ánh sáng tự nhiên khéo léo làm nổi bật nét mặt đầy tâm huyết và đôi tay lành nghề. Bức ảnh ghi lại vẻ đẹp của sự chuyên cần và đam mê nghề.',
        price: 5500000,
        images: [
          'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
        ],
        category: 'Nhiếp Ảnh',
        dimensions: {
          width: 60,
          height: 90,
          unit: 'cm',
        },
        material: 'In Fine Art trên giấy Hahnemühle',
        year: 2024,
        artistId: artists[4]!._id,
        isAvailable: true,
        stock: 3,
        tags: ['chân dung', 'nghệ nhân', 'văn hóa', 'đen trắng'],
        featured: true,
        views: 198,
        likes: 34,
      },
      {
        title: 'Sài Gòn Về Đêm',
        description: 'Series ảnh nghệ thuật về Sài Gòn về đêm với những tòa nhà cao tầng lung linh ánh đèn. Góc chụp từ trên cao tạo nên cảm giác choáng ngợp trước vẻ đẹp hiện đại của thành phố.',
        price: 6800000,
        images: [
          'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800',
        ],
        category: 'Nhiếp Ảnh',
        dimensions: {
          width: 100,
          height: 70,
          unit: 'cm',
        },
        material: 'In Fine Art trên giấy Hahnemühle',
        year: 2023,
        artistId: artists[4]!._id,
        isAvailable: true,
        stock: 2,
        tags: ['Sài Gòn', 'đêm', 'đô thị', 'hiện đại'],
        featured: true,
        views: 312,
        likes: 52,
      },
      {
        title: 'Nơi Xa',
        description: 'Bức ảnh nghệ thuật về vùng cao với những thửa ruộng bậc thang uốn lượn. Ánh sáng buổi sáng sớm tạo nên bầu không khí thơ mộng và bình yên.',
        price: 4500000,
        images: [
          'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800',
        ],
        category: 'Nhiếp Ảnh',
        dimensions: {
          width: 80,
          height: 60,
          unit: 'cm',
        },
        material: 'In Fine Art trên giấy Hahnemühle',
        year: 2024,
        artistId: artists[4]!._id,
        isAvailable: true,
        stock: 5,
        tags: ['phong cảnh', 'ruộng bậc thang', 'vùng cao'],
        featured: false,
        views: 156,
        likes: 27,
      },

      // Thêm một số sản phẩm đã bán
      {
        title: 'Bình Minh Vịnh Hạ Long',
        description: 'Tranh sơn dầu về cảnh bình minh tại Vịnh Hạ Long. Ánh sáng đầu ngày chiếu rọi lên những khối đá vôi tạo nên cảnh tượng장관 kỳ vĩ.',
        price: 22000000,
        images: [
          'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        ],
        category: 'Tranh Sơn Dầu',
        dimensions: {
          width: 120,
          height: 80,
          unit: 'cm',
        },
        material: 'Sơn dầu trên canvas',
        year: 2023,
        artistId: artists[0]!._id,
        isAvailable: false,
        stock: 0,
        tags: ['Hạ Long', 'phong cảnh', 'bình minh'],
        featured: false,
        views: 423,
        likes: 68,
      },
      {
        title: 'Tĩnh Vật Hoa Sen',
        description: 'Tranh lụa tĩnh vật với chủ đề hoa sen - biểu tượng của sự thanh cao trong văn hóa Việt.',
        price: 8500000,
        images: [
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
        ],
        category: 'Tranh Lụa',
        dimensions: {
          width: 60,
          height: 60,
          unit: 'cm',
        },
        material: 'Lụa tơ tằm và màu vẽ lụa',
        year: 2024,
        artistId: artists[3]!._id,
        isAvailable: false,
        stock: 0,
        tags: ['tĩnh vật', 'hoa sen', 'truyền thống'],
        featured: false,
        views: 234,
        likes: 41,
      },
    ]);

    console.log(`✅ Created ${products.length} products\n`);

    // ==================== SUMMARY ====================
    console.log('📊 Seeding Summary:');
    console.log('════════════════════════════════════════');
    console.log(`👥 Users:     ${1 + regularUsers.length} (1 admin, ${regularUsers.length} users)`);
    console.log(`🎨 Artists:   ${artists.length}`);
    console.log(`🖼️  Products:  ${products.length} (${products.filter(p => p.isAvailable).length} available, ${products.filter(p => !p.isAvailable).length} sold)`);
    console.log('════════════════════════════════════════\n');

    console.log('🔑 Login Credentials:');
    console.log('   Admin:');
    console.log(`     Email:    admin@artgallery.com`);
    console.log(`     Password: password123`);
    console.log('   Users:');
    console.log(`     Email:    user1@example.com / user2@example.com / user3@example.com`);
    console.log(`     Password: password123\n`);

    console.log('✅ Database seeding completed successfully!\n');

    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();

