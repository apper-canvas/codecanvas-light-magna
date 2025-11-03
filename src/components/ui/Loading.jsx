import { motion } from "framer-motion";

const Loading = ({ type = "cards" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="card h-80 p-6"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
          >
            <div className="w-full h-40 bg-slate-700 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-6 bg-slate-700 rounded w-3/4"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                <div className="h-4 bg-slate-700 rounded w-20"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-slate-700 rounded w-12"></div>
                  <div className="h-4 bg-slate-700 rounded w-12"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "editor") {
    return (
      <motion.div
        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="space-y-2">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="h-4 bg-slate-700 rounded"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            ></div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;