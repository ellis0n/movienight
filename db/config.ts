import { column, defineDb, defineTable } from 'astro:db';

const Movies = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    average: column.number(),
    date: column.date(),
    meta: column.json(),
  }
});

const Ratings = defineTable({
  columns: {
    movieId: column.number({ references: () => Movies.columns.id }),
    raterName: column.text(),
    rating: column.number(),
  }
});

export default defineDb({
  tables: { Movies, Ratings },
});