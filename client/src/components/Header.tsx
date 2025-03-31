import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm8-1.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zM12 16c1.94 0 3.5-1.56 3.5-3.5 0-.83-.67-1.5-1.5-1.5h-4c-.83 0-1.5.67-1.5 1.5 0 1.94 1.56 3.5 3.5 3.5z"></path>
          </svg>
          <h1 className="text-lg md:text-xl font-bold">Tech Radar</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-5">
            <Link href="/">
              <a className={location === "/" ? "text-blue-600 font-medium" : "text-slate-600 hover:text-blue-600 font-medium"}>
                Overview
              </a>
            </Link>
            <Link href="/">
              <a className={location === "/radar" ? "text-blue-600 font-medium" : "text-slate-600 hover:text-blue-600 font-medium"}>
                Radar
              </a>
            </Link>
            <Link href="/technologies">
              <a className={location === "/technologies" ? "text-blue-600 font-medium" : "text-slate-600 hover:text-blue-600 font-medium"}>
                Technologies
              </a>
            </Link>
            <Link href="/about">
              <a className={location === "/about" ? "text-blue-600 font-medium" : "text-slate-600 hover:text-blue-600 font-medium"}>
                About
              </a>
            </Link>
          </nav>
          
          <div className="relative w-64">
            <input 
              type="search" 
              placeholder="Search technologies..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <button 
          type="button" 
          className="block md:hidden text-slate-700" 
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-slate-200 px-4 py-3`}>
        <nav className="flex flex-col space-y-3">
          <Link href="/">
            <a className={location === "/" ? "text-blue-600 font-medium py-1" : "text-slate-600 hover:text-blue-600 font-medium py-1"}>
              Overview
            </a>
          </Link>
          <Link href="/">
            <a className={location === "/radar" ? "text-blue-600 font-medium py-1" : "text-slate-600 hover:text-blue-600 font-medium py-1"}>
              Radar
            </a>
          </Link>
          <Link href="/technologies">
            <a className={location === "/technologies" ? "text-blue-600 font-medium py-1" : "text-slate-600 hover:text-blue-600 font-medium py-1"}>
              Technologies
            </a>
          </Link>
          <Link href="/about">
            <a className={location === "/about" ? "text-blue-600 font-medium py-1" : "text-slate-600 hover:text-blue-600 font-medium py-1"}>
              About
            </a>
          </Link>
        </nav>
        <div className="mt-4 relative">
          <input 
            type="search" 
            placeholder="Search technologies..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </header>
  );
}
