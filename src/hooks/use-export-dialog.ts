"use client";

import { toast } from "sonner";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export const useExportDialog = <T extends Record<string, unknown>>(
    data: T[],
    setChartTypeAction: (type: string) => void,
    title?: string
) => {
    const isMarriageData: boolean =
        data.length > 0 && "totalMarriages" in data[0];

    const handleChartTypeChange = (value: string): void => {
        if (!isMarriageData) {
            setChartTypeAction(value);
        }
    };

    // Safe title function that handles undefined/null cases.
    const getSafeTitle = (): string => {
        if (!title || typeof title !== "string" || title.trim() === "") {
            // Determine default title based on data type
            if (data.length > 0) {
                if ("totalMarriages" in data[0]) return "Marriage Registrations";
                if ("totalBirths" in data[0]) return "Birth Registrations";
                if ("totalDeaths" in data[0]) return "trations";
            }
            return "Data Export";
        }
        return title;
    };

    const getFileNamePrefix = (): string => {
        const safeTitle = getSafeTitle();
        return safeTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    };

    // Use the captured data in these functions.
    const exportToCSV = (): void => {
        try {
            const safeTitle = getSafeTitle();
            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

            const link = document.createElement("a");
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filename = `${getFileNamePrefix()}_${timestamp}.csv`;

            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            toast.success(`${safeTitle} exported as ${filename}`);
        } catch (error) {
            console.error("CSV export failed:", error);
            toast.error("Failed to export CSV");
        }
    };

    const exportToExcel = (): void => {
        try {
            const safeTitle = getSafeTitle();
            // Create worksheet from the captured data.
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, safeTitle);

            // Convert to array buffer.
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const link = document.createElement("a");
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filename = `${getFileNamePrefix()}_${timestamp}.xlsx`;

            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            toast.success(`${safeTitle} exported as ${filename}`);
        } catch (error) {
            console.error("Excel export failed:", error);
            toast.error("Failed to export Excel file");
        }
    };

    const exportToPDF = async (
        chartElement: HTMLElement | null = null
    ): Promise<void> => {
        try {
            const safeTitle = getSafeTitle();
            const doc = new jsPDF();
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filename = `${getFileNamePrefix()}_${timestamp}.pdf`;

            // Add title.
            doc.setFontSize(16);
            doc.text(safeTitle, 20, 20);

            if (chartElement) {
                const tooltipElements = chartElement.querySelectorAll(
                    ".recharts-tooltip-wrapper"
                );
                tooltipElements.forEach((tooltip) => {
                    if (tooltip instanceof HTMLElement) {
                        tooltip.style.display = "none";
                    }
                });

                chartElement.classList.add("exporting");

                const canvas = await html2canvas(chartElement, {
                    backgroundColor: null,
                    scale: 2,
                    logging: false,
                    ignoreElements: (element: Element): boolean =>
                        element.classList.contains("recharts-tooltip-wrapper") ||
                        element.classList.contains("recharts-active"),
                });

                tooltipElements.forEach((tooltip) => {
                    if (tooltip instanceof HTMLElement) {
                        tooltip.style.display = "";
                    }
                });

                chartElement.classList.remove("exporting");

                const chartImage = canvas.toDataURL("image/png");
                doc.addImage(chartImage, "PNG", 20, 30, 170, 100);
            }

            // Convert each value to a string (or empty string if null/undefined).
            const headers: string[] = Object.keys(data[0] ?? {});
            const rows: string[][] = data.map((item) =>
                Object.values(item).map((val) => (val != null ? String(val) : ""))
            );

            autoTable(doc, {
                head: [headers],
                body: rows,
                startY: chartElement ? 140 : 30,
                margin: { top: 20 },
                styles: { fontSize: 8 },
                theme: "grid",
            });

            doc.save(filename);
            toast.success(`${safeTitle} exported as ${filename}`);
        } catch (error) {
            console.error("PDF export failed:", error);
            toast.error("Failed to export PDF");
        }
    };

    return {
        isMarriageData,
        handleChartTypeChange,
        exportToCSV,
        exportToExcel,
        exportToPDF,
    };
};

/**
 * A hook for exporting charts.
 */
export const useChartExport = (): {
    exportChart: (chartElement: HTMLElement, chartType: string, title?: string) => Promise<void>;
} => {
    const exportChart = async (
        chartElement: HTMLElement,
        chartType: string,
        title?: string
    ): Promise<void> => {
        try {
            if (!chartElement) {
                toast.error("No chart found to export.");
                return;
            }
            const safeTitle = title?.trim() || "Chart";
            const tooltipElements = chartElement.querySelectorAll(".recharts-tooltip-wrapper");
            tooltipElements.forEach((tooltip) => {
                if (tooltip instanceof HTMLElement) {
                    tooltip.style.display = "none";
                }
            });
            chartElement.classList.add("exporting");
            const canvas = await html2canvas(chartElement, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                ignoreElements: (element: Element): boolean =>
                    element.classList.contains("recharts-tooltip-wrapper") ||
                    element.classList.contains("recharts-active"),
            });
            tooltipElements.forEach((tooltip) => {
                if (tooltip instanceof HTMLElement) {
                    tooltip.style.display = "";
                }
            });
            chartElement.classList.remove("exporting");
            const dataUrl = canvas.toDataURL("image/png");
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filePrefix = safeTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_");
            const filename = `${filePrefix}_${chartType}_chart_${timestamp}.png`;
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`${safeTitle} chart exported as ${filename}`);
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export chart.");
        }
    };

    return { exportChart };
};
