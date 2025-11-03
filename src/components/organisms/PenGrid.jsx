import { motion } from "framer-motion";
import PenCard from "@/components/organisms/PenCard";

const PenGrid = ({ pens, onLike }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {pens.map((pen) => (
        <motion.div key={pen.Id} variants={item}>
          <PenCard pen={pen} onLike={onLike} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PenGrid;