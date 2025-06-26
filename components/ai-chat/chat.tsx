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
import { useEffect, useRef } from "react";

interface ChatCardProps {
  onOpenChange: () => void;
}

export function ChatCard({ onOpenChange }: ChatCardProps) {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: `/api/ai/chat`,
  });

  // Ref to keep the chat scrolled to the bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    append({
      role: "system",
      content:
        "Hi, I am Ascend AI. I will recommend the courses based on your criteria. Simply state your interests and budget.",
    });
  }, [append]);

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
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="ml-auto rounded-full"
              onClick={onOpenChange}
            >
              <X />
              <span className="sr-only">Close AI Chat</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-96 min-h-[100px] overflow-y-auto p-4 space-y-4 dark:bg-gray-800 rounded-md max-w-sm">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex md:max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground text-end"
                  : "bg-muted"
              )}
            >
              <p className="break-words">{message.content}</p>
              <div className="grid grid-cols-1 w-full">
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
                              {!result.length
                                ? "There are no available courses that match your criteria."
                                : "Recommended courses:"}

                              {!!result.length && (
                                <div>
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
                              )}
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
          <div ref={messagesEndRef} /> {/* Scroll target */}
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
