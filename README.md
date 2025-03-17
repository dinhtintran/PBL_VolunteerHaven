# GiveHope - Nền tảng quyên góp từ thiện

GiveHope là một nền tảng toàn diện kết nối các tổ chức từ thiện với người quyên góp, với các tính năng quản lý chiến dịch và theo dõi quyên góp.

## Giới thiệu

Dự án này xây dựng một nền tảng web giúp:
- Các tổ chức từ thiện có thể tạo và quản lý các chiến dịch quyên góp
- Người dùng có thể dễ dàng tìm kiếm và đóng góp cho các dự án ý nghĩa
- Quản trị viên có thể phê duyệt tổ chức và chiến dịch
- Hỗ trợ đa ngôn ngữ (Tiếng Anh/Tiếng Việt)

## Công nghệ sử dụng

- **Frontend**: React, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (qua Drizzle ORM)
- **Authentication**: Passport.js
- **API**: RESTful API

## Cấu trúc dự án

### Thư mục gốc

```
├── client/           # Mã nguồn Frontend (React)
├── server/           # Mã nguồn Backend (Express) 
├── shared/           # Mã nguồn dùng chung giữa frontend và backend
└── ...               # Các file cấu hình dự án
```

### Phần Frontend (`/client`)

```
├── src/
│   ├── components/   # Các thành phần UI tái sử dụng
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Các hàm tiện ích
│   ├── pages/        # Các trang chính của ứng dụng
│   ├── App.tsx       # Component App chính
│   └── main.tsx      # Điểm khởi đầu ứng dụng
```

### Phần Backend (`/server`)

```
├── auth.ts           # Xác thực người dùng
├── index.ts          # Điểm khởi đầu server
├── routes.ts         # Định nghĩa các API routes
├── storage.ts        # Logic tương tác với cơ sở dữ liệu
└── vite.ts           # Cấu hình Vite cho development
```

### Phần Shared (`/shared`)

```
└── schema.ts         # Định nghĩa schema dữ liệu dùng chung
```

## Chi tiết từng file chính

### Frontend

- **client/src/App.tsx**: Cấu hình Router và layout chính của ứng dụng
- **client/src/hooks/use-auth.tsx**: Logic xác thực người dùng, quản lý đăng nhập/đăng ký
- **client/src/lib/protected-route.tsx**: Bảo vệ các route yêu cầu đăng nhập
- **client/src/pages/auth-page.tsx**: Trang đăng nhập và đăng ký
- **client/src/pages/admin-page.tsx**: Trang quản trị cho admin
- **client/src/pages/home-page.tsx**: Trang chủ
- **client/src/pages/campaign-page.tsx**: Trang hiển thị danh sách chiến dịch
- **client/src/pages/campaign-details.tsx**: Trang chi tiết chiến dịch
- **client/src/pages/create-campaign.tsx**: Trang tạo chiến dịch mới
- **client/src/components/layout/Navbar.tsx**: Thanh điều hướng chính

### Backend

- **server/auth.ts**: Xử lý xác thực người dùng (login, register, logout)
- **server/routes.ts**: Định nghĩa các API endpoints
- **server/storage.ts**: Các hàm thao tác với dữ liệu (CRUD operations)
- **shared/schema.ts**: Schema dữ liệu cho users, campaigns, donations, categories

## Các tính năng đã triển khai

1. **Quản lý người dùng**:
   - Đăng ký, đăng nhập, đăng xuất
   - Phân quyền (người dùng, tổ chức, quản trị viên)

2. **Quản lý chiến dịch**:
   - Xem danh sách và chi tiết chiến dịch
   - Tạo chiến dịch mới (cho tổ chức)

3. **Quản lý quyên góp**:
   - Đóng góp cho chiến dịch
   - Xem lịch sử quyên góp

4. **Quản trị**:
   - Phê duyệt tổ chức
   - Phê duyệt chiến dịch

## Các tính năng sắp tới

1. **Đa ngôn ngữ**:
   - Hỗ trợ chuyển đổi giữa tiếng Anh và tiếng Việt
   - Lưu trữ cài đặt ngôn ngữ của người dùng

2. **Chế độ giao diện**:
   - Chế độ sáng/tối
   - Lưu trữ cài đặt giao diện của người dùng

3. **Thống kê và báo cáo**:
   - Biểu đồ theo dõi tiến độ chiến dịch
   - Báo cáo tài chính cho tổ chức

4. **Thanh toán trực tuyến**:
   - Tích hợp cổng thanh toán
   - Lịch sử giao dịch

5. **Thông báo**:
   - Email thông báo về tiến độ chiến dịch
   - Thông báo trong ứng dụng

## Hướng dẫn cài đặt

1. **Cài đặt Node.js và npm**
2. **Clone dự án**
3. **Cài đặt dependencies**:
   ```
   npm install
   ```
4. **Chạy ứng dụng**:
   ```
   npm run dev
   ```

## Tài khoản demo
- **Admin**: username: admin, password: admin123
- **Tổ chức**: username: charity1, password: password123
- **Người dùng**: username: donor1, password: password123

## Giấy phép

Dự án này được phát hành dưới giấy phép MIT.