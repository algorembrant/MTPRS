import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Download, ArrowLeft, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const FileViewer = ({ folderId, onBack }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/processed/${folderId}`);
                setFiles(response.data);
            } catch (error) {
                console.error("Failed to fetch files", error);
            } finally {
                setLoading(false);
            }
        };

        if (folderId) fetchFiles();
    }, [folderId]);

    const handleDownload = (path, filename) => {
        // Trigger download
        const link = document.createElement('a');
        link.href = `http://localhost:8000/${path}`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    if (loading) {
        return <div className="text-gray-400 text-center py-8">Loading files...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-300 mb-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    title="Back to folders"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <FolderOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-lg">{folderId}</h3>
            </div>

            <div className="grid gap-3">
                {files.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">No files found in this folder.</div>
                ) : (
                    files.map((file) => (
                        <motion.div
                            key={file.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 bg-gray-800/40 border border-gray-700/50 rounded-lg hover:bg-gray-800/60 transition-colors group"
                        >
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2 bg-gray-700/50 rounded-lg text-blue-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDownload(file.path, file.name)}
                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Download"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FileViewer;
