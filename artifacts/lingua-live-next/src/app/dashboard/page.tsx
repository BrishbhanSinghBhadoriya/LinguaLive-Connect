
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { LiveDemo } from "@/components/sections/LiveDemo";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic2,
  Languages,
  Clock,
  Zap,
  Shield,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Crown,
  Star,
  TrendingUp,
  History,
  Settings,
  User,
  Users,
  Terminal,
  CreditCard,
  Bell,
  RefreshCw
} from "lucide-react";

type SubscriptionFeatures = {
  translationsPerDay: number;
  languages: number;
  realTime: boolean;
  savedHistory: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  teamMembers: number;
};

const subscriptionFeatures: Record<string, SubscriptionFeatures> = {
  free: {
    translationsPerDay: 10,
    languages: 5,
    realTime: false,
    savedHistory: false,
    prioritySupport: false,
    apiAccess: false,
    teamMembers: 1
  },
  basic: {
    translationsPerDay: 100,
    languages: 15,
    realTime: true,
    savedHistory: true,
    prioritySupport: false,
    apiAccess: false,
    teamMembers: 1
  },
  premium: {
    translationsPerDay: 1000,
    languages: 30,
    realTime: true,
    savedHistory: true,
    prioritySupport: true,
    apiAccess: true,
    teamMembers: 5
  },
  enterprise: {
    translationsPerDay: Infinity,
    languages: 30,
    realTime: true,
    savedHistory: true,
    prioritySupport: true,
    apiAccess: true,
    teamMembers: Infinity
  }
};

type PricingPlan = {
  id: string;
  name: string;
  price: string;
  priceMonthly: number | null;
  features: string[];
};

