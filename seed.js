require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedCreator = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.CREATOR_EMAIL.toLowerCase();
    const existing = await User.findOne({ email }).select("+password");

    if (existing) {
      existing.name = process.env.CREATOR_NAME;
      existing.password = process.env.CREATOR_PASSWORD; // re-hashed by the model
      await existing.save();
      console.log("Creator account updated:", email);
    } else {
      await User.create({
        name: process.env.CREATOR_NAME,
        email,
        password: process.env.CREATOR_PASSWORD,
        bio: "Welcome to my channel! I share tutorials and ideas about technology and education.",
      });
      console.log("Creator account created:", email);
    }
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedCreator();