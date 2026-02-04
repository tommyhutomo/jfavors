import WorkOrderForm from '@/components/WorkOrderForm';

type PageProps = {
  searchParams: { id?: string };
};

export default function CreateEventPage({ searchParams }: PageProps) {
  const woId = searchParams.id ?? undefined;
  return <WorkOrderForm woId={woId} />;
}
