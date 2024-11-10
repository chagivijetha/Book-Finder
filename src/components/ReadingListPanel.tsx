import React from 'react';
import { BookMarked, Trash2, Copy } from 'lucide-react';
import type { Book, ReadingList, CitationFormat } from '../types';
import { generateCitation } from '../utils/citations';

interface ReadingListPanelProps {
  readingLists: ReadingList[];
  onCreateList: (name: string) => void;
  onAddToList: (listId: string, book: Book) => void;
  onRemoveFromList: (listId: string, bookKey: string) => void;
  onDeleteList: (listId: string) => void;
}

export function ReadingListPanel({
  readingLists,
  onCreateList,
  onAddToList,
  onRemoveFromList,
  onDeleteList,
}: ReadingListPanelProps) {
  const [newListName, setNewListName] = React.useState('');
  const [selectedFormat, setSelectedFormat] = React.useState<CitationFormat>('APA');

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
    }
  };

  const copyBookCitation = (book: Book) => {
    const citation = generateCitation(book, selectedFormat);
    navigator.clipboard.writeText(citation);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center gap-2 mb-6">
        <BookMarked className="text-purple-600" />
        <h2 className="text-xl font-semibold">Reading Lists</h2>
      </div>

      <form onSubmit={handleCreateList} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create
          </button>
        </div>
      </form>

      <div className="mb-4">
        <label className="text-sm text-gray-600 block mb-2">Citation Format:</label>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value as CitationFormat)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
        >
          <option value="APA">APA</option>
          <option value="MLA">MLA</option>
          <option value="Chicago">Chicago</option>
        </select>
      </div>

      <div className="space-y-6">
        {readingLists.map((list) => (
          <div key={list.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{list.name}</h3>
              <button
                onClick={() => onDeleteList(list.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <ul className="space-y-2">
              {list.books.map((book) => (
                <li key={book.key} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1 flex-1">{book.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyBookCitation(book)}
                      className="text-purple-600 hover:text-purple-700"
                      title="Copy citation"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => onRemoveFromList(list.id, book.key)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}