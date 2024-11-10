import React from 'react';
import { Book as BookIcon, Calendar, Globe, Users, Bookmark, Hash, Link, BookMarked, Copy } from 'lucide-react';
import type { Book, ReadingList, CitationFormat } from '../types';
import { generateCitation } from '../utils/citations';

interface BookCardProps {
  book: Book;
  readingLists: ReadingList[];
  onAddToList: (listId: string, book: Book) => void;
}

export function BookCard({ book, readingLists, onAddToList }: BookCardProps) {
  const [showListDropdown, setShowListDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=400';

  const copyAPACitation = () => {
    const citation = generateCitation(book, 'APA');
    navigator.clipboard.writeText(citation);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowListDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl">
      <div className="aspect-[2/3] relative overflow-hidden group">
        <img 
          src={coverUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
          loading="lazy"
        />
        {book.ebook_access && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            E-Book Available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{book.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          {book.author_name && (
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span className="line-clamp-1">{book.author_name.join(', ')}</span>
            </div>
          )}
          
          {book.first_publish_year && (
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{book.first_publish_year}</span>
            </div>
          )}
          
          {book.publisher && (
            <div className="flex items-center gap-2">
              <BookIcon size={16} />
              <span className="line-clamp-1">{book.publisher[0]}</span>
            </div>
          )}
          
          {book.subject && (
            <div className="flex items-center gap-2">
              <Bookmark size={16} />
              <span className="line-clamp-1">{book.subject.slice(0, 2).join(', ')}</span>
            </div>
          )}

          {book.isbn && (
            <div className="flex items-center gap-2">
              <Hash size={16} />
              <span className="font-mono text-xs">{book.isbn[0]}</span>
            </div>
          )}

          {book.language && (
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span className="uppercase">{book.language[0]}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowListDropdown(!showListDropdown)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <BookMarked size={16} />
              <span className="text-sm">Add to List</span>
            </button>
            
            {showListDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                {readingLists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => {
                      onAddToList(list.id, book);
                      setShowListDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors"
                  >
                    {list.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={copyAPACitation}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
              title="Copy APA citation"
            >
              <Copy size={16} />
            </button>
            
            <a
              href={`https://openlibrary.org${book.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Link size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}