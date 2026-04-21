import { Schema, Types, model, models, type HydratedDocument, type Model } from "mongoose";
import { Event } from "./event.model";

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingDocument = HydratedDocument<IBooking>;
type BookingModel = Model<IBooking>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<IBooking, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => emailPattern.test(value),
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function (this: BookingDocument) {
  if (!this.isModified("eventId")) {
    return;
  }

  // Confirm the booking points at a real event before it is persisted.
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error("Cannot create booking for a non-existent event");
  }
});

export const Booking =
  (models.Booking as BookingModel | undefined) ??
  model<IBooking, BookingModel>("Booking", bookingSchema);
