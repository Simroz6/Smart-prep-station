import { Link } from 'react-router-dom';

const defaultCategories = [
  {
    _id: '1',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
    count: 156
  },
  {
    _id: '2',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
    count: 234
  },
  {
    _id: '3',
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    count: 89
  },
  {
    _id: '4',
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    count: 167
  },
  {
    _id: '5',
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80',
    count: 78
  },
  {
    _id: '6',
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    count: 312
  },
  {
    _id: '7',
    name: 'Toys',
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80',
    count: 145
  },
  {
    _id: '8',
    name: 'Automotive',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
    count: 67
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
