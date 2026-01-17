import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ImageDisplayProps {
  imageUrl?: string;
  useWebApp?: boolean;
  webAppUrl?: string;
}

export function ImageDisplay({ imageUrl, useWebApp = true, webAppUrl = '/embedded-app' }: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Webアプリケーションを表示
  if (useWebApp) {
    return (
      <Card className="overflow-hidden border-slate-200 bg-white">
        <div className="relative w-full h-[600px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
              <div className="text-center text-slate-400">
                <Loader2 className="mx-auto h-8 w-8 mb-2 animate-spin" />
                <p className="text-sm">Loading application...</p>
              </div>
            </div>
          )}
          <iframe
            src={webAppUrl}
            className="w-full h-full border-0"
            title="Interactive Web Application"
            onLoad={() => setIsLoading(false)}
            allow="accelerometer; gyroscope"
          />
        </div>
      </Card>
    );
  }

  // 従来の画像表示（後方互換性のため残す）
  if (!imageUrl) {
    return (
      <Card className="flex items-center justify-center h-96 bg-slate-100 border-slate-200">
        <div className="text-center text-slate-400">
          <p className="text-sm">No content available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-slate-200">
      <div className="relative w-full h-96">
        <img
          src={imageUrl}
          alt="Task image"
          className="w-full h-full object-contain"
        />
      </div>
    </Card>
  );
}
