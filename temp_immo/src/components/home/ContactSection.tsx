export default function ContactSection() {
    return (
        <section id="contact" className="py-20 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-gray-50 p-8 md:p-12 rounded-xl border border-gray-100 shadow-lg">

                    <div className="text-center mb-10 space-y-4">
                        <h2 className="text-gold uppercase tracking-widest font-medium text-sm">Discutons de votre projet</h2>
                        <h3 className="text-3xl font-serif font-bold text-black-rich">Contactez-nous</h3>
                        <p className="text-gray-500">Nous sommes à votre écoute pour réaliser vos rêves immobiliers.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black-rich uppercase tracking-wider">Nom</label>
                                <input type="text" className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black-rich uppercase tracking-wider">Email</label>
                                <input type="email" className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black-rich uppercase tracking-wider">Téléphone</label>
                                <input type="tel" className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black-rich uppercase tracking-wider">Sujet</label>
                                <select className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all appearance-none cursor-pointer">
                                    <option>Je souhaite acheter un bien</option>
                                    <option>Je souhaite vendre mon bien</option>
                                    <option>Demande d'estimation</option>
                                    <option>Autre demande</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black-rich uppercase tracking-wider">Message</label>
                            <textarea rows={5} className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"></textarea>
                        </div>

                        <div className="text-center pt-4">
                            <button
                                type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert("Message envoyé ! (Simulation)");
                                }}
                                className="px-12 py-4 bg-black-rich text-white font-bold hover:bg-gold transition-colors w-full md:w-auto uppercase tracking-widest"
                            >
                                Envoyer le message
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </section>
    );
}
