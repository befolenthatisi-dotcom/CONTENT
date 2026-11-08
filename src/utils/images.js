

export const thumbFor = (item) =>
  item.thumbnailUrl ||
  `https://picsum.photos/seed/${item._id}/640/400`;

const images = {
  Education: "https://images.pexels.com/photos/16420237/pexels-photo-16420237.jpeg",

  Technology: "https://images.unsplash.com/photo-1720048170996-40507a45c720?auto=format&fit=crop&w=1200&q=80",

  Entertainment:"https://images.unsplash.com/photo-1760092189903-dce3e898dacf?auto=format&fit=crop&w=1200&q=80",

  Lifestyle: "https://images.unsplash.com/photo-1771627278473-fbe123ee865a?auto=format&fit=crop&fm=jpg&w=1200",

  Other: "https://images.unsplash.com/photo-1781764177519-9c9c88733c3e?auto=format&fit=crop&fm=jpg&w=1200",

  Business: "https://images.unsplash.com/photo-1758518730151-cf64fddb4f0a?auto=format&fit=crop&fm=jpg&w=1200",
};

export const categoryImage = (category) => images[category] || "";
