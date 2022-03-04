/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import { User } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export interface OutletContext {
	user: User;
}

export type StateUpdater<T> = Dispatch<SetStateAction<T>>;
