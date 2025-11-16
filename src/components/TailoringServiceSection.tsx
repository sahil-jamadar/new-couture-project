import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Scissors, Star, Users } from "lucide-react";

interface TailoringServiceSectionProps {
  onBookService: () => void;
  category: string;
}

export const TailoringServiceSection = ({ onBookService, category }: TailoringServiceSectionProps) => {
  const getCategorySpecificServices = () => {
    switch (category) {
      case 'cotton':
        return {
          title: "Premium Shirt Tailoring",
          description: "Expert tailoring for cotton shirts, formal wear, and casual styles",
          services: ["Custom Fit Shirts", "Formal Dress Shirts", "Casual Cotton Wear", "Business Attire"],
          icon: "👔"
        };
      case 'trouser':
        return {
          title: "Professional Trouser Tailoring",
          description: "Precision tailoring for formal trousers, casual pants, and business wear",
          services: ["Formal Trousers", "Business Pants", "Casual Wear", "Alterations"],
          icon: "👖"
        };
      case 'ethnic':
        return {
          title: "Traditional & Indo-Western Tailoring",
          description: "Specialized craftsmanship for ethnic wear, sherwanis, and Indo-Western attire",
          services: ["Sherwanis", "Modi Jackets", "Jodhpuri Suits", "Indo-Western Wear"],
          icon: "🥻"
        };
      default:
        return {
          title: "Premium Tailoring Service",
          description: "Expert tailoring for all fabric types and garment styles",
          services: ["Custom Fit", "Alterations", "Premium Styling", "Expert Consultation"],
          icon: "✂️"
        };
    }
  };

  const serviceInfo = getCategorySpecificServices();

  return (
    <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header Section */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4 animate-bounce">
            <span className="text-4xl">👑</span>
          </div>
          
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            PREMIUM TAILORING SERVICE
          </h2>
          
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium text-gray-700">Expert Custom Tailoring</span>
              <span className="text-xl">✨</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-50 px-4 py-2 rounded-full">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-semibold text-purple-900">Perfect Fit Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-pink-50 px-4 py-2 rounded-full">
              <span className="text-lg">❤️</span>
              <span className="text-sm font-semibold text-pink-900">Premium Quality</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Left Side - Services */}
          <div className="space-y-6">
            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-3">
              {serviceInfo.services.map((service, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <Scissors className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{service}</span>
                </div>
              ))}
            </div>

            {/* CTA Button with Enhanced Design */}
            <Button 
              onClick={onBookService}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-6 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>📞 Book Appointment</span>
              </div>
            </Button>
            
            {/* Enhanced Contact Info */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-200 shadow-md">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <span className="text-sm">•</span>
                <span className="text-sm font-semibold text-purple-700">Home Measurements Available</span>
              </div>
            </div>
          </div>

          {/* Right Side - Features Cards */}
          <div className="space-y-4">
            {/* Feature Cards */}
            <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Master Craftsmanship
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      25+ years of experience with precision fitting and premium finishing techniques.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Home Visit Service
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Our expert tailors visit your location for measurements and fittings at your convenience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Dedicated Support
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Personal consultation and aftercare service to ensure perfect fit and satisfaction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};