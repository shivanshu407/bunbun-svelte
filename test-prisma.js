import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";
dotenv.config();

const config = {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    connectTimeout: 5000,
};
console.log("Config:", {...config, password: "***"});

const adapter = new PrismaMariaDb(config);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log("Testing prisma...");
        const res = await prisma.$queryRawUnsafe("SELECT 1 as test");
        console.log("Success:", res);
    } catch(e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
