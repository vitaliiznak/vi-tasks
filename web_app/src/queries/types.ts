export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any;
  /** The `Byte` scalar type represents byte value as a Buffer */
  Byte: any;
  /** A field whose value is a Currency: https://en.wikipedia.org/wiki/ISO_4217. */
  Currency: any;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  GUID: any;
  /** A field whose value is a CSS HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSL: any;
  /** A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSLA: any;
  /** A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors. */
  HexColorCode: any;
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4: any;
  /** A field whose value is a IPv6 address: https://en.wikipedia.org/wiki/IPv6. */
  IPv6: any;
  /** A field whose value is a ISBN-10 or ISBN-13 number: https://en.wikipedia.org/wiki/International_Standard_Book_Number. */
  ISBN: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: any;
  /** A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address. */
  MAC: any;
  /** Floats that will have a value less than 0. */
  NegativeFloat: any;
  /** Integers that will have a value less than 0. */
  NegativeInt: any;
  /** Floats that will have a value of 0 or more. */
  NonNegativeFloat: any;
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: any;
  /** Floats that will have a value of 0 or less. */
  NonPositiveFloat: any;
  /** Integers that will have a value of 0 or less. */
  NonPositiveInt: any;
  /** A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c */
  ObjectID: any;
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: any;
  /** A field whose value is a valid TCP port within the range of 0 to 65535: https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_ports */
  Port: any;
  /** Floats that will have a value greater than 0. */
  PositiveFloat: any;
  /** Integers that will have a value greater than 0. */
  PositiveInt: any;
  /** A field whose value conforms to the standard postal code formats for United States, United Kingdom, Germany, Canada, France, Italy, Australia, Netherlands, Spain, Denmark, Sweden, Belgium, India, Austria, Portugal, Switzerland or Luxembourg. */
  PostalCode: any;
  /** A field whose value is a CSS RGB color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGB: any;
  /** A field whose value is a CSS RGBA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGBA: any;
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: any;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: any;
  /** A currency string, such as $21.25 */
  USCurrency: any;
  /** Floats that will have a value of 0 or more. */
  UnsignedFloat: any;
  /** Integers that will have a value of 0 or more. */
  UnsignedInt: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones */
  UtcOffset: any;
  ValidateNumber: any;
  ValidateString: any;
};

export type Account = {
  __typename?: 'Account';
  avatar?: Maybe<AccountAvatar>;
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['EmailAddress'];
  fullName: Scalars['String'];
  id: Scalars['ID'];
  token?: Maybe<Scalars['String']>;
};

export type AccountAvatar = {
  __typename?: 'AccountAvatar';
  file?: Maybe<FileAttachment>;
  pravatarId?: Maybe<Scalars['String']>;
};

export type AccountAvatarInput = {
  file?: InputMaybe<UploadWrapper>;
  pravatarId?: InputMaybe<Scalars['String']>;
};

export type AccountSignupInput = {
  email?: InputMaybe<Scalars['EmailAddress']>;
  fullName?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type AccountUpdateInput = {
  avatar?: InputMaybe<AccountAvatarInput>;
  email?: InputMaybe<Scalars['EmailAddress']>;
  fullName?: InputMaybe<Scalars['String']>;
  removeAvatar?: InputMaybe<Scalars['Boolean']>;
};

export type Board = {
  __typename?: 'Board';
  createdAt: Scalars['DateTime'];
  createdBy: User;
  description: Scalars['String'];
  id: Scalars['ID'];
  members: Array<Maybe<User>>;
  membersCount: Scalars['NonNegativeInt'];
  title: Scalars['String'];
};

export type BoardAddMemberInput = {
  title?: InputMaybe<Scalars['String']>;
};

export type BoardCountFilterInput = {
  createdBy?: InputMaybe<Scalars['String']>;
};

export type BoardCreateInput = {
  title: Scalars['String'];
};

export type BoardListFilterInput = {
  createdBy?: InputMaybe<Scalars['String']>;
};

export type BoardUpdateInput = {
  title?: InputMaybe<Scalars['String']>;
};

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: User;
  id: Scalars['ID'];
  previous?: Maybe<Scalars['ID']>;
  replyToUser?: Maybe<User>;
  task: Task;
};

