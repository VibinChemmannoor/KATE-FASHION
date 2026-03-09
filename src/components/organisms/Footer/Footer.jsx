import Link from 'next/link';
import { Globe, Mail, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#412B1F] text-[#F5F0E6] pt-16 pb-8 border-t border-[#6B4F3B]/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-4 lg:col-span-5">
            <h2 className="text-3xl font-serif font-bold tracking-wider mb-6 text-[#FDFBF7]">KATERI</h2>
            <p className="text-sm md:text-base text-[#F5F0E6]/80 leading-relaxed mb-8 max-w-sm font-sans">
              Sustainability meets style. We're dedicated to creating beautiful, safe, and organic garments for the next generation.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Globe" className="h-10 w-10 rounded-full border border-[#F5F0E6]/30 flex items-center justify-center hover:bg-[#F5F0E6]/10 hover:border-[#F5F0E6]/50 transition-all">
                <Globe size={18} />
              </a>
              <a href="#" aria-label="Email" className="h-10 w-10 rounded-full border border-[#F5F0E6]/30 flex items-center justify-center hover:bg-[#F5F0E6]/10 hover:border-[#F5F0E6]/50 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Collection Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-serif mb-6 text-[#D5A070] font-medium tracking-wide">Collection</h3>
            <ul className="space-y-4 text-sm font-sans text-[#F5F0E6]/80">
              <li><Link href="/collections/new-arrivals" className="hover:text-[#FDFBF7] transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/bestsellers" className="hover:text-[#FDFBF7] transition-colors">Bestsellers</Link></li>
              <li><Link href="/collections/shop-all" className="hover:text-[#FDFBF7] transition-colors">Shop All</Link></li>
              <li><Link href="/gift-cards" className="hover:text-[#FDFBF7] transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-serif mb-6 text-[#D5A070] font-medium tracking-wide">Support</h3>
            <ul className="space-y-4 text-sm font-sans text-[#F5F0E6]/80">
              <li><Link href="/pages/shipping-info" className="hover:text-[#FDFBF7] transition-colors">Shipping Info</Link></li>
              <li><Link href="/pages/returns-exchanges" className="hover:text-[#FDFBF7] transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/pages/care-guide" className="hover:text-[#FDFBF7] transition-colors">Care Guide</Link></li>
              <li><Link href="/contact" className="hover:text-[#FDFBF7] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-lg font-serif mb-6 text-[#D5A070] font-medium tracking-wide">Join the Family</h3>
            <p className="text-sm text-[#F5F0E6]/80 mb-6 font-sans leading-relaxed">
              Sign up for early access to launches and 10% off your first order.
            </p>
            <form className="relative flex items-center border-b border-[#F5F0E6]/30 pb-2 group focus-within:border-[#F5F0E6]/80 transition-colors">
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="w-full bg-transparent outline-none text-sm placeholder:text-[#F5F0E6]/50 px-1 text-[#FDFBF7] font-sans"
              />
              <button 
                type="submit" 
                aria-label="Submit"
                className="text-[#D5A070] hover:text-[#FDFBF7] transition-colors transform group-hover:translate-x-1"
              >
                <ArrowRight size={20} strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F5F0E6]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-[#F5F0E6]/50 tracking-wider">
          <p>© 2024 KATERI ORGANIC. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6">
            <Link href="/pages/privacy" className="hover:text-[#FDFBF7] transition-colors">PRIVACY</Link>
            <Link href="/pages/terms" className="hover:text-[#FDFBF7] transition-colors">TERMS</Link>
            <Link href="/pages/cookies" className="hover:text-[#FDFBF7] transition-colors">COOKIES</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
