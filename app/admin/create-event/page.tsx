'use client';

import { useSearchParams } from 'next/navigation';
import EventForm from '@/components/EventForm';

export default function CreateEventPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');

  return <EventForm eventId={eventId || undefined} />;
}
