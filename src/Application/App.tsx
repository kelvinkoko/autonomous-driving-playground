import { Allotment } from "allotment";
import "allotment/dist/style.css?global";
import { observer } from "mobx-react";
import * as React from "react";
import { useEffect, useRef } from "react";
import style from "./App.css";
import { onCanvasResize, start } from "./Simulation/Simulation";
import StoreContext from "./Store/StoreContext";
import { Tab } from "./Tab";
import AutopilotControlButton from "./Ui/CodeDev/AutopilotControlButton";
import CodeEditor from "./Ui/CodeDev/CodeEditor";
import Console from "./Ui/CodeDev/Console";
import DeployButton from "./Ui/CodeDev/DeployButton";
import { Wasm } from "./Ui/CodeDev/Wasm";
import OverlayUi from "./Ui/OverlayUi";

const App = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      start(canvasElement);
    }
  }, []);
  const activeTab = appStore.codeTab;
  return (
    <Allotment
      className={style.container}
      defaultSizes={[70, 30]}
      onChange={() => {
        onCanvasResize?.();
      }}
    >
      <div className={style.main}>
        <div className={style.canvas} ref={canvasRef} />
        <OverlayUi />
      </div>
      <Allotment.Pane
        className={style.codePane}
        visible={appStore.isShowingCodePane}
      >
        <CodePane
          activeTab={activeTab}
          setActiveTab={tab => {
            appStore.setTab(tab);
          }}
        />
      </Allotment.Pane>
    </Allotment>
  );
});

interface TabProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const CodePane = ({ activeTab, setActiveTab }: TabProps) => {
  return (
    <Allotment vertical defaultSizes={[70, 30]}>
      <Allotment.Pane className={style.editorWithButtonContainer}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className={style.codeContainer}>
          {activeTab === Tab.JS ? <CodeEditor /> : <Wasm />}
        </div>
        <DeployButton />
        <AutopilotControlButton />
      </Allotment.Pane>
      <Console />
    </Allotment>
  );
};

const Tabs = ({ activeTab, setActiveTab }: TabProps) => {
  return (
    <div className={style.tabContainer}>
      <div
        className={`${style.tab} ${
          activeTab === Tab.JS ? style.tabActive : ""
        }`}
        onClick={setActiveTab.bind(this, Tab.JS)}
      >
        Javascript
      </div>
      <div
        className={`${style.tab} ${
          activeTab === Tab.WASM ? style.tabActive : ""
        }`}
        onClick={setActiveTab.bind(this, Tab.WASM)}
      >
        Web Assembly
      </div>
    </div>
  );
};

export default App;
