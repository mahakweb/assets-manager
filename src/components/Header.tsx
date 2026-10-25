import React from 'react';
import {
  LayoutDashboard,
  HardDrive,
  Layers,
  Users,
  Building2,
  ListTree,
  Printer,
  Download,
  Upload,
  Laptop,
  Type,
  Moon,
  Sun,
  Search,
  ChevronDown,
  Building
} from 'lucide-react';
import { Organization } from '../types';

export type NavTab = 'dashboard' | 'organizations' | 'assets' | 'systems' | 'employees' | 'lists' | 'reporting';
export type FontOption = 'yekan' | 'vazir' | 'shabnam';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  organizations: Organization[];
  selectedOrgId: number | 'all';
  onSelectOrg: (id: number | 'all') => void;
  onOpenImport: () => void;
  onExportAll: () => void;
  onOpenPortableGuide: () => void;
  onOpenGlobalSearch: () => void;
  totalAssets: number;
  totalSystems: number;
  fontChoice: FontOption;
  onFontChange: (font: FontOption) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  organizations,
  selectedOrgId,
  onSelectOrg,
  onOpenImport,
  onExportAll,
  onOpenPortableGuide,
  onOpenGlobalSearch,
  totalAssets,
  totalSystems,
  fontChoice,
  onFontChange,
  isDarkMode,
  onToggleDarkMode
}) => {
  const currentOrg = organizations.find((o) => o.id === selectedOrgId);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs no-print transition-colors duration-200">
      {/* Top Bar: Brand, Organization Selector, Nav, Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Wordmark & Multi-Org Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
                سامانه جامع دارایی‌های سازمان‌ها
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">
                پوشش {organizations.length} سازمان و دستگاه اجرایی
              </span>
            </div>

            {/* Active Organization Selector */}
            <div className="hidden lg:flex items-center mr-2 border-r border-slate-200 dark:border-slate-700 pr-3">
              <div className="relative">
                <select
                  value={selectedOrgId}
                  onChange={(e) => {
                    const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                    onSelectOrg(val);
                  }}
                  className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-md pl-7 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-[210px] truncate"
                  title="انتخاب سازمان مورد نظر"
                >
                  <option value="all">🏢 کل سازمان‌ها ({organizations.length} سازمان)</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>داشبورد تحلیلی</span>
            </button>

            <button
              onClick={() => onTabChange('organizations')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'organizations'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>سازمان‌ها ({organizations.length})</span>
            </button>

            <button
              onClick={() => onTabChange('assets')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'assets'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>تجهیزات ({totalAssets})</span>
            </button>

            <button
              onClick={() => onTabChange('systems')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'systems'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>سامانه‌ها ({totalSystems})</span>
            </button>

            <button
              onClick={() => onTabChange('employees')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'employees'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>کارکنان</span>
            </button>

            <button
              onClick={() => onTabChange('lists')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'lists'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <ListTree className="w-4 h-4" />
              <span>لیست‌های پایه</span>
            </button>

            <button
              onClick={() => onTabChange('reporting')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'reporting'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>گزارش و چاپ</span>
            </button>
          </nav>

          {/* Zone 3: Controls (Search, Dark Mode, Font Switcher, Import/Export) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Search Button */}
            <button
              onClick={onOpenGlobalSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
              title="جستجوی سراسری در تمام سازمان‌ها و دارایی‌ها"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline text-[11px]">جستجو...</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
              title={isDarkMode ? 'حالت روز (Light Mode)' : 'حالت شب (Dark Mode)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Font Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-md p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => onFontChange('yekan')}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  fontChoice === 'yekan'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="فونت وزیرمتن (Vazirmatn)"
              >
                وزیرمتن
              </button>
              <button
                type="button"
                onClick={() => onFontChange('shabnam')}
                className={`px-2 py-1 rounded text-xs transition-all hidden md:block ${
                  fontChoice === 'shabnam'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="فونت شبنم (Shabnam)"
              >
                شبنم
              </button>
            </div>

            {/* Portable Guide */}
            <button
              onClick={onOpenPortableGuide}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
              title="راهنمای اجرای پرتابل و خروجی دسکتاپ EXE"
            >
              <Laptop className="w-3.5 h-3.5 text-slate-500" />
              <span>پرتابل</span>
            </button>

            {/* Import */}
            <button
              onClick={onOpenImport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
              title="بارگذاری فایل اکسل سازمان‌ها"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">ایمپورت اکسل</span>
            </button>

            {/* Export All */}
            <button
              onClick={onExportAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors whitespace-nowrap"
              title="دانلود فایل اکسل کامل ۵ شیت"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروجی اکسل</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Sub-Navigation */}
        <div className="xl:hidden flex items-center justify-between gap-2 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              داشبورد
            </button>
            <button
              onClick={() => onTabChange('organizations')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === 'organizations' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              سازمان‌ها
            </button>
            <button
              onClick={() => onTabChange('assets')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === 'assets' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              تجهیزات
            </button>
            <button
              onClick={() => onTabChange('systems')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === 'systems' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              سامانه‌ها
            </button>
            <button
              onClick={() => onTabChange('employees')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === 'employees' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              کارکنان
            </button>
            <button
              onClick={() => onTabChange('reporting')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === 'reporting' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              گزارش
            </button>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <select
              value={selectedOrgId}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                onSelectOrg(val);
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded px-2 py-1 max-w-[140px] truncate"
            >
              <option value="all">همه سازمان‌ها</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
