import { motion } from "framer-motion";
import PenGrid from "@/components/organisms/PenGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useTrendingPens } from "@/hooks/usePens";

const TrendingPage = () => {
  const { pens, loading, error, loadTrendingPens } = useTrendingPens();

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTrendingPens} />;
  }

  if (pens.length === 0) {
    return (
      <Empty 
        title="No trending pens"
        description="Create something amazing to get the trending started!"
        actionText="Create Your First Pen"
        actionLink="/editor"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-red-500 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-400 to-red-400 bg-clip-text text-transparent">
              Trending Now
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The hottest code experiments based on views and likes from the community
          </p>
        </motion.div>

        <PenGrid pens={pens} />
      </div>
    </div>
  );
};

export default TrendingPage;