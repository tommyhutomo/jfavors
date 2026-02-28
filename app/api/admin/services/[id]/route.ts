import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

// PUT /api/services/:id
// body: { servicesName?, status? }  (PK cannot be changed safely)
export async function PUT(req: Request, { params }: Params) {
  const { id } = params;
  const body = await req.json();
  const { servicesName, status } = body;

  if (!servicesName && !status) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  try {
    const updated = await prisma.service.update({
      where: { servicesNo: id },
      data: {
        ...(servicesName ? { servicesName } : {}),
        ...(status ? { status } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Update failed' }, { status: 400 });
  }
}

// DELETE /api/services/:id
export async function DELETE(_: Request, { params }: Params) {
  const { id } = params;
  try {
    const deleted = await prisma.service.delete({ where: { servicesNo: id } });
    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Delete failed (likely FK constraint)' }, { status: 400 });
  }
}