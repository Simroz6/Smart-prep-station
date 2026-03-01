import { Link } from 'react-router-dom';

const defaultCategories = [
  {
    _id: 'past-papers',
    name: 'Past Papers',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
    count: 0
  },
  {
    _id: 'notes',
    name: 'Notes',
    image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=400&q=80',
    count: 0
  },
  {
    _id: 'slos',
    name: 'SLOs',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80',
    count: 0
  },
  {
    _id: 'bundles',
    name: 'Bundles',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    count: 0
  }
];

export default function CategoryGrid({ categories = defaultCategories, columns = 4 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {categories.map((category) => (
        <Link
          key={category._id}
          to={`/products?category=${category._id}`}
          className="group relative overflow-hidden rounded-xl aspect-square"
        >
          {/* Image */}
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 transform translate-y-0 transition-transform duration-300">
              {category.name}
            </h3>
            <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {category.count || 0} Products
            </p>
          </div>
          
          {/* Border Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 rounded-xl transition-colors duration-300" />
        </Link>
      ))}
    </div>
  );
}
