// StoreContext.tsx
import { createContext } from "react";
import { RootStore, rootStore } from "./RootStore";

const StoreContext = createContext<RootStore>(rootStore);
export default StoreContext;