export type CommentCreateInput = {
  content: Scalars['String'];
  previous?: InputMaybe<Scalars['ID']>;
  task: Scalars['ID'];
};

export type CommentFilterQueryInput = {
  createdBy?: InputMaybe<Scalars['ID']>;
  previous?: InputMaybe<Scalars['String']>;
  task?: InputMaybe<Scalars['ID']>;
};

export type CommentRepliesInput = {
  filter?: InputMaybe<CommentFilterQueryInput>;
  request: Scalars['Boolean'];
};

export type CommentRepliesQueryInput = {
  limit?: InputMaybe<Scalars['NonNegativeInt']>;
};

export type CommentReplyCreateInput = {
  content: Scalars['String'];
  previous: Scalars['ID'];
  task?: InputMaybe<Scalars['ID']>;
};

export type FileAttachment = {
  __typename?: 'FileAttachment';
  encoding: Scalars['String'];
  ext: Scalars['String'];
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  uri: Scalars['String'];
};

export type Invite = {
  __typename?: 'Invite';
  account?: Maybe<Scalars['ID']>;
  board: Board;
  createdAt: Scalars['DateTime'];
  createdBy: User;
  description: Scalars['String'];
  expirationTime: Scalars['DateTime'];
  id: Scalars['ID'];
  state: Scalars['String'];
  token: Scalars['String'];
};

export type InviteCountFilterInput = {
  boardId?: InputMaybe<Scalars['ID']>;
  createdBy?: InputMaybe<Scalars['String']>;
  expirationTime?: InputMaybe<Scalars['Date']>;
};

export type InviteCreateInput = {
  boardId: Scalars['ID'];
  description: Scalars['String'];
  expirationTime?: InputMaybe<Scalars['Date']>;
};

export type InviteJoinBoardInput = {
  id: Scalars['ID'];
  token: Scalars['String'];
};

export type InviteListFilterInput = {
  board?: InputMaybe<Scalars['ID']>;
  createdBy?: InputMaybe<Scalars['String']>;
  expirationTime?: InputMaybe<Scalars['Date']>;
  stateAnyOf?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  state_NOTAnyOf?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  accountLogin?: Maybe<Account>;
  accountSignup: Account;
  accountUpdate: Account;
  boardCreate: Board;
  boardRemove: Scalars['ID'];
  boardUpdate: Board;
  commentCreate: Comment;
  commentRemove: Scalars['ID'];
  commentReplyCreate: Comment;
  inviteCreate: Invite;
  inviteInvalidate: Scalars['ID'];
  inviteJoinBoard?: Maybe<Invite>;
  taskArchive: Task;
  taskChangeState: Task;
  taskCreate: Task;
  taskRemove: Scalars['ID'];
  taskUnarchive: Task;
  taskUpdate: Task;
};


export type MutationAccountLoginArgs = {
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
};


export type MutationAccountSignupArgs = {
  input: AccountSignupInput;
};


export type MutationAccountUpdateArgs = {
  id: Scalars['ID'];
  update: AccountUpdateInput;
};


export type MutationBoardCreateArgs = {
  input: BoardCreateInput;
};


export type MutationBoardRemoveArgs = {
  id: Scalars['ID'];
};


export type MutationBoardUpdateArgs = {
  id: Scalars['ID'];
  input: BoardUpdateInput;
};


export type MutationCommentCreateArgs = {
  input: CommentCreateInput;
};


export type MutationCommentRemoveArgs = {
  id: Scalars['ID'];
};


export type MutationCommentReplyCreateArgs = {
  input: CommentReplyCreateInput;
};


export type MutationInviteCreateArgs = {
  input: InviteCreateInput;
};


export type MutationInviteInvalidateArgs = {
  token: Scalars['String'];
};


export type MutationInviteJoinBoardArgs = {
  input: InviteJoinBoardInput;
};


export type MutationTaskArchiveArgs = {
  id: Scalars['ID'];
};


