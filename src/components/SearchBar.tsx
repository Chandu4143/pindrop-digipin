"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, Clock, MapPin, Sparkles } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

const RECENT_SEARCHES_KEY = 'pindrop_recent_searches';
const MAX_RECENT = 5;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch {
                setRecentSearches([]);
            }
        }
    }, []);

    // Keyboard shortcut: Cmd/Ctrl + K to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === 'Escape' && isFocused) {
                inputRef.current?.blur();
                setShowDropdown(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const saveRecentSearch = (searchQuery: string) => {
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, MAX_RECENT);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            saveRecentSearch(query.trim());
            onSearch(query);
            setShowDropdown(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        saveRecentSearch(suggestion);
        onSearch(suggestion);
        setShowDropdown(false);
    };

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(RECENT_SEARCHES_KEY);
    };

    const quickSuggestions = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'];
    const digipinExample = '422-7K9-7JML';

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <form onSubmit={handleSubmit}>
                <div 
                    className={`relative flex items-center bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                        isFocused 
                            ? 'shadow-xl shadow-blue-500/15 ring-2 ring-blue-500/30' 
                            : 'shadow-lg hover:shadow-xl'
                    }`}
                >
                    <div className="absolute left-4 flex items-center pointer-events-none">
                        {isLoading ? (
                            <Loader2 size={20} className="text-blue-500 animate-spin" />
                        ) : (
                            <Search size={20} className={`transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                        )}
                    </div>
                    
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { setIsFocused(true); setShowDropdown(true); }}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search place, address, or DIGIPIN..."
                        className="w-full py-3.5 pl-12 pr-28 text-gray-700 outline-none placeholder-gray-400 text-base bg-transparent"
                        disabled={isLoading}
                        aria-label="Search for a location or DIGIPIN"
                        autoComplete="off"
                    />

                    {/* Keyboard shortcut hint */}
                    {!query && !isFocused && (
                        <div className="absolute right-14 hidden sm:flex items-center gap-1 text-xs text-gray-400">
                            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">⌘K</kbd>
                        </div>
                    )}

                    {query && !isLoading && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-14 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className={`absolute right-2 p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                            query.trim() && !isLoading
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        aria-label="Search"
                    >
                        <Search size={18} />
                    </button>
                </div>
            </form>

            {/* Enhanced dropdown */}
            {showDropdown && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-down z-50">
                    {/* Recent searches */}
                    {recentSearches.length > 0 && !query && (
                        <div className="p-3 border-b border-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                    <Clock size={12} />
                                    Recent
                                </span>
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="space-y-1">
                                {recentSearches.map((search, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestionClick(search)}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                                    >
                                        <Clock size={14} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{search}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick suggestions */}
                    <div className="p-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                            <Sparkles size={12} />
                            {query ? 'Suggestions' : 'Try searching'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {quickSuggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg text-sm transition-all duration-200 active:scale-95"
                                >
                                    <MapPin size={12} />
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                        
                        {/* DIGIPIN example */}
                        <div className="mt-3 pt-3 border-t border-gray-50">
                            <button
                                onClick={() => handleSuggestionClick(digipinExample)}
                                className="w-full flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                        <MapPin size={14} className="text-white" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-xs text-gray-500 block">Try a DIGIPIN</span>
                                        <span className="font-mono font-semibold text-blue-700">{digipinExample}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Search →
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
