import { device, expect, element, by, waitFor } from 'detox';

describe('Add Students to Classes Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should allow teacher to navigate to add students screen', async () => {
    // Wait for app to load
    await waitFor(element(by.id('app-root')))
      .toBeVisible()
      .withTimeout(10000);

    // Navigate to login if not authenticated
    const loginButton = element(by.id('login-button'));
    try {
      await expect(loginButton).toBeVisible();
      // Perform login flow here
      await element(by.id('email-input')).typeText('teacher@example.com');
      await element(by.id('password-input')).typeText('password123');
      await loginButton.tap();
    } catch (error) {
      // Already logged in, continue
    }

    // Wait for dashboard to load
    await waitFor(element(by.id('teacher-dashboard')))
      .toBeVisible()
      .withTimeout(5000);

    // Navigate to classes
    await element(by.id('classes-tab')).tap();
    
    // Select a class
    await element(by.id('class-item-0')).tap();
    
    // Navigate to add students
    await element(by.id('add-students-button')).tap();
    
    // Verify add students screen is visible
    await expect(element(by.id('add-students-screen'))).toBeVisible();
  });

  it('should display available students list', async () => {
    // Navigate to add students screen (assuming we're already there)
    await waitFor(element(by.id('add-students-screen')))
      .toBeVisible()
      .withTimeout(5000);

    // Check if students list is visible
    await expect(element(by.id('available-students-list'))).toBeVisible();
    
    // Check if at least one student is displayed
    await expect(element(by.id('student-item-0'))).toBeVisible();
  });

  it('should allow selecting and adding students to class', async () => {
    // Navigate to add students screen
    await waitFor(element(by.id('add-students-screen')))
      .toBeVisible()
      .withTimeout(5000);

    // Select first student
    await element(by.id('student-checkbox-0')).tap();
    
    // Verify student is selected
    await expect(element(by.id('student-checkbox-0'))).toHaveToggleValue(true);
    
    // Tap add selected students button
    await element(by.id('add-selected-students-button')).tap();
    
    // Wait for success message or navigation
    await waitFor(element(by.id('success-message')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('should handle bulk student selection', async () => {
    await waitFor(element(by.id('add-students-screen')))
      .toBeVisible()
      .withTimeout(5000);

    // Use select all functionality
    await element(by.id('select-all-checkbox')).tap();
    
    // Verify multiple students are selected
    await expect(element(by.id('selected-count-text'))).toHaveText('Selected: 5');
    
    // Deselect all
    await element(by.id('select-all-checkbox')).tap();
    
    // Verify no students are selected
    await expect(element(by.id('selected-count-text'))).toHaveText('Selected: 0');
  });

  it('should filter students by search term', async () => {
    await waitFor(element(by.id('add-students-screen')))
      .toBeVisible()
      .withTimeout(5000);

    // Type in search input
    await element(by.id('student-search-input')).typeText('John');
    
    // Wait for filtered results
    await waitFor(element(by.id('student-item-0')))
      .toBeVisible()
      .withTimeout(2000);
    
    // Verify search results contain the search term
    await expect(element(by.id('student-name-0'))).toHaveText('John Doe');
  });
});