export type MutationTaskChangeStateArgs = {
  id: Scalars['ID'];
  state: Scalars['String'];
};


export type MutationTaskCreateArgs = {
  input: TaskCreateInput;
};


export type MutationTaskRemoveArgs = {
  id: Scalars['ID'];
};


export type MutationTaskUnarchiveArgs = {
  id: Scalars['ID'];
};


export type MutationTaskUpdateArgs = {
  id: Scalars['ID'];
  input: TaskUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  accountMe: Account;
  boardCount?: Maybe<Scalars['NonNegativeInt']>;
  boardGetById?: Maybe<Board>;
  boardGetList: Array<Maybe<Board>>;
  commentCount?: Maybe<Scalars['NonNegativeInt']>;
  commentGetById?: Maybe<Comment>;
  commentGetList: Array<Maybe<Comment>>;
  inviteCount?: Maybe<Scalars['NonNegativeInt']>;
  inviteGetById?: Maybe<Invite>;
  inviteGetList: Array<Maybe<Invite>>;
  invitePublicGetById?: Maybe<Invite>;
  taskCount?: Maybe<Scalars['NonNegativeInt']>;
  taskGetById?: Maybe<Task>;
  taskGetList: Array<Maybe<Task>>;
  userGetById?: Maybe<User>;
  userGetList: Array<Maybe<User>>;
};


export type QueryBoardCountArgs = {
  filter?: InputMaybe<BoardCountFilterInput>;
};


export type QueryBoardGetByIdArgs = {
  id: Scalars['ID'];
};


export type QueryBoardGetListArgs = {
  filter?: InputMaybe<BoardListFilterInput>;
};


export type QueryCommentCountArgs = {
  filter?: InputMaybe<CommentFilterQueryInput>;
};


export type QueryCommentGetByIdArgs = {
  id: Scalars['ID'];
};


export type QueryCommentGetListArgs = {
  filter?: InputMaybe<CommentFilterQueryInput>;
  withReplies?: InputMaybe<CommentRepliesQueryInput>;
};


export type QueryInviteCountArgs = {
  filter?: InputMaybe<InviteCountFilterInput>;
};


export type QueryInviteGetByIdArgs = {
  id: Scalars['ID'];
};


export type QueryInviteGetListArgs = {
  filter?: InputMaybe<InviteListFilterInput>;
};


export type QueryInvitePublicGetByIdArgs = {
  id: Scalars['ID'];
};


export type QueryTaskCountArgs = {
  filter?: InputMaybe<TaskCountFilterInput>;
};


export type QueryTaskGetByIdArgs = {
  id: Scalars['ID'];
};


export type QueryTaskGetListArgs = {
  filter?: InputMaybe<TaskListFilterInput>;
};


export type QueryUserGetByIdArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryUserGetListArgs = {
  filter?: InputMaybe<UserListFilterInput>;
};

export enum Role {
  Admin = 'ADMIN',
  Reviewer = 'REVIEWER',
  Unknown = 'UNKNOWN',
  User = 'USER'
}

export type Task = {
  __typename?: 'Task';
  assigners: Array<Maybe<User>>;
  attachments: Array<Maybe<FileAttachment>>;
  createdAt: Scalars['DateTime'];
  createdBy: User;
  description: Scalars['String'];
  id: Scalars['ID'];
  isArchived: Scalars['Boolean'];
  priority: TaskPriorityEnum;
  state: TaskStateEnum;
  title: Scalars['String'];
};

export type TaskCountFilterInput = {
  assignersAnyOf?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  createdByAnyOf?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isArchived?: InputMaybe<Scalars['Boolean']>;
  prioritiesAnyOf?: InputMaybe<Array<InputMaybe<TaskPriorityEnum>>>;
  searchDescription?: InputMaybe<Scalars['String']>;
  searchTitle?: InputMaybe<Scalars['String']>;
};

export type TaskCreateInput = {
  assigners?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  attachments: Array<InputMaybe<UploadWrapper>>;
  board: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  priority: TaskPriorityEnum;
  state?: InputMaybe<TaskStateEnum>;
  title: Scalars['String'];
};

