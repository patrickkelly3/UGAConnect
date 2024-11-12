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