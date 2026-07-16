import { useState } from "react";
import { ChatIcon } from "./ChatIcon";
import { ChatWidget } from "./ChatWidget";

export function ChatContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatIcon onClick={() => setIsOpen(true)} isOpen={isOpen} />
      <ChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
