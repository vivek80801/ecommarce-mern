import { Router } from "express";
import { addToCart, getCart } from "../controllers/cart";

export const cartRouter = Router();

cartRouter.get("/", getCart);
cartRouter.post("/add", addToCart);
