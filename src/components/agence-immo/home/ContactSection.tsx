import { Link } from "react-router-dom";

export default function ContactSection() {
    return (
        <section id="contact" className="py-20 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-gray-50 p-8 md:p-12 rounded-xl border border-gray-100 shadow-lg">

                    <div className="text-center mb-10 space-y-4">
                        <p className="text-gold uppercase tracking-widest font-medium text-sm">Démo réalisée par Nexus Développement</p>
                        <h2 className="text-3xl font-serif font-bold text-black-rich">Vous voulez un site comme celui-ci&nbsp;?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Cette page d'agence immobilière est une démo conçue pour illustrer notre savoir-faire.
                            Demandez votre devis sur-mesure pour donner vie à votre propre projet web.
                        </p>
                    </div>

                    <div className="text-center pt-4">
                        <Link
                            to="/#devis"
                            className="inline-block px-12 py-4 bg-black-rich text-white font-bold hover:bg-gold transition-colors uppercase tracking-widest"
                        >
                            Demander un devis
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
