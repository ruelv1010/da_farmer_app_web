"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Loader2,
  Leaf,
  TrendingUp,
  Shield,
  Eye,
  Calculator,
  ImageIcon,
  Bug,
} from "lucide-react";

interface AnalysisResult {
  isDamaged: boolean;
  damagePercentage: number;
  damageType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  recommendations: string[];
  confidence: number;
  damagedHills: number;
  totalHills: number;
  detectedPests: string[];
  analysisMethod: "Real AI" | "Mock Analysis";
}

export default function CropHealthAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Now using the properly embedded image
  const sampleImageUrl =
    "https://omnispest.com/wp-content/uploads/2022/05/omnis-pest-control-strategies.jpg";

  // Enhanced mock analysis based on the actual image content (brown beetles on leaves)
  const generateRealisticAnalysis = (): AnalysisResult => {
    // Based on the actual image showing multiple brown beetles on plant leaves
    const totalHills = 52;
    const damagedHills = 34; // High damage due to visible beetle infestation
    const damagePercentage = Math.round((damagedHills / totalHills) * 100); // 65%

    return {
      isDamaged: true,
      damagePercentage,
      damagedHills,
      totalHills,
      damageType: "Severe beetle infestation with leaf damage",
      severity: "High" as const,
      detectedPests: [
        "Brown leaf beetles (multiple specimens)",
        "Adult beetle colonies on leaf surfaces",
        "Feeding damage patterns visible",
        "High population density detected",
      ],
      recommendations: [
        "Apply targeted beetle control insecticide immediately",
        "Use pyrethroid-based treatments for adult beetles",
        "Implement integrated pest management (IPM) strategy",
        "Monitor for egg laying sites on leaf undersides",
        "Consider beneficial predator release (ground beetles)",
        "Remove heavily infested plant material",
        "Schedule follow-up treatment in 7-10 days",
      ],
      confidence: 92,
      analysisMethod: "Mock Analysis" as const,
    };
  };

  const analyzeCrop = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = generateRealisticAnalysis();
      setAnalysisResult(result);
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to analyze crop. Please try again.";
      setError(errorMessage);
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return <Shield className="h-4 w-4" />;
      case "Medium":
        return <AlertTriangle className="h-4 w-4" />;
      case "High":
        return <AlertTriangle className="h-4 w-4" />;
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getDamageColor = (percentage: number) => {
    if (percentage < 20) return "from-emerald-500 to-green-500";
    if (percentage < 40) return "from-yellow-500 to-amber-500";
    if (percentage < 70) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Leaf className="h-10 w-10 text-green-600 animate-bounce" />
              <h1 className="text-4xl font-extrabold text-green-800 tracking-tight drop-shadow-lg">
                Crop Health Analyzer
              </h1>
            </div>
            <p className="text-green-700 text-lg max-w-2xl mx-auto">
              AI-powered crop health analysis with pest detection and damage
              assessment.
            </p>
          </div>

          {/* Analysis Method Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Demo Mode:</strong> This version analyzes the visible
              beetle infestation in the sample image. For real-time AI analysis,
              integrate with OpenAI GPT-4 Vision API or agricultural AI
              services.
            </AlertDescription>
          </Alert>

          {/* Damage Calculation Formula */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                Damage Calculation Formula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-6 border-2 border-blue-200 shadow-inner">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800 mb-2">
                    % Damage = (Number of damaged hills / Total hills observed)
                    × 100
                  </div>
                  <p className="text-blue-600 text-sm">
                    This formula calculates the percentage of crop damage based
                    on field observations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crop Image Analysis Section */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-green-600" />
                </div>
                Crop Image Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="relative overflow-hidden rounded-xl shadow-lg border-4 border-green-200">
                    <img
                      src={sampleImageUrl || "/placeholder.svg"}
                      alt="Crop leaves with brown beetle infestation"
                      className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-red-100 text-red-700 hover:bg-red-200 shadow-md border border-red-200">
                      <Bug className="h-3 w-3 mr-1" />
                      Beetle Infestation Detected
                    </Badge>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <strong>Sample Image:</strong> This image shows brown beetles
                  clustered on plant leaves, demonstrating a clear pest
                  infestation that requires immediate attention.
                </div>
                <Button
                  onClick={analyzeCrop}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Analyzing Beetle Infestation...
                    </>
                  ) : (
                    <>
                      <Bug className="h-5 w-5 mr-3" />
                      Analyze Crop for Pests
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert
              variant="destructive"
              className="shadow-lg animate-in slide-in-from-top-2 duration-300"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
              {/* Analysis Method Badge */}
              <div className="flex justify-center">
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  Analysis Method: {analysisResult.analysisMethod} • Confidence:{" "}
                  {analysisResult.confidence}%
                </Badge>
              </div>

              {/* Status Overview */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-orange-400 to-red-500" />
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-red-100">
                      <Bug className="h-6 w-6 text-red-600 animate-pulse" />
                    </div>
                    Pest Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Main Status */}
                  <div className="text-center py-6">
                    <div className="text-4xl font-bold mb-3 text-red-600 drop-shadow-md">
                      Severe Beetle Infestation
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">
                        Multiple beetles visible on leaf surfaces
                      </span>
                    </div>
                  </div>

                  {/* Detected Pests */}
                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-red-800 flex items-center gap-2">
                          <Bug className="h-5 w-5" />
                          Detected Pest Issues
                        </h4>
                        <div className="grid gap-2">
                          {analysisResult.detectedPests.map((pest, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100"
                            >
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-red-800 font-medium">
                                {pest}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Damage Calculation Display */}
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <h4 className="font-semibold text-blue-800 flex items-center justify-center gap-2">
                          <Calculator className="h-5 w-5" />
                          Damage Calculation
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="text-lg font-mono text-blue-800">
                            {analysisResult.damagePercentage}% = (
                            {analysisResult.damagedHills} /{" "}
                            {analysisResult.totalHills}) × 100
                          </div>
                          <div className="text-sm text-blue-600 mt-2">
                            {analysisResult.damagedHills} damaged hills out of{" "}
                            {analysisResult.totalHills} total hills observed
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Damage Percentage with Gradient */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg text-gray-700">
                        Damage Assessment
                      </span>
                      <span className="font-bold text-2xl text-gray-800">
                        {analysisResult.damagePercentage}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r ${getDamageColor(
                            analysisResult.damagePercentage
                          )} transition-all duration-1000 ease-out shadow-lg`}
                          style={{
                            width: `${analysisResult.damagePercentage}%`,
                          }}
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
                        <p className="text-gray-800 font-medium">
                          {analysisResult.damageType}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Severity Level
                      </h4>
                      <div
                        className={`p-4 rounded-lg border font-semibold flex items-center gap-2 ${getSeverityColor(
                          analysisResult.severity
                        )} shadow-sm`}
                      >
                        {getSeverityIcon(analysisResult.severity)}
                        {analysisResult.severity}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Immediate Treatment Plan
                    </h4>
                    <div className="grid gap-3">
                      {analysisResult.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-gray-700 font-medium leading-relaxed">
                            {rec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-8">
            &copy; {new Date().getFullYear()} Crop Health Analyzer &mdash;
            Beetle Infestation Detection Demo
          </div>
        </div>
      </div>
    </div>
  );
}
