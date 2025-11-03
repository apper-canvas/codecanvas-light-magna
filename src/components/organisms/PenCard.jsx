import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import PenStats from "@/components/molecules/PenStats";

const PenCard = ({ pen, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(pen.Id);
    }
  };

  return (
    <motion.div
      className="card card-hover group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/pen/${pen.Id}`}>
        <div className="relative overflow-hidden rounded-t-xl">
          {/* Thumbnail */}
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
            {pen.thumbnail ? (
              <img 
                src={pen.thumbnail} 
                alt={pen.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-900/20 to-secondary-900/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-mono text-primary-400">{`</>`}</span>
                  </div>
                  <p className="text-slate-500 text-sm">Live Preview</p>
                </div>
              </div>
            )}
            
            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-white font-medium">View Code</div>
            </motion.div>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-6">
        <Link to={`/pen/${pen.Id}`}>
          <h3 className="font-semibold text-slate-200 mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
            {pen.title}
          </h3>
        </Link>
        
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar 
            src={pen.author?.avatar} 
            alt={pen.author?.name}
            size="default"
          />
          <span className="text-slate-400 text-sm">{pen.author?.name}</span>
        </div>

        {/* Stats */}
        <PenStats 
          views={pen.views}
          likes={pen.likes}
          onLike={handleLike}
          isLiked={isLiked}
        />
      </div>
    </motion.div>
  );
};

export default PenCard;