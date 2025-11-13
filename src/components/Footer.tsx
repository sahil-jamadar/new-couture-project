const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h2 className="font-playfair text-4xl font-bold mb-3 text-white">
              The Coutures
            </h2>
            <p className="text-white/90 text-xl italic tracking-wide">
              "your style, our signature"
            </p>
          </div>
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-px bg-white/30" />
            <div className="mx-4 w-2 h-2 bg-white/50 rounded-full" />
            <div className="w-16 h-px bg-white/30" />
          </div>
          <div className="space-y-2">
            <p className="text-white/80 text-lg">Premium Fabrics & Luxury Apparel</p>
            <p className="text-white/60 text-sm">© 2025 The Coutures. Crafting Excellence Since Today.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
