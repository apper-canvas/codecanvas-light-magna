import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ onSearch, placeholder = "Search pens...", defaultValue = "" }) => {
  const [query, setQuery] = useState(defaultValue);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
const value = e.target.value;
    setQuery(value);
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" 
        />
        <Input
          type="search"
placeholder={placeholder}
          value={query}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-4"
        />
      </div>
    </form>
  );
};

export default SearchBar;