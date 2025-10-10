"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function RemoveBgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultUrl("");
    }
  };

  const handleRemoveBg = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    // TODO: 集成实际的抠图 API（如 remove.bg API）
    setTimeout(() => {
      setResultUrl(previewUrl); // 占位符
      setIsProcessing(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `no-bg_${selectedFile?.name || "image.png"}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ✂️ 抠图去背景
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                点击上传图片
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                支持人像、物体等各类图片
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={handleRemoveBg}
                  disabled={isProcessing}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {isProcessing ? "处理中..." : "开始抠图"}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                    setResultUrl("");
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  重新选择
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">原始图片</h3>
              <img src={previewUrl} alt="Original" className="w-full rounded-lg" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">抠图结果</h3>
              {resultUrl ? (
                <>
                  <img src={resultUrl} alt="Result" className="w-full rounded-lg mb-4" />
                  <button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    下载结果
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏳</div>
                    <p>等待处理</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 提示：此功能需要集成第三方 AI 抠图服务（如 remove.bg API）才能正常工作
          </p>
        </div>
      </main>
    </div>
  );
}
