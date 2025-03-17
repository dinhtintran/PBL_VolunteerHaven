import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Language = "en" | "vi";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Tạo context cho ngôn ngữ
const LanguageContext = createContext<LanguageContextType | null>(null);

// Các bản dịch
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Chung
    "app.name": "VolunteerHaven",
    "app.tagline": "Make a Difference Today",
    "app.description": "Join VolunteerHaven to support meaningful causes and help communities in need. Your contribution matters.",
    
    // Điều hướng
    "nav.home": "Home",
    "nav.campaigns": "Campaigns",
    "nav.donate": "Donate",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin Portal",
    "nav.login": "Log in",
    "nav.signup": "Sign up",
    "nav.logout": "Log out",
    
    // Trang chủ
    "home.featured": "Featured Campaigns",
    "home.categories": "Categories",
    "home.impact.title": "Our Impact",
    "home.impact.projects": "Projects",
    "home.impact.donors": "Donors",
    "home.impact.donated": "Donated",
    "home.cta": "Start Making a Difference",
    "home.benefit1": "Support impactful projects worldwide",
    "home.benefit2": "Track your donations and see the impact",
    "home.benefit3": "Connect with like-minded donors",
    
    // Đăng nhập & Đăng ký
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.signin.description": "Enter your credentials to access your account",
    "auth.signup.description": "Sign up for a new account",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.email": "Email",
    "auth.fullname": "Full Name",
    "auth.confirmPassword": "Confirm Password",
    "auth.accountType": "Account Type",
    "auth.signin.button": "Sign In",
    "auth.signup.button": "Create Account",
    "auth.signin.loading": "Signing in...",
    "auth.signup.loading": "Creating account...",
    "auth.noaccount": "Don't have an account?",
    "auth.hasaccount": "Already have an account?",
    "auth.admin.portal": "Admin Portal Access",
    "auth.admin.mode": "Admin login mode activated. Use password: admin123",
    
    // Kiểu tài khoản
    "account.donor": "Donor",
    "account.organization": "Organization",
    
    // Chiến dịch
    "campaign.create": "Create Campaign",
    "campaign.donate": "Donate Now",
    "campaign.details": "Campaign Details",
    "campaign.goal": "Goal",
    "campaign.raised": "Raised",
    "campaign.creator": "Creator",
    "campaign.days": "days left",
    "campaign.category": "Category",
    "campaign.date": "Start Date",
    "campaign.donations": "Donations",
    "campaign.recent": "Recent Donations",
    "campaign.anonymous": "Anonymous Donor",
    
    // Form chiến dịch
    "campaign.form.title": "Title",
    "campaign.form.description": "Description",
    "campaign.form.goal": "Goal Amount",
    "campaign.form.category": "Category",
    "campaign.form.image": "Image URL",
    "campaign.form.startDate": "Start Date",
    "campaign.form.endDate": "End Date",
    "campaign.form.submit": "Create Campaign",
    "campaign.form.loading": "Creating...",
    
    // Form quyên góp
    "donation.amount": "Donation Amount",
    "donation.message": "Message (Optional)",
    "donation.anonymous": "Donate Anonymously",
    "donation.submit": "Complete Donation",
    "donation.loading": "Processing...",
    
    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.campaigns": "Pending Campaigns",
    "admin.organizations": "Organizations",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.status": "Status",
    "admin.approved": "Approved",
    "admin.pending": "Pending",
    
    // Bảng điều khiển
    "dashboard.welcome": "Welcome to your Dashboard",
    "dashboard.campaigns": "Your Campaigns",
    "dashboard.donations": "Your Donations",
    "dashboard.total": "Total Donations",
    
    // Các nút và thông báo
    "button.viewMore": "View More",
    "button.browse": "Browse Campaigns",
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.close": "Close",
    "button.edit": "Edit",
    "button.delete": "Delete",
    
    // Thông báo
    "toast.success": "Success",
    "toast.error": "Error",
    "toast.login.success": "Logged in successfully",
    "toast.login.error": "Login failed",
    "toast.register.success": "Account created successfully",
    "toast.register.error": "Registration failed",
    "toast.campaign.created": "Campaign created successfully",
    "toast.donation.success": "Donation completed successfully",
    "toast.admin.approve": "Item approved successfully",
    
    // Footer
    "footer.about": "About Us",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.copyright": "© 2025 VolunteerHaven. All rights reserved.",
    
    // Ngôn ngữ
    "language.en": "English",
    "language.vi": "Vietnamese",
  },
  vi: {
    // Chung
    "app.name": "VolunteerHaven",
    "app.tagline": "Tạo nên sự khác biệt ngay hôm nay",
    "app.description": "Tham gia VolunteerHaven để hỗ trợ các mục đích ý nghĩa và giúp đỡ cộng đồng cần hỗ trợ. Sự đóng góp của bạn rất có ý nghĩa.",
    
    // Điều hướng
    "nav.home": "Trang chủ",
    "nav.campaigns": "Chiến dịch",
    "nav.donate": "Quyên góp",
    "nav.about": "Giới thiệu",
    "nav.contact": "Liên hệ",
    "nav.dashboard": "Bảng điều khiển",
    "nav.admin": "Quản trị",
    "nav.login": "Đăng nhập",
    "nav.signup": "Đăng ký",
    "nav.logout": "Đăng xuất",
    
    // Trang chủ
    "home.featured": "Chiến dịch nổi bật",
    "home.categories": "Danh mục",
    "home.impact.title": "Tác động của chúng tôi",
    "home.impact.projects": "Dự án",
    "home.impact.donors": "Nhà hảo tâm",
    "home.impact.donated": "Đã quyên góp",
    "home.cta": "Bắt đầu tạo sự khác biệt",
    "home.benefit1": "Hỗ trợ các dự án có ý nghĩa trên toàn thế giới",
    "home.benefit2": "Theo dõi các khoản quyên góp và xem tác động",
    "home.benefit3": "Kết nối với những nhà hảo tâm có cùng chí hướng",
    
    // Đăng nhập & Đăng ký
    "auth.signin": "Đăng nhập",
    "auth.signup": "Đăng ký",
    "auth.signin.description": "Nhập thông tin đăng nhập để truy cập tài khoản của bạn",
    "auth.signup.description": "Đăng ký tài khoản mới",
    "auth.username": "Tên đăng nhập",
    "auth.password": "Mật khẩu",
    "auth.email": "Email",
    "auth.fullname": "Họ và tên",
    "auth.confirmPassword": "Xác nhận mật khẩu",
    "auth.accountType": "Loại tài khoản",
    "auth.signin.button": "Đăng nhập",
    "auth.signup.button": "Tạo tài khoản",
    "auth.signin.loading": "Đang đăng nhập...",
    "auth.signup.loading": "Đang tạo tài khoản...",
    "auth.noaccount": "Chưa có tài khoản?",
    "auth.hasaccount": "Đã có tài khoản?",
    "auth.admin.portal": "Truy cập Quản trị",
    "auth.admin.mode": "Đã kích hoạt chế độ đăng nhập quản trị. Mật khẩu: admin123",
    
    // Kiểu tài khoản
    "account.donor": "Nhà hảo tâm",
    "account.organization": "Tổ chức",
    
    // Chiến dịch
    "campaign.create": "Tạo chiến dịch",
    "campaign.donate": "Quyên góp ngay",
    "campaign.details": "Chi tiết chiến dịch",
    "campaign.goal": "Mục tiêu",
    "campaign.raised": "Đã gây quỹ",
    "campaign.creator": "Người tạo",
    "campaign.days": "ngày còn lại",
    "campaign.category": "Danh mục",
    "campaign.date": "Ngày bắt đầu",
    "campaign.donations": "Lượt quyên góp",
    "campaign.recent": "Quyên góp gần đây",
    "campaign.anonymous": "Nhà hảo tâm ẩn danh",
    
    // Form chiến dịch
    "campaign.form.title": "Tiêu đề",
    "campaign.form.description": "Mô tả",
    "campaign.form.goal": "Số tiền mục tiêu",
    "campaign.form.category": "Danh mục",
    "campaign.form.image": "URL hình ảnh",
    "campaign.form.startDate": "Ngày bắt đầu",
    "campaign.form.endDate": "Ngày kết thúc",
    "campaign.form.submit": "Tạo chiến dịch",
    "campaign.form.loading": "Đang tạo...",
    
    // Form quyên góp
    "donation.amount": "Số tiền quyên góp",
    "donation.message": "Lời nhắn (Tùy chọn)",
    "donation.anonymous": "Quyên góp ẩn danh",
    "donation.submit": "Hoàn thành quyên góp",
    "donation.loading": "Đang xử lý...",
    
    // Admin
    "admin.dashboard": "Bảng điều khiển Quản trị",
    "admin.campaigns": "Chiến dịch chờ duyệt",
    "admin.organizations": "Tổ chức",
    "admin.approve": "Phê duyệt",
    "admin.reject": "Từ chối",
    "admin.status": "Trạng thái",
    "admin.approved": "Đã duyệt",
    "admin.pending": "Đang chờ",
    
    // Bảng điều khiển
    "dashboard.welcome": "Chào mừng đến với Bảng điều khiển",
    "dashboard.campaigns": "Chiến dịch của bạn",
    "dashboard.donations": "Quyên góp của bạn",
    "dashboard.total": "Tổng quyên góp",
    
    // Các nút và thông báo
    "button.viewMore": "Xem thêm",
    "button.browse": "Khám phá chiến dịch",
    "button.save": "Lưu",
    "button.cancel": "Hủy",
    "button.close": "Đóng",
    "button.edit": "Chỉnh sửa",
    "button.delete": "Xóa",
    
    // Thông báo
    "toast.success": "Thành công",
    "toast.error": "Lỗi",
    "toast.login.success": "Đăng nhập thành công",
    "toast.login.error": "Đăng nhập thất bại",
    "toast.register.success": "Tạo tài khoản thành công",
    "toast.register.error": "Đăng ký thất bại",
    "toast.campaign.created": "Tạo chiến dịch thành công",
    "toast.donation.success": "Quyên góp thành công",
    "toast.admin.approve": "Phê duyệt thành công",
    
    // Footer
    "footer.about": "Về chúng tôi",
    "footer.contact": "Liên hệ",
    "footer.privacy": "Chính sách bảo mật",
    "footer.terms": "Điều khoản dịch vụ",
    "footer.copyright": "© 2025 VolunteerHaven. Bản quyền thuộc về VolunteerHaven.",
    
    // Ngôn ngữ
    "language.en": "Tiếng Anh",
    "language.vi": "Tiếng Việt",
  }
};

// Cung cấp LanguageProvider cho ứng dụng
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Lấy ngôn ngữ từ localStorage nếu có, mặc định là tiếng Anh
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || "en"
  );

  // Hàm dịch văn bản
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Cập nhật ngôn ngữ và lưu vào localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  // Cập nhật thuộc tính lang của HTML khi ngôn ngữ thay đổi
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook để sử dụng context ngôn ngữ
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
}