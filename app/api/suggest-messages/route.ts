import OpenAI from "openai";

export async function POST() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          success: false,
          message: "OpenAI API key not configured",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Create a list of three open-ended and engaging questions formatted as a single string separated by '||'. These questions are for an anonymous social messaging platform.",
        },
      ],
    });

    return Response.json({
      success: true,
      message: response.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Error generating suggested messages:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to generate suggestions",
      },
      { status: 500 }
    );
  }
}