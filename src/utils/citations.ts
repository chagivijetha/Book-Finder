import type { Book } from '../types';

export function generateCitation(book: Book, format: CitationFormat): string {
  const authors = book.author_name?.[0] || 'Unknown Author';
  const year = book.first_publish_year?.toString() || 'n.d.';
  const publisher = book.publisher?.[0] || 'Unknown Publisher';

  switch (format) {
    case 'APA':
      return `${authors}. (${year}). ${book.title}. ${publisher}.`;
    case 'MLA':
      return `${authors}. ${book.title}. ${publisher}, ${year}.`;
    case 'Chicago':
      return `${authors}. ${book.title}. ${publisher}, ${year}.`;
    default:
      return '';
  }
}