export type TaskListFilterInput = {
  assignersAnyOf?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  board?: InputMaybe<Scalars['ID']>;
  createdByAnyOf?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isArchived?: InputMaybe<Scalars['Boolean']>;
  prioritiesAnyOf?: InputMaybe<Array<InputMaybe<TaskPriorityEnum>>>;
  searchDescription?: InputMaybe<Scalars['String']>;
  searchTitle?: InputMaybe<Scalars['String']>;
};

export enum TaskPriorityEnum {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum TaskStateEnum {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  InReview = 'IN_REVIEW',
  Todo = 'TODO'
}

export type TaskUpdateInput = {
  assignersAdd?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  assignersRemove?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  description?: InputMaybe<Scalars['String']>;
  priority?: InputMaybe<TaskPriorityEnum>;
  title?: InputMaybe<Scalars['String']>;
};

export type UploadWrapper = {
  name: Scalars['String'];
  originFileObj: Scalars['Upload'];
  type: Scalars['String'];
  uid: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<UserAvatar>;
  email: Scalars['EmailAddress'];
  fullName: Scalars['String'];
  id: Scalars['ID'];
};

export type UserAvatar = {
  __typename?: 'UserAvatar';
  file?: Maybe<FileAttachment>;
  pravatarId?: Maybe<Scalars['String']>;
};

export type UserListFilterInput = {
  boardId?: InputMaybe<Scalars['ID']>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', accountLogin?: { __typename?: 'Account', id: string, email: any, fullName: string, token?: string | null } | null };

export type SignUpMutationVariables = Exact<{
  input: AccountSignupInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', accountSignup: { __typename?: 'Account', id: string, email: any, fullName: string, token?: string | null } };

export type AccountMeQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountMeQuery = { __typename?: 'Query', accountMe: { __typename?: 'Account', id: string, fullName: string, email: any, avatar?: { __typename?: 'AccountAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } };

export type CreateBoardMutationVariables = Exact<{
  input: BoardCreateInput;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', board: { __typename?: 'Board', id: string } };

export type RemoveBoardMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveBoardMutation = { __typename?: 'Mutation', boardRemove: string };

export type GetBoardQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetBoardQuery = { __typename?: 'Query', board?: { __typename?: 'Board', id: string, title: string, description: string, createdAt: any, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } } | null };

export type GetBoardsQueryVariables = Exact<{
  filter?: InputMaybe<BoardListFilterInput>;
}>;


export type GetBoardsQuery = { __typename?: 'Query', boards: Array<{ __typename?: 'Board', id: string, title: string, description: string, createdAt: any, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } } | null> };

export type GetTaskQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTaskQuery = { __typename?: 'Query', taskGetById?: { __typename?: 'Task', id: string, title: string, description: string, priority: TaskPriorityEnum, state: TaskStateEnum, isArchived: boolean, createdAt: any, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null }, assigners: Array<{ __typename?: 'User', id: string, fullName: string, email: any } | null>, attachments: Array<{ __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null> } | null };

export type GetTasksQueryVariables = Exact<{
  filter?: InputMaybe<TaskListFilterInput>;
}>;


export type GetTasksQuery = { __typename?: 'Query', tasks: Array<{ __typename?: 'Task', id: string, title: string, description: string, priority: TaskPriorityEnum, state: TaskStateEnum, isArchived: boolean, createdAt: any, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string } | null } | null }, assigners: Array<{ __typename?: 'User', id: string, fullName: string, email: any } | null>, attachments: Array<{ __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null> } | null> };

export type UnarchiveTaskMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UnarchiveTaskMutation = { __typename?: 'Mutation', taskUnarchive: { __typename?: 'Task', id: string } };

export type ArchiveTaskMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ArchiveTaskMutation = { __typename?: 'Mutation', taskArchive: { __typename?: 'Task', id: string } };

export type CreateTaskMutationVariables = Exact<{
  input: TaskCreateInput;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', taskCreate: { __typename?: 'Task', id: string } };

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['ID'];
  input: TaskUpdateInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', taskUpdate: { __typename?: 'Task', id: string, title: string, description: string, priority: TaskPriorityEnum, state: TaskStateEnum, isArchived: boolean, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string } | null } | null }, assigners: Array<{ __typename?: 'User', id: string, fullName: string, email: any } | null>, attachments: Array<{ __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null> } };

export type CountTasksQueryVariables = Exact<{
  filter?: InputMaybe<TaskCountFilterInput>;
}>;


export type CountTasksQuery = { __typename?: 'Query', taskCount?: any | null };

export type GetUsersQueryVariables = Exact<{
  filter?: InputMaybe<UserListFilterInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', userGetList: Array<{ __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string } | null } | null } | null> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetUserQuery = { __typename?: 'Query', userGetById?: { __typename?: 'User', id: string, email: any, fullName: string, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string } | null } | null } | null };

export type GetCommentsQueryVariables = Exact<{
  filter?: InputMaybe<CommentFilterQueryInput>;
  withReplies?: InputMaybe<CommentRepliesQueryInput>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', commentGetList: Array<{ __typename?: 'Comment', id: string, content: string, createdAt: any, previous?: string | null, createdBy: { __typename?: 'User', id: string, fullName: string, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string } | null } | null } } | null> };

export type CreateCommentMutationVariables = Exact<{
  input: CommentCreateInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', commentCreate: { __typename?: 'Comment', id: string } };

export type CreateReplyCommentMutationVariables = Exact<{
  input: CommentReplyCreateInput;
}>;


export type CreateReplyCommentMutation = { __typename?: 'Mutation', commentReplyCreate: { __typename?: 'Comment', id: string } };

export type AccountUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  update: AccountUpdateInput;
}>;


export type AccountUpdateMutation = { __typename?: 'Mutation', accountUpdate: { __typename?: 'Account', id: string, fullName: string, email: any, avatar?: { __typename?: 'AccountAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } };

export type ChangeTaskStateMutationVariables = Exact<{
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type ChangeTaskStateMutation = { __typename?: 'Mutation', taskChangeState: { __typename?: 'Task', id: string } };

export type RemoveTasksMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveTasksMutation = { __typename?: 'Mutation', taskRemove: string };

export type CreateInviteMutationVariables = Exact<{
  input: InviteCreateInput;
}>;


export type CreateInviteMutation = { __typename?: 'Mutation', inviteCreate: { __typename?: 'Invite', id: string, token: string, state: string, expirationTime: any, description: string, createdAt: any, board: { __typename?: 'Board', id: string, title: string }, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } } };

export type GetInvitesQueryVariables = Exact<{
  filter?: InputMaybe<InviteListFilterInput>;
}>;


export type GetInvitesQuery = { __typename?: 'Query', inviteGetList: Array<{ __typename?: 'Invite', id: string, token: string, state: string, expirationTime: any, description: string, createdAt: any, board: { __typename?: 'Board', id: string, title: string }, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } } | null> };

export type GetInviteByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetInviteByIdQuery = { __typename?: 'Query', inviteGetById?: { __typename?: 'Invite', id: string, token: string, state: string, expirationTime: any, description: string, createdAt: any, board: { __typename?: 'Board', id: string, title: string }, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } } | null };

export type GetInvitePublicByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetInvitePublicByIdQuery = { __typename?: 'Query', invitePublicGetById?: { __typename?: 'Invite', id: string, token: string, state: string, expirationTime: any, description: string, createdAt: any, board: { __typename?: 'Board', id: string, title: string }, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } } | null };

export type InviteJoinBoardMutationVariables = Exact<{
  input: InviteJoinBoardInput;
}>;


export type InviteJoinBoardMutation = { __typename?: 'Mutation', inviteJoinBoard?: { __typename?: 'Invite', id: string, token: string, state: string, expirationTime: any, description: string, createdAt: any, board: { __typename?: 'Board', id: string, title: string }, createdBy: { __typename?: 'User', id: string, fullName: string, email: any, avatar?: { __typename?: 'UserAvatar', file?: { __typename?: 'FileAttachment', uri: string, filename: string, mimetype: string, encoding: string, ext: string } | null } | null } } | null };
