import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/userModel.js";
import { Course } from "./models/courseModel.js";

// Load environment variables from .env
dotenv.config({ path: "./.env" });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in your server/.env file!");
    }
    console.log("Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully ✅");

    const email = "kaif123@gmail.com";
    const plainPassword = "Kaif@123";

    // 1. Find or create educator user
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`User ${email} not found. Creating a new educator...`);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      user = await User.create({
        name: "Md Kaif",
        email,
        password: hashedPassword,
        role: "educator",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      });
      console.log("Educator created successfully:", user._id);
    } else {
      console.log("Educator user found:", user._id);
      // Ensure the user role is educator
      if (user.role !== "educator") {
        user.role = "educator";
        await user.save();
        console.log("Updated user role to educator");
      }
    }

    // 2. Define premium mock courses
    const mockCourses = [
      {
        title: "React 19 & Next.js 15 Masterclass",
        description: "Master React 19 core features like Server Components, Server Actions, the new compiler, useActionState hook, and build production-ready full-stack applications with Next.js 15 App Router.",
        thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        price: 99.99,
        isPublished: true,
        educator: user._id,
        lectures: [
          {
            title: "1. Introduction to React 19 & the New Compiler",
            description: "Explore the new React compiler (React Forget) and how it auto-memoizes component state transitions.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            isFreePreview: true,
          },
          {
            title: "2. Deep Dive: Server Components vs Client Components",
            description: "Understand the hybrid rendering model of Next.js 15 and how to write efficient Server Components.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            isFreePreview: false,
          },
          {
            title: "3. Handling Forms with Server Actions & useActionState",
            description: "Learn how to use form actions, manage loading transitions, and trigger backend updates with React 19 form tools.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            isFreePreview: false,
          }
        ]
      },
      {
        title: "Tailwind CSS v4 & Modern UI Design",
        description: "Unleash the power of Tailwind CSS v4. Learn dynamic theme variables, CSS-first configurations, utility-first grids, glassmorphism design tokens, and build stunning websites.",
        thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
        price: 49.99,
        isPublished: true,
        educator: user._id,
        lectures: [
          {
            title: "1. What is New in Tailwind CSS v4?",
            description: "Introduction to the CSS-first configuration, compiler performance enhancements, and standard changes.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            isFreePreview: true,
          },
          {
            title: "2. Building Glassmorphism Layouts",
            description: "Step-by-step styling of blur layers, borders, gradients, and backdrop filters for dark modern layouts.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            isFreePreview: false,
          }
        ]
      },
      {
        title: "Node.js Production Architectures",
        description: "Learn to architect highly scalable Express and Node.js APIs. Dive deep into JWT cookie configurations, secure role permissions, database schema migrations, and Multer file streaming.",
        thumbnailUrl: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800&auto=format&fit=crop",
        price: 79.99,
        isPublished: true,
        educator: user._id,
        lectures: [
          {
            title: "1. Node.js Event Loop & Cluster Systems",
            description: "Understand internal execution phases and leverage Node cluster libraries to balance requests.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            isFreePreview: true,
          },
          {
            title: "2. Setting Up Dynamic HTTP-Only Cookies",
            description: "Configure cross-origin authentication secure policies, SameSite environments, and auto token refreshes.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            isFreePreview: false,
          }
        ]
      }
    ];

    // Remove any existing courses created by this educator to prevent duplicates
    console.log("Removing existing courses for kaif123...");
    await Course.deleteMany({ educator: user._id });

    // 3. Insert mock courses
    console.log("Inserting new courses...");
    const createdCourses = await Course.insertMany(mockCourses);
    console.log(`Successfully created ${createdCourses.length} premium courses! 🚀`);

    createdCourses.forEach((c) => {
      console.log(` - [${c.title}] containing ${c.lectures.length} lectures.`);
    });

  } catch (error) {
    console.error("Seeding database failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

seedDatabase();
