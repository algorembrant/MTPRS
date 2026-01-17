import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DropZone = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
    const [message, setMessage] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus(null);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Assuming backend is on port 8000
            await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('success');
            setMessage(`Successfully uploaded ${file.name}`);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
            setMessage(error.response?.data?.detail || 'Upload failed');
        } finally {
            setUploading(false);
        }
    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div
                {...getRootProps()}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-800'}
          ${uploading ? 'pointer-events-none opacity-80' : ''}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                    <div className={`p-4 rounded-full bg-gray-700/50 transition-transform duration-300 ${isDragActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {uploading ? (
                            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                        ) : (
                            <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-blue-400' : 'text-gray-400'}`} />
                        )}
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-200">
                            {uploading ? 'Uploading...' : isDragActive ? 'Drop your file here' : 'Click or Drag & Drop'}
                        </h3>
                        <p className="text-sm text-gray-400">
                            Support for .xlsx files (Max 1 file)
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {uploadStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center p-4 rounded-lg border ${uploadStatus === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-200'
                                : 'bg-red-500/10 border-red-500/20 text-red-200'
                            }`}
                    >
                        {uploadStatus === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                        <span className="text-sm font-medium">{message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropZone;
