import React, { useState } from "react";
import { Button } from "../../@/components/ui/button"
import { buttonVariants } from "../../@/components/ui/button"
import { cn } from "../../@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../@/components/ui/dialog";
import { Input } from "../../@/components/ui/input"
import { Label } from "../../@/components/ui/label"
import Link from "next/link";

const Modal = ({ onClose}) => {
  const [key, setKey] = useState(null);

  const handleChange = (e) => {
    setKey(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("apiKey", key);
    process.env.API_KEY = key;
    onClose(key);
  };

  return (
    <div id="modal" >
    <Dialog > 
      <DialogTrigger asChild>
        <Button variant="destructive" ></Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Get your api token </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 px-4 ">
          <div className="grid items-center gap-1">
            <Label htmlFor="name" className="text-left">
              API Key
            </Label>
            <div className="flex w-full items-center space-x-2">
              <Input 
                type="text"
                placeholder=" Drop your replicate api key"
                value={key}
                onChange={handleChange}
               />
              <Button onClick={handleSubmit} type="submit" variant="destructive">Done!</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog> 

    //   {/* <h2>Enter your API key</h2>
    //   <input
    //     type="text"
    //     placeholder="API Key"
    //     value={key}
    //     onChange={handleChange}
    //   />
  //   <button onClick={handleSubmit}>Submit</button> */}

    </div>
  );
};

export default Modal;