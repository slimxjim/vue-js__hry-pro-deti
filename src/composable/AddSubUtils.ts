

export enum ESignType {
    PLUS,
    MINUS,
    PLUS_MINUS
}

export function getSign(sign: ESignType): string {
    switch (sign) {
        case ESignType.PLUS:
            return '+';
        case ESignType.MINUS:
            return '-';
        case ESignType.PLUS_MINUS:
            return Math.random() > 0.5 ? '+' : '-';
    }
}

export function printSign(sign: ESignType): string {
    switch (sign) {
        case ESignType.PLUS:
            return '+';
        case ESignType.MINUS:
            return '-';
        case ESignType.PLUS_MINUS:
            return '+/-';
    }
}

export interface Interval {
    min: number;
    max: number;
}

export interface Criteria {
    name: string,
    intervalA: Interval;
    sign: ESignType;
    intervalB: Interval;
    intervalResult: Interval;
}

export function getCrieteriaInfo(criteria: Criteria): string {
    // return criteria.name + ': ' +
    return `${criteria.name}: <${criteria.intervalA.min}, ${criteria.intervalA.max}> ${printSign(criteria.sign)} <${criteria.intervalB.min}, ${criteria.intervalB.max}> = <${criteria.intervalResult.min}, ${criteria.intervalResult.max}>`;
}

export interface Equation {
    numA: number,
    numB: number,
    sign: string,
    result: number,
}

export interface HistoryRecord {
    equation: Equation | null,
    question: string,
    userAnswer: number | undefined,
    correctAnswer: number | null,
    isCorrect: boolean | null,
    playerName: string,
}

export function padWithNonBreakingSpaces(index: number, totalPlaces: number): string {
    const indexStr = index.toString();
    const nonBreakingSpace = '\u00A0'; // Unicode pro tvrdou mezeru (&nbsp;)

    // Pokud je délka indexu menší než požadovaný počet míst, doplní tvrdé mezery
    if (indexStr.length < totalPlaces) {
        const spacesToAdd = totalPlaces - indexStr.length;
        return nonBreakingSpace.repeat(spacesToAdd) + indexStr;
    }

    return indexStr; // Pokud je index již větší nebo rovný požadovanému počtu míst, vrátí se tak jak je
}