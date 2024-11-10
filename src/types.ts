export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  language?: string[];
  publisher?: string[];
  subject?: string[];
  isbn?: string[];
  ebook_access?: string;
  number_of_pages_median?: number;
}

export interface SearchResponse {
  numFound: number;
  docs: Book[];
}

export interface ReadingList {
  id: string;
  name: string;
  books: Book[];
}

export type SearchFilter = 'title' | 'author' | 'subject' | 'isbn';
export type CitationFormat = 'APA' | 'MLA' | 'Chicago';