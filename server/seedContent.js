require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Content = require("./models/Content");

const img = (s) => `https://picsum.photos/seed/${s}/800/500`;
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

const items = [
  { title: "Learn React in 30 Minutes", description: "A beginner-friendly walkthrough of components, props and state.", category: "Education", contentType: "video", thumbnailUrl: img("react30"), featured: true, publishDate: daysAgo(1) },
  { title: "5 Gadgets Worth Buying in 2026", description: "My honest review of gadgets that actually improved my workflow.", category: "Technology", contentType: "article", thumbnailUrl: img("gadgets26"), featured: true, publishDate: daysAgo(2), articleContent: "Here are my top picks after three months of daily use..." },
  { title: "Study Habits That Work", description: "Podcast episode on building a study routine that sticks.", category: "Lifestyle", contentType: "podcast", thumbnailUrl: img("studyhabits"), featured: true, publishDate: daysAgo(3) },
  { title: "Behind the Scenes: My Setup", description: "A look at the desk, camera and tools I use to make content.", category: "Entertainment", contentType: "image", thumbnailUrl: img("mysetup"), publishDate: daysAgo(4) },
  { title: "Build a Side Business as a Student", description: "Practical steps to start small and grow your first income stream.", category: "Business", contentType: "video", thumbnailUrl: img("sidebiz"), publishDate: daysAgo(5) },
  { title: "Intro to MongoDB Atlas", description: "Create a free cluster and connect it to a Node.js app.", category: "Technology", contentType: "video", thumbnailUrl: img("atlasdb"), publishDate: daysAgo(6) },
  { title: "Morning Routine for Productivity", description: "The five habits that changed how I start every day.", category: "Lifestyle", contentType: "article", thumbnailUrl: img("morning"), publishDate: daysAgo(7), articleContent: "It starts the night before..." },
  { title: "How to Present Your Ideas", description: "Tips for confident presentations in class and at work.", category: "Education", contentType: "podcast", thumbnailUrl: img("present"), publishDate: daysAgo(8) },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const author = await User.findOne();
    for (const item of items) {
      await Content.create({
        mediaUrl: "https://www.youtube.com/",
        status: "Published",
        author: author?._id,
        ...item,
      });
    }
    console.log(`Added ${items.length} items`);
  } catch (e) {
    console.error("Seed failed:", e.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();