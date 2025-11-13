import { Collection } from "@/lib/collectionService";
import { CollectionCard } from "@/components/CollectionCard";
import { Badge } from "@/components/ui/badge";

interface CollectionsSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  collections: Collection[];
}

const CATEGORIES = ["Shirt Fabrics", "Trouser Fabrics", "Indo-Western"] as const;

export const CollectionsSection = ({ id, title, subtitle, collections }: CollectionsSectionProps) => {
  // Display up to 8 collections
  const displayCollections = collections.slice(0, 8);

  // Group collections by category
  const groupedCollections = CATEGORIES.map(category => ({
    category,
    collections: displayCollections.filter(c => c.category === category)
  })).filter(group => group.collections.length > 0);

  return (
    <section id={id} className="py-8 sm:py-10 lg:py-12 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title and View All Button */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          
          {displayCollections.length > 0 && (
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-600 rounded-lg transition-all duration-200">
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Collections Grid Grouped by Category */}
        {displayCollections.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Collections Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Our curated collections are being prepared. Check back soon for premium fabric selections.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedCollections.map((group, groupIndex) => (
              <div key={group.category} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <h3 className="font-playfair text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                    {group.category}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                  <Badge variant="secondary" className="text-xs">
                    {group.collections.length} {group.collections.length === 1 ? 'Collection' : 'Collections'}
                  </Badge>
                </div>
                
                {/* Collections Grid for this Category */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6">
                  {group.collections.map((collection, index) => (
                    <div
                      key={collection.id}
                      className="opacity-0 animate-fade-in"
                      style={{ 
                        animationDelay: `${(groupIndex * 4 + index) * 0.08}s`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      <CollectionCard collection={collection} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
