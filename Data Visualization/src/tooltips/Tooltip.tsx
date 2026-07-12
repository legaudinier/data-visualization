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
                {interactionData?.name}
                <br />
                {interactionData.time < 12 ? (`${interactionData.time} PM`) : (`${interactionData.time} AM`)}
                <br />
                {`${Math.round(interactionData?.totals / 60)} minutes`}
            </div>
        </div>
    );
};
