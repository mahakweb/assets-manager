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
  SlidersHorizontal
} from 'lucide-react';
import { FullDatabase } from '../types';
import { exportSingleTableToExcel } from '../services/excelService';

interface ReportingViewProps {
  db: FullDatabase;
}

type ReportType = 'assets' | 'systems' | 'overview';

export const ReportingView: React.FC<ReportingViewProps> = ({ db }) => {
  const { assets, systems, employees, organizations, lists } = db;
  const currentOrg = organizations[0];

  const [reportType, setReportType] = useState<ReportType>('assets');

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

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchType = !assetTypeFilter || a.assetType === assetTypeFilter;
      const matchPlace = !placementFilter || a.placementLocation === placementFilter;
      const matchHealth = !healthFilter || a.healthStatus === healthFilter;
      const matchImp = !importanceFilter || a.importanceLevel === importanceFilter;
      return matchType && matchPlace && matchHealth && matchImp;
    });
  }, [assets, assetTypeFilter, placementFilter, healthFilter, importanceFilter]);

  // Filtered Systems
  const filteredSystems = useMemo(() => {
    return systems.filter((s) => {
      const matchType = !systemTypeFilter || s.systemType === systemTypeFilter;
      const matchInternet = !internetFilter || s.isInternetFacing === internetFilter;
      const matchSec = !secFilter || s.securityStatus === secFilter;
      const matchBackup = !backupFilter || s.backupStatus === backupFilter;
      return matchType && matchInternet && matchSec && matchBackup;
    });
  }, [systems, systemTypeFilter, internetFilter, secFilter, backupFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportFiltered = () => {
    if (reportType === 'assets') {
      const rows = filteredAssets.map((ast) => ({
        'ردیف': ast.id,
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 no-print space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-900">
              مرکز گزارش‌گیری و صدور اسناد چاپی / PDF
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              انتخاب نوع گزارش، اعمال فیلترهای دقیق و دریافت نسخه چاپی با سربرگ استاندارد سازمانی
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFiltered}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
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

        {/* Report Type Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setReportType('assets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              reportType === 'assets' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            گزارش تجهیزات و دارایی‌ها
          </button>
          <button
            onClick={() => setReportType('systems')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              reportType === 'systems' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            گزارش سامانه‌ها و سرویس‌ها
          </button>
          <button
            onClick={() => setReportType('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              reportType === 'overview' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            کارنامه جامع مدیریتی سازمان
          </button>
        </div>

        {/* Dynamic Filters depending on Report Type */}
        {reportType === 'assets' && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              فیلتر دارایی:
            </span>

            <select
              value={assetTypeFilter}
              onChange={(e) => setAssetTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
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
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
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
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
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
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
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
                className="text-rose-600 hover:text-rose-800 underline underline-offset-2 ml-auto"
              >
                پاک‌کردن فیلترها
              </button>
            )}
          </div>
        )}

        {reportType === 'systems' && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              فیلتر سامانه:
            </span>

            <select
              value={systemTypeFilter}
              onChange={(e) => setSystemTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
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
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
            >
              <option value="">دسترسی اینترنت (همه)</option>
              <option value="بله">متصل به اینترنت</option>
              <option value="خیر">شبکه داخلی (LAN)</option>
            </select>

            <select
              value={secFilter}
              onChange={(e) => setSecFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
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
              className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700"
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
                className="text-rose-600 hover:text-rose-800 underline underline-offset-2 ml-auto"
              >
                پاک‌کردن فیلترها
              </button>
            )}
          </div>
        )}
      </div>

      {/* Printable Sheet Canvas */}
      <div className="bg-white border border-slate-200 rounded-lg p-8 print-container shadow-xs">
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="w-48 text-right">
              <span className="text-[11px] text-slate-500 block">جمهوری اسلامی ایران</span>
              <span className="text-xs font-bold text-slate-900 block">{currentOrg?.name || 'سازمان مرکزی'}</span>
              <span className="text-[10px] text-slate-500 block">مدیریت فناوری اطلاعات و ارتباطات</span>
            </div>

            <div className="text-center">
              <h2 className="text-base font-bold text-slate-900">
                {reportType === 'assets' && 'گزارش رسمی موجودی تجهیزات و دارایی‌های سخت‌افزاری'}
                {reportType === 'systems' && 'گزارش پایش و ممیزی سامانه‌ها و سرویس‌های نرم‌افزاری'}
                {reportType === 'overview' && 'کارنامه جامع وضعیت فناوری اطلاعات و امنیت سازمان'}
              </h2>
              <span className="text-xs text-slate-500 block mt-1">
                استخراج شده از پایگاه داده پرتابل دارایی‌های سازمان
              </span>
            </div>

            <div className="w-48 text-left text-xs font-mono tabular-nums text-slate-600 space-y-1">
              <div>تاریخ گزارش: {todayDateStr}</div>
              <div>شماره سند: DOC-{new Date().getFullYear()}-01</div>
              <div>طبقه‌بندی: محرمانه اداری</div>
            </div>
          </div>
        </div>

        {/* Content based on Report Type */}
        {reportType === 'assets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>تعداد کل تجهیزات احصا شده در این گزارش: <strong className="font-mono tabular-nums">{filteredAssets.length}</strong> قلم</span>
              <span>حوزه جغرافیایی: {currentOrg?.province || 'ستاد مرکزی'}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-l border-slate-300 w-10 text-center">ردیف</th>
                    <th className="p-2 border-l border-slate-300">نوع دارایی</th>
                    <th className="p-2 border-l border-slate-300">برند و مدل</th>
                    <th className="p-2 border-l border-slate-300">کد اموال</th>
                    <th className="p-2 border-l border-slate-300">IP آدرس</th>
                    <th className="p-2 border-l border-slate-300">محل استقرار</th>
                    <th className="p-2 border-l border-slate-300">سیستم عامل</th>
                    <th className="p-2 border-l border-slate-300 text-center">اهمیت</th>
                    <th className="p-2 text-center">وضعیت سلامت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAssets.map((ast, idx) => (
                    <tr key={ast.id} className="even:bg-slate-50/50">
                      <td className="p-2 border-l border-slate-200 text-center font-mono tabular-nums">{idx + 1}</td>
                      <td className="p-2 border-l border-slate-200 font-medium">{ast.assetType}</td>
                      <td className="p-2 border-l border-slate-200">{ast.brandModel}</td>
                      <td className="p-2 border-l border-slate-200 font-mono text-[11px]">{ast.propertyCode || '---'}</td>
                      <td className="p-2 border-l border-slate-200 font-mono dir-ltr">{ast.ipAddress || '---'}</td>
                      <td className="p-2 border-l border-slate-200">{ast.placementLocation} ({ast.county})</td>
                      <td className="p-2 border-l border-slate-200 font-mono">{ast.operatingSystem}</td>
                      <td className="p-2 border-l border-slate-200 text-center font-medium">{ast.importanceLevel}</td>
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
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>تعداد کل سامانه‌های گزارش: <strong className="font-mono tabular-nums">{filteredSystems.length}</strong> سامانه</span>
              <span>
                سامانه‌های اینترنتی: <strong className="font-mono tabular-nums">{filteredSystems.filter((s) => s.isInternetFacing === 'بله').length}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-l border-slate-300 w-10 text-center">ردیف</th>
                    <th className="p-2 border-l border-slate-300">نام سامانه</th>
                    <th className="p-2 border-l border-slate-300">نوع سامانه</th>
                    <th className="p-2 border-l border-slate-300 text-center">اینترنت</th>
                    <th className="p-2 border-l border-slate-300">دامنه / IP</th>
                    <th className="p-2 border-l border-slate-300">دیتابیس</th>
                    <th className="p-2 border-l border-slate-300 text-center">MFA</th>
                    <th className="p-2 border-l border-slate-300 text-center">بکاپ</th>
                    <th className="p-2 border-l border-slate-300 text-center">امنیت</th>
                    <th className="p-2">پیمانکار / مسئول</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSystems.map((sys, idx) => (
                    <tr key={sys.id} className="even:bg-slate-50/50">
                      <td className="p-2 border-l border-slate-200 text-center font-mono tabular-nums">{idx + 1}</td>
                      <td className="p-2 border-l border-slate-200 font-medium">{sys.systemName}</td>
                      <td className="p-2 border-l border-slate-200">{sys.systemType}</td>
                      <td className="p-2 border-l border-slate-200 text-center">{sys.isInternetFacing}</td>
                      <td className="p-2 border-l border-slate-200 font-mono text-[11px] dir-ltr">{sys.domainOrIp || sys.internalIp || '---'}</td>
                      <td className="p-2 border-l border-slate-200 font-mono">{sys.databaseType}</td>
                      <td className="p-2 border-l border-slate-200 text-center">{sys.mfaEnabled}</td>
                      <td className="p-2 border-l border-slate-200 text-center">{sys.backupStatus}</td>
                      <td className="p-2 border-l border-slate-200 text-center font-semibold">{sys.securityStatus}</td>
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
              <div className="p-3 border border-slate-200 rounded">
                <span className="text-[11px] text-slate-500 block">کل تجهیزات ثبت شده:</span>
                <span className="text-lg font-bold font-mono text-slate-900">{assets.length} دستگاه</span>
              </div>
              <div className="p-3 border border-slate-200 rounded">
                <span className="text-[11px] text-slate-500 block">کل سامانه‌های فعال:</span>
                <span className="text-lg font-bold font-mono text-slate-900">{systems.length} سامانه</span>
              </div>
              <div className="p-3 border border-slate-200 rounded">
                <span className="text-[11px] text-slate-500 block">پرسنل فناوری اطلاعات:</span>
                <span className="text-lg font-bold font-mono text-slate-900">{employees.length} کارشناس</span>
              </div>
              <div className="p-3 border border-slate-200 rounded">
                <span className="text-[11px] text-slate-500 block">سامانه‌های تحت اینترنت:</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {systems.filter((s) => s.isInternetFacing === 'بله').length} مورد
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">خلاصه پرسنل کلیدی و مدیران فناوری</h3>
              <table className="w-full text-right text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-l border-slate-300">نام و نام خانوادگی</th>
                    <th className="p-2 border-l border-slate-300">سمت</th>
                    <th className="p-2 border-l border-slate-300">واحد</th>
                    <th className="p-2 border-l border-slate-300">شماره تماس</th>
                    <th className="p-2">ایمیل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="p-2 border-l border-slate-200 font-medium">{emp.fullName}</td>
                      <td className="p-2 border-l border-slate-200">{emp.jobTitle}</td>
                      <td className="p-2 border-l border-slate-200">{emp.unit}</td>
                      <td className="p-2 border-l border-slate-200 font-mono dir-ltr">{emp.mobile || emp.landline || '---'}</td>
                      <td className="p-2 font-mono dir-ltr">{emp.email || '---'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Printable Official Signatures Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-3 gap-8 text-center text-xs">
          <div>
            <span className="text-slate-500 block mb-12">تنظیم‌کننده گزارش (کارشناس IT)</span>
            <span className="text-slate-900 font-semibold block">امضا و تاریخ</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-12">تاییدکننده (مدیر فناوری اطلاعات)</span>
            <span className="text-slate-900 font-semibold block">امضا و تاریخ</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-12">ناظر عالی (ریاست سازمان / حراست)</span>
            <span className="text-slate-900 font-semibold block">مهر و امضا</span>
          </div>
        </div>
      </div>
    </div>
  );
};
