import { Instagram, Heart } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-purple-50 border-t border-pink-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Instagram Link */}
          <div className="flex items-center space-x-3 text-center">
            <Instagram className="h-6 w-6 text-pink-500" />
            <div>
              <p className="text-gray-700 font-medium">Заследете не на нашиот Instagram</p>
              <Link 
                href="https://www.instagram.com/spodelimomenti.mk/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 font-semibold text-lg transition-colors duration-200 hover:underline"
              >
                @spodelimomenti.mk
              </Link>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Резервирајте си термин за незаборавни моменти! 💕
            </p>
          </div>
          
          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-pink-300 to-purple-300"></div>
          
          {/* Copyright */}
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span>Направено со</span>
            <Heart className="h-4 w-4 text-red-400 fill-current" />
            <span>за споделување моменти</span>
          </div>
          
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Сподели Моменти. Сите права се резервирани.
          </p>
        </div>
      </div>
    </footer>
  )
}
