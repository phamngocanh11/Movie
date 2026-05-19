const successResponse = (res, data = null, message = "Success", status = 200, extra = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    ...extra,
  });
};

const errorResponse = (res, message = "Internal server error", status = 500, extra = {}) => {
  return res.status(status).json({
    success: false,
    message,
    ...extra,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
