"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Leaf,
  TrendingUp,
  Shield,
  Eye,
  FileImage,
  Zap,
} from "lucide-react"

interface AnalysisResult {
  isDamaged: boolean
  damagePercentage: number
  damageType: string
  severity: "Low" | "Medium" | "High" | "Critical"
  recommendations: string[]
  confidence: number
}

export default function CropStatus() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if OpenAI API key is available (you'll need to set this)
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ""

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("Image size must be less than 10MB")
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysisResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const analyzeCropWithOpenAI = async (imageBase64: string): Promise<AnalysisResult> => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
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
                type: "image_url",
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error("No response from OpenAI")
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI")
    }

    return JSON.parse(jsonMatch[0])
  }

  const generateMockAnalysis = (): AnalysisResult => {
    const damageTypes = [
      "Pest damage from aphids",
      "Fungal disease (leaf spot)",
      "Nutrient deficiency (nitrogen)",
      "Weather damage from hail",
      "Bacterial infection",
      "Healthy crop",
    ]

    const isDamaged = Math.random() > 0.3
    const damagePercentage = isDamaged ? Math.floor(Math.random() * 70) + 10 : Math.floor(Math.random() * 10)

    return {
      isDamaged,
      damagePercentage,
      damageType: isDamaged ? damageTypes[Math.floor(Math.random() * 5)] : "Healthy crop",
      severity: isDamaged ? (["Low", "Medium", "High"] as const)[Math.floor(Math.random() * 3)] : ("Low" as const),
      recommendations: isDamaged
        ? [
            "Apply appropriate treatment based on damage type",
            "Monitor crop regularly for disease progression",
            "Improve field drainage if needed",
            "Consider soil testing for nutrient levels",
          ].slice(0, Math.floor(Math.random() * 3) + 2)
        : ["Continue current care routine", "Monitor for any changes"],
      confidence: Math.floor(Math.random() * 20) + 80,
    }
  }

  const analyzeCrop = async () => {
    if (!selectedImage || !selectedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      let result: AnalysisResult

      if (OPENAI_API_KEY) {
        // Use real OpenAI API
        console.log("Using OpenAI API for analysis")
        const imageBase64 = await convertImageToBase64(selectedFile)
        result = await analyzeCropWithOpenAI(imageBase64)
      } else {
        // Use mock analysis
        console.log("Using mock analysis (no API key)")
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay
        result = generateMockAnalysis()
      }

      setAnalysisResult(result)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to analyze crop. Please try again."
      setError(errorMessage)
      console.error("Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return <Shield className="h-4 w-4" />
      case "Medium":
        return <AlertTriangle className="h-4 w-4" />
      case "High":
        return <AlertTriangle className="h-4 w-4" />
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getDamageColor = (percentage: number) => {
    if (percentage < 20) return "from-emerald-500 to-green-500"
    if (percentage < 40) return "from-yellow-500 to-amber-500"
    if (percentage < 70) return "from-orange-500 to-red-500"
    return "from-red-500 to-red-600"
  }

  return (
    <div className="space-y-10 max-w-3xl mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-green-600 animate-bounce" />
          <h1 className="text-3xl font-extrabold text-green-800 tracking-tight drop-shadow-lg">
            Crop Health Analyzer
          </h1>
        </div>
        <p className="text-green-700 text-sm md:text-base text-center max-w-xl">
          Upload a photo of your crop to get instant AI-powered health analysis and actionable recommendations.
        </p>
      </div>

      {!OPENAI_API_KEY && (
        <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
          <Zap className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Demo Mode:</strong> Add your OpenAI API key as{" "}
            <code className="bg-blue-100 px-1 rounded">VITE_OPENAI_API_KEY</code> in your{" "}
            <code className="bg-blue-100 px-1 rounded">.env</code> file to enable real AI analysis.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Section */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <Camera className="h-6 w-6 text-green-600" />
            </div>
            Upload Crop Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div
              className="group border-2 border-dashed border-green-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 relative overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xl font-semibold text-green-700 mb-2">Click to upload crop image</p>
                <p className="text-sm text-green-600 mb-4">Supports JPG, PNG, WebP (max 10MB)</p>
                <div className="flex items-center justify-center gap-2 text-xs text-green-500">
                  <FileImage className="h-4 w-4" />
                  <span>High resolution images provide better analysis</span>
                </div>
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {selectedImage && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="relative overflow-hidden rounded-xl shadow-lg border-4 border-green-200">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected crop"
                      className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-white/90 text-green-700 hover:bg-white shadow-md">
                      <Eye className="h-3 w-3 mr-1" />
                      Ready for Analysis
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={analyzeCrop}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Analyzing Crop Health...
                    </>
                  ) : (
                    <>
                      <Leaf className="h-5 w-5 mr-3" />
                      Analyze Crop Health
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="shadow-lg animate-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
          {/* Status Overview */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <div
              className={`h-2 bg-gradient-to-r ${analysisResult.isDamaged ? "from-orange-400 to-red-500" : "from-green-400 to-emerald-500"}`}
            />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className={`p-2 rounded-lg ${analysisResult.isDamaged ? "bg-orange-100" : "bg-green-100"}`}>
                  {analysisResult.isDamaged ? (
                    <AlertTriangle className="h-6 w-6 text-orange-600 animate-pulse" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600 animate-bounce" />
                  )}
                </div>
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Main Status */}
              <div className="text-center py-6">
                <div
                  className={`text-4xl font-bold mb-3 ${analysisResult.isDamaged ? "text-orange-600" : "text-green-600"} drop-shadow-md`}
                >
                  {analysisResult.isDamaged ? "Damage Detected" : "Healthy Crop"}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">Confidence: {analysisResult.confidence}%</span>
                </div>
              </div>

              {/* Damage Percentage with Gradient */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-gray-700">Damage Assessment</span>
                  <span className="font-bold text-2xl text-gray-800">{analysisResult.damagePercentage}%</span>
                </div>
                <div className="relative">
                  <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r ${getDamageColor(analysisResult.damagePercentage)} transition-all duration-1000 ease-out shadow-lg`}
                      style={{ width: `${analysisResult.damagePercentage}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white drop-shadow-lg">
                      {analysisResult.damagePercentage}% Damage
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Damage Type
                  </h4>
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border shadow-sm">
                    <p className="text-gray-800 font-medium">{analysisResult.damageType}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Severity Level
                  </h4>
                  <div
                    className={`p-4 rounded-lg border font-semibold flex items-center gap-2 ${getSeverityColor(analysisResult.severity)} shadow-sm`}
                  >
                    {getSeverityIcon(analysisResult.severity)}
                    {analysisResult.severity}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {analysisResult.recommendations.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
                    <Leaf className="h-212 w-5"  />
                    Recommended Actions
                  </h4>
                  <div className="grid gap-3">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 font-medium leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pt-8">
        &copy; {new Date().getFullYear()} Crop Health Analyzer &mdash; Powered by AI and OpenAI GPT-4o
      </div>
    </div>
  )
}
