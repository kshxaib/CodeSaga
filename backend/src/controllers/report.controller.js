import { db } from "../libs/db.js";

export const submitReport = async (req, res) => {
  const { problemId } = req.params;
  const { reason, description } = req.body;
  const userId = req.user.id;

  if (!problemId || !reason || !userId) {
    return res
      .status(400)
      .json({ error: "Problem ID and reason are required" });
  }

  try {
    const report = await db.problemReport.create({
        data: { userId, problemId, reason, description, status: "PENDING" }
    })

    return res.status(200).json({ success: true, message: "Report submitted successfully", report })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error while submitting report" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const statusFilter = req.query.status; // Optional status filter
    const page = Number(req.query.page) || 1; 
    const limit = Number(req.query.limit) || 10; 

    // Build the filter object
    const filter = {};
    if (statusFilter) {
      filter.status = statusFilter;
    }

    // Get paginated reports
    const reports = await db.problemReport.findMany({
      where: filter,
      skip: (page - 1) * limit, // Calculate how many records to skip
      take: limit, // Number of records to return
      include: {
        user: { select: { username: true } }, // Only include username
        problem: { select: { title: true } } // Only include problem title
      }
    });

    // Get total count of matching reports
    const totalReports = await db.problemReport.count({ where: filter });

    // Calculate total pages
    const totalPages = Math.ceil(totalReports / limit);

    // Send response
    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalReports,
        totalPages
      }
    });

  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get reports'
    });
  }
};
export const getReportById = async (req, res) => {
    const {reportId} = req.params
    if(!reportId) {
        return res.status(400).json({ error: "Report ID is required" })
    }

    try {
        const report = await db.problemReport.findUnique({
            where: {
                id: reportId
            },
            include: {
                user: true,
                problem: true
            }
        })

        if(!report) {
            return res.status(404).json({ error: "Report not found" })
        }

        return res.status(200).json({ success: true, message: "Report fetched successfully", report })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error while fetching report" })
    }
}

export const updateReportStatus = async (req, res) => {
    const {status} = req.body
    const {reportId} = req.params

    if(!reportId || !status) {
        return res.status(400).json({ error: "Report ID and status are required" })
    }

    try {
        const report = await db.problemReport.update({
            where: {
                id: reportId
            },
            data: {
                status
            }
        })

        return res.status(200).json({ success: true, message: "Report status updated successfully", report })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error while updating report status" })
    }
}

export const deleteReport = async (req, res) => {
    const {reportId} = req.params

    if(!reportId) {
        return res.status(400).json({ error: "Report ID is required" })
    }

    try {
         const report = await db.problemReport.findUnique({ 
      where: { id: reportId } 
    });
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
     await db.problemReport.delete({ where: { id: reportId } });

        return res.status(200).json({ success: true, message: "Report deleted successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error while deleting report" })
    }
}

export const deleteMultipleReports = async (req, res) => {
    const {reportIds} = req.body
    if(!reportIds) {
        return res.status(400).json({ error: "Report IDs are required" })
    }

    try {
        const { count } = await db.problemReport.deleteMany({
      where: { id: { in: reportIds } }
    });

    return res.status(200).json({ 
      success: true,
      message: `${count} reports deleted`,
    });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error while deleting reports" })
    }
}