import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
  priority?: boolean;
}

const EventCard = ({
  title,
  image,
  slug,
  location,
  date,
  time,
  priority = false,
}: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-row items-center gap-2">
        <MapPin aria-hidden="true" size={14} />
        <p>{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime">
        <div>
          <Calendar aria-hidden="true" size={14} />
          <p>{date}</p>
        </div>
        <div>
          <Clock aria-hidden="true" size={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
