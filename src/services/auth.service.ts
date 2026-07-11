import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import type { LoginInput, RegisterInput } from "../validators/auth.schema";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type AuthResult = {
  user: PublicUser;
  accessToken: string;
};

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true
};

function signAccessToken(user: Pick<PublicUser, "id" | "email">): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]

  };

  return jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    env.JWT_ACCESS_SECRET,
    options
  );
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true }
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 409, "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash
    },
    select: publicUserSelect
  });

  return {
    user,
    accessToken: signAccessToken(user)
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };

  return {
    user: publicUser,
    accessToken: signAccessToken(publicUser)
  };
}

export async function getUserById(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user;
}
