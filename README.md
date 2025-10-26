# Aesthetic Artefacts Server

Backend API cho ứng dụng Art Gallery được xây dựng với Node.js, Express, TypeScript và MongoDB.

## 🚀 Tính năng

- **Authentication & Authorization**: JWT-based auth với refresh tokens
- **User Management**: Đăng ký, đăng nhập, quản lý profile
- **Product Management**: CRUD operations cho sản phẩm nghệ thuật
- **Artist Management**: Quản lý thông tin nghệ sĩ
- **Shopping Cart**: Giỏ hàng với persistence
- **Order Management**: Xử lý đơn hàng và thanh toán
- **File Upload**: Upload ảnh với Cloudinary
- **Search & Filter**: Tìm kiếm và lọc sản phẩm
- **Rate Limiting**: Bảo vệ API khỏi spam
- **Validation**: Joi validation schemas
- **Error Handling**: Centralized error handling
- **Security**: Helmet, CORS, bcrypt

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT + bcrypt
- **File Storage**: Cloudinary
- **Payment**: Stripe
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm >= 8.0.0

## 🔧 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd aesthetic-artefacts-online-server
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment variables

```bash
cp env.example .env
```

Chỉnh sửa file `.env` với các giá trị phù hợp:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/aesthetic-artefacts

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Chạy MongoDB

```bash
# Với Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Hoặc cài đặt MongoDB locally
mongod
```

### 5. Chạy development server

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Đăng ký tài khoản | No |
| POST | `/auth/login` | Đăng nhập | No |
| POST | `/auth/refresh-token` | Refresh token | No |
| POST | `/auth/logout` | Đăng xuất | Yes |
| GET | `/auth/me` | Lấy thông tin user | Yes |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Lấy danh sách sản phẩm | No |
| GET | `/products/:id` | Lấy chi tiết sản phẩm | No |
| POST | `/products` | Tạo sản phẩm mới | Artist/Admin |
| PUT | `/products/:id` | Cập nhật sản phẩm | Artist/Admin |
| DELETE | `/products/:id` | Xóa sản phẩm | Artist/Admin |

### Artist Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/artists` | Lấy danh sách nghệ sĩ | No |
| GET | `/artists/:id` | Lấy chi tiết nghệ sĩ | No |
| POST | `/artists` | Tạo nghệ sĩ mới | Artist/Admin |
| PUT | `/artists/:id` | Cập nhật nghệ sĩ | Artist/Admin |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Lấy giỏ hàng | Yes |
| POST | `/cart/add` | Thêm vào giỏ hàng | Yes |
| PUT | `/cart/update` | Cập nhật giỏ hàng | Yes |
| DELETE | `/cart/remove/:productId` | Xóa khỏi giỏ hàng | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | Lấy đơn hàng của user | Yes |
| POST | `/orders` | Tạo đơn hàng mới | Yes |
| GET | `/orders/:id` | Lấy chi tiết đơn hàng | Yes |

## 🔐 Authentication

API sử dụng JWT tokens cho authentication:

### Headers
```http
Authorization: Bearer <access_token>
```

### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "pagination": { ... }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🧪 Testing

```bash
# Chạy tests
npm test

# Chạy tests với watch mode
npm run test:watch

# Chạy tests với coverage
npm run test:coverage
```

## 📦 Build & Deploy

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Docker deployment
```bash
# Build image
docker build -t aesthetic-artefacts-server .

# Run container
docker run -p 5000:5000 aesthetic-artefacts-server
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent API abuse
- **JWT**: Secure token-based authentication
- **bcrypt**: Password hashing
- **Input Validation**: Joi schemas
- **SQL Injection Protection**: Mongoose ODM

## 📊 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Error Tracking**: Centralized error handling
- **Health Check**: `/health` endpoint

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- Email: support@artgallery.com
- Documentation: `/api/docs`
- Issues: GitHub Issues

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete CRUD operations
- Authentication system
- File upload functionality
- Payment integration
- Search and filtering
