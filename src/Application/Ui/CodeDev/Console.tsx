import { observer } from "mobx-react";
import * as React from "react";
import StoreContext from "../../Store/StoreContext";
import style from "./Console.css";

const Console = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  return <div className={style.display}>{appStore.log}</div>;
});

export default Console;
