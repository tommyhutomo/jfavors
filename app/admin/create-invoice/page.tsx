import InvoiceForm from '@/components/InvoiceForm';

type PageProps = {
  searchParams: { id?: string };
};

export default function CreateInvoicePage({ searchParams }: PageProps) {
  const invoiceId = searchParams.id ?? undefined;
  return <InvoiceForm invoiceId={invoiceId} />;
}

