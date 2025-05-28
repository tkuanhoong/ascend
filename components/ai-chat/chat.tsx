"use client";

import * as React from "react";
import { Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { CourseCard } from "../course/course-card";
import { CourseWithProgressWithCategory } from "@/data/course/get-home-courses";

interface ChatCardProps {
  onOpenChange: () => void;
}

export function ChatCard({ onOpenChange }: ChatCardProps) {
  //   const [open, setOpen] = React.useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `/api/ai/chat`,
  });

  const inputLength = input.trim().length;

  return (
    <>
      <Card className="mx-auto">
        <CardHeader className="flex items-center">
          <div className="flex items-center w-full">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Image" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">Ascend AI</p>
                <p className="text-sm text-muted-foreground mr-2">
                  State your interests and budget
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="ml-auto rounded-full"
              onClick={onOpenChange}
            >
              <X />
              <span className="sr-only">Close Ai Chat</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-72 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground text-end"
                    : "bg-muted"
                )}
              >
                {/* {message.role === "user" ? "User: " : "AI: "}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  }
                })} */}
                <p className="break-words">{message.content}</p>
                <div>
                  {message.parts.map((part) => {
                    switch (part.type) {
                      case "tool-invocation":
                        const { toolName, toolCallId, state } =
                          part.toolInvocation;

                        if (state === "result") {
                          if (toolName === "getRecommendCourses") {
                            const { result } = part.toolInvocation;
                            return (
                              <div key={toolCallId}>
                                Recommended courses:
                                <div className="grid grid-cols-3 gap-2 overflow-x-auto">
                                  {result.map(
                                    (e: CourseWithProgressWithCategory) => (
                                      <CourseCard
                                        key={e.id}
                                        course={e}
                                        progress={null}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          }
                        } else {
                          return (
                            <div key={toolCallId}>
                              {toolName === "getRecommendCourses" ? (
                                <div>Loading recommended courses...</div>
                              ) : (
                                <div>Loading...</div>
                              )}
                            </div>
                          );
                        }
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
