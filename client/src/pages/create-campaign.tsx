// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { useLocation } from "wouter";
// import { useAuth } from "@/hooks/use-auth";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest, queryClient } from "@/lib/queryClient";
// import { insertCampaignSchema, Category } from "@shared/schema";
// import {
//   Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { format } from "date-fns";

// // const campaignFormSchema = insertCampaignSchema.extend({
// //   endDate: z.date().optional(),
// //   categoryIds: z.array(z.number(), {
// //     required_error: "At least one category is required",
// //   }),
// //   organizationId: z.number().optional(),
// // });

// const campaignFormSchema = insertCampaignSchema.extend({
//   endDate: z.date().optional(),
//   categoryId: z.number({
//     required_error: "Category is required",
//   }),
//  organizationId: user.id,
// });


// type CampaignFormValues = z.infer<typeof campaignFormSchema>;

// export default function CreateCampaign() {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [, navigate] = useLocation();
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   useEffect(() => {
//     console.log("🔍 formState.errors", form.formState.errors);
//     console.log("user:", user);
//     if (user?.userType !== "organization") {
//       toast({
//         title: "Access Denied",
//         description: "Only organizations can create campaigns",
//         variant: "destructive",
//       });
//       navigate("/");
//     }
//   }, [user]);

//   const { data: categories = [] } = useQuery<Category[]>({
//     queryKey: ["/api/categories"],
//   });

//   const form = useForm<CampaignFormValues>({
//   resolver: zodResolver(campaignFormSchema),
//   defaultValues: {
//     title: "",
//     description: "",
//     goalAmount: 0,
//     imageUrl: "",
//     categoryId: undefined, // ✅ đổi từ categoryIds sang categoryId
//     startDate: new Date(),
//   },
// });


//   useEffect(() => {
//     if (user?.id) form.setValue("organizationId", user.id);
//   }, [user?.id]);

//   const handleImageUrlChange = (url: string) => {
//     form.setValue("imageUrl", url);
//     setPreviewImage(url);
//   };

//   // const createCampaignMutation = useMutation({
//   //   mutationFn: async (values: CampaignFormValues) => {
//   //     const res = await apiRequest("POST", "/api/campaigns", values);
//   //     return res.json();
//   //   },
//   const createCampaignMutation = useMutation({
//   mutationFn: async (values: CampaignFormValues) => {
//     console.log("🚀 Sending data to /api/campaigns", values); // 👈 THÊM LOG
//     const res = await apiRequest("POST", "/api/campaigns", values);
//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(error.message || "Unknown error");
//     }
//     return res.json();
//   },
//     onSuccess: () => {
//       console.log("Create campaign success", data);
//       toast({ title: "Campaign created", description: "Your campaign has been created successfully" });
//       queryClient.invalidateQueries({ queryKey: ["/api/organizations", user?.id, "campaigns"] });
//       navigate("/dashboard");
//     },
//     // onError: (error) => {
//     //   console.error("Create campaign failed", error);
//     //   toast({
//     //     title: "Error",
//     //     description: error.message || "Failed to create campaign",
//     //     variant: "destructive",
//     //   });
//     // },
//     onError: (error: any) => {
//   console.error("Create campaign failed", error);
//   toast({
//     title: "Error",
//     description: error.message || JSON.stringify(error),
//     variant: "destructive",
//   });
// }

//   });

//   const onSubmit = (values: CampaignFormValues) => {
//     console.log("Form errors", form.formState.errors);
//     console.log("Submitting campaign with values:", values);
//     createCampaignMutation.mutate({
//       ...values,
//       goalAmount: Number(values.goalAmount),
//       organizationId: user?.id || 0,
//       //categoryIds: [Number(categoryId)],
//     });
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <div className="flex-grow py-12 bg-gray-50">
//         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Create a Campaign</CardTitle>
//               <CardDescription>Fill out the form below to start your campaign</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                   <FormField
//                     control={form.control}
//                     name="title"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Title</FormLabel>
//                         <FormControl><Input placeholder="Campaign title" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Description</FormLabel>
//                         <FormControl><Textarea placeholder="Describe your campaign" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="goalAmount"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Goal Amount ($)</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             value={field.value ?? ""}
//                             onChange={(e) => field.onChange(Number(e.target.value) || 0)}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* <FormField
//                     control={form.control}
//                     name="categoryIds"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Categories</FormLabel>
//                         <FormControl>
//                           <select
//                             {...field}
//                             multiple
//                             value={field.value || []}
//                             onChange={(e) => {
//                               const selectedValues = Array.from(e.target.selectedOptions, option => Number(option.value));
//                               field.onChange(selectedValues);
//                             }}
//                             className="form-select w-full p-2 border rounded"
//                           >
//                             <option value="">-- Select categories --</option>
//                             {categories.map((cat) => (
//                               <option key={cat.id} value={cat.id}>
//                                 {cat.name}
//                               </option>
//                             ))}
//                           </select>
//                         </FormControl>
//                         <FormDescription>
//                           Choose the categories that best fit your campaign
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   /> */}
//                   <FormField
//   control={form.control}
//   name="categoryId" // 🔄 Đổi từ categoryIds ➜ categoryId
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Category</FormLabel>
//       <FormControl>
//         <select
//           {...field}
//           value={field.value ?? ""}
//           onChange={(e) => field.onChange(Number(e.target.value))}
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
//         Choose one category that best fits your campaign
//       </FormDescription>
//       <FormMessage />
//     </FormItem>
//   )}
// />



//                   <FormField
//                     control={form.control}
//                     name="imageUrl"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Image URL</FormLabel>
//                         <FormControl>
//                           <Input {...field} onChange={(e) => handleImageUrlChange(e.target.value)} />
//                         </FormControl>
//                         <FormMessage />
//                         {previewImage && <img src={previewImage} alt="Preview" className="mt-2 h-48 w-full object-cover rounded-md" />}
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="startDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Start Date</FormLabel>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <FormControl>
//                               <Button variant="outline" className="w-full justify-start">
//                                 {field.value ? format(field.value, "PPP") : "Pick a date"}
//                                 <CalendarIcon className="ml-auto h-4 w-4" />
//                               </Button>
//                             </FormControl>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0">
//                             <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
//                           </PopoverContent>
//                         </Popover>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="endDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>End Date (optional)</FormLabel>
//                         <Popover>
//                           <PopoverTrigger asChild>
//                             <FormControl>
//                               <Button variant="outline" className="w-full justify-start">
//                                 {field.value ? format(field.value, "PPP") : "Pick a date"}
//                                 <CalendarIcon className="ml-auto h-4 w-4" />
//                               </Button>
//                             </FormControl>
//                           </PopoverTrigger>
//                           <PopoverContent className="w-auto p-0">
//                             <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
//                           </PopoverContent>
//                         </Popover>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
//                   <Button type="submit" className="w-full">Create Campaign</Button>
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


import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";

import { insertCampaignSchema, Category } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const campaignFormSchema = insertCampaignSchema.extend({
  endDate: z.date().optional(),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export default function CreateCampaign() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      goalAmount: 0,
      imageUrl: "",
      categoryId: undefined,
      startDate: new Date(),
      endDate: undefined,
    },
  });

  useEffect(() => {
    if (user?.userType !== "organization") {
      toast({
        title: "Access Denied",
        description: "Only organizations can create campaigns",
        variant: "destructive",
      });
      navigate("/");
    }
    if (user?.id) {
      form.setValue("organizationId", user.id);
    }
  }, [user]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createCampaign = useMutation({
    mutationFn: async (data: CampaignFormValues) => {
      const res = await apiRequest("POST", "/api/campaigns", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Campaign created",
        description: "Your campaign has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/organizations", user?.id, "campaigns"] });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast({
        title: "Error creating campaign",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CampaignFormValues) => {
    createCampaign.mutate({
      ...values,
      goalAmount: Number(values.goalAmount),
      startDate: new Date(values.startDate),
      endDate: values.endDate ? new Date(values.endDate) : undefined,
      organizationId: user?.id || 0,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white shadow p-6 rounded-lg">
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
                    <FormControl><Textarea placeholder="Describe your campaign..." {...field} /></FormControl>
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="form-select w-full border p-2 rounded"
                      >
                        <option value="">-- Select category --</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
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
                      <Input {...field} onChange={(e) => {
                        field.onChange(e.target.value);
                        setPreviewImage(e.target.value);
                      }} />
                    </FormControl>
                    <FormMessage />
                    {previewImage && (
                      <img src={previewImage} className="w-full h-48 object-cover rounded mt-2" alt="Preview" />
                    )}
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
                          <Button variant="outline" className="w-full justify-start text-left">
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
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
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-start text-left">
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Create Campaign</Button>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
