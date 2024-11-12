import Link from "next/link";
import styles from "./Item.module.css";

type Class = {
    image: string,
    name: string,
    crn: number,
    classmates: String[]
}
interface ClassProps {
    class: Class;
    click: (now: Class) => void;
}

export default function Item(props: ClassProps) {
    let handler = () => {
        props.click(props.class);
    }

    return(
        
        <button onClick={handler}>{props.class.name}</button>
    );

}