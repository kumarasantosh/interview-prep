import { getTechLogos } from "@/utils";
import Image from "next/image";
import React from "react";
import { cn } from "../lib/utils";

//

const DisplayTech = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);
  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => {
        return (
          <div
            key={tech}
            className={cn(
              "relative group bg-dark-300 rounded-full p-2",
              index >= 1 && "-ml-3"
            )}
          >
            <span className="tech-tooltip">{tech}</span>
            <Image
              width={100}
              height={100}
              src={url}
              alt=""
              className="size-5"
            />
          </div>
        );
      })}
    </div>
  );
};

export default DisplayTech;
