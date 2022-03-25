import { gql } from "@apollo/client";
import { Fragment_comment } from "./comment";
export const Fragment_commentThreelevels = gql`
  ${Fragment_comment}
  fragment commentThreelevels on Comment {
    ...comment
    reply {
      ...comment
      reply {
        ...comment
        reply {
          ...comment
        }
      }
    }
  }
`;
