export async function generateTest(module: string, mode: string): Promise<any> {
  // Placeholder for AI API call
  try {
    const response = await fetch('/api/generate-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module, mode }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error generating test:', error);
    throw error;
  }
}