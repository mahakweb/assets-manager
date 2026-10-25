import React, { useState, useMemo } from 'react';
import {
  Printer,
  Download,
  Filter,
  CheckCircle2,
  HardDrive,
  Layers,
  Users,
  Building2,
  FileText,
  Calendar,
  SlidersHorizontal,
  ShieldAlert,
  Building
} from 'lucide-react';
import { FullDatabase, Organization } from '../types';
import { exportSingleTableToExcel } from '../services/excelService';

interface ReportingViewProps {
  db: FullDatabase;
  selectedOrgId?: number | 'all';
  onSelectOrg?: (id: number | 'all') => void;
}

type ReportType = 'assets' | 'systems' | 'overview' | 'organizations';

export const ReportingView: React.FC<ReportingViewProps> = ({
  db,
  selectedOrgId = 'all',
  onSelectOrg
}) => {
  const { assets, systems, employees, organizations, lists } = db;

  const [activeOrgId, setActiveOrgId] = useState<number | 'all'>(selectedOrgId);
  const [reportType, setReportType] = useState<ReportType>('assets');

  // Sync with prop if it changes
  React.useEffect(() => {
    setActiveOrgId(selectedOrgId);
  }, [selectedOrgId]);

  const currentOrg = organizations.find((o) => o.id === activeOrgId);

  // Asset Filters
  const [assetTypeFilter, setAssetTypeFilter] = useState('');
  const [placementFilter, setPlacementFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [importanceFilter, setImportanceFilter] = useState('');

  // System Filters
  const [systemTypeFilter, setSystemTypeFilter] = useState('');
  const [internetFilter, setInternetFilter] = useState('');
  const [secFilter, setSecFilter] = useState('');
  const [backupFilter, setBackupFilter] = useState('');

  // Base datasets filtered by organization
  const orgAssets = useMemo(() => {
    if (activeOrgId === 'all') return assets;
    return assets.filter(
      (a) => a.organizationId === activeOrgId || a.organizationName === currentOrg?.name
    );
  }, [assets, activeOrgId, currentOrg]);

  const orgSystems = useMemo(() => {
    if (activeOrgId === 'all') return systems;
    return systems.filter(
      (s) => s.organizationId === activeOrgId || s.organizationName === currentOrg?.name
    );
  }, [systems, activeOrgId, currentOrg]);

  const orgEmployees = useMemo(() => {
    if (activeOrgId === 'all') return employees;
    return employees.filter(
      (e) => e.organizationId === activeOrgId || e.organizationName === currentOrg?.name
    );
  }, [employees, activeOrgId, currentOrg]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return orgAssets.filter((a) => {
      const matchType = !assetTypeFilter || a.assetType === assetTypeFilter;
      const matchPlace = !placementFilter || a.placementLocation === placementFilter;
      const matchHealth = !healthFilter || a.healthStatus === healthFilter;
      const matchImp = !importanceFilter || a.importanceLevel === importanceFilter;
      return matchType && matchPlace && matchHealth && matchImp;
    });
  }, [orgAssets, assetTypeFilter, placementFilter, healthFilter, importanceFilter]);

  // Filtered Systems
  const filteredSystems = useMemo(() => {
    return orgSystems.filter((s) => {
      const matchType = !systemTypeFilter || s.systemType === systemTypeFilter;
      const matchInternet = !internetFilter || s.isInternetFacing === internetFilter;
      const matchSec = !secFilter || s.securityStatus === secFilter;
      const matchBackup = !backupFilter || s.backupStatus === backupFilter;
      return matchType && matchInternet && matchSec && matchBackup;
    });
  }, [orgSystems, systemTypeFilter, internetFilter, secFilter, backupFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportFiltered = () => {
    if (reportType === 'assets') {
      const rows = filteredAssets.map((ast) => ({
        'ردیف': ast.id,
        'سازمان': ast.organizationName || 'سازمان مرکزی',
        'نوع دارایی': ast.assetType,
        'برند و مدل': ast.brandModel,
        'کد اموال': ast.propertyCode,
        'IP آدرس': ast.ipAddress,
        'محل استقرار': ast.placementLocation,
        'شهرستان': ast.county,
        'سیستم عامل': ast.operatingSystem,
        'اهمیت': ast.importanceLevel,
        'وضعیت سلامت': ast.healthStatus,
        'توضیحات': ast.description
      }));
      exportSingleTableToExcel('گزارش دارایی‌ها', rows, 'گزارش_فیلترشده_دارایی_ها.xlsx');
    } else if (reportType === 'systems') {
      const rows = filteredSystems.map((sys) => ({
        'ردیف': sys.id,
        'سازمان': sys.organizationName || 'سازمان مرکزی',
        'نام سامانه': sys.systemName,
        'نوع سامانه': sys.systemType,
        'تحت اینترنت': sys.isInternetFacing,
        'دامنه یا IP': sys.domainOrIp,
        'IP داخلی': sys.internalIp,
        'سیستم عامل': sys.operatingSystem,
        'دیتابیس': sys.databaseType,
        'وضعیت بکاپ': sys.backupStatus,
        'احراز هویت دو مرحله‌ای': sys.mfaEnabled,
        'وضعیت امنیت': sys.securityStatus,
        'مسئول سامانه': sys.systemManager
      }));
      exportSingleTableToExcel('گزارش سامانه‌ها', rows, 'گزارش_فیلترشده_سامانه_ها.xlsx');
    } else if (reportType === 'organizations') {
      const rows = organizations.map((o) => ({
        'ردیف': o.id,
        'نام سازمان': o.name,
        'حوزه فعالیت': o.activityField,
        'رده سازمانی': o.orgLevel,
        'شناسه ملی': o.nationalId,
        'شهر': o.city,
        'دامنه اصلی': o.mainDomain,
        'تعداد تجهیزات': assets.filter((a) => a.organizationId === o.id).length,
        'تعداد سامانه‌ها': systems.filter((s) => s.organizationId === o.id).length
      }));
      exportSingleTableToExcel('گزارش مقایسه‌ای سازمان‌ها', rows, 'گزارش_جامع_سازمان_ها.xlsx');
    }
  };

  const todayDateStr = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Control Bar (Hidden during printing) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 no-print space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              مرکز گزارش‌گیری و صدور اسناد چاپی / PDF
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              تنظیم دامنه سازمان، اعمال فیلترهای دقیق و دریافت نسخه چاپی با سربرگ استاندارد سازمانی
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFiltered}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>خروجی اکسل این گزارش</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / خروجی PDF</span>
            </button>
          </div>
        </div>

        {/* Organization Scope Selector & Report Type Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              دامنه گزارش:
            </span>
            <select
              value={activeOrgId}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setActiveOrgId(val);
                if (onSelectOrg) onSelectOrg(val);
              }}
              className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[240px]"
            >
              <option value="all">🏢 کل سازمان‌ها ({organizations.length} سازمان)</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setReportType('assets')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                reportType === 'assets'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              دارایی‌ها ({filteredAssets.length})
            </button>
            <button
              onClick={() => setReportType('systems')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                reportType === 'systems'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              سامانه‌ها ({filteredSystems.length})
            </button>
            <button
              onClick={() => setReportType('overview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                reportType === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              کارنامه جامع سازمانی
            </button>
            <button
              onClick={() => setReportType('organizations')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                reportType === 'organizations'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              جدول مقایسه‌ای سازمان‌ها
            </button>
          </div>
        </div>

        {/* Dynamic Filters depending on Report Type */}
        {reportType === 'assets' && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              فیلتر دارایی:
            </span>

            <select
              value={assetTypeFilter}
              onChange={(e) => setAssetTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">نوع دارایی (همه)</option>
              {lists.assetTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">محل استقرار (همه)</option>
              {lists.placementLocations.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">وضعیت فنی (همه)</option>
              {lists.statuses1.map((s) => (
                <option key={s} value={s}>
                  وضعیت {s}
                </option>
              ))}
            </select>

            <select
              value={importanceFilter}
              onChange={(e) => setImportanceFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">سطح اهمیت (همه)</option>
              <option value="حیاتی">حیاتی</option>
              <option value="مهم">مهم</option>
              <option value="عادی">عادی</option>
            </select>

            {(assetTypeFilter || placementFilter || healthFilter || importanceFilter) && (
              <button
                onClick={() => {
                  setAssetTypeFilter('');
                  setPlacementFilter('');
                  setHealthFilter('');
                  setImportanceFilter('');
                }}
                className="text-rose-600 dark:text-rose-400 hover:underline mr-auto text-xs"
              >
                پاک‌کردن فیلترها
              </button>
            )}
          </div>
        )}

        {reportType === 'systems' && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              فیلتر سامانه:
            </span>

            <select
              value={systemTypeFilter}
              onChange={(e) => setSystemTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">نوع سامانه (همه)</option>
              {lists.systemTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={internetFilter}
              onChange={(e) => setInternetFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">دسترسی اینترنت (همه)</option>
              <option value="بله">متصل به اینترنت</option>
              <option value="خیر">شبکه داخلی (LAN)</option>
            </select>

            <select
              value={secFilter}
              onChange={(e) => setSecFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">سطح امنیت (همه)</option>
              {lists.statuses1.map((s) => (
                <option key={s} value={s}>
                  امنیت {s}
                </option>
              ))}
            </select>

            <select
              value={backupFilter}
              onChange={(e) => setBackupFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">وضعیت بکاپ (همه)</option>
              <option value="بله">دارای بکاپ</option>
              <option value="خیر">فاقد بکاپ</option>
            </select>

            {(systemTypeFilter || internetFilter || secFilter || backupFilter) && (
              <button
                onClick={() => {
                  setSystemTypeFilter('');
                  setInternetFilter('');
                  setSecFilter('');
                  setBackupFilter('');
                }}
                className="text-rose-600 dark:text-rose-400 hover:underline mr-auto text-xs"
              >
                پاک‌کردن فیلترها
              </button>
            )}
          </div>
        )}
      </div>

      {/* Printable Sheet Canvas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 print-container shadow-xs">
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-800 dark:border-slate-300 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="w-56 text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">جمهوری اسلامی ایران</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {currentOrg?.name || 'مرکز مدیریت دارایی‌های کل سازمان‌ها'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">مدیریت فناوری اطلاعات و ارتباطات</span>
            </div>

            <div className="text-center">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {reportType === 'assets' && 'گزارش رسمی موجودی تجهیزات و دارایی‌های سخت‌افزاری'}
                {reportType === 'systems' && 'گزارش پایش و ممیزی سامانه‌ها و سرویس‌های نرم‌افزاری'}
                {reportType === 'overview' && 'کارنامه جامع وضعیت فناوری اطلاعات و امنیت'}
                {reportType === 'organizations' && 'گزارش کلان و مقایسه‌ای سازمان‌ها و دستگاه‌های تابعه'}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                استخراج شده از پایگاه داده پرتابل دارایی‌های سازمان
              </span>
            </div>

            <div className="w-56 text-left text-xs tabular-nums text-slate-600 dark:text-slate-300 space-y-1">
              <div>تاریخ گزارش: {todayDateStr}</div>
              <div>شماره سند: DOC-{new Date().getFullYear()}-01</div>
              <div>طبقه‌بندی: محرمانه اداری</div>
            </div>
          </div>
        </div>

        {/* Content based on Report Type */}
        {reportType === 'assets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>
                تعداد کل تجهیزات احصا شده در این گزارش: <strong className="tabular-nums font-bold">{filteredAssets.length}</strong> قلم
              </span>
              <span>
                حوزه: {currentOrg ? currentOrg.activityField : 'تمام سازمان‌ها'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-slate-300 dark:border-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 w-10 text-center">ردیف</th>
                    {activeOrgId === 'all' && (
                      <th className="p-2 border-l border-slate-300 dark:border-slate-700">نام سازمان</th>
                    )}
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">نوع دارایی</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">برند و مدل</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">کد اموال</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">IP آدرس</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">محل استقرار</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">سیستم عامل</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 text-center">اهمیت</th>
                    <th className="p-2 text-center">وضعیت سلامت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {filteredAssets.map((ast, idx) => (
                    <tr key={ast.id} className="even:bg-slate-50/50 dark:even:bg-slate-800/40">
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center tabular-nums">{idx + 1}</td>
                      {activeOrgId === 'all' && (
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800 font-semibold">{ast.organizationName || 'سازمان مرکزی'}</td>
                      )}
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 font-medium">{ast.assetType}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800">{ast.brandModel}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 tabular-nums text-[11px]">{ast.propertyCode || '---'}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 tabular-nums dir-ltr">{ast.ipAddress || '---'}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800">{ast.placementLocation} ({ast.county})</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 tabular-nums">{ast.operatingSystem}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center font-medium">{ast.importanceLevel}</td>
                      <td className="p-2 text-center font-medium">{ast.healthStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'systems' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>
                تعداد کل سامانه‌های گزارش: <strong className="tabular-nums font-bold">{filteredSystems.length}</strong> سامانه
              </span>
              <span>
                سامانه‌های متصل به اینترنت: <strong className="tabular-nums font-bold">{filteredSystems.filter((s) => s.isInternetFacing === 'بله').length}</strong> مورد
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-slate-300 dark:border-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 w-10 text-center">ردیف</th>
                    {activeOrgId === 'all' && (
                      <th className="p-2 border-l border-slate-300 dark:border-slate-700">نام سازمان</th>
                    )}
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">نام سامانه</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">نوع سامانه</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 text-center">اینترنت</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">دامنه / IP</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">دیتابیس</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 text-center">MFA</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 text-center">بکاپ</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 text-center">امنیت</th>
                    <th className="p-2">پیمانکار / راهبر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {filteredSystems.map((sys, idx) => (
                    <tr key={sys.id} className="even:bg-slate-50/50 dark:even:bg-slate-800/40">
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center tabular-nums">{idx + 1}</td>
                      {activeOrgId === 'all' && (
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800 font-semibold">{sys.organizationName || 'سازمان مرکزی'}</td>
                      )}
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 font-medium">{sys.systemName}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800">{sys.systemType}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center">{sys.isInternetFacing}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 tabular-nums text-[11px] dir-ltr">{sys.domainOrIp || sys.internalIp || '---'}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 tabular-nums">{sys.databaseType}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center">{sys.mfaEnabled}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center">{sys.backupStatus}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center font-semibold">{sys.securityStatus}</td>
                      <td className="p-2">{sys.contractor} ({sys.systemManager || '---'})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">کل تجهیزات:</span>
                <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{orgAssets.length} دستگاه</span>
              </div>
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">کل سامانه‌ها:</span>
                <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{orgSystems.length} سامانه</span>
              </div>
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">پرسنل فناوری اطلاعات:</span>
                <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{orgEmployees.length} کارشناس</span>
              </div>
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">سامانه‌های اینترنتی:</span>
                <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                  {orgSystems.filter((s) => s.isInternetFacing === 'بله').length} مورد
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">پرسنل کلیدی و مدیران فناوری</h3>
              <table className="w-full text-right text-xs border border-slate-300 dark:border-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">نام و نام خانوادگی</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">سازمان</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">سمت</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">واحد</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">شماره تماس</th>
                    <th className="p-2">ایمیل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {orgEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 font-medium">{emp.fullName}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800">{emp.organizationName || 'سازمان مرکزی'}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800">{emp.jobTitle}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800">{emp.unit}</td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-800 tabular-nums dir-ltr">{emp.mobile || emp.landline || '---'}</td>
                      <td className="p-2 tabular-nums dir-ltr">{emp.email || '---'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'organizations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>تعداد کل سازمان‌های تحت پوشش: <strong className="tabular-nums font-bold">{organizations.length}</strong> سازمان</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-slate-300 dark:border-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 w-10 text-center">ردیف</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">نام سازمان</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">حوزه فعالیت</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">رده</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">شناسه ملی</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700">شهر</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 text-center">تعداد تجهیزات</th>
                    <th className="p-2 border-l border-slate-300 dark:border-slate-700 text-center">تعداد سامانه‌ها</th>
                    <th className="p-2">دامنه / آدرس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {organizations.map((org, idx) => {
                    const astCount = assets.filter((a) => a.organizationId === org.id || a.organizationName === org.name).length;
                    const sysCount = systems.filter((s) => s.organizationId === org.id || s.organizationName === org.name).length;
                    return (
                      <tr key={org.id} className="even:bg-slate-50/50 dark:even:bg-slate-800/40">
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center tabular-nums">{idx + 1}</td>
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800 font-bold">{org.name}</td>
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800">{org.activityField}</td>
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800">{org.orgLevel}</td>
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800 tabular-nums">{org.nationalId || '---'}</td>
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800">{org.city}</td>
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center font-bold tabular-nums">{astCount}</td>
                        <td className="p-2 border-l border-slate-200 dark:border-slate-800 text-center font-bold tabular-nums">{sysCount}</td>
                        <td className="p-2 tabular-nums text-[11px] dir-ltr">{org.mainDomain || org.publicIp || '---'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Printable Official Signatures Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-8 text-center text-xs text-slate-800 dark:text-slate-200">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-12">تنظیم‌کننده گزارش (کارشناس IT)</span>
            <span className="font-semibold block">امضا و تاریخ</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-12">تاییدکننده (مدیر فناوری اطلاعات)</span>
            <span className="font-semibold block">امضا و تاریخ</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-12">ناظر عالی (ریاست سازمان / حراست)</span>
            <span className="font-semibold block">مهر و امضا</span>
          </div>
        </div>
      </div>
    </div>
  );
};
