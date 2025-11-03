import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import PenGrid from "@/components/organisms/PenGrid";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { usePenSearch } from "@/hooks/usePens";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
const query = searchParams.get("q") || "";
  const sortBy = searchParams.get("sort") || "recent";
  const filterBy = searchParams.get("filter") || "all";
  const { results, loading, error, search } = usePenSearch();
  const [hasSearched, setHasSearched] = useState(false);

useEffect(() => {
    if (query) {
      search(query, { sortBy, filterBy });
      setHasSearched(true);
    }
  }, [query, sortBy, filterBy, search]);

const handleSearch = (newQuery) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery.trim()) {
      params.set("q", newQuery);
      setSearchParams(params);
    } else {
      params.delete("q");
      setSearchParams(params);
    }
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    setSearchParams(params);
  };

  const handleFilterChange = (newFilter) => {
    const params = new URLSearchParams(searchParams);
    params.set("filter", newFilter);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Search" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent">
              Search Pens
            </h1>
          </div>
          
          <div className="max-w-2xl mx-auto mb-8">
<SearchBar 
              onSearch={handleSearch} 
              placeholder="Search by keywords, tags, or author name..."
              defaultValue={query}
            />
          </div>

{/* Advanced Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Search in:
              </label>
              <select 
                value={filterBy}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full bg-surface border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="all">All Content</option>
                <option value="title">Titles Only</option>
                <option value="author">Authors Only</option>
                <option value="tags">Tags Only</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sort by:
              </label>
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full bg-surface border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>

          {query && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <p className="text-slate-400 text-lg">
                {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Filtered by:</span>
                <span className="px-2 py-1 bg-slate-700 rounded-full capitalize">{filterBy}</span>
                <span>•</span>
                <span className="px-2 py-1 bg-slate-700 rounded-full">
                  {sortBy === "recent" ? "Most Recent" : 
                   sortBy === "popular" ? "Most Popular" :
                   sortBy === "views" ? "Most Viewed" : "Most Liked"}
                </span>
              </div>
            </div>
          )}
        </motion.div>

{loading ? (
          <Loading type="cards" />
        ) : error ? (
          <Error message={error} onRetry={() => search(query, { sortBy, filterBy })} />
        ) : !hasSearched ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Search" className="w-12 h-12 text-slate-500" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-4">Advanced Search</h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-6">
              Search for pens by keywords, tags, or author names. Use the filters above to refine your results.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto text-sm">
              <div className="bg-slate-800 rounded-lg p-3">
                <ApperIcon name="Hash" className="w-4 h-4 text-primary-400 mx-auto mb-1" />
                <div className="text-slate-300 font-medium">Keywords</div>
                <div className="text-slate-500 text-xs">Search titles</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <ApperIcon name="Tag" className="w-4 h-4 text-secondary-400 mx-auto mb-1" />
                <div className="text-slate-300 font-medium">Tags</div>
                <div className="text-slate-500 text-xs">Find by tags</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <ApperIcon name="User" className="w-4 h-4 text-accent-400 mx-auto mb-1" />
                <div className="text-slate-300 font-medium">Authors</div>
                <div className="text-slate-500 text-xs">By creator</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <ApperIcon name="SortDesc" className="w-4 h-4 text-primary-400 mx-auto mb-1" />
                <div className="text-slate-300 font-medium">Sort</div>
                <div className="text-slate-500 text-xs">Multiple options</div>
              </div>
            </div>
          </div>
        ) : results.length === 0 ? (
          <Empty 
            title={`No results for "${query}"`}
            description="Try adjusting your search terms, filters, or create your own pen"
            actionText="Create New Pen"
            actionLink="/editor"
          />
        ) : (
          <PenGrid pens={results} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;