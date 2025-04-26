"use client";

import DashBoard from "./components/DashBoard";
import NewBoardMenu from "./components/NewBoardMenu";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DashBoard setOpen={setOpen} />
      <NewBoardMenu open={open} setOpen={setOpen} />
    </div>
  );
}
