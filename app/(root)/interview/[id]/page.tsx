import Agent from "@/components/Agent";
import DisplayTech from "@/components/DisplayTech";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: RouteParams) => {
  const user = await getCurrentUser();
  const { id } = await params;
  const interview = await getInterviewById(id);
  if (!interview) redirect("/");
  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              width={40}
              height={40}
              src={getRandomInterviewCover()}
              alt=""
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} interview</h3>
          </div>
          <DisplayTech techStack={interview.techstack} />
        </div>
        <p>{interview.type}</p>
      </div>
      <Agent
        userName={user?.name}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </>
  );
};

export default page;
