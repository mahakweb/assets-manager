import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Copy,
  X,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Globe,
  Building2
} from 'lucide-react';
import { SystemItem, ListsData, Organization } from '../types';
import { exportSingleTableToExcel } from '../services/excelService';

interface SystemsViewProps {
  systems: SystemItem[];
  lists: ListsData;
  organizations: Organization[];
  selectedOrgId: number | 'all';
  onSaveSystem: (system: SystemItem) => void;
  onDeleteSystem: (id: number) => void;
}

export const SystemsView: React.FC<SystemsViewProps> = ({
  systems,
  lists,
  organizations,
  selectedOrgId,
  onSaveSystem,
  onDeleteSystem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [orgFilter, setOrgFilter] = useState<string>(selectedOrgId !== 'all' ? String(selectedOrgId) : '');
  const [internetFilter, setInternetFilter] = useState('');
  const [securityFilter, setSecurityFilter] = useState('');
  const [backupFilter, setBackupFilter] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<Partial<SystemItem> | null>(null);
  const [viewingSystem, setViewingSystem] = useState<SystemItem | null>(null);

  // Filtered Systems
  const filteredSystems = useMemo(() => {
    return systems.filter((sys) => {
      const matchSearch =
        !searchTerm ||
        sys.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sys.domainOrIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sys.internalIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sys.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sys.systemManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sys.organizationName && sys.organizationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sys.description && sys.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = !typeFilter || sys.systemType === typeFilter;
      const matchOrg = !orgFilter || String(sys.organizationId) === orgFilter || sys.organizationName === orgFilter;
      const matchInternet = !internetFilter || sys.isInternetFacing === internetFilter;
      const matchSec = !securityFilter || sys.securityStatus === securityFilter;
      const matchBackup = !backupFilter || sys.backupStatus === backupFilter;

      return matchSearch && matchType && matchOrg && matchInternet && matchSec && matchBackup;
    });
  }, [systems, searchTerm, typeFilter, orgFilter, internetFilter, securityFilter, backupFilter]);

  const handleOpenAdd = () => {
    const nextId = systems.length > 0 ? Math.max(...systems.map((s) => s.id)) + 1 : 1;
    const defaultOrg = organizations[0];
    setEditingSystem({
      id: nextId,
      organizationId: defaultOrg?.id || 1,
      organizationName: defaultOrg?.name || 'سازمان مرکزی',
      systemName: '',
      systemType: lists.systemTypes[0] || 'اتوماسیون اداری',
      isInternetFacing: 'خیر',
      domainOrIp: '',
      internalIp: '',
      operatingSystem: lists.operatingSystems[0] || 'Windows Server',
      databaseType: lists.dbTypes[0] || 'SQL Server',
      contractor: '',
      systemManager: '',
      backupStatus: 'بله',
      mfaEnabled: 'خیر',
      monitoring: 'بله',
      securityStatus: lists.statuses1[0] || 'خوب',
      lastSecurityTestDate: '',
      sslExpiryDate: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sys: SystemItem) => {
    setEditingSystem({ ...sys });
    setIsModalOpen(true);
  };

  const handleDuplicate = (sys: SystemItem) => {
    const nextId = systems.length > 0 ? Math.max(...systems.map((s) => s.id)) + 1 : 1;
    setEditingSystem({
      ...sys,
      id: nextId,
      systemName: `${sys.systemName} (کپی)`,
      domainOrIp: '',
      internalIp: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSystem || !editingSystem.systemName) return;

    const matchingOrg = organizations.find((o) => o.id === editingSystem.organizationId);
    const finalized: SystemItem = {
      ...(editingSystem as SystemItem),
      organizationName: matchingOrg?.name || editingSystem.organizationName || 'سازمان مرکزی'
    };

    onSaveSystem(finalized);
    setIsModalOpen(false);
    setEditingSystem(null);
  };

  const handleExportExcel = () => {
    const rows = filteredSystems.map((sys) => ({
      'ردیف': sys.id,
      'سازمان': sys.organizationName || 'سازمان مرکزی',
      'نام سامانه': sys.systemName,
      'نوع سامانه': sys.systemType,
      'تحت اینترنت': sys.isInternetFacing,
      'دامنه یا IP': sys.domainOrIp,
      'IP داخلی': sys.internalIp,
      'سیستم عامل': sys.operatingSystem,
      'نوع دیتابیس': sys.databaseType,
      'شرکت پیمانکار': sys.contractor,
      'مسئول سامانه': sys.systemManager,
      'وضعیت بکاپ': sys.backupStatus,
      'احرازهویت چندمرحلهای': sys.mfaEnabled,
      'مانیتورینگ': sys.monitoring,
      'وضعیت امنیت': sys.securityStatus,
      'تاریخ آخرین تست امنیت': sys.lastSecurityTestDate,
      'تاریخ انقضا SSL': sys.sslExpiryDate,
      'توضیحات': sys.description
    }));
    exportSingleTableToExcel('سامانه‌ها و سرویس‌ها', rows, 'لیست_سامانه‌های_سازمان_ها.xlsx');
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو در نام سامانه، سازمان، دامنه، پیمانکار، مسئول، توضیحات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 dark:bg-slate-800 dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>خروجی اکسل</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت سامانه جدید</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1 text-slate-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>فیلترها:</span>
          </div>

          {/* Org Filter */}
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[190px] truncate"
          >
            <option value="">🏢 همه سازمان‌ها ({organizations.length})</option>
            {organizations.map((org) => (
              <option key={org.id} value={String(org.id)}>
                {org.name}
              </option>
            ))}
          </select>

          {/* System Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه انواع سامانه</option>
            {lists.systemTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Internet Facing Filter */}
          <select
            value={internetFilter}
            onChange={(e) => setInternetFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">دسترسی اینترنت (همه)</option>
            <option value="بله">تحت اینترنت: بله</option>
            <option value="خیر">شبکه داخلی (LAN)</option>
          </select>

          {/* Security Status Filter */}
          <select
            value={securityFilter}
            onChange={(e) => setSecurityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه سطوح امنیت</option>
            {lists.statuses1.map((s) => (
              <option key={s} value={s}>
                امنیت: {s}
              </option>
            ))}
          </select>

          {(typeFilter || orgFilter || internetFilter || securityFilter || backupFilter || searchTerm) && (
            <button
              onClick={() => {
                setTypeFilter('');
                setOrgFilter('');
                setInternetFilter('');
                setSecurityFilter('');
                setBackupFilter('');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline mr-auto"
            >
              پاک‌کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Main Systems Table (Zero Monospace) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            نمایش <strong className="tabular-nums font-bold text-slate-900 dark:text-white">{filteredSystems.length}</strong> مورد از{' '}
            <span className="tabular-nums">{systems.length}</span> سامانه ثبت شده
          </span>
          <span className="text-slate-400">جدول ۵: سامانه‌ها و سرویس‌ها</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-12 text-center">ردیف</th>
                <th className="py-2.5 px-3 font-semibold">سازمان مربوطه</th>
                <th className="py-2.5 px-3 font-semibold">نام سامانه</th>
                <th className="py-2.5 px-3 font-semibold">نوع سامانه</th>
                <th className="py-2.5 px-3 font-semibold">تحت اینترنت</th>
                <th className="py-2.5 px-3 font-semibold">دامنه / IP داخلی</th>
                <th className="py-2.5 px-3 font-semibold">دیتابیس / سیستم‌عامل</th>
                <th className="py-2.5 px-3 font-semibold">MFA</th>
                <th className="py-2.5 px-3 font-semibold">بکاپ</th>
                <th className="py-2.5 px-3 font-semibold">وضعیت امنیت</th>
                <th className="py-2.5 px-3 font-semibold text-center w-28">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSystems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    سامانه‌ای مطابق با شرایط جستجو یافت نشد
                  </td>
                </tr>
              ) : (
                filteredSystems.map((sys) => (
                  <tr key={sys.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 text-center tabular-nums text-slate-400">
                      {sys.id}
                    </td>
                    <td className="py-2 px-3 font-semibold text-indigo-700 dark:text-indigo-400">
                      <span className="truncate max-w-[140px] block" title={sys.organizationName}>
                        {sys.organizationName || 'سازمان مرکزی'}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">
                      <div>{sys.systemName}</div>
                      <span className="text-[11px] text-slate-400">پیمانکار: {sys.contractor || 'سازمانی'}</span>
                    </td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                      {sys.systemType}
                    </td>
                    <td className="py-2 px-3">
                      {sys.isInternetFacing === 'بله' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded font-medium">
                          <Globe className="w-3 h-3" />
                          اینترنت
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          شبکه داخلی
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 tabular-nums dir-ltr text-slate-700 dark:text-slate-300 text-[11px]">
                      <div>{sys.domainOrIp || '---'}</div>
                      {sys.internalIp && sys.internalIp !== sys.domainOrIp && (
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] block">LAN: {sys.internalIp}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      <span>{sys.databaseType}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] block">{sys.operatingSystem}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {sys.mfaEnabled === 'بله' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px] flex items-center justify-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          دارد
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] flex items-center justify-center gap-0.5">
                          <XCircle className="w-3.5 h-3.5" />
                          ندارد
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {sys.backupStatus === 'بله' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">فعال</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-medium text-[11px]">غیرفعال</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        sys.securityStatus === 'خوب'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : sys.securityStatus === 'متوسط'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : sys.securityStatus === 'ضعیف'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                      }`}>
                        {sys.securityStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingSystem(sys)}
                          title="مشاهده جزئیات کامل"
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(sys)}
                          title="ویرایش"
                          className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(sys)}
                          title="کپی سامانه"
                          className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 rounded"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`آیا از حذف سامانه «${sys.systemName}» اطمینان دارید؟`)) {
                              onDeleteSystem(sys.id);
                            }
                          }}
                          title="حذف"
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit System Modal */}
      {isModalOpen && editingSystem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingSystem.id ? `ویرایش سامانه (ردیف ${editingSystem.id})` : 'ثبت سامانه و سرویس جدید'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* سازمان */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    سازمان متولی سامانه <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={editingSystem.organizationId || ''}
                    onChange={(e) => {
                      const orgId = Number(e.target.value);
                      const matching = organizations.find((o) => o.id === orgId);
                      setEditingSystem({
                        ...editingSystem,
                        organizationId: orgId,
                        organizationName: matching?.name || ''
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* نوع سامانه */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    نوع سامانه <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingSystem.systemType || ''}
                    onChange={(e) => setEditingSystem({ ...editingSystem, systemType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.systemTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* نام سامانه */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    نام سامانه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سامانه جامع خدمات الکترونیک"
                    value={editingSystem.systemName || ''}
                    onChange={(e) => setEditingSystem({ ...editingSystem, systemName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تحت اینترنت */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">تحت اینترنت</label>
                  <select
                    value={editingSystem.isInternetFacing || 'خیر'}
                    onChange={(e) => setEditingSystem({ ...editingSystem, isInternetFacing: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.yesNo.map((yn) => (
                      <option key={yn} value={yn}>
                        {yn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* دامنه یا IP */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">دامنه یا IP خارجی</label>
                  <input
                    type="text"
                    placeholder="portal.org.gov.ir"
                    value={editingSystem.domainOrIp || ''}
                    onChange={(e) => setEditingSystem({ ...editingSystem, domainOrIp: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums dir-ltr border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* IP داخلی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">IP داخلی شبکه LAN</label>
                  <input
                    type="text"
                    placeholder="192.168.10.50"
                    value={editingSystem.internalIp || ''}
                    onChange={(e) => setEditingSystem({ ...editingSystem, internalIp: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums dir-ltr border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* سیستم عامل */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">سیستم عامل میزبان</label>
                  <select
                    value={editingSystem.operatingSystem || ''}
                    onChange={(e) => setEditingSystem({ ...editingSystem, operatingSystem: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.operatingSystems.map((os) => (
                      <option key={os} value={os}>
                        {os}
                      </option>
                    ))}
                  </select>
                </div>

                {/* دیتابیس */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">نوع پایگاه داده</label>
                  <select
                    value={editingSystem.databaseType || ''}
                    onChange={(e) => setEditingSystem({ ...editingSystem, databaseType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.dbTypes.map((db) => (
                      <option key={db} value={db}>
                        {db}
                      </option>
                    ))}
                  </select>
                </div>

                {/* شرکت پیمانکار */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">شرکت پیمانکار / سازنده</label>
                  <input
                    type="text"
                    placeholder="مثال: شرکت داده‌پردازی رایان"
                    value={editingSystem.contractor || ''}
                    onChange={(e) => setEditingSystem({ ...editingSystem, contractor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* مسئول سامانه */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">مسئول سامانه (راهبر)</label>
                  <input
                    type="text"
                    placeholder="نام کارشناس یا راهبر"
                    value={editingSystem.systemManager || ''}
                    onChange={(e) => setEditingSystem({ ...editingSystem, systemManager: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* وضعیت بکاپ */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">وضعیت پشتیبان‌گیری</label>
                  <select
                    value={editingSystem.backupStatus || 'بله'}
                    onChange={(e) => setEditingSystem({ ...editingSystem, backupStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.yesNo.map((yn) => (
                      <option key={yn} value={yn}>
                        {yn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* احرازهویت چندمرحلهای */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">احراز هویت دومرحله‌ای (MFA)</label>
                  <select
                    value={editingSystem.mfaEnabled || 'خیر'}
                    onChange={(e) => setEditingSystem({ ...editingSystem, mfaEnabled: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.yesNo.map((yn) => (
                      <option key={yn} value={yn}>
                        {yn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* وضعیت امنیت (وضعیت ۱) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">وضعیت امنیت (وضعیت ۱)</label>
                  <select
                    value={editingSystem.securityStatus || 'خوب'}
                    onChange={(e) => setEditingSystem({ ...editingSystem, securityStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.statuses1.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* توضیحات */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">توضیحات و نیازمندی‌ها</label>
                <textarea
                  rows={2}
                  value={editingSystem.description || ''}
                  onChange={(e) => setEditingSystem({ ...editingSystem, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs"
                >
                  ذخیره سامانه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingSystem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  شناسنامه سامانه: {viewingSystem.systemName}
                </h3>
              </div>
              <button
                onClick={() => setViewingSystem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">سازمان متولی:</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">{viewingSystem.organizationName || 'سازمان مرکزی'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">نوع سامانه:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingSystem.systemType}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">دسترسی اینترنت:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{viewingSystem.isInternetFacing === 'بله' ? 'تحت اینترنت عمومی' : 'شبکه داخلی'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">دامنه یا آدرس:</span>
                <span className="tabular-nums dir-ltr inline-block text-slate-800 dark:text-slate-200">{viewingSystem.domainOrIp || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">وضعیت امنیت:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">سطح امنیت: {viewingSystem.securityStatus}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">MFA و بکاپ:</span>
                <span className="text-slate-800 dark:text-slate-200">MFA: {viewingSystem.mfaEnabled} · بکاپ: {viewingSystem.backupStatus}</span>
              </div>
            </div>

            {viewingSystem.description && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded text-xs">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px] mb-1">توضیحات:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{viewingSystem.description}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingSystem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
