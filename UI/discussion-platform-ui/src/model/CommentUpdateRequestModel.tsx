export interface CommentUpdateRequestModel {
    id: number;
    content_comment?: string;
    comment_time?: Date;
    upvote: number;
    user_id?: number;
}