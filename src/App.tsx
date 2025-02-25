import React, { useState, useCallback } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronLeft, ChevronRight, Maximize2, Minimize2, FileText } from 'lucide-react';
import clsx from 'clsx';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1.0);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPageNumber(1);
    }
  };

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {!pdfFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh]"
          >
            <div className="p-8 backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20">
              <FileText size={64} className="mx-auto mb-6 text-blue-400" />
              <h1 className="text-3xl font-bold text-center mb-6">PDF Viewer</h1>
              <label className="flex flex-col items-center justify-center px-8 py-4 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 mb-2 text-blue-400" />
                <span className="text-lg font-medium">Choose a PDF file</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 backdrop-blur-xl bg-black/30 rounded-full px-6 py-2 flex items-center gap-4">
              <button
                onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                disabled={pageNumber <= 1}
                className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm">
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                disabled={pageNumber >= numPages}
                className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={pageNumber}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={clsx(
                  "flex justify-center items-center min-h-[80vh]",
                  isFullscreen && "fixed inset-0 bg-gray-900"
                )}
              >
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="max-w-full"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    className="shadow-2xl rounded-lg overflow-hidden"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </motion.div>
            </AnimatePresence>

            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-black/30 rounded-full px-6 py-2">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-32 accent-blue-400"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;