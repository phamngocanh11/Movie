const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admin only" });
  }

  next();
};

const requireSelfOrAdminByParam = (paramName = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const targetId = req.params[paramName];
    if (!targetId) {
      return res.status(400).json({ success: false, message: `Missing parameter: ${paramName}` });
    }

    if (req.user.role === "admin" || String(req.user.id) === String(targetId)) {
      return next();
    }

    return res.status(403).json({ success: false, message: "Forbidden" });
  };
};

const requireSelfOrAdminByBody = (fieldName = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const targetId = req.body?.[fieldName];
    if (!targetId) {
      return res.status(400).json({ success: false, message: `Missing field: ${fieldName}` });
    }

    if (req.user.role === "admin" || String(req.user.id) === String(targetId)) {
      return next();
    }

    return res.status(403).json({ success: false, message: "Forbidden" });
  };
};

module.exports = {
  requireAdmin,
  requireSelfOrAdminByParam,
  requireSelfOrAdminByBody,
};
