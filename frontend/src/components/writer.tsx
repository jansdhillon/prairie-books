import Typewriter from "typewriter-effect";
import React from "react";

const Writer = ({ text, className }: { text: string, className?: string }) => {
  return (
    <div className={className}>
      <Typewriter
      options={{
        cursorClassName: className + " opacity-0",
        cursor: "",
      }}
        onInit={(typewriter) => {
          typewriter.typeString(text).pauseFor(100).changeDelay(100).start();
        }}
      />
    </div>
  );
};

export default Writer;
