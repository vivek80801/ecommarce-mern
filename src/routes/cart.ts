import { Router } from "express";
import {
  addToCart,
  getCart,
  incCart,
  decCart,
  deleteFromCart,
} from "../controllers/cart";

export const cartRouter = Router();

cartRouter.get("/", getCart);
cartRouter.post("/add", addToCart);
cartRouter.put("/inc", incCart);
cartRouter.put("/dec", decCart);
cartRouter.delete("/delete", deleteFromCart);
