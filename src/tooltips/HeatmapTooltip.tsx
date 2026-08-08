import styles from "./tooltip.module.css";

// Information needed to build the tooltip
export type InteractionData = {
    x: string;
    y: string;
    xPos: number;
    yPos: number;
    value: number;
};

type TooltipProps = {
    interactionData: InteractionData | null;
};
export const HeatapTooltip = ({ interactionData }: TooltipProps) => {
    if (!interactionData) {
        return null;
    }
    
    return (
        <div
            className={styles.tooltip}
            style={{
                left: interactionData.xPos,
                top: interactionData.yPos + 275,
            }}
        >
            <div>
                {interactionData.value === 0 ? 'Missing Data' :
                    `${Math.round((interactionData.value) / 60)} minutes`}
            </div>
        </div>
    );
};
