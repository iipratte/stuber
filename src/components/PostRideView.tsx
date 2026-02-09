import { useState } from "react";
import { MapPin, Calendar, Clock, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PostRideViewProps {
  onComplete: () => void;
}

const PostRideView = ({ onComplete }: PostRideViewProps) => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState("3");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Ride posted successfully!", {
        description: `${departure} → ${destination}`,
      });
      onComplete();
    }, 1500);
  };

  const handleCancel = () => {
    onComplete();
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in px-4 py-6">
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Post a Ride</h1>
      <p className="mb-6 text-sm text-muted-foreground">Share your route with fellow riders</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Departure Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              placeholder="e.g. Campus Plaza"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="pl-10"
              required
            />
            {departure && (
              <button type="button" onClick={() => setDeparture("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
            <Input
              placeholder="e.g. Marriott Center"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
              required
            />
            {destination && (
              <button type="button" onClick={() => setDestination("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Available Seats</Label>
          <Input
            type="number"
            min="1"
            max="6"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Posting…" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostRideView;
