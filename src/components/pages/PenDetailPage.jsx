import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import PenStats from "@/components/molecules/PenStats";
import CodePanel from "@/components/molecules/CodePanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { usePen } from "@/hooks/usePen";
import { formatDistanceToNow } from "date-fns";
import penService from "@/services/api/penService";
import { toast } from "react-toastify";
const PenDetailPage = () => {
const { id } = useParams();
  const { pen, loading, error, loadPen } = usePen(id);
  const [activeTab, setActiveTab] = useState('editor');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  // Update like count when pen loads
  useState(() => {
    if (pen) {
      setLikeCount(pen.likes || 0);
    }
  }, [pen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message={error} onRetry={() => loadPen(id)} />
      </div>
    );
  }

  if (!pen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message="Pen not found" />
      </div>
    );
  }

  const handleFork = () => {
    const forkedPenData = {
      title: `Fork of ${pen.title}`,
      html: pen.html,
      css: pen.css,
      javascript: pen.javascript
    };
    
    localStorage.setItem("pendingFork", JSON.stringify(forkedPenData));
    window.open("/editor", "_blank");
    toast.success("Pen forked! Opening in editor...");
  };

  const handleLike = async () => {
    try {
      // Optimistic update
      const newIsLiked = !isLiked;
      const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
      
      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);
      
      if (newIsLiked) {
        await penService.likePen(id);
        toast.success("Liked!");
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
      toast.error("Failed to like pen");
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleEmbed = () => {
    setShowEmbedModal(true);
  };

  const shareUrl = `${window.location.origin}/pen/${pen.Id}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="400" frameBorder="0"></iframe>`;
  return (
<div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        className="border-b border-slate-700 bg-surface/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-200 mb-2">
                  {pen.title}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Avatar 
                      src={pen.author?.avatar} 
                      alt={pen.author?.name}
                      size="default"
                    />
                    <span className="text-slate-300">{pen.author?.name}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500 text-sm">
                    {formatDistanceToNow(new Date(pen.createdAt), { addSuffix: true })}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500 text-sm">
                    {pen.views?.toLocaleString() || 0} views
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <PenStats 
                views={pen.views}
                likes={likeCount}
                onLike={handleLike}
                isLiked={isLiked}
              />
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleFork}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="GitFork" className="w-4 h-4" />
                  Fork
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Share2" className="w-4 h-4" />
                  Share
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleEmbed}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Code" className="w-4 h-4" />
                  Embed
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-700 bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('editor')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'editor'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              <ApperIcon name="Code2" className="w-4 h-4 inline mr-2" />
              Editor View
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'preview'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              <ApperIcon name="Monitor" className="w-4 h-4 inline mr-2" />
              Full View
            </button>
          </div>
        </div>
      </div>

{/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {activeTab === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Preview */}
              <div className="order-2 lg:order-1">
                <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                    <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                      Result
                    </h2>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <iframe
                    title="Pen Preview"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>${pen.css}</style>
                        </head>
                        <body>
                          ${pen.html}
                          <script>${pen.javascript}</script>
                        </body>
                      </html>
                    `}
                    className="w-full h-[500px] bg-white"
                    frameBorder="0"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>

              {/* Code Editors */}
              <div className="order-1 lg:order-2 space-y-4">
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <ApperIcon name="Info" className="w-4 h-4" />
                    <span>Viewing in read-only mode. Create an account to edit or fork this pen.</span>
                  </div>
                </div>

                {/* HTML */}
                {pen.html && (
                  <CodePanel
                    title="HTML"
                    code={pen.html}
                    language="html"
                    readOnly={true}
                    className="border border-slate-700 rounded-xl"
                  />
                )}

                {/* CSS */}
                {pen.css && (
                  <CodePanel
                    title="CSS"
                    code={pen.css}
                    language="css"
                    readOnly={true}
                    className="border border-slate-700 rounded-xl"
                  />
                )}

                {/* JavaScript */}
                {pen.javascript && (
                  <CodePanel
                    title="JavaScript"
                    code={pen.javascript}
                    language="javascript"
                    readOnly={true}
                    className="border border-slate-700 rounded-xl"
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="w-full">
              <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                  <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                    Full Preview
                  </h2>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <iframe
                  title="Pen Full Preview"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>${pen.css}</style>
                      </head>
                      <body>
                        ${pen.html}
                        <script>${pen.javascript}</script>
                      </body>
                    </html>
                  `}
                  className="w-full h-[80vh] bg-white"
                  frameBorder="0"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          )}

          {/* Description and Comments */}
          <div className="mt-12 space-y-8">
            {/* Description */}
            <div className="bg-surface/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <ApperIcon name="FileText" className="w-5 h-5" />
                About this Pen
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed">
                  {pen.description || "The creator hasn't added a description for this pen yet."}
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-surface/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <ApperIcon name="MessageCircle" className="w-5 h-5" />
                Comments
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-center">
                  <ApperIcon name="MessageCircle" className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400">No comments yet. Be the first to share your thoughts!</p>
                  <Button variant="secondary" className="mt-3">
                    Sign up to comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-surface border border-slate-700 rounded-xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Share this Pen</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pen URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-l-lg text-slate-200 text-sm"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      toast.success("URL copied to clipboard!");
                    }}
                    className="rounded-l-none"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-surface border border-slate-700 rounded-xl p-6 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Embed this Pen</h3>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  HTML Embed Code
                </label>
                <textarea
                  value={embedCode}
                  readOnly
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm font-mono"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    toast.success("Embed code copied to clipboard!");
                  }}
                  className="w-full mt-3"
                >
                  Copy Embed Code
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PenDetailPage;