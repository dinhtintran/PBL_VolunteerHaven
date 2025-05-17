import { PrismaClient } from "@prisma/client";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const prisma = new PrismaClient();

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 giờ
    });
  }

  // User operations
  async getUser(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: InsertUser) {
    return prisma.user.create({ data: user });
  }

  async updateUser(id: number, user: Partial<User>) {
    return prisma.user.update({ where: { id }, data: user });
  }

  async getAllUsers() {
    return prisma.user.findMany();
  }

  // Campaign operations
  async getCampaign(id: number) {
    return prisma.campaign.findUnique({ where: { id } });
  }

  async getCampaignsByOrganization(organizationId: number) {
    return prisma.campaign.findMany({ where: { organizationId } });
  }

  async getAllCampaigns() {
    return prisma.campaign.findMany();
  }

  async getFeaturedCampaigns(limit: number = 3) {
    return prisma.campaign.findMany({
      where: { isActive: true, isApproved: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async getPendingCampaigns() {
    return prisma.campaign.findMany({ where: { isApproved: false } });
  }

  // async createCampaign(campaign: InsertCampaign) {
  //   return prisma.campaign.create({ data:  });
  // }
  async createCampaign(campaign: InsertCampaign) {
  return prisma.campaign.create({ data: campaign });
}


  async updateCampaign(id: number, campaign: Partial<Campaign>) {
    return prisma.campaign.update({ where: { id }, data: campaign });
  }

  async deleteCampaign(id: number) {
    await prisma.campaign.delete({ where: { id } });
    return true;
  }

  // Donation operations
  async getDonation(id: number) {
    return prisma.donation.findUnique({ where: { id } });
  }

  async getDonationsByCampaign(campaignId: number) {
    return prisma.donation.findMany({ where: { campaignId } });
  }

  async getDonationsByUser(userId: number) {
    return prisma.donation.findMany({ where: { donorId: userId } });
  }

  async createDonation(donation: InsertDonation) {
    return prisma.donation.create({ data: donation });
  }

  // Category operations
  async getCategory(id: number) {
    return prisma.category.findUnique({ where: { id } });
  }

  async getCategoryByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  }

  async getAllCategories() {
    return prisma.category.findMany();
  }

  async createCategory(category: InsertCategory) {
    return prisma.category.create({ data: category });
  }

  // Stats
  async getStats() {const totalProjects = await prisma.campaign.count();
    const totalDonors = await prisma.user.count({ where: { userType: "donor" } });
    const totalDonated = await prisma.donation.aggregate({ _sum: { amount: true } });

    return {
      totalProjects,
      totalDonors,
      totalDonated: totalDonated._sum.amount || 0,
    };
  }
}

export const storage = new DatabaseStorage();