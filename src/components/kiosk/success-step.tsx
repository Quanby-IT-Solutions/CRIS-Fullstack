// src/components/kiosk/success-step.tsx
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKioskStore } from "@/state/use-kiosk-store"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export function SuccessStep() {
    const { service, userId, email, kioskNumber, resetFlow } = useKioskStore()

    return (
        <Card className="max-w-md w-full p-6 text-center" >
            <CardHeader>
                <CardTitle className="text-xl" > Success! </CardTitle>
            </CardHeader>
            < CardContent className="space-y-4" >
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-lg" >
                    {service === "verify"
                        ? "Your account has been verified successfully!"
                        : "Your certified copy request has been processed!"
                    }
                </p>

                {
                    kioskNumber && (
                        <p className="text-xl font-bold" >
                            Kiosk Number: <span className="text-blue-600" > {kioskNumber} </span>
                        </p>
                    )
                }

                <div className="text-left space-y-1" >
                    {userId && (
                        <p>
                            <strong>User ID: </strong> {userId}
                        </p>
                    )}
                    {
                        email && (
                            <p>
                                <strong>Email: </strong> {email}
                            </p>
                        )
                    }
                </div>
            </CardContent>
            < CardFooter className="flex justify-center space-x-4" >
                <Button onClick={resetFlow}> Done </Button>
            </CardFooter>
        </Card>
    )
}