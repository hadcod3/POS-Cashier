'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CurrentTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // or true for 12-hour
      });
      setTime(timeString);
    };

    updateTime(); // initial set
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval); // cleanup
  }, []);

  if (!time) return null;

  return (
    <span className="text-base font-medium flex items-center gap-3">
      <Clock size={16} />
      {time}
    </span>
  );
}
