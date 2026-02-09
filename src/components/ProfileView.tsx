import { BadgeCheck, MapPin, Car, Star, Shield, Award, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import profilePhoto from "@/assets/profile-photo.jpg";
import carExterior from "@/assets/car-exterior.jpg";
import carInterior from "@/assets/car-interior.jpg";

const ProfileView = () => {
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
        <p className="text-sm text-muted-foreground">@marcusrivera</p>
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
