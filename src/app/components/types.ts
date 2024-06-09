export type Post = {
    date: Date;
  };

export type PostsByYear = Array<{
    key: string;
    posts: Array<Post>;
    pageNumber: number;
    totalPages: number;
  }>;