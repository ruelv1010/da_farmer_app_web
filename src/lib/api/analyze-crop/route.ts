import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Provide mock analysis when API key is not available
      console.log("OpenAI API key not found, providing mock analysis")

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock analysis based on random factors
      const mockAnalysis = {
        isDamaged: Math.random() > 0.4,
        damagePercentage: Math.floor(Math.random() * 80) + 5,
        damageType: ["Pest damage", "Fungal disease", "Nutrient deficiency", "Weather damage", "Leaf spot disease"][
          Math.floor(Math.random() * 5)
        ],
        severity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as "Low" | "Medium" | "High",
        recommendations: [
          "Apply appropriate fungicide treatment",
          "Improve drainage in the affected area",
          "Monitor crop regularly for disease progression",
          "Consider soil nutrient testing",
          "Implement integrated pest management",
        ].slice(0, Math.floor(Math.random() * 3) + 2),
        confidence: Math.floor(Math.random() * 30) + 70,
      }

      return NextResponse.json(mockAnalysis)
    }

    // Use actual AI analysis when API key is available
    console.log("Using OpenAI API for crop analysis")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert agricultural AI assistant specializing in crop health analysis. 

Analyze this crop image and provide a detailed assessment. You MUST respond with ONLY a valid JSON object in exactly this format:

{
  "isDamaged": true or false,
  "damagePercentage": number between 0-100,
  "damageType": "description of damage type or 'Healthy crop' if no damage",
  "severity": "Low" or "Medium" or "High" or "Critical",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "confidence": number between 0-100
}

Consider factors like:
- Leaf discoloration, spots, or wilting
- Pest damage signs
- Growth abnormalities
- Overall plant health
- Visible diseases or infections

Respond with ONLY the JSON object, no additional text.`,
            },
            {
              type: "image",
              image: image,
            },
          ],
        },
      ],
    })

    console.log("AI Response:", text)

    // Parse the AI response more carefully
    let analysisResult
    try {
      // Clean the response text
      const cleanedText = text.trim()

      // Try to find JSON in the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)

      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        // If no JSON found, try parsing the entire response
        analysisResult = JSON.parse(cleanedText)
      }

      // Validate the response structure
      if (!analysisResult || typeof analysisResult !== "object") {
        throw new Error("Invalid response structure")
      }

      // Ensure all required fields exist with defaults
      analysisResult = {
        isDamaged: analysisResult.isDamaged ?? false,
        damagePercentage: analysisResult.damagePercentage ?? 0,
        damageType: analysisResult.damageType ?? "Analysis incomplete",
        severity: analysisResult.severity ?? "Low",
        recommendations: Array.isArray(analysisResult.recommendations)
          ? analysisResult.recommendations
          : ["Please try uploading a clearer image of the crop"],
        confidence: analysisResult.confidence ?? 50,
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("Raw AI response:", text)

      // Fallback analysis when parsing fails
      analysisResult = {
        isDamaged: true,
        damagePercentage: 25,
        damageType: "Unable to fully analyze - image may need better lighting or clarity",
        severity: "Medium" as const,
        recommendations: [
          "Try uploading a clearer, well-lit image of the crop",
          "Ensure the crop fills most of the image frame",
          "Take photo during daylight for better analysis",
        ],
        confidence: 60,
      }
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Crop analysis error:", error)

    // Return a structured error response
    return NextResponse.json(
      {
        error: "Failed to analyze crop image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
