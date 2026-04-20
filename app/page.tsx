import EventCard from "@/components/EventCard";
import Explorebtn from "@/components/explorebtn";
import { events } from "@/lib/constants";


function Page()  {
  return (
    <section>  
      <h1 className="text-center">The ultimate place for every Dev Events</h1> <br/>
      <p className="text-center">Hackathons,meetups and conferences. All in one</p>
      <Explorebtn/>
      <div id="events" className="mx-auto mt-40 w-full max-w-7xl">
          <h3>Featured Events</h3>
          <ol className="events mt-6 list-none">
            {events.map((event, index)=>(
              <li key={event.title}>
                  <EventCard {...event} priority={index === 0}/>
              </li>
            ))}
          </ol>
      </div>
    </section>
  )
}

export default Page;
