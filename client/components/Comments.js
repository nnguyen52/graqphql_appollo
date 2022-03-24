import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import DisplayComments from './DisplayComments';
// display 2 latest comments
const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [formattedComments, setFormattedComments] = useState([]);

  useEffect(() => {
    if (!post) return;
    setComments(post.comments.filter((each) => !each.reply && each.postId == post._id));
    setReplies(post.comments.filter((each) => each.postId == post._id && each.reply));
  }, [post]);

  //   const recursiveBuildComment = (comment, formattedCmts, level) => {
  //     let targetLevel = 0;
  //     if (targetLevel == level) {
  //       console.log('current cmt: ', comment);
  //       if (!comment.reply) formattedCmts.push(comment);
  //       let repliesForThisComment = replies.filter(
  //         (each) => each.reply._id.toString() == comment._id
  //       );
  //       console.log('reps for current cmt: ', repliesForThisComment);
  //       if (repliesForThisComment.length == 0) return;
  //       setFormattedComments((prev) =>
  //         formattedCmts.map((each, index) => {
  //           repliesForThisComment.forEach((rep) => {
  //             if (rep.reply._id == each._id) {
  //               formattedCmts[index] = {
  //                 ...formattedCmts[index],
  //                 replies: repliesForThisComment,
  //               };
  //             }
  //           });
  //         })
  //       );
  //       return;
  //     } else {
  //       while (targetLevel !== level) {
  //         targetLevel++;
  //         // skip nested comments based on level;
  //       }
  //     }
  //     repliesForThisComment.forEach((each) =>
  //       recursiveBuildComment(each, formattedComments, level + 1)
  //     );
  //   };
  //github.com/dominik791/obj-traverse
  //
  //   [
  //     {
  //       __typename: 'Comment',
  //       reply: null,
  //       _id: '62354327fe1b3e7290dc50e1',
  //       content: 'comment 1',
  //       points: 0,
  //       user: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       tag: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       postId: '62353f13fe1b3e7290dc50dc',
  //     },
  //   ];
  /////////
  // relies:
  // [
  //   {
  //     __typename: 'Comment',
  //     reply: {
  //       __typename: 'Comment',
  //       reply: null,
  //       _id: '62354327fe1b3e7290dc50e1',
  //       content: 'comment 1',
  //       points: 0,
  //       user: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       tag: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       postId: '62353f13fe1b3e7290dc50dc',
  //     },
  //     _id: '62354344fe1b3e7290dc50e7',
  //     content: 'comment 2',
  //     points: 0,
  //     user: {
  //       __typename: 'User',
  //       id: '622ba6549ab5b03daea70a83',
  //       userName: 'admin3',
  //       email: 'coh.jr11@gmail.com',
  //     },
  //     tag: {
  //       __typename: 'User',
  //       id: '622ba6549ab5b03daea70a83',
  //       userName: 'admin3',
  //       email: 'coh.jr11@gmail.com',
  //     },
  //     postId: '62353f13fe1b3e7290dc50dc',
  //   },
  //   {
  //     __typename: 'Comment',
  //     reply: {
  //       __typename: 'Comment',
  //       reply: {
  //         __typename: 'Comment',
  //         reply: null,
  //         _id: '62354327fe1b3e7290dc50e1',
  //         content: 'comment 1',
  //         points: 0,
  //         user: {
  //           __typename: 'User',
  //           id: '622ba6549ab5b03daea70a83',
  //           userName: 'admin3',
  //           email: 'coh.jr11@gmail.com',
  //         },
  //         tag: {
  //           __typename: 'User',
  //           id: '622ba6549ab5b03daea70a83',
  //           userName: 'admin3',
  //           email: 'coh.jr11@gmail.com',
  //         },
  //         postId: '62353f13fe1b3e7290dc50dc',
  //       },
  //       _id: '62354344fe1b3e7290dc50e7',
  //       content: 'comment 2',
  //       points: 0,
  //       user: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       tag: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       postId: '62353f13fe1b3e7290dc50dc',
  //     },
  //     _id: '62354356fe1b3e7290dc50ed',
  //     content: 'comment 3',
  //     points: 0,
  //     user: {
  //       __typename: 'User',
  //       id: '622ba6549ab5b03daea70a83',
  //       userName: 'admin3',
  //       email: 'coh.jr11@gmail.com',
  //     },
  //     tag: {
  //       __typename: 'User',
  //       id: '622ba6549ab5b03daea70a83',
  //       userName: 'admin3',
  //       email: 'coh.jr11@gmail.com',
  //     },
  //     postId: '62353f13fe1b3e7290dc50dc',
  //   },
  //   {
  //     __typename: 'Comment',
  //     reply: {
  //       __typename: 'Comment',
  //       reply: {
  //         __typename: 'Comment',
  //         reply: {
  //           __typename: 'Comment',
  //           _id: '62354327fe1b3e7290dc50e1',
  //           content: 'comment 1',
  //           points: 0,
  //           user: {
  //             __typename: 'User',
  //             id: '622ba6549ab5b03daea70a83',
  //             userName: 'admin3',
  //             email: 'coh.jr11@gmail.com',
  //           },
  //           tag: {
  //             __typename: 'User',
  //             id: '622ba6549ab5b03daea70a83',
  //             userName: 'admin3',
  //             email: 'coh.jr11@gmail.com',
  //           },
  //           postId: '62353f13fe1b3e7290dc50dc',
  //         },
  //         _id: '62354344fe1b3e7290dc50e7',
  //         content: 'comment 2',
  //         points: 0,
  //         user: {
  //           __typename: 'User',
  //           id: '622ba6549ab5b03daea70a83',
  //           userName: 'admin3',
  //           email: 'coh.jr11@gmail.com',
  //         },
  //         tag: {
  //           __typename: 'User',
  //           id: '622ba6549ab5b03daea70a83',
  //           userName: 'admin3',
  //           email: 'coh.jr11@gmail.com',
  //         },
  //         postId: '62353f13fe1b3e7290dc50dc',
  //       },
  //       _id: '62354356fe1b3e7290dc50ed',
  //       content: 'comment 3',
  //       points: 0,
  //       user: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       tag: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       postId: '62353f13fe1b3e7290dc50dc',
  //     },
  //     _id: '6235436dfe1b3e7290dc50f3',
  //     content: 'comment 4',
  //     points: 0,
  //     user: {
  //       __typename: 'User',
  //       id: '622ba6549ab5b03daea70a83',
  //       userName: 'admin3',
  //       email: 'coh.jr11@gmail.com',
  //     },
  //     tag: {
  //       __typename: 'User',
  //       id: '622ba6549ab5b03daea70a83',
  //       userName: 'admin3',
  //       email: 'coh.jr11@gmail.com',
  //     },
  //     postId: '62353f13fe1b3e7290dc50dc',
  //   },
  //   {
  //     __typename: 'Comment',
  //     reply: {
  //       __typename: 'Comment',
  //       reply: {
  //         __typename: 'Comment',
  //         reply: null,
  //         _id: '62354327fe1b3e7290dc50e1',
  //         content: 'comment 1',
  //         points: 0,
  //         user: {
  //           __typename: 'User',
  //           id: '622ba6549ab5b03daea70a83',
  //           userName: 'admin3',
  //           email: 'coh.jr11@gmail.com',
  //         },
  //         tag: {
  //           __typename: 'User',
  //           id: '622ba6549ab5b03daea70a83',
  //           userName: 'admin3',
  //           email: 'coh.jr11@gmail.com',
  //         },
  //         postId: '62353f13fe1b3e7290dc50dc',
  //       },
  //       _id: '62354344fe1b3e7290dc50e7',
  //       content: 'comment 2',
  //       points: 0,
  //       user: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       tag: {
  //         __typename: 'User',
  //         id: '622ba6549ab5b03daea70a83',
  //         userName: 'admin3',
  //         email: 'coh.jr11@gmail.com',
  //       },
  //       postId: '62353f13fe1b3e7290dc50dc',
  //     },
  //     _id: '623c10bb88353802713cf8d5',
  //     content: 'comment 5 reply comment 2',
  //     points: 0,
  //     user: {
  //       __typename: 'User',
  //       id: '622ba6549ab5b03daea70a83',
  //       userName: 'admin3',
  //       email: 'coh.jr11@gmail.com',
  //     },
  //     tag: {
  //       __typename: 'User',
  //       id: '622ba6549ab5b03daea70a83',
  //       userName: 'admin3',
  //       email: 'coh.jr11@gmail.com',
  //     },
  //     postId: '62353f13fe1b3e7290dc50dc',
  //   },
  // ];
  //
  useEffect(() => {
    if (comments == []) return;
    if (replies == []) return;

    for (let i = 0; i < comments.length; i++) {
      //   recursiveBuildComment(comments[i], formattedComments, 0);
    }
    // console.log('result:', formattedComments);
  }, [comments, replies]);

  return (
    <div>
      {comments.map((each, index) => {
        return <DisplayComments comment={each} key={index} post={post} replies={replies} />;
      })}
      <div>
        {JSON.stringify(comments, null, 2)}
        <hr />
        {JSON.stringify(replies, null, 2)}
      </div>
      {/* {comments.length - next > 0 ? (
        <Button onClick={() => setNext((prev) => prev + 10)}> See more comments</Button>
      ) : (
        comments.length > 2 && <Button>Hide comment</Button>
      )} */}
    </div>
  );
};

export default Comments;
