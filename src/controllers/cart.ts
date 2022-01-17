import { Request, Response } from "express";
import { UserModal } from "../modals/user";
import { ProductModal } from "../modals/product";

export const addToCart = (req: Request, res: Response) => {
  const { id } = req.body;
  ProductModal.findById(id, (err: any, productDoc: any) => {
    console.log(typeof productDoc._doc.price);
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
                    console.log("matched: " + matched);
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
  console.log(req.body);
  res.json({ msg: "increment quantity of item" });
};

export const decCart = (req: Request, res: Response) => {
  console.log(req.body);
  res.json({ msg: "decrement quantity of item" });
};
