import React, { useState, useMemo } from 'react';
import {
  HardDrive,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Copy,
  X,
  Eye,
  SlidersHorizontal,
  Building2
} from 'lucide-react';
import { Asset, ListsData, Organization } from '../types';
import { exportSingleTableToExcel } from '../services/excelService';

interface AssetsViewProps {
  assets: Asset[];
  lists: ListsData;
  organizations: Organization[];
  selectedOrgId: number | 'all';
  onSaveAsset: (asset: Asset) => void;
  onDeleteAsset: (id: number) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({
  assets,
  lists,
  organizations,
  selectedOrgId,
  onSaveAsset,
  onDeleteAsset
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [orgFilter, setOrgFilter] = useState<string>(selectedOrgId !== 'all' ? String(selectedOrgId) : '');
  const [locationFilter, setLocationFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [countyFilter, setCountyFilter] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Partial<Asset> | null>(null);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((ast) => {
      const matchSearch =
        !searchTerm ||
        ast.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ast.propertyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ast.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ast.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ast.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ast.organizationName && ast.organizationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ast.description && ast.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = !typeFilter || ast.assetType === typeFilter;
      const matchOrg = !orgFilter || String(ast.organizationId) === orgFilter || ast.organizationName === orgFilter;
      const matchLoc = !locationFilter || ast.placementLocation === locationFilter;
      const matchHealth = !healthFilter || ast.healthStatus === healthFilter;
      const matchCounty = !countyFilter || ast.county === countyFilter;

      return matchSearch && matchType && matchOrg && matchLoc && matchHealth && matchCounty;
    });
  }, [assets, searchTerm, typeFilter, orgFilter, locationFilter, healthFilter, countyFilter]);

  const handleOpenAdd = () => {
    const nextId = assets.length > 0 ? Math.max(...assets.map((a) => a.id)) + 1 : 1;
    const defaultOrg = organizations[0];
    setEditingAsset({
      id: nextId,
      organizationId: defaultOrg?.id || 1,
      organizationName: defaultOrg?.name || 'سازمان مرکزی',
      assetType: lists.assetTypes[0] || 'سرور',
      brandModel: '',
      propertyCode: `AST-${new Date().getFullYear()}-${String(nextId).padStart(3, '0')}`,
      ipAddress: '',
      macAddress: '',
      geoLocation: lists.geoLocations[0] || 'ستاد استانی',
      placementLocation: lists.placementLocations[0] || 'مرکز داده',
      county: lists.counties[0] || 'شهرستان ۱',
      operatingSystem: lists.operatingSystems[0] || 'Windows Server',
      firmwareVersion: '',
      purchaseDate: '',
      warrantyEndDate: '',
      importanceLevel: 'مهم',
      supportStatus: 'فعال',
      healthStatus: lists.statuses1[0] || 'خوب',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ast: Asset) => {
    setEditingAsset({ ...ast });
    setIsModalOpen(true);
  };

  const handleDuplicate = (ast: Asset) => {
    const nextId = assets.length > 0 ? Math.max(...assets.map((a) => a.id)) + 1 : 1;
    setEditingAsset({
      ...ast,
      id: nextId,
      propertyCode: `AST-${new Date().getFullYear()}-${String(nextId).padStart(3, '0')}`,
      ipAddress: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset || !editingAsset.assetType || !editingAsset.brandModel) return;

    // ensure organizationName is synced with organizationId
    const matchingOrg = organizations.find((o) => o.id === editingAsset.organizationId);
    const finalized: Asset = {
      ...(editingAsset as Asset),
      organizationName: matchingOrg?.name || editingAsset.organizationName || 'سازمان مرکزی'
    };

    onSaveAsset(finalized);
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleExportExcel = () => {
    const rows = filteredAssets.map((ast) => ({
      'ردیف': ast.id,
      'سازمان': ast.organizationName || 'سازمان مرکزی',
      'نوع دارایی': ast.assetType,
      'برند و مدل': ast.brandModel,
      'کد اموال': ast.propertyCode,
      'IP آدرس': ast.ipAddress,
      'آدرس مک': ast.macAddress,
      'محل استقرار': ast.placementLocation,
      'شهرستان': ast.county,
      'سیستم عامل': ast.operatingSystem,
      'نسخه Firmware': ast.firmwareVersion,
      'تاریخ خرید': ast.purchaseDate,
      'تاریخ پایان گارانتی': ast.warrantyEndDate,
      'سطح اهمیت': ast.importanceLevel,
      'وضعیت پشتیبانی': ast.supportStatus,
      'وضعیت سلامت': ast.healthStatus,
      'توضیحات': ast.description
    }));
    exportSingleTableToExcel('لیست تجهیزات یا دارایی‌ها', rows, 'لیست_تجهیزات_سازمان_ها.xlsx');
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو در برند و مدل، سازمان، کد اموال، IP، مک آدرس، توضیحات..."
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
              <span>ثبت تجهیز جدید</span>
            </button>
          </div>
        </div>

        {/* Filter Selectors Bar */}
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

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه انواع دارایی</option>
            {lists.assetTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه محل‌های استقرار</option>
            {lists.placementLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Health Status Filter */}
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه وضعیت‌های فنی</option>
            {lists.statuses1.map((s) => (
              <option key={s} value={s}>
                وضعیت {s}
              </option>
            ))}
          </select>

          {(typeFilter || orgFilter || locationFilter || healthFilter || countyFilter || searchTerm) && (
            <button
              onClick={() => {
                setTypeFilter('');
                setOrgFilter('');
                setLocationFilter('');
                setHealthFilter('');
                setCountyFilter('');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline mr-auto"
            >
              پاک‌کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Main Data Table (Zero Monospace) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            نمایش <strong className="tabular-nums font-bold text-slate-900 dark:text-white">{filteredAssets.length}</strong> مورد از{' '}
            <span className="tabular-nums">{assets.length}</span> تجهیز ثبت شده
          </span>
          <span className="text-slate-400">جدول ۴: لیست تجهیزات یا دارایی‌ها</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-12 text-center">ردیف</th>
                <th className="py-2.5 px-3 font-semibold">سازمان مربوطه</th>
                <th className="py-2.5 px-3 font-semibold">نوع دارایی</th>
                <th className="py-2.5 px-3 font-semibold">برند و مدل</th>
                <th className="py-2.5 px-3 font-semibold">کد اموال</th>
                <th className="py-2.5 px-3 font-semibold">IP آدرس</th>
                <th className="py-2.5 px-3 font-semibold">محل استقرار</th>
                <th className="py-2.5 px-3 font-semibold">سیستم عامل</th>
                <th className="py-2.5 px-3 font-semibold">اهمیت</th>
                <th className="py-2.5 px-3 font-semibold">وضعیت سلامت</th>
                <th className="py-2.5 px-3 font-semibold text-center w-28">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    موردی مطابق با شرایط جستجو یافت نشد
                  </td>
                </tr>
              ) : (
                filteredAssets.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 text-center tabular-nums text-slate-400">
                      {ast.id}
                    </td>
                    <td className="py-2 px-3 font-semibold text-indigo-700 dark:text-indigo-400">
                      <span className="truncate max-w-[140px] block" title={ast.organizationName}>
                        {ast.organizationName || 'سازمان مرکزی'}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">
                      {ast.assetType}
                    </td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {ast.brandModel}
                    </td>
                    <td className="py-2 px-3 tabular-nums text-slate-600 dark:text-slate-400 text-[11px]">
                      {ast.propertyCode || '---'}
                    </td>
                    <td className="py-2 px-3 tabular-nums dir-ltr text-slate-700 dark:text-slate-300">
                      {ast.ipAddress || '---'}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                      <span>{ast.placementLocation}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] block">{ast.county}</span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {ast.operatingSystem}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        ast.importanceLevel === 'حیاتی'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : ast.importanceLevel === 'مهم'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {ast.importanceLevel || 'عادی'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        ast.healthStatus === 'خوب'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : ast.healthStatus === 'متوسط'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : ast.healthStatus === 'ضعیف'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                      }`}>
                        {ast.healthStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingAsset(ast)}
                          title="مشاهده شناسنامه کامل"
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(ast)}
                          title="ویرایش"
                          className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(ast)}
                          title="ایجاد کپی مشابه"
                          className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 rounded"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`آیا از حذف تجهیز «${ast.brandModel}» اطمینان دارید؟`)) {
                              onDeleteAsset(ast.id);
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

      {/* Add / Edit Asset Modal */}
      {isModalOpen && editingAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingAsset.id ? `ویرایش تجهیز (ردیف ${editingAsset.id})` : 'ثبت دارایی و تجهیز جدید'}
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
                {/* انتخاب سازمان مربوطه */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    سازمان مالک تجهیز <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={editingAsset.organizationId || ''}
                    onChange={(e) => {
                      const orgId = Number(e.target.value);
                      const matching = organizations.find((o) => o.id === orgId);
                      setEditingAsset({
                        ...editingAsset,
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

                {/* نوع دارایی (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    نوع دارایی <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={editingAsset.assetType || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, assetType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.assetTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* برند و مدل */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    برند و مدل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: HPE ProLiant DL380 Gen10"
                    value={editingAsset.brandModel || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, brandModel: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* کد اموال */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">کد اموال</label>
                  <input
                    type="text"
                    placeholder="AST-1402-001"
                    value={editingAsset.propertyCode || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, propertyCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* IP آدرس */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">IP آدرس</label>
                  <input
                    type="text"
                    placeholder="192.168.1.100"
                    value={editingAsset.ipAddress || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums dir-ltr border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* آدرس مک */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">آدرس مک (MAC)</label>
                  <input
                    type="text"
                    placeholder="00:1A:2B:3C:4D:5E"
                    value={editingAsset.macAddress || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, macAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums dir-ltr border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* سیستم عامل */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">سیستم عامل</label>
                  <select
                    value={editingAsset.operatingSystem || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, operatingSystem: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.operatingSystems.map((os) => (
                      <option key={os} value={os}>
                        {os}
                      </option>
                    ))}
                  </select>
                </div>

                {/* محل استقرار */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">محل استقرار</label>
                  <select
                    value={editingAsset.placementLocation || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, placementLocation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.placementLocations.map((pl) => (
                      <option key={pl} value={pl}>
                        {pl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* شهرستان */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">شهرستان</label>
                  <select
                    value={editingAsset.county || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, county: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.counties.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* سطح اهمیت */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">سطح اهمیت</label>
                  <select
                    value={editingAsset.importanceLevel || 'عادی'}
                    onChange={(e) => setEditingAsset({ ...editingAsset, importanceLevel: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="حیاتی">حیاتی</option>
                    <option value="مهم">مهم</option>
                    <option value="عادی">عادی</option>
                  </select>
                </div>

                {/* وضعیت سلامت (وضعیت ۱) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">وضعیت سلامت فنی</label>
                  <select
                    value={editingAsset.healthStatus || 'خوب'}
                    onChange={(e) => setEditingAsset({ ...editingAsset, healthStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.statuses1.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* تاریخ خرید */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">تاریخ خرید</label>
                  <input
                    type="text"
                    placeholder="1401/05/20"
                    value={editingAsset.purchaseDate || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* پایان گارانتی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">پایان گارانتی</label>
                  <input
                    type="text"
                    placeholder="1404/05/20"
                    value={editingAsset.warrantyEndDate || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, warrantyEndDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs tabular-nums border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* توضیحات */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">توضیحات و یادداشت فنی</label>
                <textarea
                  rows={2}
                  value={editingAsset.description || ''}
                  onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
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
                  ذخیره اطلاعات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  شناسنامه تجهیز: {viewingAsset.brandModel}
                </h3>
              </div>
              <button
                onClick={() => setViewingAsset(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">سازمان مالک:</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">{viewingAsset.organizationName || 'سازمان مرکزی'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">نوع دارایی:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingAsset.assetType}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">کد اموال:</span>
                <span className="tabular-nums font-medium text-slate-800 dark:text-slate-200">{viewingAsset.propertyCode || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">IP آدرس:</span>
                <span className="tabular-nums dir-ltr inline-block text-slate-800 dark:text-slate-200">{viewingAsset.ipAddress || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">محل استقرار:</span>
                <span className="text-slate-800 dark:text-slate-200">{viewingAsset.placementLocation} ({viewingAsset.county})</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">سیستم عامل:</span>
                <span className="text-slate-800 dark:text-slate-200">{viewingAsset.operatingSystem}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">سطح اهمیت و سلامت:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">اهمیت {viewingAsset.importanceLevel} · سلامت {viewingAsset.healthStatus}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px]">پایان گارانتی:</span>
                <span className="tabular-nums text-slate-800 dark:text-slate-200">{viewingAsset.warrantyEndDate || '---'}</span>
              </div>
            </div>

            {viewingAsset.description && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded text-xs">
                <span className="text-slate-400 dark:text-slate-500 block text-[11px] mb-1">توضیحات:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{viewingAsset.description}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingAsset(null)}
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
