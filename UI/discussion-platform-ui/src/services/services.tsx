import axios, { AxiosResponse } from "axios"
import { Comment } from "../model/Comment";
import { CommentRequestModel } from "../model/CommentRequestModel";
import { CommentUpdateRequestModel } from "../model/CommentUpdateRequestModel";
import { LoginRequestModel } from "../model/LoginRequestModel";
import { LoginResponseModel } from "../model/LoginResponseModel";
import { ReplyRequestModel } from "../model/ReplyRequestModel";
import { ReplyUpdateRequestModel } from "../model/ReplyUpdateRequestModel";

export default class services {

    readonly baseApiUrl = "http://localhost:5000";
    readonly userUrl = this.baseApiUrl + "/users";
    readonly commentUrl = this.baseApiUrl + "/comments";
    readonly replyUrl = this.baseApiUrl + "/replies";

    checkLogin(user: LoginRequestModel): Promise<AxiosResponse<LoginResponseModel, boolean>> {
        return axios.post(this.userUrl + '/checkLogin', user);
    }

    getAllFeed() {
        return axios.get(this.userUrl + '/getfeed');
    }

    // getUserById(id: any) {
    //     return axios.get(this.userUrl + '/' + id);
    // }

    addComment(comment: CommentRequestModel) {
        return axios.post(this.commentUrl, comment);
    }

    addReply(reply: ReplyRequestModel) {
        return axios.post(this.replyUrl, reply);
    }

    updateCommentUpvote(comment: CommentUpdateRequestModel) {
        return axios.patch(this.commentUrl + '/' + comment.id, comment);
    }

    updateReplyUpvote(reply: ReplyUpdateRequestModel) {
        return axios.patch(this.replyUrl + '/' + reply.id, reply);
    }

}