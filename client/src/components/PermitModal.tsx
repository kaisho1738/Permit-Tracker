import React, { useState, useEffect } from 'react';
import { Permit } from '../types/permit';
import { X } from 'lucide-react';
import { getMonthsDiff, getRemarks } from '../utils/dateUtils';

interface PermitModalProps {
  isOpen: boolean;
  permit: Permit | null;
  onClose: () => void;
  onSave: (data: Omit<Permit, 'id' | 'permit_id'>) => void;
}

export const PermitModal: React.FC<PermitModalProps> = ({
  isOpen,
  permit,
  onClose,
  onSave,
}) => {
  const [plant, setPlant] = useState('');
  const [environmentalLaw, setEnvironmentalLaw] = useState('');
  const [description, setDescription] = useState('');
  const [permitTitle, setPermitTitle] = useState('');
  const [unitCoverage, setUnitCoverage] = useState('');
  const [permitNo, setPermitNo] = useState('');
  const [dateIssued, setDateIssued] = useState('');
  const [expiry, setExpiry] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (permit) {
      setPlant(permit.plant || '');
      setEnvironmentalLaw(permit.environmental_law || '');
      setDescription(permit.description || '');
      setPermitTitle(permit.permit || '');
      setUnitCoverage(permit.unit_coverage || '');
      setPermitNo(permit.permit_no || '');
      setDateIssued(permit.date_issued || '');
      setExpiry(permit.expiry || '');
      setRemarks(permit.remarks || '');
    } else {
      setPlant('');
      setEnvironmentalLaw('');
      setDescription('');
      setPermitTitle('');
      setUnitCoverage('');
      setPermitNo('');
      setDateIssued('');
      setExpiry('');
      setRemarks('');
    }
  }, [permit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!plant.trim() && !permitTitle.trim()) {
      alert('Please provide at least a Powerplant Name or Permit title.');
      return;
    }

    const remarksAuto = remarks.trim() === '';
    const computedRemarks =
      remarksAuto && expiry ? getRemarks(getMonthsDiff(expiry)) : remarks.trim();

    onSave({
      plant: plant.trim(),
      environmental_law: environmentalLaw.trim(),
      description: description.trim(),
      permit: permitTitle.trim(),
      unit_coverage: unitCoverage.trim(),
      permit_no: permitNo.trim(),
      date_issued: dateIssued,
      expiry,
      remarks: computedRemarks,
      remarksAuto,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-surface-container border border-gray-200 dark:border-outline-variant rounded-xl shadow-2xl max-w-xl w-full p-6 transition-all duration-200 relative animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-outline-variant mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-on-surface">
            {permit ? 'Edit Permit Details' : 'Add New Permit'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-on-surface hover:bg-gray-100 dark:hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
                Powerplant Name *
              </label>
              <input
                type="text"
                required
                value={plant}
                onChange={(e) => setPlant(e.target.value)}
                placeholder="e.g. Batangas Power Corp"
                className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
                Permit Title *
              </label>
              <input
                type="text"
                required
                value={permitTitle}
                onChange={(e) => setPermitTitle(e.target.value)}
                placeholder="e.g. Permit to Operate"
                className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
                Environmental Law
              </label>
              <input
                type="text"
                value={environmentalLaw}
                onChange={(e) => setEnvironmentalLaw(e.target.value)}
                placeholder="e.g. Philippine Clean Water Act"
                className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
                Permit No.
              </label>
              <input
                type="text"
                value={permitNo}
                onChange={(e) => setPermitNo(e.target.value)}
                placeholder="e.g. XX-123-45-67890"
                className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface font-mono focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. WasteWater Discharge Permit"
                className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
                Unit / Coverage
              </label>
              <input
                type="text"
                value={unitCoverage}
                onChange={(e) => setUnitCoverage(e.target.value)}
                placeholder="e.g. Oil Water Separator"
                className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
                Date Issued
              </label>
              <input
                type="date"
                value={dateIssued}
                onChange={(e) => setDateIssued(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-on-surface mb-1 uppercase tracking-wide">
              Remarks
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional remarks (leave blank to auto-calculate from expiry date)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-outline rounded-md text-sm bg-white dark:bg-surface-container-high text-gray-900 dark:text-on-surface focus:ring-1 focus:ring-brand-500 dark:focus:ring-primary focus:border-brand-500 dark:focus:border-primary outline-none resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-outline-variant mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-on-surface dark:bg-surface-container-high dark:border-outline dark:hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md hover:bg-brand-700 dark:text-on-primary dark:bg-primary dark:hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              {permit ? 'Update Permit' : 'Save Permit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
