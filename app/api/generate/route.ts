import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { protein, cutThickness, smokerType, ambientTemp, targetDoneness } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert BBQ and smoker assistant. Provide detailed temperature ramp schedules, stall strategies, wrapping/probe placement tips for low-and-slow BBQ. Format your response with clear sections using markdown. Include specific temperatures (°F), timing estimates, and actionable advice.`,
        },
        {
          role: "user",
          content: `Plan a BBQ cook for ${protein} (${cutThickness} thick) using a ${smokerType} smoker. Ambient temperature is ${ambientTemp}°F. Target doneness: ${targetDoneness}. Provide:\n1. Temperature ramp schedule\n2. Stall strategy\n3. Wrapping recommendations\n4. Probe placement tips\n5. Estimated total cook time`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
