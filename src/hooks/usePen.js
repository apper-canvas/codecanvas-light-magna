import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import penService from "@/services/api/penService";

export const usePen = (penId) => {
  const [pen, setPen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPen = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await penService.getById(id);
      if (data) {
        setPen(data);
        // Increment view count
        await penService.viewPen(id);
      } else {
        setError("Pen not found");
      }
    } catch (err) {
      setError("Failed to load pen. Please try again.");
      console.error("Error loading pen:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (penId) {
      loadPen(penId);
    }
  }, [penId]);

  const savePen = async (penData) => {
    try {
      if (pen && pen.Id) {
        const updatedPen = await penService.update(pen.Id, penData);
        setPen(updatedPen);
        return updatedPen;
      } else {
        const newPen = await penService.create(penData);
        setPen(newPen);
        return newPen;
      }
    } catch (err) {
      console.error("Error saving pen:", err);
      throw err;
    }
  };

  return {
    pen,
    loading,
    error,
    loadPen,
    savePen
  };
};