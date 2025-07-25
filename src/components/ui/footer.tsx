'use client'

import { Heart, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-t border-pink-200/50 mt-auto">
      <div className="container mx-auto px-6 py-8">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left side - Made by XG27 */}
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-pink-500 animate-pulse" />
            <span className="text-gray-600">Изработено со љубов од</span>
            <a 
              href="https://www.instagram.com/kostadinov27_/" // Замени го ова со твојот линк
              target="_blank"
              rel="noopener noreferrer"
              className="font-brittany text-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent hover:from-pink-700 hover:via-rose-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              XG27
            </a>
          </div>

          {/* Right side - Contact info */}
          <div className="flex items-center gap-6">
            <a 
              href="tel:+38977409939"
              className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 hover:bg-pink-50 px-3 py-2 rounded-lg"
            >
              <Phone className="h-4 w-4" />
              <span className="font-medium">077 409 939</span>
            </a>
            
            <a 
              href="mailto:gorgikos27@gmail.com" // Замени го ова со твојот email
              className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 hover:bg-pink-50 px-3 py-2 rounded-lg"
            >
              <Mail className="h-4 w-4" />
              <span className="font-medium">Контакт</span>
            </a>
          </div>
        </div>

        {/* Bottom divider and additional info */}
        <div className="mt-6 pt-6 border-t border-pink-200/30">
          <div className="text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span>© 2025 СподелиМоменти</span>
              <Heart className="h-3 w-3 text-pink-400" />
              <span>Секој момент е важен</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}