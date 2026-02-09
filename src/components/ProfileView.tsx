import { BadgeCheck, MapPin, Car, Camera, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import profilePhoto from "@/assets/profile-photo.jpg";
import carExterior from "@/assets/car-exterior.jpg";
import carInterior from "@/assets/car-interior.jpg";

const ProfileView = () => {
  return (
    <div className="mx-auto max-w-lg animate-fade-in px-4 py-6">
      {/* Profile header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src={profilePhoto}
            alt="Profile"
            className="h-24 w-24 rounded-full border-2 border-primary object-cover"
          />
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary">
            <BadgeCheck className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Marcus Rivera</h2>
        <p className="text-sm text-muted-foreground">@marcusrivera</p>
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`h-4 w-4 ${i <= 4 ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          ))}
          <span className="ml-1 text-sm font-medium text-foreground">4.9</span>
          <span className="text-sm text-muted-foreground">(128 rides)</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-3">
        <Button variant="outline" className="flex-1 text-sm">Edit Profile</Button>
        <Button variant="outline" className="flex-1 text-sm">Share Profile</Button>
      </div>

      {/* Info cards */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">King Henry, Downtown</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">2024 Tesla Model 3 · Midnight Black</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Camera className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">2 vehicle photos</span>
        </div>
      </div>

      {/* Photo gallery */}
      <h3 className="mb-3 text-sm font-semibold text-foreground">Vehicle Gallery</h3>
      <div className="grid grid-cols-2 gap-3">
        <img
          src={carExterior}
          alt="Car exterior"
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />
        <img
          src={carInterior}
          alt="Car interior"
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />
      </div>
    </div>
  );
};

export default ProfileView;
