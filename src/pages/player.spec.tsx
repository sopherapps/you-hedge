import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { render } from "../mocks/router";
import PlayerPage from "./player.page";

test("renders youtube video of given videoId", () => {
    const videoId = "liJVSwOiiwg";
    const youtubeUrl = new RegExp(`https://www.youtube.com/embed/${videoId}`);

    render(
        (<Routes>
            <Route path="/player/:videoId" element={<PlayerPage />} />
        </Routes>),
        { routesReplay: [`/player/${videoId}`] }
    );

    const youtubeIframe = screen.getByTestId("youtube-iframe");

    expect(youtubeIframe).toBeInTheDocument();
    expect(youtubeIframe.tagName).toBe("IFRAME");
    expect(youtubeIframe.getAttribute("src")).toMatch(youtubeUrl);
}, 3000);

test("renders title passed in query params", () => {
    const videoId = "liJVSwOiiwg";
    const title = "Foo bar";

    render(
        (<Routes>
            <Route path="/player/:videoId" element={<PlayerPage />} />
        </Routes>),
        { routesReplay: [`/player/${videoId}?title=${title}`] }
    );

    const element = screen.getByTitle(title);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe("IFRAME");
}, 3000);

test("renders back button that goes back", async () => {
    const videoId = "liJVSwOiiwg";

    render(
        (<Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/player/:videoId" element={<PlayerPage />} />
        </Routes>),
        { routesReplay: ["/?channelId=op", `/player/${videoId}`] }
    );

    const element = screen.getByText(/back/i);
    userEvent.click(element);

    const homeElement = await screen.findByText(/home/i);
    expect(homeElement).toBeInTheDocument();
}, 3000);

test("renders back button that goes back even if previous had no search params", async () => {
    const videoId = "liJVSwOiiwg";

    render(
        (<Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/player/:videoId" element={<PlayerPage />} />
        </Routes>),
        { routesReplay: ["/", `/player/${videoId}`] }
    );

    const element = screen.getByText(/back/i);
    userEvent.click(element);

    const homeElement = await screen.findByText(/home/i);
    expect(homeElement).toBeInTheDocument();
}, 3000);