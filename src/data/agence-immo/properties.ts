export interface Property {
    id: string;
    title: string;
    type: string;
    price: number;
    location: string;
    bedrooms: number;
    surface: number;
    image: string;
    tags?: string[];
}

export const properties: Property[] = [
    {
        id: '1',
        title: 'Chalet de Luxe avec vue Lac',
        type: 'Maison',
        price: 850000,
        location: 'Gérardmer',
        bedrooms: 5,
        surface: 240,
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&fm=webp&fit=crop',
        tags: ['Exclusivité', 'Vue Lac']
    },
    {
        id: '2',
        title: 'Appartement Moderne Centre-Ville',
        type: 'Appartement',
        price: 320000,
        location: 'Gérardmer',
        bedrooms: 2,
        surface: 85,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&fm=webp&fit=crop',
        tags: ['Nouveauté']
    },
    {
        id: '3',
        title: 'Ferme Vosgienne Rénovée',
        type: 'Ferme',
        price: 595000,
        location: 'Xonrupt-Longemer',
        bedrooms: 4,
        surface: 300,
        image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=800&fm=webp&fit=crop',
        tags: ['Coup de Cœur']
    },
    {
        id: '4',
        title: 'Terrain Constructible Panoramique',
        type: 'Terrain',
        price: 150000,
        location: 'Gérardmer',
        bedrooms: 0,
        surface: 1200,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&fm=webp&fit=crop',
        tags: []
    },
];
