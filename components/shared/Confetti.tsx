"use client";

import  useConfettiStore  from "@/context/confetti-context";
import { useContext } from "react";
import ReactConfetti from "react-confetti";


export const Confetti = () => {
  const {isOpen , setIsOpen} = useContext(useConfettiStore);

  if (!isOpen) return null;

  return (
    <ReactConfetti
      className="pointer-events-none z-[100]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        setIsOpen(false)
      }}
    />
  )
}