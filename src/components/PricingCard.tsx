import { Card, CardContent } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingPlan } from "@/data/pricingData";
import { motion } from "framer-motion";

interface PricingCardProps {
    plan: PricingPlan;
    isVisible?: boolean;
    index?: number;
}

const PricingCard = ({ plan, isVisible = true, index = 0 }: PricingCardProps) => {
    const scrollToQuote = () => {
        const element = document.getElementById('devis') || document.getElementById('contact');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Card
            className={`relative overflow-hidden border-0 bg-transparent group ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-5"
                }`}
            style={{
                transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1)",
                transitionDelay: `${index * 100}ms`
            }}
        >
            {/* Glass Background Layer */}
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl transition-colors duration-500 group-hover:bg-gray-900/60 group-hover:border-white/20" />

            {/* Glow Gradient Blob */}
            <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-b ${plan.isPopular ? 'from-cyan-500/50 via-blue-500/20 to-transparent' : 'from-white/10 to-transparent'} opacity-50 blur-sm group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Badge Populaire */}
            {plan.isPopular && (
                <div className="absolute top-0 right-0 z-20 overflow-hidden rounded-tr-2xl rounded-bl-2xl">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-1.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                        <Star className="w-3 h-3 fill-current animate-pulse" />
                        Populaire
                        <div className="absolute inset-0 bg-white/20 skew-x-12 animate-shine" />
                    </div>
                </div>
            )}

            <CardContent className={`p-8 relative z-10 h-full flex flex-col ${plan.isPopular ? 'pt-10' : 'pt-8'}`}>
                {/* Header */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm h-10 line-clamp-2">{plan.description}</p>
                </div>

                {/* Prix */}
                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${plan.priceColor} bg-clip-text text-transparent drop-shadow-lg`}>
                            {plan.price}
                        </span>
                    </div>
                    {plan.additionalInfo && (
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                            {plan.additionalInfo}
                        </p>
                    )}
                </div>

                {/* Séparateur */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
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
