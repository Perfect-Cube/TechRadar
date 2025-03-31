import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Technology } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const projectSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  technologies: z.array(z.string()).min(1, { message: "Select at least one technology" }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface AddProjectFormProps {
  technologies: Technology[];
  onSuccess?: () => void;
}

export default function AddProjectForm({ technologies, onSuccess }: AddProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [techPopoverOpen, setTechPopoverOpen] = useState(false);

  // Initialize form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      technologies: [],
    },
  });

  // Handle technology selection
  const handleTechnologySelect = (techId: string) => {
    const currentTechs = form.getValues().technologies;
    const techExists = currentTechs.includes(techId);
    
    let updatedTechs: string[];
    if (techExists) {
      updatedTechs = currentTechs.filter(id => id !== techId);
    } else {
      updatedTechs = [...currentTechs, techId];
    }
    
    form.setValue("technologies", updatedTechs, { shouldValidate: true });
    setSelectedTechnologies(updatedTechs);
  };

  async function onSubmit(values: ProjectFormValues) {
    setIsSubmitting(true);
    try {
      // Create the project first
      const newProject = {
        name: values.name,
        description: values.description,
        website: values.website || undefined,
      };

      const response = await apiRequest("POST", "/api/projects", newProject);

      const createdProject = await response.json();

      // Link each selected technology to the project
      const techLinkPromises = values.technologies.map(techId => 
        apiRequest("POST", "/api/technology-projects", {
          technology_id: parseInt(techId),
          project_id: createdProject.id,
        })
      );

      await Promise.all(techLinkPromises);

      // Invalidate queries to refetch data with the new project
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      // Show success message
      toast({
        title: "Project Added",
        description: `${values.name} has been added with ${values.technologies.length} associated technologies.`,
        variant: "default",
      });

      // Reset form
      form.reset();
      setSelectedTechnologies([]);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Add New Project</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Project name" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the project and its purpose" 
                    className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com" 
                    {...field} 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technologies"
            render={() => (
              <FormItem>
                <FormLabel>Associated Technologies</FormLabel>
                <FormControl>
                  <Popover open={techPopoverOpen} onOpenChange={setTechPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 h-auto min-h-[2.5rem] py-2"
                      >
                        {selectedTechnologies.length === 0
                          ? "Select technologies"
                          : `${selectedTechnologies.length} technology(-ies) selected`}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
                      <Command className="dark:bg-gray-800">
                        <CommandInput placeholder="Search technologies..." className="dark:bg-gray-800 dark:text-gray-100" />
                        <CommandList className="max-h-[300px] overflow-auto">
                          <CommandEmpty>No technologies found.</CommandEmpty>
                          <CommandGroup>
                            {technologies.map((tech) => {
                              const isSelected = selectedTechnologies.includes(String(tech.id));
                              return (
                                <CommandItem
                                  key={tech.id}
                                  value={String(tech.id)}
                                  onSelect={() => handleTechnologySelect(String(tech.id))}
                                  className={`flex items-center gap-2 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                                >
                                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: tech.ring === 0 ? '#10b981' : tech.ring === 1 ? '#3b82f6' : tech.ring === 2 ? '#f59e0b' : '#ef4444' }}></div>
                                  <span className="dark:text-gray-100">{tech.name}</span>
                                  {isSelected && (
                                    <svg className="h-4 w-4 ml-auto text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                {selectedTechnologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTechnologies.map(techId => {
                      const tech = technologies.find(t => String(t.id) === techId);
                      if (!tech) return null;
                      return (
                        <div key={tech.id} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {tech.name}
                          <button
                            type="button"
                            onClick={() => handleTechnologySelect(String(tech.id))}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
}