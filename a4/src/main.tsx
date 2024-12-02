import { render } from "preact";
import App from "./components/App";

render(<App />, document.querySelector("div#app") as Element);
