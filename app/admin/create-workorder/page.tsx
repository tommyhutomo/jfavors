import EventForm from '@/components/EventForm';

type PageProps = {
  searchParams: { id?: string };
};

export default function CreateEventPage({ searchParams }: PageProps) {
  const eventId = searchParams.id ?? undefined;
  return <EventForm eventId={eventId} />;
}

