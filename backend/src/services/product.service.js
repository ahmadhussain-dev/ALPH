
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import ApiError from "../utils/ApiError.js";

const createProduct = async (data) => {
  const category = await Category.findOne({
    _id: data.category,
    isActive: true,
  });

  if (!category) {
    throw new ApiError(404, "Active category not found");
  }

  const existing = await Product.findOne({
    slug: data.slug,
  });

  if (existing) {
    throw new ApiError(409, "Product slug already exists");
  }

  return Product.create(data);
};

const updateProduct = async (id, data) => {
  if (data.category) {
    const category = await Category.findOne({
      _id: data.category,
      isActive: true,
    });

    if (!category) {
      throw new ApiError(404, "Active category not found");
    }
  }

  if (data.slug) {
    const existing = await Product.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (existing) {
      throw new ApiError(409, "Product slug already exists");
    }
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  ).populate("category", "name slug");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const deactivateProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const getProducts = async (filters) => {
  const {
    page,
    limit,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  } = filters;

  const query = {
    isActive: true,
  };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.variants = {
      $elemMatch: {
        ...(minPrice !== undefined && {
          price: { $gte: minPrice },
        }),
        ...(maxPrice !== undefined && {
          price: {
            ...(minPrice !== undefined && { $gte: minPrice }),
            $lte: maxPrice,
          },
        }),
      },
    };
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    "price-asc": { "variants.0.price": 1 },
    "price-desc": { "variants.0.price": -1 },
  };

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(sortOptions[sort])
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({
    slug,
    isActive: true,
  }).populate("category", "name slug");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export default {
  createProduct,
  updateProduct,
  deactivateProduct,
  getProducts,
  getProductBySlug,
};
