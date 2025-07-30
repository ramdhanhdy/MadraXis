import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { NavigationHistoryProvider, useNavigationHistory, useRouteTracking } from '../NavigationHistoryContext';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('NavigationHistoryContext', () => {
  it('should provide shared navigation history state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
    );

    const { result } = renderHook(() => useNavigationHistory(), { wrapper });

    expect(result.current.history).toEqual([]);
    expect(result.current.currentIndex).toBe(-1);
    expect(result.current.canGoBack).toBe(false);
    expect(result.current.canGoForward).toBe(false);
  });

  it('should add navigation entries to shared history', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
    );

    const { result } = renderHook(() => useNavigationHistory(), { wrapper });

    act(() => {
      result.current.addToHistory('/test', { id: 1 }, 'Test Route');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toEqual(
      expect.objectContaining({
        path: '/test',
        params: { id: 1 },
        label: 'Test Route',
      })
    );
    expect(result.current.currentIndex).toBe(0);
  });

  it('should maintain shared state across multiple hook instances', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
    );

    const { result: result1 } = renderHook(() => useNavigationHistory(), { wrapper });
    const { result: result2 } = renderHook(() => useNavigationHistory(), { wrapper });

    act(() => {
      result1.current.addToHistory('/test1');
      result2.current.addToHistory('/test2');
    });

    expect(result1.current.history).toEqual(result2.current.history);
    expect(result1.current.history).toHaveLength(2);
  });

  it('should clear navigation history', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
    );

    const { result } = renderHook(() => useNavigationHistory(), { wrapper });

    act(() => {
      result.current.addToHistory('/test1');
      result.current.addToHistory('/test2');
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(result.current.currentIndex).toBe(-1);
  });

  it('should adjust currentIndex when history exceeds maxHistorySize', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationHistoryProvider maxHistorySize={3}>{children}</NavigationHistoryProvider>
    );

    const { result } = renderHook(() => useNavigationHistory(), { wrapper });

    act(() => {
      result.current.addToHistory('/page1');
      result.current.addToHistory('/page2');
      result.current.addToHistory('/page3');
      // This should cause the first item to be removed
      result.current.addToHistory('/page4');
    });

    expect(result.current.history).toHaveLength(3);
    expect(result.current.history[0].path).toBe('/page2');
    expect(result.current.history[1].path).toBe('/page3');
    expect(result.current.history[2].path).toBe('/page4');
    expect(result.current.currentIndex).toBe(2);
  });

  it('should handle navigation back and forward', () => {
    const mockPush = jest.fn();
    jest.doMock('expo-router', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
    );

    const { result } = renderHook(() => useNavigationHistory(), { wrapper });

    act(() => {
      result.current.addToHistory('/page1');
      result.current.addToHistory('/page2');
      result.current.addToHistory('/page3');
    });

    expect(result.current.canGoBack).toBe(true);
    expect(result.current.canGoForward).toBe(false);

    act(() => {
      result.current.goBack();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.canGoBack).toBe(true);
    expect(result.current.canGoForward).toBe(true);

    act(() => {
      result.current.goForward();
    });

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.canGoBack).toBe(true);
    expect(result.current.canGoForward).toBe(false);
  });

  it('should provide breadcrumb items', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
    );

    const { result } = renderHook(() => useNavigationHistory(), { wrapper });

    act(() => {
      result.current.addToHistory('/page1', {}, 'Page 1');
      result.current.addToHistory('/page2', {}, 'Page 2');
      result.current.addToHistory('/page3', {}, 'Page 3');
    });

    const breadcrumbs = result.current.getBreadcrumbItems();
    expect(breadcrumbs).toHaveLength(3);
    expect(breadcrumbs[0].label).toBe('Page 1');
    expect(breadcrumbs[1].label).toBe('Page 2');
    expect(breadcrumbs[2].label).toBe('Page 3');
  });

  it('should navigate to specific history item', () => {
    const mockPush = jest.fn();
    jest.doMock('expo-router', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
    );

    const { result } = renderHook(() => useNavigationHistory(), { wrapper });

    act(() => {
      result.current.addToHistory('/page1');
      result.current.addToHistory('/page2');
      result.current.addToHistory('/page3');
    });

    act(() => {
      result.current.navigateToHistoryItem(1);
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      renderHook(() => useNavigationHistory());
    }).toThrow('useNavigationHistory must be used within a NavigationHistoryProvider');
    
    consoleSpy.mockRestore();
  });

  describe('useRouteTracking', () => {
    it('should add route to history when component mounts', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <NavigationHistoryProvider>{children}</NavigationHistoryProvider>
      );

      const { result: historyResult } = renderHook(() => useNavigationHistory(), { wrapper });
      
      renderHook(() => useRouteTracking('/test-route', 'Test Route'), { wrapper });

      expect(historyResult.current.history).toHaveLength(1);
      expect(historyResult.current.history[0].path).toBe('/test-route');
      expect(historyResult.current.history[0].label).toBe('Test Route');
    });
  });
});
