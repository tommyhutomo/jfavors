import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

// PUT /api/bundles/:id
// body: { bundleName?, description?, amount?, status? }
export async function PUT(req: Request, { params }: Params) {
  const { id } = params;
  const body = await req.json();
  const { bundleName, description, amount, status } = body;

  if (
    bundleName === undefined &&
    description === undefined &&
    amount === undefined &&
    status === undefined
  ) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }
  if (amount != null && Number(amount) < 0) {
    return NextResponse.json({ error: 'Amount must be >= 0 or null' }, { status: 400 });
  }

  try {
    const updated = await prisma.bundle.update({
      where: { bundleId: id },
      data: {
        ...(bundleName !== undefined ? { bundleName } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(amount !== undefined ? { amount: amount === null ? null : Number(amount) } : {}),
        ...(status ? { status } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Update failed' }, { status: 400 });
  }
}

// DELETE /api/bundles/:id
export async function DELETE(_: Request, { params }: Params) {
  const { id } = params;
  try {
    const deleted = await prisma.bundle.delete({ where: { bundleId: id } });
    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Delete failed' }, { status: 400 });
  }
}