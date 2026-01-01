import { Card, CardContent } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingPlan } from "@/data/pricingData";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PricingCardProps {
    plan: PricingPlan;
    categoryId: string;
    isVisible?: boolean;
    index?: number;
}

const PricingCard = ({ plan, categoryId, isVisible = true, index = 0 }: PricingCardProps) => {
    const navigate = useNavigate();

    const scrollToQuote = () => {
        // Navigate with search params without page reload
        navigate({
            hash: '#devis',
            search: `?category=${categoryId}&plan=${encodeURIComponent(plan.name)}`
        });

        // Smooth scroll to the form after a brief delay for state update
        setTimeout(() => {
            const element = document.getElementById('devis');
            element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <Card
            className={`relative overflow-visible border-0 bg-transparent group ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-5"
                }`}
            style={{
                transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1)",
                transitionDelay: `${index * 100}ms`
            }}
        >
            {/* Glass Background Layer with Enhanced Border for Popular */}
            <div className={`absolute inset-0 bg-gray-900/40 backdrop-blur-xl border ${plan.isPopular ? 'border-cyan-500/40' : 'border-white/10'} rounded-2xl transition-all duration-500 group-hover:bg-gray-900/60 ${plan.isPopular ? 'group-hover:border-cyan-400/60' : 'group-hover:border-white/20'}`} />

            {/* Enhanced Glow for Popular Cards */}
            <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-b ${plan.isPopular ? 'from-cyan-500/60 via-blue-500/30 to-transparent' : 'from-white/10 to-transparent'} ${plan.isPopular ? 'opacity-70' : 'opacity-50'} blur-sm group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Extra Glow Ring for Popular */}
            {plan.isPopular && (
                <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            )}

            {/* Badge Populaire - Diagonal Ribbon */}
            {plan.isPopular && (
                <div className="absolute top-0 right-0 z-[150] overflow-hidden w-40 h-40 pointer-events-none isolate">
                    {/* Shadow enhancement - MUST come first in DOM to be behind */}
                    <div className="absolute top-7 -right-7 w-48 bg-gradient-to-r from-cyan-600/50 to-blue-600/50 blur-lg py-1.5 transform rotate-45 h-8 z-0" />

                    {/* Ribbon with text - comes after in DOM but has higher z-index */}
                    <div className="absolute top-7 -right-7 w-48 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 py-1.5 px-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xl transform rotate-45 origin-center relative z-20">
                        <Star className="w-3 h-3 fill-current text-yellow-400 animate-pulse" />
                        <span className="text-yellow-400 font-bold">Populaire</span>
                    </div>
                </div>
            )}

            <CardContent className="p-6 relative z-10 flex flex-col min-h-[600px] h-full">
                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm h-12 line-clamp-2">{plan.description}</p>
                </div>

                {/* Prix */}
                <div className="mb-6">
                    {(() => {
                        // Split price into prefix and amount
                        const priceMatch = plan.price.match(/^(.*?)([\d\s]+€)$/);
                        if (priceMatch && priceMatch[1].trim()) {
                            return (
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-400 font-medium">
                                        {priceMatch[1].trim()}
                                    </span>
                                    <span className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${plan.priceColor} bg-clip-text text-transparent drop-shadow-lg`}>
                                        {priceMatch[2]}
                                    </span>
                                </div>
                            );
                        }
                        // Fallback for simple prices
                        return (
                            <span className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${plan.priceColor} bg-clip-text text-transparent drop-shadow-lg`}>
                                {plan.price}
                            </span>
                        );
                    })()}
                    {plan.additionalInfo && (
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                            {plan.additionalInfo}
                        </p>
                    )}
                </div>

                {/* Séparateur */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                {/* Features - Limited to maintain card height consistency */}
                <ul className="space-y-3 mb-6 flex-1 max-h-[240px] overflow-y-auto scrollbar-thin">
                    {plan.features.slice(0, 7).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${plan.priceColor} p-[1px] bg-opacity-10`}>
                                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-cyan-400" />
                                </div>
                            </div>
                            <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* Button */}
                <Button
                    onClick={scrollToQuote}
                    className={`w-full relative overflow-hidden bg-gradient-to-r ${plan.priceColor} text-white font-bold py-6 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1 group/btn`}
                >
                    <span className="relative z-10">{plan.buttonText || "Commander maintenant"}</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Button>

                {/* Target Audience Footer */}
                {plan.targetAudience && (
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 italic">
                            {plan.targetAudience}
                        </p>
                    </div>
                )}
            </CardContent>

            {/* Interactive Spotlight Effect (Simple CSS hover) */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-white/5 to-transparent blur-2xl" />
        </Card>
    );
};

export default PricingCard;
