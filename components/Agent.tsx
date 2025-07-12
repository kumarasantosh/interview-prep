"use client";
import { cn } from "@/utils";
import Image from "next/image";

//
import { vapi } from "@/lib/vapi.sdk";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
  ACTIVE = "ACTIVE",
}
//
interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
const Agent = ({
  username,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const router = useRouter();

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("error", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
    if (callStatus === CallStatus.FINISHED) router.push("/");
  }, [messages, callStatus, type, userId]);
  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log("generate feedback here");
    const { success, feedbackId: id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
    });
    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      router.push("/");
    }
  };
  const handleCall = async () => {
    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      console.error("VAPI workflow ID is missing");
      return;
    }

    setCallStatus(CallStatus.CONNECTING);
    if (type === "generate") {
      await vapi.start(workflowId, {
        variableValues: { username: username, userid: userId },
      });
    } else {
      let formatedQuestions = "";
      if (questions) {
        formatedQuestions = questions
          .map((question) => `-${question}`)
          .join("\n");
      }
      await vapi.start(interviewer, {
        variableValues: {
          questions: formatedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMassage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || CallStatus.FINISHED;

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
              key={latestMassage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMassage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus != "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping opacity-75",
                callStatus === "ACTIVE" && "hidden"
              )}
            />
            <span>{isCallInactiveOrFinished ? "Call" : "..."}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            end
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
