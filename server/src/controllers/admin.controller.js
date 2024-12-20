import { adminService } from "../services/index.js";

const getAdminData = async (req, res, next) => {
  try {
    // User Management
    const allUsers = (await adminService.getAllUsers())?.data;
    const activeUsers = (await adminService.getActiveUsers())?.data;
    const inactiveUsers = (await adminService.getInactiveUsers())?.data;
    const dailyNewUsers = (await adminService.getDailyNewUsers())?.data;

    // Project Management
    const totalProjects = (await adminService.getTotalProjects())?.data;
    const recentProjects = (await adminService.getRecentProjects())?.data;
    const successProjects = (await adminService.getSuccessProjects())?.data;
    const failedProjects = (await adminService.getFailedProjects())?.data;

    // System Metrics
    const generationRequests = (await adminService.getGenerationRequests())
      ?.data;
    const getSuccessRate = (await adminService.getSuccessRate())?.data;

    const adminData = [
      {
        title: "User Management",
        data: [
          { name: "Total Users", value: allUsers },
          { name: "Active Users", value: activeUsers },
          { name: "Inactive Users", value: inactiveUsers },
          { name: "New Users", value: dailyNewUsers },
        ],
      },
      {
        title: "Project Management",
        data: [
          { name: "Total Projects", value: totalProjects },
          { name: "Recent Projects", value: recentProjects },
          { name: "Success Projects", value: successProjects },
          { name: "Failed Projects", value: failedProjects || 0 },
        ],
      },
      {
        title: "System Metrics",
        data: [
          { name: "Generation Requests", value: generationRequests },
          { name: "Success Rate", value: getSuccessRate },
        ],
      },
    ];

    return res.status(200).json({ success: true, data: adminData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { getAdminData };
