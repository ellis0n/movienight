import { column, defineDb, defineTable } from 'astro:db';

const MoviesDB = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    average: column.number(),
    date: column.date(),
  }
});

const RatingsDB = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    movieId: column.number({ references: () => MoviesDB.columns.id }),
    viewerId: column.number({ references: () => ViewersDB.columns.id }),
    score: column.number(),
  }
});

const ViewersDB = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  }
})


export default defineDb({
  tables: { MoviesDB, RatingsDB, ViewersDB},
});