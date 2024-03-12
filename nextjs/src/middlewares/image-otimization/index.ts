import { type NextRequest, NextResponse } from 'next/server'

const sizes = [375, 480, 768, 1024, 1280, 1360, 1440]

export function handleImageRequestMiddleware(request: NextRequest) {
  const quality = request.nextUrl.searchParams.get('q')
  const width = request.nextUrl.searchParams.get('w')

  if (!sizes.includes(Number(width))) {
    return NextResponse.error()
  }

  if (quality !== '85') {
    return NextResponse.error()
  }

  return NextResponse.next()
}
