export type Post = {
  date: Date;
};

export type PostsByYear = Array<{
  key: string;
  posts: Array<Post>;
}>;

export type PostsByYearPaged = Array<{
  key: string;
  posts: Array<Post>;
  pageNumber: number;
  totalPages: number;
}>;

export type Categories = {
  [id: string]: number;
};