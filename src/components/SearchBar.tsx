"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-md shadow-lg rounded-full">
            <div className="relative flex items-center bg-white rounded-full overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a location or PIN..."
                    className="w-full py-3 pl-5 pr-12 text-gray-700 outline-none placeholder-gray-400"
                />
                <button
                    type="submit"
                    className="absolute right-1 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                    <Search size={20} />
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
