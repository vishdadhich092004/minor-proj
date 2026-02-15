declare module 'jspdf-autotable' {
    import { jsPDF } from 'jspdf';

    interface AutoTableOptions {
        startY?: number;
        head?: string[][];
        body?: (string | number)[][];
        [key: string]: any;
    }

    export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
