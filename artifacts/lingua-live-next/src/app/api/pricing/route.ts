import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate database call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const plans = [
      { 
        id: "free", 
        name: "Free", 
        price: "$0", 
        priceMonthly: 0,
        features: [
          "10 translations/day", 
          "5 languages", 
          "Basic support"
        ] 
      },
      { 
        id: "basic", 
        name: "Basic", 
        price: "$9", 
        priceMonthly: 9,
        features: [
          "100 translations/day", 
          "15 languages", 
          "Real-time", 
          "Email support"
        ] 
      },
      { 
        id: "premium", 
        name: "Premium", 
        price: "$29", 
        priceMonthly: 29,
        features: [
          "1000 translations/day", 
          "All languages", 
          "API access", 
          "Priority support"
        ] 
      },
      { 
        id: "enterprise", 
        name: "Enterprise", 
        price: "Custom", 
        priceMonthly: null,
        features: [
          "Unlimited translations", 
          "Custom", 
          "Priority support", 
          "Custom integrations"
        ] 
      }
    ];

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch pricing plans' },
      { status: 500 }
    );
  }
}
