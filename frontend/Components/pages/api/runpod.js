// pages/api/runpod.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const apiUrl = `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/run`;
    const apiKey = process.env.RUNPOD_API_KEY;

    // Initial API call to start the job
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
      },
      body: JSON.stringify({
        input: { prompt },
      }),
    });

    if (!response.ok) {
      throw new Error(`RunPod API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const jobId = data.id;

    // Poll for job completion
    let result = null;
    while (!result) {
      const statusResponse = await fetch(`https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/status/${jobId}`, {
        headers: {
          'Authorization': apiKey,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to fetch job status');
      }

      const statusData = await statusResponse.json();
      if (statusData.status === 'COMPLETED') {
        result = statusData.output;
      } else if (statusData.status === 'FAILED' || statusData.status === 'CANCELLED') {
        throw new Error('Image generation failed or was cancelled');
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    res.status(200).json({
      type: 'image',
      src: result.image_url || `data:image/png;base64,${result.base64}`, // Adjust based on RunPod response
      title: prompt,
    });
  } catch (error) {
    console.error('RunPod API error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}