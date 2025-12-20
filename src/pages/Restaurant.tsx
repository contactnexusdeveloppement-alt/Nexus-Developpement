import Navbar from '../components/restaurant/Navbar';
import Hero from '../components/restaurant/Hero';
import Concept from '../components/restaurant/Concept';
import Highlights from '../components/restaurant/Highlights';
import Menu from '../components/restaurant/Menu';
import Reservation from '../components/restaurant/Reservation';
import Gallery from '../components/restaurant/Gallery';
import Footer from '../components/restaurant/Footer';

import '../styles/restaurant/App.css';
import '../styles/restaurant/index.css';

function Restaurant() {
  return (
    <div className="restaurant-page app">
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
