import React, { useState, useEffect } from 'react';
import { Permit } from '../types/permit';
import { X, Loader2 } from 'lucide-react';
import { getMonthsDiff, getRemarks } from '../utils/dateUtils';

interface PermitModalProps {
  isOpen: boolean;
  permit: Permit | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (data: Omit<Permit, 'id' | 'permit_id'>) => void | Promise<void>;
}

export const PermitModal: React.FC<PermitModalProps> = ({
  isOpen,
  permit,
  isSaving = false,
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
      alert('Please fill in at least the Company Name or Permit Title');
      return;
    }

    const calculatedRemarks = getRemarks(getMonthsDiff(expiry));
    const finalRemarks = remarks.trim() ? remarks : calculatedRemarks;

    onSave({
      plant: plant.trim(),
      environmental_law: environmentalLaw.trim(),
      description: description.trim(),
      permit: permitTitle.trim(),
      unit_coverage: unitCoverage.trim(),
      permit_no: permitNo.trim(),
      date_issued: dateIssued,
      expiry,
      remarks: finalRemarks,
      remarksAuto: remarks.trim() === '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-xl w-full p-4 sm:p-6 transition-all duration-200 relative animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            {permit ? 'Edit Permit Details' : 'Add New Permit'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Company Name *
              </label>
              <input
                type="text"
                required
                disabled={isSaving}
                value={plant}
                onChange={(e) => setPlant(e.target.value)}
                placeholder="e.g. Batangas Power Corp"
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Permit Title *
              </label>
              <input
                type="text"
                required
                disabled={isSaving}
                value={permitTitle}
                onChange={(e) => setPermitTitle(e.target.value)}
                placeholder="e.g. Permit to Operate"
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Environmental Law
              </label>
              <input
                type="text"
                disabled={isSaving}
                value={environmentalLaw}
                onChange={(e) => setEnvironmentalLaw(e.target.value)}
                placeholder="e.g. Philippine Clean Water Act"
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Permit No.
              </label>
              <input
                type="text"
                disabled={isSaving}
                value={permitNo}
                onChange={(e) => setPermitNo(e.target.value)}
                placeholder="e.g. XX-123-45-67890"
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground font-mono focus:ring-1 focus:ring-ring focus:border-primary outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Description
              </label>
              <input
                type="text"
                disabled={isSaving}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. WasteWater Discharge Permit"
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Unit / Coverage
              </label>
              <input
                type="text"
                disabled={isSaving}
                value={unitCoverage}
                onChange={(e) => setUnitCoverage(e.target.value)}
                placeholder="e.g. Oil Water Separator"
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Date Issued
              </label>
              <input
                type="date"
                disabled={isSaving}
                value={dateIssued}
                onChange={(e) => setDateIssued(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Expiry Date
              </label>
              <input
                type="date"
                disabled={isSaving}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              Remarks
            </label>
            <textarea
              rows={2}
              disabled={isSaving}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., Pending for approval"
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none resize-none disabled:opacity-60"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-input rounded-md hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{permit ? 'Update Permit' : 'Save Permit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
