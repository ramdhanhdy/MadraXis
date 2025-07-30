import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@lib/tests';
import StudentDashboard from '@app/(student)/dashboard/screen';

describe('Student Dashboard Screen', () => {
  it('should display the student dashboard with all components', async () => {
    renderWithProviders(<Dashboard />);

    // Check if the main components are rendered
    expect(screen.getByText(/Welcome/i)).toBeVisible();
    expect(screen.getByText(/Quran Progress/i)).toBeVisible();
    expect(screen.getByText(/Class Schedule/i)).toBeVisible();
    expect(screen.getByText(/Incident Reports/i)).toBeVisible();
  });

  it('should navigate to the Quran Progress screen when the button is pressed', async () => {
    const { getByText } = renderWithProviders(<Dashboard />);
    const quranProgressButton = getByText(/View Details/i);
    fireEvent.press(quranProgressButton);
    // Add assertions to check if the navigation was successful
  });
});
