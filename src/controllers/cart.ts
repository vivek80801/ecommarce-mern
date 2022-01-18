import { Request, Response } from "express";
import { UserModal } from "../modals/user";
import { ProductModal } from "../modals/product";
import { User } from "./services/user";

export const addToCart = (req: Request, res: Response) => {
  const { id } = req.body;
  ProductModal.findById(id, (err: any, productDoc: any) => {
    if (err) {
      console.log(err);
    } else {
      if (req.user !== undefined) {
        //@ts-ignore
        UserModal.findById(req.user._id, (err: any, userDoc: any) => {
          if (err) {
            console.log(err);
          } else {
            let matched = false;
            userDoc.cart.map((product: any) => {
              if (product.id != productDoc._doc._id) {
                if (matched) {
                  matched = true;
                } else {
                  matched = false;
                }
              } else {
                matched = true;
              }
            });
            if (!matched) {
              UserModal.updateOne(
                //@ts-ignore
                { _id: req.user._id },
                {
                  $push: {
                    cart: {
                      ...productDoc._doc,
                      quantity: 1,
                      subTotal: productDoc._doc.price,
                    },
                  },
                },
                (err: any, doc: any) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({
                      msg: "ok",
                      cart: {
                        ...productDoc._doc,
                        quantity: 1,
                        subTotal: productDoc._doc.price,
                      },
                    });
                  }
                }
              );
            } else {
              res.json({ msg: "already in cart" });
            }
          }
        });
      }
    }
  });
};

export const getCart = (req: Request, res: Response) => {
  if (req.user !== undefined) {
    //@ts-ignore
    UserModal.findById(req.user._id, (err: any, doc: any) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ msg: "ok", cart: doc.cart });
      }
    });
  } else {
    res.json({ msg: "you are not logged in" });
  }
};

export const incCart = (req: Request, res: Response) => {
  const { id } = req.body;
  let errors = false;
  //@ts-ignore
  UserModal.findById(req.user._id, (err: any, userDoc: any) => {
    if (err) {
      console.log(err);
    } else {
      ProductModal.findById(id, (err: any, productDoc: any) => {
        if (err) {
          console.log(err);
        } else {
          let quan = 1;
          userDoc.cart.map((pro: any) => {
            if (JSON.stringify(pro._id) === JSON.stringify(productDoc._id)) {
              quan = pro.quantity + 1;
            }
          });
          UserModal.updateOne(
            { _id: userDoc._id, "cart._id": productDoc._id },
            {
              $inc: { "cart.$.quantity": 1 },
              $set: { "cart.$.subTotal": productDoc.price * quan },
            },
            (err: any, doc: any) => {
              if (err) {
                console.log(err);
              } else {
                UserModal.findById(userDoc._id, (err: any, newDoc: any) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({
                      msg: "increment quantity of item",
                      cart: newDoc.cart,
                    });
                  }
                });
              }
            }
          );
        }
      });
    }
  });
  if (errors) {
    res.json({ msg: "something went wrong" });
  }
};

export const decCart = (req: Request, res: Response) => {
  const { id } = req.body;
  let errors = false;
  //@ts-ignore
  UserModal.findById(req.user._id, (err: any, userDoc: any) => {
    if (err) {
      console.log(err);
    } else {
      ProductModal.findById(id, (err: any, productDoc: any) => {
        if (err) {
          console.log(err);
        } else {
          let quan = 1;
          userDoc.cart.map((pro: any) => {
            if (JSON.stringify(pro._id) === JSON.stringify(productDoc._id)) {
              quan = pro.quantity - 1;
            }
          });
          UserModal.updateOne(
            { _id: userDoc._id, "cart._id": productDoc._id },
            {
              $inc: { "cart.$.quantity": -1 },
              $set: { "cart.$.subTotal": productDoc.price * quan },
            },
            (err: any, doc: any) => {
              if (err) {
                console.log(err);
              } else {
                UserModal.findById(userDoc._id, (err: any, newDoc: any) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({
                      msg: "decrement quantity of item",
                      cart: newDoc.cart,
                    });
                  }
                });
              }
            }
          );
        }
      });
    }
  });
  if (errors) {
    res.json({ msg: "something went wrong" });
  }
};

export const deleteFromCart = (req: Request, res: Response) => {
  const { id } = req.body;
  UserModal.updateOne(
    //@ts-ignore
    { _id: req.user._id },
    {
      $pull: { cart: { _id: id } },
    },
    (err: any, doc: any) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ msg: "deleted", cart: doc });
      }
    }
  );
};
