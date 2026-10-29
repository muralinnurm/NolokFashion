import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useMarketplace();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252321]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#252321]/70 hover:text-[#252321] hover:bg-[#F3E7E5] cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-[#F3E7E5] flex items-center justify-center text-[#B66F7B]">
            <Ruler className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-editorial font-normal text-[#252321]">
            Bangladesh Women's Fashion Sizing Guide
          </h3>
        </div>
        <p className="text-sm text-[#A99B8D] mb-6">
          All measurements are provided in inches. Standard tailored fit for South Asian silhouettes.
        </p>

        {/* Kurtis & Kameez Size Chart */}
        <div className="space-y-6 text-sm text-[#252321]">
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-[#252321] mb-3">
              Kurtis, Tunics & Three-Piece Suits
            </h4>
            <div className="overflow-x-auto rounded-2xl bg-[#FAF8F5] p-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#252321]/80 font-medium text-sm">
                    <th className="p-3">Size (BD)</th>
                    <th className="p-3">Bust (Inches)</th>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Hip</th>
                    <th className="p-3">Standard Length</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  <tr className="bg-white rounded-xl">
                    <td className="p-3 font-medium">36 (S)</td>
                    <td className="p-3">36"</td>
                    <td className="p-3">32"</td>
                    <td className="p-3">38"</td>
                    <td className="p-3">42" - 44"</td>
                  </tr>
                  <tr className="bg-white rounded-xl">
                    <td className="p-3 font-medium">38 (M)</td>
                    <td className="p-3">38"</td>
                    <td className="p-3">34"</td>
                    <td className="p-3">40"</td>
                    <td className="p-3">44" - 46"</td>
                  </tr>
                  <tr className="bg-white rounded-xl">
                    <td className="p-3 font-medium">40 (L)</td>
                    <td className="p-3">40"</td>
                    <td className="p-3">36"</td>
                    <td className="p-3">42"</td>
                    <td className="p-3">45" - 47"</td>
                  </tr>
                  <tr className="bg-white rounded-xl">
                    <td className="p-3 font-medium">42 (XL)</td>
                    <td className="p-3">42"</td>
                    <td className="p-3">38"</td>
                    <td className="p-3">44"</td>
                    <td className="p-3">46" - 48"</td>
                  </tr>
                  <tr className="bg-white rounded-xl">
                    <td className="p-3 font-medium">44 (XXL)</td>
                    <td className="p-3">44"</td>
                    <td className="p-3">40"</td>
                    <td className="p-3">46"</td>
                    <td className="p-3">46" - 48"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Abaya Length Chart */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-[#252321] mb-3">
              Modest Abayas & Gowns (By Height)
            </h4>
            <div className="overflow-x-auto rounded-2xl bg-[#FAF8F5] p-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[#252321]/80 font-medium text-sm">
                    <th className="p-3">Abaya Tag</th>
                    <th className="p-3">Recommended Customer Height</th>
                    <th className="p-3">Garment Length</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  <tr className="bg-white rounded-xl">
                    <td className="p-3 font-medium">52</td>
                    <td className="p-3">5'0" – 5'2" (152–157 cm)</td>
                    <td className="p-3">52 Inches</td>
                  </tr>
                  <tr className="bg-white rounded-xl">
                    <td className="p-3 font-medium">54</td>
                    <td className="p-3">5'3" – 5'5" (160–165 cm)</td>
                    <td className="p-3">54 Inches</td>
                  </tr>
                  <tr className="bg-white rounded-xl">
                    <td className="p-3 font-medium">56</td>
                    <td className="p-3">5'6" – 5'8" (167–172 cm)</td>
                    <td className="p-3">56 Inches</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sarees Info */}
          <div className="p-4 bg-[#F3E7E5]/50 rounded-2xl text-sm space-y-1.5">
            <p className="font-medium text-[#252321]">Traditional Handloom Sarees</p>
            <p className="text-[#252321]/80 leading-relaxed">
              Traditional Jamdani and Tangail handloom sarees are woven to 12 Haath (approx 5.5 meters). Most boutique pieces include an unstitched 80cm blouse piece.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-8 py-3.5 bg-[#252321] hover:bg-[#383533] text-white text-sm font-medium uppercase tracking-wider rounded-full cursor-pointer transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
