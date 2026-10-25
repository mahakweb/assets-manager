import React, { useState, useMemo } from 'react';
import {
  HardDrive,
  Layers,
  Users,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Server,
  AlertTriangle,
  Globe,
  Database,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Check,
  Copy,
  BarChart3,
  PieChart
} from 'lucide-react';
import { FullDatabase } from '../types';
import { NavTab } from './Header';

interface DashboardViewProps {
  db: FullDatabase;
  onNavigate: (tab: NavTab, orgId?: number) => void;
  selectedOrgId: number | 'all';
  onSelectOrg: (id: number | 'all') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  db,
  onNavigate,
  selectedOrgId,
  onSelectOrg
}) => {
  const { assets, systems, employees, organizations } = db;

  // Filter dataset by active organization if one is selected
  const isAllOrgs = selectedOrgId === 'all';
  const activeOrg = organizations.find((o) => o.id === selectedOrgId);

  const displayAssets = useMemo(() => {
    if (isAllOrgs) return assets;
    return assets.filter((a) => a.organizationId === selectedOrgId || a.organizationName === activeOrg?.name);
  }, [assets, selectedOrgId, isAllOrgs, activeOrg]);

  const displaySystems = useMemo(() => {
    if (isAllOrgs) return systems;
    return systems.filter((s) => s.organizationId === selectedOrgId || s.organizationName === activeOrg?.name);
  }, [systems, selectedOrgId, isAllOrgs, activeOrg]);

  const displayEmployees = useMemo(() => {
    if (isAllOrgs) return employees;
    return employees.filter((e) => e.organizationId === selectedOrgId || e.organizationName === activeOrg?.name);
  }, [employees, selectedOrgId, isAllOrgs, activeOrg]);

  // Key KPI Counts
  const totalAssets = displayAssets.length;
  const totalSystems = displaySystems.length;
  const totalEmployees = displayEmployees.length;

  const criticalOrWeakSystems = displaySystems.filter(
    (s) => s.securityStatus === 'بحرانی' || s.securityStatus === 'ضعیف'
  );
  const internetFacingSystems = displaySystems.filter((s) => s.isInternetFacing === 'بله');
  const systemsWithMfa = displaySystems.filter((s) => s.mfaEnabled === 'بله');
  const systemsWithBackup = displaySystems.filter((s) => s.backupStatus === 'بله');
  const systemsWithMonitoring = displaySystems.filter((s) => s.monitoring === 'بله');

  const mfaPercentage = totalSystems > 0 ? Math.round((systemsWithMfa.length / totalSystems) * 100) : 0;
  const backupPercentage = totalSystems > 0 ? Math.round((systemsWithBackup.length / totalSystems) * 100) : 0;
  const monitoringPercentage = totalSystems > 0 ? Math.round((systemsWithMonitoring.length / totalSystems) * 100) : 0;

  // Asset Type Distribution
  const assetTypeMap: Record<string, number> = {};
  displayAssets.forEach((a) => {
    const t = a.assetType || 'سایر';
    assetTypeMap[t] = (assetTypeMap[t] || 0) + 1;
  });
  const topAssetTypes = Object.entries(assetTypeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Security Status Distribution
  const securityCounts: Record<string, number> = {
    'خوب': 0,
    'متوسط': 0,
    'ضعیف': 0,
    'بحرانی': 0
  };
  displaySystems.forEach((s) => {
    const status = s.securityStatus;
    if (securityCounts[status] !== undefined) {
      securityCounts[status]++;
    } else {
      securityCounts['متوسط']++;
    }
  });

  // Operating System Distribution
  const osMap: Record<string, number> = {};
  displayAssets.forEach((a) => {
    const os = a.operatingSystem || 'نامشخص';
    if (os !== 'ندارد') {
      osMap[os] = (osMap[os] || 0) + 1;
    }
  });
  const topOS = Object.entries(osMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Organizations ranking (by asset count)
  const orgRanking = useMemo(() => {
    return organizations.map((org) => {
      const astCount = assets.filter((a) => a.organizationId === org.id || a.organizationName === org.name).length;
      const sysCount = systems.filter((s) => s.organizationId === org.id || s.organizationName === org.name).length;
      return {
        org,
        astCount,
        sysCount,
        total: astCount + sysCount
      };
    }).sort((a, b) => b.total - a.total).slice(0, 6);
  }, [organizations, assets, systems]);

  // Toast / Copy
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Scope Banner: All Organizations vs Single Organization */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>داشبورد تحلیلی و فرماندهی IT</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {isAllOrgs ? `دید کلان (${organizations.length} سازمان)` : activeOrg?.activityField}
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAllOrgs
                  ? `مرکز پایش و مدیریت دارایی‌های کل سازمان‌های استان`
                  : activeOrg?.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                {isAllOrgs
                  ? `پایش یکپارچه و متمرکز زیرساخت سخت‌افزاری، سامانه‌ها، پایگاه‌های داده و راهبران امنیتی دستگاه‌های اجرایی`
                  : activeOrg?.description || 'مشخصات و پایش دارایی‌های این سازمان'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isAllOrgs && (
              <button
                onClick={() => onSelectOrg('all')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md transition-colors"
              >
                بازگشت به دید کلان همه سازمان‌ها
              </button>
            )}
            <button
              onClick={() => onNavigate('organizations')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              مدیریت {organizations.length} سازمان
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Organizations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">سازمان‌های تحت پوشش</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {organizations.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">دستگاه اجرایی</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>فعال در پرتال:</span>
            <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">۱۰۰٪ کامل</span>
          </div>
        </div>

        {/* KPI 2: Total Assets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">کل تجهیزات و دارایی‌ها</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {totalAssets}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">قلم سخت‌افزار</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>تجهیزات مرکز داده:</span>
            <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              {displayAssets.filter((a) => a.placementLocation === 'مرکز داده').length} دستگاه
            </span>
          </div>
        </div>

        {/* KPI 3: Systems */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">سامانه‌ها و سرویس‌ها</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {totalSystems}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">سامانه نرم‌افزاری</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>متصل به اینترنت:</span>
            <span className="tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
              {internetFacingSystems.length} سامانه
            </span>
          </div>
        </div>

        {/* KPI 4: Security Posture */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">امنیت خوب و پایدار</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              criticalOrWeakSystems.length > 0
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {securityCounts['خوب']}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">از {totalSystems} سامانه</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>نیازمند توجه فوری:</span>
            <span className="tabular-nums font-bold text-rose-600 dark:text-rose-400">
              {criticalOrWeakSystems.length} سامانه
            </span>
          </div>
        </div>

        {/* KPI 5: Personnel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">راهبران و پرسنل IT</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {totalEmployees}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">کارشناس ثبت‌شده</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>واحد فناوری:</span>
            <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              {displayEmployees.filter((e) => e.unit === 'فناوری اطلاعات').length} نفر
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Visual Asset Breakdown & Organizations Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Organizations Comparative Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>رتبه‌بندی سازمان‌ها بر اساس حجم دارایی‌ها و سامانه‌ها</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                توزیع سخت‌افزارها و سامانه‌های نرم‌افزاری در بین دستگاه‌های پیشرو
              </p>
            </div>
            <button
              onClick={() => onNavigate('organizations')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>همه سازمان‌ها</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {orgRanking.map(({ org, astCount, sysCount, total }) => {
              const maxTotal = Math.max(...orgRanking.map((r) => r.total), 1);
              const pct = Math.round((total / maxTotal) * 100);
              return (
                <div key={org.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      onClick={() => onSelectOrg(org.id)}
                      className="font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer truncate max-w-[280px]"
                    >
                      {org.name}
                    </span>
                    <div className="flex items-center gap-3 shrink-0 tabular-nums">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {astCount} دارایی · {sysCount} سامانه
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {total} مورد
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-indigo-600 rounded-r-full transition-all duration-500"
                      style={{ width: `${(astCount / (total || 1)) * pct}%` }}
                      title={`دارایی‌ها: ${astCount}`}
                    />
                    <div
                      className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                      style={{ width: `${(sysCount / (total || 1)) * pct}%` }}
                      title={`سامانه‌ها: ${sysCount}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-600"></span>
              <span>تجهیزات و دارایی‌های سخت‌افزاری</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
              <span>سامانه‌ها و سرویس‌های نرم‌افزاری</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Security & Resilience Posture Radar (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>شاخص‌های تاب‌آوری و امنیت سایبری</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ارزیابی الزامات امنیتی حاکمیتی در سامانه‌ها
                </p>
              </div>
            </div>

            {/* Circular / Visual Metric Progress Cards */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    پوشش پشتیبان‌گیری خودکار (Backup)
                  </span>
                  <span className="tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                    {backupPercentage}٪ ({systemsWithBackup.length} از {totalSystems})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${backupPercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    احراز هویت دو مرحله‌ای (MFA)
                  </span>
                  <span className="tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                    {mfaPercentage}٪ ({systemsWithMfa.length} از {totalSystems})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${mfaPercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    پوشش پایش و مانیتورینگ برخط
                  </span>
                  <span className="tabular-nums font-bold text-blue-600 dark:text-blue-400">
                    {monitoringPercentage}٪ ({systemsWithMonitoring.length} از {totalSystems})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${monitoringPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Levels Grid */}
          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-center">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block">خوب</span>
              <span className="text-base font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                {securityCounts['خوب']}
              </span>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
              <span className="text-[11px] text-amber-800 dark:text-amber-300 block">متوسط</span>
              <span className="text-base font-bold tabular-nums text-amber-700 dark:text-amber-400">
                {securityCounts['متوسط']}
              </span>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg">
              <span className="text-[11px] text-rose-800 dark:text-rose-300 block">ضعیف</span>
              <span className="text-base font-bold tabular-nums text-rose-700 dark:text-rose-400">
                {securityCounts['ضعیف']}
              </span>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-950/70 rounded-lg">
              <span className="text-[11px] text-red-900 dark:text-red-300 block">بحرانی</span>
              <span className="text-base font-bold tabular-nums text-red-800 dark:text-red-400">
                {securityCounts['بحرانی']}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Asset Types Breakdown & Operating Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Asset Types Visual Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>توزیع تجهیزات بر اساس نوع دارایی</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                فراوانی دسته‌بندی‌های سخت‌افزاری اصلی
              </p>
            </div>
            <button
              onClick={() => onNavigate('assets')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              مشاهده جدول
            </button>
          </div>

          <div className="space-y-3">
            {topAssetTypes.map(([type, count]) => {
              const pct = totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{type}</span>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="font-bold text-slate-900 dark:text-white">{count} دستگاه</span>
                      <span className="text-slate-400 text-[11px]">({pct}٪)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-indigo-500 to-indigo-700 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Systems Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>سیستم‌عامل‌ها و پلتفرم‌های میزبان</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                توزیع سیستم‌عامل‌های فعال در سرورها و سوئیچ‌ها
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {topOS.map(([os, count]) => {
              const totalKnown = displayAssets.filter((a) => a.operatingSystem && a.operatingSystem !== 'ندارد').length;
              const pct = totalKnown > 0 ? Math.round((count / totalKnown) * 100) : 0;
              return (
                <div key={os} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{os}</span>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="font-bold text-slate-900 dark:text-white">{count} سرور/تجهیز</span>
                      <span className="text-slate-400 text-[11px]">({pct}٪)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-l from-blue-500 to-cyan-600 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalOrWeakSystems.length > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                هشدارهای نیازمند اقدام فوری در سامانه‌ها ({criticalOrWeakSystems.length} مورد)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-800 dark:text-amber-300 pt-1">
                {criticalOrWeakSystems.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-900/60 rounded border border-amber-200/50">
                    <div>
                      <span className="font-bold block">{s.systemName}</span>
                      <span className="text-[11px] text-slate-500">{s.organizationName || 'سازمان مرکزی'} · امنیت: {s.securityStatus}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('systems', s.organizationId)}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline shrink-0"
                    >
                      بررسی
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
