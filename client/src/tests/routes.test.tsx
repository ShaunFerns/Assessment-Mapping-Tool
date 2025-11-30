import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../lib/store';
import Home from '../pages/Home';
import ProgrammeForm from '../pages/ProgrammeForm';
import Modules from '../pages/Modules';
import Assessments from '../pages/Assessments';
import Visualisations from '../pages/Visualisations';
import { Route, Switch } from 'wouter';

// Mock wouter to avoid routing issues in tests
vi.mock('wouter', async () => {
  const actual = await vi.importActual('wouter');
  return {
    ...actual,
    useLocation: () => ['/', vi.fn()],
    Link: ({ children, href }: any) => <a href={href}>{children}</a>,
  };
});

// Mock responsive container to avoid resize observer errors
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div className="recharts-responsive-container" style={{ width: 800, height: 800 }}>{children}</div>,
  };
});

// Wrapper for context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>
    {children}
  </AppProvider>
);

describe('Route Smoke Tests', () => {
  it('renders Home page without crashing', () => {
    render(<Home />, { wrapper: TestWrapper });
    expect(screen.getByText(/Assessment Mapping/i)).toBeInTheDocument();
  });

  it('renders Programme page without crashing', () => {
    render(<ProgrammeForm />, { wrapper: TestWrapper });
    expect(screen.getByText(/Programme Details/i)).toBeInTheDocument();
  });

  it('renders Modules page without crashing', () => {
    render(<Modules />, { wrapper: TestWrapper });
    expect(screen.getAllByText(/Add Module/i)[0]).toBeInTheDocument();
  });

  it('renders Assessments page without crashing', () => {
    render(<Assessments />, { wrapper: TestWrapper });
    // It might show "Please add modules first" if store is empty, or "Add Assessment" if seeded
    // The default store has seeded modules, so we expect "Add Assessment"
    expect(screen.getAllByText(/Add Assessment/i)[0]).toBeInTheDocument();
  });

  it('renders Visualisations page without crashing', () => {
    render(<Visualisations />, { wrapper: TestWrapper });
    expect(screen.getByText(/Programme Visualisations/i)).toBeInTheDocument();
  });
});
