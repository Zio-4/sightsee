import { Check, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect } from "react"
import axios from "axios"

const creditPackages = [
  {
    name: "Starter Pack",
    credits: '150',
    price: "$9.99",
    description: "Perfect for a single trip",
    features: [
      "1 AI-generated itinerary",
      "Basic customization options",
      "30-day access to itinerary",
      "Email support",
    ],
  },
  {
    name: "Traveler Pack",
    credits: '400',
    price: "$24.99",
    description: "Ideal for multiple trips or longer journeys",
    features: [
      "3 AI-generated itineraries",
      "Advanced customization options",
      "90-day access to itineraries",
      "Priority email support",
      "Ability to collaborate with travel companions",
    ],
  },
  {
    name: "Explorer Pack",
    credits: '1200',
    price: "$69.99",
    description: "Best value for frequent travelers",
    features: [
      "10 AI-generated itineraries",
      "Premium customization options",
      "Unlimited access to itineraries",
      "24/7 priority support",
      "Ability to collaborate with travel companions",
      "Offline access to itineraries",
      "Exclusive travel tips and recommendations",
    ],
  },
]

export default function PricingPage() {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    // TODO: Add toast notification for success and cancel
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  const handleBuyCredits = (creditSelection: string) => {
    console.log({ creditSelection });
    axios.post('/api/stripe/checkoutSessions', { creditSelection });
  }


  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Choose Your Credit Package</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Purchase credits to generate AI-powered travel itineraries
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {creditPackages.map((pack) => (
          <Card key={pack.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{pack.name}</CardTitle>
              <CardDescription>{pack.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-4xl font-bold mb-4">{pack.price}</p>
              <p className="text-lg font-semibold mb-4">{pack.credits.toLocaleString()} Credits</p>
              <ul className="space-y-2">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleBuyCredits(pack.credits)} className="w-full">Buy Credits</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do credits work?</AccordionTrigger>
            <AccordionContent>
              Credits are used to generate AI-powered travel itineraries. 1000 credits are required to create one itinerary. You can purchase credits in packages, and they don't expire.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I buy more credits if I run out?</AccordionTrigger>
            <AccordionContent>
              Yes, you can purchase additional credit packages at any time. Your new credits will be added to your existing balance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do credits expire?</AccordionTrigger>
            <AccordionContent>
              No, your purchased credits do not expire. You can use them whenever you're ready to plan your next trip.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept all major credit cards, PayPal, and Apple Pay for credit package purchases.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Can I get a refund for unused credits?</AccordionTrigger>
            <AccordionContent>
              We do not offer refunds for unused credits. However, since credits don't expire, you can use them for future trips at any time.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
