import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Local status type matching your Prisma enum values
type Status = 'ACTIVE' | 'INACTIVE';

// Allow both lowercase and uppercase inputs and normalize to enum shape
function normalizeStatus(input: string | null): Status | null {
  if (!input) return null;
  const v = input.trim().toUpperCase();
  if (v === 'ACTIVE') return 'ACTIVE';
  if (v === 'INACTIVE') return 'INACTIVE';
  return null;
}

function getPageParams(url: string) {
  const sp = new URL(url).searchParams;
  const page = Math.max(1, Number(sp.get('page') || 1));
  const pageSize = Math.min(100, Math.max(1, Number(sp.get('pageSize') || 10)));
  const q = (sp.get('q') || '').trim();
  const status = normalizeStatus(sp.get('status'));
  const sortBy = (sp.get('sortBy') || 'bundleName') as 'bundleId' | 'bundleName' | 'amount' | 'status';
  const sortOrder = (sp.get('sortOrder') || 'asc') as 'asc' | 'desc';
  return { page, pageSize, q, status, sortBy, sortOrder };
}

// GET /api/bundles?q=&status=&page=&pageSize=&sortBy=&sortOrder=
export async function GET(req: Request) {
  const { page, pageSize, q, status, sortBy, sortOrder } = getPageParams(req.url);

  const where: any = {};
  if (q) {
    where.OR = [
      { bundleId: { contains: q, mode: 'insensitive' } },
      { bundleName: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;

  const [total, data] = await Promise.all([
    prisma.bundle.count({ where }),
    prisma.bundle.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    data,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}

// POST /api/bundles
// body: { bundleId, bundleName, description?, amount?, status }
export async function POST(req: Request) {
  const body = await req.json();
  const { bundleId, bundleName, description, amount, status } = body;

  if (!bundleId || !bundleName || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (amount != null && Number(amount) < 0) {
    return NextResponse.json({ error: 'Amount must be >= 0 or null' }, { status: 400 });
  }

  const created = await prisma.bundle.create({
    data: { bundleId, bundleName, description, amount: amount ?? null, status },
  });

  return NextResponse.json(created, { status: 201 });
}