import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTailoringAppointments, type TailoringAppointment } from "@/lib/tailoringService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<TailoringAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get cart count for header
  const getCartItemCount = () => {
    try {
      const cart = localStorage.getItem("coutures-cart");
      if (cart) {
        const items = JSON.parse(cart);
        return items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      }
    } catch (e) {
      return 0;
    }
    return 0;
  };

  const [cartCount, setCartCount] = useState(getCartItemCount());

  useEffect(() => {
    // Wait for auth to load before checking login status
    if (authLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your appointments.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    loadAppointments();
  }, [isLoggedIn, user, navigate, toast, authLoading]);

  const loadAppointments = async () => {
    if (!user?.uid) {
      setError("User not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Loading appointments for user:", user.uid);
      
      const data = await getUserTailoringAppointments(user.uid);
      console.log("✅ Loaded user appointments:", data);
      
      setAppointments(data);
    } catch (error) {
      console.error("❌ Error loading appointments:", error);
      setError("Failed to load your appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: TailoringAppointment["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30 dark:text-yellow-400";
      case "confirmed": return "bg-blue-500/20 text-blue-600 border-blue-500/30 dark:text-blue-400";
      case "in-progress": return "bg-purple-500/20 text-purple-600 border-purple-500/30 dark:text-purple-400";
      case "completed": return "bg-green-500/20 text-green-600 border-green-500/30 dark:text-green-400";
      case "cancelled": return "bg-red-500/20 text-red-600 border-red-500/30 dark:text-red-400";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: TailoringAppointment["status"]) => {
    switch (status) {
      case "pending": return "⏳";
      case "confirmed": return "✅";
      case "in-progress": return "🔄";
      case "completed": return "🎉";
      case "cancelled": return "❌";
      default: return "❓";
    }
  };

  const getStatusMessage = (status: TailoringAppointment["status"]) => {
    switch (status) {
      case "pending": return "Your appointment request is being reviewed. We'll contact you soon.";
      case "confirmed": return "Your appointment is confirmed! Our team will visit you as scheduled.";
      case "in-progress": return "Our team is currently working on your tailoring requirements.";
      case "completed": return "Your tailoring service has been completed successfully!";
      case "cancelled": return "This appointment has been cancelled.";
      default: return "Status unknown.";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartCount} />
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      
      {/* Add top padding to account for fixed header */}
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Appointments</h1>
            <p className="text-muted-foreground">
              Track and manage your tailoring service appointments
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading your appointments...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <div className="text-destructive font-medium mb-2">Error Loading Appointments</div>
              <p className="text-destructive/80 mb-4">{error}</p>
              <Button onClick={loadAppointments} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* No Appointments */}
          {!loading && !error && appointments.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-card rounded-lg shadow-sm border border-border p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-foreground mb-2">No Appointments Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't booked any tailoring services yet. Book your first appointment to get started!
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  Book Tailoring Service
                </Button>
              </div>
            </div>
          )}

          {/* Appointments List */}
          {!loading && !error && appointments.length > 0 && (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-muted/30 px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getStatusIcon(appointment.status)}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Tailoring Service Appointment
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Booked for {formatDate(appointment.preferredDate)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-6 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">📞</span>
                            <span className="text-foreground">{appointment.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">✉️</span>
                            <span className="text-foreground">{appointment.email}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground mt-0.5">📍</span>
                            <span className="flex-1 text-foreground">{appointment.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Appointment Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">📅</span>
                            <span className="text-foreground">Preferred Date: {formatDate(appointment.preferredDate)}</span>
                          </div>
                          {appointment.notes && (
                            <div className="flex items-start gap-2">
                              <span className="text-muted-foreground mt-0.5">📝</span>
                              <span className="flex-1 text-foreground">{appointment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className={`mt-4 p-3 rounded-lg border ${getStatusColor(appointment.status)}`}>
                      <p className="text-sm font-medium">
                        {getStatusMessage(appointment.status)}
                      </p>
                    </div>

                    {/* Appointment ID */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Appointment ID: {appointment.id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          {!loading && !error && appointments.length > 0 && (
            <div className="text-center mt-8">
              <Button 
                onClick={loadAppointments}
                variant="outline"
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;