import Interview from "@/components/Interview";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewByUserId,
  getInterviewById,
  getLatestInterviews,
} from "@/lib/actions/general.action";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  console.log(user.id);
  const [userInterviews, latestInterview] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! }),
  ]);
  const pastInterviews = userInterviews?.length > 0;
  const hasUpcommingInterviews = latestInterview?.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Get Interview-Ready with Ai-powered Practice && instant Feedback
          </h2>
          <p>Practice on real interviews questions and get instant feedback</p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start An Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          width={400}
          height={400}
          alt=""
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 mt-6">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {pastInterviews ? (
            userInterviews?.map((interview) => (
              <Interview {...interview} key={interview.id} />
            ))
          ) : (
            <p>You havent taken any interview</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an interview</h2>
        <div className="interviews-section">
          {hasUpcommingInterviews ? (
            latestInterview?.map((interview) => (
              <Interview {...interview} key={interview.id} />
            ))
          ) : (
            <p>There are no new interviews</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
