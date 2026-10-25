import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Eye,
  Globe,
  Mail,
  Phone,
  HardDrive,
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Printer,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Organization, ListsData, Asset, SystemItem, Employee, FullDatabase } from '../types';
import { exportSingleTableToExcel, exportSingleOrganizationDossier } from '../services/excelService';

interface OrganizationViewProps {
  db: FullDatabase;
  onSaveOrganization: (org: Organization) => void;
  onDeleteOrganization: (id: number) => void;
  selectedOrgId: number | 'all';
  onSelectOrg: (id: number | 'all') => void;
  isDarkMode?: boolean;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  db,
  onSaveOrganization,
  onDeleteOrganization,
  selectedOrgId,
  onSelectOrg
}) => {
  const { organizations, assets, systems, employees, lists } = db;

  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [viewingOrgId, setViewingOrgId] = useState<number | null>(
    selectedOrgId !== 'all' ? selectedOrgId : null
  );

  // Edit / Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Partial<Organization> | null>(null);

  // Filtered Organizations
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchSearch =
        !searchTerm ||
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.nationalId.includes(searchTerm) ||
        (org.city && org.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (org.mainDomain && org.mainDomain.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (org.publicIp && org.publicIp.includes(searchTerm)) ||
        (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchActivity = !activityFilter || org.activityField === activityFilter;
      return matchSearch && matchActivity;
    });
  }, [organizations, searchTerm, activityFilter]);

  // Selected Organization Details
  const activeDetailOrg = organizations.find((o) => o.id === viewingOrgId);
  const activeOrgAssets = activeDetailOrg
    ? assets.filter((a) => a.organizationId === activeDetailOrg.id || a.organizationName === activeDetailOrg.name)
    : [];
  const activeOrgSystems = activeDetailOrg
    ? systems.filter((s) => s.organizationId === activeDetailOrg.id || s.organizationName === activeDetailOrg.name)
    : [];
  const activeOrgEmployees = activeDetailOrg
    ? employees.filter((e) => e.organizationId === activeDetailOrg.id || e.organizationName === activeDetailOrg.name)
    : [];

  const handleOpenAdd = () => {
    const nextId = organizations.length > 0 ? Math.max(...organizations.map((o) => o.id)) + 1 : 1;
    setEditingOrg({
      id: nextId,
      name: '',
      activityField: lists.activityFields[0] || 'سایر دستگاه‌های خدماتی',
      orgLevel: 'ستاد استانی',
      nationalId: '',
      address: '',
      city: 'مرکز استان',
      province: 'استان',
      phone: '',
      fax: '',
      email: '',
      website: '',
      employeeCount: 0,
      publicIp: '',
      mainDomain: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (org: Organization) => {
    setEditingOrg({ ...org });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg || !editingOrg.name) return;

    onSaveOrganization(editingOrg as Organization);
    setIsModalOpen(false);
    setEditingOrg(null);
  };

  const handleExportOrgDossier = (org: Organization) => {
    exportSingleOrganizationDossier(org, db);
  };

  const handleExportAllOrgsExcel = () => {
    const rows = filteredOrgs.map((o) => ({
      'ردیف': o.id,
      'نام سازمان': o.name,
      'حوزه فعالیت': o.activityField,
      'سطح / رده سازمانی': o.orgLevel,
      'شناسه ملی': o.nationalId,
      'شهر': o.city,
      'استان': o.province,
      'تلفن': o.phone,
      'فکس': o.fax,
      'ایمیل': o.email,
      'وبسایت': o.website,
      'تعداد کارمندان': o.employeeCount,
      'IP اینترنتی': o.publicIp,
      'دامنه اصلی': o.mainDomain,
      'تعداد تجهیزات ثبت شده': assets.filter((a) => a.organizationId === o.id || a.organizationName === o.name).length,
      'تعداد سامانه‌ها': systems.filter((s) => s.organizationId === o.id || s.organizationName === o.name).length,
      'توضیحات': o.description
    }));
    exportSingleTableToExcel('لیست سازمان‌ها', rows, 'لیست_کامل_سازمان_ها.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* 360° Explorer Active Organization Banner (if an org is selected for deep dive) */}
      {activeDetailOrg && (
        <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">شناسنامه ۳۶۰ درجه سازمان</span>
                  <span aria-hidden="true">·</span>
                  <span>حوزه: {activeDetailOrg.activityField}</span>
                  <span aria-hidden="true">·</span>
                  <span>شناسه ملی: <strong className="tabular-nums text-slate-700 dark:text-slate-300">{activeDetailOrg.nationalId || '---'}</strong></span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeDetailOrg.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                  {activeDetailOrg.description || 'بدون توضیحات تکمیلی'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  onSelectOrg(activeDetailOrg.id);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-md transition-colors"
                title="فیلتر کردن کل سیستم روی این سازمان"
              >
                انتخاب به عنوان سازمان فعال
              </button>

              <button
                onClick={() => handleExportOrgDossier(activeDetailOrg)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
                title="دانلود فایل اکسل کامل اختصاصی شامل تمام دارایی‌ها و سامانه‌های این سازمان"
              >
                <Download className="w-3.5 h-3.5" />
                <span>خروجی اکسل ۴ شیت سازمان</span>
              </button>

              <button
                onClick={() => handleOpenEdit(activeDetailOrg)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>ویرایش</span>
              </button>

              <button
                onClick={() => setViewingOrgId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
                title="بستن نمای جزئیات"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Org Key Metrics Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">تجهیزات و دارایی‌ها:</span>
              <span className="text-base font-bold tabular-nums text-slate-800 dark:text-slate-100">
                {activeOrgAssets.length} قلم
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">سامانه‌ها و سرویس‌ها:</span>
              <span className="text-base font-bold tabular-nums text-slate-800 dark:text-slate-100">
                {activeOrgSystems.length} سامانه
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">پرسنل ثبت‌شده:</span>
              <span className="text-base font-bold tabular-nums text-slate-800 dark:text-slate-100">
                {activeOrgEmployees.length} کارشناس
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">دامنه و IP اینترنتی:</span>
              <span className="text-xs font-semibold tabular-nums text-indigo-600 dark:text-indigo-400 block truncate">
                {activeDetailOrg.mainDomain || activeDetailOrg.publicIp || '---'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو در بین ۷۰+ سازمان (نام، شناسه ملی، شهر، دامنه، IP، حوزه فعالیت...)"
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
              onClick={handleExportAllOrgsExcel}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>خروجی اکسل سازمان‌ها</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت سازمان جدید</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1 text-slate-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>حوزه فعالیت:</span>
          </div>

          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه حوزه‌ها ({lists.activityFields.length})</option>
            {lists.activityFields.map((f) => (
              <option key={f} value={f}>
                حوزه {f}
              </option>
            ))}
          </select>

          {(activityFilter || searchTerm) && (
            <button
              onClick={() => {
                setActivityFilter('');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline mr-auto"
            >
              پاک‌کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Organizations Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrgs.map((org) => {
          const orgAssetCount = assets.filter(
            (a) => a.organizationId === org.id || a.organizationName === org.name
          ).length;
          const orgSystemCount = systems.filter(
            (s) => s.organizationId === org.id || s.organizationName === org.name
          ).length;
          const isSelectedActive = selectedOrgId === org.id;

          return (
            <div
              key={org.id}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-5 space-y-4 hover:shadow-md transition-all duration-200 relative ${
                isSelectedActive
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>{org.province} - {org.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{org.activityField}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {org.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                  {org.orgLevel || 'رده استانی'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">تجهیزات:</span>
                  <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                    {orgAssetCount} دستگاه
                  </span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">سامانه‌ها:</span>
                  <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                    {orgSystemCount} سامانه
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>شناسه ملی:</span>
                  <span className="tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                    {org.nationalId || '---'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>دامنه اصلی:</span>
                  <span className="tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[150px]">
                    {org.mainDomain || org.publicIp || '---'}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                <button
                  onClick={() => setViewingOrgId(org.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>مشاهده شناسنامه ۳۶۰°</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleExportOrgDossier(org)}
                    title="دانلود اکسل پرونده سازمان"
                    className="p-1.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(org)}
                    title="ویرایش مشخصات"
                    className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`آیا از حذف سازمان «${org.name}» اطمینان دارید؟`)) {
                        onDeleteOrganization(org.id);
                      }
                    }}
                    title="حذف سازمان"
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Organization Modal */}
      {isModalOpen && editingOrg && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingOrg.id ? `ویرایش اطلاعات سازمان (کد ${editingOrg.id})` : 'ثبت سازمان جدید'}
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
                {/* نام سازمان */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    نام کامل سازمان <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شرکت آب منطقه‌ای استان"
                    value={editingOrg.name || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* حوزه فعالیت */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    حوزه فعالیت <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingOrg.activityField || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, activityField: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.activityFields.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* سطح / رده سازمانی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">سطح / رده سازمانی</label>
                  <input
                    type="text"
                    placeholder="ستاد استانی، اداره کل، فرمانداری"
                    value={editingOrg.orgLevel || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, orgLevel: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* شناسه ملی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">شناسه ملی سازمان</label>
                  <input
                    type="text"
                    placeholder="1400xxxxxxx"
                    value={editingOrg.nationalId || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, nationalId: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تعداد کارمندان */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">تعداد کارمندان</label>
                  <input
                    type="number"
                    value={editingOrg.employeeCount || 0}
                    onChange={(e) => setEditingOrg({ ...editingOrg, employeeCount: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs tabular-nums border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* استان */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">استان</label>
                  <input
                    type="text"
                    value={editingOrg.province || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, province: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* شهر */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">شهر</label>
                  <input
                    type="text"
                    value={editingOrg.city || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تلفن */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">تلفن ستاد</label>
                  <input
                    type="text"
                    value={editingOrg.phone || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* ایمیل */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">ایمیل رسمی</label>
                  <input
                    type="email"
                    value={editingOrg.email || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* وبسایت */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">وبسایت</label>
                  <input
                    type="text"
                    value={editingOrg.website || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, website: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* IP اینترنتی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">IP اینترنتی ستاد</label>
                  <input
                    type="text"
                    value={editingOrg.publicIp || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, publicIp: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* دامنه اصلی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">دامنه اصلی سازمان</label>
                  <input
                    type="text"
                    value={editingOrg.mainDomain || ''}
                    onChange={(e) => setEditingOrg({ ...editingOrg, mainDomain: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* آدرس */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">آدرس فیزیکی</label>
                <input
                  type="text"
                  value={editingOrg.address || ''}
                  onChange={(e) => setEditingOrg({ ...editingOrg, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* توضیحات */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">توضیحات و رسالت سازمان</label>
                <textarea
                  rows={2}
                  value={editingOrg.description || ''}
                  onChange={(e) => setEditingOrg({ ...editingOrg, description: e.target.value })}
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
                  ذخیره اطلاعات سازمان
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
