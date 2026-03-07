# Q-State

A lightweight React state management engine using `useSyncExternalStore` with optional localStorage caching and value transformation.

# small issue

Hey i have an isssue, when you use nextjs with this library, just copy the engine code in the q-state file
because this library had hydration issue, after you copy it, use it inside your src file, so this library can work
well in nextjs, im sorry for that...

# Github link

Here my open source github link, lets colaborate and grow together!
https://github.com/ammaar-engineer/Q-State

## Installation

```bash
npm install @quanta-lib/q-state
```
```typescript
## Features

- **Type-safe state management** - Full TypeScript support with generic types
- **useSyncExternalStore** - Uses React's built-in concurrent-safe subscription mechanism
- **Value transformation** - Transform values during updates with custom transformer functions
- **LocalStorage caching** - Persist state to localStorage with optional caching
- **Lightweight** - Minimal dependencies, no context providers needed

## Usage

### Basic Usage

```typescript
import { Q_StateEngine } from "@q-state/core"

const qstate = new Q_StateEngine({
  count: 0,
  name: 'Amarix'
})

export function App() {
  const [count] = qstate.useQuantaState('count')
  const [name] = qstate.useQuantaState('name')

  return (
    <>
      <h1>Counter App</h1>
      <p>Name: {name}</p>
      <p>Count: {count}</p>
      <button onClick={() => qstate.updateValue('count', (prev) => prev + 1)}>
        Increment
      </button>
    </>
  )
}
```

### With Value Transformer

Transform values automatically when updating state:

```typescript
const qstate = new Q_StateEngine({
  name: 'Amarix'
}, {
  // Transformer function runs after updateValue
  name: (raw) => {
    console.log(raw) // Logs the new value
    return raw.toUpperCase() // Transform to uppercase
  }
})

// When updating name, the transformer will be applied
qstate.updateValue('name', () => 'hello') // Stores 'HELLO'
```

### With LocalStorage Caching

Enable caching to persist state across page reloads:

```typescript
const qstate = new Q_StateEngine({
  count: 0,
  name: 'Amarix'
}, {
  name: (raw) => console.log(raw)
}, {
  cache: true // Enable localStorage caching
})
```

### Nested Updates

You can update multiple state values in a single update function:

```typescript
<button onClick={() => qstate.updateValue('name', () => {
  qstate.updateValue('count', () => 5) // Nested update
  return 'helo :3'
})}>
  Update Name
</button>
```

## API

### Constructor

```typescript
new Q_StateEngine<T, O>(state: T, transformer?: O, option?: OptionRecord)
```

- **state** (T): Initial state object with type safety
- **transformer** (O, optional): Record of transformer functions for specific keys
- **option** (OptionRecord, optional): Configuration options
  - `cache`: Enable localStorage caching (default: false)

### Methods

#### `updateValue(key, func)`

Updates a state value using an updater function.

```typescript
qstate.updateValue('count', (prev) => prev + 1)
```

- **key**: The state key to update
- **func**: Updater function that receives the current value and returns the new value

#### `useQuantaState(key)`

React hook for subscribing to state changes.

```typescript
const [value] = qstate.useQuantaState('key')
```

Returns a tuple with the current value. The component re-renders when the specified key changes.

## TypeScript

The library provides full type safety:

```typescript
interface AppState {
  count: number
  name: string
  items: string[]
}

const qstate = new Q_StateEngine<AppState>({
  count: 0,
  name: '',
  items: []
})

// Type-safe updates
qstate.updateValue('count', (prev) => prev + 1) // ✓
qstate.updateValue('name', () => 'Hello')      // ✓
qstate.updateValue('items', (prev) => [...prev, 'new']) // ✓
```

## How It Works

1. **State Storage**: State is stored in a private object within the Q_StateEngine instance
2. **Subscription**: Uses React's `useSyncExternalStore` for concurrent-safe subscriptions
3. **Updates**: When `updateValue` is called, it:
   - Executes the updater function with the current value
   - Runs the transformer function (if defined)
   - Updates the internal state
   - Persists to localStorage (if caching enabled)
   - Notifies all subscribers
4. **Caching**: On initial render, checks localStorage for cached values and hydrates state

## License

MIT
