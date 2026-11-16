
import productService from "../services/product.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(
  async (req, res) => {
    const product = await productService.createProduct(
      req.validated.body
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  }
);

export const updateProduct = asyncHandler(
  async (req, res) => {
    const product = await productService.updateProduct(
      req.validated.params.id,
      req.validated.body
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  }
);

export const deleteProduct = asyncHandler(
  async (req, res) => {
    const product = await productService.deactivateProduct(
      req.validated.params.id
    );

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      data: { product },
    });
  }
);

export const getProducts = asyncHandler(
  async (req, res) => {
    const result = await productService.getProducts(
      req.validated.query
    );

    res.status(200).json({
      success: true,
      results: result.products.length,
      data: result,
    });
  }
);

export const getProductBySlug = asyncHandler(
  async (req, res) => {
    const product = await productService.getProductBySlug(
      req.validated.params.slug
    );

    res.status(200).json({
      success: true,
      data: { product },
    });
  }
);
