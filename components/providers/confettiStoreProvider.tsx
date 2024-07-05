'use client'
import { useState } from "react";
import confettiContext from "@/context/confetti-context";
export const ConfettiStoreProvider = ({ children } : {children : React.ReactNode}) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <confettiContext.Provider value={{ isOpen, setIsOpen}}>
        {children}
      </confettiContext.Provider>
    );
  };
  