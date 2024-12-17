import {
  User,
  Repository,
  Documentation,
  GenerateRequest,
} from "../models/index.js";

export default class AdminService {
  constructor() {}

  async getAllUsers() {
    try {
      const users = await User.find({}).countDocuments();
      return { success: true, data: users };
    } catch (error) {
      throw error;
    }
  }

  async getActiveUsers() {
    try {
      let activeUsers = [];
      const repos = await Repository.find({});
      const users = await User.find({});

      users.forEach((user) => {
        const isInRepos = repos.some((repo) => repo.userId == user._id);
        if (isInRepos) {
          activeUsers.push(user.data);
        }
      });
      const countActiveUsers = activeUsers.length;

      return { success: true, data: countActiveUsers };
    } catch (error) {
      throw error;
    }
  }

  async getInactiveUsers() {
    try {
      let inactiveUsers = [];
      const repos = await Repository.find({});
      const users = await User.find({});

      users.forEach((user) => {
        const isInRepos = repos.some((repo) => repo.userId == user._id);
        if (!isInRepos) {
          inactiveUsers.push(user.data);
        }
      });
      const countInactiveUsers = inactiveUsers.length;

      return { success: true, data: countInactiveUsers };
    } catch (error) {
      throw error;
    }
  }

  async getDailyNewUsers() {
    try {
      const today = new Date();

      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      // Query the database for users created today
      const dailyNewUsers = await User.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }).countDocuments();

      return {
        success: true,
        data: dailyNewUsers,
      };
    } catch (error) {
      throw error;
    }
  }

  async getTotalProjects() {
    try {
      const projects = await Repository.find({}).countDocuments();
      return { success: true, data: projects };
    } catch (error) {
      throw error;
    }
  }

  async getRecentProjects() {
    try {
      const today = new Date();

      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      // Query the database for users created today
      const recentProjects = await Repository.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }).countDocuments();

      return {
        success: true,
        data: recentProjects,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSuccessProjects() {
    try {
      const result = await Documentation.aggregate([
        { $group: { _id: "$repoId" } },
      ]);

      // Safely handle the result and default to 0 if no count is returned
      const count = result.length > 0 ? result.length : 0;
      return {
        success: true,
        data: count,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getFailedProjects() {
    try {
      const failedProjects =
        (await this.getTotalProjects()).data -
        (await this.getSuccessProjects()).data;

      return {
        success: true,
        data: failedProjects,
      };
    } catch (error) {
      throw error;
    }
  }

  async getGenerationRequests() {
    try {
      const generateIdCount = await GenerateRequest.findById(
        process.env.GENERATE_ID
      );

      return {
        success: true,
        data: generateIdCount?.count,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSuccessRate() {
    try {
      let successRate = (await this.getSuccessProjects()).data;
      let generate = (await this.getGenerationRequests()).data;

      const rate = ((successRate / generate) * 100).toFixed(2);
      return {
        success: true,
        data: rate,
      };
    } catch (error) {
      throw error;
    }
  }
}
