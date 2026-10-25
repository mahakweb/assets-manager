import React, { useState, useMemo } from 'react';
import {
  HardDrive,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Copy,
  X,
  Check,
  Eye,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Asset, ListsData } from '../types';
import { exportSingleTableToExcel } from '../services/excelService';

interface AssetsViewProps {
  assets: Asset[];
  lists: ListsData;
  onSaveAsset: (asset: Asset) => void;
  onDeleteAsset: (id: number) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({
  assets,
  lists,
  onSaveAsset,
  onDeleteAsset
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');
  const [countyFilter, setCountyFilter] = useState('');

  // Modal State
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
        (ast.description && ast.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = !typeFilter || ast.assetType === typeFilter;
      const matchLoc = !locationFilter || ast.placementLocation === locationFilter;
      const matchHealth = !healthFilter || ast.healthStatus === healthFilter;
      const matchCounty = !countyFilter || ast.county === countyFilter;

      return matchSearch && matchType && matchLoc && matchHealth && matchCounty;
    });
  }, [assets, searchTerm, typeFilter, locationFilter, healthFilter, countyFilter]);

  const handleOpenAdd = () => {
    const nextId = assets.length > 0 ? Math.max(...assets.map((a) => a.id)) + 1 : 1;
    setEditingAsset({
      id: nextId,
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

    onSaveAsset(editingAsset as Asset);
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleExportExcel = () => {
    const rows = filteredAssets.map((ast) => ({
      'ردیف': ast.id,
      'نوع دارایی': ast.assetType,
      'برند و مدل': ast.brandModel,
      'کد اموال': ast.propertyCode,
      'ip آدرس': ast.ipAddress,
      'آدرس مک': ast.macAddress,
      'محل جغرافیایی استقرار تجهیزات': ast.geoLocation,
      'محل استقرار': ast.placementLocation,
      'شهرستان': ast.county,
      'سیستم عامل': ast.operatingSystem,
      'نسخه Firmware': ast.firmwareVersion,
      'تاریخ خرید': ast.purchaseDate,
      'تاریخ پایان گارانتی': ast.warrantyEndDate,
      'سطح اهمیت': ast.importanceLevel,
      'وضعیت پشتیبانی': ast.supportStatus,
      'وضعیت ۱': ast.healthStatus,
      'توضیحات': ast.description
    }));
    exportSingleTableToExcel('لیست تجهیزات یا دارایی‌ها', rows, 'لیست_تجهیزات_سازمان.xlsx');
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو در برند و مدل، کد اموال، IP، مک آدرس، توضیحات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
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
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
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
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1 text-slate-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>فیلترها:</span>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه انواع دارایی ({lists.assetTypes.length})</option>
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
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه وضعیت‌های فنی</option>
            {lists.statuses1.map((s) => (
              <option key={s} value={s}>
                وضعیت {s}
              </option>
            ))}
          </select>

          {/* County Filter */}
          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">همه شهرستان‌ها</option>
            {lists.counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {(typeFilter || locationFilter || healthFilter || countyFilter || searchTerm) && (
            <button
              onClick={() => {
                setTypeFilter('');
                setLocationFilter('');
                setHealthFilter('');
                setCountyFilter('');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 underline underline-offset-2 ml-auto"
            >
              پاک‌کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            نمایش <strong className="font-mono tabular-nums text-slate-900">{filteredAssets.length}</strong> مورد از{' '}
            <span className="font-mono tabular-nums">{assets.length}</span> تجهیز ثبت شده
          </span>
          <span className="text-slate-400">جدول ۴: لیست تجهیزات یا دارایی‌ها</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-12 text-center">ردیف</th>
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
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    موردی مطابق با شرایط جستجو یافت نشد
                  </td>
                </tr>
              ) : (
                filteredAssets.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 text-center font-mono tabular-nums text-slate-400">
                      {ast.id}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {ast.assetType}
                    </td>
                    <td className="py-2 px-3 text-slate-700 font-medium">
                      {ast.brandModel}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                      {ast.propertyCode || '---'}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] dir-ltr text-slate-700">
                      {ast.ipAddress || '---'}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      <span>{ast.placementLocation}</span>
                      <span className="text-slate-400 text-[11px] block">{ast.county}</span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                      {ast.operatingSystem}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        ast.importanceLevel === 'حیاتی'
                          ? 'bg-rose-50 text-rose-700'
                          : ast.importanceLevel === 'مهم'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ast.importanceLevel || 'عادی'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        ast.healthStatus === 'خوب'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ast.healthStatus === 'متوسط'
                          ? 'bg-amber-50 text-amber-700'
                          : ast.healthStatus === 'ضعیف'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ast.healthStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingAsset(ast)}
                          title="مشاهده جزئیات کامل"
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(ast)}
                          title="ویرایش"
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(ast)}
                          title="ایجاد کپی مشابه"
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
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
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingAsset.id ? `ویرایش تجهیز (ردیف ${editingAsset.id})` : 'ثبت دارایی و تجهیز جدید'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* نوع دارایی (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    نوع دارایی <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={editingAsset.assetType || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, assetType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.assetTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* برند و مدل */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    برند و مدل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: HPE ProLiant DL380 Gen10"
                    value={editingAsset.brandModel || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, brandModel: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* کد اموال */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">کد اموال</label>
                  <input
                    type="text"
                    placeholder="مثال: AST-1402-001"
                    value={editingAsset.propertyCode || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, propertyCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* ip آدرس */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">IP آدرس</label>
                  <input
                    type="text"
                    placeholder="192.168.1.100"
                    value={editingAsset.ipAddress || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* آدرس مک */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">آدرس مک (MAC)</label>
                  <input
                    type="text"
                    placeholder="00:1A:2B:3C:4D:5E"
                    value={editingAsset.macAddress || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, macAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* سیستم عامل (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">سیستم عامل</label>
                  <select
                    value={editingAsset.operatingSystem || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, operatingSystem: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.operatingSystems.map((os) => (
                      <option key={os} value={os}>
                        {os}
                      </option>
                    ))}
                  </select>
                </div>

                {/* محل جغرافیایی (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    محل جغرافیایی استقرار تجهیزات
                  </label>
                  <select
                    value={editingAsset.geoLocation || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, geoLocation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.geoLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* محل استقرار (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">محل استقرار</label>
                  <select
                    value={editingAsset.placementLocation || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, placementLocation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.placementLocations.map((pl) => (
                      <option key={pl} value={pl}>
                        {pl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* شهرستان (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">شهرستان</label>
                  <select
                    value={editingAsset.county || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, county: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {lists.counties.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* نسخه Firmware */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">نسخه Firmware</label>
                  <input
                    type="text"
                    placeholder="مثال: v2.4.1"
                    value={editingAsset.firmwareVersion || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, firmwareVersion: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تاریخ خرید */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">تاریخ خرید</label>
                  <input
                    type="text"
                    placeholder="مثال: 1401/05/20"
                    value={editingAsset.purchaseDate || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تاریخ پایان گارانتی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">تاریخ پایان گارانتی</label>
                  <input
                    type="text"
                    placeholder="مثال: 1404/05/20"
                    value={editingAsset.warrantyEndDate || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, warrantyEndDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* سطح اهمیت */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">سطح اهمیت</label>
                  <select
                    value={editingAsset.importanceLevel || 'عادی'}
                    onChange={(e) => setEditingAsset({ ...editingAsset, importanceLevel: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="حیاتی">حیاتی</option>
                    <option value="مهم">مهم</option>
                    <option value="عادی">عادی</option>
                  </select>
                </div>

                {/* وضعیت پشتیبانی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">وضعیت پشتیبانی</label>
                  <select
                    value={editingAsset.supportStatus || 'فعال'}
                    onChange={(e) => setEditingAsset({ ...editingAsset, supportStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="فعال">فعال</option>
                    <option value="منقضی">منقضی</option>
                    <option value="بدون پشتیبانی">بدون پشتیبانی</option>
                  </select>
                </div>

                {/* وضعیت سلامت/فنی (وضعیت ۱) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">وضعیت سلامت (وضعیت ۱)</label>
                  <select
                    value={editingAsset.healthStatus || 'خوب'}
                    onChange={(e) => setEditingAsset({ ...editingAsset, healthStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                <label className="block text-xs font-medium text-slate-700 mb-1">توضیحات و یادداشت فنی</label>
                <textarea
                  rows={2}
                  placeholder="نکات مربوط به نگهداری، رک مربوطه، اسلات یا تعویض قطعات..."
                  value={editingAsset.description || ''}
                  onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  شناسنامه تجهیز: {viewingAsset.brandModel}
                </h3>
              </div>
              <button
                onClick={() => setViewingAsset(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">نوع دارایی:</span>
                <span className="font-semibold text-slate-800">{viewingAsset.assetType}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">کد اموال:</span>
                <span className="font-mono font-medium text-slate-800">{viewingAsset.propertyCode || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">IP آدرس:</span>
                <span className="font-mono dir-ltr inline-block text-slate-800">{viewingAsset.ipAddress || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">مک آدرس:</span>
                <span className="font-mono dir-ltr inline-block text-slate-800">{viewingAsset.macAddress || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">محل جغرافیایی:</span>
                <span className="text-slate-800">{viewingAsset.geoLocation} ({viewingAsset.county})</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">محل استقرار:</span>
                <span className="text-slate-800">{viewingAsset.placementLocation}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">سیستم عامل / Firmware:</span>
                <span className="text-slate-800">{viewingAsset.operatingSystem} {viewingAsset.firmwareVersion ? `(${viewingAsset.firmwareVersion})` : ''}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">سطح اهمیت و سلامت:</span>
                <span className="text-slate-800 font-medium">اهمیت {viewingAsset.importanceLevel} · سلامت {viewingAsset.healthStatus}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">تاریخ خرید و گارانتی:</span>
                <span className="text-slate-800">خرید: {viewingAsset.purchaseDate || '---'} · گارانتی: {viewingAsset.warrantyEndDate || '---'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-400 block text-[11px]">وضعیت پشتیبانی:</span>
                <span className="text-slate-800">{viewingAsset.supportStatus || '---'}</span>
              </div>
            </div>

            {viewingAsset.description && (
              <div className="p-3 bg-slate-50 rounded text-xs">
                <span className="text-slate-400 block text-[11px] mb-1">توضیحات:</span>
                <p className="text-slate-700 leading-relaxed">{viewingAsset.description}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingAsset(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
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
