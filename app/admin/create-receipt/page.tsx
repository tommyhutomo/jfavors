import ReceiptForm from '@/components/ReceiptForm';

type PageProps = {
  searchParams: { id?: string };
};

export default function CreateReceiptPage({ searchParams }: PageProps) {
  const receiptId = searchParams.id ?? undefined;
  return <ReceiptForm receiptId={receiptId} />;
}

