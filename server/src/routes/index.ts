import { Router } from "express";
import authRouter from "./auth";
import sharedRouter from "./shared";
import pg from "../config/db.config";
import { User } from "../config/entities/User";
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

router.use("/auth", authRouter);
router.use("/shared", sharedRouter);

export default router;
