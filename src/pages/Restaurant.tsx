import Navbar from '../components/restaurant/Navbar';
import Hero from '../components/restaurant/Hero';
import Concept from '../components/restaurant/Concept';
import Highlights from '../components/restaurant/Highlights';
import Menu from '../components/restaurant/Menu';
import Reservation from '../components/restaurant/Reservation';
import Gallery from '../components/restaurant/Gallery';
import Footer from '../components/restaurant/Footer';
import SEO from '@/components/SEO';
import { breadcrumbSchema, serviceSchema } from '@/lib/schemas';

import '../styles/restaurant/App.css';
import '../styles/restaurant/index.css';

function Restaurant() {
  return (
    <div className="restaurant-page app">
      <SEO
        title="Démo : Site Web pour Restaurant | Nexus Développement"
        description="Découvrez une démo de site web professionnel pour restaurant : menu en ligne, réservation, galerie, concept. Création sur-mesure par Nexus Développement Élancourt."
        type="website"
        canonical="/restaurant"
        schemas={[
          serviceSchema({
            name: "Création de site web pour restaurant",
            description: "Site vitrine sur-mesure pour restaurant : menu interactif, formulaire de réservation, galerie photos, mise en avant du concept et des plats signature. Optimisé mobile et SEO local.",
            url: "/restaurant",
            serviceType: "Web Development for Restaurants",
            areaServed: ["Yvelines", "Île-de-France", "France"],
          }),
          breadcrumbSchema([
            { name: "Accueil", url: "/" },
            { name: "Démos clients", url: "/catalogue" },
            { name: "Restaurant", url: "/restaurant" },
          ]),
        ]}
      />
      <Navbar />
      <main>
        <Hero />
        <Concept />
        <Highlights />
        <Menu />
        <Reservation />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}

export default Restaurant;
