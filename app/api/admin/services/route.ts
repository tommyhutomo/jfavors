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

type SortBy = 'servicesNo' | 'servicesName' | 'status';
type SortOrder = 'asc' | 'desc';

function getPageParams(url: string) {
  const sp = new URL(url).searchParams;

  const page = Math.max(1, Number(sp.get('page') || 1));
  const pageSize = Math.min(100, Math.max(1, Number(sp.get('pageSize') || 10)));

  const q = (sp.get('q') || '').trim();
  const status = normalizeStatus(sp.get('status'));

  const sortByRaw = (sp.get('sortBy') || 'servicesName').trim();
  const sortOrderRaw = (sp.get('sortOrder') || 'asc').trim().toLowerCase();

  const sortBy: SortBy = ['servicesNo', 'servicesName', 'status'].includes(sortByRaw)
    ? (sortByRaw as SortBy)
    : 'servicesName';

  const sortOrder: SortOrder = sortOrderRaw === 'desc' ? 'desc' : 'asc';

  return { page, pageSize, q, status, sortBy, sortOrder };
}

// GET /api/services?q=&status=&page=&pageSize=&sortBy=&sortOrder=
export async function GET(req: Request) {
  const { page, pageSize, q, status, sortBy, sortOrder } = getPageParams(req.url);

  const where: any = {};
  if (q) {
    where.OR = [
      { servicesNo: { contains: q, mode: 'insensitive' } },
      { servicesName: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (status) {
    where.status = status; // Prisma enum value as 'ACTIVE' or 'INACTIVE'
  }

  const [total, data] = await Promise.all([
    prisma.service.count({ where }),
    prisma.service.findMany({
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

// POST /api/services
// body: { servicesNo, servicesName, status: 'active'|'inactive'|'ACTIVE'|'INACTIVE' }
export async function POST(req: Request) {
  const body = await req.json();
  const { servicesNo, servicesName } = body;
  const status: Status | null = normalizeStatus(body?.status ?? null);

  if (!servicesNo || !servicesName || !status) {
    return NextResponse.json(
      { error: 'Missing or invalid fields. Required: servicesNo, servicesName, status (ACTIVE|INACTIVE).' },
      { status: 400 }
    );
  }

  const created = await prisma.service.create({
    data: { servicesNo, servicesName, status }, // status is now 'ACTIVE' | 'INACTIVE'
  });

  return NextResponse.json(created, { status: 201 });
}