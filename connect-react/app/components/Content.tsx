"use client";
import { useState } from "react";
import ItemContainer from "./ItemContainer";
import Chat from "./Chat";

type User ={
    id: string,
    username: string,
    email: string,
    password: string,
}

type Class = {
    _id: string,
    name: string,
    title: string,
    professor: string,
    period: string,
    image: string,
    list: User[],
}

interface ContentProps {
    classes: Class[],
}
const DEFAULT: Class ={
    _id: "0",
    name: "",
    title: "",
    professor: "",
    period: "",
    image: "",
    list: [],
}

export default function Content(props: ContentProps) {
    const[currentClass, changeClass] = useState<Class>(DEFAULT);

    return(
        <div>
            <ItemContainer class={currentClass}/>
            <Chat class={currentClass}/>
        </div>
    );
}
/*
"use client";
import { useState } from "react";
import ItemContainer from "./ItemContainer";


type Class = {
    image: string,
    name: string,
    crn: number,
    classmates: String[]
}

interface ContentProps {
    currentClass: Class;
}

export default function Content(props: ContentProps) {
    return(
        <ItemContainer class={props.currentClass}/>
    );
}
*/