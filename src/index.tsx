import * as React from "react";
import { createRoot } from "react-dom/client";
import { start } from "./Application/Application";
import Ui from "./Application/Ui/Ui";

start();

const root = createRoot(document.getElementById("ui")!);
root.render(<Ui />);
