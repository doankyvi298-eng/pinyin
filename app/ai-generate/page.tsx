"use client";

import Link from "next/link";
import { useState } from "react";

export default function AIGeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imageSize, setImageSize] = useState("512x512");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // TODO: 集成实际的 AI 生图 API（如 DALL-E、Stable Diffusion API等）
    setTimeout(() => {
      // 模拟生成图片（使用占位符）
      const placeholders = [
        `https://via.placeholder.com/512x512/FF6B6B/FFFFFF?text=${encodeURIComponent(prompt.slice(0, 20))}`,
        `https://via.placeholder.com/512x512/4ECDC4/FFFFFF?text=${encodeURIComponent(prompt.slice(0, 20))}`,
      ];
      setGeneratedImages(placeholders);
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `ai-generated-${index + 1}.png`;
    a.click();
  };

  const presetPrompts = [
    "一只可爱的猫咪坐在窗台上看风景，油画风格",
    "未来科技城市，赛博朋克风格，霓虹灯光",
    "宁静的日式庭院，樱花飘落，水墨画风格",
    "神秘的森林中的精灵，梦幻氛围，高质量CG",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎨 AI 生图
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <div className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                描述你想生成的图片 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：一只可爱的柴犬在海边奔跑，蓝天白云，阳光明媚，高清摄影..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white resize-none"
                rows={4}
              />
            </div>

            {/* Preset Prompts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                快速选择
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {presetPrompts.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(preset)}
                    className="text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                负面提示词（可选）
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="例如：低质量、模糊、变形..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Image Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                图片尺寸
              </label>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="512x512">512×512 (正方形)</option>
                <option value="768x512">768×512 (横向)</option>
                <option value="512x768">512×768 (纵向)</option>
                <option value="1024x1024">1024×1024 (高清)</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  生成中...
                </span>
              ) : (
                "🎨 生成图片"
              )}
            </button>
          </div>
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              生成结果
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="space-y-4">
                  <img
                    src={imageUrl}
                    alt={`Generated ${index + 1}`}
                    className="w-full rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => handleDownload(imageUrl, index)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    下载图片 {index + 1}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>使用的提示词：</strong> {prompt}
              </p>
              {negativePrompt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <strong>负面提示词：</strong> {negativePrompt}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 提示：此功能需要集成第三方 AI 生图服务（如 DALL-E、Stable Diffusion API、MidJourney 等）才能正常工作
          </p>
        </div>
      </main>
    </div>
  );
}
