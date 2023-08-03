import { db } from "@/database";
import { IUser } from "@/interfaces";
import { User } from "@/models";
import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);
    case "PUT":
      return updateUsers(req, res);
    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();

    const users = await User.find().select("-password").lean();

    await db.disconnect();

    return res.status(200).json(users);
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: "Ocurrio un error" });
  }
};

const updateUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { userId = "", role = "" } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "No existe usuario" });
    }

    const validRoles = ["admin", "super-user", "SEO"];

    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({ message: "Rol no permitido :" + validRoles.join(", ") });
    }

    await db.connect();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.role = role;

    await user.save();

    await db.disconnect();

    return res.status(200).json({ message: "Usuario Actualizado" });
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: "Ocurrio un error" });
  }
};
