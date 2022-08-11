import { render as tlRender } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

/**
 * This is a helper wrapper for wrapping aroung the router
 * @param ui - the ui to render
 * @param param1 - the route to display
 * @returns - the render result
 */
export const render = (ui: any, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return tlRender(ui, { wrapper: BrowserRouter });
}