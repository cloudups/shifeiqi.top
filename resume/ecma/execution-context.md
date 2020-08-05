```typescript
interface LexicalEnvironment {
    envRecord: EnvironmentRecord
    outer: LexicalEnvironment
}

interface ExecutionContext {
    lexEnv: LexicalEnvironment
    varEnv: LexicalEnvironment
}

```