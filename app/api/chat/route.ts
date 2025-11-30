import { StreamingTextResponse } from 'ai';
import { logActivity } from '@/lib/sheets';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();

    // Get model from environment variable with fallback
    const MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

    console.log('Sending request to Ollama with model:', MODEL);

    // Log the prompt (last message)
    const lastMessage = messages[messages.length - 1];
    if (userId && lastMessage.role === 'user') {
      logActivity({
        userId,
        model: MODEL,
        prompt: lastMessage.content,
        response: '(Streaming...)',
      }).catch(e => console.error('Logging error:', e));
    }

    // Manual request to Ollama
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/api';
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error:', response.status, errorText);
      return new Response(`Error from Ollama: ${response.status} - ${errorText}`, { status: 500 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter((line) => line.trim() !== '');

            for (const line of lines) {
              try {
                const json = JSON.parse(line);
                if (json.message && json.message.content) {
                  controller.enqueue(json.message.content);
                }
                if (json.error) {
                  console.error('Ollama stream error:', json.error);
                  controller.enqueue(`\n\n[Error: ${json.error}]`);
                }
                if (json.done) {
                  // Stream finished
                }
              } catch (e) {
                console.error('Error parsing JSON chunk', e);
              }
            }
          }
        } catch (err) {
          console.error('Stream reading error:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Route handler error:', error);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
