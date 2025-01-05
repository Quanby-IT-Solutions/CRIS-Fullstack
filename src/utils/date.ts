// src\utils\date.ts
export function formatDateTime(date: string | Date): string {
    const parsedDate = date instanceof Date ? date : new Date(date)

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsedDate)
}