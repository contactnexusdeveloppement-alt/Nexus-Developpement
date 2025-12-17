import { useState, useRef } from "react";
import { pricingData } from "@/data/pricingData";
import PricingCard from "@/components/PricingCard";
import { motion, AnimatePresence } from "framer-motion";

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState("sites");
  const activePlans = pricingData.find(cat => cat.id === activeCategory)?.plans || [];

  const scrollToQuote = () => {
    const element = document.getElementById('devis');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="tarifs" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Nos Tarifs
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Des solutions adaptées à chaque étape de votre croissance. <br />Choisissez votre catégorie de service :
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16 px-4">
          <div className="flex flex-nowrap gap-4 md:gap-8 overflow-x-auto max-w-full pb-4 scrollbar-none snap-x snap-mandatory mask-gradient" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {pricingData.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative px-2 py-2 text-sm md:text-base font-medium transition-colors duration-300 flex-shrink-0 snap-center ${activeCategory === category.id
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xl transition-transform duration-300 ${activeCategory === category.id ? "scale-110" : "group-hover:scale-110"}`}>{category.icon}</span>
                  {category.label}
                </div>

                {/* Active Indicator (Bottom Glow) */}
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Hover Glow (Subtle) */}
                <div className="absolute inset-x-0 -bottom-1 h-[1px] bg-white_20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {activePlans.map((plan, index) => (
                <PricingCard
                  key={`${activeCategory}-${index}`}
                  plan={plan}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="inline-block p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/5 backdrop-blur-sm">
            <p className="text-gray-300 mb-4">
              Un besoin spécifique qui ne rentre pas dans ces cases ?
            </p>
            <button
              onClick={scrollToQuote}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors flex items-center gap-2 mx-auto"
            >
              Demandez un devis sur-mesure gratuit
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

