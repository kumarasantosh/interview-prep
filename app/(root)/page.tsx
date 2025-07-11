import Interview from "@/components/Interview";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
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
          {dummyInterviews.map((i) => {
            return <Interview {...i} key={i.id} />;
          })}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((i) => {
            return <Interview {...i} key={i.id} />;
          })}
        </div>
      </section>
    </>
  );
};

export default page;
