import { v4 as uuidv4 } from 'uuid';

export const fetchOmdbData = async (title: string) => {
  try {
    let searchTitle = title.replace(/, The$/i, '');
    if (searchTitle !== title) {
      searchTitle = 'The ' + searchTitle;
    }

    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(searchTitle)}&y=&plot=short&apikey=${import.meta.env.PUBLIC_OMDB_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === "True") {
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching OMDB data for ${title}:`, error);
    return null;
  }
};

export const moviesData = [
  {
    _id: uuidv4(),
    id: 1,
    title: "Peanut Butter Falcon",
    date: new Date("2024-03-19"),
    pickedBy: 2,
    
  },
  { _id: uuidv4(), id: 2, title: "Ronin", date: new Date("2024-03-26"), pickedBy: 3},
  { _id: uuidv4(), id: 3, title: "The Mist", date: new Date("2024-04-02"), pickedBy: 1},
  { _id: uuidv4(), id: 4, title: "Grease", date: new Date("2024-04-09"), pickedBy: 4},
  { _id: uuidv4(), id: 5, title: "Die Hard with a Vengeance", date: new Date("2024-04-16"), pickedBy: 3},
  { _id: uuidv4(), id: 6, title: "The Re-Animator", date: new Date("2024-04-23"), pickedBy: 1},
  { _id: uuidv4(), id: 7, title: "Sexy Beast", date: new Date("2024-04-30"), pickedBy: 2},
  { _id: uuidv4(), id: 8, title: "Boogie Nights", date: new Date("2024-05-07"), pickedBy: 4},
  { _id: uuidv4(), id: 9, title: "Johnny Mnemonic", date: new Date("2024-05-14"), pickedBy: 3},
  { _id: uuidv4(), id: 10, title: "Reign Of Fire", date: new Date("2024-05-21"), pickedBy: 8},
  { _id: uuidv4(), id: 11, title: "Human Traffic", date: new Date("2024-05-28"), pickedBy: 1},
  { _id: uuidv4(), id: 12, title: "Blood Simple", date: new Date("2024-06-04"), pickedBy: 2},
  { _id: uuidv4(), id: 13, title: "Everything Everywhere All At Once", date: new Date("2024-06-11"), pickedBy: 4},
  { _id: uuidv4(), id: 14, title: "Velocipastor", date: new Date("2024-06-18"), pickedBy: 5},
  { _id: uuidv4(), id: 15, title: "Antitrust", date: new Date("2024-06-25"), pickedBy: 9},
  { _id: uuidv4(), id: 16, title: "Misery", date: new Date("2024-07-02"), pickedBy: 9},
  { _id: uuidv4(), id: 17, title: "The Abyss", date: new Date("2024-07-09"), pickedBy: 13},
  { _id: uuidv4(), id: 18, title: "The Thing", date: new Date("2024-07-16"), pickedBy: 1},
  { _id: uuidv4(), id: 19, title: "Tampopo", date: new Date("2024-07-23"), pickedBy: 7},
  { _id: uuidv4(), id: 20, title: "True Romance", date: new Date("2024-07-30"), pickedBy: 2},
  { _id: uuidv4(), id: 21, title: "The Fugitive", date: new Date("2024-08-13"), pickedBy: 3},
  { _id: uuidv4(), id: 22, title: "Rat Race", date: new Date("2024-08-20"), pickedBy: 3},
  { _id: uuidv4(), id: 23, title: "Bring it On", date: new Date("2024-08-27"), pickedBy: 4},
  { _id: uuidv4(), id: 24, title: "The Lighthouse", date: new Date("2024-09-03"), pickedBy: 5},
  { _id: uuidv4(), id: 25, title: "Blackberry", date: new Date("2024-09-01"), pickedBy: 12},
  { _id: uuidv4(), id: 26, title: "Master and Commander", date: new Date("2024-09-17"), pickedBy: 6},
  { _id: uuidv4(), id: 27, title: "Godzilla Minus One", date: new Date("2024-09-24"), pickedBy: 8},
  { _id: uuidv4(), id: 28, title: "Twilight", date: new Date("2024-10-01"), pickedBy: 10},
  { _id: uuidv4(), id: 29, title: "Small Soldiers", date: new Date("2024-10-08"), pickedBy: 11},
  { _id: uuidv4(), id: 30, title: "There Will Be Blood", date: new Date("2024-10-15"), pickedBy: 2},
  { _id: uuidv4(), id: 31, title: "Ghost in the Shell", date: new Date("2024-10-22"), pickedBy: 3 },
  { _id: uuidv4(), id: 32, title: "Tucker And Dale vs Evil", date: new Date("2024-10-29"), pickedBy:  13},
]

export const ratingsData = [
  { _id: uuidv4(), id:   1, movieId: 1, viewerId: 1, score: 6.5},
  { _id: uuidv4(), id: 2, movieId: 1, viewerId: 2, score: 6.3},
  { _id: uuidv4(), id: 3, movieId: 1, viewerId: 3, score: 6.1},
  { _id: uuidv4(), id: 4, movieId: 2, viewerId: 4, score: 7.5},
  { _id: uuidv4(), id: 5, movieId: 2, viewerId: 1, score: 7.4},
  { _id: uuidv4(), id: 6, movieId: 2, viewerId: 2, score: 7.5},
  { _id: uuidv4(), id: 7, movieId: 2, viewerId: 3, score: 10},
  { _id: uuidv4(), id: 8, movieId: 2, viewerId: 5, score: 7.1},
  { _id: uuidv4(), id: 9, movieId: 2, viewerId: 6, score: 8.7},
  { _id: uuidv4(), id: 10, movieId: 2, viewerId: 7, score: 10},
  { _id: uuidv4(), id: 11, movieId: 3, viewerId: 4, score: 8},
  { _id: uuidv4(), id: 12, movieId: 3, viewerId: 1, score: 8.5},
  { _id: uuidv4(), id: 13, movieId: 3, viewerId: 2, score: 5.9},
  { _id: uuidv4(), id: 14, movieId: 3, viewerId: 3, score: 6},
  { _id: uuidv4(), id: 15, movieId: 3, viewerId: 5, score: 6},
  { _id: uuidv4(), id: 16, movieId: 3, viewerId: 6, score: 6.4},
  { _id: uuidv4(), id: 17, movieId: 3, viewerId: 13, score: 9.1},
  { _id: uuidv4(), id: 18, movieId: 4, viewerId: 4, score: 9},
  { _id: uuidv4(), id: 19, movieId: 4, viewerId: 1, score: 6.3},
  { _id: uuidv4(), id: 20, movieId: 4, viewerId: 2, score: 6.4},
  { _id: uuidv4(), id: 21, movieId: 4, viewerId: 3, score: 7.15},
  { _id: uuidv4(), id: 22, movieId: 4, viewerId: 8, score: 10},
  { _id: uuidv4(), id: 23, movieId: 4, viewerId: 5, score: 9},
  { _id: uuidv4(), id: 24, movieId: 4, viewerId: 12, score: 5},
  { _id: uuidv4(), id: 25, movieId: 4, viewerId: 6, score: 5.2},
  { _id: uuidv4(), id: 26, movieId: 4, viewerId: 7, score: 6.2},
  { _id: uuidv4(), id: 27, movieId: 5, viewerId: 4, score: 7},
  { _id: uuidv4(), id: 28, movieId: 5, viewerId: 1, score: 7.5},
  { _id: uuidv4(), id: 29, movieId: 5, viewerId: 2, score: 6.7},
  { _id: uuidv4(), id: 30, movieId: 5, viewerId: 3, score: 6.8},
  { _id: uuidv4(), id: 31, movieId: 5, viewerId: 8, score: 7.8},
  { _id: uuidv4(), id: 32, movieId: 5, viewerId: 9, score: 9},
  { _id: uuidv4(), id: 33, movieId: 5, viewerId: 6, score: 8.5},
  { _id: uuidv4(), id: 34, movieId: 5, viewerId: 7, score: 7.1},
  { _id: uuidv4(), id: 35, movieId: 6, viewerId: 4, score: 6.52},
  { _id: uuidv4(), id: 36, movieId: 6, viewerId: 1, score: 6.5},
  { _id: uuidv4(), id: 37, movieId: 6, viewerId: 2, score: 5.7},
  { _id: uuidv4(), id: 38, movieId: 6, viewerId: 3, score: 6.66},
  { _id: uuidv4(), id: 39, movieId: 6, viewerId: 9, score: 6},
  { _id: uuidv4(), id: 40, movieId: 6, viewerId: 5, score: 4.7},
  { _id: uuidv4(), id: 41, movieId: 6, viewerId: 6, score: 5.8},
  { _id: uuidv4(), id: 42, movieId: 6, viewerId: 10, score: 4.5},
  { _id: uuidv4(), id: 43, movieId: 6, viewerId: 11, score: 5},
  { _id: uuidv4(), id: 44, movieId: 7, viewerId: 4, score: 8},
  { _id: uuidv4(), id: 45, movieId: 7, viewerId: 1, score: 7.8},
  { _id: uuidv4(), id: 46, movieId: 7, viewerId: 2, score: 8.3},
  { _id: uuidv4(), id: 47, movieId: 7, viewerId: 3, score: 9},
  { _id: uuidv4(), id: 48, movieId: 8, viewerId: 4, score: 8},
  { _id: uuidv4(), id: 49, movieId: 8, viewerId: 1, score: 8.3},
  { _id: uuidv4(), id: 50, movieId: 8, viewerId: 2, score: 8.5},
  { _id: uuidv4(), id: 51, movieId: 8, viewerId: 3, score: 8},
  { _id: uuidv4(), id: 52, movieId: 8, viewerId: 6, score: 7.6},
  { _id: uuidv4(), id: 53, movieId: 8, viewerId: 7, score: 7.8},
  { _id: uuidv4(), id: 54, movieId: 9, viewerId: 4, score: 7},
  { _id: uuidv4(), id: 55, movieId: 9, viewerId: 1, score: 6.8},
  { _id: uuidv4(), id: 56, movieId: 9, viewerId: 2, score: 6.1},
  { _id: uuidv4(), id: 57, movieId: 9, viewerId: 3, score: 6.7},
  { _id: uuidv4(), id: 58, movieId: 10, viewerId: 4, score: 6.7},
  { _id: uuidv4(), id: 59, movieId: 10, viewerId: 1, score: 5.8},
  { _id: uuidv4(), id: 60, movieId: 10, viewerId: 2, score: 3.2},
  { _id: uuidv4(), id: 61, movieId: 10, viewerId: 3, score: 5},
  { _id: uuidv4(), id: 62, movieId: 10, viewerId: 8, score: 6.8},
  { _id: uuidv4(), id: 63, movieId: 10, viewerId: 9, score: 4.2},
  { _id: uuidv4(), id: 64, movieId: 10, viewerId: 5, score: 5.3},
  { _id: uuidv4(), id: 65, movieId: 10, viewerId: 12, score: 6.5},
  { _id: uuidv4(), id: 66, movieId: 10, viewerId: 7, score: 6},
  { _id: uuidv4(), id: 67, movieId: 11, viewerId: 4, score: 7.5},
  { _id: uuidv4(), id: 68, movieId: 11, viewerId: 1, score: 7.6},
  { _id: uuidv4(), id: 69, movieId: 11, viewerId: 2, score: 6.2},
  { _id: uuidv4(), id: 70, movieId: 11, viewerId: 5, score: 6.8},
  { _id: uuidv4(), id: 71, movieId: 11, viewerId: 12, score: 4.5},
  { _id: uuidv4(), id: 72, movieId: 11, viewerId: 6, score: 6.2},
  { _id: uuidv4(), id: 73, movieId: 12, viewerId: 4, score: 8.5},
  { _id: uuidv4(), id: 74, movieId: 12, viewerId: 1, score: 7.3},
  { _id: uuidv4(), id: 75, movieId: 12, viewerId: 2, score: 7.7},
  { _id: uuidv4(), id: 76, movieId: 12, viewerId: 3, score: 6.5},
  { _id: uuidv4(), id: 77, movieId: 12, viewerId: 5, score: 7.1},
  { _id: uuidv4(), id: 78, movieId: 12, viewerId: 6, score: 7.2},
  { _id: uuidv4(), id: 79, movieId: 13, viewerId: 4, score: 9.5},
  { _id: uuidv4(), id: 80, movieId: 13, viewerId: 1, score: 8.9},
  { _id: uuidv4(), id: 81, movieId: 13, viewerId: 3, score: 8.9},
  { _id: uuidv4(), id: 82, movieId: 13, viewerId: 8, score: 5},
  { _id: uuidv4(), id: 83, movieId: 13, viewerId: 9, score: 8.9},
  { _id: uuidv4(), id: 84, movieId: 13, viewerId: 5, score: 9.7},
  { _id: uuidv4(), id: 85, movieId: 13, viewerId: 12, score: 8},
  { _id: uuidv4(), id: 86, movieId: 13, viewerId: 6, score: 8.1},
  { _id: uuidv4(), id: 87, movieId: 13, viewerId: 7, score: 9.6},
  { _id: uuidv4(), id: 88, movieId: 13, viewerId: 10, score: 9},
  { _id: uuidv4(), id: 89, movieId: 13, viewerId: 11, score: 8.5},
  { _id: uuidv4(), id: 90, movieId: 14, viewerId: 4, score: 8},
  { _id: uuidv4(), id: 91, movieId: 14, viewerId: 1, score: 6.9},
  { _id: uuidv4(), id: 92, movieId: 14, viewerId: 2, score: 1.6},
  { _id: uuidv4(), id: 93, movieId: 14, viewerId: 3, score: 6.9},
  { _id: uuidv4(), id: 94, movieId: 14, viewerId: 9, score: 6},
  { _id: uuidv4(), id: 95, movieId: 14, viewerId: 5, score: 8.5},
  { _id: uuidv4(), id: 96, movieId: 14, viewerId: 6, score: 5.4},
  { _id: uuidv4(), id: 97, movieId: 15, viewerId: 4, score: 7.6},
  { _id: uuidv4(), id: 98, movieId: 15, viewerId: 1, score: 6.8},
  { _id: uuidv4(), id: 99, movieId: 15, viewerId: 9, score: 6.8},
  { _id: uuidv4(), id: 100, movieId: 15, viewerId: 5, score: 5.8},
  { _id: uuidv4(), id: 101, movieId: 15, viewerId: 6, score: 6.5},
  { _id: uuidv4(), id: 102, movieId: 15, viewerId: 7, score: 6.9},
  { _id: uuidv4(), id: 103, movieId: 15, viewerId: 14, score: 7.5},
  { _id: uuidv4(), id: 104, movieId: 16, viewerId: 4, score: 8.2},
  { _id: uuidv4(), id: 105, movieId: 16, viewerId: 1, score: 7.2},
  { _id: uuidv4(), id: 106, movieId: 16, viewerId: 2, score: 6.7},
  { _id: uuidv4(), id: 107, movieId: 16, viewerId: 3, score: 7.5},
  { _id: uuidv4(), id: 108, movieId: 16, viewerId: 8, score: 9.5},
  { _id: uuidv4(), id: 109, movieId: 16, viewerId: 9, score: 8.5},
  { _id: uuidv4(), id: 110, movieId: 16, viewerId: 5, score: 7.6},
  { _id: uuidv4(), id: 111, movieId: 16, viewerId: 6, score: 8.7},
  { _id: uuidv4(), id: 112, movieId: 16, viewerId: 7, score: 7.9},
  { _id: uuidv4(), id: 113, movieId: 16, viewerId: 14, score: 8},
  { _id: uuidv4(), id: 114, movieId: 17, viewerId: 4, score: 7},
  { _id: uuidv4(), id: 115, movieId: 17, viewerId: 1, score: 9.3},
  { _id: uuidv4(), id: 116, movieId: 17, viewerId: 2, score: 6.8},
  { _id: uuidv4(), id: 117, movieId: 17, viewerId: 3, score: 7.7},
  { _id: uuidv4(), id: 118, movieId: 17, viewerId: 9, score: 7},
  { _id: uuidv4(), id: 119, movieId: 17, viewerId: 6, score: 7.8},
  { _id: uuidv4(), id: 120, movieId: 17, viewerId: 13, score: 7.8},
  { _id: uuidv4(), id: 121, movieId: 18, viewerId: 4, score: 8.5},
  { _id: uuidv4(), id: 122, movieId: 18, viewerId: 1, score: 10},
  { _id: uuidv4(), id: 123, movieId: 18, viewerId: 3, score: 9},
  { _id: uuidv4(), id: 124, movieId: 18, viewerId: 8, score: 10},
  { _id: uuidv4(), id: 125, movieId: 18, viewerId: 9, score: 7.5},
  { _id: uuidv4(), id: 126, movieId: 18, viewerId: 5, score: 8.7},
  { _id: uuidv4(), id: 127, movieId: 18, viewerId: 12, score: 9},
  { _id: uuidv4(), id: 128, movieId: 18, viewerId: 6, score: 8.7},
  { _id: uuidv4(), id: 129, movieId: 19, viewerId: 4, score: 7},
  { _id: uuidv4(), id: 130, movieId: 19, viewerId: 1, score: 5},
  { _id: uuidv4(), id: 131, movieId: 19, viewerId: 2, score: 6.9},
  { _id: uuidv4(), id: 132, movieId: 19, viewerId: 8, score: 9.5},
  { _id: uuidv4(), id: 133, movieId: 19, viewerId: 5, score: 5.5},
  { _id: uuidv4(), id: 134, movieId: 19, viewerId: 6, score: 5.2},
  { _id: uuidv4(), id: 135, movieId: 19, viewerId: 7, score: 10},
  { _id: uuidv4(), id: 136, movieId: 20, viewerId: 4, score: 8},
  { _id: uuidv4(), id: 137, movieId: 20, viewerId: 1, score: 7.8},
  { _id: uuidv4(), id: 138, movieId: 20, viewerId: 2, score: 7.6},
  { _id: uuidv4(), id: 139, movieId: 20, viewerId: 3, score: 7.5},
  { _id: uuidv4(), id: 140, movieId: 20, viewerId: 5, score: 7.1},
  { _id: uuidv4(), id: 141, movieId: 20, viewerId: 6, score: 8.2},
  { _id: uuidv4(), id: 142, movieId: 20, viewerId: 7, score: 8.6},
  { _id: uuidv4(), id: 143, movieId: 21, viewerId: 4, score: 7.8},
  { _id: uuidv4(), id: 144, movieId: 21, viewerId: 1, score: 7.8},
  { _id: uuidv4(), id: 145, movieId: 21, viewerId: 2, score: 6.8},
  { _id: uuidv4(), id: 146, movieId: 21, viewerId: 3, score: 7.8},
  { _id: uuidv4(), id: 147, movieId: 21, viewerId: 5, score: 7.6},
  { _id: uuidv4(), id: 148, movieId: 21, viewerId: 6, score: 7.6},
  { _id: uuidv4(), id: 149, movieId: 22, viewerId: 4, score: 7.2},
  { _id: uuidv4(), id: 150, movieId: 22, viewerId: 1, score: 7.5},
  { _id: uuidv4(), id: 151, movieId: 22, viewerId: 2, score: 6.7},
  { _id: uuidv4(), id: 152, movieId: 22, viewerId: 3, score: 7},
  { _id: uuidv4(), id: 153, movieId: 22, viewerId: 12, score: 6.5},
  { _id: uuidv4(), id: 154, movieId: 22, viewerId: 6, score: 7.1},
  { _id: uuidv4(), id: 155, movieId: 22, viewerId: 7, score: 7.5},
  { _id: uuidv4(), id: 156, movieId: 23, viewerId: 4, score: 8.4},
  { _id: uuidv4(), id: 157, movieId: 23, viewerId: 1, score: 6.9},
  { _id: uuidv4(), id: 158, movieId: 23, viewerId: 2, score: 6},
  { _id: uuidv4(), id: 159, movieId: 23, viewerId: 3, score: 6.9},
  { _id: uuidv4(), id: 160, movieId: 23, viewerId: 9, score: 6.7},
  { _id: uuidv4(), id: 161, movieId: 23, viewerId: 5, score: 9},
  { _id: uuidv4(), id: 162, movieId: 23, viewerId: 6, score: 6.2},
  { _id: uuidv4(), id: 163, movieId: 23, viewerId: 10, score: 8.9},
  { _id: uuidv4(), id: 164, movieId: 23, viewerId: 11, score: 6},
  { _id: uuidv4(), id: 165, movieId: 24, viewerId: 4, score: 6},
  { _id: uuidv4(), id: 166, movieId: 24, viewerId: 1, score: 9},
  { _id: uuidv4(), id: 167, movieId: 24, viewerId: 2, score: 7.4},
  { _id: uuidv4(), id: 168, movieId: 24, viewerId: 3, score: 7.9},
  { _id: uuidv4(), id: 169, movieId: 24, viewerId: 8, score: 7.8},
  { _id: uuidv4(), id: 170, movieId: 24, viewerId: 5, score: 9.1},
  { _id: uuidv4(), id: 171, movieId: 24, viewerId: 12, score: 9},
  { _id: uuidv4(), id: 172, movieId: 24, viewerId: 6, score: 8.6},
  { _id: uuidv4(), id: 173, movieId: 24, viewerId: 7, score: 8.2},
  { _id: uuidv4(), id: 174, movieId: 24, viewerId: 10, score: 6.9},
  { _id: uuidv4(), id: 175, movieId: 24, viewerId: 11, score: 6.5},
  { _id: uuidv4(), id: 176, movieId: 25, viewerId: 4, score: 7.4},
  { _id: uuidv4(), id: 177, movieId: 25, viewerId: 1, score: 7.6},
  { _id: uuidv4(), id: 178, movieId: 25, viewerId: 2, score: 7.1},
  { _id: uuidv4(), id: 179, movieId: 25, viewerId: 3, score: 7.5},
  { _id: uuidv4(), id: 180, movieId: 25, viewerId: 8, score: 7.5},
  { _id: uuidv4(), id: 181, movieId: 25, viewerId: 5, score: 7.4},
  { _id: uuidv4(), id: 182, movieId: 25, viewerId: 12, score: 7.7},
  { _id: uuidv4(), id: 183, movieId: 25, viewerId: 6, score: 7.5},
  { _id: uuidv4(), id: 184, movieId: 25, viewerId: 7, score: 7.1},
  { _id: uuidv4(), id: 185, movieId: 25, viewerId: 10, score: 7.8},
  { _id: uuidv4(), id: 186, movieId: 25, viewerId: 11, score: 8.2},
  { _id: uuidv4(), id: 187, movieId: 26, viewerId: 4, score: 8.3},
  { _id: uuidv4(), id: 188, movieId: 26, viewerId: 1, score: 7.3},
  { _id: uuidv4(), id: 189, movieId: 26, viewerId: 2, score: 7.5},
  { _id: uuidv4(), id: 190, movieId: 26, viewerId: 3, score: 8},
  { _id: uuidv4(), id: 191, movieId: 26, viewerId: 8, score: 6.5},
  { _id: uuidv4(), id: 192, movieId: 26, viewerId: 5, score: 6.9},
  { _id: uuidv4(), id: 193, movieId: 26, viewerId: 12, score: 9},
  { _id: uuidv4(), id: 194, movieId: 26, viewerId: 6, score: 8.7},
  { _id: uuidv4(), id: 195, movieId: 26, viewerId: 11, score: 7},
  { _id: uuidv4(), id: 196, movieId: 27, viewerId: 4, score: 9},
  { _id: uuidv4(), id: 197, movieId: 27, viewerId: 2, score: 7.4},
  { _id: uuidv4(), id: 198, movieId: 27, viewerId: 3, score: 7.8},
  { _id: uuidv4(), id: 199, movieId: 27, viewerId: 8, score: 9.5},
  { _id: uuidv4(), id: 200, movieId: 27, viewerId: 9, score: 9.4},
  { _id: uuidv4(), id: 201, movieId: 27, viewerId: 5, score: 8.8},
  { _id: uuidv4(), id: 202, movieId: 27, viewerId: 12, score: 7.5},
  { _id: uuidv4(), id: 203, movieId: 27, viewerId: 6, score: 8.6},
  { _id: uuidv4(), id: 204, movieId: 27, viewerId: 10, score: 7.2},
  { _id: uuidv4(), id: 205, movieId: 27, viewerId: 11, score: 9},
  { _id: uuidv4(), id: 206, movieId: 28, viewerId: 4, score: 7.3},
  { _id: uuidv4(), id: 207, movieId: 28, viewerId: 1, score: 4.3},
  { _id: uuidv4(), id: 208, movieId: 28, viewerId: 2, score: 2.8},
  { _id: uuidv4(), id: 209, movieId: 28, viewerId: 3, score: 3},
  { _id: uuidv4(), id: 210, movieId: 28, viewerId: 8, score: 0.1},
  { _id: uuidv4(), id: 211, movieId: 28, viewerId: 9, score: 5},
  { _id: uuidv4(), id: 212, movieId: 28, viewerId: 5, score: 6},
  { _id: uuidv4(), id: 213, movieId: 28, viewerId: 12, score: 2},
  { _id: uuidv4(), id: 214, movieId: 28, viewerId: 6, score: 5.4},
  { _id: uuidv4(), id: 215, movieId: 28, viewerId: 7, score: 5.2},
  { _id: uuidv4(), id: 216, movieId: 28, viewerId: 10, score: 6.8},
  { _id: uuidv4(), id: 217, movieId: 28, viewerId: 11, score: 4},
  { _id: uuidv4(), id: 218, movieId: 28, viewerId: 15, score: 6.5},
  { _id: uuidv4(), id: 219, movieId: 28, viewerId: 16, score: 7.8},
  { _id: uuidv4(), id: 220, movieId: 29, viewerId: 4, score: 7},
  { _id: uuidv4(), id: 221, movieId: 29, viewerId: 1, score: 6.5},
  { _id: uuidv4(), id: 222, movieId: 29, viewerId: 2, score: 5.9},
  { _id: uuidv4(), id: 223, movieId: 29, viewerId: 3, score: 6},
  { _id: uuidv4(), id: 224, movieId: 29, viewerId: 9, score: 6},
  { _id: uuidv4(), id: 225, movieId: 29, viewerId: 5, score: 6.2},
  { _id: uuidv4(), id: 226, movieId: 29, viewerId: 12, score: 6},
  { _id: uuidv4(), id: 227, movieId: 29, viewerId: 6, score: 6.4},
  { _id: uuidv4(), id: 228, movieId: 29, viewerId: 10, score: 6.5},
  { _id: uuidv4(), id: 229, movieId: 29, viewerId: 11, score: 7 },
  { _id: uuidv4(), id: 230, movieId: 30, viewerId: 1, score: 8.4 }, // Walt
  { _id: uuidv4(), id: 231, movieId: 30, viewerId: 2, score: 9.6 }, // Jesse
  { _id: uuidv4(), id: 232, movieId: 30, viewerId: 3, score: 8.0 }, // Kieran
  { _id: uuidv4(), id: 233, movieId: 30, viewerId: 4, score: 8.2 }, // Nicole
  { _id: uuidv4(), id: 234, movieId: 30, viewerId: 5, score: 10.0 }, // Mike
  { _id: uuidv4(), id: 235, movieId: 30, viewerId: 6, score: 9.0 }, // Jay
  { _id: uuidv4(), id: 236, movieId: 30, viewerId: 12, score: 10.0 }, // Glen
  { _id: uuidv4(), id: 237, movieId: 30, viewerId: 10, score: 5.0 }, // Sam
  { _id: uuidv4(), id: 238, movieId: 30, viewerId: 11, score: 5.0 }, // Garrett
  { _id: uuidv4(), id: 239, movieId: 31, viewerId: 4, score: 8.5 }, // Nicole
  { _id: uuidv4(), id: 240, movieId: 31, viewerId: 2, score: 7.2 }, // Jesse
  { _id: uuidv4(), id: 241, movieId: 31, viewerId: 3, score: 10.0 }, // Kieran
  { _id: uuidv4(), id: 242, movieId: 31, viewerId: 5, score: 9.3 }, // Mike
  { _id: uuidv4(), id: 243, movieId: 31, viewerId: 6, score: 6.0 }, // Jay
  { _id: uuidv4(), id: 244, movieId: 31, viewerId: 8, score: 6.1 }, // Maggie
  { _id: uuidv4(), id: 245, movieId: 31, viewerId: 12, score: 9.0 }, // Glen
  { _id: uuidv4(), id: 246, movieId: 31, viewerId: 7, score: 9.0 }, // Mitch
  { _id: uuidv4(), id: 247, movieId: 31, viewerId: 10, score: 4.8 }, // Sam
  { _id: uuidv4(), id: 248, movieId: 31, viewerId: 11, score: 7.5 }, // Garrett
  { _id: uuidv4(), id: 249, movieId: 31, viewerId: 13, score: 7.0 }, // Coob
  { _id: uuidv4(), id: 250, movieId: 32, viewerId: 4, score: 7.9 },
  { _id: uuidv4(), id: 251, movieId: 32, viewerId: 1, score: 6.3 },
  { _id: uuidv4(), id: 252, movieId: 32, viewerId: 2, score: 6.6 },
  { _id: uuidv4(), id: 253, movieId: 32, viewerId: 3, score: 6 },
  { _id: uuidv4(), id: 254, movieId: 32, viewerId: 9, score: 6.5 },
  { _id: uuidv4(), id: 255, movieId: 32, viewerId: 5, score: 7.4 },
  { _id: uuidv4(), id: 256, movieId: 32, viewerId: 12, score: 6 },
  { _id: uuidv4(), id: 257, movieId: 32, viewerId: 10, score: 7.2 },
  { _id: uuidv4(), id: 258, movieId: 32, viewerId: 7, score: 6.2 },
  { _id: uuidv4(), id: 259, movieId: 32, viewerId: 10, score: 6 },
  { _id: uuidv4(), id: 260, movieId: 32, viewerId: 11, score: 6.5 },
  { _id: uuidv4(), id: 261, movieId: 32, viewerId: 13, score: 7.4 },
  { _id: uuidv4(), id: 262, movieId: 32, viewerId: 14, score: 6.8 },
  { _id: uuidv4(), id: 263, movieId: 32, viewerId: 15, score: 6 },
];

export const viewersData = [
   { 
    id: 1,
    _id: uuidv4(),
    name: "Walt",
    clerkId: "walt@clerkId.com",
    discordId: "123456789",
    discordUsername: "walt#1234",
    color: "#FF5733", // Warm orange
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Walt",
    joinedDate: new Date("2023-01-01"),
    isAdmin: true
  },
  { 
    id: 2,
    _id: uuidv4(),
    name: "Jesse",
    clerkId: "jesse@clerkId.com",
    discordId: "234567890",
    discordUsername: "jesse#5678",
    color: "#33FF57", // Bright green
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jesse",
    joinedDate: new Date("2023-01-02"),
    isAdmin: false
  },
  { 
    id: 3,
    _id: uuidv4(),
    name: "Kieran",
    clerkId: "user_2nfbZyfw3etREo7xr8Hdog6K6ih",
    discordId: "345678901",
    discordUsername: "kieran#9012",
    color: "#3357FF", // Blue
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kieran",
    joinedDate: new Date("2023-01-03"),
    isAdmin: true
  },
  { 
    id: 4,
    _id: uuidv4(),
    name: "Nicole",
    clerkId: "nicole@clerkId.com",
    discordId: "456789012",
    discordUsername: "nicole#3456",
    color: "#FF33F5", // Pink
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nicole",
    joinedDate: new Date("2023-02-01"),
    isAdmin: false
  },
  { 
    id: 5,
    _id: uuidv4(),
    name: "Maggie",
    clerkId: "maggie@clerkId.com",
    discordId: "567890123",
    discordUsername: "maggie#7890",
    color: "#FFD700", // Gold
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maggie",
    joinedDate: new Date("2023-02-15"),
    isAdmin: false
  },
  { 
    id: 6,
    _id: uuidv4(),
    name: "Jonny",
    clerkId: "user_2nnc8MWkBNdElRIci7yw9h7OpLW",
    discordId: "678901234",
    discordUsername: "jonny#4567",
    color: "#E74C3C", // Bright red
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonny",
    joinedDate: new Date("2023-02-20"),
    isAdmin: false
  },
  { 
    id: 7,
    _id: uuidv4(),
    name: "Mitch",
    clerkId: "mitch@clerkId.com",
    discordId: "789012345",
    discordUsername: "mitch#8901",
    color: "#2ECC71", // Emerald green
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mitch",
    joinedDate: new Date("2023-03-01"),
    isAdmin: false
  },
  { 
    id: 8,
    _id: uuidv4(),
    name: "Mike",
    clerkId: "mike@clerkId.com",
    discordId: "890123456",
    discordUsername: "mike#2345",
    color: "#3498DB", // Ocean blue
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    joinedDate: new Date("2023-03-15"),
    isAdmin: false
  },
  { 
    id: 9,
    _id: uuidv4(),
    name: "Jay",
    clerkId: "jay@clerkId.com",
    discordId: "901234567",
    discordUsername: "jay#6789",
    color: "#9B59B6", // Purple
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jay",
    joinedDate: new Date("2023-04-01"),
    isAdmin: false
  },
  { 
    id: 10,
    _id: uuidv4(),
    name: "Sam",
    clerkId: "sam@clerkId.com",
    discordId: "012345678",
    discordUsername: "sam#0123",
    color: "#F1C40F", // Yellow
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    joinedDate: new Date("2023-04-15"),
    isAdmin: false
  },
  { 
    id: 11,
    _id: uuidv4(),
      name: "Garrett",
    clerkId: "garet@clerkId.com",
    discordId: "123456780",
    discordUsername: "garrett#4567",
    color: "#1ABC9C", // Turquoise
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Garrett",
    joinedDate: new Date("2023-05-01"),
    isAdmin: false
  },
  { 
    id: 12,
    _id: uuidv4(),
    name: "Glen",
    clerkId: "user_2nXSWm5M7UciAriKqOfUnwRiI2q",
    discordId: "234567801",
    discordUsername: "glen#8901",
    color: "#D35400", // Burnt orange
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Glen",
    joinedDate: new Date("2023-05-15"),
    isAdmin: true
  },
  { 
    id: 13,
    _id: uuidv4(),
    name: "Paddy",
    clerkId: "paddy@clerkId.com",
    discordId: "345678012",
    discordUsername: "paddy#2345",
    color: "#27AE60", // Forest green
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paddy",
    joinedDate: new Date("2023-06-01"),
    isAdmin: false
  },
  { 
    id: 14,
    _id: uuidv4(),
    name: "Colin",
    clerkId: "colin@clerkId.com",
    discordId: "456780123",
    discordUsername: "colin#6789",
    color: "#2980B9", // Strong blue
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Colin",
    joinedDate: new Date("2023-06-15"),
    isAdmin: false
  },
  { 
    id: 15,
    _id: uuidv4(),
    name: "Kyle",
    clerkId: "kyle@clerkId.com",
    discordId: "567801234",
    discordUsername: "kyle#0123",
    color: "#8E44AD", // Royal purple
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle",
    joinedDate: new Date("2023-07-01"),
    isAdmin: false
  },
  { 
    id: 16,
    _id: uuidv4(),
    name: "Soraya",
    clerkId: "soraya@clerkId.com",
    discordId: "678012345",
    discordUsername: "soraya#4567",
    color: "#C0392B", // Deep red
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Soraya",
    joinedDate: new Date("2023-07-15"),
    isAdmin: false
  },
  { 
    id: 17,
    _id: uuidv4(),
    name: "Coob",
    clerkId: "coob@clerkId.com",
    discordId: "789012345",
    discordUsername: "coob#7890",
    color: "#9B59B6", // Purple
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coob",
    joinedDate: new Date("2023-01-13"),
    isAdmin: false
  },
  {
    id: 18,
    _id: uuidv4(),
    name: "test",
    clerkId: "user_2oB4uhwcaRV85dTK5fYFZchMbKe",
    discordId: "123456789",
    discordUsername: "pro wrestler",
    color: "#FF5733",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
    joinedDate: new Date("2024-10-31"),
    isAdmin: false
  }
];

// Helper function to validate foreign keys
function validateData() {
  const viewerIds = new Set(viewersData.map(v => v.id));
  const movieIds = new Set(moviesData.map(m => m.id));

  // Validate pickedBy in movies
  const invalidMovies = moviesData.filter(m => !viewerIds.has(m.pickedBy));
  if (invalidMovies.length > 0) {
    console.error('Invalid pickedBy references:', invalidMovies);
  }

  // Validate movieId and viewerId in ratings
  const invalidRatings = ratingsData.filter(r => 
    !movieIds.has(r.movieId) || !viewerIds.has(r.viewerId)
  );
  if (invalidRatings.length > 0) {
    console.error('Invalid rating references:', invalidRatings);
  }

  // Warn if no admin
  const checkForAdmin = viewersData.filter(v => v.isAdmin);
  if (checkForAdmin.length === 0) {
    console.warn('No admin found');
  }
}

// Call this before exporting
validateData();