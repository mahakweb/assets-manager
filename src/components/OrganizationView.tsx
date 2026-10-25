import React, { useState } from 'react';
import {
  Building2,
  Edit2,
  Download,
  Globe,
  Mail,
  Phone,
  Printer,
  MapPin,
  Users,
  Shield,
  Layers,
  HardDrive,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { Organization, ListsData } from '../types';
import { exportSingleTableToExcel } from '../services/excelService';

interface OrganizationViewProps {
  organizations: Organization[];
  lists: ListsData;
  onSaveOrganization: (org: Organization) => void;
  totalAssets: number;
  totalSystems: number;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  organizations,
  lists,
  onSaveOrganization,
  totalAssets,
  totalSystems
}) => {
  const org = organizations[0] || {
    id: 1,
    name: 'سازمان',
    activityField: lists.activityFields[0] || 'سایر دستگاه‌های خدماتی',
    orgLevel: 'ستاد استانی',
    nationalId: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    fax: '',
    email: '',
    website: '',
    employeeCount: 0,
    publicIp: '',
    mainDomain: '',
    description: ''
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Organization>({ ...org });

  const handleOpenEdit = () => {
    setFormData({ ...org });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveOrganization(formData);
    setIsEditModalOpen(false);
  };

  const handleExportExcel = () => {
    const rows = organizations.map((o) => ({
      'ردیف': o.id,
      'نام سازمان': o.name,
      'حوزه فعالیت': o.activityField,
      'سطح / رده سازمانی': o.orgLevel,
      'شناسه ملی': o.nationalId,
      'آدرس': o.address,
      'شهر': o.city,
      'استان': o.province,
      'تلفن': o.phone,
      'فکس': o.fax,
      'ایمیل': o.email,
      'وبسایت': o.website,
      'تعداد کارمندان': o.employeeCount,
      'ip اینترنتی': o.publicIp,
      'دامنه اصلی': o.mainDomain,
      'توضیحات': o.description
    }));
    exportSingleTableToExcel('مشخصات سازمان', rows, 'مشخصات_سازمان.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>{org.province} - {org.city}</span>
                <span aria-hidden="true">·</span>
                <span>شناسه ملی: <strong className="font-mono tabular-nums text-slate-700">{org.nationalId || 'ثبت نشده'}</strong></span>
                <span aria-hidden="true">·</span>
                <span>رده: {org.orgLevel}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">{org.name}</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">{org.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>خروجی اکسل</span>
            </button>
            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>ویرایش مشخصات سازمان</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Column 1: Identity & Scope */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            هویت و رده سازمانی
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">حوزه فعالیت:</span>
              <span className="font-medium text-slate-800">{org.activityField}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">سطح / رده سازمانی:</span>
              <span className="font-medium text-slate-800">{org.orgLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">شناسه ملی ثبت شده:</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">{org.nationalId || '---'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">تعداد کل کارمندان سازمان:</span>
              <span className="font-mono tabular-nums font-semibold text-indigo-700 text-sm">
                {org.employeeCount} نفر
              </span>
            </div>
          </div>
        </div>

        {/* Info Column 2: Network & Digital Infrastructure */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            زیرساخت ارتباطی و اینترنتی
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">دامنه اصلی سازمان:</span>
              <span className="font-mono dir-ltr font-medium text-slate-800 block text-left">
                {org.mainDomain || '---'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">آی پی (IP) اینترنتی ستاد:</span>
              <span className="font-mono dir-ltr font-medium text-slate-800 block text-left">
                {org.publicIp || '---'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">وبسایت رسمی:</span>
              <a
                href={org.website}
                target="_blank"
                rel="noreferrer"
                className="font-mono dir-ltr text-indigo-600 hover:underline block text-left truncate"
              >
                {org.website || '---'}
              </a>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">پوشش سخت‌افزاری و نرم‌افزاری:</span>
              <div className="flex items-center gap-3 mt-1 font-mono tabular-nums text-slate-700">
                <span>{totalAssets} دارایی</span>
                <span aria-hidden="true">·</span>
                <span>{totalSystems} سامانه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Column 3: Contact & Address */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            ارتباطات و آدرس فیزیکی
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">تلفن تماس:</span>
              <span className="font-mono dir-ltr block text-slate-800">{org.phone || '---'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">فکس دبیرخانه:</span>
              <span className="font-mono dir-ltr block text-slate-800">{org.fax || '---'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">ایمیل رسمی:</span>
              <span className="font-mono dir-ltr block text-slate-800">{org.email || '---'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">نشانی پستی:</span>
              <p className="text-slate-700 leading-relaxed mt-0.5">{org.address || '---'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Organization Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">ویرایش مشخصات سازمان (جدول ۲)</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* نام سازمان */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    نام کامل سازمان <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* حوزه فعالیت (FK) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    حوزه فعالیت <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.activityField || ''}
                    onChange={(e) => setFormData({ ...formData, activityField: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">سطح / رده سازمانی</label>
                  <input
                    type="text"
                    placeholder="مثال: ستاد استانی، اداره کل"
                    value={formData.orgLevel || ''}
                    onChange={(e) => setFormData({ ...formData, orgLevel: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* شناسه ملی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">شناسه ملی سازمان</label>
                  <input
                    type="text"
                    value={formData.nationalId || ''}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تعداد کارمندان */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">تعداد کارمندان</label>
                  <input
                    type="number"
                    value={formData.employeeCount || 0}
                    onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* استان */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">استان</label>
                  <input
                    type="text"
                    value={formData.province || ''}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* شهر */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">شهر</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* تلفن */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">تلفن</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* فکس */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">فکس</label>
                  <input
                    type="text"
                    value={formData.fax || ''}
                    onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* ایمیل */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ایمیل رسمی</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* وبسایت */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">وبسایت</label>
                  <input
                    type="text"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* ip اینترنتی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">IP اینترنتی</label>
                  <input
                    type="text"
                    value={formData.publicIp || ''}
                    onChange={(e) => setFormData({ ...formData, publicIp: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* دامنه اصلی */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">دامنه اصلی</label>
                  <input
                    type="text"
                    value={formData.mainDomain || ''}
                    onChange={(e) => setFormData({ ...formData, mainDomain: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono dir-ltr border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* آدرس */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">آدرس پستی</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* توضیحات */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">توضیحات سازمان</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
