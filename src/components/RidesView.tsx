import { useState } from "react";
import { MapPin, Clock, ArrowRight, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ridesData = [
  { id: 1, from: "The Village", to: "RB Parking Lot", time: "10:00 AM", driver: "Alex M.", seats: 3 },
  { id: 2, from: "Liberty Square", to: "Tanner Building", time: "10:15 AM", driver: "Sarah K.", seats: 2 },
  { id: 3, from: "Campus Plaza", to: "Marriott Center", time: "10:30 AM", driver: "James L.", seats: 4 },
  { id: 4, from: "Life Science Building", to: "Glenwood", time: "11:00 AM", driver: "Emily R.", seats: 1 },
  { id: 5, from: "Old Academy", to: "Tanner Building", time: "11:15 AM", driver: "David W.", seats: 3 },
  { id: 6, from: "Heritage", to: "Liberty Square", time: "11:30 AM", driver: "Rachel T.", seats: 2 },
  { id: 7, from: "Stadium", to: "Heritage", time: "12:00 PM", driver: "Chris B.", seats: 4 },
];

const RidesView = () => {
  const [bookedIds, setBookedIds] = useState<Set<number>>(new Set());

  const handleBook = (ride: typeof ridesData[0]) => {
    setBookedIds((prev) => new Set(prev).add(ride.id));
    toast.success(`Ride booked!`, {
      description: `${ride.from} → ${ride.to} at ${ride.time}`,
    });
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in px-4 py-6">
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Available Rides</h1>
      <p className="mb-6 text-sm text-muted-foreground">Find and book your next ride</p>

      <div className="space-y-3">
        {ridesData.map((ride, i) => {
          const booked = bookedIds.has(ride.id);
          return (
            <div
              key={ride.id}
              className="animate-slide-up rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div className="mb-3 flex items-center gap-2 text-base font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{ride.from}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{ride.to}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {ride.driver}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {ride.time}
                  </span>
                  <span className="text-xs">{ride.seats} seat{ride.seats > 1 ? "s" : ""}</span>
                </div>
                <Button
                  size="sm"
                  variant={booked ? "outline" : "default"}
                  disabled={booked}
                  onClick={() => handleBook(ride)}
                  className={`min-w-[80px] text-xs ${booked ? "border-primary text-primary" : ""}`}
                >
                  {booked ? (
                    <>
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Confirmed
                    </>
                  ) : (
                    "Book"
                  )}
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
