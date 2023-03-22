import { PrismaClient } from "@prisma/client";

declare global {
  var db: PrismaClient;
}

export let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.db) {
    global.db = new PrismaClient();
  }

  db = global.db;
}
