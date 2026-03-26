import { useEffect, useMemo, useState } from "react";
import {
  MapPin, Clock, ArrowRight, User, Car,
  Search, SlidersHorizontal, Loader2,
  Users, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RideDriverProfileModal from "@/components/RideDriverProfileModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type SortMode = "time" | "seats";

type RideRow = {
  offer_id: number;
  departure_time: string;
  available_seats: number;
  status: string;
  notes: string | null;
  from_location_name: string;
  to_location_name: string;
  driver_user_id: number;
  driver_first_name: string;
  driver_last_name: string;
  driver_username: string;
  car_year: number | null;
  car_make: string | null;
  car_model: string | null;
  car_color: string | null;
  car_license_plate: string | null;
  driver_profile_photo_path?: string | null;
  car_photo_path?: string | null;
};

const RidesView = () => {
  const currentUserId = useMemo(() => {
    try {
      const raw = localStorage.getItem("stuber.user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return typeof parsed?.user_id === "number" ? parsed.user_id : null;
    } catch {
      return null;
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("time");
  const [showFilters, setShowFilters] = useState(false);
  const [rides, setRides] = useState<RideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<{
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    profilePhotoPath?: string | null;
    carYear: number | null;
    carMake: string | null;
    carModel: string | null;
    carColor: string | null;
    carLicensePlate: string | null;
    carPhotoPath?: string | null;
  } | null>(null);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/rides`);
      if (!response.ok) throw new Error("Failed to fetch rides");
      const data = await response.json();
      setRides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching rides:", error);
      toast.error("Failed to load rides");
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const filteredRides = useMemo(() => {
    let result = rides.filter(
      (r) =>
        (r.status || "").toLowerCase() === "active" &&
        (currentUserId == null || r.driver_user_id !== currentUserId)
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => {
        const from = (r.from_location_name || "").toLowerCase();
        const to = (r.to_location_name || "").toLowerCase();
        const driver = `${r.driver_first_name ?? ""} ${r.driver_last_name ?? ""}`.toLowerCase();
        return from.includes(q) || to.includes(q) || driver.includes(q);
      });
    }

    result.sort((a, b) => {
      if (sortMode === "seats") return (b.available_seats ?? 0) - (a.available_seats ?? 0);
      return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
    });

    return result;
  }, [rides, searchQuery, sortMode, currentUserId]);

  const handleRefresh = () => {
    fetchRides();
    toast("Rides refreshed", { description: `${filteredRides.length} rides available` });
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in px-4 py-6 pb-24">
      <RideDriverProfileModal
        open={isDriverModalOpen}
        onClose={() => {
          setIsDriverModalOpen(false);
          setSelectedDriver(null);
        }}
        driver={selectedDriver}
        upcomingRides={
          selectedDriver
            ? rides.filter((r) => r.driver_user_id === selectedDriver.userId)
            : []
        }
      />
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Available Rides</h1>
          <p className="text-sm text-muted-foreground">{filteredRides.length} rides near you</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-xs text-muted-foreground">
          Refresh
        </Button>
      </div>

      {/* Search & filters */}
      <div className="mt-4 mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search routes or drivers…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 transition-colors ${showFilters ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-xs font-medium text-muted-foreground">Sort by:</span>
            <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Departure Time</SelectItem>
                <SelectItem value="seats">Available Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading rides...</p>
          </div>
        )}
        {filteredRides.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No rides found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search or check back later.</p>
          </div>
        )}

        {!loading && filteredRides.map((ride, i) => {
          const driverName = `${ride.driver_first_name ?? ""} ${ride.driver_last_name ?? ""}`.trim() || ride.driver_username;
          const departureText = new Date(ride.departure_time).toLocaleString();
          const vehicleText = [ride.car_color, ride.car_year, ride.car_make, ride.car_model]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={ride.offer_id}
              className="animate-slide-up rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
            >
              {/* Route */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>{ride.from_location_name ?? "Unknown"}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>{ride.to_location_name ?? "Unknown"}</span>
                </div>
              </div>

              {/* Details grid */}
              <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <button
                    type="button"
                    className="text-foreground font-medium underline-offset-2 hover:underline transition-colors"
                    onClick={() => {
                      setSelectedDriver({
                        userId: ride.driver_user_id,
                        firstName: ride.driver_first_name,
                        lastName: ride.driver_last_name,
                        username: ride.driver_username,
                        profilePhotoPath: ride.driver_profile_photo_path,
                        carYear: ride.car_year,
                        carMake: ride.car_make,
                        carModel: ride.car_model,
                        carColor: ride.car_color,
                        carLicensePlate: ride.car_license_plate,
                        carPhotoPath: ride.car_photo_path,
                      });
                      setIsDriverModalOpen(true);
                    }}
                  >
                    {driverName}
                  </button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Shield className="h-3 w-3 text-primary" />
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Verified BYU Student</TooltipContent>
                  </Tooltip>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {departureText}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span className={(ride.available_seats ?? 0) <= 1 ? "text-destructive font-medium" : ""}>
                    {ride.available_seats} seat{ride.available_seats === 1 ? "" : "s"} available
                  </span>
                </span>
                <span className="flex items-center gap-1.5 col-span-2">
                  <Car className="h-3.5 w-3.5" />
                  {vehicleText || "Vehicle info unavailable"}
                  {ride.car_license_plate ? (
                    <>
                      {" · "}
                      <span className="font-mono text-foreground">{ride.car_license_plate}</span>
                    </>
                  ) : null}
                </span>
              </div>

              {/* Action */}
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  disabled={ride.available_seats === 0}
                  className="min-w-[80px] text-xs"
                  onClick={() =>
                    toast.info("Booking flow not wired yet", { description: "Rides are now loaded from the database." })
                  }
                >
                  Book Ride
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RidesView;
