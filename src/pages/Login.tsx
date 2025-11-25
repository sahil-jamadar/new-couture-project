import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '@/lib/authService-simple';
import { FirebaseError } from 'firebase/app';
import { ArrowLeft, Chrome, Eye, EyeOff, Lock, Mail, Sparkles, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Redirect logged-in users away from login page
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, authLoading, navigate]);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const getFirebaseErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signInWithEmail(loginData.email, loginData.password);
      toast({
        title: "Welcome back! 🎉",
        description: "You have successfully logged in to The Coutures.",
      });
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? getFirebaseErrorMessage(error)
        : 'An unexpected error occurred. Please try again.';
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password should be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUpWithEmail(registerData.email, registerData.password, registerData.fullName);
      toast({
        title: "Account Created! 🎊",
        description: "Welcome to The Coutures! Your account has been created successfully.",
      });
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? getFirebaseErrorMessage(error)
        : 'An unexpected error occurred. Please try again.';
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome! 🚀",
        description: "You have successfully signed in with Google.",
      });
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? getFirebaseErrorMessage(error)
        : 'Google sign-in failed. Please try again.';
      
      toast({
        title: "Google Sign-In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render login page if user is already logged in (will redirect)
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-premium opacity-5"></div>
      <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground z-10 px-2 sm:px-3 py-1.5 sm:py-2"
      >
        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">Back to Home</span>
        <span className="xs:hidden">Back</span>
      </Button>

      {/* Main Content */}
      <div className="w-full max-w-[95%] xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-gradient-purple">
              The Coutures
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-2">
            Welcome to premium fabric collections
          </p>
        </div>

        {/* Auth Card */}
        <Card className="bg-card/95 backdrop-blur-md shadow-premium border-border/50">
          <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
              Join Our Fashion Community
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 sm:mt-2">
              Access exclusive fabric collections and personalized recommendations
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-5 md:mb-6 bg-muted/50 h-10">
                <TabsTrigger value="login" className="data-[state=active]:bg-background text-xs sm:text-sm">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-background text-xs sm:text-sm">
                  Create Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 sm:space-y-5 md:space-y-6 mt">
                <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="login-email" className="text-xs sm:text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-8 sm:pl-10 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="login-password" className="text-xs sm:text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-8 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-gradient-premium text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base border-border/50 hover:bg-accent"
                  disabled={isLoading}
                >
                  <Chrome className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Continue with Google
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 sm:space-y-5 md:space-y-6">
                <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="register-name" className="text-xs sm:text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                        className="pl-8 sm:pl-10 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="register-email" className="text-xs sm:text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="pl-8 sm:pl-10 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="register-password" className="text-xs sm:text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="pl-8 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="confirm-password" className="text-xs sm:text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className="pl-8 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                      >
                        {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-gradient-premium text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base border-border/50 hover:bg-accent"
                  disabled={isLoading}
                >
                  <Chrome className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Continue with Google
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4 md:mt-6 px-2">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}