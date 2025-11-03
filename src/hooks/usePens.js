import { useState, useEffect } from "react";
import penService from "@/services/api/penService";

export const usePens = () => {
  const [pens, setPens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await penService.getAll();
      setPens(data);
    } catch (err) {
      setError("Failed to load pens. Please try again.");
      console.error("Error loading pens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPens();
  }, []);

  const likePen = async (penId) => {
    try {
      const updatedPen = await penService.likePen(penId);
      if (updatedPen) {
        setPens(prevPens => 
          prevPens.map(pen => 
            pen.Id === penId ? updatedPen : pen
          )
        );
      }
    } catch (err) {
      console.error("Error liking pen:", err);
    }
  };

  const createPen = async (penData) => {
    try {
      const newPen = await penService.create(penData);
      setPens(prevPens => [newPen, ...prevPens]);
      return newPen;
    } catch (err) {
      console.error("Error creating pen:", err);
      throw err;
    }
  };

  return {
    pens,
    loading,
    error,
    loadPens,
    likePen,
    createPen
  };
};

export const useTrendingPens = () => {
  const [pens, setPens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTrendingPens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await penService.getTrending();
      setPens(data);
    } catch (err) {
      setError("Failed to load trending pens. Please try again.");
      console.error("Error loading trending pens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrendingPens();
  }, []);

  return {
    pens,
    loading,
    error,
    loadTrendingPens
  };
};

export const usePenSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearch, setLastSearch] = useState({ query: "", options: {} });

const search = async (query, options = {}) => {
    if (!query.trim()) {
      setResults([]);
      setLastSearch({ query: "", options: {} });
      return;
    }

    // Avoid duplicate searches
    const searchKey = JSON.stringify({ query, options });
    const lastSearchKey = JSON.stringify(lastSearch);
    if (searchKey === lastSearchKey) return;

    try {
      setLoading(true);
      setError(null);
      setLastSearch({ query, options });
      const data = await penService.search(query, options);
      setResults(data);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Error searching pens:", err);
    } finally {
      setLoading(false);
    }
  };

return {
    results,
    loading,
    error,
    search,
    lastSearch
  };
};