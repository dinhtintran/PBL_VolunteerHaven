import pool from "./database/connection";
import { type User, type InsertUser, type Campaign, type InsertCampaign, type Donation, type InsertDonation, type Category, type InsertCategory } from "@shared/schema";
import session from "express-session";
import pgSession from "connect-pg-simple";

// Khởi tạo pgSession với pool
const pgStore = pgSession(session);

// Cấu hình session với PostgreSQL store


export class Storage {
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (username, password, email, fullName, userType, bio, profileImage)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user.username, user.password, user.email, user.fullName, user.userType, user.bio, user.profileImage]
    );
    return result.rows[0];
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    const fields = Object.keys(user).map((key, index) => `${key} = $${index + 2}`).join(", ");
    const values = Object.values(user);
    const result = await pool.query(
      `UPDATE users SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || undefined;
  }

  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const result = await pool.query("SELECT * FROM campaigns WHERE id = $1", [id]);
    return result.rows[0] || undefined;
  }

  async getCampaignsByOrganization(organizationId: number): Promise<Campaign[]> {
    const result = await pool.query("SELECT * FROM campaigns WHERE organizationId = $1", [organizationId]);
    return result.rows;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    const result = await pool.query("SELECT * FROM campaigns");
    return result.rows;
  }

  async getFeaturedCampaigns(limit: number = 3): Promise<Campaign[]> {
    const result = await pool.query(
      `SELECT * FROM campaigns WHERE isActive = true AND isApproved = true ORDER BY RANDOM() LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  async getPendingCampaigns(): Promise<Campaign[]> {
    const result = await pool.query("SELECT * FROM campaigns WHERE isApproved = false OR isApproved IS NULL");
    return result.rows;
  }

  async getCampaignsByCategory(category: string): Promise<Campaign[]> {
    const result = await pool.query(
      `SELECT * FROM campaigns WHERE categoryId = (SELECT id FROM categories WHERE name = $1)`,
      [category]
    );
    return result.rows;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const result = await pool.query(
      `INSERT INTO campaigns (title, description, goalAmount, categoryId, organizationId, imageUrl, startDate, endDate)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [campaign.title, campaign.description, campaign.goalAmount, campaign.categoryId, campaign.organizationId, campaign.imageUrl, campaign.startDate, campaign.endDate]
    );
    return result.rows[0];
  }

  async updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign | undefined> {
    const fields = Object.keys(campaign).map((key, index) => `${key} = $${index + 2}`).join(", ");
    const values = Object.values(campaign);
    
    console.log("Fields to update:", fields);
    console.log("Values to update:", values);
  
    if (!fields) {
      throw new Error("No fields to update");
    }
  
    const result = await pool.query(
      `UPDATE campaigns SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0] || undefined;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM campaigns WHERE id = $1", [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Donation operations
  async getDonation(id: number): Promise<Donation | undefined> {
    const result = await pool.query("SELECT * FROM donations WHERE id = $1", [id]);
    return result.rows[0] || undefined;
  }

  async getDonationsByCampaign(campaignId: number): Promise<Donation[]> {
    const result = await pool.query("SELECT * FROM donations WHERE campaignId = $1", [campaignId]);
    return result.rows;
  }

  async getDonationsByUser(userId: number): Promise<Donation[]> {
    const result = await pool.query("SELECT * FROM donations WHERE donorId = $1", [userId]);
    return result.rows;
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const result = await pool.query(
      `INSERT INTO donations (campaignId, donorId, amount, message, isAnonymous)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [donation.campaignId, donation.donorId, donation.amount, donation.message, donation.isAnonymous]
    );
    return result.rows[0];
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    return result.rows[0] || undefined;
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const result = await pool.query("SELECT * FROM categories WHERE name = $1", [name]);
    return result.rows[0] || undefined;
  }

  async getAllCategories(): Promise<Category[]> {
    const result = await pool.query("SELECT * FROM categories");
    return result.rows;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await pool.query(
      `INSERT INTO categories (name, description, imageUrl)
       VALUES ($1, $2, $3) RETURNING *`,
      [category.name, category.description, category.imageUrl]
    );
    return result.rows[0];
  }

  // Stats
  async getStats(): Promise<{ totalProjects: number; totalDonors: number; totalDonated: number }> {
    const totalProjectsResult = await pool.query("SELECT COUNT(*) AS total FROM campaigns");
    const totalDonorsResult = await pool.query("SELECT COUNT(DISTINCT donorId) AS total FROM donations");
    const totalDonatedResult = await pool.query("SELECT SUM(amount) AS total FROM donations");

    return {
      totalProjects: parseInt(totalProjectsResult.rows[0].total, 10),
      totalDonors: parseInt(totalDonorsResult.rows[0].total, 10),
      totalDonated: parseFloat(totalDonatedResult.rows[0].total || "0"),
    };
  }
  
  async getFeaturedOrganizations(limit: number = 3): Promise<User[]> {
  const result = await pool.query(
    `SELECT *
     FROM users
     WHERE userTtype = 'organization'
     ORDER BY RANDOM()
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}
    
async getOrganizationById(id: number): Promise<User | undefined> {
        const result = await pool.query(
        `SELECT id, fullName, bio, profileImage, username, email, userType, createdAt
        FROM users
        WHERE id = $1 `,
        [id]
        );
        return result.rows[0];
    }
async updateUserProfile(
  userId: number,
  { fullName, email, profileImage }: { fullName?: string; email?: string; profileImage?: string }
): Promise<void> {
  const fields = [];
  const values = [];
  let index = 1;

  if (fullName) {
    fields.push(`fullName = $${index++}`);
    values.push(fullName);
  }
  if (email) {
    fields.push(`email = $${index++}`);
    values.push(email);
  }
  if (profileImage) {
    fields.push(`profileImage = $${index++}`);
    values.push(profileImage);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(userId);

  const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${index}`;
  await pool.query(query, values);
}
}


export const storage = new Storage();
export const store = new pgStore({
  pool: pool,  // Sử dụng pool kết nối đã cấu hình cho PostgreSQL
  tableName: 'session',  // Tên bảng sẽ chứa thông tin session
});