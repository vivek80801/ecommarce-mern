import express from "express";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import { join, resolve } from "path";
import { mongo_uri } from "./controllers/services/microservices/db";
import {
  myPassport,
  jwtPassport,
} from "./controllers/services/microservices/passport";
import { router } from "./routes/user";
import { productRouter } from "./routes/product";
import { cartRouter } from "./routes/cart";

export const app = express();

myPassport(passport);
jwtPassport(passport);

app.use(express.static(join(resolve(__dirname.replace("/src", "/public")))));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "something",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 5 },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI ?? mongo_uri }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ msg: "Hello world" });
});

app.use("/user/", router);
app.use(
  "/products/",
  passport.authenticate("jwt", { session: false }),
  productRouter
);
app.use(
  "/api/cart/",
  passport.authenticate("jwt", { session: false }),
  cartRouter
);

app.use((req, res) => {
  res.json({ msg: "page not found" });
});

if (process.env.NODE_ENV === "production") {
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (err) {
        res.json({ msg: "something went wrong" });
      } else {
        next();
      }
    }
  );
}
