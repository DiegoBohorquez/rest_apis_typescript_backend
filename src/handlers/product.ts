import { Request, Response } from "express";
import Product from "../models/Product";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    order: [["price", "DESC"]],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  console.log(products);
  res.json({ data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({ data: product });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Actualizar
  await product.update(req.body);
  await product.save();

  res.json({ data: product });
};

export const updateAvaliability = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Actualizar
  product.availability = !product.dataValues.availability;
  await product.save();

  res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Delete

  await product.destroy();
  res.json({ data: "Producto eliminado" });
};
