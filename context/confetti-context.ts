import { createContext, Dispatch, SetStateAction } from "react";



type confettiContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const confettiContext = createContext<confettiContextType>({
  isOpen : false ,
  setIsOpen : () => null
});



export default confettiContext