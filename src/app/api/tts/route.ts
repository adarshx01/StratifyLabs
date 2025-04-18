export async function GET(req: Request) {
  const url = new URL(req.url);
  const text = url.searchParams.get('text') || '';
  const teacher = url.searchParams.get('teacher') || 'Swara';

  const voice = teacher === 'Swara' ? '1qEiC6qsybMkmnNdVMbK ' : 'zgqefOY5FPQ3bB7OZTVR';

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': 'sk_c1090d2ed061ca30fcb35e7ce22241c136d58c63863abbcb'
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_flash_v2_5",
        voice_settings: {
          stability: 4,
          similarity_boost: 3
        }
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const audioBuffer = await res.arrayBuffer();

    return new Response(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

