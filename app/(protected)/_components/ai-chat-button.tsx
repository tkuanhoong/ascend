"use client";

import { ChatCard } from "@/components/ai-chat/chat";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bot } from "lucide-react";
import { useState } from "react";

export const AiChatButton = () => {
  const [isOpenChat, setIsOpenChat] = useState(false);
  const toggleIsOpenChat = () => setIsOpenChat((current) => !current);
  const isMobile = useIsMobile();
  return (
    <div className="fixed z-50 bottom-0 right-0 rounded-lg max-w-[90%] md:max-w-[60%] mb-5 mr-5">
      {isOpenChat ? (
        <ChatCard onOpenChange={toggleIsOpenChat} />
      ) : (
        <Button onClick={toggleIsOpenChat}>
          <Bot />
          {!isMobile && "Reccomendation Assistant"}
        </Button>
      )}
    </div>
  );
};
