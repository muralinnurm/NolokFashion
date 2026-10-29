import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useMarketplace();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!settings.announcementVisible || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Marketplace Announcement"
      className="bg-[#252321] text-[#FAF8F5] text-sm py-2.5 px-6 relative z-50"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <div className="w-6" />
        <p className="text-center font-normal tracking-wide flex-1 line-clamp-1 text-sm">
          {settings.announcementText}
        </p>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#FAF8F5]/70 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
