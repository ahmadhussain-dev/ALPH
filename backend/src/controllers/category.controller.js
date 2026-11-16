
import categoryService from "../services/category.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCategory = asyncHandler(
  async (req, res) => {
    const category = await categoryService.createCategory(
      req.validated.body
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  }
);

export const getCategories = asyncHandler(
  async (req, res) => {
    const categories = await categoryService.getCategories();

    res.status(200).json({
      success: true,
      results: categories.length,
      data: { categories },
    });
  }
);
