"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function RecognitionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    labels: string[];
    description: string;
    colors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    // TODO: 集成实际的图片识别 API（如 Google Vision API、百度AI等）
    setTimeout(() => {
      setResult({
        labels: ["风景", "自然", "天空", "云朵", "山脉"],
        description: "这是一张美丽的风景照片，展示了壮观的山脉和蓝天白云",
        colors: ["#4A90E2", "#87CEEB", "#228B22", "#FFFFFF"],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔍 图片识别
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
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                点击上传图片
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                支持JPG、PNG等格式，AI将为您分析图片内容
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {isAnalyzing ? "分析中..." : "开始识别"}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                    setResult(null);
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
            {/* Image Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                图片预览
              </h3>
              <img src={previewUrl} alt="Preview" className="w-full rounded-lg shadow-md" />
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>文件名: {selectedFile.name}</p>
                <p>文件大小: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>

            {/* Recognition Results */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                识别结果
              </h3>
              {result ? (
                <div className="space-y-6">
                  {/* Labels */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      识别标签
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.labels.map((label, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      图片描述
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {result.description}
                    </p>
                  </div>

                  {/* Dominant Colors */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      主要颜色
                    </h4>
                    <div className="flex gap-2">
                      {result.colors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="w-12 h-12 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏳</div>
                    <p>等待识别</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 提示：此功能需要集成第三方 AI 识别服务（如 Google Vision API、百度 AI 等）才能正常工作
          </p>
        </div>
      </main>
    </div>
  );
}
