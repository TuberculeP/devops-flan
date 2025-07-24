import { Router } from "express";
import { User } from "../config/entities/User";
import pg from "../config/db.config";

const userRouter = Router();

userRouter.put("/update", async (req, res) => {
  const userRepository = pg.getRepository(User);
  const updatedUser = await userRepository.save({
    ...req.user, // Assuming req.user is set by an authentication middleware
    ...req.body,
  });

  res.json(updatedUser);
});

export default userRouter;
