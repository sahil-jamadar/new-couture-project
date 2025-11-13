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
    <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Minimal Accent Elements */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Professional Section Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-px bg-gray-300" />
            <div className="mx-4 w-1.5 h-1.5 bg-purple-600 rounded-full" />
            <div className="w-12 h-px bg-gray-300" />
          </div>
          
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="text-3xl">{serviceInfo.icon}</div>
            <Badge className="bg-purple-600 text-white px-4 py-1.5 text-sm font-medium">
              Premium Service
            </Badge>
          </div>
          
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {serviceInfo.title}
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {serviceInfo.description}
          </p>
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

            {/* CTA Button */}
            <Button 
              onClick={onBookService}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Book Appointment
            </Button>
            
            {/* Contact Info */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Phone className="h-4 w-4 text-purple-600" />
                <span className="font-medium">+91 98765 43210</span>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">Available 9 AM - 8 PM</span>
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