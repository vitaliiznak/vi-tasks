import { makeVar } from '@apollo/client'
import { AccountMeQuery, GetBoardQuery, GetBoardsQuery } from '@src/queries/types'


export const gSelectedBoard = makeVar<GetBoardQuery['board']>(null)

export const gUserMe = makeVar<AccountMeQuery['accountMe'] | null>(null)
export const gBoards = makeVar<GetBoardsQuery['boards'] | null>(null)


// export default new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         gSelectedBoard: {
//           read() {
//             return gSelectedBoard()
//           }
//         },
//         gUserMe: {
//           read() {
//             return gUserMe()
//           }
//         },
//         gBoards: {
//           read() {
//             return gBoards()
//           }
//         },
//       }
//     }
//   }
// });
