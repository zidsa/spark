import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const importSdk = vi.fn();
const initialize = vi.fn();
let resolveSdk: () => void;
let rejectSdk: (error: Error) => void;

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv('VITE_POSTHOG_KEY', '');
  vi.stubGlobal('reportError', vi.fn());
  const ready = new Promise<void>((resolve, reject) => {
    resolveSdk = resolve;
    rejectSdk = reject;
  });
  vi.doMock('posthog-js', async () => {
    importSdk();
    await ready;
    return { default: { init: initialize } };
  });
});

afterEach(() => {
  cleanup();
  vi.doUnmock('posthog-js');
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it('renders without loading analytics when disabled or rendering on the server', async () => {
  const { PostHogProvider } = await import('~/integrations/posthog/provider');
  render(<PostHogProvider>App content</PostHogProvider>);
  expect(screen.getByText('App content')).toBeVisible();
  vi.stubEnv('VITE_POSTHOG_KEY', 'test-key');
  expect(renderToString(<PostHogProvider>Server content</PostHogProvider>)).toContain(
    'Server content',
  );
  expect(importSdk).not.toHaveBeenCalled();
});

it('keeps the app interactive and preserves state while analytics loads', async () => {
  vi.stubEnv('VITE_POSTHOG_KEY', 'test-key');
  const { PostHogProvider, usePostHog } = await import('~/integrations/posthog/provider');
  function Form() {
    const [value, setValue] = useState('');
    const posthog = usePostHog();
    return (
      <>
        <input aria-label="Draft" value={value} onChange={event => setValue(event.target.value)} />
        <span>{posthog ? 'Analytics ready' : 'Analytics loading'}</span>
      </>
    );
  }
  render(
    <PostHogProvider>
      <Form />
    </PostHogProvider>,
  );
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Keep my draft' } });
  expect(screen.getByText('Analytics loading')).toBeVisible();
  await waitFor(() => expect(importSdk).toHaveBeenCalledOnce());
  await act(async () => resolveSdk());
  expect(await screen.findByText('Analytics ready')).toBeVisible();
  expect(screen.getByRole('textbox')).toHaveValue('Keep my draft');
  expect(initialize).toHaveBeenCalledExactlyOnceWith(
    'test-key',
    expect.objectContaining({
      capture_pageview: false,
      person_profiles: 'identified_only',
    }),
  );
});

it('reports SDK loading failures while keeping the app visible', async () => {
  vi.stubEnv('VITE_POSTHOG_KEY', 'test-key');
  const { PostHogProvider } = await import('~/integrations/posthog/provider');
  render(<PostHogProvider>App content</PostHogProvider>);
  await waitFor(() => expect(importSdk).toHaveBeenCalledOnce());
  await act(async () => rejectSdk(new Error('SDK unavailable')));
  await waitFor(() => expect(reportError).toHaveBeenCalledOnce());
  expect(screen.getByText('App content')).toBeVisible();
  expect(initialize).not.toHaveBeenCalled();
});

it('does not initialize analytics after the provider unmounts', async () => {
  vi.stubEnv('VITE_POSTHOG_KEY', 'test-key');
  const { PostHogProvider } = await import('~/integrations/posthog/provider');
  const { unmount } = render(<PostHogProvider>App content</PostHogProvider>);
  await waitFor(() => expect(importSdk).toHaveBeenCalledOnce());
  unmount();
  await act(async () => resolveSdk());
  expect(initialize).not.toHaveBeenCalled();
});
