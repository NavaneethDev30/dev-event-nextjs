'use client';

import { ArrowDown } from "lucide-react";

const Explorebtn = () => {
  return (
    <button className="mt-3 mx-auto" type="button" id="explore-btn">
    <a href="#events">
      Explore Events
      <ArrowDown aria-hidden="true" className="ml-0.5 mt-1" size={20} />
      </a>
    </button>
      

  )
}

export default Explorebtn

