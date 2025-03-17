import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  userType: z.enum(["donor", "organization"], { 
    required_error: "Please select an account type" 
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { user, loginMutation, adminLoginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      userType: "donor",
    },
  });
  
  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    // Check if this is an admin login attempt
    if (values.username === "admin") {
      console.log("Attempting admin login");
      adminLoginMutation.mutate(values);
    } else {
      loginMutation.mutate(values);
    }
  };
  
  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(values);
  };
  
  // Redirect based on user type
  if (user) {
    // Redirect admin to admin dashboard
    if (user.userType === "admin") {
      return <Redirect to="/admin" />;
    }
    // Redirect regular users to home
    return <Redirect to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-grow flex">
        {/* Left side - Forms */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your username" 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e);
                                    // Highlight admin login attempt
                                    if (e.target.value === "admin") {
                                      e.target.style.borderColor = "#10B981";
                                    } else {
                                      e.target.style.borderColor = "";
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                              {field.value === "admin" && (
                                <div className="text-xs text-green-600 mt-1">
                                  Admin login mode activated. Use password: admin123
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loginMutation.isPending || adminLoginMutation.isPending}
                        >
                          {loginMutation.isPending || adminLoginMutation.isPending 
                            ? "Signing in..." 
                            : "Sign In"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center space-y-2">
                    <div className="text-sm text-gray-500">
                      Don't have an account?{" "}
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setActiveTab("register")}
                      >
                        Sign up
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <button
                        type="button"
                        className="text-green-600 hover:underline"
                        onClick={() => {
                          loginForm.setValue("username", "admin");
                          loginForm.setValue("password", "admin123");
                        }}
                      >
                        Admin Portal Access
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                      Sign up for a new account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="userType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select account type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="donor">Donor</SelectItem>
                                  <SelectItem value="organization">Organization</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create Account"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center">
                    <div className="text-sm text-gray-500">
                      Already have an account?{" "}
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setActiveTab("login")}
                      >
                        Sign in
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right side - Hero image and content */}
        <div className="hidden lg:flex flex-1 bg-primary text-white">
          <div className="flex flex-col justify-center px-12 py-12">
            <h1 className="text-4xl font-bold mb-6">Make a Difference Today</h1>
            <p className="text-xl mb-8">
              Join GiveHope to support meaningful causes and help communities in need. Your contribution matters.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-primary mr-3">✓</div>
                <span>Support impactful projects worldwide</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-primary mr-3">✓</div>
                <span>Track your donations and see the impact</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-primary mr-3">✓</div>
                <span>Connect with like-minded donors</span>
              </li>
            </ul>
            <div>
              <Link href="/campaigns">
                <Button size="lg" variant="secondary" className="text-primary">
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
