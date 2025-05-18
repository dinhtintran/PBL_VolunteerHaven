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
    "app.name": "CharityHaven",
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
    "nav.editProfile": "Edit Profile",
    // Trang chủ
    "home.featured": "Featured fundraising",
    "home.featured1": "campaigns",
    "home.des": "Children's relief campaign - Join us to bring better opportunities to disadvantaged children in mountain areas.",
    "home.des1":"Children's Relief Campaigns",
    "home.des2":"Campaigns that need community support",
    "home.des3":"Charitable Community Actions",
    "home.des4":"Figures from March 2025",
    "home.des5":"Community Help Campaigns",
    "home.des6":"Featured Organizations and Individuals",
    "home.des7":"Individuals and organizations creating positive change",
    "home.des8":"Ready to donate?",
    "home.des9":"Join us today.",
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
    "auth.sex":"Sex",
    "auth.sexgirl":"Female",
    "auth.sexboy":"Male",
    "auth.sexother":"Other",
    "auth.bday":"Day of birth",
    "auth.address":"Address",
    "auth.intro":"Introduction",
    "auth.phone":"Phone number",
     "auth.des":"You haven't created any campaigns yet",
    "auth.des1":"Start your first fundraising campaign to make a difference",
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
    "campaign.name":"Name",
    
    
    //Về VolunteerHaven
    "about.tilte": "About VolunteerHaven",
    "about.des": "VolunteerHaven is an integrated technology solution including a mobile application and a transparent 4-digit volunteer account. The product is dedicated to organizations and individuals who need to raise funds for the community in a transparent, effective and convenient way.",
    "about.tilte1": "Vision 2025",
    "about.tilte2": "Technology for the community",
    "about.tilte3": "Core values",
    "about.tilte4": "Solutions to promote transparency",
    "about.tilte5": "24/7 public transparency",
    "about.tilte6": "Free 4-digit account",
    "about.tilte7": "Easily create fundraising goals",
    "about.tilte8": "Expand community connections",
    "about.des1": "Become a network The first charity in Vietnam for the transparent community.",
    "about.des2":"Applying technology to charity and humanitarian activities, promoting transparency.",
    "about.des3":"Transparent, sharing, connecting, convenient.",
    "about.des4":"Automatic reporting, statistics and sharing system. Support for exporting statement reports upon request.",
    "about.des5":"The first bank account in Vietnam with only 4 digits, dedicated to charity purposes, automatic transparent statement.",
    "about.des6":"Design, manage and update charity activities with just a few simple steps.",
    "about.des7":"Spread fundraising goals to more than 20 million users in the MBBank App ecosystem.",
    "about.des8":"Ready to act for the community?",
    "about.des9":"Join VolunteerHaven now to create positive change.",
    
    //Contact
    "contact.name":"Full name",
    "contact.email":"Email",
    "contact.message":"Message",
    "contact.send":"Send message",
    "contact.phone":"Phone",
    "contact.time":"Working time",
    "contact.time1":"9am - 5pm (Mon - Fri)",
    "contact.subtitle": "We’d love to hear from you. Send us a message and we’ll get back soon",

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
    "admin.campaignsPe": "Pending Campaigns",
    "admin.organizationsPe": "Pending Campaigns",
    "admin.campaigns": "Campaigns",
    "admin.organizations": "Organizations",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.status": "Status",
    "admin.approved": "Approved",
    "admin.pending": "Pending",
    "admin.des": "Manage organizations and campaigns",
    "admin.org-wait":"Organizations waiting for approval",
    "admin.registered-date":"Registered Date",
    "admin.action":"Action",
    "admin.noPeddingOrg":"No pending organizations",
    "admin.allOrgReviewed":"All organizations have been reviewed",

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
    
    //Edit profile
    "profile.editTitle":"Edit Profile",
    "profile.information":"Profile Information",
    "profile.des":" Your account details and preferences",

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
    "app.name": "CharityHaven",
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
    "nav.editProfile": "Sử hồ sơ",
    
    // Trang chủ
    "home.featured": "Chiến dịch gây quỹ",
    "home.featured1": "nổi bật",
    "home.des": "Chiến dịch cứu trợ trẻ em - Hãy tham gia cùng chúng tôi để mang lại cơ hội tốt hơn cho trẻ em thiệt thòi ở vùng núi.",
    "home.des1":"Chiến dịch cứu trợ trẻ em",
    "home.des2":"Các chiến dịch cần sự hỗ trợ của cộng đồng",
    "home.des3":"Hành động từ thiện của cộng đồng",
    "home.des4":"Số liệu từ tháng 3 năm 2025",
    "home.des5":"Chiến dịch hỗ trợ cộng đồng",
    "home.des6":"Các tổ chức và cá nhân nổi bật",
    "home.des7":"Các cá nhân và tổ chức tạo ra sự thay đổi tích cực",
    "home.des8":"Sẵn sàng quyên góp chưa?",
    "home.des9":"Tham gia cùng chúng tôi ngay hôm nay.",
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
    "auth.sex":"Giới tính",
    "auth.sexgirl":"Nữ",
    "auth.sexboy":"Nam",
    "auth.sexother":"Khác",
    "auth.bday":"Ngày tháng năm sinh",
    "auth.address":"Địa chỉ",
    "auth.intro":"Giới thiệu bản thân",
    "auth.phone":"Số điện thoại",
    "profile.editTitle":"Chỉnh sửa hồ sơ",
    "profile.information":"Thông tin cá nhân",
    "profile.des":" Chi tiết tài khoản và sở thích của bạn",
    "auth.des":"Bạn chưa tạo dự án nào trước đây",
    "auth.des1":"Bắt đầu chiến dịch gây quỹ đầu tiên của bạn để tạo nên sự khác biệt",
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
    
    // Về VolunteerHaven
    "about.tilte": "Giới thiệu về VolunteerHaven",
    "about.des": "VolunteerHaven là giải pháp công nghệ tích hợp gồm ứng dụng di động và tài khoản thiện nguyện minh bạch 4 số. Sản phẩm được dành tặng cho các tổ chức, cá nhân có nhu cầu gây quỹ vì cộng đồng một cách minh bạch, hiệu quả và tiện lợi.",
    "about.tilte1": "Tầm nhìn 2025",
    "about.tilte2": "Công nghệ vì cộng đồng",
    "about.tilte3": "Giá trị cốt lõi",
    "about.tilte4": "Giải pháp thúc đẩy tính minh bạch",
    "about.tilte5": "Minh bạch công khai 24/7",
    "about.tilte6": "Miễn phí tài khoản 4 số",
    "about.tilte7": "Dễ dàng tạo mục tiêu gây quỹ",
    "about.tilte8": "Mở rộng kết nối cộng đồng",
    "about.des1":"Trở thành mạng xã hội thiện nguyện đầu tiên tại Việt Nam dành cho cộng đồng minh bạch.",
    "about.des2":"Ứng dụng công nghệ vào hoạt động thiện nguyện và nhân đạo, thúc đẩy tính minh bạch.",
    "about.des3":"Minh bạch, sẻ chia, kết nối, thuận tiện.",
    "about.des4":"Hệ thống tự động báo cáo, thống kê và chia sẻ. Hỗ trợ xuất báo cáo sao kê theo yêu cầu.",
    "about.des5":"Tài khoản ngân hàng đầu tiên tại Việt Nam chỉ có 4 số, dành riêng cho mục đích thiện nguyện, tự động sao kê minh bạch.",
    "about.des6":"Thiết kế, quản lý và cập nhật hoạt động thiện nguyện chỉ với vài thao tác đơn giản.",
    "about.des7":"Lan tỏa mục tiêu gây quỹ đến hơn 20 triệu người dùng trong hệ sinh thái App MBBank.",
    "about.des8":"Sẵn sàng hành động vì cộng đồng?",
    "about.des9":"Tham gia ngay cùng VolunteerHaven để tạo ra sự thay đổi tích cực.",

    //Contact
    "contact.name":"Họ và tên",
    "contact.email":"Email",
    "contact.message":"Tin nhắn",
    "contact.send":"Gửi tin nhấn",
    "contact.phone":"Điện thoại",
    "contact.time":"Thời gian làm việc",
    "contact.time1":"9:00 Sáng - 5:00 Chiều (T2 - T6)",
    "contact.subtitle": "Chúng tôi rất mong nhận được phản hồi từ bạn. Hãy gửi tin nhắn cho chúng tôi và chúng tôi sẽ sớm phản hồi",
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
    "dashboard.welcome": "Chào mừng đến với bảng điều khiển",
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