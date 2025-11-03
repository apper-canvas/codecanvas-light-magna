import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const PenStats = ({ views, likes, onLike, isLiked = false, showViewCount = true }) => {
  const handleLike = () => {
    if (onLike) {
      onLike();
    }
  };

  return (
    <div className="flex items-center gap-4 text-sm text-slate-400">
      <div className="flex items-center gap-1">
        <ApperIcon name="Eye" className="w-4 h-4" />
        <span>{views?.toLocaleString() || 0}</span>
      </div>
<motion.button
        onClick={handleLike}
        className={`flex items-center gap-1 transition-colors ${
          isLiked ? "text-red-400" : "text-slate-400 hover:text-red-400"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon 
          name="Heart"
          className={`w-4 h-4 ${isLiked ? "fill-current text-red-400" : ""}`} 
        />
        <span>{likes?.toLocaleString() || 0}</span>
      </motion.button>
    </div>
  );
};

export default PenStats;