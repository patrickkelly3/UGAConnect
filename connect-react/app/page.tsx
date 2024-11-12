"use client";
import Nav from "./components/Nav";
import Menu from "./components/Menu";
import Content from "./components/Content"
import { useState } from "react";


type Class = {
  image: string,
  name: string,
  crn: number,
  classmates: String[]
}
const DUMMY: Class = {
  image: "https://media.istockphoto.com/id/506670795/vector/red-apple.jpg?s=612x612&w=0&k=20&c=lF9vQ-kQPv3StsSFND4Okt1yqEO86q2XWFECgn0AqWU=",
  name: "Web Programming",
  crn: 363636,
  classmates: ["Tim", "Bobby", "Joanne"]
}

export default function Home() {
  const[currentClass, changeClass] = useState(DUMMY);

  let update = (now: Class) => {
      changeClass(now);
  }

  return (
    <div>
      <Menu onClick={update}/>
      <Nav/>
      <Content currentClass={currentClass}/>
    </div>
  );
}
