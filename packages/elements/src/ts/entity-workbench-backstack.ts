export class BackStack<T> {
  private readonly entries: T[] = [];

  push(entry: T): void {
    this.entries.push(entry);
  }

  pop(): T | undefined {
    return this.entries.pop();
  }

  canGoBack(): boolean {
    return this.entries.length > 0;
  }

  depth(): number {
    return this.entries.length;
  }

  path(): readonly T[] {
    return this.entries;
  }
}
