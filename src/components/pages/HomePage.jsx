import { motion } from "framer-motion";
import PenGrid from "@/components/organisms/PenGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { usePens } from "@/hooks/usePens";

const HomePage = () => {
  const { pens, loading, error, loadPens, likePen } = usePens();

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPens} />;
  }

  if (pens.length === 0) {
    return (
      <Empty 
        title="No pens available"
        description="Be the first to create an amazing code experiment!"
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-4">
            Discover Amazing Code
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore creative experiments, learn from the community, and share your own code creations
          </p>
        </motion.div>

        <PenGrid pens={pens} onLike={likePen} />
      </div>
    </div>
  );
};

export default HomePage;