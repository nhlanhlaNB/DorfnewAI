import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    // Determine which external API to call based on prompt
    let apiUrl;
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('video') || lowerPrompt.includes('movie') || lowerPrompt.includes('clip')) {
      apiUrl = process.env.NEXT_PUBLIC_OPENSORA_API_URL;
    } else if (lowerPrompt.includes('music') || lowerPrompt.includes('song') || lowerPrompt.includes('beat')) {
      apiUrl = process.env.NEXT_PUBLIC_AUDIOLDM_API_URL;
    } else if (lowerPrompt.includes('speak') || lowerPrompt.includes('voice')) {
      apiUrl = process.env.NEXT_PUBLIC_FISHSPEECH_API_URL;
    } else {
      apiUrl = process.env.NEXT_PUBLIC_SD35_API_URL;
    }

    // Forward the request to the appropriate external API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`External API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}