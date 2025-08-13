'use client';

import { useState, useEffect } from 'react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  timestamp: Date;
}

export function useBookmarks(journey: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [journey]);

  const loadBookmarks = () => {
    try {
      const stored = localStorage.getItem(`bookmarks_${journey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBookmarks(parsed.map((bookmark: any) => ({
          ...bookmark,
          timestamp: new Date(bookmark.timestamp)
        })));
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
  };

  const addCurrentPageBookmark = (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    // Check if bookmark already exists
    const exists = bookmarks.some(b => b.url === bookmark.url);
    if (!exists) {
      addBookmark(bookmark);
    }
  };

  const removeBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== id);
    setBookmarks(updatedBookmarks);
    saveBookmarks(updatedBookmarks);
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some(b => b.id === id);
  };

  const saveBookmarks = (bookmarksToSave: Bookmark[]) => {
    try {
      localStorage.setItem(`bookmarks_${journey}`, JSON.stringify(bookmarksToSave));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  return {
    bookmarks,
    loading,
    addBookmark,
    addCurrentPageBookmark,
    removeBookmark,
    isBookmarked,
    saveBookmarks
  };
}
