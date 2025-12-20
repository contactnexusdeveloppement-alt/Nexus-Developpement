import { useState, useEffect, useRef } from 'react';
import { Menu, Search, Heart, User, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
    forceSolid?: boolean;
}

export default function Header({ forceSolid = false }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const lastScrollY = useRef(0);

    const handleNavigation = (path: string, hash?: string) => {
        setIsMenuOpen(false);
        if (hash) {
            navigate(`/${hash}`);
            setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            navigate(path);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/properties?city=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const isSolid = forceSolid || isScrolled;

    return (
        <>
            <header
                className={`fixed w-full z-50 transition-all duration-300 ${isSolid ? 'bg-black-rich/95 backdrop-blur-sm py-4 shadow-lg' : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-4 flex justify-between items-center text-white-creamy">
                    {/* Left Actions */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleMenu}
                            className="flex items-center gap-2 hover:text-gold transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                            <span className="hidden md:inline font-medium tracking-wide">MENU</span>
                        </button>
                    </div>

                    {/* Logo */}
                    <Link to="/" className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-center">
                        <span className="text-white-creamy">ENTRE </span>
                        <span className="text-gold">TERRE</span>
                        <span className="text-white-creamy"> ET </span>
                        <span className="text-gold">MER</span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Expandable Search Bar */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="group flex items-center relative"
                        >
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-0 group-hover:w-40 md:group-hover:w-64 focus:w-40 md:focus:w-64 transition-all duration-500 ease-in-out bg-transparent border-b border-transparent group-hover:border-gold focus:border-gold outline-none px-0 group-hover:px-2 focus:px-2 text-white-creamy opacity-0 group-hover:opacity-100 focus:opacity-100"
                            />
                            <button type="submit" className="hover:text-gold transition-colors p-2">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>

                        <button className="hover:text-gold transition-colors relative">
                            <Heart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full text-[8px] flex items-center justify-center text-black-rich font-bold">0</span>
                        </button>
                        <Link to="/login" className="hidden md:flex items-center gap-2 hover:text-gold transition-colors">
                            <User className="w-5 h-5" />
                            <span className="text-sm font-medium">COMPTE</span>
                        </Link>
                        <span className="hidden md:inline text-gold">FR</span>
                    </div>
                </div>
            </header>

            {/* Side Drawer Menu */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[300px] md:w-[400px] bg-black-rich z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col p-8 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex justify-end mb-12">
                    <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-gold transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <nav className="flex flex-col gap-8">
                    {[
                        { path: '/', label: 'Accueil' },
                        { path: '/properties', label: 'Nos Biens' },
                        { path: '/properties?type=buy', label: 'Acheter' },
                        { path: '/properties?type=rent', label: 'Louer' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl md:text-3xl font-serif text-white hover:text-gold transition-all duration-300 hover:translate-x-2 font-bold"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <button onClick={() => handleNavigation('/', '#agency')} className="text-2xl md:text-3xl font-serif text-white hover:text-gold transition-all duration-300 hover:translate-x-2 text-left font-bold">L'Agence</button>
                    <button onClick={() => handleNavigation('/', '#contact')} className="text-2xl md:text-3xl font-serif text-white hover:text-gold transition-all duration-300 hover:translate-x-2 text-left font-bold">Contact</button>
                </nav>

                <div className="mt-auto pt-12 border-t border-white/10 text-gray-400 text-sm">
                    <p className="mb-2">Agence Entre Terre et Mer</p>
                    <p>Gérardmer, Vosges</p>
                </div>
            </div>
        </>
    );
}
