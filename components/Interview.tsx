import { getRandomInterviewCover } from "@/utils";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import DisplayTech from "./DisplayTech";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const Interview = async ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const feedback =
    userId && id
      ? await getFeedbackByInterviewId({
          interviewId: id,
          userId,
        })
      : null;

  const formattedDate = dayjs(feedback?.createdAt || createdAt);
  const now = dayjs();
  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-400">
            <p className="badge-text">{normalizedType}</p>
          </div>
          <Image
            width={90}
            height={90}
            src={getRandomInterviewCover()}
            alt=""
            className="rounded-full object-fit size-[90px]"
          />
          <h3 className="mt-5 capitalize">{role} Interview</h3>
          <div className="flex flex-row gap-2 mt-3">
            <Image height={22} width={22} src="/calendar.svg" alt="" />
            <p>{now.format("YYYY-MM-DD")}</p>
            <div className="flex flex-row gap-2 items-center">
              <Image width={22} height={22} src="star.svg" alt="" />
              <p>{feedback?.totalScore}</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment || "You Havent taken the interview "}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <DisplayTech techStack={techstack} />
          <button className="btn-primary">
            <Link
              href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
            >
              {feedback ? "Check Feedback" : "Take now"}
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
