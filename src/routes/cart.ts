import { Router } from "express";
import { addToCart, getCart, incCart, decCart } from "../controllers/cart";

export const cartRouter = Router();

cartRouter.get("/", getCart);
cartRouter.post("/add", addToCart);
cartRouter.post("/inc", incCart);
cartRouter.post("/dec", decCart);
