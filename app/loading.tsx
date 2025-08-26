import { Card, CardContent } from "@/components/ui/card"
import { Music } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Music className="absolute inset-0 m-auto h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    </div>
  )
}
