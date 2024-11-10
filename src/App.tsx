import React, { useState } from 'react';
import { Library, Loader2, BookOpen } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { BookCard } from './components/BookCard';
import { ReadingListPanel } from './components/ReadingListPanel';
import type { Book, SearchResponse, SearchFilter, ReadingList } from './types';

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);

  const searchBooks = async (filter: SearchFilter) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?${filter}=${encodeURIComponent(query)}&limit=20`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data: SearchResponse = await response.json();
      setBooks(data.docs);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const createReadingList = (name: string) => {
    const newList: ReadingList = {
      id: crypto.randomUUID(),
      name,
      books: [],
    };
    setReadingLists([...readingLists, newList]);
  };

  const addToReadingList = (listId: string, book: Book) => {
    setReadingLists(readingLists.map(list => {
      if (list.id === listId && !list.books.some(b => b.key === book.key)) {
        return { ...list, books: [...list.books, book] };
      }
      return list;
    }));
  };

  const removeFromReadingList = (listId: string, bookKey: string) => {
    setReadingLists(readingLists.map(list => {
      if (list.id === listId) {
        return { ...list, books: list.books.filter(b => b.key !== bookKey) };
      }
      return list;
    }));
  };

  const deleteReadingList = (listId: string) => {
    setReadingLists(readingLists.filter(list => list.id !== listId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Library className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">StudentBookFinder</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your academic companion for discovering books. Search by title, author, subject, or ISBN to find the resources you need for your studies.
          </p>
        </div>

        {/* Quick Tips */}
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-white rounded-lg shadow-sm border border-purple-100">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <BookOpen size={20} />
            <h2 className="font-semibold">Quick Tips</h2>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use ISBN search for exact textbook matches</li>
            <li>• Create reading lists for different courses or topics</li>
            <li>• Generate and copy citations in APA, MLA, or Chicago format</li>
            <li>• Look for "E-Book Available" badge for instant access</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Reading Lists */}
          <div className="lg:w-1/3">
            <ReadingListPanel
              readingLists={readingLists}
              onCreateList={createReadingList}
              onAddToList={addToReadingList}
              onRemoveFromList={removeFromReadingList}
              onDeleteList={deleteReadingList}
            />
          </div>

          {/* Right Panel - Search and Results */}
          <div className="lg:w-2/3">
            {/* Search Section */}
            <div className="mb-8">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSearch={searchBooks}
              />
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
                  {error}
                </div>
              ) : books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {books.map((book) => (
                    <BookCard
                      key={book.key}
                      book={book}
                      readingLists={readingLists}
                      onAddToList={addToReadingList}
                    />
                  ))}
                </div>
              ) : searched ? (
                <div className="text-center text-gray-500">
                  No books found. Try a different search term or filter.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;