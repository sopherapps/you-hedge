import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event"
import NotFoundPage from './NotFound.page';
import { render } from '../mocks/router';
import { Routes, Route } from 'react-router-dom';

test('renders Not found', () => {
    render(<NotFoundPage />);
    const notFoundTextElement = screen.getByText(/not found/i);
    expect(notFoundTextElement).toBeInTheDocument();
});

test('renders link to Home', async () => {
    render(
        <Routes>
            <Route path="/" element={<div>I am home</div>} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>,
        { route: "/lost-again" });

    const linkToHome = screen.getByText(/go back home/i);
    expect(linkToHome).toBeInTheDocument();

    userEvent.click(linkToHome);
    const introText = await screen.findByText(/I am home/i);
    expect(introText).toBeInTheDocument();
});