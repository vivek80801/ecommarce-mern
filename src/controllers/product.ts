import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { ProductModal } from "../modals/product";

export const postAddProduct = (req: Request, res: Response) => {
  const { name, price, des } = req.body;
  const newProduct = new ProductModal({
    name: name,
    price: parseInt(price),
    details: des,
    //@ts-ignore
    img: `uploads/${req?.file?.filename}`,
  });
  newProduct
    .save()
    .then((doc) => {
      res.json({
        msg: "product added",
        ...newProduct,
      });
    })
    .catch((err) => console.log(err));
};

export const getProducts = (req: Request, res: Response) => {
  ProductModal.find((err, products) => res.json({ products: products }));
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  ProductModal.findById(id, (err: any, doc: any) => {
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      const newFileName =
        __dirname.replace("/src/controllers", "/public/") + doc.img;
      fs.unlink(newFileName, (err) => {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          ProductModal.deleteOne({ _id: id }, () => {
            res.json({ msg: "product deleted" });
          });
        }
      });
    }
  });
};

export const editProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, des } = req.body;

  ProductModal.findById(id, (err: any, doc: any) => {
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      if (req.file === undefined) {
        ProductModal.findOneAndUpdate(
          { _id: id },
          {
            name: name,
            price: parseInt(price),
            details: des,
            img: doc.img,
          },
          { new: true },
          (err, doc) => {
            if (err) {
              console.log(JSON.stringify(err));
            } else {
              res.json({ msg: "product edited", newProduct: doc });
            }
          }
        );
      } else {
        const newFileName =
          __dirname.replace("/src/controllers", "/public/") + doc.img;
        fs.unlink(newFileName, (err) => {
          if (err) {
            console.log(JSON.stringify(err));
          }
          ProductModal.findOneAndUpdate(
            { _id: id },
            {
              name: name,
              price: parseInt(price),
              details: des,
              //@ts-ignore
              img: `uploads/${req?.file?.filename}`,
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(JSON.stringify(err));
              } else {
                res.json({ msg: "product edited", newProduct: doc });
              }
            }
          );
        });
      }
    }
  });
};
