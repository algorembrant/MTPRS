import React, { useState } from 'react';
import DropZone from './components/DropZone';
import ResultList from './components/ResultList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Refresh the list after a successful upload
    // Adding a small delay to allow backend to detect file
    setTimeout(() => {
      setRefreshKey(old => old + 1);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <main className="relative container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        <header className="mb-12 text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            QuasarVaultage
          </h1>
          <p className="text-gray-400 text-lg">
            Advanced Excel Processing Pipeline
          </p>
        </header>

        <DropZone onUploadSuccess={handleUploadSuccess} />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-10 max-w-2xl"></div>

        <ResultList refreshTrigger={refreshKey} />

        <footer className="mt-auto pt-10 text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} MTParsee System
        </footer>
      </main>
    </div>
  );
}

export default App;
