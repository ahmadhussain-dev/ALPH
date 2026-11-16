
import Category from "../models/Category.model.js";
import ApiError from "../utils/ApiError.js";

const createCategory = async (data) => {
  const existing = await Category.findOne({
    $or: [
      { name: data.name },
      { slug: data.slug },
    ],
  });

  if (existing) {
    throw new ApiError(409, "Category already exists");
  }

  return Category.create(data);
};

const getCategories = async () => {
  return Category.find({ isActive: true })
    .select("name slug description image")
    .sort({ name: 1 });
};

export default {
  createCategory,
  getCategories,
};
