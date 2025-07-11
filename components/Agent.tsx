import { cn } from "@/utils";
import Image from "next/image";
import React from "react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
  ACTIVE = "ACTIVE",
}
const Agent = ({ username }: AgentProps) => {
  const callStatus = CallStatus.FINISHED;
  const isSpeaking = true;
  const messages = ["whats your name?", "whats your name?"];
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              height={65}
              width={30}
              src="/ai-avatar.png"
              alt=""
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>Ai interviewr</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              width={540}
              height={540}
              src="/user-avatar.png"
              alt=""
              className="object-cover size-[120px]"
            />
            <h3>{username}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={messages[messages.length - 1]}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {messages[messages.length - 1]}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus != "ACTIVE" ? (
          <button className="relative btn-call">
            <span
              className={cn(
                "absolute animate-ping opacity-75",
                (callStatus === "ACTIVE") & "hidden"
              )}
            />
            <span>
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">end</button>
        )}
      </div>
    </>
  );
};

export default Agent;
