import passport from "passport";
import { Strategy } from "passport-local";
import { createHmac } from "crypto";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { UserModal } from "../../../modals/user";
import { User } from "../user";

export const myPassport = (passport: passport.PassportStatic) => {
  passport.use(
    new Strategy((username, password, done) => {
      UserModal.findOne({ username: username })
        .then((user: any) => {
          if (!user) {
            return done(JSON.stringify({ msg: "user can not found" }), false);
          } else {
            const newHash = createHmac("sha256", User.secret)
              .update(password)
              .digest("hex");
            if (user.password === newHash) {
              return done(null, user);
            } else {
              return done(
                JSON.stringify({ msg: "password did not matched" }),
                false
              );
            }
          }
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user: any, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((userId, done) => {
    UserModal.findById(userId).then((user) => {
      if (!user) {
        return done("you are logged out", false);
      } else {
        return done(null, user);
      }
    });
  });
};

export const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};
export const jwtPassport = (passport: passport.PassportStatic) => {
  passport.use(
    new JWTStrategy(opts, (jwt_payload, done) => {
      UserModal.findOne({ _id: jwt_payload.sub }, (err: any, user: any) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
            console.log(jwt_payload)
          console.log(user);
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
