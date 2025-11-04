import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Phone, Scissors, Star, Users } from "lucide-react";

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
    <section className="py-12 sm:py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Service Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{serviceInfo.icon}</div>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                  Premium Service
                </Badge>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold bg-gradient-to-r from-purple-900 to-gray-800 bg-clip-text text-transparent">
                {serviceInfo.title}
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {serviceInfo.description}
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-3">
              {serviceInfo.services.map((service, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur rounded-lg border border-purple-100 shadow-sm"
                >
                  <Scissors className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">{service}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button 
              onClick={onBookService}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Calendar className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Book Free Consultation
            </Button>
          </div>

          {/* Right Side - Features Cards */}
          <div className="space-y-4">
            {/* Feature Cards */}
            <div className="grid gap-4">
              {/* Quality Card */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                      <Star className="h-6 w-6 text-white" />
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

              {/* Home Visit Card */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-white" />
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

              {/* Support Card */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
                      <Users className="h-6 w-6 text-white" />
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

            {/* Contact Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <div className="flex items-center justify-center gap-2 text-purple-700">
                <Phone className="h-4 w-4" />
                <span className="font-medium">Call: +91 98765 43210</span>
                <span className="text-purple-500">|</span>
                <span className="text-sm">Free Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};