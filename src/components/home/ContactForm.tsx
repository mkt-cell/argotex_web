'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ContactFormProps {
  dict: any;
}

export const ContactForm: React.FC<ContactFormProps> = ({ dict }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    solution: '',
    scope: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        solution: '',
        scope: '',
      });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {dict.contact.first_name}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {dict.contact.last_name}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {dict.contact.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {dict.contact.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {dict.contact.company}
        </label>
        <input
          type="text"
          id="company"
          name="company"
          required
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white"
        />
      </div>

      {/* Interested Solution */}
      <div>
        <label htmlFor="solution" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {dict.contact.solution}
        </label>
        <select
          id="solution"
          name="solution"
          required
          value={formData.solution}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white cursor-pointer"
        >
          <option value="" disabled>{dict.contact.placeholder_solution}</option>
          {dict.solutions.items.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.title} ({item.subtitle})
            </option>
          ))}
          <option value="other">Other Engineering Consultation / สอบถามอื่นๆ</option>
        </select>
      </div>

      {/* Project Scope / Notes */}
      <div>
        <label htmlFor="scope" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {dict.contact.scope}
        </label>
        <textarea
          id="scope"
          name="scope"
          rows={4}
          value={formData.scope}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal text-slate-800 text-sm bg-white resize-y"
        />
      </div>

      {/* Messages */}
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800 text-sm">
          {dict.contact.success}
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800 text-sm">
          {dict.contact.error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full py-3.5 font-bold shadow-md shadow-medical-teal/10 hover:shadow-lg disabled:opacity-50 cursor-pointer"
        disabled={loading}
      >
        {loading ? 'Processing...' : dict.contact.submit}
      </Button>
    </form>
  );
};
