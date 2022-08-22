const user = {
  userName: "Rob Hope",
  userID: 1,
  imageSrc: "./img/img_avatar.png",
  comments: [],
};

const contentType = {
  clickReplyUpvote: "clickReplyUpvote",
  clickCommentUpvote: "clickCommentUpvote",
};

let replyComment;
let verticalHeight = 0;
let verticalHeightCounter = 10;

function clickComment() {
  const commentContent = document.getElementById("commentInput").value;
  if (commentContent.length > 0) {
    const commentTime = new Date();

    document.getElementById("commentInput").value = "";
    const newComment = {
      commentId: commentTime.getTime() + "",
      content: commentContent,
      date: commentTime,
      order: 1,
      replies: [],
      userName: user.userName,
      imageSrc: user.imageSrc,
    };
    user.comments.push(newComment);
    verticalHeight = 0;
    listComments();
  }
}

function listComments() {
  let elem = document.querySelector(".commentLists");
  let tempInnerHtml = "";

  user.comments.forEach((comment) => {
    const commentTime = getDifferenceTime(comment.date.getTime());
    let tempReplies = "";

    comment.replies &&
      comment.replies.forEach((reply) => {
        const replyTime = getDifferenceTime(reply.date.getTime());
        tempReplies += createDiscussionComponent(
          replyTime,
          reply,
          contentType.clickReplyUpvote
        );
      });

    let tempComment = createDiscussionComponent(
      commentTime,
      comment,
      contentType.clickCommentUpvote
    );

    let commentWithReply;

    if (comment.replies && comment.replies.length === 0) {
      commentWithReply = `
      <div class="commentSeperator">
      ${tempComment}
      </div>  
        `;
      tempInnerHtml += commentWithReply;
    } else {
      commentWithReply = `
      <div class="commentSeperator" >
      ${tempComment}
      <div class="vl" style="height:${verticalHeight}%;"></div>      
      <div style="margin-left:35px;">
      <div>${tempReplies}</div>
      </div>
      </div>
    `;
      tempInnerHtml += commentWithReply;
    }
  });
  //
  elem.innerHTML = tempInnerHtml;
}

function getInnerComment(list, contentType) {
  list &&
    list.forEach((comment) => {
      let howLongReplyAgo = reply.date.getTime() - now;
      const replyTime = getDifferenceTime(howLongReplyAgo);
      tempReplies += createDiscussionComponent(
        {
          userName: comment.userName,
          imageSrc: comment.userAvatar,
        },
        replyTime,
        {
          commentId: comment.replyId,
          content: comment.content,
        },
        contentType
      );
    });
}

function createDiscussionComponent(commentTime, element, upvoteType) {
  let displayReplyButton =
    upvoteType === contentType.clickCommentUpvote ? "inline" : "none";
  let displayVerticalLine =
    upvoteType === contentType.clickReplyUpvote ? "inline" : "none";
  //    <div class="vl" style="display:${displayReplyButton}"></div>

  return `
    <div class="commentFeed">
    <div class="imageWithVerticalLine">
    <img src='${element.imageSrc}' alt="Avatar">
    </div>
    <div class="commentSide">
    <span >
    <strong >${element.userName}</strong> * ${commentTime}</br>
    <div >${element.content}</div>
    <div style="padding-top:5px;"><button id="upvoteButton" onclick="${upvoteType}('${element.commentId}')">
    <i class="fa fa-caret-up" style="padding-right:5px;"></i>Upvote</button>
    <button style="display:${displayReplyButton}" id="modalButton" onclick=clickModal('${element.commentId}')>Reply</button>
    </div>
    </span>
    </div>
    </div>
    </br>
    `;
}

function clickCommentUpvote(event) {
  let elementIndex = user.comments.findIndex((x) => x.commentId === event);
  user.comments[elementIndex].order += 1;
  user.comments.sort((a, b) =>
    a.order === b.order ? a.date - b.date : b.order - a.order
  );
  let elementAfterSortIndex = user.comments.findIndex(
    (x) => x.commentId == event
  );
  user.comments[elementAfterSortIndex].order -= 1;
  listComments();
}

function clickReplyUpvote(event) {
  let elementCommentIndex = user.comments.findIndex((x) =>
    x.replies.find((y) => y.commentId === event)
  );
  let elementReplyIndex = user.comments[elementCommentIndex].replies.findIndex(
    (y) => y.commentId === event
  );

  user.comments[elementCommentIndex].replies[elementReplyIndex].order += 1;

  user.comments[elementCommentIndex].replies.sort((a, b) =>
    a.order === b.order ? a.date - b.date : b.order - a.order
  );

  let elementAfterSortIndex = user.comments[
    elementCommentIndex
  ].replies.findIndex((x) => x.commentId == event);
  user.comments[elementCommentIndex].replies[elementAfterSortIndex].order -= 1;
  listComments();
}

function clickModal(event) {
  replyComment = event;
  let modal = document.getElementById("myModal");

  let span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function clickReply() {
  const reply = document.getElementById("replyInput").value;
  let modal = document.getElementById("myModal");

  if (reply.length > 0) {
    const replyTime = new Date();
    let elementIndex = user.comments.findIndex(
      (x) => x.commentId === replyComment
    );
    const newReply = {
      commentId: replyTime.getTime() + "",
      content: reply,
      date: replyTime,
      userName: user.userName,
      imageSrc: user.imageSrc,
      order: 1,
      innerReplies: [], //TODO
    };
    user.comments[elementIndex].replies.push(newReply);

    verticalHeight += 20;
  }

  modal.style.display = "none";
  document.getElementById("replyInput").value = "";

  listComments();
}

const getDifferenceTime = (timestamp) => {
  let now = new Date().getTime();
  let howLongCommentAgo = timestamp - now;

  // Convert to a positive integer
  let time = Math.abs(howLongCommentAgo);

  // Define humanTime and units
  let humanTime, units;

  // If there are years
  if (time > 1000 * 60 * 60 * 24 * 365) {
    humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 365), 10);
    units = "years";
  }

  // If there are months
  else if (time > 1000 * 60 * 60 * 24 * 30) {
    humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 30), 10);
    units = "months";
  }

  // If there are weeks
  else if (time > 1000 * 60 * 60 * 24 * 7) {
    humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 7), 10);
    units = "weeks";
  }

  // If there are days
  else if (time > 1000 * 60 * 60 * 24) {
    humanTime = parseInt(time / (1000 * 60 * 60 * 24), 10);
    units = "days";
  }

  // If there are hours
  else if (time > 1000 * 60 * 60) {
    humanTime = parseInt(time / (1000 * 60 * 60), 10);
    units = "hours";
  }

  // If there are minutes
  else if (time > 1000 * 60) {
    humanTime = parseInt(time / (1000 * 60), 10);
    units = "minutes";
  }

  // Otherwise, use seconds
  else {
    humanTime = parseInt(time / 1000, 10);
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
