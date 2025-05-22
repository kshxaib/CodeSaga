import { db } from "../libs/db.js";

export const submitReport = async (req, res) => {
  const { reason, description, problemId } = req.body;
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
   
 const reports = await db.problemReport.findMany();

    res.status(200).json({
      success: true,
      data:reports,
    });

  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get reports'
    });
  }
};

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
    const {reportId} = req.body

    if(!reportId) {
        return res.status(400).json({ success: false, message: "Report ID is required" })
    }

    try {
         const report = await db.problemReport.findUnique({ 
      where: { id: reportId } 
    });
    
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
     await db.problemReport.delete({ where: { id: reportId } });

        return res.status(200).json({ success: true, message: "Report deleted successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error while deleting report" })
    }
}