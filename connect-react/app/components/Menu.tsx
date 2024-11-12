"use client";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";
import styles from "./Menu.module.css";
import Item from "./Item";
import Link from "next/link";

type Class = {
    image: string,
    name: string,
    crn: number,
    classmates: String[]
}

const DUMMY: Class[] = [
    {
        image: "https://media.istockphoto.com/id/506670795/vector/red-apple.jpg?s=612x612&w=0&k=20&c=lF9vQ-kQPv3StsSFND4Okt1yqEO86q2XWFECgn0AqWU=",
        name: "Web Programming",
        crn: 363636,
        classmates: ["Tim", "Bobby", "Joanne"]
    },
    {
        image: "https://media.istockphoto.com/id/506670795/vector/red-apple.jpg?s=612x612&w=0&k=20&c=lF9vQ-kQPv3StsSFND4Okt1yqEO86q2XWFECgn0AqWU=",
        name: "Data Structures",
        crn: 636363,
        classmates: ["Tim", "Bobby", "Joanne"]
    },
    {
        image: "https://media.istockphoto.com/id/506670795/vector/red-apple.jpg?s=612x612&w=0&k=20&c=lF9vQ-kQPv3StsSFND4Okt1yqEO86q2XWFECgn0AqWU=",
        name: "Web Programming",
        crn: 999999,
        classmates: ["Tim", "Bobby", "Joanne"]
    },
]

interface MenuProps {
    onClick: (now: Class)=> void;
}

export default function Menu(props: MenuProps) {
    const[isClicked, changeClick] = useState<Boolean>(false);

    const click = () => {
        changeClick((prev) => !prev);
    }

    if(isClicked) {
        return(
            <div className={styles.clicked}>
                <FaBars className={styles.icon} onClick={click}/>
                <ul className={styles.classList}>
                    {DUMMY.map((current, i) => <li><Item class={current} click={props.onClick}></Item></li>)}
                    <li><Link className={styles.link} href={"/"}>+ Add New Class</Link></li>
                </ul>    
            </div>
        );
    } else {
        return(
            <div className={styles.clickedoff}>
                <FaBars className={styles.icon} onClick={click}/>
            </div>
        );
    }
}