import { column, defineDb, defineTable } from 'astro:db';

const Movies = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    average: column.number(),
    date: column.date(),
  }
});

const Ratings = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    movieId: column.number({ references: () => Movies.columns.id }),
    viewerId: column.number({ references: () => Viewers.columns.id }),
    score: column.number(),
  }
});

const Viewers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  }
})


export default defineDb({
  tables: { Movies, Ratings, Viewers},
});