export interface Reply {
    id: number,
    content_reply: string,
    reply_time: Date,
    upvote: number,
    user_id: number,
    comment_id: number,
    userName: string,
    imageSrc: string,
}