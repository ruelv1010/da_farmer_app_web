import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert agricultural AI assistant specializing in crop health analysis. 
              
              Analyze this crop image and provide a detailed assessment in the following JSON format:
              {
                "isDamaged": boolean,
                "damagePercentage": number (0-100),
                "damageType": "string describing the type of damage (e.g., 'Pest damage', 'Disease', 'Nutrient deficiency', 'Weather damage', 'Healthy')",
                "severity": "Low" | "Medium" | "High" | "Critical",
                "recommendations": ["array of specific actionable recommendations"],
                "confidence": number (0-100, your confidence in this analysis)
              }
              
              Consider factors like:
              - Leaf discoloration, spots, or wilting
              - Pest damage signs
              - Growth abnormalities
              - Overall plant health
              - Visible diseases or infections
              
              Be precise with damage percentage and provide practical recommendations.`,
            },
            {
              type: "image",
              image: image,
            },
          ],
        },
      ],
    })

    // Parse the AI response
    let analysisResult
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      // Fallback parsing or default response
      analysisResult = {
        isDamaged: false,
        damagePercentage: 0,
        damageType: "Analysis incomplete",
        severity: "Low",
        recommendations: ["Please try uploading a clearer image of the crop"],
        confidence: 50,
      }
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Crop analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze crop image" }, { status: 500 })
  }
}
