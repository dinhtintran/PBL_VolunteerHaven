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
    
    // Initialize with some categories
    this.seedCategories();
  }
  
  private seedCategories() {
    const defaultCategories = [
      { name: "Education", description: "Support educational initiatives", imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643", campaignCount: 28 },
      { name: "Health", description: "Support health and medical initiatives", imageUrl: "https://images.unsplash.com/photo-1577211908983-8d3738bb028c", campaignCount: 16 },
      { name: "Environment", description: "Support environmental protection projects", imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b", campaignCount: 12 }
    ];
    
    defaultCategories.forEach(category => {
      const id = this.categoryIdCounter++;
      this.categories.set(id, { ...category, id });
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
