import { NextRequest, NextResponse } from 'next/server'

// GET /api/transactions - Fetch all transactions from Google Sheets
export async function GET(request: NextRequest) {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

    if (!appsScriptUrl) {
      return NextResponse.json(
        { error: 'Google Apps Script URL not configured' },
        { status: 400 }
      )
    }

    const response = await fetch(appsScriptUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

    if (!appsScriptUrl) {
      return NextResponse.json(
        { error: 'Google Apps Script URL not configured' },
        { status: 400 }
      )
    }

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createTransaction',
        ...body,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create transaction: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
