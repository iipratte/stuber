import { useState, useMemo } from "react";
import {
  MapPin, Clock, ArrowRight, Check, User, Star, Car,
  Search, SlidersHorizontal, ChevronDown, Loader2,
  Users, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAppState, type BookingStatus } from "@/store/AppContext";
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

type SortMode = "time" | "seats" | "rating";

const RidesView = () => {
  const { rides, bookings, bookRide, getDriver, getLocation } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("time");
  const [showFilters, setShowFilters] = useState(false);

  const filteredRides = useMemo(() => {
    let result = rides.filter((r) => r.availableSeats > 0 || bookings.has(r.id));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => {
        const from = getLocation(r.fromLocationId)?.name.toLowerCase() ?? "";
        const to = getLocation(r.toLocationId)?.name.toLowerCase() ?? "";
        const driver = getDriver(r.driverId)?.name.toLowerCase() ?? "";
        return from.includes(q) || to.includes(q) || driver.includes(q);
      });
    }

    result.sort((a, b) => {
      if (sortMode === "seats") return b.availableSeats - a.availableSeats;
      if (sortMode === "rating") {
        const rA = getDriver(a.driverId)?.rating ?? 0;
        const rB = getDriver(b.driverId)?.rating ?? 0;
        return rB - rA;
      }
      return a.departureTime.localeCompare(b.departureTime);
    });

    return result;
  }, [rides, searchQuery, sortMode, bookings, getDriver, getLocation]);

  const handleBook = (rideId: number) => {
    bookRide(rideId);
    const ride = rides.find((r) => r.id === rideId);
    const from = getLocation(ride?.fromLocationId ?? "")?.name;
    const to = getLocation(ride?.toLocationId ?? "")?.name;
    toast.info("Booking requested", {
      description: `${from} → ${to} — awaiting confirmation…`,
    });

    setTimeout(() => {
      toast.success("Ride confirmed!", {
        description: `${from} → ${to} is confirmed.`,
      });
    }, 2200);
  };

  const getStatusBadge = (status: BookingStatus | undefined) => {
    if (!status) return null;
    if (status === "pending")
      return (
        <Badge variant="outline" className="border-warning bg-warning-muted text-warning-foreground gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Pending
        </Badge>
      );
    return (
      <Badge variant="outline" className="border-primary bg-accent text-accent-foreground gap-1">
        <Check className="h-3 w-3" />
        Confirmed
      </Badge>
    );
  };

  const handleRefresh = () => {
    toast("Rides refreshed", { description: `${filteredRides.length} rides available` });
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in px-4 py-6 pb-24">
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
                <SelectItem value="rating">Driver Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Ride cards */}
      <div className="space-y-3">
        {filteredRides.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No rides found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search or check back later.</p>
          </div>
        )}

        {filteredRides.map((ride, i) => {
          const driver = getDriver(ride.driverId);
          const from = getLocation(ride.fromLocationId);
          const to = getLocation(ride.toLocationId);
          const booking = bookings.get(ride.id);
          const isBooked = !!booking;

          return (
            <div
              key={ride.id}
              className="animate-slide-up rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
            >
              {/* Route */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>{from?.name ?? "Unknown"}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>{to?.name ?? "Unknown"}</span>
                </div>
              </div>

              {/* Details grid */}
              <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span className="text-foreground font-medium">{driver?.name}</span>
                  {driver?.verified && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Shield className="h-3 w-3 text-primary" />
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">Verified BYU Student</TooltipContent>
                    </Tooltip>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {ride.departureTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  {driver?.rating.toFixed(1)} ({driver?.totalRides} rides)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span className={ride.availableSeats <= 1 ? "text-destructive font-medium" : ""}>
                    {ride.totalSeats - ride.availableSeats}/{ride.totalSeats} seats full
                  </span>
                </span>
                <span className="flex items-center gap-1.5 col-span-2">
                  <Car className="h-3.5 w-3.5" />
                  {driver?.vehicle.color} {driver?.vehicle.make} {driver?.vehicle.model} · <span className="font-mono text-foreground">{driver?.vehicle.licensePlate}</span>
                </span>
              </div>

              {/* Action */}
              <div className="flex items-center justify-end gap-2">
                {isBooked ? (
                  getStatusBadge(booking?.status)
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleBook(ride.id)}
                    disabled={ride.availableSeats === 0}
                    className="min-w-[80px] text-xs"
                  >
                    Book Ride
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RidesView;
