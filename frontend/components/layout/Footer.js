import Link from 'next/link';
import { FiInstagram, FiFacebook, FiYoutube, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black text-sm font-black">💪</div>
              <span className="font-black text-xl text-white">Fit<span className="text-primary">Zone</span></span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Your trusted partner for premium fitness equipment. Building stronger bodies and healthier lives since 2020.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiInstagram, FiYoutube, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-border flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest text-white mb-5">Shop</h4>
            <ul className="space-y-3">
              {['All Products', 'Dumbbells', 'Barbells', 'Machines', 'Cardio Equipment', 'Accessories'].map(item => (
                <li key={item}>
                  <Link href={'/products?category=' + item} className="text-muted text-sm hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest text-white mb-5">Support</h4>
            <ul className="space-y-3">
              {[
                { label: 'Contact Us', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Shipping Info', href: '#' },
                { label: 'Returns Policy', href: '#' },
              ].map(l => (
                <li key={l.label}><Link href={l.href} className="text-muted text-sm hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest text-white mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About FitZone', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map(l => (
                <li key={l.label}><Link href={l.href} className="text-muted text-sm hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-muted text-xs">© 2026 FitZone. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted text-xs hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="text-muted text-xs hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="text-muted text-xs hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
