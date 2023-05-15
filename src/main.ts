import "./tailwind.css";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
window["bootstrap"] = bootstrap;
import App from "./App.svelte";

const app = new App({ target: document.body });

export default app;
