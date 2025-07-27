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
});