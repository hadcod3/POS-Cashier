'use client';

import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CurrentDate() {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    let localized = date.toLocaleDateString('id-ID', options);
    localized = localized.replace(/^\w/, (c) => c.toUpperCase()); // capitalize
    setFormattedDate(localized);
  }, []);

  if (!formattedDate) return null; // avoid mismatch on first render

  return (
    <span className="text-base font-medium flex items-center gap-3">
      <Calendar size={16} />
      {formattedDate}
    </span>
  );
}
