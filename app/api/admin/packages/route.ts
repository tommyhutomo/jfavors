import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Local status type matching your Prisma enum values
type Status = 'ACTIVE' | 'INACTIVE';

// Normalize incoming status (query/body) to Prisma enum values
function normalizeStatus(input: string | null | undefined): Status | null {
  if (!input) return null;
  const v = String(input).trim().toUpperCase();
  if (v === 'ACTIVE') return 'ACTIVE';
  if (v === 'INACTIVE') return 'INACTIVE';
  return null;
}

type SortBy = 'packageNo' | 'servicesNo' | 'amount' | 'status';
type SortOrder = 'asc' | 'desc';

function getPageParams(url: string) {
  const sp = new URL(url).searchParams;

  const page = Math.max(1, Number(sp.get('page') || 1));
  const pageSize = Math.min(100, Math.max(1, Number(sp.get('pageSize') || 10)));

  const q = (sp.get('q') || '').trim();
  const status = normalizeStatus(sp.get('status'));
  const serviceNo = (sp.get('service') || '').trim();

  const sortByRaw = (sp.get('sortBy') || 'packageNo').trim();
  const sortOrderRaw = (sp.get('sortOrder') || 'asc').trim().toLowerCase();

  const allowedSortBy: SortBy[] = ['packageNo', 'servicesNo', 'amount', 'status'];
  const sortBy: SortBy = allowedSortBy.includes(sortByRaw as SortBy)
    ? (sortByRaw as SortBy)
    : 'packageNo';

  const sortOrder: SortOrder = sortOrderRaw === 'desc' ? 'desc' : 'asc';

  return { page, pageSize, q, status, serviceNo, sortBy, sortOrder };
}

// GET /api/packages?q=&status=&service=&page=&pageSize=&sortBy=&sortOrder=
export async function GET(req: Request) {
  const { page, pageSize, q, status, serviceNo, sortBy, sortOrder } = getPageParams(req.url);

  const where: any = {};
  if (q) {
    where.OR = [
      { packageNo: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;          // 'ACTIVE' | 'INACTIVE'
  if (serviceNo) where.servicesNo = serviceNo;

  const [total, data] = await Promise.all([
    prisma.package.count({ where }),
    prisma.package.findMany({
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

// POST /api/packages
// body: { packageNo, servicesNo, description?, amount, status: 'active'|'inactive'|'ACTIVE'|'INACTIVE' }
export async function POST(req: Request) {
  const body = await req.json();
  const { packageNo, servicesNo, description } = body;

  // Normalize and validate status
  const status: Status | null = normalizeStatus(body?.status);

  // Validate amount: must be a finite number >= 0
  // Accept strings like "12.34" and coerce to number
  const amountNum =
    typeof body?.amount === 'string'
      ? Number(body.amount)
      : typeof body?.amount === 'number'
        ? body.amount
        : NaN;

  if (!packageNo || !servicesNo || !status || !Number.isFinite(amountNum)) {
    return NextResponse.json(
      { error: 'Missing or invalid fields. Required: packageNo, servicesNo, amount (number), status (ACTIVE|INACTIVE).' },
      { status: 400 }
    );
  }

  if (amountNum < 0) {
    return NextResponse.json({ error: 'Amount must be >= 0' }, { status: 400 });
  }

  // Ensure the service exists
  const svc = await prisma.service.findUnique({ where: { servicesNo } });
  if (!svc) {
    return NextResponse.json({ error: 'servicesNo not found' }, { status: 400 });
  }

  const created = await prisma.package.create({
    data: {
      packageNo,
      servicesNo,
      description: description || null,
      amount: amountNum,
      status, // 'ACTIVE' | 'INACTIVE'
    },
  });

  return NextResponse.json(created, { status: 201 });
}