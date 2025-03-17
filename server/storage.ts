import { users, type User, type InsertUser, campaigns, type Campaign, type InsertCampaign, donations, type Donation, type InsertDonation, categories, type Category, type InsertCategory } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Campaign operations
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaignsByOrganization(organizationId: number): Promise<Campaign[]>;
  getAllCampaigns(): Promise<Campaign[]>;
  getFeaturedCampaigns(limit?: number): Promise<Campaign[]>;
  getCampaignsByCategory(category: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  // Donation operations
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationsByCampaign(campaignId: number): Promise<Donation[]>;
  getDonationsByUser(userId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  
  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Stats
  getStats(): Promise<{
    totalProjects: number;
    totalDonors: number;
    totalDonated: number;
  }>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private donations: Map<number, Donation>;
  private categories: Map<number, Category>;
  
  private userIdCounter: number;
  private campaignIdCounter: number;
  private donationIdCounter: number;
  private categoryIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.donations = new Map();
    this.categories = new Map();
    
    this.userIdCounter = 1;
    this.campaignIdCounter = 1;
    this.donationIdCounter = 1;
    this.categoryIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with sample data
    this.seedCategories();
    this.seedUsers();
    this.seedCampaigns();
    this.seedDonations();
  }
  
  private seedCategories() {
    const defaultCategories = [
      { name: "Education", description: "Support educational initiatives", imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643", campaignCount: 0 },
      { name: "Health", description: "Support health and medical initiatives", imageUrl: "https://images.unsplash.com/photo-1577211908983-8d3738bb028c", campaignCount: 0 },
      { name: "Environment", description: "Support environmental protection projects", imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b", campaignCount: 0 },
      { name: "Children", description: "Support children's welfare programs", imageUrl: "https://images.unsplash.com/photo-1594708767771-a5e9d3c87a67", campaignCount: 0 },
      { name: "Disaster Relief", description: "Support disaster recovery efforts", imageUrl: "https://images.unsplash.com/photo-1623600989906-6aae5aa131d4", campaignCount: 0 }
    ];
    
    defaultCategories.forEach(category => {
      const id = this.categoryIdCounter++;
      this.categories.set(id, { ...category, id });
    });
  }
  
  private seedUsers() {
    // Tạo tài khoản admin
    const adminUser = {
      id: this.userIdCounter++,
      username: "admin",
      password: "$2b$10$3euPcmQFCiblsZeEu5s7p.9MQNCMfpO5v0xW.0GXZxk5nQBghU3/e", // "admin123"
      email: "admin@givehope.org",
      fullName: "System Administrator",
      userType: "admin",
      bio: "System Administrator with full access",
      profileImage: "https://ui-avatars.com/api/?name=System+Administrator&background=0D8ABC&color=fff",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    };
    this.users.set(adminUser.id, adminUser);
    
    // Tạo tài khoản tổ chức từ thiện
    const organizations = [
      {
        username: "childrenfund",
        password: "$2b$10$3euPcmQFCiblsZeEu5s7p.9MQNCMfpO5v0xW.0GXZxk5nQBghU3/e", // "admin123"
        email: "info@childrenfund.org",
        fullName: "Children's Hope Foundation",
        userType: "organization",
        bio: "Supporting children in need across the world",
        profileImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
        isApproved: true
      },
      {
        username: "greenearthorg",
        password: "$2b$10$3euPcmQFCiblsZeEu5s7p.9MQNCMfpO5v0xW.0GXZxk5nQBghU3/e", // "admin123"
        email: "contact@greenearth.org",
        fullName: "Green Earth Initiative",
        userType: "organization",
        bio: "Working for a cleaner and greener planet",
        profileImage: "https://images.unsplash.com/photo-1552799446-159ba9523315",
        isApproved: true
      },
      {
        username: "medicalhope",
        password: "$2b$10$3euPcmQFCiblsZeEu5s7p.9MQNCMfpO5v0xW.0GXZxk5nQBghU3/e", // "admin123"
        email: "support@medicalhope.org",
        fullName: "Medical Hope International",
        userType: "organization",
        bio: "Providing medical assistance to underserved communities",
        profileImage: "https://images.unsplash.com/photo-1584515933487-779824d29309",
        isApproved: true
      },
      {
        username: "neworganization",
        password: "$2b$10$3euPcmQFCiblsZeEu5s7p.9MQNCMfpO5v0xW.0GXZxk5nQBghU3/e", // "admin123"
        email: "new@organization.org",
        fullName: "New Relief Organization",
        userType: "organization",
        bio: "Recently established organization waiting for approval",
        profileImage: "https://images.unsplash.com/photo-1636633762833-5d1658f1e29b",
        isApproved: false
      }
    ];
    
    organizations.forEach(org => {
      const id = this.userIdCounter++;
      this.users.set(id, { ...org, id, createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) });
    });
    
    // Tạo tài khoản người dùng thường
    const donors = [
      {
        username: "johndoe",
        password: "$2b$10$3euPcmQFCiblsZeEu5s7p.9MQNCMfpO5v0xW.0GXZxk5nQBghU3/e", // "admin123"
        email: "john.doe@example.com",
        fullName: "John Doe",
        userType: "donor",
        bio: "Regular donor supporting various causes",
        profileImage: "https://images.unsplash.com/photo-1548544149-4835e62ee5b3"
      },
      {
        username: "janesmith",
        password: "$2b$10$3euPcmQFCiblsZeEu5s7p.9MQNCMfpO5v0xW.0GXZxk5nQBghU3/e", // "admin123"
        email: "jane.smith@example.com",
        fullName: "Jane Smith",
        userType: "donor",
        bio: "Passionate about helping children",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
      }
    ];
    
    donors.forEach(donor => {
      const id = this.userIdCounter++;
      this.users.set(id, { ...donor, id, createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) });
    });
  }
  
  private seedCampaigns() {
    // Lấy danh sách tổ chức
    const organizations = Array.from(this.users.values()).filter(user => 
      user.userType === "organization" && user.isApproved === true
    );
    
    if (organizations.length === 0) return;
    
    // Lấy danh sách danh mục
    const categories = Array.from(this.categories.values());
    if (categories.length === 0) return;
    
    const campaigns = [
      {
        title: "Build literacy points for mountain children",
        description: "This campaign aims to establish literacy centers in remote mountain villages, providing books, educational materials, and trained volunteers to help children learn to read and write. Many children in these areas lack access to basic education, and our literacy centers will become focal points for learning in their communities.\n\nYour donation will help us purchase books, training materials, and support volunteer teachers. Each literacy center can serve about 50 children, and we aim to set up 10 centers in the first phase of this project.\n\nWith improved literacy, these children will have better opportunities for continuing education and breaking the cycle of poverty.",
        goalAmount: 100000,
        currentAmount: 65800,
        category: "Education",
        imageUrl: "https://images.unsplash.com/photo-1605339837222-5c1d67c4602c",
        isActive: true
      },
      {
        title: "Provide medicine for poor children in remote areas",
        description: "This campaign focuses on bringing essential medicines and healthcare support to children in remote villages with limited access to medical facilities. Many children in these areas suffer from preventable and treatable illnesses due to lack of basic medications and healthcare knowledge.\n\nFunds raised will be used to purchase medicine kits, basic diagnostic equipment, and to train local health volunteers who can provide ongoing support. We will also conduct mobile medical camps in villages that are far from hospitals.\n\nEvery child deserves access to basic healthcare. Your support will help keep vulnerable children healthy and able to attend school regularly.",
        goalAmount: 50000,
        currentAmount: 22500,
        category: "Health",
        imageUrl: "https://images.unsplash.com/photo-1560252829-804f1aedf1be",
        isActive: true
      },
      {
        title: "Scholarships for outstanding students",
        description: "Many talented students from disadvantaged backgrounds are forced to abandon their education due to financial constraints. This scholarship program identifies academically gifted students from poor families and provides them with comprehensive support to continue their education.\n\nYour donation will cover school fees, books, supplies, uniform, and mentorship support. Each scholarship follows a student for multiple years, ensuring they can complete important educational milestones without interruption.\n\nBy investing in these bright minds, we're not just changing individual lives but also building future leaders who will contribute to their communities and society at large.",
        goalAmount: 75000,
        currentAmount: 40000,
        category: "Education",
        imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
        isActive: true
      },
      {
        title: "Clean Water Initiative for Rural Communities",
        description: "Access to clean water remains a critical challenge for many rural communities. This campaign aims to install water purification systems and wells in villages where clean water is scarce, forcing residents to walk long distances or use contaminated sources.\n\nThe funds will support the construction of wells, installation of filtration systems, and community training on water management and hygiene practices. Each water point can serve approximately 200-300 people, dramatically improving health outcomes and quality of life.\n\nClean water means fewer waterborne diseases, more time for education and work instead of water collection, and improved overall community wellbeing.",
        goalAmount: 80000,
        currentAmount: 35000,
        category: "Environment",
        imageUrl: "https://images.unsplash.com/photo-1626040245147-78f179946376",
        isActive: true
      },
      {
        title: "Emergency Relief for Flood Victims",
        description: "Recent devastating floods have displaced thousands of families, leaving them without shelter, food, and basic necessities. This emergency campaign aims to provide immediate relief to affected communities in the hardest-hit areas.\n\nYour contribution will help deliver emergency food packages, clean water, hygiene kits, temporary shelters, and medical assistance to families who have lost everything. We have teams already on the ground coordinating with local authorities to reach those most in need.\n\nIn times of crisis, rapid response can save lives. Help us extend a helping hand to those facing this catastrophic situation.",
        goalAmount: 120000,
        currentAmount: 87000,
        category: "Disaster Relief",
        imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5",
        isActive: true
      }
    ];
    
    campaigns.forEach(campaign => {
      const id = this.campaignIdCounter++;
      const org = organizations[Math.floor(Math.random() * organizations.length)];
      const startDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + (90 + Math.random() * 90) * 24 * 60 * 60 * 1000);
      
      // Update category campaign count
      const category = categories.find(c => c.name === campaign.category);
      if (category) {
        this.categories.set(category.id, {
          ...category,
          campaignCount: category.campaignCount + 1
        });
      }
      
      this.campaigns.set(id, {
        ...campaign,
        id,
        organizationId: org.id,
        startDate,
        endDate,
        createdAt: startDate
      });
    });
  }
  
  private seedDonations() {
    const campaigns = Array.from(this.campaigns.values());
    if (campaigns.length === 0) return;
    
    const donors = Array.from(this.users.values()).filter(user => user.userType === "donor");
    if (donors.length === 0) return;
    
    // Generate some donations for each campaign
    campaigns.forEach(campaign => {
      const numberOfDonations = Math.floor(Math.random() * 10) + 5; // 5-15 donations per campaign
      
      for (let i = 0; i < numberOfDonations; i++) {
        const donor = donors[Math.floor(Math.random() * donors.length)];
        const amount = Math.floor(Math.random() * 5000) + 500; // Random amount between $500 and $5500
        const createdAt = new Date(campaign.startDate.getTime() + Math.random() * (Date.now() - campaign.startDate.getTime()));
        const isAnonymous = Math.random() > 0.7; // 30% chance of anonymous donation
        
        const id = this.donationIdCounter++;
        const donation = {
          id,
          campaignId: campaign.id,
          donorId: donor.id,
          amount,
          message: isAnonymous ? null : "Proud to support this important cause!",
          isAnonymous,
          createdAt
        };
        
        this.donations.set(id, donation);
      }
    });
    
    // Update campaign amounts based on donations
    this.campaigns.forEach((campaign, id) => {
      const campaignDonations = Array.from(this.donations.values()).filter(d => d.campaignId === id);
      const totalDonated = campaignDonations.reduce((sum, donation) => sum + donation.amount, 0);
      
      this.campaigns.set(id, {
        ...campaign,
        currentAmount: totalDonated
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }
  
  async getCampaignsByOrganization(organizationId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(
      campaign => campaign.organizationId === organizationId
    );
  }
  
  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }
  
  async getFeaturedCampaigns(limit: number = 3): Promise<Campaign[]> {
    return Array.from(this.campaigns.values())
      .filter(campaign => campaign.isActive)
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
  }
  
  async getCampaignsByCategory(category: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(
      campaign => campaign.category === category
    );
  }
  
  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignIdCounter++;
    const createdAt = new Date();
    const campaign: Campaign = { 
      ...insertCampaign, 
      id, 
      currentAmount: 0,
      createdAt 
    };
    this.campaigns.set(id, campaign);
    
    // Update category campaign count
    const category = Array.from(this.categories.values()).find(
      category => category.name === campaign.category
    );
    
    if (category) {
      this.categories.set(category.id, {
        ...category,
        campaignCount: category.campaignCount + 1
      });
    }
    
    return campaign;
  }
  
  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
  
  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }
  
  // Donation operations
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }
  
  async getDonationsByCampaign(campaignId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      donation => donation.campaignId === campaignId
    );
  }
  
  async getDonationsByUser(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      donation => donation.donorId === userId
    );
  }
  
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.donationIdCounter++;
    const createdAt = new Date();
    const donation: Donation = { ...insertDonation, id, createdAt };
    this.donations.set(id, donation);
    
    // Update campaign current amount
    const campaign = this.campaigns.get(donation.campaignId);
    if (campaign) {
      this.campaigns.set(campaign.id, {
        ...campaign,
        currentAmount: campaign.currentAmount + donation.amount
      });
    }
    
    return donation;
  }
  
  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      category => category.name === name
    );
  }
  
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id, campaignCount: 0 };
    this.categories.set(id, category);
    return category;
  }
  
  // Stats
  async getStats(): Promise<{ totalProjects: number, totalDonors: number, totalDonated: number }> {
    const totalProjects = this.campaigns.size;
    
    // Count unique donors
    const uniqueDonorIds = new Set(
      Array.from(this.donations.values()).map(donation => donation.donorId)
    );
    const totalDonors = uniqueDonorIds.size;
    
    // Sum up all donations
    const totalDonated = Array.from(this.donations.values())
      .reduce((sum, donation) => sum + donation.amount, 0);
    
    return {
      totalProjects,
      totalDonors,
      totalDonated
    };
  }
}

export const storage = new MemStorage();
