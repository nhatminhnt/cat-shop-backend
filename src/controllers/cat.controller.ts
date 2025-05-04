import { Request, Response } from "express";
import Cat from "../models/cat.model";

export const getCats = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const breed = req.query.breed ? { breed: req.query.breed } : {};

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // sorting MongoDB
    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const filter = { ...keyword, ...breed };

    const cats = await Cat.find(filter)
      .sort({ [sortField.toString()]: sortOrder }) // sắp xếp theo trường và hướng
      .skip(skip)
      .limit(limit);

    const total = await Cat.countDocuments(filter); // tổng số kết quả

    res.json({
      data: cats,
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const createCat = async (req: Request, res: Response) => {
  try {
    const { name, price, breed, age, description, imageUrl } = req.body;

    if (!name || !price || !breed || !age || !description || !imageUrl) {
      return res.status(400).json({
        message:
          "Vui lòng cung cấp đầy đủ các trường: name, price, breed, age, description, imageUrl.",
      });
    }

    const cat = await Cat.create({
      name,
      price,
      breed,
      age,
      description,
      imageUrl,
    });

    return res.status(201).json(cat);
  } catch (error) {
    console.error("Lỗi khi tạo mèo:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, không thể tạo mèo.", error });
  }
};

export const updateCat = async (req: Request, res: Response) => {
  const { name, price, breed, age, description, imageUrl } = req.body;
  const cat = await Cat.findById(req.params.id);

  if (!cat) {
    return res.status(404).json({ message: "Không tìm thấy mèo" });
  }

  cat.name = name || cat.name;
  cat.price = price || cat.price;
  cat.breed = breed || cat.breed;
  cat.age = age || cat.age;
  cat.description = description || cat.description;
  cat.imageUrl = imageUrl || cat.imageUrl;

  const updatedCat = await cat.save();
  res.json(updatedCat);
};

export const deleteCat = async (req: Request, res: Response) => {
  const cat = await Cat.findById(req.params.id);

  if (!cat) {
    return res.status(404).json({ message: "Cat not found" });
  }

  await cat.deleteOne();
  res.json({ message: "Cat removed" });
};
