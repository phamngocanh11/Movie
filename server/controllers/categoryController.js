const Category = require("../models/category");
const { successResponse, errorResponse } = require("../utils/apiResponse");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    return successResponse(res, category, "Category created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return successResponse(res, categories, "Categories fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, "Khong tim thay the loai", 404);
    }

    return successResponse(res, category, "Category fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );

    if (!category) {
      return errorResponse(res, "Khong tim thay the loai", 404);
    }

    return successResponse(res, category, "Category updated");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return errorResponse(res, "Khong tim thay the loai", 404);
    }

    return successResponse(res, {}, "Category deleted");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
