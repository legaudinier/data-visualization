import styles from "./tooltip.module.css";

// Information needed to build the tooltip
export type InteractionData = {
    xPos: number;
    yPos: number;
    name: string;
    totals: number,
    date: number,
    time: any
};

type TooltipProps = {
    interactionData: InteractionData | null;
};

export const Tooltip = ({ interactionData }: TooltipProps) => {


    const convertTime = (time: any) => {
        let [hours, minutes] = time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Converts 0 to 12, and 13-23 to 1-11
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    if (!interactionData) {
        return null;
    }
    return (
        <div
            className={styles.tooltip}
            style={{
                left: interactionData.xPos,
                top: interactionData.yPos,
            }}
        >
            <div>
                Event: {interactionData?.name}
                <br />
                Time: {convertTime(interactionData.time)}
                <br />
                Duration: {`${Math.round(interactionData?.totals / 60)} minutes`}
            </div>
        </div>
    );
};
