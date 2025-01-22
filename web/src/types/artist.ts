export interface Artist {
  _id: string;  // MongoDB uses _id instead of id
  name: string;
  genre: string;
  day: "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  stage: string;
  rating: number;
  mustSee: boolean;
  friendOverlap: Array<{
    username: string;
    rating: number;
  }>;
}
