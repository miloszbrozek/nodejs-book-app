export const exportTypeValues = ["epub", "pdf"] as const;
export type ExportType = typeof exportTypeValues[number];
export type ProcessingState = "pending" | "finished";

export interface ProcessableEntity {
    type: string;
    created_at: Date;
    updated_at?: Date;
    state: ProcessingState;
}

export interface Export extends ProcessableEntity{
    bookId: string;
    type: ExportType;
}

export const importTypeValues = ["word", "pdf", "wattpad", "evernote"] as const;
export type ImportType = typeof importTypeValues[number]

export interface Import extends ProcessableEntity{
    bookId: string;
    url: string;
    type: ImportType;
}