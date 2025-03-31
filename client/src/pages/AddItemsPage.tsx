import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddTechnologyForm from "@/components/AddTechnologyForm";
import AddProjectForm from "@/components/AddProjectForm";
import { Technology, Quadrant, Ring } from "@shared/schema";

export default function AddItemsPage() {
  const [activeTab, setActiveTab] = useState("technology");

  // Fetch quadrants
  const { data: quadrants, isLoading: isLoadingQuadrants } = useQuery({
    queryKey: ["/api/quadrants"],
    select: (data: Quadrant[]) => data,
  });

  // Fetch rings
  const { data: rings, isLoading: isLoadingRings } = useQuery({
    queryKey: ["/api/rings"],
    select: (data: Ring[]) => data,
  });

  // Fetch technologies
  const { data: technologies, isLoading: isLoadingTechnologies } = useQuery({
    queryKey: ["/api/technologies"],
    select: (data: Technology[]) => data,
  });

  const isLoading = isLoadingQuadrants || isLoadingRings || isLoadingTechnologies;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 gradient-text dark:bg-gradient-to-r dark:from-blue-300 dark:to-indigo-200">Add New Items</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar navigation */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Add New Items</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Add new technologies and projects to your tech radar. Technologies can be categorized into quadrants and rings, while projects can be associated with multiple technologies.
          </p>
          
          <div className="space-y-1 mb-6">
            <div className={`p-3 rounded-md cursor-pointer ${activeTab === "technology" ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-slate-100 dark:hover:bg-gray-700"}`}
              onClick={() => setActiveTab("technology")}>
              <h3 className={`font-medium ${activeTab === "technology" ? "text-blue-800 dark:text-blue-300" : "text-slate-800 dark:text-gray-200"}`}>
                Add Technology
              </h3>
              <p className={`text-sm ${activeTab === "technology" ? "text-blue-600 dark:text-blue-200" : "text-slate-600 dark:text-gray-400"}`}>
                Add a new technology to your radar
              </p>
            </div>
            
            <div className={`p-3 rounded-md cursor-pointer ${activeTab === "project" ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-slate-100 dark:hover:bg-gray-700"}`}
              onClick={() => setActiveTab("project")}>
              <h3 className={`font-medium ${activeTab === "project" ? "text-blue-800 dark:text-blue-300" : "text-slate-800 dark:text-gray-200"}`}>
                Add Project
              </h3>
              <p className={`text-sm ${activeTab === "project" ? "text-blue-600 dark:text-blue-200" : "text-slate-600 dark:text-gray-400"}`}>
                Add a new project with associated technologies
              </p>
            </div>
          </div>
          
          <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Need Help?</h3>
            <p className="text-sm text-blue-600 dark:text-blue-200">
              After adding items, they will be automatically shown in the radar visualization and lists on the relevant pages.
            </p>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div>
              {activeTab === "technology" && (
                <AddTechnologyForm 
                  quadrants={quadrants || []} 
                  rings={rings || []} 
                  onSuccess={() => {
                    // Handle success if needed
                  }}
                />
              )}
              
              {activeTab === "project" && (
                <AddProjectForm 
                  technologies={technologies || []} 
                  onSuccess={() => {
                    // Handle success if needed
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}