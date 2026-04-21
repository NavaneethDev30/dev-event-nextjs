import { Schema, model, models, type HydratedDocument, type Model } from "mongoose";

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

type EventDocument = HydratedDocument<IEvent>;
type EventModel = Model<IEvent>;

const nonEmptyString = {
  validator: (value: string): boolean => value.trim().length > 0,
  message: "{PATH} cannot be empty",
};

const nonEmptyStringArray = {
  validator: (value: string[]): boolean =>
    value.length > 0 && value.every((item) => item.trim().length > 0),
  message: "{PATH} must contain at least one non-empty value",
};

function createSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Event date must be a valid date");
  }

  // Store dates in ISO format so filtering and comparisons stay predictable.
  return parsedDate.toISOString();
}

function normalizeTime(value: string): string {
  const trimmedValue = value.trim();
  const timeMatch = trimmedValue.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);

  if (!timeMatch) {
    throw new Error("Event time must use HH:mm, H:mm AM, or H:mm PM format");
  }

  const [, rawHour, rawMinute, meridiem] = timeMatch;
  let hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (minute > 59 || hour < 0 || hour > (meridiem ? 12 : 23) || (meridiem && hour === 0)) {
    throw new Error("Event time must be a valid time");
  }

  if (meridiem) {
    const upperMeridiem = meridiem.toUpperCase();
    hour = upperMeridiem === "PM" && hour !== 12 ? hour + 12 : hour;
    hour = upperMeridiem === "AM" && hour === 12 ? 0 : hour;
  }

  // Store time in 24-hour HH:mm format for consistency across the app.
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

const eventSchema = new Schema<IEvent, EventModel>(
  {
    title: { type: String, required: true, trim: true, validate: nonEmptyString },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: true, trim: true, validate: nonEmptyString },
    overview: { type: String, required: true, trim: true, validate: nonEmptyString },
    image: { type: String, required: true, trim: true, validate: nonEmptyString },
    venue: { type: String, required: true, trim: true, validate: nonEmptyString },
    location: { type: String, required: true, trim: true, validate: nonEmptyString },
    date: { type: String, required: true, trim: true, validate: nonEmptyString },
    time: { type: String, required: true, trim: true, validate: nonEmptyString },
    mode: { type: String, required: true, trim: true, validate: nonEmptyString },
    audience: { type: String, required: true, trim: true, validate: nonEmptyString },
    agenda: { type: [String], required: true, validate: nonEmptyStringArray },
    organizer: { type: String, required: true, trim: true, validate: nonEmptyString },
    tags: { type: [String], required: true, validate: nonEmptyStringArray },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", function (this: EventDocument) {
  if (this.isModified("title")) {
    // Slugs are derived from the title and only refreshed when the title changes.
    this.slug = createSlug(this.title);
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

export const Event =
  (models.Event as EventModel | undefined) ?? model<IEvent, EventModel>("Event", eventSchema);
