import { createFileRoute } from "@tanstack/react-router";
import { answerClinicQuestion } from "@/lib/clinic-ai";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function streamAnswer(answer: string) {
  const encoder = new TextEncoder();
  const chunks = answer.match(/.{1,80}(\s|$)/g) ?? [answer];

  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`,
          ),
        );
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      GET: async () => Response.json({ message: "Chat API ready" }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { messages?: ChatMessage[] };
          const messages = Array.isArray(body.messages) ? body.messages : [];
          const lastUserMessage = [...messages]
            .reverse()
            .find((message) => message.role === "user");

          if (!lastUserMessage?.content?.trim()) {
            return Response.json({ error: "Message is required" }, { status: 400 });
          }

          const answer = answerClinicQuestion(lastUserMessage.content);
          return new Response(streamAnswer(answer), {
            headers: {
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Chat failed";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
