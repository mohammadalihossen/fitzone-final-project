import Link from 'next/link';
import { FiInstagram, FiFacebook, FiYoutube, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
       
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          
         
          <div className="col-span-2 flex flex-col items-center md:items-start text-center md:text-left mb-4 md:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black text-sm font-black">💪</div>
              <span className="font-black text-xl text-white">Fit<span className="text-primary">Zone</span></span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted partner for premium fitness equipment. Building stronger bodies and healthier lives since 2020.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiInstagram, FiYoutube, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-border flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-all rounded-sm">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

         
          <div className="text-left">
            <h4 className="font-bold uppercase text-[10px] tracking-[0.2em] text-white mb-5">Shop</h4>
            <ul className="space-y-3">
              {['All Products', 'Dumbbells', 'Barbells', 'Machines', 'Cardio Equipment', 'Accessories'].map(item => (
                <li key={item}>
                  <Link href={`/products?category=${item.toLowerCase().replace(' ', '-')}`} className="text-muted text-sm hover:text-primary transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

         
          <div className="text-left">
            <h4 className="font-bold uppercase text-[10px] tracking-[0.2em] text-white mb-5">Support</h4>
            <ul className="space-y-3">
              {[
                { label: 'Contact Us', href: '/contact' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Shipping Info', href: '/shipping' },
                { label: 'Returns Policy', href: '/returns' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-muted text-sm hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

         
          <div className="text-left">
            <h4 className="font-bold uppercase text-[10px] tracking-[0.2em] text-white mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About FitZone', href: '/about' },
                { label: 'Careers', href: '/careers' },
                { label: 'Blog', href: '/blog' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-muted text-sm hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

     
      <div className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted text-[9px] uppercase tracking-[0.2em] order-2 md:order-1 text-center md:text-left">
            © 2026 FitZone. All rights reserved.
          </p>
          <div className="flex gap-6 order-1 md:order-2">
            <Link href="/terms" className="text-muted text-[9px] hover:text-primary transition-colors uppercase tracking-[0.2em]">Terms</Link>
            <Link href="/privacy" className="text-muted text-[9px] hover:text-primary transition-colors uppercase tracking-[0.2em]">Privacy</Link>
            <Link href="/cookies" className="text-muted text-[9px] hover:text-primary transition-colors uppercase tracking-[0.2em]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
