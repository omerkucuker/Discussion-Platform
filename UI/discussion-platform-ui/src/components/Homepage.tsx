import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Comment } from '../model/Comment';
import { CommentRequestModel } from '../model/CommentRequestModel';
import { CommentUpdateRequestModel } from '../model/CommentUpdateRequestModel';
import { LoginResponseModel } from '../model/LoginResponseModel';
import { Reply } from '../model/Reply';
import { ReplyRequestModel } from '../model/ReplyRequestModel';
import { ReplyUpdateRequestModel } from '../model/ReplyUpdateRequestModel';
import services from '../services/services';
import '../styles/styles.css';

export default function Homepage(props: any) {
    let service = new services();
    let history = useNavigate();
    const { state }: any = useLocation();

    const [feeds, setFeeds] = useState<any>([]);
    const [loggedInUser, setLoggedInUser] = useState<LoginResponseModel>();
    const [comment, setComment] = useState("");
    const [reply, setReply] = useState("");
    const [selectedComment, setSelectedComment] = useState<Comment>();


    const [openModal, setOpenModal] = useState("none");

    useEffect((): any => {
        if (!props.logedIn && !state) {
            return history('/');
        }

        setLoggedInUser(state.loggedInUser);
        getAllFeed();


    }, [state, props.logedIn]);

    useEffect(() => {
        const interval = setInterval(() => {
            getAllFeed();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getAllFeed = () => {

        service.getAllFeed().then((res) => {
            if (res.data) {
                res.data.map((comment: any) => (comment.replies = sortArrayByTimeOrUpvote(comment.replies)))
                setFeeds(sortArrayByTimeOrUpvote(res.data));
            }
        }).catch(err => alert("" + err))
    }

    const sortArrayByTimeOrUpvote = (array: any[]) => {
        return array.sort((a: Comment, b: Comment) => {
            const aDate = new Date(a.comment_time).getTime();
            const bDate = new Date(b.comment_time).getTime();
            return a.upvote === b.upvote ? bDate - aDate : b.upvote - a.upvote
        }
        );
    }

    const clickComment = () => {
        const newComment: CommentRequestModel = {
            content_comment: comment,
            comment_time: new Date(),
            upvote: 1,
            user_id: loggedInUser!.id
        };

        service.addComment(newComment).then((res) => {
            if (res.status === 201) {
                const tempComment = {
                    ...newComment,
                    userName: loggedInUser?.userName!,
                    imageSrc: loggedInUser?.imageSrc!
                };
                const tempFeed = feeds.unshift(tempComment);
                setFeeds([...feeds, tempFeed]);
            }
        }).catch(err => alert("" + err))
    }

    const clickModal = (feed: any) => {
        setSelectedComment(feed);
        setOpenModal("block");
    }

    const closeModal = () => { //TODO for outside click of modal
        setOpenModal("none");
    }

    const clickReply = () => {
        const newReply: ReplyRequestModel = {
            content_reply: reply,
            reply_time: new Date(),
            upvote: 1,
            user_id: loggedInUser!.id,
            comment_id: selectedComment!.id!,
        };
        service.addReply(newReply).then((res) => {
            if (res.status === 201) {
                closeModal();
                const tempReply = {
                    ...newReply,
                    id: res.data.id,
                    userName: loggedInUser?.userName!,
                    imageSrc: loggedInUser?.imageSrc!
                };

                const tempArray: any = selectedComment && selectedComment.replies.unshift(tempReply);
                const newObj: any = { ...selectedComment, replies: tempArray }
                setSelectedComment(newObj);
            }
        }).catch(err => alert("" + err))
    }

    const clickCommentUpvote = (comment: CommentUpdateRequestModel) => {
        const newComment = { id: comment.id, upvote: comment.upvote + 1 };
        service.updateCommentUpvote(newComment).then((res) => {
            if (res.data) {
                setFeeds(sortArrayByTimeOrUpvote(feeds.map((obj: Comment) => {
                    if (obj.id === res.data.id) {
                        return { ...obj, upvote: res.data.upvote }
                    }
                    return obj;
                })));

            }
        }).catch(err => alert("" + err))
    }

    const clickReplyUpvote = (reply: ReplyUpdateRequestModel) => {
        const newReply = { id: reply.id, upvote: reply.upvote + 1 };
        service.updateReplyUpvote(newReply).then((res) => {
            if (res.data) {
                getAllFeed();
                // let tempComments = feeds;
                // const findCommentIndex = feeds.findIndex((x: Comment) => x.id === reply.comment_id);
                // const findReplyIndex = feeds[findCommentIndex].replies.findIndex((x: Reply) => x.id === res.data.id);
                // tempComments[findCommentIndex].replies[findReplyIndex].upvote = res.data.upvote;
                // tempComments[findCommentIndex].replies = sortArrayByTimeOrUpvote(tempComments[findCommentIndex].replies);
                // setFeeds([...feeds, tempComments]);

                // setFeeds(sortArrayByTimeOrUpvote(feeds.map((obj: Comment) => {
                //     obj.replies.map((tempReply: Reply, index:number) => {
                //         if (tempReply.id === res.data.id) {
                //             obj.replies[index].upvote = res.data.upvote
                //             return { ...obj, obj.replies[index]: res.data.upvote }
                //         }
                //         return reply;
                //     })
                //     return obj;
                // })));

            }
        }).catch(err => alert("" + err))
    }

    const getDifferenceTime = (timestamp: any) => {
        let now = new Date().getTime();
        let howLongCommentAgo = timestamp - now;

        // Convert to a positive integer
        let time = Math.abs(howLongCommentAgo);

        // Define humanTime and units
        let humanTime: number;
        let units: string;

        // If there are years
        if (time > 1000 * 60 * 60 * 24 * 365) {
            humanTime = parseInt((time / (1000 * 60 * 60 * 24 * 365) + ""), 10);
            units = "years";
        }

        // If there are months
        else if (time > 1000 * 60 * 60 * 24 * 30) {
            humanTime = parseInt((time / (1000 * 60 * 60 * 24 * 30) + ""), 10);
            units = "months";
        }

        // If there are weeks
        else if (time > 1000 * 60 * 60 * 24 * 7) {
            humanTime = parseInt((time / (1000 * 60 * 60 * 24 * 7) + ""), 10);
            units = "weeks";
        }

        // If there are days
        else if (time > 1000 * 60 * 60 * 24) {
            humanTime = parseInt((time / (1000 * 60 * 60 * 24) + ""), 10);
            units = "days";
        }

        // If there are hours
        else if (time > 1000 * 60 * 60) {
            humanTime = parseInt((time / (1000 * 60 * 60) + ""), 10);
            units = "hours";
        }

        // If there are minutes
        else if (time > 1000 * 60) {
            humanTime = parseInt((time / (1000 * 60) + ""), 10);
            units = "minutes";
        }

        // Otherwise, use seconds
        else {
            humanTime = parseInt((time / 1000 + ""), 10);
            units = "seconds";
        }

        // Get the time and units
        var timeUnits = humanTime + " " + units;

        // If in the future
        if (howLongCommentAgo > 0) {
            return "in " + timeUnits;
        }

        if (humanTime === 0) {
            return "just now";
        }

        // If in the past
        return timeUnits + " ago";
    };

    return (
        <>
            <h2>Discussion</h2>
            <h4 >{loggedInUser && loggedInUser.userName}</h4>
            <div className="container">
                <img id="img" src={loggedInUser && loggedInUser.imageSrc ? process.env.PUBLIC_URL + '/img/' + loggedInUser.imageSrc + '.png' : ''} alt="Avatar" />
                <input id="commentInput" value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder="What are your thoughts?" name="comment" />
                <button id="commentButton" onClick={() => clickComment()}>Comment</button>
            </div>
            <hr className="solid" />
            <div className="commentLists">

                {feeds && feeds.length > 0 && feeds.map((comment: Comment, index: number) => {
                    const commentImageSrc: any = comment && comment.imageSrc ? process.env.PUBLIC_URL + '/img/' + comment.imageSrc + '.png' : '';
                    return (
                        <div className="commentSeperator" key={new Date(comment.comment_time).toTimeString()}>

                            <div className="commentFeed" >
                                <div className="imageWithVerticalLine">
                                    <img src={commentImageSrc} alt="Avatar" />
                                </div>
                                <div className="commentSide">
                                    <span >
                                        <strong >{comment.userName}</strong> * {getDifferenceTime(new Date(comment.comment_time).getTime())}  <br />
                                        <div >{comment.content_comment}</div>
                                        <div style={{ paddingTop: "5px" }} >
                                            {index !== 0 && <button id="upvoteButton" onClick={() => clickCommentUpvote(comment)}>
                                                <i className="fa fa-caret-up" style={{ paddingRight: "5px" }} ></i>Upvote</button>}
                                            <button id="modalButton" onClick={() => clickModal(comment)}>Reply</button>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            {comment.replies && comment.replies.length > 0 && <div className="vl" style={{ height: `${comment.replies.length * 9}%` }} ></div>}

                            {comment.replies && comment.replies.length > 0 && comment.replies.map((reply: Reply, index: number) => {
                                const replyImageSrc: any = reply && reply.imageSrc ? process.env.PUBLIC_URL + '/img/' + reply.imageSrc + '.png' : '';

                                return (<div className="commentFeed" style={{ marginLeft: "35px" }} key={new Date(reply.reply_time).toTimeString()}>
                                    <div className="imageWithVerticalLine">
                                        <img src={replyImageSrc} alt="Avatar" />
                                    </div>
                                    <div className="commentSide">
                                        <span >
                                            <strong >{reply.userName}</strong> * {getDifferenceTime(new Date(reply.reply_time).getTime())}  <br />
                                            <div >{reply.content_reply}</div>
                                            <div style={{ paddingTop: "5px" }}>
                                                {index !== 0 && <button id="upvoteButton" onClick={() => clickReplyUpvote(reply)} >
                                                    <i className="fa fa-caret-up" style={{ paddingRight: "5px" }}></i>Upvote</button>}
                                                {/* <button id="modalButton" onClick={() => clickModal(reply)}>Reply</button> */}
                                            </div>
                                        </span>
                                    </div>
                                </div>)

                            })}

                        </div>

                    )

                })}

            </div>


            <div id="myModal" style={{ display: `${openModal}` }} className="modal">

                <div className="modal-content">
                    <span className="close" onClick={() => closeModal()}>&times;</span>
                    <input id="replyInput" value={reply} onChange={(e) => setReply(e.target.value)} type="text" placeholder="Your reply.." name="reply" />
                    <button id="replyButton" onClick={() => clickReply()}>Reply</button>
                </div>

            </div>
        </>

    )
}