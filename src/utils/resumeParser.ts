export interface ExtractedData {
  name?: string;
  email?: string;
  phone?: string;
}

export function parseResume(_fileName: string, fileContent: string): ExtractedData {
  const extracted: ExtractedData = {};
  
  // Simple regex patterns for extraction (in real app, use proper PDF/DOCX parsing)
  const emailRegex = /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/;
  const nameRegex = /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m;
  
  const emailMatch = fileContent.match(emailRegex);
  if (emailMatch) {
    extracted.email = emailMatch[0];
  }
  
  const phoneMatch = fileContent.match(phoneRegex);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0];
  }
  
  const nameMatch = fileContent.match(nameRegex);
  if (nameMatch) {
    extracted.name = nameMatch[0];
  }
  
  return extracted;
}

export function simulateResumeExtraction(): ExtractedData {
  // Simulate extraction results for demo purposes
  const mockData: ExtractedData[] = [
    { name: 'John Smith', email: 'john.smith@email.com', phone: '+1-555-0123' },
    { name: 'Sarah Johnson', email: 'sarah.j@gmail.com' }, // Missing phone
    { name: 'Mike Chen', phone: '+1-555-0456' }, // Missing email
    { email: 'alex.wong@email.com', phone: '+1-555-0789' }, // Missing name
  ];
  
  return mockData[Math.floor(Math.random() * mockData.length)];
}