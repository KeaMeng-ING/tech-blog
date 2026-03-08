import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

async function main() {
  // ─── Users ───────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@techblog.com" },
    update: {},
    create: {
      email: "admin@techblog.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "john@techblog.com" },
    update: {},
    create: {
      email: "john@techblog.com",
      password: userPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane@techblog.com" },
    update: {},
    create: {
      email: "jane@techblog.com",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("✅ Seeded users:", admin.email, user1.email, user2.email);

  // ─── Categories ──────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "web-development" },
      update: {},
      create: { name: "Web Development", slug: "web-development" },
    }),
    prisma.category.upsert({
      where: { slug: "artificial-intelligence" },
      update: {},
      create: {
        name: "Artificial Intelligence",
        slug: "artificial-intelligence",
      },
    }),
    prisma.category.upsert({
      where: { slug: "cybersecurity" },
      update: {},
      create: { name: "Cybersecurity", slug: "cybersecurity" },
    }),
    prisma.category.upsert({
      where: { slug: "devops" },
      update: {},
      create: { name: "DevOps", slug: "devops" },
    }),
  ]);

  console.log(
    "✅ Seeded categories:",
    categories.map((c) => c.name),
  );

  // ─── Posts ───────────────────────────────────────────────
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: "getting-started-with-nextjs" },
      update: {},
      create: {
        title: "Getting Started with Next.js",
        slug: "getting-started-with-nextjs",
        shortDesc: "A beginner guide to Next.js and React Server Components.",
        content:
          "Next.js is a React framework that enables server-side rendering and static site generation...",
        thumbnailUrl: "https://placehold.co/800x400?text=Next.js",
        source: "https://nextjs.org",
        status: "PUBLISHED",
        publishedAt: new Date(),
        categoryId: categories[0].id,
      },
    }),
    prisma.post.upsert({
      where: { slug: "intro-to-large-language-models" },
      update: {},
      create: {
        title: "Intro to Large Language Models",
        slug: "intro-to-large-language-models",
        shortDesc: "Understanding how LLMs like GPT work under the hood.",
        content:
          "Large Language Models are trained on massive datasets using transformer architecture...",
        thumbnailUrl: "https://placehold.co/800x400?text=LLMs",
        source: "https://openai.com",
        status: "PUBLISHED",
        publishedAt: new Date(),
        categoryId: categories[1].id,
      },
    }),
    prisma.post.upsert({
      where: { slug: "top-cybersecurity-threats-2025" },
      update: {},
      create: {
        title: "Top Cybersecurity Threats in 2025",
        slug: "top-cybersecurity-threats-2025",
        shortDesc:
          "A roundup of the most critical security threats facing developers.",
        content:
          "From ransomware to supply chain attacks, 2025 has brought new cybersecurity challenges...",
        thumbnailUrl: "https://placehold.co/800x400?text=Security",
        status: "DRAFT",
        categoryId: categories[2].id,
      },
    }),
    prisma.post.upsert({
      where: { slug: "docker-for-beginners" },
      update: {},
      create: {
        title: "Docker for Beginners",
        slug: "docker-for-beginners",
        shortDesc: "Learn how to containerize your apps with Docker.",
        content:
          "Docker is a platform for building, shipping, and running applications in containers...",
        thumbnailUrl: "https://placehold.co/800x400?text=Docker",
        status: "SCHEDULED",
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        categoryId: categories[3].id,
      },
    }),
  ]);

  console.log(
    "✅ Seeded posts:",
    posts.map((p) => p.title),
  );

  // ─── Subscriptions ───────────────────────────────────────
  const subscriptions = await Promise.all([
    prisma.subscription.create({
      data: {
        email: user1.email,
        userId: user1.id,
        topics: ["web-development", "devops"],
        deliveryTime: "08:00",
        isActive: true,
      },
    }),
    prisma.subscription.create({
      data: {
        email: user2.email,
        userId: user2.id,
        topics: ["artificial-intelligence", "cybersecurity"],
        deliveryTime: "09:00",
        isActive: true,
      },
    }),
    prisma.subscription.create({
      data: {
        email: "guest@example.com",
        topics: ["web-development"],
        deliveryTime: "10:00",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Seeded subscriptions:", subscriptions.length);

  // ─── Newsletter Logs ─────────────────────────────────────
  const logs = await Promise.all([
    prisma.newsletterLog.create({
      data: {
        topics: ["web-development", "devops"],
        totalSent: 120,
        status: "SUCCESS",
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.newsletterLog.create({
      data: {
        topics: ["artificial-intelligence"],
        totalSent: 85,
        status: "SUCCESS",
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.newsletterLog.create({
      data: {
        topics: ["cybersecurity"],
        totalSent: 0,
        status: "FAILED",
        sentAt: new Date(),
      },
    }),
  ]);

  console.log("✅ Seeded newsletter logs:", logs.length);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
