import { Request, Response } from "express";
import { authServises } from "./auth.service";

const usercreated = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age, gender } = req.body;
    const result = await authServises.userCreatedSQL({
      name,
      email,
      password,
      age,
      gender,
    });

    return res.status(201).json({
      ok: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(409).json({
        ok: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

const allUserGet = async (_req: Request, res: Response) => {
  try {
    const result = await authServises.allUserGetSQL();
    return res.status(200).json({
      ok: true,
      message: "All users fetched",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Something went wrong",
    });
  }
};

export const authController = {
  usercreated,
  allUserGet,
};
