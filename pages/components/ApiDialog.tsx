import React, { useState } from "react";
// import { useRouter } from 'next/router';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Input } from "../../@/components/ui/input";
import Link from "next/link";

const Modal = ({ onClose, onSubmit }) => {
  const [key, setKey] = useState(null);
  // const router = useRouter();

  const handleChange = (e) => {
    e.preventDefault();
    setKey(e.target.value);
    // console.log(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(key);
    // router.push({
    //   pathname: '/',
    //   query: { apiKey },
    // });
    if (key) {
      onSubmit(key);
      onClose();
    }
  };
  
  return (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="text-destructive shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
        ADD API
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 backdrop-blur-[5px]" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-secondary p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none shadow-md">
        <Dialog.Description className="text-primary mt-[10px] mb-5 text-[15px] leading-normal">
        <span>Add your API key from</span>{" "}
          <Link href="https://replicate.com/account/api-tokens"
          target="_blank"
          className="text-purple-400" 
          >
          replicate.com/account/api-tokens
          </Link>
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <Input
              type="text"
              placeholder="  Drop your API Key here"
              value={key}
              onChange={handleChange}
            />
          </fieldset>
          <div className="mt-[25px] flex justify-end">
            {/* <Dialog.Close asChild> */}
              <button  type="submit" className="bg-primary text-secondary hover:bg-green focus:shadow-green7 rounded-lg inline-flex h-[35px] items-center justify-center px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Submit
              </button>
            {/* </Dialog.Close> */}
          </div>
        </form>
        {/* <Dialog.Close asChild>
          <button
            onClick={onClose}
            className="text-violet11 hover:bg-violet4 hover:font-bold focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <Cross2Icon />
          </button>
        </Dialog.Close> */}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
}

export default Modal;
