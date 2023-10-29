import { observer } from "mobx-react";
import * as React from "react";
import Toggle from "react-toggle";
import StoreContext from "../../Store/StoreContext";
import style from "./AutopilotControlButton.css";
import "./Toggle.css?global";

const AutopilotControlButton = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const carStore = rootStore.carStore;
  const toggleState = () => {
    carStore.setIsAutopilotEnable(!carStore.isAutopilotEnabled);
  };
  return (
    <div className={style.container}>
      <div>Enable Autopilot</div>
      <Toggle
        icons={false}
        checked={carStore.isAutopilotEnabled}
        onChange={toggleState}
      />
    </div>
  );
});

export default AutopilotControlButton;
