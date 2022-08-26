import { Reply } from "./Reply";

export interface Comment {
    id: number;
    content_comment: string;
    comment_time: Date;
    upvote: number;
    user_id: number;
    comment_id: number;
    userName: string;
    imageSrc: string;
    replies: Reply[];
}