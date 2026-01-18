import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/admin-auth";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  console.log("\n=== Admin Account Registration ===\n");

  try {
    const email = await question("Email: ");
    const password = await question("Password: ");
    const name = await question("Name (optional): ");

    if (!email || !password) {
      console.log("❌ Email and password are required");
      process.exit(1);
    }

    // メールアドレスの重複チェック
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("❌ Email already exists");
      process.exit(1);
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(password);

    // 管理者を作成
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    console.log("\n✅ Admin account created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.name || "N/A"}`);
    console.log(`ID: ${admin.id}\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin account:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdmin();
