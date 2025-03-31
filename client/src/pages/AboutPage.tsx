export default function AboutPage() {
  return (
    <div className="bg-slate-50 py-6">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">About Tech Radar</h1>
          
          <div className="prose max-w-none">
            <p>
              The Tech Radar is a tool to track different technologies, assess their adoption and enforce common usage in projects.
              It was inspired by the <a href="https://www.thoughtworks.com/radar" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ThoughtWorks Technology Radar</a>.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Purpose</h2>
            <p>
              Our Tech Radar aims to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide a structured overview of technologies we use or evaluate</li>
              <li>Facilitate technology decisions in projects</li>
              <li>Create a common language and knowledge around technology stacks</li>
              <li>Help developers understand which technologies to learn or focus on</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">How to Use the Radar</h2>
            <p>
              The radar is split into four quadrants: Techniques, Tools, Platforms, and Languages & Frameworks. Each technology is placed in one of these quadrants and assigned to a ring that indicates our recommendation level:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong className="text-green-600">Adopt</strong>: We strongly recommend this technology and use it when appropriate.</li>
              <li><strong className="text-blue-600">Trial</strong>: Worth pursuing. We've used it with positive results but may still have reservations.</li>
              <li><strong className="text-amber-600">Assess</strong>: Worth exploring to understand how it might affect our projects.</li>
              <li><strong className="text-red-600">Hold</strong>: Proceed with caution. Either an unproven technology or one that is no longer recommended.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contributing</h2>
            <p>
              This Tech Radar is an open-source project, and we welcome contributions. If you want to suggest new technologies or changes to existing assessments, please check the <a href="https://github.com/apptension/tech-radar" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub repository</a> and follow the contribution guidelines.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Original Repository</h2>
            <p>
              This application is based on the <a href="https://github.com/apptension/tech-radar" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Apptension Tech Radar</a> repository. The original project was created to help teams track and visualize their technology landscape.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
