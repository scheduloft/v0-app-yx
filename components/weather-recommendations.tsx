import { Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeatherRecommendationsProps {
  recommendations: string[]
}

export default function WeatherRecommendations({ recommendations }: WeatherRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
          Weather Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="text-sm flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
