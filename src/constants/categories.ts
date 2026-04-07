export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name from @expo/vector-icons (Ionicons)
  color: string;
}

export const JOB_CATEGORIES: Category[] = [
  {
    id: 'woodworking',
    name: 'Woodworking',
    description: 'Custom furniture, carpentry, wood carving',
    icon: 'hammer-outline',
    color: '#8B4513',
  },
  {
    id: 'pottery',
    name: 'Pottery & Ceramics',
    description: 'Handmade pottery, ceramic art, clay work',
    icon: 'color-palette-outline',
    color: '#CD853F',
  },
  {
    id: 'jewelry',
    name: 'Jewelry Making',
    description: 'Custom jewelry, beadwork, metalwork',
    icon: 'diamond-outline',
    color: '#FFD700',
  },
  {
    id: 'textiles',
    name: 'Textiles & Weaving',
    description: 'Fabric weaving, textile design, traditional cloth',
    icon: 'shirt-outline',
    color: '#4B0082',
  },
  {
    id: 'leatherwork',
    name: 'Leatherwork',
    description: 'Leather goods, bags, shoes, accessories',
    icon: 'briefcase-outline',
    color: '#654321',
  },
  {
    id: 'metalwork',
    name: 'Metalwork',
    description: 'Metal sculpture, welding, ironwork',
    icon: 'construct-outline',
    color: '#708090',
  },
  {
    id: 'glasswork',
    name: 'Glasswork',
    description: 'Stained glass, glass blowing, glass art',
    icon: 'wine-outline',
    color: '#87CEEB',
  },
  {
    id: 'painting',
    name: 'Painting & Drawing',
    description: 'Canvas art, murals, portraits, illustrations',
    icon: 'brush-outline',
    color: '#FF6347',
  },
  {
    id: 'sculpture',
    name: 'Sculpture',
    description: '3D art, stone carving, modeling',
    icon: 'cube-outline',
    color: '#696969',
  },
  {
    id: 'basketry',
    name: 'Basketry',
    description: 'Basket weaving, wicker work, rattan crafts',
    icon: 'basket-outline',
    color: '#D2691E',
  },
  {
    id: 'candle-making',
    name: 'Candle Making',
    description: 'Handmade candles, wax art, scented candles',
    icon: 'flame-outline',
    color: '#FFA500',
  },
  {
    id: 'soap-making',
    name: 'Soap Making',
    description: 'Handmade soaps, natural cosmetics',
    icon: 'water-outline',
    color: '#98FB98',
  },
  {
    id: 'paper-crafts',
    name: 'Paper Crafts',
    description: 'Origami, paper mache, card making',
    icon: 'document-outline',
    color: '#F0E68C',
  },
  {
    id: 'embroidery',
    name: 'Embroidery',
    description: 'Hand embroidery, cross-stitch, needlework',
    icon: 'flower-outline',
    color: '#FF69B4',
  },
  {
    id: 'knitting',
    name: 'Knitting & Crochet',
    description: 'Knitted items, crochet work, yarn crafts',
    icon: 'grid-outline',
    color: '#DDA0DD',
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Event photography, portraits, product shots',
    icon: 'camera-outline',
    color: '#000000',
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    description: 'Logo design, branding, digital art',
    icon: 'color-fill-outline',
    color: '#FF1493',
  },
  {
    id: 'fashion-design',
    name: 'Fashion Design',
    description: 'Custom clothing, tailoring, fashion accessories',
    icon: 'shirt-outline',
    color: '#9370DB',
  },
  {
    id: 'interior-design',
    name: 'Interior Design',
    description: 'Home decor, space planning, styling',
    icon: 'home-outline',
    color: '#20B2AA',
  },
  {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Event coordination, decoration, management',
    icon: 'calendar-outline',
    color: '#FF4500',
  },
  {
    id: 'catering',
    name: 'Catering',
    description: 'Food catering, baking, meal preparation',
    icon: 'restaurant-outline',
    color: '#FF6347',
  },
  {
    id: 'music',
    name: 'Music & Performance',
    description: 'Live music, DJ services, entertainment',
    icon: 'musical-notes-outline',
    color: '#8A2BE2',
  },
  {
    id: 'beauty',
    name: 'Beauty Services',
    description: 'Makeup, hair styling, beauty treatments',
    icon: 'sparkles-outline',
    color: '#FF1493',
  },
  {
    id: 'repair',
    name: 'Repair Services',
    description: 'Electronics, appliances, general repairs',
    icon: 'build-outline',
    color: '#4682B4',
  },
  {
    id: 'gardening',
    name: 'Gardening & Landscaping',
    description: 'Garden design, plant care, landscaping',
    icon: 'leaf-outline',
    color: '#228B22',
  },
  {
    id: 'other',
    name: 'Other Crafts',
    description: 'Miscellaneous handcrafted services',
    icon: 'ellipsis-horizontal-outline',
    color: '#808080',
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return JOB_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryIcon = (id: string): string => {
  return getCategoryById(id)?.icon || 'help-circle-outline';
};
