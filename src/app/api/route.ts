export const runtime = 'edge';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'ok' });
}

export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic'; 