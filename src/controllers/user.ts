import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "./services/user";
import { UserModal } from "../modals/user";
import { opts } from "./services/microservices/passport";

export const postRegister = (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;
  if (username.length === 0 || email.length === 0 || password.length === 0) {
    res.json({ msg: "please fill the form correctly" });
  } else {
    UserModal.findOne({ username: username })
      .then((user: any) => {
        if (user) {
          res.json({ msg: "user already exits" });
        } else {
          const newUser = new User.MyUser(username, email, password);
          newUser.hash();
          newUser.save();
          const userToSend = {
            username: newUser.username,
            email: newUser.email,
          };
          res.json(userToSend);
        }
      })
      .catch((err) => console.log(err));
  }
};

export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.json(err);
    } else {
      if (!user) {
        return res.json({ msg: "you are not logged in" });
      } else {
        req.logIn(user, (err) => {
          if (err) {
            return res.json(err);
          } else {
            const userToSend =
              user.isAdmin !== undefined && user.isAdmin === true
                ? {
                    username: user.username,
                    email: user.email,
                    isAdmin: true,
                  }
                : {
                    username: user.username,
                    email: user.email,
                  };
            const payload = {
              sub: user._id,
              iat: Math.floor(Date.now() / 1000),
            };
            const newJwt = jwt.sign(payload, opts.secretOrKey);
            res.cookie("token", newJwt, { maxAge: 60 * 60 * 1000 });
            return res.json(userToSend);
          }
        });
      }
    }
  })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
  req.logout();
  res.cookie("token", "");
  res.json({ msg: "logout" });
};
