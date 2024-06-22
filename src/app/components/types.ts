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

export type Pagination = {
  items: Array<any>;
  pageNumber: number;
  hrefs: Array<string>;
  href: {
    next: string;
    previous: string;
    first: string;
    last: string;
  };
  pages: Array<any>;
  page: {
    next: any;
    previous: any;
    first: any;
    last: any;
  };
}
