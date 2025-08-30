// import { useState } from "react";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { Category, insertCampaignSchema } from "@shared/schema";
// import { useLocation } from "wouter";
// import { useAuth } from "@/hooks/use-auth";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest, queryClient } from "@/lib/queryClient";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2, CalendarIcon, ImageIcon } from "lucide-react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";

// // Extend the campaign schema for the form
// const campaignFormSchema = insertCampaignSchema.extend({
//   endDate: z.date().optional(),
//   categoryId: z.number({
//     required_error: "Category is required",
//   }),
//   organizationId: z.number().optional(),
// });

// type CampaignFormValues = z.infer<typeof campaignFormSchema>;

// export default function CreateCampaign() {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [, navigate] = useLocation();
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   // Redirect if user is not an organization
//   if (user && user.userType !== "organization") {
//     navigate("/");
//     toast({
//       title: "Access Denied",
//       description: "Only organizations can create campaigns",
//       variant: "destructive",
//     });
//   }

//   // Fetch categories for the select input
//   const { data: categories = [] } = useQuery<Category[]>({
//     queryKey: ["/api/categories"],
//   });

//   // Form setup
//   const form = useForm<CampaignFormValues>({
//     resolver: zodResolver(campaignFormSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       goalAmount: 0,
//       categoryId: undefined,
//       imageUrl: "",
//       startDate: new Date(),
//     },
//   });

//   // Handle image URL change
//   const handleImageUrlChange = (url: string) => {
//     form.setValue("imageUrl", url);
//     setPreviewImage(url);
//   };

//   // Create campaign mutation
//   const createCampaignMutation = useMutation({
//     mutationFn: async (values: CampaignFormValues) => {
//       const res = await apiRequest("POST", "/api/campaigns", values);
//       return res.json();
//     },
//     onSuccess: () => {
//       toast({
//         title: "Campaign created",
//         description: "Your campaign has been created successfully",
//       });
//       navigate("/dashboard");

//       // Invalidate queries to refresh the data
//       queryClient.invalidateQueries({ queryKey: ["/api/organizations", user?.id, "campaigns"] });
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to create campaign",
//         variant: "destructive",
//       });
//     },
//   });

//   const onSubmit = (values: CampaignFormValues) => {
//   console.log("submitting", values); // Thử log trước
//   createCampaignMutation.mutate({
//     ...values,
//     goalAmount: Number(values.goalAmount),
//     organizationId: user?.id || 0,
//   });
// };

// useEffect(() => {
//   if (user?.id) {
//     form.setValue("organizationId", user.id);
//   }
// }, [user?.id]);

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />

//       <div className="flex-grow bg-gray-50 py-12">
//         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Create a Campaign</h1>
//             <p className="text-gray-600 mt-1">
//               Set up your fundraising campaign and start making a difference
//             </p>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Campaign Details</CardTitle>
//               <CardDescription>
//                 Provide information about your campaign to engage potential donors
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                   {/* Campaign Title */}
//                   <FormField
//                     control={form.control}
//                     name="title"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Campaign Title</FormLabel>
//                         <FormControl>
//                           <Input 
//                             placeholder="Enter a clear, descriptive title" 
//                             {...field} 
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           A compelling title helps attract donors to your cause
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Campaign Description */}
//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Description</FormLabel>
//                         <FormControl>
//                           <Textarea 
//                             placeholder="Describe your campaign, its goals, and how the funds will be used" 
//                             className="min-h-[120px]"
//                             {...field} 
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           Be detailed and specific about how donations will help your cause
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Funding Goal */}
//                   <FormField
//   control={form.control}
//   name="goalAmount"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Funding Goal ($)</FormLabel>
//       <FormControl>
//         <Input
//           type="number"
//           placeholder="Enter funding goal"
//           value={field.value === undefined || isNaN(Number(field.value)) ? "" : field.value}
//           onChange={(e) => {
//             const value = e.target.value;
//             field.onChange(value === "" ? undefined : Number(value));
//           }}
//         />
//       </FormControl>
//       <FormDescription>
//         Total amount you aim to raise
//       </FormDescription>
//       <FormMessage />
//     </FormItem>
//   )}
// />

//                   {/* Category */}
//                   <FormField
//   control={form.control}
//   name="categoryId"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Category</FormLabel>
//       <FormControl>
//         <select
//           value={field.value?.toString() || ""}
//           onChange={(e) => {
//             const val = Number(e.target.value);
//             field.onChange(isNaN(val) ? undefined : val);
//           }}
//           className="form-select w-full p-2 border rounded"
//         >
//           <option value="">-- Select a category --</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       </FormControl>
//       <FormDescription>
//         Choose the category that best fits your campaign
//       </FormDescription>
//       <FormMessage />
//     </FormItem>
//   )}
// />


//                   {/* Campaign Image */}
//                   <FormField
//                     control={form.control}
//                     name="imageUrl"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Campaign Image URL</FormLabel>
//                         <FormControl>
//                           <div className="flex space-x-2">
//                             <Input 
//                               placeholder="Enter the URL of your campaign image" 
//                               {...field}
//                               onChange={(e) => handleImageUrlChange(e.target.value)}
//                             />
//                           </div>
//                         </FormControl>
//                         <FormDescription>
//                           Add an image that represents your campaign
//                         </FormDescription>
//                         <FormMessage />

