export type { Reducer } from "react";

export type Action<
  ActionType extends string,
  ActionPayload
> = ActionPayload extends void
  ? {
      type: ActionType;
    }
  : {
      type: ActionType;
      payload: ActionPayload;
    };
