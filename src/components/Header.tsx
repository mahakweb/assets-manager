import React from 'react';
import {
  LayoutDashboard,
  HardDrive,
  Layers,
  Users,
  Building2,
  ListTree,
  FileSpreadsheet,
  Printer,
  Download,
  Upload,
  Laptop,
  Type
} from 'lucide-react';

export type NavTab = 'dashboard' | 'assets' | 'systems' | 'employees' | 'organization' | 'lists' | 'reporting';
export type FontOption = 'yekan' | 'vazir' | 'shabnam';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenImport: () => void;
  onExportAll: () => void;
  onOpenPortableGuide: () => void;
  totalAssets: number;
  totalSystems: number;
  fontChoice: FontOption;
  onFontChange: (font: FontOption) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenImport,
  onExportAll,
  onOpenPortableGuide,
  totalAssets,
  totalSystems,
  fontChoice,
  onFontChange
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      {/* Top Bar Contract: Brand - Nav Links - Primary Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap block">
                سامانه جامع مدیریت دارایی‌های سازمان
              </span>
              <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
                نسخه پرتابل مبتنی بر داده‌های پایه اکسل
              </span>
            </div>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>داشبورد تحلیلی</span>
            </button>

            <button
              onClick={() => onTabChange('assets')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'assets'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>تجهیزات و دارایی‌ها</span>
              <span className="text-[11px] font-mono tabular-nums text-slate-400">({totalAssets})</span>
            </button>

            <button
              onClick={() => onTabChange('systems')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'systems'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>سامانه‌ها و سرویس‌ها</span>
              <span className="text-[11px] font-mono tabular-nums text-slate-400">({totalSystems})</span>
            </button>

            <button
              onClick={() => onTabChange('employees')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'employees'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>کارکنان سازمان</span>
            </button>

            <button
              onClick={() => onTabChange('organization')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'organization'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>مشخصات سازمان</span>
            </button>

            <button
              onClick={() => onTabChange('lists')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'lists'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ListTree className="w-4 h-4" />
              <span>لیست‌های پایه (Lookups)</span>
            </button>

            <button
              onClick={() => onTabChange('reporting')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'reporting'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>گزارش‌گیری و چاپ</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Font Switcher */}
            <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200 text-xs">
              <span className="px-2 text-slate-400 flex items-center gap-1" title="تغییر فونت برنامه">
                <Type className="w-3.5 h-3.5" />
                <span className="hidden 2xl:inline text-[11px]">فونت:</span>
              </span>
              <button
                type="button"
                onClick={() => onFontChange('yekan')}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  fontChoice === 'yekan'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="فونت یکان بخ (Yekan Bakh)"
              >
                یکان‌بخ
              </button>
              <button
                type="button"
                onClick={() => onFontChange('vazir')}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  fontChoice === 'vazir'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="فونت وزیرمتن (Vazirmatn)"
              >
                وزیرمتن
              </button>
              <button
                type="button"
                onClick={() => onFontChange('shabnam')}
                className={`px-2 py-1 rounded text-xs transition-all hidden sm:block ${
                  fontChoice === 'shabnam'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="فونت شبنم (Shabnam)"
              >
                شبنم
              </button>
            </div>

            <button
              onClick={onOpenPortableGuide}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="راهنمای اجرای پرتابل و خروجی دسکتاپ EXE"
            >
              <Laptop className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">اجرای پرتابل</span>
            </button>

            <button
              onClick={onOpenImport}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title="بارگذاری فایل اکسل سازمان"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">ایمپورت اکسل</span>
            </button>

            <button
              onClick={onExportAll}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors whitespace-nowrap"
              title="دانلود فایل اکسل کامل شامل ۵ شیت"
            >
              <Download className="w-4 h-4" />
              <span>خروجی اکسل کامل</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Sub-Navigation */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            داشبورد
          </button>
          <button
            onClick={() => onTabChange('assets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'assets' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            تجهیزات ({totalAssets})
          </button>
          <button
            onClick={() => onTabChange('systems')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'systems' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            سامانه‌ها ({totalSystems})
          </button>
          <button
            onClick={() => onTabChange('employees')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'employees' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            کارکنان
          </button>
          <button
            onClick={() => onTabChange('organization')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'organization' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            مشخصات سازمان
          </button>
          <button
            onClick={() => onTabChange('lists')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'lists' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            لیست‌های پایه
          </button>
          <button
            onClick={() => onTabChange('reporting')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'reporting' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            گزارش‌گیری و چاپ
          </button>
        </div>
      </div>
    </header>
  );
};
