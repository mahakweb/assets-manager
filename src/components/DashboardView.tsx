import React from 'react';
import {
  HardDrive,
  Layers,
  Users,
  ShieldAlert,
  ShieldCheck,
  Server,
  AlertTriangle,
  Globe,
  Database,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { FullDatabase } from '../types';
import { NavTab } from './Header';

interface DashboardViewProps {
  db: FullDatabase;
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ db, onNavigate }) => {
  const { assets, systems, employees, organizations } = db;
  const currentOrg = organizations[0];

  // Calculations
  const totalAssets = assets.length;
  const totalSystems = systems.length;
  const totalEmployees = employees.length;

  const criticalOrWeakSystems = systems.filter(
    (s) => s.securityStatus === 'بحرانی' || s.securityStatus === 'ضعیف'
  );
  const internetFacingSystems = systems.filter((s) => s.isInternetFacing === 'بله');
  const systemsWithoutMfa = systems.filter((s) => s.mfaEnabled === 'خیر' && s.isInternetFacing === 'بله');
  const systemsWithoutBackup = systems.filter((s) => s.backupStatus === 'خیر');

  const criticalAssets = assets.filter(
    (a) => a.importanceLevel === 'حیاتی' || a.healthStatus === 'بحرانی' || a.healthStatus === 'ضعیف'
  );

  // Group assets by type
  const assetTypeMap: Record<string, number> = {};
  assets.forEach((a) => {
    const type = a.assetType || 'نامشخص';
    assetTypeMap[type] = (assetTypeMap[type] || 0) + 1;
  });
  const topAssetTypes = Object.entries(assetTypeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Group systems by security status
  const securityCounts: Record<string, number> = {
    'خوب': 0,
    'متوسط': 0,
    'ضعیف': 0,
    'بحرانی': 0,
    'نامشخص': 0
  };
  systems.forEach((s) => {
    const sec = s.securityStatus || 'نامشخص';
    if (securityCounts[sec] !== undefined) {
      securityCounts[sec]++;
    } else {
      securityCounts['نامشخص']++;
    }
  });

  // Group assets by placement location
  const locationMap: Record<string, number> = {};
  assets.forEach((a) => {
    const loc = a.placementLocation || 'نامشخص';
    locationMap[loc] = (locationMap[loc] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Organization Header Snapshot Banner */}
      {currentOrg && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>{currentOrg.province || 'استان'}</span>
                <span aria-hidden="true">·</span>
                <span>{currentOrg.city || 'مرکز استان'}</span>
                <span aria-hidden="true">·</span>
                <span>شناسه ملی: <span className="font-mono tabular-nums">{currentOrg.nationalId || '---'}</span></span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">{currentOrg.name}</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">{currentOrg.description}</p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="text-left md:text-right border-r md:border-r-0 md:border-l border-slate-200 pr-4 md:pr-0 md:pl-4">
                <span className="text-xs text-slate-500 block">دامنه اصلی و IP</span>
                <span className="text-xs font-mono font-medium text-slate-800 dir-ltr inline-block">
                  {currentOrg.mainDomain || currentOrg.publicIp || '---'}
                </span>
              </div>
              <button
                onClick={() => onNavigate('organization')}
                className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors whitespace-nowrap"
              >
                مشاهده سازمان
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top 4 Key Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">کل تجهیزات و دارایی‌ها</span>
            <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalAssets}</span>
            <span className="text-xs text-slate-500">قلم تجهیز ثبت شده</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">تجهیزات در مرکز داده:</span>
            <span className="font-mono tabular-nums font-medium text-slate-700">
              {assets.filter((a) => a.placementLocation === 'مرکز داده').length}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">سامانه‌ها و سرویس‌ها</span>
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalSystems}</span>
            <span className="text-xs text-slate-500">سامانه نرم‌افزاری</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">متصل به اینترنت:</span>
            <span className="font-mono tabular-nums font-medium text-slate-700">
              {internetFacingSystems.length} سامانه
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">وضعیت امنیت سامانه‌ها</span>
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
              criticalOrWeakSystems.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {criticalOrWeakSystems.length > 0 ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {securityCounts['خوب'] || 0}
            </span>
            <span className="text-xs text-emerald-600">سطح امنیتی خوب</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">بحرانی یا ضعیف:</span>
            <span className="font-mono tabular-nums font-medium text-rose-600">
              {criticalOrWeakSystems.length} سامانه
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">نیروی انسانی و پرسنل</span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalEmployees}</span>
            <span className="text-xs text-slate-500">کارشناس ثبت‌شده</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">واحد فناوری اطلاعات:</span>
            <span className="font-mono tabular-nums font-medium text-slate-700">
              {employees.filter((e) => e.unit === 'فناوری اطلاعات').length} نفر
            </span>
          </div>
        </div>
      </div>

      {/* Critical Security & Operational Alerts */}
      {(criticalOrWeakSystems.length > 0 || systemsWithoutMfa.length > 0 || systemsWithoutBackup.length > 0) && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h2 className="text-sm font-semibold text-amber-900">
                هشدارهای نیازمند بررسی امنیتی و زیرساختی
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-amber-800">
                {criticalOrWeakSystems.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>
                      <strong className="font-mono tabular-nums">{criticalOrWeakSystems.length}</strong> سامانه با سطح امنیت ضعیف/بحرانی
                    </span>
                  </div>
                )}
                {systemsWithoutMfa.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>
                      <strong className="font-mono tabular-nums">{systemsWithoutMfa.length}</strong> سامانه متصل به اینترنت فاقد احراز هویت دو مرحله‌ای (MFA)
                    </span>
                  </div>
                )}
                {systemsWithoutBackup.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>
                      <strong className="font-mono tabular-nums">{systemsWithoutBackup.length}</strong> سامانه فاقد پشتیبان‌گیری خودکار
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => onNavigate('reporting')}
              className="text-xs text-amber-900 hover:text-amber-950 font-semibold underline underline-offset-4 whitespace-nowrap self-center"
            >
              مشاهده در گزارش
            </button>
          </div>
        </div>
      )}

      {/* Charts & Analytical Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Asset Types Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">توزیع دارایی‌ها بر اساس نوع تجهیز</h3>
              <p className="text-xs text-slate-500 mt-0.5">بیشترین حجم تجهیزات ثبت شده در سازمان</p>
            </div>
            <button
              onClick={() => onNavigate('assets')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>مشاهده همه</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topAssetTypes.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">هیچ تجهیزی ثبت نشده است</p>
            ) : (
              topAssetTypes.map(([type, count]) => {
                const percentage = totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{type}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums text-slate-900 font-semibold">{count} دستگاه</span>
                        <span className="font-mono tabular-nums text-slate-400 text-[11px]">({percentage}٪)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chart 2: Systems Security & Readiness */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">وضعیت امنیت سامانه‌های نرم‌افزاری</h3>
              <p className="text-xs text-slate-500 mt-0.5">ارزیابی بر اساس آخرین آزمون‌های امنیتی</p>
            </div>
            <button
              onClick={() => onNavigate('systems')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>مدیریت سامانه‌ها</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-md text-center">
              <span className="text-xs text-emerald-800 block">سطح خوب</span>
              <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">
                {securityCounts['خوب']}
              </span>
            </div>
            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-md text-center">
              <span className="text-xs text-amber-800 block">سطح متوسط</span>
              <span className="text-xl font-bold font-mono tabular-nums text-amber-700">
                {securityCounts['متوسط']}
              </span>
            </div>
            <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-md text-center">
              <span className="text-xs text-rose-800 block">سطح ضعیف</span>
              <span className="text-xl font-bold font-mono tabular-nums text-rose-700">
                {securityCounts['ضعیف']}
              </span>
            </div>
            <div className="p-3 bg-red-100/70 border border-red-200 rounded-md text-center">
              <span className="text-xs text-red-900 block">سطح بحرانی</span>
              <span className="text-xl font-bold font-mono tabular-nums text-red-800">
                {securityCounts['بحرانی']}
              </span>
            </div>
          </div>

          {/* Sub Indicators: Backup, MFA, Monitoring */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">پوشش پشتیبان‌گیری منظم (Backup)</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {systems.filter((s) => s.backupStatus === 'بله').length} از {totalSystems} سامانه
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">سامانه‌های مجهز به احراز هویت دومرحله‌ای (MFA)</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {systems.filter((s) => s.mfaEnabled === 'بله').length} از {totalSystems} سامانه
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">پوشش سیستم‌های پایش و مانیتورینگ</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {systems.filter((s) => s.monitoring === 'بله').length} از {totalSystems} سامانه
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent High Importance Assets & Critical Systems Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Importance Assets */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">تجهیزات حیاتی و زیرساختی دیتاسنتر</h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">{criticalAssets.length} قلم</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-normal">
                  <th className="py-2 pr-1">نوع</th>
                  <th className="py-2">مدل و برند</th>
                  <th className="py-2">محل استقرار</th>
                  <th className="py-2">IP آدرس</th>
                  <th className="py-2 pl-1">وضعیت سلامت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalAssets.slice(0, 5).map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 pr-1 font-medium text-slate-800">{ast.assetType}</td>
                    <td className="py-2.5 text-slate-600">{ast.brandModel}</td>
                    <td className="py-2.5 text-slate-500">{ast.placementLocation}</td>
                    <td className="py-2.5 font-mono dir-ltr text-slate-700">{ast.ipAddress || '-'}</td>
                    <td className="py-2.5 pl-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        ast.healthStatus === 'خوب'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ast.healthStatus === 'متوسط'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {ast.healthStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Internet Facing Systems */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">سامانه‌های دارای دسترسی اینترنت عمومی</h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">{internetFacingSystems.length} سامانه</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-normal">
                  <th className="py-2 pr-1">نام سامانه</th>
                  <th className="py-2">دامنه / آدرس</th>
                  <th className="py-2">MFA</th>
                  <th className="py-2">بکاپ</th>
                  <th className="py-2 pl-1">وضعیت امنیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {internetFacingSystems.slice(0, 5).map((sys) => (
                  <tr key={sys.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 pr-1 font-medium text-slate-800">{sys.systemName}</td>
                    <td className="py-2.5 font-mono text-[11px] dir-ltr text-slate-600">{sys.domainOrIp || '-'}</td>
                    <td className="py-2.5">
                      {sys.mfaEnabled === 'بله' ? (
                        <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          فعال
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-slate-600">{sys.backupStatus}</td>
                    <td className="py-2.5 pl-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        sys.securityStatus === 'خوب'
                          ? 'bg-emerald-50 text-emerald-700'
                          : sys.securityStatus === 'متوسط'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {sys.securityStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
