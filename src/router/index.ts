import { Router } from "express";
import authRouter from "../modules/auth/auth.route";

const mainRoute = Router();

const routeList = [
  {
    path: "/auth",
    element: authRouter,
  },
];

routeList.forEach((item) => mainRoute.use(item.path, item.element));

export default mainRoute;
