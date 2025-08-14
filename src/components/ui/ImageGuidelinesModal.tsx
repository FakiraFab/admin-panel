import React from "react";

interface ImageGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageGuidelinesModal: React.FC<ImageGuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#7F1416]">Image Upload Guidelines</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">🏞️ Banner Images (Homepage Carousel)</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Recommended: <b>1920 x 1080 px</b> (16:9)</li>
              <li>Minimum: 800 x 450 px</li>
              <li>Format: JPG or WebP, Max 500 KB</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">🛍️ Product Images</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Recommended: <b>800 x 800 px</b> (1:1)</li>
              <li>Minimum: 600 x 600 px</li>
              <li>Format: JPG or WebP, Max 300 KB</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">🗂️ Category Images</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Recommended: <b>600 x 600 px</b> (1:1) or <b>800 x 600 px</b> (4:3)</li>
              <li>Format: JPG or WebP, Max 300 KB</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">⚠️ General Tips</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Use high-quality, well-lit images</li>
              <li>Crop and resize before uploading</li>
              <li>Keep file sizes small for faster loading</li>
              <li>Preview your image after adding the link</li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <table className="w-full text-xs border border-gray-200 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 border-b">Type</th>
                <th className="py-2 px-2 border-b">Aspect Ratio</th>
                <th className="py-2 px-2 border-b">Recommended Size</th>
                <th className="py-2 px-2 border-b">Format</th>
                <th className="py-2 px-2 border-b">Max Size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 px-2 border-b">Banner</td>
                <td className="py-1 px-2 border-b">16:9</td>
                <td className="py-1 px-2 border-b">1920x1080px</td>
                <td className="py-1 px-2 border-b">JPG/WebP</td>
                <td className="py-1 px-2 border-b">500 KB</td>
              </tr>
              <tr>
                <td className="py-1 px-2 border-b">Product</td>
                <td className="py-1 px-2 border-b">1:1</td>
                <td className="py-1 px-2 border-b">800x800px</td>
                <td className="py-1 px-2 border-b">JPG/WebP</td>
                <td className="py-1 px-2 border-b">300 KB</td>
              </tr>
              <tr>
                <td className="py-1 px-2">Category</td>
                <td className="py-1 px-2">1:1 or 4:3</td>
                <td className="py-1 px-2">600x600px / 800x600px</td>
                <td className="py-1 px-2">JPG/WebP</td>
                <td className="py-1 px-2">300 KB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImageGuidelinesModal;
