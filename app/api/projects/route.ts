import { NextRequest, NextResponse } from 'next/server'

// GET /api/projects - Fetch all projects from Google Sheets
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
      throw new Error(`Failed to fetch projects: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
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
        action: 'createProject',
        ...body,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
