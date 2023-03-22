import { PrismaClient, Prisma } from "@prisma/client";

const db = new PrismaClient();
export default db;

export const knownDbError = Prisma.PrismaClientKnownRequestError;
