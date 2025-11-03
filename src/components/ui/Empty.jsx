import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No pens found", 
  description = "Start creating amazing code experiments",
  actionText = "Create Your First Pen",
  actionLink = "/editor"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-64 text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="Code2" className="w-8 h-8 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 mb-6 max-w-md">{description}</p>
      <Link to={actionLink} className="btn-primary inline-flex items-center gap-2">
        <ApperIcon name="Plus" className="w-4 h-4" />
        {actionText}
      </Link>
    </motion.div>
  );
};

export default Empty;