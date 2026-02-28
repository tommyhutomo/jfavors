import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

// PUT /api/packages/:id
// body: { servicesNo?, description?, amount?, status? }
export async function PUT(req: Request, { params }: Params) {
  const { id } = params;
  const body = await req.json();
  const { servicesNo, description, amount, status } = body;

  if (
    servicesNo === undefined &&
    description === undefined &&
    amount === undefined &&
    status === undefined
  ) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }
  if (amount != null && Number(amount) < 0) {
    return NextResponse.json({ error: 'Amount must be >= 0' }, { status: 400 });
  }
  if (servicesNo) {
    const svc = await prisma.service.findUnique({ where: { servicesNo } });
    if (!svc) return NextResponse.json({ error: 'servicesNo not found' }, { status: 400 });
  }

  try {
    const updated = await prisma.package.update({
      where: { packageNo: id },
      data: {
        ...(servicesNo ? { servicesNo } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(amount !== undefined ? { amount: Number(amount) } : {}),
        ...(status ? { status } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Update failed' }, { status: 400 });
  }
}

// DELETE /api/packages/:id
export async function DELETE(_: Request, { params }: Params) {
  const { id } = params;
  try {
    const deleted = await prisma.package.delete({ where: { packageNo: id } });
    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Delete failed' }, { status: 400 });
  }
}