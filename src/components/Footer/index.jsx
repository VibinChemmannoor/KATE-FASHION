import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-kate-dark text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <h2 className="text-4xl font-serif font-bold">KATE</h2>
          <p className="text-gray-300">Modern elegance for the next generation of fashion icons.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Navigation</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Shop All</Link></li>
            <li><Link href="/about">Our Story</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Social Media</h4>
          <ul className="space-y-4 text-gray-400">
            <li>Instagram</li>
            <li>Pinterest</li>
            <li>TikTok</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Address</h4>
          <p className="text-gray-400 leading-relaxed">
            123 Fashion Ave,<br />
            New York, NY 10001<br />
            contact@katefashion.com
          </p>
        </div>
      </div>
      <div className="mt-20 pt-10 border-t border-white/10 text-center text-sm text-gray-500">
        © 2026 KATE Luxury Childrenwear. All rights reserved.
      </div>
    </footer>
  );
}