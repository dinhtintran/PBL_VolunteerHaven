
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useLanguage } from "@/hooks/use-language";

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
  const { t } = useLanguage();
  
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
  
  if (user) {
    if (user.userType === "admin") {
      return <Redirect to="/admin" />;
    }
    return <Redirect to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-grow flex">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">{t("auth.signin")}</TabsTrigger>
                <TabsTrigger value="register">{t("auth.signup")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("auth.signin")}</CardTitle>
                    <CardDescription>
                      {t("auth.signin.description")}
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
                              <FormLabel>{t("auth.username")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("auth.username")} 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e);
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
                                  {t("auth.admin.mode")}
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
                              <FormLabel>{t("auth.password")}</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder={t("auth.password")} {...field} />
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
                            ? t("auth.signin.loading")
                            : t("auth.signin.button")}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center space-y-2">
                    <div className="text-sm text-gray-500">
                      {t("auth.noaccount")}{" "}
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setActiveTab("register")}
                      >
                        {t("auth.signup")}
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
                        {t("auth.admin.portal")}
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("auth.signup")}</CardTitle>
                    <CardDescription>
                      {t("auth.signup.description")}
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
                              <FormLabel>{t("auth.fullname")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("auth.fullname")} {...field} />
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
                              <FormLabel>{t("auth.username")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("auth.username")} {...field} />
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
                              <FormLabel>{t("auth.email")}</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder={t("auth.email")} {...field} />
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
                              <FormLabel>{t("auth.accountType")}</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("auth.accountType")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="donor">{t("account.donor")}</SelectItem>
                                  <SelectItem value="organization">{t("account.organization")}</SelectItem>
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
                              <FormLabel>{t("auth.password")}</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder={t("auth.password")} {...field} />
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
                              <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder={t("auth.confirmPassword")} {...field} />
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
                          {registerMutation.isPending 
                            ? t("auth.signup.loading")
                            : t("auth.signup.button")}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center">
                    <div className="text-sm text-gray-500">
                      {t("auth.hasaccount")}{" "}
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setActiveTab("login")}
                      >
                        {t("auth.signin")}
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="hidden lg:flex flex-1 bg-primary text-white">
          <div className="flex flex-col justify-center px-12 py-12">
            <h1 className="text-4xl font-bold mb-6">{t("app.tagline")}</h1>
            <p className="text-xl mb-8">{t("app.description")}</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-primary mr-3">✓</div>
                <span>{t("home.benefit1")}</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-primary mr-3">✓</div>
                <span>{t("home.benefit2")}</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-primary mr-3">✓</div>
                <span>{t("home.benefit3")}</span>
              </li>
            </ul>
            <div>
              <Link href="/campaigns">
                <Button size="lg" variant="secondary" className="text-primary">
                  {t("button.browse")}
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
