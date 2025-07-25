import { Router } from "express";
import authRouter from "./auth";
import sharedRouter from "./shared";
import pg from "../config/db.config";
import { User } from "../config/entities/User";
import userRouter from "./user";
import { Product } from "../config/entities/Product";
import { Comment } from "../config/entities/Comment";
import _ from "lodash";

const router = Router();

router.get("/", (_, res) => {
  res.json({
    message: "Hello from the server!",
  });
});

router.get("/all-users-count", async (_, res) => {
  const userRepository = pg.getRepository(User);
  const userCount = await userRepository.count();
  res.json({ count: userCount });
});

router.get("/all-products-count", async (_, res) => {
  const productRepository = pg.getRepository(Product);
  const productCount = await productRepository.count();
  res.json({ count: productCount });
});

router.get("/products-list", async (_, res) => {
  const productRepository = pg.getRepository(Product);
  const productList = await productRepository.find();
  res.json({ products: productList });
});

router.get("/products-list-user", async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const productRepository = pg.getRepository(Product);
  const productList = await productRepository.find({
    where: {
      user: {
        id: req.user.id,
      },
    },
    relations: ["user", "comments"],
  });

  res.json({ products: productList });
});

router.get("/product/:id", async (req, res) => {
  const productRepository = pg.getRepository(Product);
  const product = await productRepository.findOne({
    where: { id: req.params.id },
    relations: ["user", "comments", "comments.user"],
  });
  res.json({ product: product });
});

router.put("/product/update", async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const productRepository = pg.getRepository(Product);
  const product = await productRepository.findOne({
    where: { id: req.body.id },
    relations: ["user", "comments", "comments.user"],
  });

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  product.title = req.body.title;
  product.description = req.body.description;
  product.updatedAt = new Date();

  await productRepository.save(product);

  res.json(product);
});

router.post("/product/create", async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const productRepository = pg.getRepository(Product);
  const product = new Product();

  product.user = req.user as User;
  product.title = req.body.title;
  product.description = req.body.description;
  product.image = req.body.image;
  product.createdAt = new Date();
  product.updatedAt = new Date();

  await productRepository.save(product);

  res.json(product);
});

router.post("/product/:id/comment", async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const productRepository = pg.getRepository(Product);
  const product = await productRepository.findOne({
    where: { id: req.params.id },
    relations: ["comments"],
  });
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const comment = new Comment();
  comment.user = req.user as User;
  comment.product = product;
  comment.text = req.body.text;
  comment.createdAt = new Date();
  comment.updatedAt = new Date();

  const commentRepository = pg.getRepository(Comment);
  await commentRepository.save(comment);
  product.comments.push(comment);
  await productRepository.save(product);
  // remove product from the comment to avoid circular reference in JSON response
  res.json({ comment: _.omit(comment, ["product"]) });
});

router.use("/auth", authRouter);
router.use("/shared", sharedRouter);
router.use("/user", userRouter);

export default router;
