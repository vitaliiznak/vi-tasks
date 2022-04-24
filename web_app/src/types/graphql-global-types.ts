/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum TaskPriorityEnum {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
}

export enum TaskStateEnum {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export interface AccountSignupInput {
  fullName?: string | null;
  email?: any | null;
  password?: string | null;
}

export interface AccountUpdateInput {
  fullName?: string | null;
  email?: any | null;
  avatar?: UploadWrapper | null;
  removeAvatar?: boolean | null;
}

export interface BoardCreateInput {
  title: string;
}

export interface BoardListFilterInput {
  createdBy?: string | null;
}

export interface CommentCreateInput {
  content: string;
  task: string;
  previous?: string | null;
}

export interface CommentFilterQueryInput {
  task?: string | null;
  createdBy?: string | null;
  previous?: string | null;
}

export interface CommentRepliesQueryInput {
  limit?: any | null;
}

export interface CommentReplyCreateInput {
  content: string;
  previous: string;
  task?: string | null;
}

export interface TaskCountFilterInput {
  assignersAnyOf?: (string | null)[] | null;
  createdByAnyOf?: (string | null)[] | null;
  prioritiesAnyOf?: (TaskPriorityEnum | null)[] | null;
  searchTitle?: string | null;
  searchDescription?: string | null;
  isArchived?: boolean | null;
}

export interface TaskCreateInput {
  board: string;
  title: string;
  description?: string | null;
  priority: TaskPriorityEnum;
  attachments: (UploadWrapper | null)[];
  assigners?: (string | null)[] | null;
}

export interface TaskListFilterInput {
  assignersAnyOf?: (string | null)[] | null;
  createdByAnyOf?: (string | null)[] | null;
  prioritiesAnyOf?: (TaskPriorityEnum | null)[] | null;
  searchTitle?: string | null;
  searchDescription?: string | null;
  isArchived?: boolean | null;
  board?: string | null;
}

export interface TaskUpdateInput {
  title?: string | null;
  description?: string | null;
  priority?: TaskPriorityEnum | null;
  assignersAdd?: (string | null)[] | null;
  assignersRemove?: (string | null)[] | null;
}

export interface UploadWrapper {
  uid: string;
  name: string;
  type: string;
  originFileObj: any;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