//                         {previewImage && (
//                           <div className="mt-2">
//                             <p className="text-sm font-medium mb-2">Image Preview:</p>
//                             <div className="rounded-md overflow-hidden border border-gray-200 w-full h-48 relative">
//                               <img 
//                                 src={previewImage}
//                                 alt="Campaign preview" 
//                                 className="w-full h-full object-cover"
//                                 onError={() => setPreviewImage(null)}
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </FormItem>
//                     )}
//                   />

//                   {/* Campaign Start Date */}
//                   <FormField
//                     control={form.control}
//                     name="startDate"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel>Start Date</FormLabel>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <FormControl>
//                               <Button
//                                 variant={"outline"}
//                                 className={cn(
//                                   "w-full pl-3 text-left font-normal",
//                                   !field.value && "text-muted-foreground"
//                                 )}
//                               >
//                                 {field.value ? (
//                                   format(field.value, "PPP")
//                                 ) : (
//                                   <span>Pick a date</span>
//                                 )}
//                                 <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                               </Button>
//                             </FormControl>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0" align="start">
//                             <Calendar
//                               mode="single"
//                               selected={field.value}
//                               onSelect={field.onChange}
//                               initialFocus
//                             />
//                           </PopoverContent>
//                         </Popover>
//                         <FormDescription>
//                           The date your campaign will go live
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Campaign End Date (Optional) */}
//                   <FormField
//                     control={form.control}
//                     name="endDate"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel>End Date (Optional)</FormLabel>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <FormControl>
//                               <Button
//                                 variant={"outline"}
//                                 className={cn(
//                                   "w-full pl-3 text-left font-normal",
//                                   !field.value && "text-muted-foreground"
//                                 )}
//                               >
//                                 {field.value ? (
//                                   format(field.value, "PPP")
//                                 ) : (
//                                   <span>Pick a date</span>
//                                 )}
//                                 <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                               </Button>
//                             </FormControl>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0" align="start">
//                             <Calendar
//                               mode="single"
//                               selected={field.value}
//                               onSelect={field.onChange}
//                               initialFocus
//                               fromDate={form.getValues("startDate") || new Date()}
//                             />
//                           </PopoverContent>
//                         </Popover>
//                         <FormDescription>
//                           Set an end date for your campaign (leave blank for ongoing campaigns)
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="flex justify-end space-x-4">
//                     <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
//                       Cancel
//                     </Button>
//                     <Button 
//                       type="submit" 
//                       disabled={createCampaignMutation.isPending}
//                     >
//                       {createCampaignMutation.isPending ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Creating...
//                         </>
//                       ) : (
//                         "Create Campaign"
//                       )}
//                     </Button>
//                   </div>
//                 </form>
//               </Form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertCampaignSchema, Category } from "@shared/schema";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { format } from "date-fns";

const campaignFormSchema = insertCampaignSchema.extend({
  endDate: z.date().optional(),
  categoryIds: z.array(z.number(), {
    required_error: "At least one category is required",
  }),
  organizationId: z.number().optional(),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export default function CreateCampaign() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 formState.errors", form.formState.errors);
    console.log("user:", user);
    if (user?.userType !== "organization") {
      toast({
        title: "Access Denied",
        description: "Only organizations can create campaigns",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      goalAmount: 0,
      imageUrl: "",
      categoryIds: [],
      startDate: new Date(),
    },
  });

  useEffect(() => {
    if (user?.id) form.setValue("organizationId", user.id);
  }, [user?.id]);

  const handleImageUrlChange = (url: string) => {
    form.setValue("imageUrl", url);
    setPreviewImage(url);
  };

  const createCampaignMutation = useMutation({
    mutationFn: async (values: CampaignFormValues) => {
      const res = await apiRequest("POST", "/api/campaigns", values);
      return res.json();
    },
    onSuccess: () => {
      //console.log("Create campaign success", data);
      toast({ title: "Campaign created", description: "Your campaign has been created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/organizations", user?.id, "campaigns"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Create campaign failed", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CampaignFormValues) => {
    console.log("Form errors", form.formState.errors);
    console.log("Submitting campaign with values:", values);
    createCampaignMutation.mutate({
      ...values,
      goalAmount: Number(values.goalAmount),
      organizationId: user?.id || 0,
      //categoryIds: [Number(categoryId)],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create a Campaign</CardTitle>
              <CardDescription>Fill out the form below to start your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input placeholder="Campaign title" {...field} /></FormControl>
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
                        <FormControl><Textarea placeholder="Describe your campaign" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto border p-2 rounded">
                            {categories.map((cat) => (
                              <label key={cat.id} className="inline-flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  value={cat.id}
                                  checked={field.value?.includes(cat.id) || false}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([...(field.value || []), cat.id]);
                                    } else {
                                      field.onChange(field.value?.filter(id => id !== cat.id) || []);
                                    }
                                  }}
                                />
                                <span>{cat.name}</span>
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormDescription>Choose the categories that best fit your campaign</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={(e) => handleImageUrlChange(e.target.value)} />
                        </FormControl>
                        <FormMessage />
                        {previewImage && <img src={previewImage} alt="Preview" className="mt-2 h-48 w-full object-cover rounded-md" />}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className="w-full justify-start">
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className="w-full justify-start">
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
                  <Button type="submit" className="w-full">Create Campaign</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
