import { useNavigate } from "react-router-dom";
import { Collection } from "@/lib/collectionService";
import { Badge } from "@/components/ui/badge";

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Use slug if available, otherwise use id
    const path = collection.slug || collection.id;
    navigate(`/collection/${path}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl bg-white border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {collection.thumbnail ? (
          <img
            src={collection.thumbnail}
            alt={collection.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge at top */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-0 px-3 py-1 text-xs font-semibold shadow-md">
            Collection
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-playfair text-lg sm:text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {collection.description}
          </p>
        )}
        
        {/* View Collection Link */}
        <div className="mt-3 flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
          <span>Explore</span>
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
