const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Category = require("../models/category");
const Director = require("../models/director");
const Manufacturer = require("../models/manufacturer");
const Movie = require("../models/movies");

const imageBase = "https://image.tmdb.org/t/p/original";
const demoSource =
  "Full|https://vip.opstream17.com/20240320/2895_5e8950a3/index.m3u8";

const categoryNames = [
  "Action",
  "Drama",
  "Horror",
  "Sci-fi",
  "Anime",
  "Romance",
  "Comedy",
  "Thriller",
];

const movies = [
  {
    name: "Inception",
    slug: "inception",
    year: 2010,
    time: "148 phút",
    quality: "Full HD",
    views: 182300,
    rating: 4.8,
    ratingCount: 1240,
    categories: ["Sci-fi", "Thriller", "Action"],
    poster_url: `${imageBase}/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg`,
    thumb_url: `${imageBase}/s3TBrRGB1iav7gFOCNx3H31MoES.jpg`,
  },
  {
    name: "Interstellar",
    slug: "interstellar",
    year: 2014,
    time: "169 phút",
    quality: "Full HD",
    views: 214900,
    rating: 4.9,
    ratingCount: 1580,
    categories: ["Sci-fi", "Drama"],
    poster_url: `${imageBase}/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    thumb_url: `${imageBase}/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg`,
  },
  {
    name: "The Dark Knight",
    slug: "the-dark-knight",
    year: 2008,
    time: "152 phút",
    quality: "Full HD",
    views: 198400,
    rating: 4.9,
    ratingCount: 1390,
    categories: ["Action", "Drama", "Thriller"],
    poster_url: `${imageBase}/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    thumb_url: `${imageBase}/hqkIcbrOHL86UncnHIsHVcVmzue.jpg`,
  },
  {
    name: "Dune",
    slug: "dune",
    year: 2021,
    time: "155 phút",
    quality: "Full HD",
    views: 151200,
    rating: 4.5,
    ratingCount: 820,
    categories: ["Sci-fi", "Action", "Drama"],
    poster_url: `${imageBase}/d5NXSklXo0qyIYkgV94XAgMIckC.jpg`,
    thumb_url: `${imageBase}/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg`,
  },
  {
    name: "Parasite",
    slug: "parasite",
    year: 2019,
    time: "132 phút",
    quality: "Full HD",
    views: 127500,
    rating: 4.7,
    ratingCount: 960,
    categories: ["Drama", "Thriller", "Comedy"],
    poster_url: `${imageBase}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    thumb_url: `${imageBase}/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg`,
  },
  {
    name: "Joker",
    slug: "joker",
    year: 2019,
    time: "122 phút",
    quality: "Full HD",
    views: 118900,
    rating: 4.4,
    ratingCount: 910,
    categories: ["Drama", "Thriller"],
    poster_url: `${imageBase}/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg`,
    thumb_url: `${imageBase}/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg`,
  },
  {
    name: "Spirited Away",
    slug: "spirited-away",
    year: 2001,
    time: "125 phút",
    quality: "Full HD",
    views: 104800,
    rating: 4.8,
    ratingCount: 870,
    categories: ["Anime", "Drama"],
    poster_url: `${imageBase}/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg`,
    thumb_url: `${imageBase}/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg`,
  },
  {
    name: "Your Name",
    slug: "your-name",
    year: 2016,
    time: "106 phút",
    quality: "Full HD",
    views: 97600,
    rating: 4.7,
    ratingCount: 730,
    categories: ["Anime", "Romance", "Drama"],
    poster_url: `${imageBase}/q719jXXEzOoYaps6babgKnONONX.jpg`,
    thumb_url: `${imageBase}/dIWwZW7dJJtqC6CgWzYkNVKIUm8.jpg`,
  },
  {
    name: "A Quiet Place",
    slug: "a-quiet-place",
    year: 2018,
    time: "90 phút",
    quality: "Full HD",
    views: 84100,
    rating: 4.2,
    ratingCount: 540,
    categories: ["Horror", "Thriller"],
    poster_url: `${imageBase}/nAU74GmpUk7t5iklEp3bufwDq4n.jpg`,
    thumb_url: `${imageBase}/roYyPiQDQKmIKUEhO912693tSja.jpg`,
  },
  {
    name: "Get Out",
    slug: "get-out",
    year: 2017,
    time: "104 phút",
    quality: "Full HD",
    views: 81200,
    rating: 4.3,
    ratingCount: 610,
    categories: ["Horror", "Thriller"],
    poster_url: `${imageBase}/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg`,
    thumb_url: `${imageBase}/lZpWprJqbIFpEV5uoHfoK0KCnTW.jpg`,
  },
  {
    name: "La La Land",
    slug: "la-la-land",
    year: 2016,
    time: "128 phút",
    quality: "Full HD",
    views: 76500,
    rating: 4.5,
    ratingCount: 590,
    categories: ["Romance", "Drama"],
    poster_url: `${imageBase}/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg`,
    thumb_url: `${imageBase}/qJeU7KM4nT2C1WpOrwPcSDGFUWE.jpg`,
  },
  {
    name: "Knives Out",
    slug: "knives-out",
    year: 2019,
    time: "130 phút",
    quality: "Full HD",
    views: 69800,
    rating: 4.2,
    ratingCount: 470,
    categories: ["Comedy", "Drama", "Thriller"],
    poster_url: `${imageBase}/pThyQovXQrw2m0s9x82twj48Jq4.jpg`,
    thumb_url: `${imageBase}/4HWAQu28e2yaWrtupFPGFkdNU7V.jpg`,
  },
  {
    name: "Mad Max: Fury Road",
    slug: "mad-max-fury-road",
    year: 2015,
    time: "121 phút",
    quality: "Full HD",
    views: 116700,
    rating: 4.6,
    ratingCount: 790,
    categories: ["Action", "Sci-fi"],
    poster_url: `${imageBase}/hA2ple9q4qnwxp3hKVNhroipsir.jpg`,
    thumb_url: `${imageBase}/phszHPFVhPHhMZgo0fWTKBDQsJA.jpg`,
  },
  {
    name: "The Matrix",
    slug: "the-matrix",
    year: 1999,
    time: "136 phút",
    quality: "Full HD",
    views: 143600,
    rating: 4.7,
    ratingCount: 1010,
    categories: ["Sci-fi", "Action"],
    poster_url: `${imageBase}/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg`,
    thumb_url: `${imageBase}/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg`,
  },
  {
    name: "Whiplash",
    slug: "whiplash",
    year: 2014,
    time: "107 phút",
    quality: "Full HD",
    views: 58900,
    rating: 4.6,
    ratingCount: 430,
    categories: ["Drama"],
    poster_url: `${imageBase}/7fn624j5lj3xTme2SgiLCeuedmO.jpg`,
    thumb_url: `${imageBase}/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg`,
  },
  {
    name: "Coco",
    slug: "coco",
    year: 2017,
    time: "105 phút",
    quality: "Full HD",
    views: 92500,
    rating: 4.6,
    ratingCount: 680,
    categories: ["Comedy", "Drama"],
    poster_url: `${imageBase}/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg`,
    thumb_url: `${imageBase}/askg3SMvhqEl4OL52YuvdtY40Yb.jpg`,
  },
  {
    name: "The Conjuring",
    slug: "the-conjuring",
    year: 2013,
    time: "112 phút",
    quality: "Full HD",
    views: 87200,
    rating: 4.1,
    ratingCount: 520,
    categories: ["Horror", "Thriller"],
    poster_url: `${imageBase}/wVYREutTvI2tmxr6ujrHT704wGF.jpg`,
    thumb_url: `${imageBase}/9Y5bzH5k5KD2fKGm9wRZKc57h6g.jpg`,
  },
  {
    name: "The Grand Budapest Hotel",
    slug: "the-grand-budapest-hotel",
    year: 2014,
    time: "100 phút",
    quality: "HD",
    views: 53400,
    rating: 4.3,
    ratingCount: 350,
    categories: ["Comedy", "Drama"],
    poster_url: `${imageBase}/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg`,
    thumb_url: `${imageBase}/5FPUoQtnNC0C0YZ7sUeTLq6eZqa.jpg`,
  },
];

const upsertByName = async (Model, name, extra = {}) => {
  const doc = await Model.findOneAndUpdate(
    { name },
    { $setOnInsert: { name, ...extra } },
    { new: true, upsert: true }
  );

  return doc;
};

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");

    const categoryDocs = await Promise.all(
      categoryNames.map((name) => upsertByName(Category, name))
    );
    const categoryByName = Object.fromEntries(
      categoryDocs.map((category) => [category.name, category._id])
    );

    const director = await upsertByName(Director, "Demo Studio");
    const manufacturer = await upsertByName(Manufacturer, "Movie Demo Library");

    for (const movie of movies) {
      const categoryIds = movie.categories
        .map((name) => categoryByName[name])
        .filter(Boolean);

      await Movie.findOneAndUpdate(
        { slug: movie.slug },
        {
          $set: {
            ...movie,
            content:
              "Một lựa chọn nổi bật trong thư viện demo, dùng để kiểm tra giao diện movie platform với poster, backdrop, rating, lượt xem và category phong phú.",
            status: "released",
            categories: categoryIds,
            director: [director._id],
            manufacturer: manufacturer._id,
            source_url: demoSource,
          },
        },
        { new: true, upsert: true }
      );

      console.log(`Seeded ${movie.name}`);
    }

    console.log(`Done. Upserted ${movies.length} demo movies.`);
  } catch (error) {
    console.error("Failed to seed demo data:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDemoData();
