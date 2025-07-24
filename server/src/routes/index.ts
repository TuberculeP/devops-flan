import { Router } from "express";
import authRouter from "./auth";
import sharedRouter from "./shared";
import pg from "../config/db.config";
import { User } from "../config/entities/User";
import userRouter from "./user";
import { Product } from "../config/entities/Product";

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
  const productCount = await productRepository.find();
  res.json({ products: productCount });
});

router.get("/product/:id", async (req, res) => {
  const productRepository = pg.getRepository(Product);
  const product = await productRepository.findOne({
    where: { id: req.params.id },
    relations: ["user", "comments"],
  });
  res.json({ product: product });
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

router.use("/auth", authRouter);
router.use("/shared", sharedRouter);
router.use("/user", userRouter);

export default router;
