import { useState, useEffect } from "react";
import { BadgeCheck, MapPin, Car, Star, Shield, Award, Route, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import profilePhoto from "@/assets/profile-photo.jpg";
import carExterior from "@/assets/car-exterior.jpg";
import carInterior from "@/assets/car-interior.jpg";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProfileView = () => {
  const [username, setUsername] = useState("marcusrivera");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const userId = 1; // Default user ID - in a real app, this would come from auth context

  useEffect(() => {
    // Fetch user data on mount
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setUsername(user.username);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleEdit = () => {
    setEditValue(username);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleSave = async () => {
    if (!editValue.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: editValue.trim() }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsername(updatedUser.username);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Username updated successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update username",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast({
        title: "Error",
        description: "Failed to update username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in px-4 py-6 pb-24">
      {/* Profile header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src={profilePhoto}
            alt="Marcus Rivera"
            className="h-24 w-24 rounded-full border-2 border-primary object-cover shadow-md"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-help items-center justify-center rounded-full bg-primary shadow-sm">
                <BadgeCheck className="h-4 w-4 text-primary-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] text-xs">
              <p className="font-semibold">Verified BYU Student</p>
              <p className="text-muted-foreground">Student status and vehicle info have been verified by STÜBER.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Marcus Rivera</h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 w-32 text-center text-sm"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  } else if (e.key === "Escape") {
                    handleCancel();
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                disabled={loading}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={loading}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">@{username}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                className="h-6 w-6 p-0"
              >
                <Edit2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`h-4 w-4 ${i <= 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
          ))}
          <span className="ml-1 text-sm font-semibold text-foreground">4.9</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4 shadow-sm">
          <Route className="mb-1 h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-foreground">128</span>
          <span className="text-xs text-muted-foreground">Total Rides</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4 shadow-sm">
          <Award className="mb-1 h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-foreground">4.9</span>
          <span className="text-xs text-muted-foreground">Avg. Rating</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-3">
        <Button variant="outline" className="flex-1 text-sm">Edit Profile</Button>
        <Button variant="outline" className="flex-1 text-sm">Share Profile</Button>
      </div>

      {/* Info cards */}
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</h3>
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5">
          <Shield className="h-4 w-4 text-primary" />
          <div>
            <span className="text-sm font-medium text-foreground">Verified Student</span>
            <p className="text-xs text-muted-foreground">BYU · Computer Science</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Heritage Halls, Provo, UT</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3.5">
          <Car className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="text-sm font-medium text-foreground">2024 Tesla Model 3</span>
            <p className="text-xs text-muted-foreground">Midnight Black · <span className="font-mono">EV-04821</span></p>
          </div>
        </div>
      </div>

      {/* Photo gallery */}
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle Gallery</h3>
      <div className="grid grid-cols-2 gap-3">
        <img
          src={carExterior}
          alt="Car exterior"
          className="aspect-[4/3] w-full rounded-lg object-cover shadow-sm"
        />
        <img
          src={carInterior}
          alt="Car interior"
          className="aspect-[4/3] w-full rounded-lg object-cover shadow-sm"
        />
      </div>
    </div>
  );
};

export default ProfileView;
