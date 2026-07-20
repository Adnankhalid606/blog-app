import * as authorRequestService from "../services/authorApplicationService.js";
export const applyForAuthor = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reason } = req.body;
    const blockedRoles = ["author", "admin"];
    if (blockedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: "You are already an author, You cannot apply for author",
      });
    }
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        status: false,
        message: "Reason is Required",
      });
    }
    const isAuthorPending =
      await authorRequestService.findPendingRequestByUserId(userId);
    if (isAuthorPending) {
      return res.status(409).json({
        status: false,
        message: "You already have a pending author request.",
      });
    }
    const authorRequestId = await authorRequestService.createAuthorRequest(
      userId,
      reason,
    );
    res.status(201).json({
      status: true,
      message: "Author Request Created Successfully",
      authorRequestId,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelAuthorApplication = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const pendingRequest  =
      await authorRequestService.findPendingRequestByUserId(userId);
    if (!pendingRequest) {
      return res.status(404).json({
        status: false,
        message: "You don't have any pending author request",
      });
    };
    await authorRequestService.cancelAuthorRequestById(pendingRequest.id);
    res.status(200).json({
      status: true,
      message: "Author Request Cancelled Successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllApplications = async(req, res, next) => {
      try{
        const applications = await authorRequestService.getAllRequests();
        res.status(200).json({
            status: true,
            message: "All Author Requests",
            applications
        })
      }
      catch(err){
        next(err);
      }
};

export const getAllPendingApplications = async (req, res, next) => {
    try{
        const pendingApplications = await authorRequestService.getAllPendingRequests();
        res.status(200).json({
            status: true,
            message: "All Pending Author Requests",
            pendingApplications
        })
    }
    catch(err){
      next(err);
    }
};
export const getApplicationById = async (req, res, next) => {
    const requestId = req.params.id;
    try{
        const application = await authorRequestService.findAuthorRequestById(requestId);
        if(!application){
            return res.status(404).json({
                status: false,
                message: "No Author Request Found"
            })
        }
        res.status(200).json({
            status: true,
            message: "Author Request Found",
            application
        })
    }
    catch(err){
      next(err);
    }
};
export const acceptApplicationById = async (req, res, next)=>{
    const requestId = req.params.id;
    const adminId = req.user.id;
    try{
      const isApplicationPending = await authorRequestService.findAuthorPendingRequestById(requestId);
      if(!isApplicationPending){
        return res.status(404).json({
          status: false,
          message: "No Pending Author Request Found"
        })
      }
      await authorRequestService.acceptRequestById(requestId, adminId);
      res.status(200).json({
        status: true,
        message: "Author Request Accepted Successfully"
      })
    }
    catch(err){
      next(err);
    }
};
export const rejectApplicationById = async (req, res, next)=>{
  const requestId = req.params.id;
  const adminId = req.user.id;
  try{
    const isApplicationPending = await authorRequestService.findAuthorPendingRequestById(requestId);
    if(!isApplicationPending){
      return res.status(404).json({
        status: false,
        message: "No Pending Author Request Found"
      })
    }
    await authorRequestService.rejectRequestById(requestId, adminId);
    res.status(200).json({
      status: true,
      message: "Author Request Rejected Successfully"
    })
  }
  catch(err){
    next(err);
  }
}