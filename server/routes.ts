import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertCampaignSchema, insertDonationSchema, insertCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Get all campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Error fetching campaigns" });
    }
  });

  // Get featured campaigns
  app.get("/api/campaigns/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const campaigns = await storage.getFeaturedCampaigns(limit);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured campaigns" });
    }
  });

  // Get campaign by ID
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Error fetching campaign" });
    }
  });

  // Create campaign (protected)
  app.post("/api/campaigns", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create a campaign" });
    }
    
    try {
      const user = req.user;
      
      if (user.userType !== "organization") {
        return res.status(403).json({ message: "Only organizations can create campaigns" });
      }
      
      const campaignData = insertCampaignSchema.parse({
        ...req.body,
        organizationId: user.id
      });
      
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating campaign" });
    }
  });

  // Update campaign (protected)
  app.patch("/api/campaigns/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to update a campaign" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (campaign.organizationId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own campaigns" });
      }
      
      const updatedCampaign = await storage.updateCampaign(id, req.body);
      res.json(updatedCampaign);
    } catch (error) {
      res.status(500).json({ message: "Error updating campaign" });
    }
  });

  // Delete campaign (protected)
  app.delete("/api/campaigns/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to delete a campaign" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (campaign.organizationId !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own campaigns" });
      }
      
      await storage.deleteCampaign(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting campaign" });
    }
  });

  // Get campaigns by organization
  app.get("/api/organizations/:id/campaigns", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaigns = await storage.getCampaignsByOrganization(id);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Error fetching organization campaigns" });
    }
  });

  // Get campaigns by category
  app.get("/api/categories/:name/campaigns", async (req, res) => {
    try {
      const name = req.params.name;
      const campaigns = await storage.getCampaignsByCategory(name);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category campaigns" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  // Create a donation (protected)
  app.post("/api/donations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to make a donation" });
    }
    
    try {
      const donationData = insertDonationSchema.parse({
        ...req.body,
        donorId: req.user.id
      });
      
      // Check if campaign exists
      const campaign = await storage.getCampaign(donationData.campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Create donation
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating donation" });
    }
  });

  // Get donations by campaign
  app.get("/api/campaigns/:id/donations", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const donations = await storage.getDonationsByCampaign(id);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donations" });
    }
  });

  // Get user donations (protected)
  app.get("/api/user/donations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view your donations" });
    }
    
    try {
      const donations = await storage.getDonationsByUser(req.user.id);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user donations" });
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  // Get user profile (protected)
  app.get("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view your profile" });
    }
    
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  // Update user profile (protected)
  app.patch("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to update your profile" });
    }
    
    try {
      const updates = req.body;
      
      // Don't allow changing username, email, or userType through this endpoint
      delete updates.username;
      delete updates.email;
      delete updates.userType;
      delete updates.password;
      
      const updatedUser = await storage.updateUser(req.user.id, updates);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  // ADMIN ROUTES
  // Middleware to check if user is admin
  const isAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in" });
    }
    
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "You must be an admin to access this resource" });
    }
    
    next();
  };

  // Get all organizations for admin
  app.get("/api/admin/organizations", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching organizations" });
    }
  });

  // Get pending campaigns for admin
  app.get("/api/admin/campaigns/pending", isAdmin, async (req, res) => {
    try {
      const campaigns = await storage.getPendingCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending campaigns" });
    }
  });

  // Approve organization
  app.patch("/api/admin/organizations/:id/approve", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      if (user.userType !== "organization") {
        return res.status(400).json({ message: "User is not an organization" });
      }
      
      const updatedUser = await storage.updateUser(id, { isApproved: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error approving organization" });
    }
  });

  // Reject organization
  app.patch("/api/admin/organizations/:id/reject", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      if (user.userType !== "organization") {
        return res.status(400).json({ message: "User is not an organization" });
      }
      
      const updatedUser = await storage.updateUser(id, { isApproved: false });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error rejecting organization" });
    }
  });

  // Approve campaign
  app.patch("/api/admin/campaigns/:id/approve", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const updatedCampaign = await storage.updateCampaign(id, { isApproved: true });
      res.json(updatedCampaign);
    } catch (error) {
      res.status(500).json({ message: "Error approving campaign" });
    }
  });

  // Reject campaign
  app.patch("/api/admin/campaigns/:id/reject", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const updatedCampaign = await storage.updateCampaign(id, { isApproved: false, isActive: false });
      res.json(updatedCampaign);
    } catch (error) {
      res.status(500).json({ message: "Error rejecting campaign" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
