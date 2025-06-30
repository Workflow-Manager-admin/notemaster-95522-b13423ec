/**
 * Represents a Note entity in the application
 */
export interface Note {
    /** Unique identifier for the note */
    id: number;
    
    /** Title of the note */
    title: string;
    
    /** Content/body of the note */
    content: string;
    
    /** Timestamp when the note was created */
    created_at: Date;
    
    /** Timestamp when the note was last updated */
    updated_at: Date;
    
    /** ID of the user who owns this note (UUID from Supabase Auth) */
    user_id: string;
}
