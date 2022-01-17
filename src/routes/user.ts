import { Router } from "express";
import passport from "passport";
import { postRegister, postLogin, logout } from "../controllers/user";

export const router = Router();

router.get("/");
router.post("/", postRegister);
router.post("/login", postLogin);
router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      console.log(req.user);
      res.json({ msg: "dashboard" });
    } else {
      res.json({ msg: "you are not logged in" });
    }
  }
);

router.get("/logout", passport.authenticate("jwt", { session: false }), logout);
