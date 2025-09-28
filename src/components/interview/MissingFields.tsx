import React, { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { ExtractedData } from '../../utils/resumeParser';

interface MissingFieldsProps {
  extractedData: ExtractedData;
  onComplete: (completeData: Required<ExtractedData>) => void;
}

export function MissingFields({ extractedData, onComplete }: MissingFieldsProps) {
  const [formData, setFormData] = useState({
    name: extractedData.name || '',
    email: extractedData.email || '',
    phone: extractedData.phone || ''
  });

  const missingFields = [
    { key: 'name' as keyof ExtractedData, label: 'Full Name', icon: User, required: !extractedData.name },
    { key: 'email' as keyof ExtractedData, label: 'Email Address', icon: Mail, required: !extractedData.email },
    { key: 'phone' as keyof ExtractedData, label: 'Phone Number', icon: Phone, required: !extractedData.phone }
  ].filter(field => field.required);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields.');
      return;
    }
    
    onComplete({
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Ready!</h2>
        <p className="text-gray-600">
          We need a few more details before starting your interview.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {missingFields.map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter your ${label.toLowerCase()}`}
                required
              />
            </div>
          </div>
        ))}

        {/* Show extracted fields as read-only */}
        {extractedData.name && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-green-500" />
              </div>
              <input
                type="text"
                value={extractedData.name}
                readOnly
                className="block w-full pl-10 pr-3 py-2 border border-green-300 bg-green-50 rounded-lg"
              />
            </div>
          </div>
        )}

        {extractedData.email && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-green-500" />
              </div>
              <input
                type="email"
                value={extractedData.email}
                readOnly
                className="block w-full pl-10 pr-3 py-2 border border-green-300 bg-green-50 rounded-lg"
              />
            </div>
          </div>
        )}

        {extractedData.phone && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-green-500" />
              </div>
              <input
                type="tel"
                value={extractedData.phone}
                readOnly
                className="block w-full pl-10 pr-3 py-2 border border-green-300 bg-green-50 rounded-lg"
              />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg">
          Start Interview
        </Button>
      </form>
    </div>
  );
}