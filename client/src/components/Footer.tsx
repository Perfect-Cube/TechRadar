import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tech Radar</h3>
            <p className="text-slate-300 text-sm">A visual tool for tracking technology trends and making informed technology choices.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/"><a className="hover:text-white">Overview</a></Link></li>
              <li><Link href="/"><a className="hover:text-white">Radar Visualization</a></Link></li>
              <li><Link href="/technologies"><a className="hover:text-white">Technologies</a></Link></li>
              <li><Link href="/about"><a className="hover:text-white">About</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-slate-300">
              <li><a href="https://github.com/apptension/tech-radar" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub Repository</a></li>
              <li><a href="https://github.com/apptension/tech-radar#documentation" target="_blank" rel="noopener noreferrer" className="hover:text-white">Documentation</a></li>
              <li><a href="https://github.com/apptension/tech-radar/blob/master/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-white">Contribute</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-700 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Tech Radar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