export default function DashboardPage() {
  const { user, isLoading: authLoading, upgradePlan } = useAuth();
  const { translationsToday, history, isLoading: dataLoading, addTranslation, refreshData } = useAppData();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlan, setSelectedPlan] = useState<string>(user?.subscription || "free");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  const fetchPricingPlans = async () => {
    setPlansLoading(true);
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      if (data.success) {
        setPricingPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch pricing plans:', error);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
    if (user) {
      setSelectedPlan(user.subscription);
    }
    fetchPricingPlans();
  }, [user, authLoading, router]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = subscriptionFeatures[user.subscription];
  const tierNames: Record<string, string> = {
    free: "Free",
    basic: "Basic",
    premium: "Premium",
    enterprise: "Enterprise"
  };

  const tierColors: Record<string, string> = {
    free: "bg-white/10 text-white/70",
    basic: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
    premium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    enterprise: "bg-gradient-to-r from-pink-500 to-red-500 text-white"
  };

  const handleStartTranslating = () => {
    setActiveTab("translate");
  };

  const handleTranslationComplete = (source: string, translated: string) => {
    addTranslation(source, translated, "English", "Hindi");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-white/60">
                Manage your translation experience and subscription
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="border-white/20 hover:bg-white/10"
                onClick={refreshData}
              >
                <RefreshCw className={`w-5 h-5 text-white/70 ${dataLoading ? "animate-spin" : ""}`} />
              </Button>
              <Badge className={tierColors[user.subscription]}>
                {user.subscription === "premium" || user.subscription === "enterprise" ? (
                  <Crown className="w-4 h-4 mr-2" />
                ) : null}
                {tierNames[user.subscription]} Plan
              </Badge>
              <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                <Bell className="w-5 h-5 text-white/70" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
                Overview
              </TabsTrigger>
              <TabsTrigger value="translate" className="data-[state=active]:bg-white/10">
                Translate
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white/10">
                History
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-white/10">
                Billing
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white/10">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-white/60 flex items-center gap-2">
                      <Mic2 className="w-4 h-4" />
                      Translations Today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-white">{translationsToday}</span>
                      <span className="text-white/40 mb-1">
                        / {features.translationsPerDay === Infinity ? "∞" : features.translationsPerDay}
                      </span>
                    </div>
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${Math.min((translationsToday / features.translationsPerDay) * 100, 100)}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-white/60 flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Available Languages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">{features.languages}</span>
                    </div>
                    <p className="text-white/40 mt-2 text-sm">Indian + International</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-white/60 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">
                        1 / {features.teamMembers === Infinity ? "∞" : features.teamMembers}
                      </span>
                    </div>
                    <p className="text-white/40 mt-2 text-sm">
                      {features.teamMembers > 1 ? "Invite your team" : "Upgrade for more"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-white/60 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      This Month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">{translationsToday + 84}</span>
                    </div>
                    <p className="text-green-400 mt-2 text-sm">↑ 12% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Button 
                    className="h-auto py-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 flex-col gap-3"
                    onClick={handleStartTranslating}
                  >
                    <Mic2 className="w-8 h-8" />
                    <span className="text-lg font-semibold">Start Translating</span>
                    <p className="text-sm text-white/70">Open live translation demo</p>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-auto py-8 border-white/20 hover:bg-white/10 flex-col gap-3"
                    onClick={() => setActiveTab("history")}
                  >
                    <History className="w-8 h-8 text-white/70" />
                    <span className="text-lg font-semibold text-white">History</span>
                    <p className="text-sm text-white/50">View your saved translations</p>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-auto py-8 border-white/20 hover:bg-white/10 flex-col gap-3"
                    onClick={() => setActiveTab("billing")}
                  >
                    <CreditCard className="w-8 h-8 text-white/70" />
                    <span className="text-lg font-semibold text-white">Manage Plan</span>
                    <p className="text-sm text-white/50">Upgrade or change subscription</p>
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Your Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Real-time", available: features.realTime, icon: Zap },
                    { name: "Saved History", available: features.savedHistory, icon: Clock },
                    { name: "Priority Support", available: features.prioritySupport, icon: Shield },
                    { name: "API Access", available: features.apiAccess, icon: Terminal }
                  ].map((feature, idx) => (
                    <Card key={idx} className={`bg-white/5 border-white/10 transition-all duration-200 ${!feature.available ? "opacity-75" : ""}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <feature.icon className={`w-8 h-8 ${feature.available ? "text-primary" : "text-white/30"}`} />
                          <div className="flex-1 flex items-center gap-2">
                            <h3 className="text-lg font-medium text-white">{feature.name}</h3>
                            {!feature.available && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                Upgrade
                              </Badge>
                            )}
                          </div>
                          {feature.available ? (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-white/30" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Upgrade Section */}
              {user.subscription !== "enterprise" && (
                <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
                  <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Ready to unlock more features?
                        </h3>
                        <p className="text-white/70">
                          Upgrade your plan to get unlimited translations, priority support, and more.
                        </p>
                      </div>
                      <Button 
                        className="bg-white text-primary hover:bg-white/90 font-semibold"
                        size="lg"
                        onClick={() => setActiveTab("billing")}
                      >
                        View Pricing Plans
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="translate" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-8">
                  <LiveDemo 
                    onTranslationComplete={handleTranslationComplete}
                    maxTranslations={features.translationsPerDay}
                    currentTranslations={translationsToday}
                    maxLanguages={features.languages}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Translation History</CardTitle>
                  <CardDescription>Your recent translations</CardDescription>
                </CardHeader>
                <CardContent>
                  {features.savedHistory ? (
                    <div className="space-y-4">
                      {history.map((item) => (
                        <Card key={item.id} className="bg-white/5 border-white/10">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="text-sm text-white/40">{item.date}</div>
                              <Badge className="bg-white/10 text-white/70">
                                {item.sourceLang} → {item.targetLang}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-white/50 mb-1">Original</p>
                                <p className="text-white">{item.sourceText}</p>
                              </div>
                              <div>
                                <p className="text-sm text-white/50 mb-1">Translated</p>
                                <p className="text-white">{item.translatedText}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">History not available</h3>
                      <p className="text-white/50 mb-4">Upgrade your plan to save translation history</p>
                      <Button onClick={() => setActiveTab("billing")}>
                        Upgrade Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Your Subscription</CardTitle>
                  <CardDescription>Manage your billing and plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{tierNames[user.subscription]} Plan</h4>
                      <p className="text-white/50">Current plan</p>
                    </div>
                    {user.subscription !== "enterprise" && (
                      <Badge className={tierColors[user.subscription]}>
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Available Plans</h4>
                    {plansLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, idx) => (
                          <Card key={idx} className="bg-white/5 border-white/10">
                            <CardContent className="pt-6">
                              <div className="h-6 bg-white/10 rounded mb-2 w-2/3 animate-pulse"></div>
                              <div className="h-8 bg-white/10 rounded mb-4 w-1/2 animate-pulse"></div>
                              <div className="space-y-2 mb-6">
                                {[...Array(3)].map((_, i) => (
                                  <div key={i} className="h-4 bg-white/10 rounded w-full animate-pulse"></div>
                                ))}
                              </div>
                              <div className="h-10 bg-white/10 rounded animate-pulse"></div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pricingPlans.map((plan, idx) => (
                          <Card 
                            key={plan.id} 
                            className={`border-2 transition-all duration-200 cursor-pointer ${
                              selectedPlan === plan.id 
                                ? 'border-primary bg-primary/10 scale-[1.02]' 
                                : 'border-white/10 bg-white/5 hover:border-white/30'
                            }`}
                            onClick={() => setSelectedPlan(plan.id)}
                          >
                            <CardContent className="pt-6">
                              <h5 className="text-xl font-bold text-white mb-2">{plan.name}</h5>
                              <p className="text-2xl font-bold text-white mb-4">
                                {plan.price}{plan.priceMonthly !== null ? "/month" : ""}
                              </p>
                              <ul className="space-y-2 mb-6">
                                {plan.features.map((feat, i) => (
                                  <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    {feat}
                                  </li>
                                ))}
                              </ul>
                              <Button 
                                className="w-full"
                                variant={user.subscription === plan.id ? "default" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (user.subscription !== plan.id) {
                                    setSelectedPlan(plan.id);
                                    if (plan.id !== "free") {
                                      setShowPaymentModal(true);
                                    }
                                  }
                                }}
                              >
                                {user.subscription === plan.id ? "Current Plan" : selectedPlan === plan.id ? "Select Plan" : "Choose"}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Modal */}
              <AnimatePresence>
                {showPaymentModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg relative"
                    >
                      <button 
                        onClick={() => setShowPaymentModal(false)}
                        className="absolute top-4 right-4 text-white/40 hover:text-white"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Upgrade to {tierNames[selectedPlan]}</h3>
                        <p className="text-white/60">Complete your payment to unlock all features</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/60">Selected Plan</span>
                          <span className="text-white font-semibold">{tierNames[selectedPlan]}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Total</span>
                          <span className="text-2xl font-bold text-white">
                            {(() => {
                              const plan = pricingPlans.find(p => p.id === selectedPlan);
                              if (!plan) {
                                return "Loading...";
                              }
                              if (plan.priceMonthly !== null && plan.priceMonthly > 0) {
                                return `${plan.price}/month`;
                              }
                              return plan.price || "Contact us";
                            })()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Expiry Date</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">CVC</label>
                            <input 
                              type="text" 
                              placeholder="123"
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-6"
                        onClick={() => {
                          // Simulate payment success
                          alert(`Payment successful! Upgraded to ${tierNames[selectedPlan]} plan!`);
                          upgradePlan(selectedPlan as any);
                          setShowPaymentModal(false);
                        }}
                      >
                        {selectedPlan === "enterprise" ? "Contact Sales" : "Pay Now"}
                      </Button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Account Settings</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                      <input 
                        type="text" 
                        defaultValue={user.name}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                      <input 
                        type="email" 
                        defaultValue={user.email}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-accent">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
