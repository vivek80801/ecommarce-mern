import { Router } from "express";
import multer from "multer";
import passport from "passport";
import { resolve, join, extname } from "path";
import {
  postAddProduct,
  getProducts,
  deleteProduct,
  editProduct,
} from "../controllers/product";

export const productRouter = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

productRouter.get("/", getProducts);
productRouter.post("/addproduct", upload.single("productImg"), postAddProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.put("/editproduct/:id", upload.single("productImg"), editProduct);
