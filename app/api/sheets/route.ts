import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy for Google Apps Script web app.
 * Avoids CORS issues by forwarding requests server-side.
 * Client passes the script URL in the x-script-url header.
 */

export async function GET(req: NextRequest) {
  const scriptUrl = req.headers.get('x-script-url')
  if (!scriptUrl) {
    return NextResponse.json({ error: 'Missing x-script-url header' }, { status: 400 })
  }

  try {
    const res = await fetch(`${scriptUrl}?action=getData`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to reach script: ${String(err)}` },
      { status: 502 }
    )
  }
}

export async function POST(req: NextRequest) {
  const scriptUrl = req.headers.get('x-script-url')
  if (!scriptUrl) {
    return NextResponse.json({ error: 'Missing x-script-url header' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveData', ...body }),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to reach script: ${String(err)}` },
      { status: 502 }
    )
  }
}
