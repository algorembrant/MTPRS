import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Folder, Clock, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileViewer from './FileViewer';

const ResultList = ({ refreshTrigger }) => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchFolders = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/processed');
            setFolders(response.data);
        } catch (error) {
            console.error("Failed to fetch processed folders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, [refreshTrigger]);

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    if (selectedFolder) {
        return <FileViewer folderId={selectedFolder} onBack={() => setSelectedFolder(null)} />;
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-100">Processed Batches</h2>
                <button
                    onClick={fetchFolders}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="space-y-3">
                {folders.length === 0 && !loading && (
                    <div className="text-center py-10 text-gray-500 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                        <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No processed files yet</p>
                    </div>
                )}

                <AnimatePresence>
                    {folders.map((folder, index) => (
                        <motion.div
                            key={folder.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedFolder(folder.id)}
                            className="group cursor-pointer p-4 bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800 hover:border-blue-500/30 rounded-xl transition-all duration-200"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                        <Folder className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-200">{folder.name}</h3>
                                        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                                            <span className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {formatDate(folder.created)}
                                            </span>
                                            <span className="bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">
                                                {folder.file_count} files
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResultList;
