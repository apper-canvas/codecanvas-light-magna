import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import CodeEditor from "@/components/organisms/CodeEditor";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { usePen } from "@/hooks/usePen";
import { toast } from "react-toastify";

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pen, loading, error, savePen } = usePen(id);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async (penData) => {
    try {
      const savedPen = await savePen(penData);
      setHasChanges(false);
      
      if (!id && savedPen.Id) {
        navigate(`/editor/${savedPen.Id}`, { replace: true });
      }
      
      return savedPen;
    } catch (err) {
      toast.error("Failed to save pen");
      throw err;
    }
  };

  const handleTitleChange = () => {
    setHasChanges(true);
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (loading && id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between p-4 border-b border-slate-700 bg-surface/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            Back
          </Button>
          <div className="w-px h-6 bg-slate-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Code2" className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-300 font-medium">
              {id ? "Edit Pen" : "New Pen"}
            </span>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-2 text-accent-400 text-sm">
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
            Unsaved changes
          </div>
        )}
      </motion.div>

      {/* Editor */}
      <motion.div
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CodeEditor 
          pen={pen}
          onSave={handleSave}
          onTitleChange={handleTitleChange}
        />
      </motion.div>
    </div>
  );
};

export default EditorPage;