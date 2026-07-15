'use client';

import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CatalogDownloadModalProps {
  dict: any;
}

const CATALOG_PDF_PATH = '/downloads/argotex-engineering-catalog.pdf';

export const CatalogDownloadModal: React.FC<CatalogDownloadModalProps> = ({ dict }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = CATALOG_PDF_PATH;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/catalog-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setStatus('success');
      triggerDownload();
      setFormData({ name: '', email: '', company: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setStatus('idle');
  };

  return (
    <>
      <Button
        type="button"
        variant="primary"
        className="whitespace-nowrap font-bold flex gap-2 shadow-lg cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Download className="h-4 w-4" />
        {dict.downloads.button}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold tracking-tight text-slate-800 font-heading mb-1.5 pr-6">
              {dict.downloads.modal_title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {dict.downloads.modal_desc}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="catalog-name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {dict.downloads.name_label}
                </label>
                <input
                  type="text"
                  id="catalog-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white"
                />
              </div>

              <div>
                <label htmlFor="catalog-email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {dict.downloads.email_label}
                </label>
                <input
                  type="email"
                  id="catalog-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white"
                />
              </div>

              <div>
                <label htmlFor="catalog-company" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {dict.downloads.company_label}
                </label>
                <input
                  type="text"
                  id="catalog-company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white"
                />
              </div>

              {status === 'success' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 text-sm">
                  {dict.downloads.success_label}
                </div>
              )}

              {status === 'error' && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-800 text-sm">
                  {dict.downloads.error_label}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 font-bold shadow-md shadow-medical-teal/10 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Processing...' : dict.downloads.submit_label}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
