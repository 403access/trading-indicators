# TradeCalendar Component Architecture

The TradeCalendar component has been refactored into smaller, more maintainable components following React best practices. This modular approach improves code reusability, testability, and maintainability.

## Component Structure

### Main Components

#### `TradeCalendar.tsx` - Main Container Component
- **Purpose**: Main orchestrating component that manages state and coordinates child components
- **Responsibilities**:
  - State management (currentDate, selectedDate, sidebar state)
  - Event handling (date clicks, trade selection, navigation)
  - Data aggregation using the custom hook
  - Rendering child components

#### `CalendarHeader.tsx` - Navigation Header
- **Purpose**: Displays the calendar title and month navigation controls
- **Props**:
  - `currentDate: Date` - The currently displayed month/year
  - `onNavigateMonth: (direction: "prev" | "next") => void` - Navigation callback
- **Features**:
  - Month/year display with proper formatting
  - Previous/next month navigation buttons
  - Hover effects and accessibility support

#### `CalendarGrid.tsx` - Calendar Grid Layout
- **Purpose**: Renders the calendar grid with day headers and individual day components
- **Props**:
  - `days: Date[]` - Array of dates to display
  - `currentDate: Date` - Current month for styling context
  - `selectedDate: Date | null` - Currently selected date
  - `tradeDays: Map<string, DayData>` - Trading data by date
  - `onDateClick: (date: Date) => void` - Date selection callback
  - `onKeyDown: (event: React.KeyboardEvent, date: Date) => void` - Keyboard navigation
  - `formatCurrency: (amount: number) => string` - Currency formatting function

#### `CalendarDay.tsx` - Individual Day Cell
- **Purpose**: Renders individual calendar day with trading information
- **Props**:
  - `date: Date` - The date this cell represents
  - `dayData?: DayData` - Trading data for this day (if any)
  - `isCurrentMonth: boolean` - Whether this day is in the current month
  - `isToday: boolean` - Whether this is today's date
  - `isSelected: boolean` - Whether this day is currently selected
  - Event handlers and formatting function
- **Features**:
  - Dynamic styling based on state (selected, today, current month)
  - Trading data display (trade count, PnL, assets)
  - Hover effects and keyboard navigation support

#### `CalendarLegend.tsx` - Visual Legend
- **Purpose**: Static component displaying color coding legend
- **Features**:
  - Visual indicators for selected, today, profitable, and loss days
  - Consistent styling with the main calendar

#### `DayDetails.tsx` - Selected Day Details Panel
- **Purpose**: Shows detailed information for the selected trading day
- **Props**:
  - `selectedDate: Date` - The selected date
  - `dayData: DayData` - Complete trading data for the day
  - `onTradeSelect: (trade: Trade) => void` - Individual trade selection callback
  - `formatCurrency: (amount: number) => string` - Currency formatting
- **Features**:
  - KPI cards showing aggregated metrics
  - Scrollable list of individual trades
  - Click-to-view-details functionality for each trade

### Utility Components

#### `useTradeCalendarData.ts` - Custom Hook
- **Purpose**: Provides utility functions for data processing and formatting
- **Exports**:
  - `groupTradesByDate()` - Groups trades by date with aggregated metrics
  - `getCalendarDays()` - Generates calendar grid dates for a month
  - `formatCurrency()` - Consistent currency formatting

### Type Definitions

#### `DayData` Interface
```typescript
interface DayData {
  trades: Trade[];
  tradeCount: number;
  totalPnL: number;
  spotTrades: number;
  marginTrades: number;
  assets: Set<string>;
}
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Each component has a single responsibility
- UI logic separated from business logic
- Data processing isolated in custom hook

### 2. **Reusability**
- Individual components can be used independently
- Easy to create variations (e.g., different calendar layouts)
- Components can be exported and used in other parts of the application

### 3. **Testability**
- Each component can be unit tested independently
- Props-based components are easy to test with different data scenarios
- Custom hook can be tested separately from UI components

### 4. **Maintainability**
- Smaller files are easier to understand and modify
- Clear component boundaries make debugging easier
- Changes to one component don't affect others

### 5. **Performance**
- React can optimize re-renders more effectively with smaller components
- Only components that actually change need to re-render
- Easier to implement React.memo optimizations if needed

## Usage Example

```tsx
import { TradeCalendar } from './components/performance';
import type { Trade } from '#/packages/kraken';

function MyApp() {
  const trades: Trade[] = []; // Your trade data
  
  return (
    <TradeCalendar trades={trades} />
  );
}
```

## File Structure

```
src/apps/frontend/components/performance/
├── TradeCalendar.tsx          # Main container component
├── CalendarHeader.tsx         # Navigation header
├── CalendarGrid.tsx           # Calendar grid layout
├── CalendarDay.tsx            # Individual day cell
├── CalendarLegend.tsx         # Visual legend
├── DayDetails.tsx             # Selected day details
├── useTradeCalendarData.ts    # Custom hook for data processing
└── index.ts                   # Export file
```

## Integration

The refactored TradeCalendar maintains the same external API as before:
- Same props interface (`trades: Trade[]`)
- Same functionality (sidebar integration, day selection, trade details)
- Same styling and user experience

The component can be imported and used exactly as before, but now benefits from improved maintainability and modularity.
