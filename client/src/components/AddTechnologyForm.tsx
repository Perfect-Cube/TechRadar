import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Technology, Quadrant, Ring } from "@shared/schema";

// We'll create a schema for the form validation
const technologySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
  quadrant: z.string(),
  ring: z.string(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  tags: z.string().optional(),
});

type TechnologyFormValues = z.infer<typeof technologySchema>;

interface AddTechnologyFormProps {
  quadrants: Quadrant[];
  rings: Ring[];
  onSuccess?: () => void;
}

export default function AddTechnologyForm({ quadrants, rings, onSuccess }: AddTechnologyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form with default values
  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: "",
      quadrant: "",
      ring: "",
      description: "",
      website: "",
      tags: "",
    },
  });

  async function onSubmit(values: TechnologyFormValues) {
    setIsSubmitting(true);
    try {
      // Format tags as an array if they exist
      const tagsArray = values.tags ? values.tags.split(",").map(tag => tag.trim()) : [];
      
      // Create the technology object to submit
      const newTechnology = {
        name: values.name,
        quadrant: parseInt(values.quadrant),
        ring: parseInt(values.ring),
        description: values.description,
        website: values.website || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      // Send the API request to create the technology
      await apiRequest("POST", "/api/technologies", newTechnology);

      // Invalidate queries to refetch data with the new technology
      queryClient.invalidateQueries({ queryKey: ["/api/technologies"] });
      
      // Show success message
      toast({
        title: "Technology Added",
        description: `${values.name} has been added to the radar.`,
        variant: "default",
      });

      // Reset form
      form.reset();
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding technology:", error);
      toast({
        title: "Error",
        description: "Failed to add technology. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Add New Technology</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Technology name" {...field} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quadrant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quadrant</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Select quadrant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {quadrants.map((quadrant, index) => (
                        <SelectItem key={quadrant.id} value={String(index)}>
                          {quadrant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ring"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ring</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Select ring" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {rings.map((ring, index) => (
                        <SelectItem key={ring.id} value={String(index)}>
                          {ring.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the technology and its use cases" 
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
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Optional, comma-separated)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="frontend, javascript, tool" 
                    {...field} 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Technology"}
          </Button>
        </form>
      </Form>
    </div>
  );
}