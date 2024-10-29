import { column, defineDb, defineTable } from 'astro:db';

const MoviesDB = defineTable({
  columns: {
    id: column.number({ primaryKey: true, unique: true }),
    _id: column.text({ unique: true }),
    title: column.text(),
    date: column.date(),
    pickedBy: column.number({ references: () => ViewersDB.columns.id }),
  }
});

const RatingsDB = defineTable({
  columns: {
    id: column.number({ primaryKey: true, unique: true }),
    _id: column.text({ unique: true }),
    movieId: column.number({ references: () => MoviesDB.columns.id }),
    viewerId: column.number({ references: () => ViewersDB.columns.id }),
    score: column.number(),
  }
});

const ViewersDB = defineTable({
  columns: {
    id: column.number({ primaryKey: true, unique: true }),
    _id: column.text({ unique: true }),
    name: column.text(),
    clerkId: column.text({ optional: true }),
    discordId: column.text({ optional: true }),
    discordUsername: column.text({ optional: true }),
    color: column.text(),
    avatar: column.text({ optional: true }),
    isAdmin: column.boolean(),
    bio: column.text({ optional: true }),
    preferences: column.json({
      default: {
        emailNotifications: true,
        discordNotifications: true,
        showRatings: true,
        defaultView: 'table'
      }
    }),
    pickedList: column.json({
      default: []
    })
  }
});


export default defineDb({
  tables: { MoviesDB, RatingsDB, ViewersDB},
});