import Image from 'next/image';
import styles from "./Item.module.css";

type Class = {
    image: string,
    name: string,
    crn: number,
    classmates: String[]
}

interface ClassProps {
    class: Class
}

export default function Item(props: ClassProps) {
    return(
        <div className={styles.container}>
            <Image className={styles.image}
                src={props.class.image}
                alt={props.class.name} 
                width={100} 
                height={100}
                priority
            />
            <h1>{props.class.name} CRN#{props.class.crn}</h1>
            <header>Classmates:</header>
            <ul>
                {props.class.classmates.map((current, i) => <li>{current}</li>)}
            </ul>
        </div>
    );
}